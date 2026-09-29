import type { Diet } from "./spots";

/* ------------------------------------------------------------------ */
/* Manger casher / halal : les quartiers où chercher                   */
/* ------------------------------------------------------------------ */
export interface DietZone {
  diet: Diet;
  name: string;
  arr: number[];
  streets: string;
  text: string;
}

export const DIET_ZONES: DietZone[] = [
  {
    diet: "casher",
    name: "Le Marais (Pletzl)",
    arr: [4],
    streets: "Rue des Rosiers, rue des Écouffes, rue Ferdinand-Duval",
    text: "Le quartier juif historique : falafels, pâtisseries, épiceries et restaurants casher dans un mouchoir de poche.",
  },
  {
    diet: "casher",
    name: "Faubourg-Montmartre",
    arr: [9],
    streets: "Rue Richer, rue Cadet, rue du Faubourg-Montmartre",
    text: "Autour de la rue Richer : restaurants, boulangeries et épiceries casher, à deux pas des Grands Boulevards.",
  },
  {
    diet: "casher",
    name: "Belleville",
    arr: [11, 20],
    streets: "Boulevard de Belleville",
    text: "Quelques adresses de cuisine judéo-tunisienne, héritage d'une communauté installée ici depuis des décennies.",
  },
  {
    diet: "halal",
    name: "Goutte d'Or · Barbès · Château-Rouge",
    arr: [18],
    streets: "Rue Myrha, rue des Poissonniers, rue Doudeauville, boulevard Barbès",
    text: "Cuisines d'Afrique du Nord et d'Afrique de l'Ouest, boucheries et restaurants halal à chaque coin de rue.",
  },
  {
    diet: "halal",
    name: "Belleville",
    arr: [19, 20, 11, 10],
    streets: "Rue de Belleville, boulevard de Belleville, rue du Faubourg-du-Temple",
    text: "Restaurants maghrébins et turcs, grillades et pâtisseries orientales, souvent halal.",
  },
  {
    diet: "halal",
    name: "Faubourg-Saint-Denis · Passage Brady",
    arr: [10],
    streets: "Passage Brady, rue du Faubourg-Saint-Denis",
    text: "La « petite Inde » de Paris : cuisines indienne et pakistanaise, nombreuses adresses halal, curries à petits prix.",
  },
  {
    diet: "halal",
    name: "Grande Mosquée de Paris",
    arr: [5],
    streets: "Rue Geoffroy-Saint-Hilaire",
    text: "Le restaurant de la Grande Mosquée sert couscous et tajines halal dans un décor andalou.",
  },
];

export const DIET_NOTE =
  "Les certifications (Beth Din, AVS…) peuvent changer : vérifie le label affiché sur place avant de t'installer.";

/* ------------------------------------------------------------------ */
/* Sortir le soir : l'ambiance et les lieux de chaque arrondissement   */
/* ------------------------------------------------------------------ */
export interface NightVenue {
  name: string;
  address: string;
  kind: string;
  tip: string;
}
export interface NightGuide {
  arr: number;
  vibe: string;
  venues: NightVenue[];
}

export const NIGHT: NightGuide[] = [
  { arr: 1, vibe: "Clubs de jazz de la rue des Lombards et bars d'hôtels chics.", venues: [
    { name: "Duc des Lombards", address: "42 rue des Lombards", kind: "Jazz", tip: "Concerts intimistes, son impeccable." },
    { name: "Sunset-Sunside", address: "60 rue des Lombards", kind: "Jazz", tip: "Deux salles, deux ambiances, programmation pointue." },
    { name: "Baiser Salé", address: "58 rue des Lombards", kind: "Jazz", tip: "Jazz, latin et jam sessions." },
    { name: "Bar Hemingway", address: "Hôtel Ritz, 15 place Vendôme", kind: "Cocktails", tip: "Tenue correcte, pour une soirée qui a de la classe." },
  ] },
  { arr: 2, vibe: "Clubbing électro et bars à cocktails cachés autour de Montorgueil.", venues: [
    { name: "Rex Club", address: "5 boulevard Poissonnière", kind: "Club électro", tip: "Une institution de la techno parisienne." },
    { name: "Experimental Cocktail Club", address: "37 rue Saint-Sauveur", kind: "Cocktails", tip: "Le bar qui a lancé la mode des cocktails à Paris." },
    { name: "Frenchie Bar à Vins", address: "6 rue du Nil", kind: "Bar à vins", tip: "Sans réservation, dans une ruelle piétonne." },
  ] },
  { arr: 3, vibe: "Haut-Marais branché : speakeasies, bars à huîtres et apéros qui s'éternisent.", venues: [
    { name: "Candelaria", address: "52 rue de Saintonge", kind: "Bar caché", tip: "Derrière la taqueria, pousse la porte blanche." },
    { name: "Le Mary Celeste", address: "1 rue Commines", kind: "Cocktails & huîtres", tip: "Parfait pour commencer la soirée." },
  ] },
  { arr: 4, vibe: "Bars animés de la rue Vieille-du-Temple, le cœur festif du Marais.", venues: [
    { name: "Le Petit Fer à Cheval", address: "30 rue Vieille-du-Temple", kind: "Bar", tip: "Un comptoir en fer à cheval minuscule et toujours plein." },
    { name: "La Belle Hortense", address: "31 rue Vieille-du-Temple", kind: "Bar à vins & livres", tip: "Un verre de vin entre les rayonnages d'une librairie." },
  ] },
  { arr: 5, vibe: "Caves étudiantes, swing et rock au Quartier Latin.", venues: [
    { name: "Caveau de la Huchette", address: "5 rue de la Huchette", kind: "Swing & jazz", tip: "On y danse dans une cave médiévale." },
    { name: "Le Piano Vache", address: "8 rue Laplace", kind: "Bar rock", tip: "Bar étudiant culte, murs couverts d'affiches." },
  ] },
  { arr: 6, vibe: "Cocktails raffinés et terrasses de Saint-Germain-des-Prés.", venues: [
    { name: "Prescription Cocktail Club", address: "23 rue Mazarine", kind: "Cocktails", tip: "Ambiance feutrée, porte discrète." },
    { name: "Castor Club", address: "14 rue Hautefeuille", kind: "Cocktails", tip: "Petit bar en bois, cave au sous-sol." },
    { name: "Le Bar du Marché", address: "75 rue de Seine", kind: "Terrasse", tip: "Pour regarder passer tout Saint-Germain." },
  ] },
  { arr: 7, vibe: "Calme et chic : on y dîne avec vue plutôt qu'on y danse.", venues: [
    { name: "Les Ombres", address: "Musée du quai Branly, 27 quai Branly", kind: "Rooftop", tip: "Dîner sous la tour Eiffel illuminée." },
  ] },
  { arr: 8, vibe: "Nuits glamour : cabarets, palaces et bars des Champs-Élysées.", venues: [
    { name: "Crazy Horse", address: "12 avenue George-V", kind: "Cabaret", tip: "Le cabaret le plus chic de Paris, réservation indispensable." },
    { name: "Buddha-Bar", address: "8 rue Boissy-d'Anglas", kind: "Bar lounge", tip: "Un bouddha géant veille sur la salle." },
  ] },
  { arr: 9, vibe: "SoPi (South Pigalle) : la rue la plus festive de Paris, bars à cocktails les uns sur les autres.", venues: [
    { name: "Dirty Dick", address: "10 rue Frochot", kind: "Tiki bar", tip: "Cocktails tropicaux dans une ancienne adresse sulfureuse." },
    { name: "Lulu White", address: "12 rue Frochot", kind: "Cocktails", tip: "Ambiance Nouvelle-Orléans années 1920." },
  ] },
  { arr: 10, vibe: "Canal Saint-Martin et faubourgs : bars de quartier, jazz et concerts.", venues: [
    { name: "New Morning", address: "7 rue des Petites-Écuries", kind: "Jazz & concerts", tip: "La salle mythique du jazz et des musiques du monde." },
    { name: "Le Syndicat", address: "51 rue du Faubourg-Saint-Denis", kind: "Cocktails", tip: "100 % spiritueux français." },
    { name: "Point Éphémère", address: "200 quai de Valmy", kind: "Concerts & club", tip: "Au bord du canal, concerts puis DJ." },
    { name: "La Java", address: "105 rue du Faubourg-du-Temple", kind: "Club", tip: "Ancien bal musette devenu club." },
  ] },
  { arr: 11, vibe: "La capitale de la nuit : Oberkampf, Bastille et rue de Lappe jusqu'au bout de la nuit.", venues: [
    { name: "Café Charbon", address: "109 rue Oberkampf", kind: "Bar", tip: "L'adresse qui a lancé Oberkampf." },
    { name: "Badaboum", address: "2 bis rue des Taillandiers", kind: "Club", tip: "Club et salle de concert, près de Bastille." },
    { name: "Le Balajo", address: "9 rue de Lappe", kind: "Bal & club", tip: "L'ancien bal musette de 1936." },
    { name: "Moonshiner", address: "5 rue Sedaine", kind: "Bar caché", tip: "Entre par la pizzeria, puis la chambre froide." },
    { name: "Le Perchoir", address: "14 rue Crespin-du-Gast", kind: "Rooftop", tip: "Monte avant le coucher du soleil." },
  ] },
  { arr: 12, vibe: "Bars à vins autour d'Aligre et concerts gratuits près de Bastille.", venues: [
    { name: "Le Baron Rouge", address: "1 rue Théophile-Roussel", kind: "Bar à vins", tip: "Verres sur les tonneaux, sur le trottoir." },
    { name: "Supersonic", address: "9 rue Biscornet", kind: "Concerts rock", tip: "Concerts souvent gratuits." },
  ] },
  { arr: 13, vibe: "Péniches et clubs au bord de la Seine, bars de village à la Butte-aux-Cailles.", venues: [
    { name: "Petit Bain", address: "7 port de la Gare", kind: "Péniche concerts", tip: "Concerts puis terrasse sur l'eau." },
    { name: "Djoon", address: "22 boulevard Vincent-Auriol", kind: "Club house", tip: "Le temple de la house music." },
    { name: "Le Merle Moqueur", address: "11 rue de la Butte-aux-Cailles", kind: "Bar", tip: "Rhums arrangés, ambiance village." },
  ] },
  { arr: 14, vibe: "Montparnasse des artistes : bars historiques et théâtres de la rue de la Gaîté.", venues: [
    { name: "Le Rosebud", address: "11 bis rue Delambre", kind: "Bar à cocktails", tip: "Barmen en veste blanche, ambiance d'après-guerre." },
    { name: "Bobino", address: "20 rue de la Gaîté", kind: "Spectacles", tip: "Music-hall historique de Montparnasse." },
  ] },
  { arr: 15, vibe: "Quartier résidentiel : la soirée se joue en hauteur.", venues: [
    { name: "Le Ciel de Paris", address: "Tour Montparnasse, 56e étage", kind: "Bar panoramique", tip: "Paris entier à tes pieds, tour Eiffel comprise." },
  ] },
  { arr: 16, vibe: "Chic et calme : dîners avec vue sur la tour Eiffel et vernissages tardifs.", venues: [
    { name: "Palais de Tokyo", address: "13 avenue du Président-Wilson", kind: "Art & nocturnes", tip: "Ouvert tard le soir, enchaîne avec un verre sur les marches." },
    { name: "Café de l'Homme", address: "17 place du Trocadéro", kind: "Bar-restaurant", tip: "Terrasse face à la tour Eiffel illuminée." },
  ] },
  { arr: 17, vibe: "Batignolles : un village bobo, bars de quartier et caves à vins sans chichis.", venues: [
    { name: "Les Caves Populaires", address: "22 rue des Dames", kind: "Bar à vins", tip: "Le repaire des Batignolles, prix doux." },
    { name: "Le Bistrot des Dames", address: "18 rue des Dames", kind: "Bistrot & jardin", tip: "Un jardin caché à l'arrière, rare dans Paris." },
  ] },
  { arr: 18, vibe: "Pigalle et Montmartre : cabarets, salles de concert mythiques et bars de la rue des Martyrs.", venues: [
    { name: "La Machine du Moulin Rouge", address: "90 boulevard de Clichy", kind: "Club & concerts", tip: "Juste à côté du Moulin Rouge, en sous-sol." },
    { name: "La Cigale", address: "120 boulevard de Rochechouart", kind: "Concerts", tip: "Salle à l'italienne, programmation pop-rock." },
    { name: "Madame Arthur", address: "75 bis rue des Martyrs", kind: "Cabaret", tip: "Cabaret travesti historique, chansons françaises revisitées." },
    { name: "Au Lapin Agile", address: "22 rue des Saules", kind: "Chanson française", tip: "On chante en chœur les classiques." },
  ] },
  { arr: 19, vibe: "Guinguettes des Buttes-Chaumont, bassin de la Villette et grandes salles de la Villette.", venues: [
    { name: "Rosa Bonheur", address: "Parc des Buttes-Chaumont", kind: "Guinguette", tip: "Tapas, pichets, on danse." },
    { name: "Pavillon Puebla", address: "Parc des Buttes-Chaumont", kind: "Guinguette & DJ", tip: "Terrasse géante dans le parc." },
    { name: "La Rotonde Stalingrad", address: "6-8 place de la Bataille-de-Stalingrad", kind: "Bar & club", tip: "Au bord du bassin de la Villette." },
    { name: "Cabaret Sauvage", address: "Parc de la Villette", kind: "Concerts", tip: "Sous un chapiteau en bois et miroirs." },
  ] },
  { arr: 20, vibe: "Belleville et Ménilmontant : concerts, bars populaires et rooftops avec vue.", venues: [
    { name: "La Bellevilloise", address: "19-21 rue Boyer", kind: "Concerts & club", tip: "Ancienne coopérative ouvrière devenue lieu de fête." },
    { name: "La Maroquinerie", address: "23 rue Boyer", kind: "Concerts", tip: "Petite salle, groupes à découvrir." },
    { name: "Aux Folies", address: "8 rue de Belleville", kind: "Bar", tip: "Ancien café-concert où auraient chanté Piaf et Maurice Chevalier." },
    { name: "Mama Shelter", address: "109 rue de Bagnolet", kind: "Rooftop & bar", tip: "Ambiance festive, vue sur l'est parisien." },
  ] },
];

export const NIGHT_NOTE = "Les programmes changent chaque semaine : vérifie l'agenda du lieu avant d'y aller.";

/** "17e", "17ème", "le 17", "17 arrondissement", "1er" → numéro d'arrondissement (ou null) */
export function arrFromText(text: string): number | null {
  const t = text.toLowerCase();
  for (const m of t.matchAll(/(^|[^\d])(1er|\d{1,2})\s*(eme|ème|ieme|ième|er|e|è)?(?![\da-zà-ÿ])/g)) {
    const n = m[2] === "1er" ? 1 : Number(m[2]);
    if (n < 1 || n > 20) continue;
    const before = t.slice(0, m.index! + m[1].length);
    const after = t.slice(m.index! + m[0].length);
    if (m[2] === "1er" || m[3]) {
      if (/^\s*(h\b|heures?|min|€|euros?|pers)/.test(after)) continue;
      return n;
    }
    if (/\b(le|du|au|dans)\s*$/.test(before) || /^\s*(arr|arrondissement)/.test(after)) return n;
  }
  return null;
}
