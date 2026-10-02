import type { CityId } from "../cities";
import type { Category, Diet, Mood, Spot } from "../spots";
import type { StreetStory } from "../streets";
import type { CityDietZone, CityNight } from "../world-guides";

// Format compact d'un lieu :
// [id, nom, catégorie, quartier, adresse, lat, lng, prix (1-3), caché (1-3), ambiances, pitch, astuce, durée (min), site officiel, étoiles (hôtels), régime]
export type Row = [
  string, string, Category, string, string, number, number, 1 | 2 | 3, 1 | 2 | 3, string, string, string, number,
  string?, number?, Diet?,
];

export interface CityGuide {
  spots: Row[];
  streets: Omit<StreetStory, "city">[];
  nights: CityNight[];
  diet: CityDietZone[];
}

export function toSpots(city: CityId, rows: Row[]): Spot[] {
  return rows.map(([id, name, category, quartier, address, lat, lng, price, hidden, moods, pitch, tip, duration, website, stars, diet]) => ({
    id,
    city,
    name,
    category,
    quartier,
    arrondissement: 0,
    address,
    lat,
    lng,
    price,
    hidden,
    moods: moods ? (moods.split(",") as Mood[]) : [],
    pitch,
    tip,
    duration: category === "hotel" ? 0 : duration,
    ...(website ? { website } : {}),
    ...(category === "hotel" ? { stars: stars ?? 0, bookable: "hotel" as const } : {}),
    ...(diet ? { diet: [diet] } : {}),
  }));
}
