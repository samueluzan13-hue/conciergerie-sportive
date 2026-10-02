import { citySpots, QUARTIERS, type Category, type Spot } from "../data/spots";
import { cityById, type CityId } from "../data/cities";
import { distanceKm, formatTime, travel } from "./geo";

export type Who = "solo" | "date" | "amis" | "famille";
export type Duration = "3h" | "journee" | "soiree";
export type Budget = 1 | 2 | 3;
export type Envie = "manger" | "culture" | "verre" | "nature" | "insolite" | "cafe" | "activite";

export interface PlanInput {
  who: Who;
  duration: Duration;
  budget: Budget;
  envies: Envie[];
  quartier: string;
  hiddenOnly: boolean;
  /** ville (absent = Paris) */
  city?: CityId;
  /** lieux déjà utilisés (plans sur plusieurs jours) */
  exclude?: Set<string>;
}

export interface PlanStop {
  spot: Spot;
  start: string;
  end: string;
  travel?: { mode: string; minutes: number };
  why: string;
}

export interface Plan {
  title: string;
  intro: string;
  stops: PlanStop[];
  totalMinutes: number;
}

const ENVIE_CATS: Record<Envie, Category[]> = {
  manger: ["resto"],
  culture: ["culture"],
  verre: ["bar"],
  nature: ["nature"],
  insolite: ["insolite"],
  cafe: ["cafe"],
  activite: ["activite"],
};

/** Squelette de la journée : une suite de "créneaux" de catégories. */
function skeleton(input: PlanInput): { cats: Category[]; startMin: number }[] {
  const wants = (e: Envie) => input.envies.length === 0 || input.envies.includes(e);
  const day: Category[][] = [];
  if (input.duration === "3h") {
    if (wants("cafe")) day.push(["cafe"]);
    if (wants("activite")) day.push(["activite"]);
    if (wants("culture") || wants("insolite")) day.push(["culture", "insolite"]);
    if (wants("nature")) day.push(["nature"]);
    if (wants("verre")) day.push(["bar"]);
    if (wants("manger")) day.push(["resto"]);
    return day.slice(0, 3).map((cats) => ({ cats, startMin: 14 * 60 }));
  }
  if (input.duration === "soiree") {
    if (wants("nature") || wants("insolite")) day.push(["nature", "insolite"]);
    day.push(["bar"]);
    if (wants("manger") || input.envies.length === 0) day.push(["resto"]);
    if (wants("verre") || input.who === "amis" || input.who === "date") day.push(["bar"]);
    return day.slice(0, 4).map((cats) => ({ cats, startMin: 18 * 60 + 30 }));
  }
  // journée
  day.push(["cafe"]);
  day.push(wants("culture") ? ["culture"] : ["insolite", "nature"]);
  day.push(["resto"]);
  if (wants("insolite")) day.push(["insolite"]);
  if (wants("activite") || input.who === "famille") day.push(["activite"]);
  if (wants("nature") || input.who === "famille") day.push(["nature"]);
  if (wants("culture") && input.envies.length > 1) day.push(["culture"]);
  if (input.who !== "famille") day.push(["bar"]);
  return day.slice(0, 6).map((cats) => ({ cats, startMin: 10 * 60 }));
}

function score(spot: Spot, input: PlanInput, from: { lat: number; lng: number }) {
  let s = 0;
  s -= distanceKm(from, spot) * 1.6; // cohérence géographique avant tout
  s += spot.hidden * (input.hiddenOnly ? 2 : 0.8);
  if (spot.price > input.budget) s -= 4 * (spot.price - input.budget);
  if (input.who === "date" && spot.moods.includes("romantique")) s += 2;
  if (input.who === "famille" && spot.moods.includes("famille")) s += 2.5;
  if (input.who === "famille" && spot.category === "bar") s -= 10;
  if (input.who === "amis" && spot.moods.includes("tendance")) s += 1.5;
  if (input.budget === 1 && spot.moods.includes("petit-budget")) s += 1.5;
  return s + Math.random() * 0.6; // un peu de surprise à chaque génération
}

const WHY: Record<Who, string[]> = {
  solo: ["Parfait pour flâner à ton rythme.", "Idéal en solo, personne pour te presser.", "Tu vas adorer t'y perdre."],
  date: ["Effet waouh garanti sur ton date.", "Assez intime pour parler, assez beau pour impressionner.", "Le genre d'endroit dont on se souvient à deux."],
  amis: ["Ta bande va te remercier.", "Ambiance qui se partage.", "Le spot parfait pour refaire le monde."],
  famille: ["Les petits comme les grands vont adorer.", "Sans stress avec les enfants.", "Une vraie découverte pour toute la famille."],
};

const TITLES: Record<Duration, Record<Who, string>> = {
  "3h": { solo: "3 heures rien que pour toi", date: "Un date en 3 heures chrono", amis: "3 heures entre potes", famille: "3 heures en famille" },
  soiree: { solo: "Ta soirée parisienne", date: "Soirée date qui fait mouche", amis: "La soirée de la bande", famille: "Soirée douce en famille" },
  journee: { solo: "Ta journée sur-mesure", date: "Une journée à deux", amis: "Journée entre amis", famille: "Grande journée en famille" },
};

export function generatePlan(input: PlanInput): Plan {
  const city = cityById(input.city);
  const q = city.id === "paris"
    ? QUARTIERS.find((x) => x.name === input.quartier) ?? QUARTIERS[0]
    : city.districts.find((d) => d.name === input.quartier) ?? city.center;
  let pos = { lat: q.lat, lng: q.lng };
  const used = input.exclude ?? new Set<string>();
  const pool = citySpots(city.id);
  const slots = skeleton(input);
  let clock = slots[0]?.startMin ?? 14 * 60;
  const stops: PlanStop[] = [];

  for (const slot of slots) {
    const candidates = pool.filter((s) => slot.cats.includes(s.category) && !used.has(s.id));
    if (!candidates.length) continue;
    const best = candidates.map((s) => ({ s, sc: score(s, input, pos) })).sort((a, b) => b.sc - a.sc)[0].s;
    const t = stops.length ? travel(pos, best) : undefined;
    if (t) clock += t.minutes;
    const start = clock;
    clock += best.duration;
    const whys = WHY[input.who];
    stops.push({
      spot: best,
      start: formatTime(start),
      end: formatTime(clock),
      travel: t,
      why: whys[stops.length % whys.length],
    });
    used.add(best.id);
    pos = best;
  }

  const total = clock - (slots[0]?.startMin ?? clock);
  return {
    title: TITLES[input.duration][input.who],
    intro:
      input.hiddenOnly
        ? `Zéro attrape-touristes : que des adresses que les gens de ${city.name} gardent pour eux.`
        : "Google t'aurait donné 400 options. Marco t'en donne quelques-unes, mais des bonnes.",
    stops,
    totalMinutes: total,
  };
}
