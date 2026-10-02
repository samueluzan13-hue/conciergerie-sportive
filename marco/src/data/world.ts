import type { Spot } from "./spots";
import { GUIDES } from "./world/index";
import { toSpots } from "./world/types";
// Lieux des autres villes (Madrid, Barcelone, Londres, Lisbonne, Rome, Amsterdam, New York, Berlin).
export const WORLD_SPOTS: Spot[] = GUIDES.flatMap(([city, g]) => toSpots(city, g.spots));
