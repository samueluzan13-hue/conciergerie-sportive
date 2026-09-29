// Côté app : l'agent vocal de Marco appelle le restaurant (route serveur /api/appel, voir server/voice.ts).
import { log } from "./diag";
import { updateBooking, type MyBooking } from "./store";

export interface CallResult {
  outcome: "en_cours" | "confirmee" | "alternative" | "complet" | "pas_de_reponse" | "a_rappeler" | "echec";
  stage?: string;
  time?: string;
  proposed?: string;
  condition?: string;
  summary?: string;
}

let config: Promise<{ enabled: boolean; auto: boolean }> | null = null;

/** L'appel automatique n'existe que sur le site en ligne (l'aperçu n'a pas de serveur). */
export function voiceConfig() {
  config ??= import.meta.env.VITE_PREVIEW
    ? Promise.resolve({ enabled: false, auto: false })
    : fetch("/api/appel")
        .then((r) => (r.ok ? r.json() : { enabled: false, auto: false }))
        .catch(() => ({ enabled: false, auto: false }));
  return config;
}

export async function startCall(b: { place: string; address?: string; date: string; time: string; people: number; name: string; phone: string; note?: string }) {
  const r = await fetch("/api/appel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) });
  const data = (await r.json().catch(() => ({}))) as { callId?: string; scheduledFor?: string; error?: string };
  log("voice:start", { ok: r.ok, error: data.error });
  if (!r.ok || !data.callId) throw new Error(data.error || "call_failed");
  return data as { callId: string; scheduledFor?: string };
}

export async function getCall(id: string): Promise<CallResult | null> {
  try {
    const r = await fetch(`/api/appel?id=${encodeURIComponent(id)}`);
    return r.ok ? ((await r.json()) as CallResult) : null;
  } catch {
    return null;
  }
}

/** Traduit le résultat de l'appel pour le client, et met à jour sa réservation. */
export function applyCall(b: Pick<MyBooking, "id" | "time">, c: CallResult) {
  if (c.outcome === "en_cours") return;
  const cond = c.condition ? ` ${c.condition}.` : "";
  const map: Record<Exclude<CallResult["outcome"], "en_cours">, Pick<MyBooking, "status" | "reponse">> = {
    confirmee: { status: "confirmee", reponse: `Table confirmée par téléphone à ${c.time || b.time}.${cond}` },
    alternative: { status: "confirmee", reponse: `L'heure demandée était prise : Marco a réservé à ${c.time || "un horaire proche"}.${cond}` },
    complet: { status: "impossible", reponse: `Complet à cet horaire${c.proposed ? ` (le restaurant proposait ${c.proposed})` : ""}. Demande-moi une autre adresse !` },
    pas_de_reponse: { status: "impossible", reponse: "Le restaurant n'a pas décroché. Réessaie plus tard ou réserve sur son site." },
    a_rappeler: { status: "impossible", reponse: `Le restaurant demande que tu réserves toi-même (carte bancaire ou acompte).${cond}` },
    echec: { status: "impossible", reponse: "L'appel n'a pas abouti. Réserve sur le site du restaurant." },
  };
  updateBooking(b.id, map[c.outcome]);
}
