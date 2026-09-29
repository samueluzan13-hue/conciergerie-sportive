import Anthropic from "@anthropic-ai/sdk";
import { marcoInstructions, nowNote, profileNote } from "../src/lib/prompt";

const MODEL = "claude-opus-5-5";

interface Body {
  messages?: { role: "user" | "assistant"; content: string }[];
  profile?: { name?: string; quartier?: string; moods?: string[]; memory?: string[] };
  hint?: string;
}

let client: Anthropic | null = null;

export async function handleMarco(method: string, raw: string): Promise<{ status: number; body: unknown }> {
  if (method === "GET") return { status: 200, body: { ai: Boolean(process.env.ANTHROPIC_API_KEY) } };
  if (method !== "POST") return { status: 405, body: { error: "Méthode non autorisée" } };
  if (!process.env.ANTHROPIC_API_KEY) return { status: 503, body: { error: "no_key" } };

  let body: Body;
  try {
    body = JSON.parse(raw || "{}");
  } catch {
    return { status: 400, body: { error: "JSON invalide" } };
  }
  const messages = (body.messages ?? [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return { status: 400, body: { error: "Il faut un message utilisateur." } };
  }
  while (messages[0]?.role === "assistant") messages.shift();


  client ??= new Anthropic();
  try {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 8000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low" },
      system: [
        { type: "text", text: marcoInstructions(), cache_control: { type: "ephemeral" } },
        { type: "text", text: `${nowNote()} ${profileNote(body.profile)}${typeof body.hint === "string" ? `\n\n${body.hint.slice(0, 300)}` : ""}` },
      ],
      messages,
    });
    if (response.stop_reason === "refusal") {
      return { status: 200, body: { reply: "Oups, je ne peux pas t'aider sur ce coup-là. On parle plutôt d'une bonne adresse ?" } };
    }
    const reply = response.content
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("")
      .trim();
    return { status: 200, body: { reply: reply || "Je sèche… reformule-moi ça ?" } };
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) return { status: 429, body: { error: "rate_limited" } };
    if (err instanceof Anthropic.APIError) {
      console.error("[marco] API error", err.status, err.message);
      return { status: 502, body: { error: "api_error" } };
    }
    console.error("[marco]", err);
    return { status: 500, body: { error: "server_error" } };
  }
}
