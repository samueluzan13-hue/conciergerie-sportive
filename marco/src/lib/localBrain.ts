// Le "cerveau local" de Marco : répond sans IA en ligne, à partir de sa base d'adresses et de rues.
import { SPOTS, QUARTIERS, type Spot } from "../data/spots";
import { findStreet, type StreetStory } from "../data/streets";
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

function pick(filter: (s: Spot) => boolean, t: string, n = 3) {
  const { profile } = getState();
  const q = QUARTIERS.find((x) => norm(t).includes(norm(x.name).split(" /")[0])) ??
    QUARTIERS.find((x) => x.name === profile.quartier) ?? QUARTIERS[0];
  return SPOTS.filter(filter)
    .map((s) => ({ s, d: distanceKm(q, s) - s.hidden * 0.4 }))
    .sort((a, b) => a.d - b.d)
    .slice(0, n)
    .map((x) => x.s);
}

const list = (spots: Spot[]) => spots.map((s) => `- [[spot:${s.id}]] — ${s.pitch}`).join("\n");

export function localReply(input: string): string {
  const t = norm(input);
  const { profile } = getState();
  const name = profile.name ? ` ${profile.name}` : "";

  // 1. Histoire de rue
  const streetQuery = input.match(/\b(rue|avenue|av\.?|boulevard|bd|place|passage|quai)\s+.+/i)?.[0];
  const street = findStreet(streetQuery ?? input);
  if (street && (streetQuery || input.trim().split(/\s+/).length <= 4)) return streetMarkdown(street);
  if (streetQuery) {
    return `Je n'ai pas encore la fiche de **${streetQuery.trim()}** dans ma mémoire hors-ligne. Branche mon IA (clé API) et je te raconte n'importe quelle rue de Paris.\n\nEn attendant, essaie : rue Mouffetard, rue Lepic, place des Vosges, rue du Chat-qui-Pêche…`;
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

  // 4. Recherches par envie
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
