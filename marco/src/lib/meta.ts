import { spotById } from "../data/spots";

/**
 * Marqueurs « invisibles » que l'IA ajoute à ses réponses et que l'app transforme en actions :
 * - [[suggestions:Et pour le dîner ?|Plus près du métro|…]] → boutons de relance
 * - [[memo:Mange casher]] → ce que Marco retient de l'utilisateur (profil, supprimable)
 * - [[plan:Titre|19:00 spot-id|21:00 spot-id]] → bouton « Enregistrer ce plan »
 */
export interface ReplyMeta {
  body: string;
  suggestions: string[];
  memos: string[];
  plan: { title: string; stops: { time: string; spotId: string }[] } | null;
}

const META = /\[\[(suggestions|memo|plan):([^\]]*)\]\]/g;

export function parseReply(text: string): ReplyMeta {
  const out: ReplyMeta = { body: "", suggestions: [], memos: [], plan: null };
  let body = text.replace(META, (_, kind: string, value: string) => {
    const v = value.trim();
    if (kind === "suggestions") out.suggestions = v.split("|").map((s) => s.trim()).filter(Boolean).slice(0, 4);
    else if (kind === "memo" && v) out.memos.push(v.slice(0, 120));
    else if (kind === "plan") {
      const [title, ...rest] = v.split("|").map((s) => s.trim());
      const stops = rest
        .map((s) => /^(\d{1,2}[:h]\d{2})\s+([a-z0-9-]+)$/.exec(s))
        .filter((m): m is RegExpExecArray => !!m && !!spotById(m[2]))
        .map((m) => ({ time: m[1].replace("h", ":"), spotId: m[2] }));
      if (title && stops.length) out.plan = { title: title.slice(0, 80), stops };
    }
    return "";
  });
  // pendant l'écriture, on cache un marqueur pas encore fermé
  body = body.replace(/\[\[?[^\]\n]*\]?$/, (m) => (m.startsWith("[[") || m === "[" ? "" : m));
  out.body = body.replace(/\n{3,}/g, "\n\n").trim();
  return out;
}
