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

export const GUIDES: [CityId, CityGuide][] = [
  ["madrid", MADRID], ["barcelone", BARCELONE], ["londres", LONDRES], ["lisbonne", LISBONNE],
  ["rome", ROME], ["amsterdam", AMSTERDAM], ["new-york", NEW_YORK], ["berlin", BERLIN],
];
