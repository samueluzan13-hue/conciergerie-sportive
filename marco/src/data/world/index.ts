import type { CityId } from "../cities";
import type { CityGuide } from "./types";
import { MADRID } from "./madrid";
import { BARCELONE } from "./barcelone";
import { LONDRES } from "./londres";
import { LISBONNE } from "./lisbonne";
import { ROME } from "./rome";
import { AMSTERDAM } from "./amsterdam";
import { NEW_YORK } from "./new-york";
import { BERLIN } from "./berlin";

import { BARCELONE_PLUS, MADRID_PLUS } from "./plus-madrid-barcelone";
import { LISBONNE_PLUS, LONDRES_PLUS } from "./plus-londres-lisbonne";
import { AMSTERDAM_PLUS, ROME_PLUS } from "./plus-rome-amsterdam";
import { BERLIN_PLUS, NEW_YORK_PLUS } from "./plus-newyork-berlin";
import type { Row } from "./types";

const withPlus = (g: CityGuide, plus: Row[]): CityGuide => ({ ...g, spots: [...g.spots, ...plus] });

export const GUIDES: [CityId, CityGuide][] = [
  ["madrid", withPlus(MADRID, MADRID_PLUS)], ["barcelone", withPlus(BARCELONE, BARCELONE_PLUS)],
  ["londres", withPlus(LONDRES, LONDRES_PLUS)], ["lisbonne", withPlus(LISBONNE, LISBONNE_PLUS)],
  ["rome", withPlus(ROME, ROME_PLUS)], ["amsterdam", withPlus(AMSTERDAM, AMSTERDAM_PLUS)],
  ["new-york", withPlus(NEW_YORK, NEW_YORK_PLUS)], ["berlin", withPlus(BERLIN, BERLIN_PLUS)],
];
