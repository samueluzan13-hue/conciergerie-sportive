import { getSample } from "./cloud";
import { log } from "./diag";
import { marcoInstructions, profileNote } from "./prompt";
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

export async function checkAi(): Promise<boolean> {
  return (await detect()) !== "none";
}

/**
 * Appelle l'IA de Marco. Renvoie null si aucune IA n'est disponible (le mode local prend le relais).
 * `onText` reçoit la réponse complète au fur et à mesure qu'elle s'écrit (aperçu uniquement).
 */
export async function askMarco(
  messages: ChatMessage[],
  opts: { onText?: (text: string) => void; deep?: boolean; alreadyShown?: string } = {},
): Promise<string | null> {
  const b = await detect();
  const { profile } = getState();

  if (b === "server") {
    try {
      const r = await fetch("/api/marco", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, profile }),
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
    const intro = `${marcoInstructions()}\n\n${profileNote(profile)}\nDate du jour : ${new Date().toLocaleDateString("fr-FR")}.\n\nRéponds maintenant au message de l'utilisateur, dans le rôle de Marco.${
      opts.alreadyShown
        ? `\n\nL'app vient déjà d'afficher cette première sélection à l'utilisateur :\n${opts.alreadyShown}\nNe la répète pas : complète-la (un plan concret, des conseils, d'autres idées), en restant bref.`
        : ""
    }`;
    // Les consignes sont un premier tour "user" que l'on garde toujours ; on limite l'historique.
    const turns = [{ role: "user" as const, content: intro }, ...messages.slice(-12)];
    // Délais maximum : si l'IA ne commence pas à répondre (autorisation en attente, réseau…), on abandonne
    // et le cerveau local de Marco prend le relais. L'app ne reste jamais bloquée.
    const ctrl = new AbortController();
    let started = false;
    const firstTimer = setTimeout(() => !started && ctrl.abort(), opts.deep ? 45000 : 25000);
    const totalTimer = setTimeout(() => ctrl.abort(), 90000);
    let latest = "";
    log("ai:ask", { tier: opts.deep ? "default" : "quick" });
    try {
      const { text } = await sample(turns, {
        modelTier: opts.deep ? "default" : "quick",
        cache: false,
        signal: ctrl.signal,
        onText: (e) => {
          started = true;
          latest = e.text;
          opts.onText?.(e.text);
        },
      });
      log("ai:ok", text.length);
      return text.trim() || null;
    } catch (e) {
      const code = (e as { code?: string })?.code;
      log("ai:error", { code, message: (e as { message?: string })?.message });
      if (code === "not_granted") backend = Promise.resolve("none");
      const partial = (e as { text?: string })?.text || latest;
      return partial?.trim() || null;
    } finally {
      clearTimeout(firstTimer);
      clearTimeout(totalTimer);
    }
  }
  return null;
}
