// Le "cerveau local" de Marco : répond sans IA en ligne, à partir de sa base d'adresses et de rues.
import { SPOTS, QUARTIERS, type Diet, type Spot } from "../data/spots";
import { arrFromText, DIET_NOTE, DIET_ZONES, NIGHT, NIGHT_NOTE } from "../data/guides";
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

/** Centre approximatif d'un arrondissement (moyenne des lieux connus). */
function arrCenter(arr: number) {
  const inArr = SPOTS.filter((s) => s.arrondissement === arr);
  if (!inArr.length) return null;
  return { lat: inArr.reduce((a, s) => a + s.lat, 0) / inArr.length, lng: inArr.reduce((a, s) => a + s.lng, 0) / inArr.length };
}

/** Choisit n lieux : d'abord l'arrondissement demandé, sinon près de chez l'utilisateur ; un peu de hasard pour varier. */
function pick(filter: (s: Spot) => boolean, t: string, n = 3) {
  const { profile } = getState();
  const arr = arrFromText(t);
  const origin = (arr && arrCenter(arr)) ||
    QUARTIERS.find((x) => norm(t).includes(norm(x.name).split(" /")[0])) ||
    QUARTIERS.find((x) => x.name === profile.quartier) || QUARTIERS[0];
  const ranked = SPOTS.filter(filter)
    .map((s) => ({ s, d: distanceKm(origin, s) - s.hidden * 0.4 - (arr && s.arrondissement === arr ? 5 : 0) }))
    .sort((a, b) => a.d - b.d)
    .map((x) => x.s);
  // variété : on pioche dans une fenêtre un peu plus large que n
  const window = ranked.slice(0, n + 3);
  const chosen: Spot[] = [];
  while (chosen.length < n && window.length) chosen.push(window.splice(Math.floor(Math.random() * Math.min(window.length, 3)), 1)[0]);
  return chosen;
}

const list = (spots: Spot[]) => spots.map((s) => `- [[spot:${s.id}]] — ${s.pitch}`).join("\n");

/** Vrai si le cerveau local n'a rien trouvé de précis (réponse d'aide générique). */
export const isGenericReply = (reply: string) => reply.startsWith("Je ne suis pas sûr");

export function localReply(input: string): string {
  const t = norm(input);
  const { profile } = getState();
  const name = profile.name ? ` ${profile.name}` : "";

  // 1. Histoire de rue
  const streetQuery = input.match(/\b(rue|avenue|av\.?|boulevard|bd|place|passage|quai)\s+.+/i)?.[0];
  const street = findStreet(streetQuery ?? input);
  if (street && (streetQuery || input.trim().split(/\s+/).length <= 4)) return streetMarkdown(street);
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
      quartier: profile.quartier,
      hiddenOnly: has(t, ["touriste", "cache", "secret", "local"]),
    };
    const plan = generatePlan(inp);
    return `### ${plan.title}\n${plan.intro}\n\n${plan.stops
      .map((s) => `- **${s.start}** · [[spot:${s.spot.id}]]${s.travel ? ` _(${s.travel.minutes} min ${s.travel.mode})_` : ""}`)
      .join("\n")}\n\nTu veux l'ajuster ? Ouvre le **Planificateur** pour choisir ton budget, tes envies et ton quartier de départ.`;
  }

  // 3. Réservation / voyage
  if (has(t, ["reserv", "book", "hotel", "vol ", "voyage", "sejour", "vacances"])) {
    return `Sur chaque fiche, le bouton **Réserver** t'envoie chez nos partenaires (table ou activité), sans surcoût pour toi.\n\nEt bientôt, tu pourras réserver **tout ton voyage** directement dans Marco : hébergement, activités, restos, le tout dans un seul plan. Inscris-toi sur la page **Voyages** pour être prévenu${name ? "," + name : ""}.`;
  }

  // 4. Casher / halal
  const diet: Diet | null = has(t, ["casher", "cacher", "kasher", "kosher"]) ? "casher" : has(t, ["halal", "hallal"]) ? "halal" : null;
  if (diet) {
    const arr = arrFromText(t);
    const spots = pick((s) => Boolean(s.diet?.includes(diet)), t, 3);
    const zones = DIET_ZONES.filter((z) => z.diet === diet).sort((a, b) => Number(arr ? b.arr.includes(arr) : 0) - Number(arr ? a.arr.includes(arr) : 0));
    const inArr = arr ? zones.filter((z) => z.arr.includes(arr)) : [];
    const head = arr
      ? inArr.length
        ? `Pour manger ${diet} dans le ${arr === 1 ? "1er" : `${arr}e`}, voilà où aller :`
        : `Dans le ${arr === 1 ? "1er" : `${arr}e`}, je n'ai pas encore d'adresse ${diet} vérifiée. Les quartiers les mieux fournis :`
      : `Pour manger ${diet} à Paris, les quartiers où chercher :`;
    return `${head}\n\n${zones.slice(0, 4).map((z) => `- **${z.name}** (${z.arr.map((x) => (x === 1 ? "1er" : `${x}e`)).join(", ")}) : ${z.streets}. ${z.text}`).join("\n")}${
      spots.length ? `\n\n**Dans la sélection Marco**\n${list(spots)}` : ""
    }\n\n_${DIET_NOTE}_`;
  }

  // 5. Soirées
  if (has(t, ["soiree", "sortir", "ce soir", "club", "boite", "danser", "fete", "nuit", "concert", "cabaret", "teuf", "guinguette"]) && !has(t, ["jazz"])) {
    const arr = arrFromText(t);
    const guides = arr ? NIGHT.filter((n) => n.arr === arr) : [11, 18, 10].map((a) => NIGHT.find((n) => n.arr === a)!);
    const fmt = (g: (typeof NIGHT)[number]) =>
      `### Le ${g.arr === 1 ? "1er" : `${g.arr}e`} la nuit\n${g.vibe}\n\n${g.venues.map((v) => `- **${v.name}** (${v.kind}) — ${v.address}. ${v.tip}`).join("\n")}`;
    return `${arr ? "" : "Les arrondissements où ça bouge le plus :\n\n"}${guides.map(fmt).join("\n\n")}\n\n_${NIGHT_NOTE}_\n\n[[go:/soirees|Voir les soirées des 20 arrondissements]]`;
  }

  // 6. Activités
  if (has(t, ["activite", "atelier", "cours de", "faire quoi", "quoi faire", "sport", "piscine", "nager", "bateau", "croisiere", "visite", "musee insolite", "enfant", "pluie", "il pleut", "jeu", "bowling", "danser le", "degustation", "insolite a faire", "occuper"]) && !has(t, ["manger", "resto", "diner", "dejeuner"])) {
    const kids = has(t, ["enfant", "famille", "kids"]);
    const spots = pick((s) => s.category === "activite" && (!kids || s.moods.includes("famille")), t, 4);
    return `${kids ? "Des activités qui plaisent aux petits comme aux grands" : "Des idées d'activités, du classique au très confidentiel"} :\n\n${list(spots)}\n\nAppuie sur une activité pour **la réserver**.\n\n[[go:/explorer?cat=activite|Voir toutes les activités]]`;
  }

  // 7. Recherches par envie
  const romantic = has(t, ["date", "romant", "amoureu", "couple"]);
  if (has(t, ["jazz", "musique", "concert", "danser", "swing"])) return `Ça swingue par ici :\n\n${list(pick((s) => s.moods.includes("jazz"), t))}`;
  if (has(t, ["verre", "bar", "cocktail", "apero", "boire", "vin"])) {
    return `${romantic ? "Pour un verre à deux qui fait son effet" : "Pour trinquer"}, voilà mes 3 bonnes :\n\n${list(pick((s) => s.category === "bar" && (!romantic || s.moods.includes("romantique") || s.hidden === 3), t))}`;
  }
  if (has(t, ["manger", "resto", "restaurant", "diner", "dejeuner", "faim", "bouffe", "table"])) {
    const budget = has(t, ["pas cher", "budget", "fauche"]);
    return `J'ai faim rien qu'à y penser :\n\n${list(pick((s) => s.category === "resto" && (!budget || s.price === 1), t))}\n\nAppuie sur une adresse pour **réserver une table**.`;
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
