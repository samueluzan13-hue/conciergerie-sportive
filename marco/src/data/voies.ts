import raw from "./voies.json";
import { findStreet, STREETS, type StreetStory } from "./streets";

/** Une voie de Paris (rue, avenue, boulevard, place, quai, passage…). */
export interface Voie {
  /** nom complet : "Rue de Rivoli" */
  n: string;
  /** type : "Rue", "Avenue"… */
  t: string;
  /** arrondissements traversés */
  a: number[];
  /** origine du nom (liste officielle) */
  o?: string;
  /** historique (liste officielle) */
  h?: string;
  /** quartier */
  q?: string;
  lat?: number;
  lng?: number;
}

export const VOIES = raw as Voie[];

export const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/œ/g, "oe").replace(/[^a-z0-9]+/g, " ").trim();

const STOP = new Set(["rue", "avenue", "av", "boulevard", "bd", "place", "pl", "quai", "passage", "allee", "impasse", "villa", "cite", "square", "cour", "cours", "galerie", "de", "du", "des", "la", "le", "les", "l", "d", "st", "saint", "sainte"]);
const core = (s: string) => norm(s).split(" ").filter((w) => !STOP.has(w)).join(" ");

const INDEX = VOIES.map((v) => ({ v, full: norm(v.n), core: core(v.n) }));

export const arrLabel = (a: number[]) => a.map((x) => (x === 1 ? "1er" : `${x}e`)).join(", ");

/** Recherche tolérante (accents, tirets, "rue de"/"bd"… optionnels, "st" = "saint"). */
export function searchVoies(query: string, max = 8): Voie[] {
  const q = norm(query.replace(/\bst\b/gi, "saint").replace(/\bste\b/gi, "sainte").replace(/\bbd\b/gi, "boulevard").replace(/\bav\b/gi, "avenue"));
  if (q.length < 2) return [];
  const qc = core(q) || q;
  const scored: { v: Voie; s: number }[] = [];
  for (const it of INDEX) {
    let s = 0;
    if (it.full === q) s = 100;
    else if (it.core === qc) s = 90;
    else if (it.full.startsWith(q)) s = 80;
    else if (it.core.startsWith(qc)) s = 70;
    else if (it.core.split(" ").some((w) => w.startsWith(qc))) s = 55;
    else if (it.full.includes(q) || it.core.includes(qc)) s = 40;
    if (s) scored.push({ v: it.v, s: s - it.v.n.length / 100 });
  }
  return scored.sort((a, b) => b.s - a.s).slice(0, max).map((x) => x.v);
}

export function findVoie(query: string): Voie | undefined {
  const q = norm(query);
  return VOIES.find((v) => norm(v.n) === q) ?? searchVoies(query, 1)[0];
}

/** Récit complet écrit par Marco pour cette voie, s'il existe. */
export function storyFor(v: Voie | string): StreetStory | undefined {
  const name = typeof v === "string" ? v : v.n;
  const exact = STREETS.find((s) => norm(s.name) === norm(name));
  return exact ?? (typeof v === "string" ? findStreet(v) : undefined);
}

export function voiesByArr(arr: number) {
  return VOIES.filter((v) => v.a.includes(arr));
}

/** La saisie est-elle exactement le nom d'une voie (sans forcément "rue de…") ? ex. "mouffetard" */
export function exactVoie(input: string): Voie | undefined {
  const c = core(input);
  if (c.length < 4) return undefined;
  return INDEX.find((it) => it.core === c)?.v;
}
