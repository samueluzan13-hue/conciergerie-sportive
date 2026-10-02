// Pilote automatique des réservations (site en ligne) : tout se fait sans intervention humaine.
//
//   1. Le client confirme « Réserver avec Marco »  → POST /api/reservations
//      La demande est enregistrée côté serveur (le client n'a accès à rien d'autre qu'à SA réservation),
//      il reçoit un code Marco et un SMS « demande reçue ».
//   2. L'agent vocal de Marco appelle le lieu, dans sa langue (resto, activité, hôtel).
//   3. À la fin de l'appel, Vapi prévient le serveur (webhook) → la réservation passe en « confirmée »
//      ou « impossible », et le client reçoit le SMS correspondant, avec son code.
//   4. Si l'appel n'aboutit pas (messagerie, acompte exigé…), la demande reste « à traiter » pour l'équipe.
//
//   GET   /api/reservations                    → { enabled, auto }
//   POST  /api/reservations                    → nouvelle demande, renvoie { id, code, auto }
//   GET   /api/reservations?id=…&code=…        → état de SA réservation (le code sert de clé)
//   GET   /api/reservations?all=1   [admin]    → toutes les réservations
//   PATCH /api/reservations?id=…    [admin]    → { status, reponse, honored } (+ SMS au client)
//   POST  /api/reservations?hook=vapi&key=…    → fin d'appel envoyée par Vapi
//
// Variables : UPSTASH_REDIS_REST_URL et UPSTASH_REDIS_REST_TOKEN (base, ex. Vercel › Storage › Upstash),
// PUBLIC_URL (adresse du site, pour le webhook), MARCO_ADMIN_TOKEN, et pour l'automatisme
// VAPI_API_KEY, VAPI_PHONE_NUMBER_ID, GOOGLE_MAPS_API_KEY, TWILIO_* (voir server/sms.ts).

import { assistantFor, CALL_COUNTRY, findPhone, nextCallWindow, type CallRequest } from "./voice";
import { handleSms } from "./sms";
import { createHash } from "node:crypto";

type Res = { status: number; body: unknown };
type Status = "en_attente" | "appel" | "confirmee" | "impossible";

export interface ServerBooking {
  id: string;
  code: string;
  place: string;
  placeKey: string;
  city: string;
  kind: "table" | "activite" | "hotel";
  address: string;
  date: string;
  time: string;
  checkout: string;
  people: number;
  name: string;
  phone: string;
  note: string;
  status: Status;
  reponse: string;
  honored: boolean;
  createdAt: number;
  callId?: string;
  smsAt?: number;
}

const storeOn = () => Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
const voiceOn = () => Boolean(process.env.VAPI_API_KEY && process.env.VAPI_PHONE_NUMBER_ID && process.env.GOOGLE_MAPS_API_KEY && process.env.PUBLIC_URL);
const isAdmin = (t?: string) => Boolean(process.env.MARCO_ADMIN_TOKEN) && t === process.env.MARCO_ADMIN_TOKEN;
// clé du webhook Vapi : dérivée de la clé admin (jamais la clé admin elle-même dans une URL)
const hookKey = () =>
  process.env.MARCO_WEBHOOK_KEY ||
  (process.env.MARCO_ADMIN_TOKEN ? createHash("sha256").update(`marco-hook:${process.env.MARCO_ADMIN_TOKEN}`).digest("hex").slice(0, 32) : "");

/* ---------- base (Upstash Redis, API REST) ---------- */
async function redis<T = unknown>(...cmd: (string | number)[]): Promise<T> {
  const r = await fetch(process.env.UPSTASH_REDIS_REST_URL!, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmd.map(String)),
  });
  const j = (await r.json()) as { result?: T; error?: string };
  if (j.error) throw new Error(j.error);
  return j.result as T;
}
const save = (b: ServerBooking) => redis("SET", `resa:${b.id}`, JSON.stringify(b));
async function load(id: string): Promise<ServerBooking | null> {
  const raw = await redis<string | null>("GET", `resa:${id}`);
  return raw ? (JSON.parse(raw) as ServerBooking) : null;
}

/* ---------- SMS au client ---------- */
const d = (x: string) => new Date(`${x}T12:00`).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" }).replace(/\.$/, "");
const whenTxt = (b: ServerBooking) => (b.kind === "hotel" && b.checkout ? `du ${d(b.date)} au ${d(b.checkout)}` : `le ${d(b.date)} à ${b.time.replace(":", "h")}`);
const gsm = (s: string) => s.replace(/[êë]/g, "e").replace(/[âä]/g, "a").replace(/[îï]/g, "i").replace(/[ôö]/g, "o").replace(/[ûü]/g, "u").replace(/ç/g, "c").replace(/[ÀÂ]/g, "A").replace(/[ÈÊË]/g, "E").replace(/[’]/g, "'");

function smsText(b: ServerBooking, kind: "recue" | "confirmee" | "impossible") {
  const p = `${b.people} pers.`;
  const extra = b.reponse ? ` ${b.reponse.slice(0, 120)}` : "";
  if (kind === "recue") return gsm(`Marco : votre demande pour ${b.place} ${whenTxt(b)} (${p}) est bien enregistrée. Code ${b.code}. On s'occupe de tout et on vous confirme par SMS.`);
  if (kind === "confirmee") return gsm(`Marco : votre réservation ${b.kind === "hotel" ? "à" : "chez"} ${b.place} ${whenTxt(b)} (${p}) est confirmée. Code ${b.code} à présenter sur place.${extra} Bonne visite !`);
  return gsm(`Marco : désolé, ${b.place} ne peut pas vous accueillir ${whenTxt(b)} (${p}).${extra} Ouvrez Marco pour choisir un autre créneau ou une autre adresse.`);
}
const intl = (p: string) => {
  const x = p.replace(/[^\d+]/g, "");
  return x.startsWith("+") ? x : x.startsWith("00") ? `+${x.slice(2)}` : /^0\d{9}$/.test(x) ? `+33${x.slice(1)}` : x;
};
async function sms(b: ServerBooking, kind: "recue" | "confirmee" | "impossible") {
  const r = await handleSms("POST", JSON.stringify({ to: intl(b.phone), body: smsText(b, kind) }), process.env.MARCO_ADMIN_TOKEN).catch(() => ({ status: 500 }));
  if (r.status === 200 && kind !== "recue") b.smsAt = Date.now();
}

/* ---------- appel automatique ---------- */
async function call(b: ServerBooking): Promise<boolean> {
  if (!voiceOn() || b.kind === "hotel") return false; // hôtels : réservation par l'équipe ou en ligne
  const country = CALL_COUNTRY[b.city] ?? CALL_COUNTRY.paris;
  const phone = await findPhone(b.place, b.address, b.city);
  if (!phone) return false;
  const r: CallRequest = { place: b.place, address: b.address, date: b.date, time: b.time, people: b.people, name: b.name, phone: b.phone, note: b.note };
  const scheduledFor = nextCallWindow(new Date(), country.tz);
  const res = await fetch("https://api.vapi.ai/call", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.VAPI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,
      customer: { number: phone, name: b.place.slice(0, 40) },
      assistant: { ...assistantFor(r, b.city, b.kind), server: { url: `${process.env.PUBLIC_URL}/api/reservations?hook=vapi&key=${encodeURIComponent(hookKey())}` }, metadata: { bookingId: b.id } },
      ...(scheduledFor ? { schedulePlan: { earliestAt: scheduledFor } } : {}),
    }),
  });
  const j = (await res.json().catch(() => ({}))) as { id?: string };
  if (!res.ok || !j.id) return false;
  b.callId = j.id;
  b.status = "appel";
  await redis("SET", `call:${j.id}`, b.id, "EX", 7 * 86400);
  return true;
}

/* ---------- requêtes ---------- */
const ALPHA = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const newCode = () => `M-${Array.from({ length: 5 }, () => ALPHA[Math.floor(Math.random() * ALPHA.length)]).join("")}`;
const pub = (b: ServerBooking) => ({ id: b.id, code: b.code, place: b.place, date: b.date, time: b.time, checkout: b.checkout, people: b.people, status: b.status, reponse: b.reponse });

function validate(x: Record<string, unknown>): Omit<ServerBooking, "id" | "code" | "status" | "reponse" | "honored" | "createdAt"> {
  const s = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const kind = x.kind === "hotel" || x.kind === "activite" ? x.kind : "table";
  const b = {
    place: s(x.place, 100), placeKey: s(x.placeKey, 160), city: CALL_COUNTRY[s(x.city, 20)] ? s(x.city, 20) : "paris", kind: kind as ServerBooking["kind"],
    address: s(x.address, 160), date: s(x.date, 10), time: s(x.time, 5) || "15:00", checkout: s(x.checkout, 10),
    people: Math.round(Number(x.people)), name: s(x.name, 60), phone: s(x.phone, 25), note: s(x.note, 200),
  };
  if (!b.place) throw new Error("place");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(b.date) || !/^\d{2}:\d{2}$/.test(b.time)) throw new Error("date");
  if (!(b.people >= 1 && b.people <= 20) || b.name.length < 2 || b.phone.replace(/\D/g, "").length < 9) throw new Error("champs");
  return b;
}

export async function handleReservations(method: string, search: URLSearchParams, raw: string, adminToken?: string): Promise<Res> {
  if (method === "GET" && !search.has("id") && !search.has("all")) return { status: 200, body: { enabled: storeOn(), auto: storeOn() && voiceOn() } };
  if (!storeOn()) return { status: 503, body: { error: "not_configured" } };
  try {
    // fin d'appel envoyée par Vapi
    if (method === "POST" && search.get("hook") === "vapi") {
      if (!hookKey() || search.get("key") !== hookKey()) return { status: 401, body: { error: "key" } };
      const msg = (JSON.parse(raw || "{}") as { message?: { type?: string; call?: { id?: string; assistant?: { metadata?: { bookingId?: string } } }; endedReason?: string; analysis?: { summary?: string; structuredData?: { resultat?: string; heure_reservee?: string; creneau_propose?: string; condition?: string } } } }).message;
      if (msg?.type !== "end-of-call-report") return { status: 200, body: { ok: true } };
      const id = msg.call?.assistant?.metadata?.bookingId ?? (msg.call?.id ? await redis<string | null>("GET", `call:${msg.call.id}`) : null);
      const b = id ? await load(id) : null;
      if (!b) return { status: 200, body: { ok: true } };
      const data = msg.analysis?.structuredData;
      const noAnswer = /did-not-answer|busy|voicemail|no-answer/.test(msg.endedReason ?? "");
      const res = noAnswer ? "pas_de_reponse" : data?.resultat;
      if (res === "confirmee" || res === "alternative") {
        if (data?.heure_reservee && /^\d{1,2}:\d{2}$/.test(data.heure_reservee)) b.time = data.heure_reservee.padStart(5, "0");
        b.status = "confirmee";
        b.reponse = data?.condition ?? "";
        await sms(b, "confirmee");
      } else if (res === "complet") {
        b.status = "impossible";
        b.reponse = data?.creneau_propose ? `Il reste de la place à ${data.creneau_propose}.` : "";
        await sms(b, "impossible");
      } else {
        // messagerie, acompte exigé… : l'équipe prend le relais
        b.status = "en_attente";
        b.reponse = "";
        b.note = [b.note, `Appel auto : ${msg.analysis?.summary ?? res ?? "sans résultat"}`].filter(Boolean).join(" · ").slice(0, 400);
      }
      await save(b);
      return { status: 200, body: { ok: true } };
    }

    // nouvelle demande d'un client
    if (method === "POST") {
      const base = validate(JSON.parse(raw || "{}"));
      const b: ServerBooking = { ...base, id: `r${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`, code: newCode(), status: "en_attente", reponse: "", honored: false, createdAt: Date.now() };
      const auto = await call(b).catch(() => false);
      await save(b);
      await redis("LPUSH", "resas", b.id);
      await sms(b, "recue");
      return { status: 200, body: { ...pub(b), auto } };
    }

    // un client consulte SA réservation (le code fait office de clé)
    if (method === "GET" && search.has("id") && !search.has("all")) {
      const b = await load(search.get("id")!);
      if (!b || b.code !== search.get("code")) return { status: 404, body: { error: "not_found" } };
      return { status: 200, body: pub(b) };
    }

    // espace équipe
    if (!isAdmin(adminToken)) return { status: 401, body: { error: "admin" } };
    if (method === "GET") {
      const ids = await redis<string[]>("LRANGE", "resas", 0, 999);
      const all = (await Promise.all(ids.map(load))).filter((b): b is ServerBooking => !!b);
      return { status: 200, body: { bookings: all } };
    }
    if (method === "PATCH") {
      const b = await load(search.get("id") ?? "");
      if (!b) return { status: 404, body: { error: "not_found" } };
      const j = JSON.parse(raw || "{}") as { status?: Status; reponse?: string; honored?: boolean };
      if (typeof j.reponse === "string") b.reponse = j.reponse.slice(0, 200);
      if (typeof j.honored === "boolean") b.honored = j.honored;
      if (j.status === "confirmee" || j.status === "impossible") {
        const changed = b.status !== j.status;
        b.status = j.status;
        if (changed) await sms(b, j.status);
      }
      await save(b);
      return { status: 200, body: { booking: b } };
    }
    return { status: 405, body: { error: "method" } };
  } catch (e) {
    return { status: 400, body: { error: (e as Error).message } };
  }
}
