// Traçabilité partenaires : chaque client envoyé par Marco laisse une trace (réservation avec code,
// appel, itinéraire, visite du site) pour pouvoir dire à un établissement combien de clients Marco lui a apportés.
import type { Spot } from "../data/spots";
import type { Place } from "./annuaire";
import type { Booking, Visit } from "./cloud";

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Clé stable d'un lieu : la fiche Marco, ou le nom + la ville pour l'annuaire complet. */
export const spotKey = (s: Spot) => `spot:${s.id}`;
export const placeKey = (p: Place, city: string) => `dir:${city}:${norm(p.name)}`;

/** Ajoute les paramètres de suivi Marco à un lien vers le site d'un établissement : il voit les visites venues de Marco dans ses statistiques. */
export function withUtm(url: string) {
  if (!/^https?:\/\//.test(url) || /google\.|duckduckgo\.|booking\.com|airbnb\./.test(url)) return url;
  try {
    const u = new URL(url);
    u.searchParams.set("utm_source", "marco");
    u.searchParams.set("utm_medium", "app");
    u.searchParams.set("utm_campaign", "marco-concierge");
    return u.toString();
  } catch {
    return url;
  }
}

export type Action = "reserver" | "appel" | "itineraire" | "site" | "resa-hotel";
export const ACTION_LABEL: Record<string, string> = {
  reserver: "Réservations via le site",
  appel: "Appels",
  itineraire: "Itinéraires",
  site: "Visites du site",
  "resa-hotel": "Recherches de chambre",
};

export interface PartnerStats {
  placeKey: string;
  place: string;
  city: string;
  bookings: number;
  confirmed: number;
  honored: number;
  covers: number;
  actions: Record<string, number>;
  /** total des clients apportés (réservations + gestes) */
  leads: number;
  last: number;
}

export function partnerStats(bookings: Booking[], visits: Visit[], since: number): PartnerStats[] {
  const by = new Map<string, PartnerStats>();
  const get = (k: string, place: string, city: string) => {
    let s = by.get(k);
    if (!s) by.set(k, (s = { placeKey: k, place, city, bookings: 0, confirmed: 0, honored: 0, covers: 0, actions: {}, leads: 0, last: 0 }));
    return s;
  };
  for (const b of bookings) {
    if (b.createdAt < since) continue;
    const s = get(b.placeKey, b.place, b.city);
    s.bookings++;
    if (b.status === "confirmee") s.confirmed++;
    if (b.honored) s.honored++;
    if (b.status !== "impossible") s.covers += b.people;
    s.leads++;
    s.last = Math.max(s.last, b.createdAt);
  }
  for (const v of visits) {
    if (v.at < since) continue;
    const s = get(v.placeKey, v.place, v.city);
    s.actions[v.action] = (s.actions[v.action] ?? 0) + 1;
    s.leads++;
    s.last = Math.max(s.last, v.at);
  }
  return [...by.values()].sort((a, b) => b.leads - a.leads || b.covers - a.covers);
}

const fr = (t: number) => new Date(t).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

/** Le rapport à envoyer à l'établissement. */
export function partnerReport(s: PartnerStats, since: number) {
  const acts = Object.entries(s.actions).filter(([, n]) => n > 0).map(([a, n]) => `- ${ACTION_LABEL[a] ?? a} : ${n}`);
  return [
    `Rapport Marco pour ${s.place}`,
    `Période : du ${fr(since)} au ${fr(Date.now())}`,
    "",
    `${s.leads} contact${s.leads > 1 ? "s" : ""} client${s.leads > 1 ? "s" : ""} générés vers votre établissement par Marco (réservations, appels, itinéraires, visites de votre site).`,
    "",
    `Réservations faites par Marco : ${s.bookings} (${s.covers} couvert${s.covers > 1 ? "s" : ""})`,
    `- confirmées : ${s.confirmed}`,
    `- clients venus (code Marco présenté) : ${s.honored}`,
    ...(acts.length ? ["", "Autres contacts générés par Marco :", ...acts] : []),
    "",
    "Chaque client réservé par Marco présente un code « M-XXXXX » à son arrivée.",
    "Les visites de votre site venues de Marco portent la mention utm_source=marco dans vos statistiques.",
  ].join("\n");
}
