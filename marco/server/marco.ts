import Anthropic from "@anthropic-ai/sdk";
import { marcoInstructions, nowNote, profileNote } from "../src/lib/prompt";

const MODEL = "claude-opus-5-5";

interface Body {
  messages?: { role: "user" | "assistant"; content: string }[];
  profile?: { name?: string; quartier?: string; moods?: string[]; memory?: string[]; city?: string };
  hint?: string;
}

let client: Anthropic | null = null;

const LIVE_NOTE = `RECHERCHE EN DIRECT : tu disposes des outils web_search et web_fetch. Pour toute demande de restaurant, d'activité, de soirée ou d'horaires, vérifie sur le web (site officiel du lieu, Google Maps, pages récentes) que le lieu existe toujours, ses horaires d'aujourd'hui et comment réserver, puis réponds avec ces informations à jour. Une ou deux recherches bien ciblées suffisent en général. Ne cite pas tes sources en détail ; mentionne juste « vérifié aujourd'hui » quand c'est le cas.`;

function ask(system: Anthropic.Beta.BetaTextBlockParam[], messages: Anthropic.Beta.BetaMessageParam[]) {
  client ??= new Anthropic();
  return client.beta.messages.create({
    model: MODEL,
    max_tokens: 16000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "low" },
    system,
    tools: [
      { type: "web_search_20260209", name: "web_search", max_uses: 5, user_location: { type: "approximate", city: "Paris", country: "FR", timezone: "Europe/Paris" } },
      { type: "web_fetch_20260209", name: "web_fetch", max_uses: 3 },
    ],
    messages,
  });
}

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

  try {
    // Recherche web en direct : horaires, ouverture, nouveautés. Le serveur Anthropic exécute les recherches ;
    // si le tour est mis en pause (trop de recherches d'un coup), on le relance tel quel.
    const system: Anthropic.Beta.BetaTextBlockParam[] = [
      { type: "text", text: `${marcoInstructions(body.profile?.city)}\n\n${LIVE_NOTE}`, cache_control: { type: "ephemeral" } },
      { type: "text", text: `${nowNote()} ${profileNote(body.profile)}${typeof body.hint === "string" ? `\n\n${body.hint.slice(0, 4000)}` : ""}` },
    ];
    const convo: Anthropic.Beta.BetaMessageParam[] = messages;
    const textOf = (r: Anthropic.Beta.BetaMessage) => r.content.map((b) => (b.type === "text" ? b.text : "")).join("");
    let response = await ask(system, convo);
    let text = textOf(response);
    for (let i = 0; i < 3 && response.stop_reason === "pause_turn"; i++) {
      response = await ask(system, [...convo, { role: "assistant", content: response.content }]);
      text += textOf(response);
    }
    if (response.stop_reason === "refusal") {
      return { status: 200, body: { reply: "Oups, je ne peux pas t'aider sur ce coup-là. On parle plutôt d'une bonne adresse ?" } };
    }
    const reply = text.trim();
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
