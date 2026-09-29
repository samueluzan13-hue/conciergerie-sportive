import { spotById } from "../data/spots";

/**
 * Marqueurs « invisibles » que l'IA ajoute à ses réponses et que l'app transforme en actions :
 * - [[suggestions:Et pour le dîner ?|Plus près du métro|…]] → boutons de relance
 * - [[memo:Mange casher]] → ce que Marco retient de l'utilisateur (profil, supprimable)
 * - [[plan:Titre|19:00 spot-id|21:00 spot-id]] → bouton « Enregistrer ce plan »
 * - [[resa:Nom|spot-id ou -|2026-10-02|20:00|4]] → carte de réservation prise en charge par Marco
 */
export interface ReplyMeta {
  body: string;
  suggestions: string[];
  memos: string[];
  plan: { title: string; stops: { time: string; spotId: string }[] } | null;
  resa: BookingDraft | null;
}

export interface BookingDraft {
  place: string;
  spotId?: string;
  date: string;
  time: string;
  people: number;
}

const META = /\[\[(suggestions|memo|plan|resa):([^\]]*)\]\]/g;

export function parseReply(text: string): ReplyMeta {
  const out: ReplyMeta = { body: "", suggestions: [], memos: [], plan: null, resa: null };
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
    } else if (kind === "resa") {
      const [place, id, date, time, people] = v.split("|").map((x) => x.trim());
      if (place)
        out.resa = {
          place: place.slice(0, 80),
          spotId: id && spotById(id) ? id : undefined,
          date: /^\d{4}-\d{2}-\d{2}$/.test(date ?? "") ? date : "",
          time: /^\d{1,2}[:h]\d{2}$/.test(time ?? "") ? time.replace("h", ":").padStart(5, "0") : "",
          people: Math.min(20, Math.max(1, parseInt(people ?? "", 10) || 2)),
        };
    }
    return "";
  });
  // pendant l'écriture, on cache un marqueur pas encore fermé
  body = body.replace(/\[\[?[^\]\n]*\]?$/, (m) => (m.startsWith("[[") || m === "[" ? "" : m));
  out.body = body.replace(/\n{3,}/g, "\n\n").trim();
  return out;
}
