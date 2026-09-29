// Construit src/data/voies.json : l'annuaire de toutes les voies de Paris.
//  1. scripts/voies-initiales.txt : première liste saisie à la main (≈1 000 voies)
//  2. scripts/voies-officielles.json (optionnel) : export officiel "Dénominations des emprises des voies actuelles"
//     d'opendata.paris.fr (format JSON). Il apporte TOUTES les voies, avec l'origine du nom et l'historique.
// Usage : node scripts/build-voies.mjs
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const here = new URL(".", import.meta.url).pathname;
const norm = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/œ/g, "oe").replace(/[^a-z0-9]+/g, " ").trim();
const TYPES = ["Rue", "Avenue", "Boulevard", "Place", "Quai", "Passage", "Allée", "Impasse", "Villa", "Cité", "Square", "Cour", "Galerie", "Esplanade", "Carrefour", "Rond-Point", "Pont", "Parvis", "Promenade", "Chemin", "Sentier", "Hameau", "Port", "Porte", "Cours", "Voie", "Jardin", "Route", "Rampe", "Escalier", "Pointe", "Terrasse", "Mail", "Parc"];
const typeOf = (name) => TYPES.find((t) => name.startsWith(t + " ")) ?? "Voie";

const voies = new Map(); // clé normalisée -> voie
function add(v) {
  const key = norm(v.n);
  const cur = voies.get(key);
  if (!cur) return voies.set(key, { ...v, a: [...new Set(v.a)].sort((x, y) => x - y) });
  cur.a = [...new Set([...cur.a, ...v.a])].sort((x, y) => x - y);
  for (const k of ["o", "h", "q", "lat", "lng"]) if (v[k] && !cur[k]) cur[k] = v[k];
  if (v.official) cur.n = v.n; // l'orthographe officielle l'emporte
}

// 1. liste initiale
for (const line of readFileSync(here + "voies-initiales.txt", "utf8").split("\n")) {
  const m = line.match(/^(\d+):\s*(.+)$/);
  if (!m) continue;
  for (const raw of m[2].split(";")) {
    const [name, others] = raw.trim().split("@");
    if (!name) continue;
    add({ n: name.trim(), a: [Number(m[1]), ...(others ? others.split(",").map(Number) : [])] });
  }
}

// 2. liste officielle (si présente)
const offPath = here + "voies-officielles.json";
let official = 0;
if (existsSync(offPath)) {
  const rows = JSON.parse(readFileSync(offPath, "utf8"));
  const pick = (o, keys) => {
    for (const k of Object.keys(o)) if (keys.includes(k.toLowerCase())) return o[k];
  };
  const title = (s) => s.toLowerCase().replace(/(^|[\s'-])(\p{L})/gu, (_, a, b) => a + b.toUpperCase()).replace(/\b(De|Du|Des|La|Le|Les|L'|D'|Et|Aux|Au|En|Sur|Sous)\b/g, (w) => w.toLowerCase()).replace(/^./, (c) => c.toUpperCase());
  for (const r of rows) {
    const f = r.fields ?? r;
    let n = pick(f, ["typo", "typo_min", "nom", "libelle", "denomination", "l_longmin"]);
    if (!n) continue;
    if (n === n.toUpperCase()) n = title(n);
    const arrRaw = String(pick(f, ["arrdt", "arrondissement", "arr", "c_ar"]) ?? "");
    const a = [...arrRaw.matchAll(/\d+/g)].map((x) => Number(x[0]) % 100).filter((x) => x >= 1 && x <= 20);
    const geo = pick(f, ["geo_point_2d", "geo_point"]);
    const [lat, lng] = Array.isArray(geo) ? geo : geo && typeof geo === "object" ? [geo.lat, geo.lon] : [];
    add({
      n: n.trim(),
      a,
      o: pick(f, ["orig", "origine", "origine_du_nom"]) || undefined,
      h: pick(f, ["historique", "hist"]) || undefined,
      q: pick(f, ["quartier"]) || undefined,
      lat, lng,
      official: true,
    });
    official++;
  }
}

const list = [...voies.values()]
  .map(({ official: _o, ...v }) => ({ ...v, t: typeOf(v.n) }))
  .sort((x, y) => x.n.localeCompare(y.n, "fr"));
writeFileSync(here + "../src/data/voies.json", JSON.stringify(list));
console.log(`${list.length} voies écrites dans src/data/voies.json (${official} lignes officielles importées)`);
