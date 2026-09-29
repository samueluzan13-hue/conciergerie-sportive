import { getState } from "./store";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

let aiAvailable: boolean | null = null;

export async function checkAi(): Promise<boolean> {
  if (aiAvailable !== null) return aiAvailable;
  try {
    const r = await fetch("/api/marco");
    aiAvailable = r.ok && Boolean((await r.json()).ai);
  } catch {
    aiAvailable = false;
  }
  return aiAvailable;
}

/** Appelle l'IA de Marco. Renvoie null si l'IA n'est pas disponible (mode local). */
export async function askMarco(messages: ChatMessage[]): Promise<string | null> {
  if (!(await checkAi())) return null;
  try {
    const { profile } = getState();
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
