import type { Spot } from "../data/spots";
import { cityById } from "../data/cities";

/** Adresse de réservation DIRECTE : le site officiel du lieu. */
export function reserveUrl(spot: Spot): string {
  if (spot.website) return spot.website;
  const city = cityById(spot.city);
  const query = `${spot.name} ${spot.address}`;
  // Sur le vrai site : le serveur retrouve le site officiel via Google Places, puis redirige.
  if (!import.meta.env.VITE_PREVIEW) return `/api/reserve?q=${encodeURIComponent(query)}&city=${encodeURIComponent(city.id)}`;
  // Dans l'aperçu : on ouvre directement le premier résultat de recherche du site officiel.
  return duckyUrl(spot.name, city.name);
}

export const duckyUrl = (name: string, city = "Paris") =>
  `https://duckduckgo.com/?q=${encodeURIComponent(`!ducky ${name} ${city} site officiel`)}`;

export const siteLabel = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/.*$/, "");
