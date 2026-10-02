// Le "cerveau local" de Marco : répond sans IA en ligne, à partir de sa base d'adresses et de rues.
import { citySpots, QUARTIERS, type Diet, type Spot } from "../data/spots";
import { arrFromText as parisArr, DIET_NOTE, DIET_ZONES, NIGHT, NIGHT_NOTE } from "../data/guides";
import { cityById, type City } from "../data/cities";
import { WORLD_DIET, WORLD_NIGHTS } from "../data/world-guides";
import { findStreet, type StreetStory } from "../data/streets";
import { arrLabel, exactVoie, searchVoies } from "../data/voies";
import { distanceKm } from "./geo";
import { generatePlan, type PlanInput } from "./planner";
import { getState } from "./store";

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const has = (t: string, words: string[]) => words.some((w) => t.includes(w));

export function streetMarkdown(s: StreetStory) {
  return [
    `### ${s.name} · ${s.arrondissement}`,
    `**L'histoire**\n${s.histoire}`,
    `**Le fait historique · ${s.fait.annee}**\n${s.fait.texte}`,
    `**L'anecdote**\n${s.anecdote}`,
    s.aVoir?.length ? `**À deux pas**\n${s.aVoir.map((id) => `- [[spot:${id}]]`).join("\n")}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

/** Ville de la question en cours (les arrondissements n'existent qu'à Paris). */
let cur: City = cityById("paris");
const arrFromText = (t: string) => (cur.id === "paris" ? parisArr(t) : null);

/** Centre approximatif d'un arrondissement (moyenne des lieux connus). */
function arrCenter(arr: number) {
  const inArr = citySpots("paris").filter((s) => s.arrondissement === arr);
  if (!inArr.length) return null;
  return { lat: inArr.reduce((a, s) => a + s.lat, 0) / inArr.length, lng: inArr.reduce((a, s) => a + s.lng, 0) / inArr.length };
}

/** Choisit n lieux : d'abord l'arrondissement demandé, sinon près de chez l'utilisateur ; un peu de hasard pour varier. */
function pick(filter: (s: Spot) => boolean, t: string, n = 3) {
  const { profile } = getState();
  const arr = arrFromText(t);
  const origin = cur.id === "paris"
    ? (arr && arrCenter(arr)) ||
      QUARTIERS.find((x) => norm(t).includes(norm(x.name).split(" /")[0])) ||
      QUARTIERS.find((x) => x.name === profile.quartier) || QUARTIERS[0]
    : cur.districts.find((d) => norm(t).includes(norm(d.name).split(" ·")[0])) || cur.center;
  // les hôtels ne sortent que si on les demande
  const pool = citySpots(cur.id).filter(filter);
  const ranked = (pool.every((s) => s.category === "hotel") ? pool : pool.filter((s) => s.category !== "hotel"))
    .map((s) => ({ s, d: distanceKm(origin, s) - s.hidden * 0.4 - (arr && s.arrondissement === arr ? 5 : 0) }))
    .sort((a, b) => a.d - b.d)
    .map((x) => x.s);
  // variété : on pioche dans une fenêtre un peu plus large que n
  const window = ranked.slice(0, n + 3);
  const chosen: Spot[] = [];
  while (chosen.length < n && window.length) chosen.push(window.splice(Math.floor(Math.random() * Math.min(window.length, 3)), 1)[0]);
  return chosen;
}

const lab = (n: number) => (n === 1 ? "1er" : `${n}e`);
const txt = (s: Spot) => norm(`${s.name} ${s.pitch} ${s.tip} ${s.quartier}`);

/** Faux quand la réponse locale est faible (rien dans l'arrondissement demandé, ou rien trouvé) :
 *  le chat attend alors l'IA plutôt que d'afficher une réponse à côté. */
let strong = true;
export const lastLocalWasStrong = () => strong;

/** Thèmes reconnus dans une question libre → lieux correspondants. */
const THEMES: { words: string[]; match: (s: Spot) => boolean; label: string }[] = [
  { label: "sport", words: ["sport", "piscine", "nager", "natation", "bowling", "roller", "stade", "tennis", "foot", "velo", "courir", "running", "hippodrome", "courses", "escalade", "fitness", "yoga", "bouger"],
    match: (s) => /piscine|bowling|roller|stade|tennis|velo|hippodrome|nage|danse|sport/.test(txt(s)) },
  { label: "atelier créatif", words: ["peinture", "peindre", "dessin", "dessiner", "poterie", "ceramique", "aquarelle", "modelage", "couture", "tricot", "gravure", "atelier d'art", "creatif"],
    match: (s) => s.category === "activite" && /peint|dessin|poterie|ceram|aquarell|modelage|couture|gravure|creati/.test(txt(s)) },
  { label: "art", words: ["art ", "arts", "artiste", "galerie", "expo", "sculpture", "musee", "tableau"],
    match: (s) => s.category === "culture" || /peint|artiste|sculpt|musee|atelier|galerie|expo|oeuvre|renoir|picasso/.test(txt(s)) },
  { label: "gourmand", words: ["cours de cuisine", "atelier cuisine", "cuisiner", "patisserie", "oenologie", "degustation", "vin", "fromage", "chocolat"],
    match: (s) => /cuisine|cours|degust|vin|patiss|croissant|chocolat/.test(txt(s)) && s.category !== "resto" },
  { label: "eau", words: ["bateau", "croisiere", "canal", "seine", "peniche", "fleuve"],
    match: (s) => /bateau|croisiere|canal|seine|peniche|fleuve|bassin/.test(txt(s)) },
  { label: "vue", words: ["vue", "panorama", "rooftop", "toit", "hauteur", "coucher de soleil"],
    match: (s) => /vue|panoram|toit|rooftop|coucher du soleil/.test(txt(s)) },
  { label: "chiner", words: ["marche", "puces", "chiner", "brocante", "antiquaire", "shopping", "boutique"],
    match: (s) => /marche|puces|brocant|antiquaire|boutique|passage/.test(txt(s)) },
  { label: "cinema", words: ["cinema", "film", "ciné"], match: (s) => /cinema|film/.test(txt(s)) },
  { label: "pluie", words: ["pluie", "il pleut", "interieur", "au sec"], match: (s) => s.category === "culture" || s.category === "activite" || /passage|couvert/.test(txt(s)) },
];

/** Liste honnête : priorité à l'arrondissement demandé, et on le dit quand il n'y a rien dedans. */
function answer(intro: string, filter: (s: Spot) => boolean, t: string, n = 4, what = "de ce genre") {
  const arr = arrFromText(t);
  const chosen = pick(filter, t, n);
  if (!chosen.length) {
    strong = false;
    return `Je n'ai rien ${what} dans ma sélection pour l'instant.`;
  }
  if (arr) {
    const inArr = chosen.filter((s) => s.arrondissement === arr);
    if (!inArr.length) {
      strong = false;
      return `Dans le ${lab(arr)} même, je n'ai encore rien ${what} dans ma sélection. Au plus près :\n\n${list(chosen)}`;
    }
    return `${intro.replace(/ :$/, "")} dans le ${lab(arr)} :\n\n${list(inArr)}${
      inArr.length < chosen.length ? `\n\n**Tout près, dans les arrondissements voisins**\n${list(chosen.filter((s) => s.arrondissement !== arr))}` : ""
    }`;
  }
  return `${intro}\n\n${list(chosen)}`;
}

const list = (spots: Spot[]) => spots.map((s) => `- [[spot:${s.id}]] — ${s.pitch}`).join("\n");

/** Vrai si le cerveau local n'a rien trouvé de précis (réponse d'aide générique). */
export const isGenericReply = (reply: string) => reply.startsWith("Je ne suis pas sûr");

export function localReply(input: string): string {
  strong = true;
  const t = norm(input);
  const { profile } = getState();
  cur = cityById(profile.city);
  const paris = cur.id === "paris";
  const name = profile.name ? ` ${profile.name}` : "";

  // 1. Histoire de rue
  const streetQuery = input.match(/\b(rue|avenue|av\.?|boulevard|bd|place|passage|quai|street|calle|carrer|rua|via|straat|strasse|straße|road|avenida|plaza|piazza)\s+.+/i)?.[0];
  const street = findStreet(streetQuery ?? input, cur.id);
  if (street && (streetQuery || input.trim().split(/\s+/).length <= 4)) return streetMarkdown(street);
  if (!paris && streetQuery) return `Ouvre sa fiche, je te raconte son histoire, un fait historique et une anecdote : [[rue:${streetQuery.trim()}]]`;
  const exact = streetQuery ? undefined : exactVoie(input);
  const voies = exact ? [exact] : streetQuery ? searchVoies(streetQuery, 3) : [];
  if (streetQuery || exact) {
    if (voies.length) {
      const v = voies[0];
      const others = voies.slice(1).map((x) => `[[rue:${x.n}]]`).join(" ");
      return `### ${v.n} · ${arrLabel(v.a)}\nJe la connais ! Ouvre sa fiche, je te raconte son histoire, un fait historique et une anecdote :\n\n[[rue:${v.n}]]${others ? `\n\nTu pensais peut-être à : ${others}` : ""}`;
    }
    return `Je ne trouve pas **${(streetQuery ?? input).trim()}** dans mon annuaire des voies de Paris. Vérifie l'orthographe, ou essaie : [[rue:Rue Mouffetard]] [[rue:Place des Vosges]] [[rue:Rue du Chat-qui-Pêche]]`;
  }

  // 2. Planification
  if (has(t, ["plan", "itineraire", "journee", "3h", "3 h", "heures", "programme", "week-end", "weekend", "organise"])) {
    const inp: PlanInput = {
      who: has(t, ["date", "amoureu", "copine", "copain", "romant", "deux"]) ? "date"
        : has(t, ["enfant", "famille", "kids"]) ? "famille"
        : has(t, ["pote", "amis", "bande", "copains"]) ? "amis" : "solo",
      duration: has(t, ["3h", "3 h", "heures", "aprem", "apres-midi"]) ? "3h" : has(t, ["soir", "nuit"]) ? "soiree" : "journee",
      budget: has(t, ["pas cher", "budget", "fauche", "gratuit"]) ? 1 : has(t, ["luxe", "chic", "folie"]) ? 3 : 2,
      envies: [],
      quartier: paris ? profile.quartier : cur.districts[0]?.name ?? "",
      hiddenOnly: has(t, ["touriste", "cache", "secret", "local"]),
      city: cur.id,
    };
    const plan = generatePlan(inp);
    return `### ${plan.title}\n${plan.intro}\n\n${plan.stops
      .map((s) => `- **${s.start}** · [[spot:${s.spot.id}]]${s.travel ? ` _(${s.travel.minutes} min ${s.travel.mode})_` : ""}`)
      .join("\n")}\n\nTu veux l'ajuster ? Ouvre le **Planificateur** pour choisir ton budget, tes envies et ton quartier de départ.`;
  }

  // 3a. Hôtels
  if (has(t, ["hotel", "dormir", "chambre", "nuit a paris", "hebergement", "auberge", "palace", "loger", "airbnb", "appartement", "appart"])) {
    strong = false; // l'IA connaît aussi les disponibilités et tous les hôtels ; la sélection sert de secours
    const cheap = has(t, ["pas cher", "budget", "petit prix", "auberge", "economique", "moins cher"]);
    const lux = has(t, ["luxe", "palace", "5 etoiles", "haut de gamme", "plus cher"]);
    return `${answer(
      cheap ? "Pour dormir sans se ruiner :" : lux ? "Pour se faire plaisir :" : "Mes hôtels coups de cœur :",
      (s) => s.category === "hotel" && (!cheap || s.price === 1) && (!lux || s.price === 3),
      t, 4, "comme hôtel",
    )}\n\nDisponibilités et réservation directement dans Marco : [[go:/voyages?tab=hotels|Voir les hôtels]] [[go:/voyages?tab=appartements|Voir les appartements]]`;
  }

  // 3b. Vols
  if (has(t, ["vol ", "vols", "avion", "billet d'avion", "aeroport", "compagnie aerienne", "low cost"])) {
    strong = false;
    return `Je te montre les vols disponibles directement dans Marco, du moins cher au plus cher (ou le plus rapide), et tu réserves ici : [[go:/voyages?tab=vols|Chercher un vol]]\n\nMes réflexes pour payer moins cher : compare plusieurs jours de départ, regarde tous les aéroports de la ville, et vérifie le prix des bagages en soute avant de choisir un low cost.`;
  }

  // 3. Réservation / voyage
  if (has(t, ["reserv", "book", "hotel", "vol ", "voyage", "sejour", "vacances"])) {
    // une réservation se fait avec l'IA (elle prépare la carte de réservation) : réponse locale seulement en secours
    strong = false;
    if (has(t, ["reserv", "book"]) && !has(t, ["hotel", "vol ", "voyage", "sejour", "vacances"])) {
      return `Dis-moi **le restaurant ou l'activité, le jour, l'heure et combien vous êtes**, et je m'en occupe${name ? "," + name : ""}.\n\nTu peux aussi ouvrir la fiche d'un lieu : le bouton **Réserver** t'emmène directement sur son site officiel.`;
    }
    return `Tout ton voyage se prépare ici${name ? "," + name : ""} : vols, hôtels, appartements et un programme jour par jour.\n\n[[go:/voyages?tab=sejour|Construire mon séjour sur mesure]] [[go:/voyages?tab=vols|Chercher un vol]]`;
  }

  // 4. Casher / halal
  const diet: Diet | null = has(t, ["casher", "cacher", "kasher", "kosher"]) ? "casher" : has(t, ["halal", "hallal"]) ? "halal" : null;
  if (diet && !paris) {
    strong = false;
    const zones = (WORLD_DIET[cur.id] ?? []).filter((z) => z.diet === diet);
    const spots = pick((s) => Boolean(s.diet?.includes(diet)), t, 3);
    return `${zones.length ? `Pour manger ${diet} à ${cur.name}, les quartiers où chercher :\n\n${zones.map((z) => `- **${z.name}** : ${z.streets}. ${z.text}`).join("\n")}` : `Je n'ai pas encore de quartier ${diet} repéré à ${cur.name}.`}${
      spots.length ? `\n\n**Dans la sélection Marco**\n${list(spots)}` : ""
    }\n\n_${DIET_NOTE}_`;
  }
  if (diet) {
    // la base ne connaît que des quartiers : on laisse l'IA nommer de vrais restaurants quand elle est disponible
    strong = false;
    const arr = arrFromText(t);
    const spots = pick((s) => Boolean(s.diet?.includes(diet)), t, 3);
    const zones = DIET_ZONES.filter((z) => z.diet === diet).sort((a, b) => Number(arr ? b.arr.includes(arr) : 0) - Number(arr ? a.arr.includes(arr) : 0));
    const inArr = arr ? zones.filter((z) => z.arr.includes(arr)) : [];
    const head = arr
      ? inArr.length
        ? `Pour manger ${diet} dans le ${arr === 1 ? "1er" : `${arr}e`}, voilà où aller :`
        : ((strong = false), `Dans le ${arr === 1 ? "1er" : `${arr}e`}, je n'ai pas encore d'adresse ${diet} vérifiée dans ma sélection. Les quartiers les mieux fournis :`)
      : `Pour manger ${diet} à Paris, les quartiers où chercher :`;
    return `${head}\n\n${zones.slice(0, 4).map((z) => `- **${z.name}** (${z.arr.map((x) => (x === 1 ? "1er" : `${x}e`)).join(", ")}) : ${z.streets}. ${z.text}`).join("\n")}${
      spots.length ? `\n\n**Dans la sélection Marco**\n${list(spots)}` : ""
    }\n\n_${DIET_NOTE}_`;
  }

  // 5. Soirées
  if (!paris && has(t, ["soiree", "sortir", "ce soir", "club", "boite", "danser", "fete", "nuit", "concert", "cabaret", "teuf"]) && !has(t, ["jazz"])) {
    const guides = WORLD_NIGHTS[cur.id] ?? [];
    const g = guides.filter((n) => norm(t).includes(norm(n.district).split(" ·")[0]));
    const show = (g.length ? g : guides.slice(0, 3));
    if (!show.length) strong = false;
    return `${show.map((n) => `### ${n.district} la nuit\n${n.vibe}\n\n${n.venues.map((v) => `- **${v.name}** (${v.kind}) — ${v.address}. ${v.tip}`).join("\n")}`).join("\n\n")}\n\n_${NIGHT_NOTE}_\n\n[[go:/soirees|Voir tous les quartiers]]`;
  }
  if (has(t, ["soiree", "sortir", "ce soir", "club", "boite", "danser", "fete", "nuit", "concert", "cabaret", "teuf", "guinguette"]) && !has(t, ["jazz"])) {
    const arr = arrFromText(t);
    const guides = arr ? NIGHT.filter((n) => n.arr === arr) : [11, 18, 10].map((a) => NIGHT.find((n) => n.arr === a)!);
    const fmt = (g: (typeof NIGHT)[number]) =>
      `### Le ${g.arr === 1 ? "1er" : `${g.arr}e`} la nuit\n${g.vibe}\n\n${g.venues.map((v) => `- **${v.name}** (${v.kind}) — ${v.address}. ${v.tip}`).join("\n")}`;
    return `${arr ? "" : "Les arrondissements où ça bouge le plus :\n\n"}${guides.map(fmt).join("\n\n")}\n\n_${NIGHT_NOTE}_\n\n[[go:/soirees|Voir les soirées des 20 arrondissements]]`;
  }

  // 6. Activités et thèmes (sport, peinture, bateau, vue, marchés…)
  const themes = THEMES.filter((th) => has(t, th.words));
  const food = has(t, ["manger", "resto", "restaurant", "diner", "dejeuner", "faim", "bouffe"]);
  if (!food && (themes.length || has(t, ["activite", "atelier", "cours de", "faire quoi", "quoi faire", "visite", "enfant", "jeu", "occuper", "idee"]))) {
    const kids = has(t, ["enfant", "famille", "kids"]);
    const filter = (s: Spot) =>
      (themes.length ? themes.some((th) => th.match(s)) : s.category === "activite" || s.category === "insolite") && (!kids || s.moods.includes("famille"));
    const label = themes.length ? themes.map((th) => th.label).join(" / ") : "activités";
    // une demande précise (« atelier de … », « cours de … ») que la base ne sait pas classer : l'IA répond mieux
    if (!themes.length && has(t, ["atelier", "cours de", "club", "salle de", "stage"])) strong = false;
    return `${answer(kids ? "Des idées qui plaisent aux petits comme aux grands :" : `Mes idées ${label === "activités" ? "d'activités" : `côté ${label}`} :`, filter, t, 4, themes.length ? `côté ${label}` : "de ce genre")}\n\nAppuie sur un lieu pour **réserver**.`;
  }

  // 7. Recherches par envie
  const romantic = has(t, ["date", "romant", "amoureu", "couple"]);
  if (has(t, ["jazz", "musique", "concert", "danser", "swing"])) return `Ça swingue par ici :\n\n${list(pick((s) => s.moods.includes("jazz"), t))}`;
  if (has(t, ["verre", "bar", "cocktail", "apero", "boire", "vin"])) {
    return answer(romantic ? "Pour un verre à deux qui fait son effet :" : "Pour trinquer, voilà mes bonnes adresses :", (s) => s.category === "bar" && (!romantic || s.moods.includes("romantique") || s.hidden === 3), t, 4, "comme bar");
  }
  if (has(t, ["manger", "resto", "restaurant", "diner", "dejeuner", "faim", "bouffe", "table"])) {
    const budget = has(t, ["pas cher", "budget", "fauche"]);
    return `${answer("J'ai faim rien qu'à y penser :", (s) => s.category === "resto" && (!budget || s.price === 1), t, 4, "comme resto")}\n\nAppuie sur une adresse pour **réserver une table**.`;
  }
  if (has(t, ["cafe", "brunch", "the ", "gouter", "patisserie", "croissant"])) return `Pause bien méritée :\n\n${list(pick((s) => s.category === "cafe", t))}`;
  if (has(t, ["musee", "expo", "culture", "art", "histoire"])) return `Du culturel, mais pas du déjà-vu :\n\n${list(pick((s) => s.category === "culture", t))}`;
  if (has(t, ["parc", "jardin", "nature", "balade", "promenade", "vert", "soleil"])) return `Un bol d'air en plein Paris :\n\n${list(pick((s) => s.category === "nature", t))}`;
  if (has(t, ["enfant", "famille", "kids"])) return `Validé par les petits et les grands :\n\n${list(pick((s) => s.moods.includes("famille"), t))}`;
  if (romantic) return `Pour un date qui marque des points :\n\n${list(pick((s) => s.moods.includes("romantique"), t))}`;
  if (has(t, ["insolite", "bizarre", "secret", "cache", "original", "touriste", "pepite"])) {
    return `Les adresses que les Parisiens gardent pour eux :\n\n${list(pick((s) => s.hidden === 3, t))}`;
  }
  if (has(t, ["gratuit", "pas cher", "budget", "fauche"])) return `Paris sans se ruiner, c'est possible :\n\n${list(pick((s) => s.price === 1, t))}`;

  // 5. Salutations et défaut
  if (has(t, ["salut", "bonjour", "hello", "coucou", "hey", "yo"])) {
    return `Salut${name} ! Moi c'est Marco. Dis-moi ce que tu as envie de faire (un date, 3 heures devant toi, un resto pas cher…) ou donne-moi un nom de rue, je te raconte son histoire.`;
  }
  return `Je ne suis pas sûr d'avoir compris${name}. Tu peux me demander par exemple :\n\n- « J'ai 3 heures à Paris »\n- « Un bar caché pour un date »\n- « Raconte-moi la rue Mouffetard »\n- « Un resto pas cher près du canal »`;
}
