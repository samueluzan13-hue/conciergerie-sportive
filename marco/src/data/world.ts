import type { Spot } from "./spots";
import { GUIDES } from "./world/index";
import { TENDANCE } from "./world/tendance";
import { toSpots } from "./world/types";

// Lieux des autres villes (Madrid, Barcelone, Londres, Lisbonne, Rome, Amsterdam, New York, Berlin),
// plus les adresses tendance / insolites / cachées de chaque ville (Paris compris).
const arrOf = (address: string) => {
  const m = address.match(/\b750(\d\d)\b/);
  return m ? Number(m[1]) : 0;
};

export const WORLD_SPOTS: Spot[] = [
  ...GUIDES.flatMap(([city, g]) => toSpots(city, g.spots)),
  ...TENDANCE.flatMap(([city, rows]) => toSpots(city, rows).map((s) => (city === "paris" ? { ...s, arrondissement: arrOf(s.address) } : s))),
];
