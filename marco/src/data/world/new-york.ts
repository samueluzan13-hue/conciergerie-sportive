import type { CityGuide } from "./types";

export const NEW_YORK: CityGuide = {
  spots: [
    // ---- Restos ----
    ["nyc-katz", "Katz's Delicatessen", "resto", "Lower East Side", "205 E Houston St", 40.7223, -73.9874, 2, 1, "famille", "Le deli de 1888 et son pastrami tranché à la main, immortalisé par « Quand Harry rencontre Sally ».", "Garde bien ton ticket à l'entrée : sans lui, on te fait payer le maximum à la sortie.", 60, "https://katzsdelicatessen.com"],
    ["nyc-russ-daughters", "Russ & Daughters", "resto", "Lower East Side", "179 E Houston St", 40.7225, -73.9883, 2, 1, "famille", "La boutique de bagels et de saumon fumé tenue par la même famille depuis 1914.", "Prends un numéro et commande un bagel au saumon et cream cheese, le classique new-yorkais.", 30],
    ["nyc-joes-pizza", "Joe's Pizza", "resto", "Greenwich Village", "7 Carmine St", 40.7305, -74.0021, 1, 1, "petit-budget", "La part de pizza new-yorkaise de référence : fine, pliée en deux, mangée debout.", "Prends une plain cheese slice : c'est le test absolu d'une pizzeria new-yorkaise.", 15],
    ["nyc-peter-luger", "Peter Luger Steak House", "resto", "Williamsburg", "178 Broadway, Brooklyn", 40.7099, -73.9623, 3, 1, "romantique", "Le steakhouse de Brooklyn depuis 1887, porterhouse servi grésillant.", "Paiement longtemps uniquement en espèces ou carte maison : vérifie avant d'y aller.", 100],
    ["nyc-le-bernardin", "Le Bernardin", "resto", "Midtown", "155 W 51st St", 40.7615, -73.9818, 3, 1, "romantique", "La grande table de poisson d'Éric Ripert, trois étoiles depuis des années.", "Le menu du déjeuner est le moyen le plus abordable d'y goûter.", 150],
    ["nyc-chelsea-market", "Chelsea Market", "resto", "Chelsea", "75 9th Ave", 40.7424, -74.0061, 1, 1, "famille,petit-budget", "Une ancienne usine de biscuits Oreo devenue halle gourmande, au pied de la High Line.", "Les tacos de Los Tacos No. 1 valent la file d'attente.", 60],
    ["nyc-sylvias", "Sylvia's", "resto", "Harlem", "328 Malcolm X Blvd", 40.8085, -73.9447, 2, 1, "famille", "La reine de la soul food de Harlem depuis 1962 : poulet frit, gaufres et chou vert.", "Le brunch gospel du dimanche est une expérience à part.", 75],
    ["nyc-2nd-ave-deli", "2nd Ave Deli", "resto", "Midtown", "162 E 33rd St", 40.7449, -73.9789, 2, 2, "famille", "Le deli juif casher de New York : soupe aux boulettes de matza et pastrami.", "Les cornichons et la salade de chou sont offerts en arrivant.", 60, "", undefined, "casher"],
    ["nyc-halal-guys", "The Halal Guys", "resto", "Midtown", "W 53rd St & 6th Ave", 40.7619, -73.979, 1, 1, "petit-budget", "Le chariot de street food halal le plus célèbre de New York : poulet, riz et sauce blanche.", "La sauce piquante est vraiment très piquante : une goutte suffit.", 15, "", undefined, "halal"],
    // ---- Bars ----
    ["nyc-pdt", "PDT (Please Don't Tell)", "bar", "East Village", "113 St Marks Pl", 40.7272, -73.9838, 2, 3, "cache,insolite", "On entre par une cabine téléphonique dans une échoppe de hot-dogs : derrière, un bar à cocktails légendaire.", "Décroche le téléphone de la cabine et attends qu'on t'ouvre.", 90],
    ["nyc-mcsorleys", "McSorley's Old Ale House", "bar", "East Village", "15 E 7th St", 40.7287, -73.9898, 1, 2, "petit-budget,insolite", "Un pub irlandais de 1854 au sol couvert de sciure : deux bières, brune ou blonde, servies par deux.", "On ne commande qu'une couleur : « light » ou « dark », et elles arrivent par paires.", 45],
    ["nyc-dead-rabbit", "The Dead Rabbit", "bar", "Financial District", "30 Water St", 40.7034, -74.011, 2, 2, "tendance", "Un bar irlandais primé, taverne au rez-de-chaussée et salon à cocktails à l'étage.", "Le café irlandais du rez-de-chaussée est une référence.", 75],
    ["nyc-bemelmans", "Bemelmans Bar", "bar", "Upper East Side", "35 E 76th St", 40.7743, -73.9632, 3, 2, "romantique,jazz", "Le bar de l'hôtel Carlyle, aux murs peints par l'illustrateur de Madeline, avec piano jazz.", "Le jazz commence en début de soirée, le droit d'entrée s'ajoute après.", 75],
    ["nyc-westlight", "Westlight", "bar", "Williamsburg", "111 N 12th St, Brooklyn", 40.7215, -73.9575, 2, 2, "romantique,tendance", "Un rooftop au 22e étage avec la skyline de Manhattan en face.", "Au coucher du soleil, la vue sur Manhattan est spectaculaire.", 75],
    // ---- Cafés ----
    ["nyc-veselka", "Veselka", "cafe", "East Village", "144 2nd Ave", 40.729, -73.9873, 1, 2, "petit-budget", "Un diner ukrainien de 1954 : pierogis, bortsch et pancakes à toute heure.", "Les pierogis de pomme de terre sont l'incontournable.", 45],
    ["nyc-levain", "Levain Bakery", "cafe", "Upper West Side", "167 W 74th St", 40.7799, -73.9802, 1, 1, "famille,petit-budget", "Des cookies de 170 grammes, croustillants dehors et presque crus dedans.", "Prends le chocolat-noix et mange-le tiède.", 15],
    // ---- Culture ----
    ["nyc-met", "The Met", "culture", "Upper East Side", "1000 5th Ave", 40.7794, -73.9632, 2, 1, "famille", "Le Metropolitan Museum : 5 000 ans d'art et un temple égyptien entier.", "Le toit-terrasse (ouvert en saison) offre une vue superbe sur Central Park.", 210, "https://www.metmuseum.org"],
    ["nyc-moma", "MoMA", "culture", "Midtown", "11 W 53rd St", 40.7614, -73.9776, 2, 1, "bobo", "La Nuit étoilée, Les Demoiselles d'Avignon et un siècle d'art moderne.", "Commence par le 5e étage, celui des chefs-d'œuvre.", 150, "https://www.moma.org"],
    ["nyc-tenement", "Tenement Museum", "culture", "Lower East Side", "103 Orchard St", 40.7188, -73.99, 2, 2, "famille", "Les appartements reconstitués de familles immigrées qui ont vécu dans cet immeuble entre 1863 et 1935.", "Visite uniquement guidée : réserve un créneau.", 90],
    ["nyc-morgan", "The Morgan Library", "culture", "Midtown", "225 Madison Ave", 40.7493, -73.9814, 2, 3, "cache,romantique", "La bibliothèque privée du banquier J.P. Morgan, trois étages de livres rares sous des plafonds peints.", "La bibliothèque de l'est est la salle à voir absolument.", 75],
    ["nyc-frick", "The Frick Collection", "culture", "Upper East Side", "1 E 70th St", 40.7712, -73.9671, 2, 2, "romantique", "Vermeer, Rembrandt et Fragonard dans l'hôtel particulier d'un magnat de l'acier.", "Réserve en ligne : les créneaux partent vite depuis la réouverture.", 90],
    // ---- Nature ----
    ["nyc-central-park", "Central Park", "nature", "Upper West Side", "Central Park", 40.7829, -73.9654, 1, 1, "famille,romantique,petit-budget", "Le poumon de Manhattan : lacs, ponts, prairies et barques.", "Loue une barque au Loeb Boathouse et rame jusqu'au pont Bow Bridge.", 150],
    ["nyc-high-line", "High Line", "nature", "Chelsea", "Gansevoort St & Washington St", 40.748, -74.0048, 1, 1, "romantique,petit-budget", "Une ancienne voie ferrée suspendue devenue jardin, au milieu des immeubles.", "Commence par le sud et termine à Hudson Yards.", 75],
    ["nyc-dumbo", "DUMBO et le pont de Brooklyn", "nature", "DUMBO", "Washington St & Water St, Brooklyn", 40.7033, -73.989, 1, 1, "romantique", "Traverser le pont de Brooklyn à pied, puis la vue sur le pont de Manhattan depuis les pavés de DUMBO.", "Traverse depuis Manhattan vers Brooklyn : la vue est dans ton dos, retourne-toi souvent.", 90],
    // ---- Insolite ----
    ["nyc-whispering-gallery", "Whispering Gallery de Grand Central", "insolite", "Midtown", "89 E 42nd St", 40.7527, -73.9772, 1, 3, "cache,insolite", "Sous les voûtes devant le restaurant Oyster Bar, un murmure contre un coin s'entend à l'autre bout.", "Mets-toi dans un coin, ton ami dans le coin opposé, et chuchote.", 15],
    ["nyc-roosevelt-tram", "Téléphérique de Roosevelt Island", "insolite", "Upper East Side", "E 59th St & 2nd Ave", 40.7612, -73.9644, 1, 2, "famille,petit-budget", "Un téléphérique au-dessus de l'East River, au prix d'un ticket de métro.", "Assieds-toi côté sud pour voir Midtown défiler.", 30],
    ["nyc-little-island", "Little Island", "insolite", "Chelsea", "Pier 55, Hudson River Park", 40.742, -74.0103, 1, 2, "romantique,famille", "Un parc posé sur des tulipes de béton au-dessus de l'Hudson.", "Gratuit, mais réservation à certaines heures en été.", 45],
    // ---- Activités ----
    ["nyc-comedy-cellar", "Comedy Cellar", "activite", "Greenwich Village", "117 MacDougal St", 40.7302, -74.0004, 2, 2, "tendance", "Le club de stand-up où les plus grands viennent tester leurs blagues par surprise.", "Réserve en ligne : les shows tardifs ont parfois des invités célèbres.", 90],
    ["nyc-staten-island-ferry", "Staten Island Ferry", "activite", "Financial District", "4 South St (Whitehall Terminal)", 40.7013, -74.013, 1, 1, "famille,petit-budget", "Un ferry gratuit qui passe devant la statue de la Liberté.", "Mets-toi à droite à l'aller pour la statue, et refais l'aller-retour aussitôt.", 60],
    ["nyc-msg", "Match au Madison Square Garden", "activite", "Midtown", "4 Pennsylvania Plaza", 40.7505, -73.9934, 3, 1, "famille", "Voir les Knicks au basket ou les Rangers au hockey dans l'arène la plus célèbre du monde.", "Regarde le calendrier avant de partir : les grands matchs se vendent tôt.", 180],
    // ---- Hôtels ----
    ["nyc-hi-hostel", "HI NYC Hostel", "hotel", "Upper West Side", "891 Amsterdam Ave", 40.799, -73.9665, 1, 2, "petit-budget", "Une grande auberge dans un bâtiment du XIXe siècle, avec jardin, près de Central Park.", "Les chambres privées partent vite en été.", 0, "", 0],
    ["nyc-citizenm-times-square", "citizenM Times Square", "hotel", "Midtown", "218 W 50th St", 40.7614, -73.9853, 2, 1, "tendance", "Des chambres compactes et malines, avec rooftop au cœur de Midtown.", "Le rooftop est un bon plan pour voir les néons de Times Square de haut.", 0, "https://www.citizenm.com", 4],
    ["nyc-ludlow", "The Ludlow", "hotel", "Lower East Side", "180 Ludlow St", 40.7223, -73.9873, 2, 2, "tendance,bobo", "Un hôtel chic au cœur du Lower East Side, avec grandes baies vitrées sur Manhattan.", "Katz's Delicatessen est juste au coin de la rue.", 0, "", 4],
    ["nyc-wythe", "Wythe Hotel", "hotel", "Williamsburg", "80 Wythe Ave, Brooklyn", 40.722, -73.958, 2, 2, "bobo,romantique", "Une ancienne fabrique de tonneaux transformée en hôtel, avec vue sur Manhattan.", "Le bar du toit offre la skyline au coucher du soleil.", 0, "", 4],
    ["nyc-standard-high-line", "The Standard, High Line", "hotel", "Chelsea", "848 Washington St", 40.7408, -74.008, 3, 1, "tendance", "Un hôtel suspendu au-dessus de la High Line, avec baies vitrées du sol au plafond.", "Le bar du dernier étage est l'un des plus célèbres de la ville.", 0, "", 4],
    ["nyc-plaza", "The Plaza", "hotel", "Midtown", "768 5th Ave", 40.7646, -73.9744, 3, 1, "romantique", "Le palace mythique en face de Central Park, décor de dizaines de films.", "Le food hall du sous-sol permet de goûter au Plaza à petit prix.", 0, "", 5],
  ],
  streets: [
    {
      id: "nyc-wall-street", name: "Wall Street", aliases: ["Wall St"], arrondissement: "Financial District", lat: 40.7066, lng: -74.0090,
      histoire: "La rue doit son nom au mur de bois construit par les Néerlandais de La Nouvelle-Amsterdam pour se protéger des attaques. Le mur a disparu, mais le nom est resté pour désigner la finance mondiale.",
      fait: { annee: "1792", texte: "Vingt-quatre courtiers signent l'accord de Buttonwood sous un platane, au numéro 68 de la rue : c'est l'acte de naissance de la Bourse de New York." },
      anecdote: "En décembre 1989, le sculpteur Arturo Di Modica a déposé de nuit, sans autorisation, un taureau de bronze de plus de trois tonnes devant la Bourse. La police l'a enlevé, la foule l'a réclamé, et il est toujours là.",
      aVoir: ["nyc-dead-rabbit", "nyc-staten-island-ferry"],
    },
    {
      id: "nyc-broadway", name: "Broadway", aliases: ["Broadway"], arrondissement: "Midtown", lat: 40.758, lng: -73.9855,
      histoire: "Broadway suit un ancien sentier amérindien qui traversait l'île du nord au sud. Les Néerlandais l'appelaient « Breede weg », la large voie. C'est la seule grande avenue qui coupe le quadrillage de Manhattan en diagonale.",
      fait: { annee: "1880", texte: "En décembre, une partie de Broadway est éclairée par des lampes électriques à arc : la rue devient « The Great White Way »." },
      anecdote: "C'est parce que Broadway refuse de suivre le quadrillage que Manhattan a ses grandes places : partout où elle croise une avenue, il reste un triangle libre. Times Square, Herald Square et Union Square sont des accidents de géométrie.",
      aVoir: ["nyc-citizenm-times-square", "nyc-le-bernardin"],
    },
    {
      id: "nyc-st-marks", name: "St. Marks Place", aliases: ["St Marks Place", "Saint Marks Place"], arrondissement: "East Village", lat: 40.7275, lng: -73.9855,
      histoire: "Nommée d'après l'église Saint-Mark's-in-the-Bowery, la rue est devenue le cœur de la contre-culture new-yorkaise : beatniks, hippies, punks et skaters s'y sont succédé.",
      fait: { annee: "1966", texte: "Andy Warhol organise l'« Exploding Plastic Inevitable » avec le Velvet Underground au numéro 23, dans une salle appelée The Dom." },
      anecdote: "Les immeubles des numéros 96 et 98 figurent sur la pochette de l'album « Physical Graffiti » de Led Zeppelin (1975). Les fans les photographient en espérant voir les musiciens aux fenêtres.",
      aVoir: ["nyc-pdt", "nyc-veselka"],
    },
    {
      id: "nyc-fifth-avenue", name: "Fifth Avenue", aliases: ["5th Avenue", "Cinquième Avenue"], arrondissement: "Upper East Side", lat: 40.7794, lng: -73.9632,
      histoire: "Au XIXe siècle, les grandes fortunes américaines construisent leurs hôtels particuliers le long de Central Park : la Cinquième Avenue devient la « rangée des millionnaires ». Beaucoup sont devenus des musées.",
      fait: { annee: "1959", texte: "Ouverture du musée Guggenheim conçu par Frank Lloyd Wright, dont la spirale blanche détonne au milieu des façades classiques." },
      anecdote: "La Cinquième Avenue sert de frontière : à l'est, les adresses se disent « East », à l'ouest « West ». Un même numéro de rue peut donc exister deux fois, de part et d'autre, pour le plus grand plaisir des chauffeurs de taxi.",
      aVoir: ["nyc-met", "nyc-frick"],
    },
  ],
  nights: [
    { district: "East Village", vibe: "Bars à cocktails cachés, pubs centenaires et punk rock.", venues: [
      { name: "PDT", address: "113 St Marks Pl", kind: "Speakeasy", tip: "Entrée par la cabine téléphonique." },
      { name: "Death & Co", address: "433 E 6th St", kind: "Cocktails", tip: "L'un des bars qui a relancé la culture du cocktail." },
      { name: "McSorley's", address: "15 E 7th St", kind: "Pub", tip: "Deux bières, servies par paires." },
    ] },
    { district: "Lower East Side", vibe: "Concerts dans des petites salles, bars sans carte et nuits longues.", venues: [
      { name: "Rockwood Music Hall", address: "196 Allen St", kind: "Concerts", tip: "Plusieurs scènes, souvent gratuites." },
      { name: "Attaboy", address: "134 Eldridge St", kind: "Cocktails", tip: "Pas de carte : dis ce que tu aimes au barman." },
    ] },
    { district: "Greenwich Village", vibe: "Les clubs de jazz mythiques et le stand-up.", venues: [
      { name: "Village Vanguard", address: "178 7th Ave S", kind: "Jazz", tip: "Le temple du jazz depuis 1935." },
      { name: "Blue Note", address: "131 W 3rd St", kind: "Jazz", tip: "Les grands noms, deux concerts par soir." },
      { name: "Comedy Cellar", address: "117 MacDougal St", kind: "Stand-up", tip: "Des invités surprises très connus." },
    ] },
    { district: "Williamsburg", vibe: "Rooftops face à Manhattan et salles de concert dans d'anciens entrepôts.", venues: [
      { name: "Brooklyn Bowl", address: "61 Wythe Ave, Brooklyn", kind: "Bowling et concerts", tip: "On joue au bowling pendant le concert." },
      { name: "Westlight", address: "111 N 12th St, Brooklyn", kind: "Rooftop", tip: "La plus belle vue sur Manhattan." },
    ] },
    { district: "Harlem", vibe: "Le berceau du jazz et de la soul.", venues: [
      { name: "Minton's Playhouse", address: "206 W 118th St", kind: "Jazz", tip: "Le club où est né le bebop." },
      { name: "Apollo Theater", address: "253 W 125th St", kind: "Spectacles", tip: "L'Amateur Night du mercredi est une institution." },
    ] },
  ],
  diet: [
    { diet: "casher", name: "Upper West Side", streets: "Broadway et Amsterdam Avenue (entre 70e et 96e rues)", text: "De nombreux restaurants, boulangeries et épiceries casher sous différentes certifications (OU, OK…)." },
    { diet: "casher", name: "Midtown", streets: "Autour de la 47e rue et de la 33e rue", text: "Delis et restaurants casher pour les gens qui travaillent dans le quartier, comme le 2nd Ave Deli." },
    { diet: "casher", name: "Williamsburg et Borough Park (Brooklyn)", streets: "Lee Avenue, 13th Avenue", text: "De grandes communautés orthodoxes : boulangeries et restaurants casher très stricts." },
    { diet: "halal", name: "Chariots de street food", streets: "Partout à Midtown", text: "Les chariots « halal » sont une institution new-yorkaise : poulet, agneau et riz à petit prix." },
    { diet: "halal", name: "Astoria (Queens)", streets: "Steinway Street", text: "Le « Little Egypt » de New York : cafés, grillades et restaurants égyptiens et maghrébins halal." },
  ],
};
