import { getSample } from "./cloud";
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
    return (await getSample()) ? "sample" : "none";
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
  opts: { onText?: (text: string) => void; deep?: boolean } = {},
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
    const intro = `${marcoInstructions()}\n\n${profileNote(profile)}\nDate du jour : ${new Date().toLocaleDateString("fr-FR")}.\n\nRéponds maintenant au message de l'utilisateur, dans le rôle de Marco.`;
    // Les consignes sont un premier tour "user" que l'on garde toujours ; on limite l'historique.
    const turns = [{ role: "user" as const, content: intro }, ...messages.slice(-12)];
    try {
      const { text } = await sample(turns, {
        modelTier: opts.deep ? "default" : "quick",
        cache: false,
        onText: opts.onText ? (e) => opts.onText!(e.text) : undefined,
      });
      return text.trim() || null;
    } catch (e) {
      const code = (e as { code?: string })?.code;
      if (code === "not_granted") backend = Promise.resolve("none");
      const partial = (e as { text?: string })?.text;
      return partial?.trim() || null;
    }
  }
  return null;
}
