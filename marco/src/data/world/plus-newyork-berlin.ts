import type { Row } from "./types";

export const NEW_YORK_PLUS: Row[] = [
  // ---- Restos ----
  ["nyc-lombardis", "Lombardi's", "resto", "SoHo", "32 Spring St", 40.7216, -73.9956, 1, 1, "famille", "La première pizzeria des États-Unis, ouverte en 1905, four à charbon compris.", "Une pizza entière se partage à deux ou trois.", 60],
  ["nyc-nom-wah", "Nom Wah Tea Parlor", "resto", "Lower East Side", "13 Doyers St", 40.7143, -73.9982, 1, 2, "petit-budget,cache", "Le plus vieux salon de dim sum de Chinatown, dans une rue en coude.", "Coche ta commande sur la feuille de papier.", 60],
  ["nyc-xian", "Xi'an Famous Foods", "resto", "Lower East Side", "45 Bayard St", 40.7152, -73.9978, 1, 1, "petit-budget", "Des nouilles tirées à la main épicées à la façon de Xi'an.", "Les nouilles à l'agneau épicé au cumin sont la référence.", 30],
  ["nyc-carbone", "Carbone", "resto", "Greenwich Village", "181 Thompson St", 40.7279, -73.9998, 3, 1, "romantique", "Le restaurant italo-américain le plus couru de New York, serveurs en smoking.", "Les réservations ouvrent à l'avance et partent en minutes.", 120],
  ["nyc-shake-shack", "Shake Shack Madison Square Park", "resto", "Midtown", "Madison Square Park", 40.7415, -73.9882, 1, 1, "famille,petit-budget", "Le kiosque d'origine de la chaîne de burgers, au milieu d'un parc.", "Mange sur un banc face au Flatiron Building.", 45],
  ["nyc-barney-greengrass", "Barney Greengrass", "resto", "Upper West Side", "541 Amsterdam Ave", 40.788, -73.9745, 2, 2, "famille", "Le « roi de l'esturgeon » depuis 1908 : poissons fumés et œufs brouillés au saumon.", "Le brunch du week-end attire du monde : viens en semaine.", 60],
  ["nyc-ess-a-bagel", "Ess-a-Bagel", "resto", "Midtown", "831 3rd Ave", 40.7555, -73.9705, 1, 1, "petit-budget", "Des bagels énormes et moelleux, roulés et bouillis à la main.", "Prends un everything bagel au cream cheese à l'oignon.", 20],
  ["nyc-juniors", "Junior's", "resto", "DUMBO", "386 Flatbush Ave Ext, Brooklyn", 40.6901, -73.9813, 1, 1, "famille", "Le cheesecake new-yorkais de référence depuis 1950.", "Le cheesecake nature est le meilleur.", 45],
  // ---- Bars ----
  ["nyc-employees-only", "Employees Only", "bar", "Greenwich Village", "510 Hudson St", 40.7334, -74.0062, 2, 2, "tendance", "Un speakeasy primé derrière une diseuse de bonne aventure, ouvert jusqu'à 4 h.", "La voyante à l'entrée fait vraiment des lectures.", 90],
  ["nyc-campbell", "The Campbell", "bar", "Midtown", "15 Vanderbilt Ave", 40.7528, -73.9775, 2, 3, "cache,romantique", "L'ancien bureau d'un magnat des années 1920, caché dans Grand Central.", "Entre par la porte de Vanderbilt Avenue.", 60],
  ["nyc-smalls", "Smalls Jazz Club", "bar", "Greenwich Village", "183 W 10th St", 40.7344, -74.0026, 1, 2, "jazz", "Un club de jazz en sous-sol où les jam sessions durent jusqu'au petit matin.", "Les jam sessions de fin de soirée sont les plus folles.", 120],
  ["nyc-230-fifth", "230 Fifth Rooftop", "bar", "Midtown", "230 5th Ave", 40.744, -73.988, 2, 1, "romantique", "Un grand rooftop avec une vue directe sur l'Empire State Building.", "En hiver, des igloos chauffés sont installés.", 75],
  // ---- Culture, insolite ----
  ["nyc-amnh", "American Museum of Natural History", "culture", "Upper West Side", "200 Central Park W", 40.7813, -73.974, 2, 1, "famille", "Les dinosaures, la baleine bleue et le planétarium du musée de « La Nuit au musée ».", "Le prix d'entrée est libre pour les résidents, pas pour les touristes : réserve en ligne.", 180],
  ["nyc-guggenheim", "Musée Guggenheim", "culture", "Upper East Side", "1071 5th Ave", 40.783, -73.959, 2, 1, "bobo", "La spirale blanche de Frank Lloyd Wright, à parcourir du haut vers le bas.", "Prends l'ascenseur jusqu'en haut et redescends la rampe.", 90],
  ["nyc-911-memorial", "Mémorial et musée du 11-Septembre", "culture", "Financial District", "180 Greenwich St", 40.7115, -74.0134, 2, 1, "famille", "Deux bassins à l'emplacement des tours jumelles, et un musée bouleversant.", "Le mémorial extérieur est gratuit.", 120],
  ["nyc-statue-liberty", "Statue de la Liberté et Ellis Island", "culture", "Financial District", "Battery Park", 40.7033, -74.017, 2, 1, "famille", "La statue et l'île où sont arrivés des millions d'immigrants.", "Réserve tôt pour monter dans le piédestal ou la couronne.", 240],
  ["nyc-strand", "Strand Bookstore", "insolite", "Greenwich Village", "828 Broadway", 40.7333, -73.9909, 1, 1, "bobo,petit-budget", "La librairie aux « 18 miles of books », neufs et d'occasion.", "Les livres à 1 dollar sont sur les étagères extérieures.", 60],
  // ---- Activités ----
  ["nyc-top-of-the-rock", "Top of the Rock", "activite", "Midtown", "30 Rockefeller Plaza", 40.7593, -73.9794, 2, 1, "romantique,famille", "La vue sur l'Empire State Building et Central Park, depuis le Rockefeller Center.", "Réserve le créneau du coucher du soleil.", 60],
  ["nyc-edge", "Edge Hudson Yards", "activite", "Chelsea", "30 Hudson Yards", 40.7538, -74.001, 2, 1, "insolite", "La plus haute terrasse extérieure de l'hémisphère ouest, avec un sol vitré.", "Le sol en verre au-dessus du vide est pour les estomacs solides.", 60],
  ["nyc-janes-carousel", "Brooklyn Bridge Park et Jane's Carousel", "nature", "DUMBO", "Old Dock St, Brooklyn", 40.7045, -73.9925, 1, 1, "famille,romantique", "Un parc au bord de l'eau face à Manhattan, avec un carrousel de 1922 sous verre.", "Le soir, la vue sur la skyline illuminée est superbe.", 90],
];

export const BERLIN_PLUS: Row[] = [
  // ---- Restos ----
  ["ber-burgermeister", "Burgermeister", "resto", "Kreuzberg", "Oberbaumstraße 8", 52.501, 13.442, 1, 2, "petit-budget", "Des burgers servis dans d'anciennes toilettes publiques sous le métro aérien.", "Mange sous les rails du U1, c'est tout le charme.", 30],
  ["ber-mustafa", "Mustafa's Gemüse Kebap", "resto", "Kreuzberg", "Mehringdamm 32", 52.4937, 13.3881, 1, 1, "petit-budget", "Le döner aux légumes grillés le plus célèbre de Berlin, et la file qui va avec.", "Viens en milieu d'après-midi en semaine pour éviter l'attente.", 45],
  ["ber-hasir", "Hasir", "resto", "Kreuzberg", "Adalbertstraße 10", 52.5, 13.418, 1, 2, "petit-budget", "Le restaurant turc qui revendique l'invention du döner berlinois.", "Les grillades au feu de bois sont excellentes.", 60],
  ["ber-max-moritz", "Max und Moritz", "resto", "Kreuzberg", "Oranienstraße 162", 52.5025, 13.4115, 2, 2, "famille", "La cuisine berlinoise traditionnelle dans une brasserie de 1902.", "Goûte le Königsberger Klopse, boulettes à la sauce aux câpres.", 90],
  ["ber-monsieur-vuong", "Monsieur Vuong", "resto", "Mitte", "Alte Schönhauser Straße 46", 52.527, 13.4085, 1, 1, "petit-budget", "Une cantine vietnamienne pionnière de Mitte, deux plats du jour et des soupes.", "Pas de réservation : le service est rapide.", 45],
  ["ber-tim-raue", "Restaurant Tim Raue", "resto", "Kreuzberg", "Rudi-Dutschke-Straße 26", 52.507, 13.3905, 3, 1, "romantique", "La grande table étoilée de Berlin, cuisine inspirée de l'Asie.", "Réserve plusieurs semaines à l'avance.", 180],
  ["ber-anna-blume", "Café Anna Blume", "cafe", "Prenzlauer Berg", "Kollwitzstraße 83", 52.539, 13.417, 2, 2, "romantique", "Un café-fleuriste Art nouveau célèbre pour ses étagères de brunch.", "Commande l'étagère de brunch à partager.", 75],
  ["ber-rogacki", "Rogacki", "resto", "Charlottenburg", "Wilmersdorfer Straße 145", 52.5155, 13.307, 1, 3, "cache", "Une épicerie fine de 1928 où l'on mange du poisson fumé debout au comptoir.", "Viens le samedi midi, l'ambiance est unique.", 45],
  // ---- Bars ----
  ["ber-becketts-kopf", "Becketts Kopf", "bar", "Prenzlauer Berg", "Pappelallee 64", 52.5455, 13.4155, 2, 3, "cache", "Un bar à cocktails feutré, derrière une vitrine où trône le portrait de Samuel Beckett.", "Sonne à la porte, on t'installe.", 75],
  ["ber-monkey-bar", "Monkey Bar", "bar", "Tiergarten", "Budapester Straße 40", 52.505, 13.338, 2, 1, "romantique", "Un rooftop avec vue sur le zoo et ses singes.", "Viens au coucher du soleil.", 60],
  ["ber-kater-blau", "Kater Blau", "bar", "Friedrichshain", "Holzmarktstraße 25", 52.5115, 13.4255, 2, 2, "tendance", "Un village de bois au bord de la Spree, entre bar, club et terrasse.", "L'été, les soirées durent tout le week-end.", 180],
  ["ber-fragrances", "Fragrances", "bar", "Tiergarten", "Potsdamer Platz 3", 52.5095, 13.3755, 3, 2, "romantique", "Un bar où chaque cocktail est inspiré d'un parfum, qu'on sent avant de choisir.", "Laisse-toi guider par les flacons.", 60],
  // ---- Culture, insolite ----
  ["ber-ddr-museum", "DDR Museum", "culture", "Mitte", "Karl-Liebknecht-Straße 1", 52.5194, 13.4029, 2, 1, "famille", "La vie quotidienne en RDA, à toucher : on peut même s'asseoir dans une Trabant.", "Parfait pour comprendre le Berlin d'avant 1989.", 75],
  ["ber-topographie", "Topographie de la terreur", "culture", "Kreuzberg", "Niederkirchnerstraße 8", 52.5068, 13.3833, 1, 2, "famille", "Sur le site de l'ancienne Gestapo, l'histoire de la terreur nazie, gratuitement.", "Un morceau du Mur longe le site.", 90],
  ["ber-gemaeldegalerie", "Gemäldegalerie", "culture", "Tiergarten", "Matthäikirchplatz", 52.5085, 13.365, 2, 3, "cache,romantique", "Rembrandt, Vermeer, Caravage : l'une des plus grandes collections de peinture ancienne, souvent calme.", "Le musée est rarement bondé, même le week-end.", 150],
  ["ber-holocaust-memorial", "Mémorial aux Juifs assassinés d'Europe", "culture", "Mitte", "Cora-Berliner-Straße 1", 52.5139, 13.3787, 1, 1, "famille", "Un champ de 2 711 stèles de béton à traverser, et un centre d'information souterrain.", "Le centre d'information sous le mémorial est essentiel.", 60],
  ["ber-treptower", "Mémorial soviétique de Treptower Park", "insolite", "Neukölln", "Puschkinallee", 52.486, 13.471, 1, 3, "cache,insolite", "Un immense mémorial soviétique, avec une statue de soldat de 12 mètres.", "Une ambiance saisissante, à deux pas des bords de la Spree.", 60],
  ["ber-boxhagener", "Marché aux puces de Boxhagener Platz", "insolite", "Friedrichshain", "Boxhagener Platz", 52.5105, 13.46, 1, 2, "petit-budget", "Le marché aux puces du dimanche, sur une place pleine de cafés.", "Brunch dans un café de la place avant de chiner.", 90],
  // ---- Activités ----
  ["ber-fernsehturm", "Tour de télévision", "activite", "Mitte", "Panoramastraße 1A", 52.5208, 13.4094, 2, 1, "famille", "La tour de la RDA, avec une vue à 360° depuis 203 mètres.", "Réserve un billet coupe-file en ligne.", 60],
  ["ber-liquidrom", "Liquidrom", "activite", "Kreuzberg", "Möckernstraße 10", 52.499, 13.3825, 2, 3, "cache,romantique", "Un bain d'eau salée sous un dôme, avec musique diffusée sous l'eau.", "Les soirées avec DJ sont étonnantes.", 120],
  ["ber-naturkunde", "Musée d'histoire naturelle", "activite", "Mitte", "Invalidenstraße 43", 52.53, 13.379, 2, 1, "famille", "Le plus grand squelette de dinosaure monté au monde, et un T. rex authentique.", "Les enfants adorent la salle des dinosaures.", 120],
];
