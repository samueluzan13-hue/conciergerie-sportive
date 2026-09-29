import { aiPermission, getSample, requestAi } from "./cloud";
import { log } from "./diag";
import { marcoInstructions, nowNote, profileNote } from "./prompt";
import { getState } from "./store";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

type Backend = "server" | "sample" | "none";
let backend: Promise<Backend> | null = null;

/** Où parler à l'IA : le serveur du site (clé API) ou l'IA intégrée à l'aperçu claude.ai. */
function detect(): Promise<Backend> {
  backend ??= (async () => {
    if (!import.meta.env.VITE_PREVIEW) {
      try {
        const r = await fetch("/api/marco");
        if (r.ok && (await r.json()).ai) return "server";
      } catch {
        /* pas de serveur */
      }
    }
    // On n'attend pas plus de 4 s la réponse du cadre ; si elle arrive plus tard, on en profite ensuite.
    const sample = getSample();
    const first = await Promise.race([sample, new Promise<null>((r) => setTimeout(() => r(null), 4000))]);
    if (!first) sample.then((x) => x && (backend = Promise.resolve("sample")));
    log("ai:backend", first ? "sample" : "none");
    return first ? "sample" : "none";
  })();
  return backend;
}

/** Dernier problème rencontré avec l'IA de l'aperçu ("denied" = refusée par l'utilisateur). */
let issue: "denied" | "error" | null = null;
export const aiIssue = () => issue;

export async function checkAi(): Promise<boolean> {
  return (await detect()) !== "none";
}

/**
 * Appelle l'IA de Marco. Renvoie null si aucune IA n'est disponible (le mode local prend le relais).
 * `onText` reçoit la réponse complète au fur et à mesure qu'elle s'écrit (aperçu uniquement).
 */
export async function askMarco(
  messages: ChatMessage[],
  opts: { onText?: (text: string) => void; deep?: boolean; alreadyShown?: string; hint?: string } = {},
): Promise<string | null> {
  const b = await detect();
  const st = getState();
  const profile = { ...st.profile, memory: st.memory ?? [] };

  if (b === "server") {
    try {
      const r = await fetch("/api/marco", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, profile, hint: opts.hint }),
      });
      if (!r.ok) return null;
      const data = await r.json();
      return typeof data.reply === "string" ? data.reply : null;
    } catch {
      return null;
    }
  }

  if (b === "sample") {
    const sample = await getSample();
    if (!sample) return null;
    // L'autorisation d'utiliser l'IA est demandée ici, sans minuterie : l'utilisateur prend le temps de répondre.
    let perm = await aiPermission();
    if (perm === "prompt") perm = await requestAi();
    log("ai:permission", perm);
    if (perm === "denied") {
      issue = "denied";
      return null;
    }
    const intro = `${marcoInstructions()}\n\n${profileNote(profile)}\n${nowNote()}\n\nRéponds maintenant au message de l'utilisateur, dans le rôle de Marco.${
      opts.alreadyShown
        ? `\n\nL'app vient déjà d'afficher cette première sélection à l'utilisateur :\n${opts.alreadyShown}\nNe la répète pas : complète-la (un plan concret, des conseils, d'autres idées), en restant bref.`
        : ""
    }${opts.hint ? `\n\n${opts.hint}` : ""}`;
    // Les consignes sont un premier tour "user" que l'on garde toujours ; on limite l'historique.
    const turns = [{ role: "user" as const, content: intro }, ...messages.slice(-12)];
    // Délais maximum : si l'IA ne commence pas à répondre (autorisation en attente, réseau…), on abandonne
    // et le cerveau local de Marco prend le relais. L'app ne reste jamais bloquée.
    const ctrl = new AbortController();
    let started = false;
    const firstTimer = setTimeout(() => !started && ctrl.abort(), 60000);
    const totalTimer = setTimeout(() => ctrl.abort(), 150000);
    let latest = "";
    const tier = "default";
    log("ai:ask", { tier, q: messages[messages.length - 1]?.content.slice(0, 80) });
    try {
      const { text } = await sample(turns, {
        modelTier: tier,
        cache: false,
        signal: ctrl.signal,
        onText: (e) => {
          started = true;
          latest = e.text;
          opts.onText?.(e.text);
        },
      });
      log("ai:ok", text.length);
      issue = null;
      return text.trim() || null;
    } catch (e) {
      const code = (e as { code?: string })?.code;
      log("ai:error", { code, message: (e as { message?: string })?.message });
      if (code === "not_granted") issue = "denied";
      else issue = "error";
      const partial = (e as { text?: string })?.text || latest;
      return partial?.trim() || null;
    } finally {
      clearTimeout(firstTimer);
      clearTimeout(totalTimer);
    }
  }
  return null;
}
