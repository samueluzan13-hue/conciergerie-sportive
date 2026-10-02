import type { Row } from "./types";

export const LONDRES_PLUS: Row[] = [
  // ---- Restos ----
  ["lon-barrafina", "Barrafina Dean Street", "resto", "Soho", "26-27 Dean Street", 51.5138, -0.1318, 2, 2, "tendance", "Un comptoir de tapas espagnoles étoilé, où l'on mange face aux cuisiniers.", "Pas de réservation : viens à l'ouverture.", 75],
  ["lon-hawksmoor", "Hawksmoor Seven Dials", "resto", "Covent Garden", "11 Langley Street", 51.5138, -0.1253, 3, 1, "romantique", "Le steakhouse britannique de référence, viande maturée grillée au charbon.", "Le menu du dimanche midi avec rôti est une institution.", 100],
  ["lon-flat-iron", "Flat Iron Covent Garden", "resto", "Covent Garden", "17 Henrietta Street", 51.511, -0.1235, 1, 1, "petit-budget", "Un steak à prix doux, servi avec une petite hachette en guise de couteau.", "Le dessert glace est offert à la sortie.", 60],
  ["lon-poppies", "Poppies Fish & Chips", "resto", "Shoreditch", "6-8 Hanbury Street", 51.52, -0.072, 1, 1, "petit-budget,famille", "Le fish and chips à l'ancienne, servi dans du papier journal façon années 1950.", "Prends le cabillaud avec les petits pois en purée.", 45],
  ["lon-tayyabs", "Tayyabs", "resto", "Whitechapel", "83-89 Fieldgate Street", 51.5169, -0.0647, 1, 2, "petit-budget", "Les grillades pendjabies les plus célèbres de Londres, côtelettes d'agneau grésillantes.", "On peut apporter sa boisson : prévois-la avant.", 75, "", undefined, "halal"],
  ["lon-reubens", "Reubens", "resto", "Marylebone", "79 Baker Street", 51.5195, -0.157, 2, 2, "famille", "Un restaurant casher de Baker Street, deli au rez-de-chaussée et salle à l'étage.", "Le corned-beef sandwich est la spécialité.", 60, "", undefined, "casher"],
  ["lon-wolseley", "The Wolseley", "cafe", "Mayfair", "160 Piccadilly", 51.5073, -0.1408, 2, 1, "romantique", "Un grand café européen dans une ancienne salle d'exposition automobile des années 1920.", "Le petit-déjeuner anglais y est servi dans un décor spectaculaire.", 60],
  ["lon-sketch", "Sketch (The Gallery)", "resto", "Mayfair", "9 Conduit Street", 51.5128, -0.1414, 3, 2, "insolite,romantique", "Une salle entièrement rose et des toilettes en forme d'œufs : le lieu le plus photographié de Mayfair.", "L'afternoon tea est la façon la plus accessible d'y aller.", 90],
  // ---- Bars ----
  ["lon-gordons", "Gordon's Wine Bar", "bar", "Covent Garden", "47 Villiers Street", 51.508, -0.1225, 1, 2, "cache,romantique", "Le plus vieux bar à vin de Londres, dans des caves voûtées éclairées à la bougie.", "La terrasse extérieure est très prisée aux beaux jours.", 75],
  ["lon-mayflower", "The Mayflower", "bar", "Borough · Bermondsey", "117 Rotherhithe Street", 51.5017, -0.053, 1, 3, "cache", "Le plus vieux pub au bord de la Tamise, d'où seraient partis les Pères pèlerins.", "La terrasse sur pilotis donne directement sur le fleuve.", 60],
  ["lon-tayer", "Tayēr + Elementary", "bar", "Shoreditch", "152 Old Street", 51.5255, -0.087, 2, 2, "tendance", "Un bar double, régulièrement classé parmi les meilleurs du monde.", "Le côté Elementary est plus détendu, sans réservation.", 75],
  ["lon-bar-italia", "Bar Italia", "cafe", "Soho", "22 Frith Street", 51.5135, -0.1317, 1, 2, "petit-budget", "Le café italien de Soho ouvert jusqu'au bout de la nuit depuis 1949.", "Un expresso au comptoir à 2 h du matin, c'est Londres.", 20],
  // ---- Culture, insolite ----
  ["lon-va", "Victoria and Albert Museum", "culture", "Kensington", "Cromwell Road", 51.4966, -0.1722, 1, 1, "famille", "Le musée des arts décoratifs et du design, gratuit, avec un jardin et un café somptueux.", "Prends un thé dans les salles Morris, le premier café de musée au monde.", 150],
  ["lon-natural-history", "Natural History Museum", "culture", "Kensington", "Cromwell Road", 51.4967, -0.1764, 1, 1, "famille", "Une cathédrale victorienne pour les dinosaures et la baleine bleue, gratuite.", "Arrive à l'ouverture, la file monte vite le week-end.", 150],
  ["lon-camden-market", "Camden Market", "insolite", "Camden", "Camden Lock Place", 51.5413, -0.1463, 1, 1, "tendance,petit-budget", "Le marché alternatif de Londres, street food et boutiques au bord du canal.", "Les stands de nourriture du Market Hall valent le détour.", 120],
  ["lon-barbican-conservatory", "Barbican Conservatory", "insolite", "La City", "Silk Street", 51.5203, -0.0938, 1, 3, "cache,insolite", "Une jungle tropicale cachée au cœur du complexe brutaliste du Barbican.", "Ouvert seulement certains jours : réserve un créneau gratuit.", 60],
  // ---- Activités ----
  ["lon-sky-garden", "Sky Garden", "activite", "La City", "20 Fenchurch Street", 51.5111, -0.0835, 1, 1, "romantique,petit-budget", "Un jardin suspendu en haut d'un gratte-ciel, avec une vue à 360° gratuite.", "Gratuit, mais réservation obligatoire quelques semaines avant.", 60],
  ["lon-comedy-store", "The Comedy Store", "activite", "Soho", "1a Oxendon Street", 51.5097, -0.1323, 2, 1, "tendance", "Le club de stand-up où sont passés les plus grands comiques britanniques.", "Le show d'improvisation du mercredi est culte.", 120],
];

export const LISBONNE_PLUS: Row[] = [
  // ---- Restos ----
  ["lis-cantinho-avillez", "Cantinho do Avillez", "resto", "Chiado", "Rua dos Duques de Bragança 7", 38.709, -9.1425, 2, 1, "tendance", "Le bistrot de José Avillez : cuisine portugaise réconfortante et twist voyageur.", "Les « peixinhos da horta » (haricots frits) sont incontournables.", 75],
  ["lis-sea-me", "Sea Me", "resto", "Chiado", "Rua do Loreto 21", 38.7105, -9.145, 2, 2, "tendance", "Une poissonnerie-restaurant où l'on choisit son poisson à l'étal.", "Le sushi portugais à base de poisson local vaut le détour.", 90],
  ["lis-o-trevo", "O Trevo", "resto", "Chiado", "Praça Luís de Camões 48", 38.7105, -9.1435, 1, 1, "petit-budget", "Le comptoir de la bifana, sandwich de porc mariné, à manger debout.", "Ajoute un trait de moutarde et une bière bien fraîche.", 15],
  ["lis-sal-grosso", "Taberna Sal Grosso", "resto", "Alfama", "Calçada do Forte 22", 38.7135, -9.124, 1, 3, "cache", "Une minuscule taverne de l'Alfama, tapas portugaises inventives et ambiance de copains.", "Réserve : il y a très peu de tables.", 90],
  ["lis-bonjardim", "Bonjardim, Rei dos Frangos", "resto", "Baixa", "Travessa de Santo Antão 11", 38.7155, -9.1415, 1, 2, "petit-budget,famille", "Le roi du poulet grillé au piri-piri, servi depuis des décennies.", "Demande la sauce piri-piri à part, elle est forte.", 60],
  ["lis-cafe-sao-bento", "Café de São Bento", "resto", "Príncipe Real", "Rua de São Bento 212", 38.7135, -9.152, 2, 2, "romantique", "Le steak lisboète, sauce à la crème et frites, dans un salon de velours rouge.", "Commande le bife à café de São Bento, la recette maison.", 75],
  ["lis-prado", "Prado", "resto", "Baixa", "Travessa das Pedras Negras 2", 38.7105, -9.1345, 2, 2, "bobo", "Une cuisine de saison et des vins naturels, dans une ancienne conserverie lumineuse.", "Le menu change tous les jours selon les producteurs.", 90],
  ["lis-campo-ourique", "Mercado de Campo de Ourique", "resto", "Príncipe Real", "Rua Coelho da Rocha", 38.716, -9.1655, 1, 2, "famille", "Le marché de quartier préféré des Lisboètes, avec ses comptoirs de petits plats.", "Viens le soir, les comptoirs restent ouverts tard.", 60],
  // ---- Bars ----
  ["lis-duque", "Duque Brewpub", "bar", "Chiado", "Calçada do Duque 49", 38.714, -9.1405, 1, 2, "petit-budget", "Un pub de bières artisanales portugaises sur un escalier pentu.", "Demande la planche de dégustation.", 60],
  ["lis-santa-catarina", "Miradouro de Santa Catarina", "bar", "Bairro Alto", "Rua de Santa Catarina", 38.7095, -9.1475, 1, 1, "romantique,petit-budget", "Un belvédère face au pont du 25-Avril, avec kiosque à boissons et musiciens au coucher du soleil.", "Le meilleur moment, c'est l'heure dorée.", 60],
  ["lis-procopio", "Procópio", "bar", "Príncipe Real", "Alto de São Francisco 21", 38.7225, -9.157, 2, 3, "cache,romantique", "Un bar des années 1970 caché dans une impasse, vitraux et velours.", "Sonne à la porte : on t'ouvre.", 75],
  ["lis-ba-wine", "BA Wine Bar do Bairro Alto", "bar", "Bairro Alto", "Rua da Rosa 107", 38.7125, -9.145, 2, 2, "romantique", "Un minuscule bar à vins où le patron choisit les vins pour toi.", "Réserve et laisse-toi guider, c'est tout le principe.", 90],
  // ---- Culture, nature, insolite ----
  ["lis-museu-fado", "Museu do Fado", "culture", "Alfama", "Largo do Chafariz de Dentro 1", 38.711, -9.1265, 1, 2, "romantique", "Tout sur le fado, de ses origines dans les tavernes à Amália Rodrigues.", "Écoute les enregistrements avant d'aller voir un vrai fado le soir.", 60],
  ["lis-fronteira", "Palácio Fronteira", "culture", "Benfica", "Largo São Domingos de Benfica 1", 38.74, -9.181, 2, 3, "cache,romantique", "Un palais du XVIIe siècle aux jardins couverts d'azulejos, encore habité par la famille.", "Visite guidée uniquement : réserve.", 75],
  ["lis-aqueduto", "Aqueduc des Eaux Libres", "insolite", "Alcântara", "Calçada da Quintinha 6", 38.7275, -9.172, 1, 2, "insolite", "Un aqueduc du XVIIIe siècle qui a résisté au tremblement de terre, à parcourir à pied.", "On marche à 65 mètres au-dessus de la vallée.", 60],
  ["lis-jardim-botanico", "Jardim Botânico de Lisboa", "nature", "Príncipe Real", "Rua da Escola Politécnica 54", 38.718, -9.15, 1, 2, "romantique", "Un jardin botanique en pente, plein de palmiers et de plantes tropicales.", "Un coin de calme à deux pas du Príncipe Real.", 60],
  // ---- Activités ----
  ["lis-oceanario", "Oceanário de Lisboa", "activite", "Parque das Nações", "Esplanada Dom Carlos I", 38.7635, -9.0938, 2, 1, "famille", "L'un des plus beaux aquariums d'Europe, organisé autour d'un immense bassin central.", "Prends le métro rouge jusqu'à Oriente.", 120],
  ["lis-tage-voilier", "Coucher de soleil en voilier sur le Tage", "activite", "Alcântara", "Doca de Santo Amaro", 38.7035, -9.1785, 2, 2, "romantique", "Une sortie en voilier sous le pont du 25-Avril, jusqu'à la tour de Belém.", "Choisis le départ du coucher de soleil, plusieurs compagnies partent des docks.", 120],
  ["lis-confeitaria-nacional", "Confeitaria Nacional", "cafe", "Baixa", "Praça da Figueira 18B", 38.7135, -9.1385, 1, 2, "famille", "La plus vieille pâtisserie de Lisbonne, depuis 1829.", "Goûte le bolo rei si tu passes en fin d'année.", 30],
];
