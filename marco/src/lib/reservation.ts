import type { Spot } from "../data/spots";

/** Adresse de réservation DIRECTE : le site officiel du lieu. */
export function reserveUrl(spot: Spot): string {
  if (spot.website) return spot.website;
  const query = `${spot.name} ${spot.address}`;
  // Sur le vrai site : le serveur retrouve le site officiel via Google Places, puis redirige.
  if (!import.meta.env.VITE_PREVIEW) return `/api/reserve?q=${encodeURIComponent(query)}`;
  // Dans l'aperçu : on ouvre directement le premier résultat de recherche du site officiel.
  return duckyUrl(spot.name);
}

export const duckyUrl = (name: string) =>
  `https://duckduckgo.com/?q=${encodeURIComponent(`!ducky ${name} Paris site officiel`)}`;

export const siteLabel = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/.*$/, "");
