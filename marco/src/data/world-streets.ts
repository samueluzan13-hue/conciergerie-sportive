import type { StreetStory } from "./streets";
import { GUIDES } from "./world/index";
// Rues racontées des autres villes.
export const WORLD_STREETS: StreetStory[] = GUIDES.flatMap(([city, g]) => g.streets.map((s) => ({ ...s, city })));
