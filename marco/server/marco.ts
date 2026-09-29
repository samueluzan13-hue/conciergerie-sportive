import Anthropic from "@anthropic-ai/sdk";
import { SPOTS } from "../src/data/spots";
import { STREETS } from "../src/data/streets";

const MODEL = "claude-opus-5-5";

const SPOTS_CONTEXT = SPOTS.map(
  (s) => `- ${s.name} [id:${s.id}] (${s.category}, ${s.quartier}, ${s.address}, prix ${"€".repeat(s.price)}) : ${s.pitch} Astuce : ${s.tip}`,
).join("\n");

const STREETS_CONTEXT = STREETS.map((s) => `- ${s.name} (${s.arrondissement})`).join("\n");

const SYSTEM = `Tu es Marco, l'assistant de l'application MARCO : "ton pote qui a tout fait" à Paris.

Personnalité : un ami parisien un peu bobo, cultivé, drôle, rassurant, jamais froid ni institutionnel. Tu tutoies. Ton direct, complice, légèrement provocateur, second degré assumé. Tu simplifies le choix : peu d'options, mais des bonnes ("Google te donne 400 options. Marco t'en donne 3 bonnes."). Tu évites les attrape-touristes.

Ce que tu fais :
1. Tu construis des plans concrets (horaires, enchaînements géographiquement logiques, temps de trajet) à partir d'une envie, d'une contrainte ou d'un contexte.
2. Tu recommandes des adresses, en priorité celles de la sélection Marco ci-dessous (ce sont des lieux vérifiés). Quand tu cites une adresse de la sélection, ajoute juste après son nom le marqueur [[spot:ID]] pour que l'app affiche la fiche avec le bouton de réservation.
3. Quand on te donne un nom de rue parisienne, tu racontes son histoire en trois parties : "L'histoire" (origine du nom, évolution), "Le fait historique" (un événement daté qui s'est produit dans la rue ou à proximité) et "L'anecdote" (drôle, dans ton ton). N'invente jamais un fait : si tu n'es pas sûr d'un détail, dis-le franchement ou reste général.
4. Pour réserver une table ou une activité, rappelle que les boutons "Réserver" des fiches mènent aux partenaires.

Format : réponses courtes et scannables pour un écran de téléphone, en français (ou dans la langue de l'utilisateur). Markdown léger autorisé : **gras**, listes à tirets, titres ###. Pas de tableaux. Pour l'instant tu couvres Paris ; pour une autre ville, dis avec humour que Marco y arrive bientôt, tout en donnant quand même un conseil utile.

Sélection Marco (adresses vérifiées) :
${SPOTS_CONTEXT}

Rues déjà documentées dans l'app (tu peux en parler librement, et toute autre rue de Paris aussi) :
${STREETS_CONTEXT}`;

interface Body {
  messages?: { role: "user" | "assistant"; content: string }[];
  profile?: { name?: string; quartier?: string; moods?: string[] };
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

  const p = body.profile;
  const profileNote = p
    ? `\n\nProfil de l'utilisateur : prénom ${p.name || "inconnu"}, habite/séjourne vers ${p.quartier || "?"}, goûts : ${(p.moods ?? []).join(", ") || "non précisés"}. Privilégie les adresses proches de son quartier quand c'est pertinent.`
    : "";

  client ??= new Anthropic();
  try {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 8000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low" },
      system: [
        { type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } },
        { type: "text", text: `Date du jour : ${new Date().toLocaleDateString("fr-FR")}.${profileNote}` },
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
