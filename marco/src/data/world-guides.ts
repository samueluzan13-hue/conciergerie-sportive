import type { CityId } from "./cities";
import type { Diet } from "./spots";
import type { NightVenue } from "./guides";
import { GUIDES } from "./world/index";

/** Sortir le soir dans les autres villes : quartier par quartier. */
export interface CityNight {
  district: string;
  vibe: string;
  venues: NightVenue[];
}

/** Manger casher / halal dans les autres villes. */
export interface CityDietZone {
  diet: Diet;
  name: string;
  streets: string;
  text: string;
}

export const WORLD_NIGHTS: Partial<Record<CityId, CityNight[]>> = Object.fromEntries(GUIDES.map(([c, g]) => [c, g.nights]));
export const WORLD_DIET: Partial<Record<CityId, CityDietZone[]>> = Object.fromEntries(GUIDES.map(([c, g]) => [c, g.diet]));
