// Le répertoire complet de chaque ville : tous les restos, bars, cafés, sorties, activités, salles de sport,
// cours / ateliers, spas et hôtels connus (source : Overture Maps, licence CDLA-Permissive-2.0 / ODbL).
// Un fichier par ville, chargé seulement quand on en a besoin (public/annuaire-data/<ville>.json).

import { cityById, type City, type CityId } from "../data/cities";
import { arrFromText } from "../data/guides";
import { QUARTIERS } from "../data/spots";
import { distanceKm } from "./geo";

export type Group = "r" | "b" | "c" | "n" | "a" | "s" | "k" | "w" | "h";

export interface Place {
  /** identifiant stable dans le fichier de la ville */
  i: number;
  name: string;
  group: Group;
  type: string;
  lat: number;
  lng: number;
  address: string;
  postcode: string;
  /** site officiel (sans https://) ou page Instagram / Facebook */
  web: string;
  phone: string;
  tags: string[];
}

export const GROUP_LABEL: Record<Group, string> = {
  r: "Restos",
  b: "Bars",
  c: "Cafés & douceurs",
  n: "Clubs & concerts",
  a: "Culture & sorties",
  s: "Sport",
  k: "Cours & ateliers",
  w: "Spa & bien-être",
  h: "Hôtels",
};

export const GROUP_ICON: Record<Group, string> = { r: "🍽️", b: "🍸", c: "☕", n: "🎶", a: "🏛️", s: "🏃", k: "🎨", w: "💆", h: "🛏️" };

type Raw = [string, Group, number, number, number, string, string, string, string, string];
interface File { v: number; city: string; types: string[]; rows: Raw[] }

const cache = new Map<CityId, Promise<Place[]>>();

function fileUrl(city: CityId) {
  // aperçu (page unique) : fichier publié à côté de la page ; site : dossier public
  return import.meta.env.VITE_PREVIEW ? `annuaire-data/${city}.json` : `/annuaire-data/${city}.json`;
}

export function loadDirectory(city: CityId): Promise<Place[]> {
  let p = cache.get(city);
  if (!p) {
    p = fetch(fileUrl(city))
      .then((r) => {
        if (!r.ok) throw new Error(`annuaire ${r.status}`);
        return r.json() as Promise<File>;
      })
      .then((f) =>
        f.rows.map((r, i) => ({
          i,
          name: r[0],
          group: r[1],
          type: f.types[r[2]],
          lat: r[3],
          lng: r[4],
          address: r[5],
          postcode: r[6],
          web: r[7],
          phone: r[8],
          tags: r[9] ? r[9].split(",") : [],
        })),
      );
    p.catch(() => cache.delete(city));
    cache.set(city, p);
  }
  return p;
}

/* ---------- libellés en français ---------- */

const NATION: Record<string, string> = {
  afghani: "afghan", african: "africain", american: "américain", arabian: "arabe", argentine: "argentin", armenian: "arménien",
  asian: "asiatique", asian_fusion: "fusion asiatique", australian: "australien", austrian: "autrichien", azerbaijani: "azerbaïdjanais",
  bangladeshi: "bangladais", basque: "basque", belgian: "belge", bolivian: "bolivien", brazilian: "brésilien", british: "britannique",
  bulgarian: "bulgare", burmese: "birman", cajun_and_creole: "cajun / créole", cambodian: "cambodgien", canadian: "canadien",
  cantonese: "cantonais", caribbean: "caribéen", catalan: "catalan", chilean: "chilien", chinese: "chinois", colombian: "colombien",
  cuban: "cubain", czech: "tchèque", dominican: "dominicain", east_african: "est-africain", eastern_european: "d'Europe de l'Est",
  ecuadorian: "équatorien", egyptian: "égyptien", eritrean: "érythréen", ethiopian: "éthiopien", european: "européen",
  filipino: "philippin", french: "français", fujian: "fujianais", georgian: "géorgien", german: "allemand", greek: "grec",
  guatemalan: "guatémaltèque", haitian: "haïtien", hawaiian: "hawaïen", himalayan: "himalayen", honduran: "hondurien",
  hungarian: "hongrois", iberian: "ibérique", indian: "indien", indo_chinese: "indo-chinois", indonesian: "indonésien",
  international_fusion: "fusion", irish: "irlandais", israeli: "israélien", italian: "italien", jamaican: "jamaïcain",
  japanese: "japonais", jewish: "juif", korean: "coréen", kurdish: "kurde", latin_american: "latino", lebanese: "libanais",
  malaysian: "malaisien", mediterranean: "méditerranéen", mexican: "mexicain", middle_eastern: "moyen-oriental",
  mongolian: "mongol", moroccan: "marocain", nepalese: "népalais", nicaraguan: "nicaraguayen", nigerian: "nigérian",
  north_indian: "indien du Nord", pakistani: "pakistanais", pan_asian: "panasiatique", paraguayan: "paraguayen", persian: "persan",
  peruvian: "péruvien", polish: "polonais", portuguese: "portugais", puerto_rican: "portoricain", romanian: "roumain",
  russian: "russe", salvadoran: "salvadorien", scandinavian: "scandinave", scottish: "écossais", senegalese: "sénégalais",
  serbo_croatian: "serbo-croate", shanghainese: "shanghaïen", sichuan: "sichuanais", singaporean: "singapourien",
  south_african: "sud-africain", south_american: "sud-américain", south_asian: "sud-asiatique", south_indian: "indien du Sud",
  southeast_asian: "d'Asie du Sud-Est", southern_american: "du Sud des États-Unis", spanish: "espagnol", sri_lankan: "sri-lankais",
  swiss: "suisse", syrian: "syrien", taiwanese: "taïwanais", tatar: "tatar", thai: "thaï", tibetan: "tibétain",
  trinidadian: "trinidadien", turkish: "turc", ukrainian: "ukrainien", uruguayan: "uruguayen", uzbek: "ouzbek",
  venezuelan: "vénézuélien", vietnamese: "vietnamien", west_african: "ouest-africain",
};

const TYPE_FR: Record<string, string> = {
  restaurant: "Restaurant", pizza_restaurant: "Pizzeria", burger_restaurant: "Burgers", sushi_restaurant: "Sushis",
  seafood_restaurant: "Fruits de mer", fish_restaurant: "Poisson", breakfast_and_brunch_restaurant: "Brunch",
  steakhouse: "Steakhouse", meat_restaurant: "Viandes", chicken_restaurant: "Poulet", chicken_wings_restaurant: "Chicken wings",
  doner_kebab_restaurant: "Kebab", vegetarian_restaurant: "Végétarien", vegan_restaurant: "Vegan", barbecue_restaurant: "Barbecue",
  salad_bar: "Salades", bar_and_grill_restaurant: "Bar-grill", pancake_house: "Crêpes & pancakes", kosher_restaurant: "Casher",
  halal_restaurant: "Halal", gluten_free_restaurant: "Sans gluten", health_food_restaurant: "Healthy", ramen_restaurant: "Ramen",
  dim_sum_restaurant: "Dim sum", dumpling_restaurant: "Raviolis", taco_restaurant: "Tacos", texmex_restaurant: "Tex-mex",
  falafel_restaurant: "Falafels", poke_restaurant: "Poké", wok_restaurant: "Wok", soup_restaurant: "Soupes", buffet_restaurant: "Buffet",
  fast_food_restaurant: "Fast-food", food_truck_stand: "Food truck", hot_dog_restaurant: "Hot-dogs", fish_and_chips_restaurant: "Fish & chips",
  comfort_food_restaurant: "Cuisine réconfort", molecular_gastronomy_restaurant: "Gastronomie moléculaire", theme_restaurant: "Resto à thème",
  waffle_restaurant: "Gaufres", empanada_restaurant: "Empanadas", piadina_restaurant: "Piadina", kofta_restaurant: "Kefta",
  curry_sausage_restaurant: "Currywurst", cheesesteak_restaurant: "Cheesesteak", poutinerie_restaurant: "Poutine",
  live_and_raw_food_restaurant: "Cru & vivant", diy_foods_restaurant: "Cuisine maison", pop_up_restaurant: "Pop-up", soul_food: "Soul food",
  tapas_bar: "Tapas", gastropub: "Gastropub", diner: "Diner", bistro: "Bistrot", brasserie: "Brasserie", fondue_restaurant: "Fondue",
  friterie: "Friterie", flatbread_shop: "Galettes", bagel_shop: "Bagels", sandwich_shop: "Sandwichs", delicatessen: "Traiteur / deli",
  cafeteria: "Cafétéria",
  bar: "Bar", cocktail_bar: "Bar à cocktails", pub: "Pub", wine_bar: "Bar à vin", beer_bar: "Bar à bières", sports_bar: "Bar sportif",
  hookah_bar: "Bar à chicha", gay_bar: "Bar LGBT", irish_pub: "Pub irlandais", dive_bar: "Bar de quartier", hotel_bar: "Bar d'hôtel",
  speakeasy: "Speakeasy", whiskey_bar: "Bar à whisky", champagne_bar: "Bar à champagne", bar_tabac: "Bar-tabac", tiki_bar: "Bar tiki",
  piano_bar: "Piano-bar", cigar_bar: "Bar à cigares", sake_bar: "Bar à saké", beach_bar: "Bar de plage", lounge: "Lounge",
  milk_bar: "Milk bar", airport_lounge: "Salon d'aéroport",
  cafe: "Café", coffee_shop: "Coffee shop", coffee_roastery: "Torréfacteur", tea_room: "Salon de thé", bakery: "Boulangerie",
  ice_cream_shop: "Glacier", gelato_shop: "Gelato", dessert_shop: "Desserts", chocolatier: "Chocolatier", donut_shop: "Donuts",
  cupcake_shop: "Cupcakes", frozen_yogurt_shop: "Frozen yogurt", pie_shop: "Tartes", macaron_shop: "Macarons", candy_store: "Confiserie",
  smoothie_juice_bar: "Jus & smoothies", bubble_tea_shop: "Bubble tea", acai_bowls: "Açaí bowls", cat_cafe: "Bar à chats",
  dog_cafe: "Café à chiens", internet_cafe: "Cybercafé", hong_kong_style_cafe: "Café hongkongais", pretzel_shop: "Bretzels",
  japanese_confectionery_shop: "Pâtisserie japonaise",
  dance_club: "Boîte de nuit", nightlife_venue: "Sortie de nuit", music_venue: "Salle de concert", jazz_and_blues_venue: "Club de jazz",
  karaoke_venue: "Karaoké", cabaret: "Cabaret", salsa_club: "Salsa", bar_crawl: "Tournée des bars", club_crawl: "Tournée des clubs",
  museum: "Musée", art_museum: "Musée d'art", art_gallery: "Galerie d'art", historic_site: "Site historique", monument: "Monument",
  theatre_venue: "Théâtre", performing_arts_venue: "Spectacles", movie_theater: "Cinéma", arts_and_entertainment: "Loisirs & culture",
  cultural_center: "Centre culturel", park: "Parc", garden: "Jardin", botanical_garden: "Jardin botanique", community_garden: "Jardin partagé",
  zoo: "Zoo", aquarium: "Aquarium", amusement_park: "Parc d'attractions", water_park: "Parc aquatique", escape_room: "Escape game",
  gaming_venue: "Jeux", bowling_alley: "Bowling", public_plaza: "Place", playground: "Aire de jeux", library: "Bibliothèque",
  event_venue: "Lieu d'événements", stadium_arena: "Stade / aréna", stadium: "Stade", shopping_mall: "Centre commercial",
  department_store: "Grand magasin", opera_and_ballet: "Opéra & ballet", palace: "Palais", ruin: "Ruines", auditorium: "Auditorium",
  amphitheater: "Amphithéâtre", history_museum: "Musée d'histoire", science_museum: "Musée des sciences", modern_art_museum: "Art moderne",
  contemporary_art_museum: "Art contemporain", design_museum: "Musée du design", childrens_museum: "Musée pour enfants",
  photography_museum: "Musée de la photo", outdoor_movie_space: "Cinéma en plein air", dinner_theater: "Dîner-spectacle",
  indoor_playcenter: "Parc de jeux couvert", laser_tag: "Laser game", miniature_golf_course: "Minigolf", petting_zoo: "Mini-ferme",
  gym: "Salle de sport", fitness_studio: "Studio fitness", yoga_studio: "Yoga", pilates_studio: "Pilates", barre_class: "Barre au sol",
  boxing_gym: "Boxe", boxing_class: "Cours de boxe", rock_climbing_gym: "Escalade", rock_climbing_spot: "Escalade",
  swimming_pool: "Piscine", tennis_stadium: "Tennis", martial_arts_club: "Arts martiaux", fitness_trainer: "Coach sportif",
  cycling_class: "Vélo indoor", cycle_studio: "Vélo indoor", running_club: "Club de course", soccer_club: "Football", football_club: "Football",
  golf_club: "Golf", sport_or_fitness_facility: "Équipement sportif", sports_and_recreation: "Sport & loisirs",
  sport_or_recreation_club: "Club sportif", bike_rental: "Location de vélos", boat_rental_and_training: "Location de bateaux",
  pool_hall: "Billard", pool_billiards: "Billard", gymnastics_center: "Gymnastique", taekwondo_club: "Taekwondo", karate_club: "Karaté",
  dance_studio: "Danse", art_school: "Cours d'art / peinture", cooking_school: "Cours de cuisine", music_school: "Cours de musique",
  drama_school: "Cours de théâtre", photography_class: "Cours de photo", language_school: "Cours de langue", sports_school: "École de sport",
  circus_school: "École de cirque", bartending_school: "Cours de cocktail", specialty_school: "Atelier / école",
  spa: "Spa", day_spa: "Spa", health_spa: "Spa", massage_therapy: "Massage", sauna: "Sauna", public_bath_house: "Bains / hammam",
  meditation_center: "Méditation", float_spa: "Flottaison",
  hotel: "Hôtel", bed_and_breakfast: "Chambres d'hôtes", lodging: "Hébergement", hostel: "Auberge de jeunesse",
  service_apartment: "Appart-hôtel", motel: "Motel", lodge: "Lodge", self_catering_accommodation: "Location", cottage: "Cottage",
};

export function typeLabel(type: string): string {
  if (TYPE_FR[type]) return TYPE_FR[type];
  const m = type.match(/^(.*)_restaurant$/);
  if (m && NATION[m[1]]) return `Restaurant ${NATION[m[1]]}`;
  return type.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
}

/** Libellé de cuisine plus naturel : « Italien », « Japonais »… */
export function placeKind(p: Place): string {
  const m = p.type.match(/^(.*)_restaurant$/);
  if (m && NATION[m[1]] && !TYPE_FR[p.type]) return NATION[m[1]].replace(/^./, (c) => c.toUpperCase());
  return typeLabel(p.type);
}

/* ---------- liens pratiques ---------- */

export const webUrl = (p: Place) => (p.web ? (/^https?:/.test(p.web) ? p.web : `https://${p.web}`) : "");
export const isSocial = (p: Place) => /instagram|facebook/.test(p.web);
export const mapsUrl = (p: Place, city: City) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.name} ${p.address || ""} ${city.name}`)}`;
export const telUrl = (p: Place) => (p.phone ? `tel:${p.phone.replace(/[^\d+]/g, "")}` : "");

/** Réserver une chambre : le site officiel de l'hôtel, sinon la page de l'hôtel sur Booking.com aux bonnes dates. */
export function roomBookingUrls(p: Place, city: City, stay?: { checkin?: string; checkout?: string; adults?: number; rooms?: number }) {
  const q = new URLSearchParams({ ss: `${p.name}, ${city.name}`, group_adults: String(stay?.adults ?? 2), no_rooms: String(stay?.rooms ?? 1), lang: "fr" });
  if (stay?.checkin) q.set("checkin", stay.checkin);
  if (stay?.checkout) q.set("checkout", stay.checkout);
  const official = p.web && !isSocial(p) ? webUrl(p) : "";
  return { official, booking: `https://www.booking.com/searchresults.fr.html?${q.toString()}` };
}

/** Réserver une table / une activité : le site officiel (souvent avec son module de réservation), sinon le lien vers la fiche. */
export function bookUrl(p: Place, city: City) {
  return webUrl(p) || `https://www.google.com/search?q=${encodeURIComponent(`${p.name} ${city.name} réserver`)}`;
}

export const arrOf = (p: Place) => {
  const m = p.postcode.match(/^75(0\d\d|116)$/);
  if (!m) return 0;
  return m[1] === "116" ? 16 : Number(m[1]);
};

export function placeArea(p: Place, city: City) {
  if (city.id === "paris") {
    const a = arrOf(p);
    if (a) return a === 1 ? "1er" : `${a}e`;
  }
  let best = "";
  let d = 1.3;
  for (const z of city.districts) {
    const k = distanceKm(p, z);
    if (k < d) {
      d = k;
      best = z.name;
    }
  }
  return best;
}

/* ---------- recherche en langage naturel ---------- */

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

const GROUP_WORDS: [Group, RegExp][] = [
  ["h", /\b(hotels?|hotel|dormir|chambres?|nuits? d'hotel|hebergements?|auberges?|hostel|b&b|chambres? d'hotes|logements?)\b/],
  ["k", /\b(cours|ateliers?|stages?|ecoles? de|apprendre|initiation|lecons?)\b/],
  ["w", /\b(spa|massages?|hammams?|sauna|bien[- ]etre|detente|relaxation|meditation)\b/],
  ["n", /\b(boites?( de nuit)?|clubs?|danser|concerts?|jazz|karaoke|cabaret|live|salsa|techno)\b/],
  ["b", /\b(bars?|cocktails?|pubs?|boire un verre|un verre|apero|aperitif|bieres?|vins?|rooftop|speakeasy|whisky|chicha)\b/],
  ["c", /\b(cafes?|coffee|salon de the|boulangeries?|patisseries?|glaces?|glaciers?|gouter|dessert|chocolat|crepes?|petit[- ]dej|brunch cafe|bubble tea)\b/],
  ["s", /\b(sport|sportive|salles? de sport|gym|fitness|muscu|musculation|yoga|pilates|escalade|grimpe|boxe|piscine|natation|nager|tennis|foot|football|padel|courir|running|crossfit|velo|danse|arts? martiaux|karate|judo|golf|bowling|billard)\b/],
  ["a", /\b(activites?|visiter|visites?|musees?|expos?|expositions?|galeries?|monuments?|theatres?|cinemas?|films?|parcs?|jardins?|zoo|aquarium|spectacles?|opera|escape|culture|enfants|famille|balade|loisirs?|faire quoi|quoi faire|sortir)\b/],
  ["r", /\b(restos?|restaurants?|restau|manger|diner|dejeuner|bouffe|cuisine|table|brunch|food|plats?|gastronomique|bistrots?|brasseries?|pizzas?|sushis?|burgers?|kebab|tacos|ramen)\b/],
];

/** mot-clé → morceaux de type (taxonomie) à chercher */
const TYPE_WORDS: [RegExp, string[], Group?][] = [
  // cuisines du monde (orthographes approximatives acceptées)
  [/\bitalien|\bpates\b|\bpasta|\btrattoria|\bosteria/, ["italian", "pizza", "piadina"], "r"],
  [/\bpizz/, ["pizza"], "r"],
  [/\bjapon|\bsushis?\b|\bmakis?\b|\bramen|\bizakaya|\budon/, ["japanese", "sushi", "ramen"], "r"],
  [/\bchinois|\bchine\b|\bdim sum|\braviolis?\b|\bcantonais|\bsichuan|\bse-?tchouan|\bcanard laque/, ["chinese", "cantonese", "sichuan", "dim_sum", "dumpling", "shanghainese", "fujian", "hong_kong", "taiwanese"], "r"],
  [/\bthai|\bthailand|\btailand|\bpad thai/, ["thai"], "r"],
  [/\bvietnam|\bpho\b|\bbanh|\bbo bun|\bbobun/, ["vietnamese"], "r"],
  [/\bcoreen|\bcoree\b|\bbibimbap|\bkorean/, ["korean"], "r"],
  [/\bindien|\binde\b|\bcurry|\btandoori|\bbiryani/, ["indian", "south_asian"], "r"],
  [/\bpakistan/, ["pakistani"], "r"],
  [/\bsri[- ]?lank|\btamoul/, ["sri_lankan", "south_indian"], "r"],
  [/\bnepal|\btibet|\bhimalay/, ["nepalese", "tibetan", "himalayan"], "r"],
  [/\bcambodg|\bkhmer|\blaos|\blaotien/, ["cambodian", "southeast_asian"], "r"],
  [/\bphilippin/, ["filipino"], "r"],
  [/\bindonesi|\bmalais|\bsingapour/, ["indonesian", "malaysian", "singaporean", "southeast_asian"], "r"],
  [/\bbirman|\bmyanmar/, ["burmese"], "r"],
  [/\bmongol/, ["mongolian"], "r"],
  [/\basiat|\basie\b|\bwok/, ["asian", "thai", "vietnamese", "chinese", "japanese", "korean", "cambodian", "malaysian", "indonesian", "filipino", "singaporean", "taiwanese", "wok", "dim_sum", "ramen", "sushi"], "r"],
  [/\blibanais|\bliban\b|\bmezze/, ["lebanese"], "r"],
  [/\bsyrien/, ["syrian"], "r"],
  [/\bpersan|\biran/, ["persian"], "r"],
  [/\bafghan/, ["afghani"], "r"],
  [/\bkurde/, ["kurdish"], "r"],
  [/\boriental|\bmoyen[- ]orient|\bproche[- ]orient|\bfalafels?\b|\bhoumous|\bhummus|\bchawarma|\bshawarma/, ["middle_eastern", "lebanese", "syrian", "israeli", "falafel", "persian", "arabian", "egyptian"], "r"],
  [/\bmarocain|\bmaroc\b|\bcouscous|\btajine|\bmaghreb|\balgerien|\btunisien|\bberbere/, ["moroccan", "african"], "r"],
  [/\begypt/, ["egyptian"], "r"],
  [/\bturc|\bturquie|\bkebab|\bdoner|\bgrec sandwich/, ["turkish", "doner_kebab", "kofta"], "r"],
  [/\bafricain|\bafrique|\bsenegal|\bethiopi|\berythre|\bnigeria|\bivoirien|\bcamerou|\bmafe|\byassa|\bthieb/, ["african", "senegalese", "ethiopian", "eritrean", "nigerian", "west_african", "east_african", "south_african"], "r"],
  [/\bantillais|\bcreole|\bcaribe|\bjamaic|\bhaiti|\bguadeloup|\bmartiniqu|\breunion/, ["caribbean", "cajun_and_creole", "jamaican", "haitian", "trinidadian", "puerto_rican", "dominican"], "r"],
  [/\bgrec|\bgrece\b|\bgyros|\bsouvlaki/, ["greek"], "r"],
  [/\bisraelien|\bisrael\b/, ["israeli", "jewish", "kosher"], "r"],
  [/\bjuif|\bashkenaze|\bsefarade|\bdeli juif|\bbagels?\b/, ["jewish", "kosher", "israeli", "bagel", "delicatessen"], "r"],
  [/\bgeorgien/, ["georgian"], "r"],
  [/\barmenien/, ["armenian"], "r"],
  [/\brusse|\bukrainien|\bpolonais|\btcheque|\bhongrois|\broumain|\bbulgare|\bserbe|\bcroate|\bslave|\bpays de l'est/, ["russian", "ukrainian", "polish", "czech", "hungarian", "romanian", "bulgarian", "serbo_croatian", "eastern_european"], "r"],
  [/\bouzbek|\btatar|\bazerbaidj/, ["uzbek", "tatar", "azerbaijani"], "r"],
  [/\bmexicain|\bmexique|\btacos?\b|\bburritos?|\btex[- ]?mex/, ["mexican", "taco", "texmex"], "r"],
  [/\bperou|\bperuvien|\bceviche/, ["peruvian"], "r"],
  [/\bbresil|\bargentin|\bcolombi|\bvenezuel|\bchilien|\bcubain|\bcuba\b|\blatino|\bamerique latine|\bsud[- ]americain|\bempanadas?/, ["brazilian", "argentine", "colombian", "venezuelan", "chilean", "cuban", "latin_american", "south_american", "empanada", "uruguayan", "ecuadorian", "bolivian", "salvadoran"], "r"],
  [/\bespagnol|\bespagne\b|\btapas|\bpaella/, ["spanish", "tapas", "iberian", "catalan", "basque"], "r"],
  [/\bbasque|\bpintxos/, ["basque"], "r"],
  [/\bcatalan/, ["catalan"], "r"],
  [/\bportugais|\bportugal\b|\bbacalhau/, ["portuguese"], "r"],
  [/\bfrancais|\bbistrot|\bbrasserie|\btraditionnel/, ["french", "bistro", "brasserie"], "r"],
  [/\ballemand|\bbavarois|\bcurrywurst/, ["german", "curry_sausage", "austrian"], "r"],
  [/\bautrichien|\bsuisse|\bfondue|\braclette/, ["austrian", "swiss", "fondue"], "r"],
  [/\bbelge|\bfrites?\b/, ["belgian", "friterie"], "r"],
  [/\banglais|\bbritannique|\bfish and chips|\birlandais|\becossais/, ["british", "irish", "scottish", "fish_and_chips", "gastropub"], "r"],
  [/\bscandinave|\bsuedois|\bdanois|\bnordique/, ["scandinavian"], "r"],
  [/\bamericain|\bburgers?\b|\bbbq|\bbarbecue|\bsmokehouse/, ["american", "burger", "diner", "barbecue", "southern_american", "soul_food", "cheesesteak", "hot_dog"], "r"],
  [/\bhawai|\bpoke/, ["hawaiian", "poke"], "r"],
  [/\bmediterran/, ["mediterranean", "greek", "lebanese"], "r"],
  [/\bfruits de mer|\bpoissons?\b|\bhuitres|\bcrustace/, ["seafood", "fish"], "r"],
  [/\bviande|\bsteak|\bgrill|\bboucher/, ["steakhouse", "meat", "barbecue", "bar_and_grill"], "r"],
  [/\bpoulet|\bchicken|\bwings/, ["chicken"], "r"],
  [/\bbrunch|\bpetit[- ]dej|\bbreakfast/, ["breakfast_and_brunch", "pancake"], "r"],
  [/\bcrepe|\bgalette|\bbreton/, ["pancake", "creperie"], "r"],
  [/\bsoupe/, ["soup"], "r"],
  [/\bsalade|\bhealthy|\bbowl/, ["salad", "health_food", "poke", "acai"], "r"],
  [/\bbuffet|\ba volonte/, ["buffet"], "r"],
  [/\bfusion/, ["fusion"], "r"],
  [/\bgastronomique|\betoile|\bmichelin|\bgastro\b/, ["molecular_gastronomy", "french"], "r"],
  [/\bfast[- ]?food|\bsur le pouce|\bsandwich|\bstreet[- ]?food|\bfood ?truck/, ["fast_food", "sandwich", "food_truck", "bagel", "hot_dog", "falafel", "doner_kebab", "taco"], "r"],
  [/\bbar a vins?|\bvins?\b/, ["wine_bar"], "b"],
  [/\bbieres?|\bpub/, ["beer_bar", "pub", "irish_pub", "gastropub"], "b"],
  [/\bcocktails?/, ["cocktail_bar", "speakeasy"], "b"],
  [/\bjazz/, ["jazz_and_blues_venue", "piano_bar"], "n"],
  [/\bboulanger/, ["bakery"], "c"],
  [/\bglace/, ["ice_cream", "gelato", "frozen_yogurt"], "c"],
  [/\bsalon de the/, ["tea_room"], "c"],
  [/\byoga/, ["yoga"], "s"],
  [/\bpilates/, ["pilates", "barre"], "s"],
  [/\bescalade|\bgrimpe/, ["climbing"], "s"],
  [/\bboxe/, ["boxing", "kickboxing", "muay_thai"], "s"],
  [/\bpiscine|\bnager|\bnatation/, ["swimming"], "s"],
  [/\btennis|\bpadel/, ["tennis"], "s"],
  [/\bfoot/, ["soccer", "football"], "s"],
  [/\bbowling/, ["bowling"], "a"],
  [/\bbillard/, ["pool_hall", "pool_billiards"], "s"],
  [/\bmuscu|\bsalle de sport|\bgym\b|\bfitness|\bcrossfit/, ["gym", "fitness", "boot_camp"], "s"],
  [/\bvelo/, ["cycl", "bike"], "s"],
  [/\bdanse|\bdanser/, ["dance_studio", "salsa"], "k"],
  [/\bpeinture|\bdessin|\bpeindre|\bpoterie|\bceramique|\bart\b|\barts plastiques/, ["art_school", "specialty_school"], "k"],
  [/\bcours de cuisine|\batelier (de )?cuisine|\bpatisserie\b.*\bcours|\bcours\b.*\bpatisserie/, ["cooking_school"], "k"],
  [/\bmusique|\bpiano|\bguitare|\bchant/, ["music_school"], "k"],
  [/\bphoto/, ["photography"], "k"],
  [/\btheatre/, ["theatre", "drama_school", "performing_arts"], "a"],
  [/\bmusees?/, ["museum"], "a"],
  [/\bgaleries?/, ["art_gallery"], "a"],
  [/\bcinemas?|\bfilms?/, ["movie_theater", "outdoor_movie"], "a"],
  [/\bparcs?|\bjardins?/, ["park", "garden"], "a"],
  [/\bescape/, ["escape_room"], "a"],
  [/\bzoo|\baquarium/, ["zoo", "aquarium", "petting_zoo"], "a"],
  [/\bmonuments?|\bhistorique/, ["monument", "historic", "palace", "ruin"], "a"],
  [/\bmassage/, ["massage"], "w"],
  [/\bhammam|\bsauna|\bbains/, ["public_bath_house", "sauna"], "w"],
  [/\bauberge|\bhostel/, ["hostel"], "h"],
  [/\bchambres? d'hotes|\bb&b/, ["bed_and_breakfast"], "h"],
  [/\bappart/, ["service_apartment", "self_catering"], "h"],
];

const TAG_WORDS: [RegExp, string][] = [
  [/\b(casher|cacher|kasher|kosher|cachere|cashere|kacher|kocher|cachir|glatt)\b/, "casher"],
  [/\b(halal|hallal|halel|hallel)\b/, "halal"],
  [/\b(vegan|vegane|vegetalien)\b/, "vegan"],
  [/\b(vegetarien|vegetarienne|vege|veggie)\b/, "vegetarien"],
  [/\bsans gluten\b/, "sans-gluten"],
];

const STOP = new Set(
  "a au aux avec ce cet cette chez dans de des du en et je la le les leur ma me mes moi mon ne on ou par pas pour pres qu que qui quoi sa se ses son sur ta te tes toi ton tu un une vers via veux voudrais cherche trouve trouver donne propose bon bons bonne bonnes meilleur meilleurs meilleure super sympa pas cher cool idee idees endroit endroits adresse adresses lieu lieux ville quartier arrondissement arr eme ieme er ce soir demain aujourd hui maintenant y il elle est sont faire aller peux tu stp svp merci liste toutes tous tout".split(" "),
);

export interface ParsedQuery {
  groups: Group[];
  types: string[];
  tags: string[];
  arr: number | null;
  district: { name: string; lat: number; lng: number } | null;
  words: string[];
  /** mots de la demande reconnus (« peinture », « italien »…), pour favoriser les noms qui les contiennent */
  keys: string[];
  text: string;
}

export function parseQuery(text: string, city: City): ParsedQuery {
  const t = norm(text);
  const tags = TAG_WORDS.filter(([rx]) => rx.test(t)).map(([, v]) => v);
  const types: string[] = [];
  const typeGroups: Group[] = [];
  for (const [rx, list, g] of TYPE_WORDS) {
    if (rx.test(t)) {
      types.push(...list);
      if (g) typeGroups.push(g);
    }
  }
  let groups = GROUP_WORDS.filter(([, rx]) => rx.test(t)).map(([g]) => g);
  // « cours de danse », « atelier peinture » : on reste sur les cours ; un régime alimentaire = un resto
  // un type reconnu (« crêpes », « tapas ») ajoute sa famille : une crêperie est un resto même si « crêpes » évoque le goûter
  groups = [...new Set([...groups, ...typeGroups])];
  if (groups.includes("k")) groups = groups.filter((g) => g === "k" || (g !== "s" && g !== "a" && g !== "r" && g !== "n"));
  if (!groups.length && tags.length) groups = ["r"];
  const arr = city.id === "paris" ? arrFromText(text) : null;
  const zones = city.id === "paris" ? QUARTIERS : city.districts;
  const district = zones.find((d) => norm(d.name).split(/\s*[·/]\s*/).some((n) => t.includes(n.replace(/^(le|la|les|el|il) /, "")))) ?? null;
  const used = new Set<string>();
  const keySet = new Set<string>();
  for (const [rx] of [...TYPE_WORDS, ...TAG_WORDS]) {
    for (const m of t.match(new RegExp(rx.source, "g")) ?? []) m.split(/\s+/).forEach((w) => (used.add(w), keySet.add(w)));
  }
  for (const [, rx] of GROUP_WORDS) {
    for (const m of t.match(new RegExp(rx.source, "g")) ?? []) m.split(/\s+/).forEach((w) => used.add(w));
  }
  if (district) norm(district.name).split(/[\s·/-]+/).forEach((w) => used.add(w));
  const words = t
    .replace(/[^a-z0-9&' -]/g, " ")
    .split(/[\s']+/)
    .filter((w) => w.length > 2 && !STOP.has(w) && !used.has(w) && !/^\d+(e|er|eme|ieme)?$/.test(w) && w !== norm(city.name));
  const keys = [...keySet].filter((w) => w.length > 3);
  return { groups, types, tags, arr, district, words, keys, text: t };
}

/** La question parle-t-elle d'un lieu à trouver (resto, bar, activité, hôtel…) ? */
export const isPlaceQuery = (q: ParsedQuery) => q.groups.length > 0 || q.types.length > 0 || q.tags.length > 0;

// tri alphabétique lisible : « #Pizzagram » ou « 1 Pot » passent après les noms en lettres
const sortName = (n: string) => (/^[\p{L}]/u.test(n) ? n : `\uffff${n.replace(/^[^\p{L}]+/u, "")}`);

export interface SearchResult {
  places: Place[];
  total: number;
  parsed: ParsedQuery;
  /** cuisines où le halal / casher est fréquent, à vérifier (quand les adresses certifiées sont rares) */
  related: Place[];
  likely?: string;
}

const LIKELY: Record<string, string[]> = {
  halal: ["turkish", "doner_kebab", "kofta", "lebanese", "syrian", "moroccan", "middle_eastern", "arabian", "persian", "afghani", "pakistani", "kurdish", "egyptian", "falafel", "senegalese", "bangladeshi"],
  casher: ["israeli", "jewish"],
};

export function searchPlaces(all: Place[], city: City, text: string, opts: { group?: Group | "all"; arr?: number; district?: string; limit?: number } = {}): SearchResult {
  const parsed = parseQuery(text, city);
  // le filtre choisi s'efface si la phrase demande clairement autre chose (« cours de peinture » depuis « Restos »)
  const chip = opts.group && opts.group !== "all" && (!parsed.groups.length || parsed.groups.includes(opts.group)) ? opts.group : null;
  const groups = chip ? [chip] : parsed.groups;
  const arr = opts.arr || parsed.arr;
  const zone = opts.district ? city.districts.find((d) => d.name === opts.district) ?? null : arr ? null : parsed.district;
  const words = parsed.words;
  const scored: { p: Place; s: number }[] = [];
  for (const p of all) {
    if (groups.length && !groups.includes(p.group)) continue;
    if (parsed.tags.length && !parsed.tags.every((tg) => p.tags.includes(tg))) continue;
    if (arr && arrOf(p) !== arr) continue;
    let s = 0;
    if (zone) {
      const d = distanceKm(p, zone);
      if (d > 1.6) continue;
      s += 2 - d;
    }
    const nn = norm(p.name);
    if (parsed.types.length) {
      // la bonne cuisine, ou un nom qui l'annonce (« Thaï Express », « Crêperie de Josselin »)
      if (parsed.types.some((ty) => p.type.includes(ty))) s += p.type.includes(parsed.types[0]) ? 4 : 3;
      else if (parsed.keys.some((k) => k.length > 3 && nn.includes(k.slice(0, Math.max(4, k.length - 2))))) s += 2;
      else continue;
    }
    if (parsed.keys.some((k) => nn.includes(k))) s += 2;
    if (nn.length > 6 && parsed.text.includes(nn)) s += 8;
    if (words.length) {
      const hay = norm(`${p.name} ${p.address} ${typeLabel(p.type)}`);
      const hit = words.filter((w) => hay.includes(w)).length;
      // sans autre critère, les mots doivent correspondre (recherche par nom)
      if (!hit && !groups.length && !parsed.types.length && !parsed.tags.length) continue;
      s += hit * 4;
      if (nn.startsWith(words[0])) s += 2;
    }
    if (p.web && !isSocial(p)) s += 1;
    if (p.phone) s += 0.5;
    if (p.address) s += 0.5;
    scored.push({ p, s });
  }
  scored.sort((a, b) => b.s - a.s || sortName(a.p.name).localeCompare(sortName(b.p.name), "fr"));
  // halal / casher : l'annuaire ne signale pas toujours la certification ; s'il y a peu de réponses sûres,
  // on ajoute les cuisines où c'est fréquent, signalées « à vérifier »
  let related: Place[] = [];
  const diet = parsed.tags.find((t) => t in LIKELY);
  if (diet && scored.length < 25) {
    const seen = new Set(scored.map((x) => x.p.i));
    related = all
      .filter((p) => p.group === "r" && !seen.has(p.i) && LIKELY[diet].some((ty) => p.type.includes(ty)))
      .filter((p) => (!arr || arrOf(p) === arr) && (!zone || distanceKm(p, zone) <= 1.6))
      .filter((p) => !parsed.types.length || parsed.types.some((ty) => p.type.includes(ty)))
      .sort((a, b) => (zone ? distanceKm(a, zone) - distanceKm(b, zone) : 0) || Number(!!b.web) - Number(!!a.web))
      .slice(0, 12);
  }
  return { places: scored.slice(0, opts.limit ?? 60).map((x) => x.p), total: scored.length, parsed, related, likely: diet };
}

/** Résumé pour l'IA : de vraies adresses issues du répertoire, pour qu'elle s'appuie dessus. */
export function directoryHint(r: SearchResult, city: City, max = 12) {
  if (!r.places.length && !r.related.length) return "";
  const lines = r.places.slice(0, max).map((p) => {
    const bits = [placeKind(p), [p.address, p.postcode].filter(Boolean).join(" "), p.web && !isSocial(p) ? p.web : "", p.phone, p.tags.join("/")].filter(Boolean);
    return `- ${p.name} (${bits.join(" · ")})`;
  });
  const rel = r.related.slice(0, 8).map((p) => `- ${p.name} (${placeKind(p)} · ${[p.address, p.postcode].filter(Boolean).join(" ")}) — ${r.likely} probable, À VÉRIFIER`);
  return `RÉPERTOIRE MARCO (${r.total} adresses correspondantes à ${city.name} dans l'annuaire complet ; voici les premières, utilise-les en priorité et vérifie les horaires si tu peux) :\n${lines.join("\n")}${
    rel.length ? `\nCuisines où c'est souvent ${r.likely}, sans certification connue (présente-les comme « à vérifier sur place ») :\n${rel.join("\n")}` : ""
  }`;
}

export const cityOf = (id: string) => cityById(id);
