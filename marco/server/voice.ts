// Agent vocal de Marco : appelle le restaurant pour réserver à la place du client (via Vapi, https://vapi.ai).
//
//   GET  /api/appel            → { enabled, auto } : l'appel automatique est-il configuré ?
//   POST /api/appel            → lance l'appel pour une réservation, renvoie { callId, scheduledFor? }
//   GET  /api/appel?id=<call>  → état de l'appel et résultat (table confirmée, complet, autre créneau…)
//
// Variables d'environnement :
//   VAPI_API_KEY           clé privée Vapi (tableau de bord Vapi › API Keys)
//   VAPI_PHONE_NUMBER_ID   numéro français importé dans Vapi (Twilio, Vonage ou Telnyx) qui passe les appels
//   GOOGLE_MAPS_API_KEY    pour trouver le numéro officiel du restaurant (Google Places)
//   MARCO_AUTO_CALL=1      l'appel part dès que le client confirme la carte de réservation
//   MARCO_ADMIN_TOKEN      sinon, seuls les éditeurs qui ont ce code peuvent lancer un appel
//   VAPI_MODEL, VAPI_VOICE (JSON), facultatifs : modèle et voix de l'agent

const VAPI = "https://api.vapi.ai";

export interface CallRequest {
  place: string;
  address?: string;
  date: string; // AAAA-MM-JJ
  time: string; // HH:MM
  people: number;
  name: string;
  phone: string;
  note?: string;
}

export type CallOutcome = "en_cours" | "confirmee" | "alternative" | "complet" | "pas_de_reponse" | "a_rappeler" | "echec";

type Res = { status: number; body: unknown };

const enabled = () => Boolean(process.env.VAPI_API_KEY && process.env.VAPI_PHONE_NUMBER_ID);
const auto = () => enabled() && process.env.MARCO_AUTO_CALL === "1";

// Garde-fous contre les abus (par instance du serveur ; brancher un vrai limiteur en production).
const recent = new Map<string, number>();
let windowStart = Date.now();
let callsInWindow = 0;
const MAX_CALLS_PER_HOUR = Number(process.env.MARCO_MAX_CALLS_PER_HOUR) || 20;

export async function handleVoice(method: string, search: URLSearchParams, raw: string, adminToken?: string): Promise<Res> {
  if (method === "GET" && !search.get("id")) return { status: 200, body: { enabled: enabled(), auto: auto() } };
  if (!enabled()) return { status: 503, body: { error: "not_configured" } };

  if (method === "GET") return callStatus(search.get("id")!);
  if (method !== "POST") return { status: 405, body: { error: "method" } };

  const isAdmin = Boolean(process.env.MARCO_ADMIN_TOKEN) && adminToken === process.env.MARCO_ADMIN_TOKEN;
  if (!auto() && !isAdmin) return { status: 403, body: { error: "forbidden" } };

  let r: CallRequest;
  try {
    r = validate(JSON.parse(raw || "{}"));
  } catch (e) {
    return { status: 400, body: { error: (e as Error).message } };
  }

  if (Date.now() - windowStart > 3600_000) (windowStart = Date.now()), (callsInWindow = 0);
  if (callsInWindow >= MAX_CALLS_PER_HOUR) return { status: 429, body: { error: "rate_limited" } };
  const key = `${r.place}|${r.date}|${r.time}|${r.phone}`.toLowerCase();
  if ((recent.get(key) ?? 0) > Date.now() - 6 * 3600_000) return { status: 409, body: { error: "already_called" } };

  // Le numéro vient toujours de la fiche officielle du lieu : jamais d'un numéro saisi par le client.
  const restaurantPhone = await findPhone(r.place, r.address);
  if (!restaurantPhone) return { status: 404, body: { error: "phone_not_found" } };

  const scheduledFor = nextCallWindow();
  const payload = {
    phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,
    customer: { number: restaurantPhone, name: r.place.slice(0, 40) },
    assistant: assistantFor(r),
    ...(scheduledFor ? { schedulePlan: { earliestAt: scheduledFor } } : {}),
  };
  try {
    const res = await fetch(`${VAPI}/call`, {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.VAPI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json().catch(() => ({}))) as { id?: string; message?: unknown };
    if (!res.ok || !data.id) {
      console.error("[voice] création refusée", res.status, data.message);
      return { status: 502, body: { error: "provider_error" } };
    }
    recent.set(key, Date.now());
    callsInWindow++;
    return { status: 200, body: { callId: data.id, scheduledFor } };
  } catch (err) {
    console.error("[voice]", err);
    return { status: 502, body: { error: "provider_unreachable" } };
  }
}

function validate(x: Partial<CallRequest>): CallRequest {
  const s = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const r: CallRequest = {
    place: s(x.place, 100),
    address: s(x.address, 160) || undefined,
    date: s(x.date, 10),
    time: s(x.time, 5),
    people: Math.round(Number(x.people)),
    name: s(x.name, 60),
    phone: s(x.phone, 25),
    note: s(x.note, 200) || undefined,
  };
  if (!r.place) throw new Error("place");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(r.date) || !/^\d{2}:\d{2}$/.test(r.time)) throw new Error("date");
  const when = new Date(`${r.date}T${r.time}:00`);
  if (!(when.getTime() > Date.now() - 3600_000) || when.getTime() > Date.now() + 90 * 86400_000) throw new Error("date");
  if (!(r.people >= 1 && r.people <= 20)) throw new Error("people");
  if (r.name.length < 2) throw new Error("name");
  if (r.phone.replace(/\D/g, "").length < 9) throw new Error("phone");
  return r;
}

/** Pays des villes de Marco : indicatif accepté (hors numéros surtaxés), fuseau, langue de l'appel. */
export const CALL_COUNTRY: Record<string, { cc: RegExp; tz: string; lang: string; langName: string; voice: string; city: string; lat: number; lng: number }> = {
  paris: { cc: /^\+33[1-79]\d{8}$/, tz: "Europe/Paris", lang: "fr", langName: "français", voice: "fr-FR-DeniseNeural", city: "Paris", lat: 48.8566, lng: 2.3522 },
  madrid: { cc: /^\+34[6-9]\d{8}$/, tz: "Europe/Madrid", lang: "es", langName: "espagnol", voice: "es-ES-ElviraNeural", city: "Madrid", lat: 40.4168, lng: -3.7038 },
  barcelone: { cc: /^\+34[6-9]\d{8}$/, tz: "Europe/Madrid", lang: "es", langName: "espagnol", voice: "es-ES-ElviraNeural", city: "Barcelona", lat: 41.387, lng: 2.17 },
  londres: { cc: /^\+44(?!9)[1-8]\d{8,9}$/, tz: "Europe/London", lang: "en", langName: "anglais", voice: "en-GB-SoniaNeural", city: "London", lat: 51.5072, lng: -0.1276 },
  lisbonne: { cc: /^\+351[29]\d{8}$/, tz: "Europe/Lisbon", lang: "pt", langName: "portugais", voice: "pt-PT-RaquelNeural", city: "Lisboa", lat: 38.7223, lng: -9.1393 },
  rome: { cc: /^\+39(?!89)[03]\d{6,10}$/, tz: "Europe/Rome", lang: "it", langName: "italien", voice: "it-IT-ElsaNeural", city: "Roma", lat: 41.9028, lng: 12.4964 },
  amsterdam: { cc: /^\+31(?!90)[1-9]\d{8}$/, tz: "Europe/Amsterdam", lang: "nl", langName: "néerlandais", voice: "nl-NL-ColetteNeural", city: "Amsterdam", lat: 52.3676, lng: 4.9041 },
  "new-york": { cc: /^\+1(?!900)[2-9]\d{9}$/, tz: "America/New_York", lang: "en-US", langName: "anglais", voice: "en-US-JennyNeural", city: "New York", lat: 40.7128, lng: -74.006 },
  berlin: { cc: /^\+49(?!900)[1-9]\d{6,11}$/, tz: "Europe/Berlin", lang: "de", langName: "allemand", voice: "de-DE-KatjaNeural", city: "Berlin", lat: 52.52, lng: 13.405 },
};

/** Numéro officiel du lieu via Google Places, limité au pays de la ville et aux numéros non surtaxés. */
export async function findPhone(place: string, address?: string, cityId = "paris"): Promise<string | null> {
  const c = CALL_COUNTRY[cityId] ?? CALL_COUNTRY.paris;
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) return null;
  try {
    const find = new URL("https://maps.googleapis.com/maps/api/place/findplacefromtext/json");
    find.search = new URLSearchParams({ input: `${place}, ${address ?? c.city}`, inputtype: "textquery", fields: "place_id", locationbias: `circle:15000@${c.lat},${c.lng}`, key }).toString();
    const placeId = ((await (await fetch(find)).json()) as { candidates?: { place_id: string }[] }).candidates?.[0]?.place_id;
    if (!placeId) return null;
    const details = new URL("https://maps.googleapis.com/maps/api/place/details/json");
    details.search = new URLSearchParams({ place_id: placeId, fields: "international_phone_number", key }).toString();
    const phone = ((await (await fetch(details)).json()) as { result?: { international_phone_number?: string } }).result?.international_phone_number;
    const e164 = phone?.replace(/[^\d+]/g, "");
    // seulement les numéros du pays de la ville, jamais les numéros spéciaux souvent surtaxés
    return e164 && c.cc.test(e164) ? e164 : null;
  } catch (err) {
    console.error("[voice] Places", err);
    return null;
  }
}

/** On n'appelle un restaurant qu'entre 10 h et 22 h (heure de Paris) ; sinon l'appel est programmé au lendemain 10 h. */
export function nextCallWindow(now = new Date(), timeZone = "Europe/Paris"): string | undefined {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", timeZoneName: "shortOffset" })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  );
  const hour = Number(parts.hour);
  if (hour >= 10 && hour < 22) return undefined;
  const offset = /GMT([+-]\d+)/.exec(parts.timeZoneName)?.[1] ?? "+1";
  const day = new Date(`${parts.year}-${parts.month}-${parts.day}T10:00:00${offset.startsWith("-") ? "-" : "+"}${offset.replace(/[+-]/, "").padStart(2, "0")}:00`);
  if (hour >= 22) day.setUTCDate(day.getUTCDate() + 1);
  return day.toISOString();
}

export function assistantFor(r: CallRequest, cityId = "paris", kind: "table" | "activite" | "hotel" = "table") {
  const c = CALL_COUNTRY[cityId] ?? CALL_COUNTRY.paris;
  const what = kind === "hotel" ? "une chambre" : kind === "activite" ? "une place (activité, cours ou visite)" : "une table";
  const when = new Date(`${r.date}T12:00:00`).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  const hour = r.time.replace(":", " heures ").replace(/ 00$/, "");
  const system = `Tu es l'assistant vocal de Marco, une application de conseils sur Paris. Tu téléphones à « ${r.place} » pour réserver ${what} au nom d'un client. Tu parles ${c.langName} (la langue du lieu), poliment, simplement, avec des phrases courtes, comme un client habitué au téléphone.

La réservation demandée :
- Nom : ${r.name}
- Date : ${when} (${r.date})
- Heure : ${hour}
- Nombre de personnes : ${r.people}
- Téléphone du client, à donner seulement si le restaurant le demande : ${r.phone}${r.note ? `\n- Précision du client : ${r.note}` : ""}

Déroulé :
1. Présente-toi honnêtement dès ta première phrase : tu es l'assistant vocal automatique de Marco et tu appelles pour réserver au nom de ${r.name}. Si on te demande si tu es un robot ou une IA, réponds oui sans détour.
2. Donne la date, l'heure et le nombre de personnes, puis attends la réponse.
3. Si c'est possible : fais répéter ou confirme clairement le nom, la date, l'heure et le nombre de personnes, remercie et raccroche.
4. Si l'heure exacte n'est pas possible : demande le créneau libre le plus proche le même jour. Accepte-le seulement s'il est à 30 minutes ou moins de l'heure demandée ; sinon, ne réserve pas, note le créneau proposé, remercie et dis que le client rappellera.
5. Si c'est complet, remercie et raccroche.
6. Ne donne jamais de numéro de carte bancaire ni d'autre information personnelle que le nom et le téléphone ci-dessus. Si on exige une carte, un acompte ou un e-mail, ne réserve pas : dis que le client rappellera lui-même.
7. Si tu tombes sur une messagerie ou un serveur vocal sans possibilité de parler à quelqu'un, raccroche sans laisser de message.
8. Ne change jamais la réservation (autre jour, plus de personnes…) et ne commande rien. N'invente aucune information.
Quand la conversation est terminée, utilise l'outil endCall.`;

  return {
    name: "Marco reservation",
    firstMessage: c.lang === "fr" ? `Bonjour ! Je suis l'assistant vocal de l'application Marco, j'appelle pour réserver ${what} au nom de ${r.name}, s'il vous plaît.` : undefined,
    firstMessageMode: c.lang === "fr" ? "assistant-waits-for-user" : "assistant-speaks-first-with-model-generated-message",
    endCallMessage: c.lang === "fr" ? "Merci beaucoup, bonne journée !" : undefined,
    maxDurationSeconds: 300,
    model: {
      provider: "anthropic",
      model: process.env.VAPI_MODEL || "claude-sonnet-5",
      messages: [{ role: "system", content: system }],
      tools: [{ type: "endCall" }],
    },
    voice: (c.lang === "fr" && parseVoice(process.env.VAPI_VOICE)) || { provider: "azure", voiceId: c.voice },
    transcriber: { provider: "deepgram", model: "nova-2", language: c.lang },
    voicemailDetection: { provider: "vapi" },
    analysisPlan: {
      summaryPrompt: "Résume l'appel en une ou deux phrases en français, du point de vue du client : la table est-elle réservée, à quelle heure, et y a-t-il une condition particulière ?",
      structuredDataPrompt: "Tu reçois la transcription d'un appel de réservation passé à un restaurant. Extrais le résultat selon le schéma JSON.",
      structuredDataSchema: {
        type: "object",
        properties: {
          resultat: {
            type: "string",
            enum: ["confirmee", "alternative", "complet", "pas_de_reponse", "a_rappeler"],
            description: "confirmee : table réservée à l'heure demandée ; alternative : table réservée à un autre horaire proche ; complet : aucune table ; pas_de_reponse : messagerie, pas de décroché ou personne pour réserver ; a_rappeler : le restaurant exige une carte, un acompte, ou le client doit rappeler.",
          },
          heure_reservee: { type: "string", description: "Heure réellement réservée (HH:MM), vide sinon." },
          creneau_propose: { type: "string", description: "Créneau proposé mais non réservé, vide sinon." },
          condition: { type: "string", description: "Condition donnée par le restaurant (table rendue à 22 h, terrasse, etc.), vide sinon." },
        },
        required: ["resultat"],
      },
    },
  };
}

function parseVoice(v?: string) {
  try {
    return v ? (JSON.parse(v) as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/** Traduit l'état d'un appel Vapi en résultat compréhensible pour le client. */
async function callStatus(id: string): Promise<Res> {
  if (!/^[\w-]{8,64}$/.test(id)) return { status: 400, body: { error: "id" } };
  try {
    const res = await fetch(`${VAPI}/call/${id}`, { headers: { Authorization: `Bearer ${process.env.VAPI_API_KEY}` } });
    if (!res.ok) return { status: res.status === 404 ? 404 : 502, body: { error: "provider_error" } };
    const call = (await res.json()) as {
      status?: string;
      endedReason?: string;
      analysis?: { summary?: string; structuredData?: { resultat?: string; heure_reservee?: string; creneau_propose?: string; condition?: string } };
    };
    if (call.status !== "ended") return { status: 200, body: { outcome: "en_cours" satisfies CallOutcome, stage: call.status ?? "queued" } };
    const data = call.analysis?.structuredData;
    const noAnswer = /did-not-answer|busy|voicemail|no-answer/.test(call.endedReason ?? "");
    const known: CallOutcome[] = ["confirmee", "alternative", "complet", "pas_de_reponse", "a_rappeler"];
    const outcome: CallOutcome = noAnswer ? "pas_de_reponse" : known.includes(data?.resultat as CallOutcome) ? (data!.resultat as CallOutcome) : call.analysis ? "a_rappeler" : "echec";
    return {
      status: 200,
      body: {
        outcome,
        time: data?.heure_reservee || undefined,
        proposed: data?.creneau_propose || undefined,
        condition: data?.condition || undefined,
        summary: call.analysis?.summary?.slice(0, 400),
      },
    };
  } catch (err) {
    console.error("[voice] statut", err);
    return { status: 502, body: { error: "provider_unreachable" } };
  }
}
