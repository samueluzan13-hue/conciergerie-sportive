import type { Mood, Spot } from "./spots";

// Restaurants : au moins deux ou trois par arrondissement, tous budgets et toutes cuisines.
// [id, nom, quartier, arr, adresse, lat, lng, prix, caché(1-3), ambiances, pitch, astuce, durée, réservable]
type Row = [string, string, string, number, string, number, number, 1 | 2 | 3, 1 | 2 | 3, string, string, string, number, boolean];

const ROWS: Row[] = [
  // 1er
  ["grand-vefour", "Le Grand Véfour", "Palais-Royal", 1, "17 rue de Beaujolais, 75001", 48.8661, 2.3376, 3, 2, "romantique", "Une salle XVIIIe sous les arcades du Palais-Royal où dînaient Bonaparte et Victor Hugo. La grande table historique de Paris.", "Demande à voir les plaques gravées aux noms des clients célèbres sur les banquettes.", 150, true],
  ["kunitoraya", "Kunitoraya", "Sainte-Anne", 1, "5 rue Villedo, 75001", 48.8663, 2.3355, 2, 2, "bobo", "Des udon faites maison dans le quartier japonais de la rue Sainte-Anne, dans un décor de vieux bistrot parisien.", "Le quartier compte des dizaines de ramen et udon : celui-ci est un des plus fins.", 60, true],
  ["pied-de-cochon", "Au Pied de Cochon", "Les Halles", 1, "6 rue Coquillière, 75001", 48.8637, 2.3437, 2, 1, "famille", "La brasserie des Halles, célèbre pour sa soupe à l'oignon et ses horaires de noctambule.", "Idéal pour un dîner très tardif après un spectacle.", 75, true],
  ["kodawari-tsukiji", "Kodawari Ramen (Tsukiji)", "Palais-Royal", 1, "12 rue de Richelieu, 75001", 48.8638, 2.3368, 1, 2, "insolite,petit-budget", "Des ramen servis dans un décor qui reproduit le marché aux poissons de Tokyo, bruitages compris.", "Pas de réservation : vise l'ouverture ou le milieu d'après-midi.", 45, false],
  // 2e
  ["racines", "Racines", "Grands Boulevards", 2, "8 passage des Panoramas, 75002", 48.8712, 2.3419, 2, 3, "cache,romantique", "Une petite table italienne nichée dans le passage des Panoramas, produits et vins soignés.", "Réserve : quelques tables seulement, dans un passage couvert du XVIIIe.", 90, true],
  ["liza", "Liza", "Bourse", 2, "14 rue de la Banque, 75002", 48.8675, 2.3405, 2, 2, "romantique,bobo", "Une cuisine libanaise généreuse et raffinée dans une salle élégante près de la Bourse.", "Commande plusieurs mezzés à partager, c'est comme ça que ça se mange.", 90, true],
  ["daroco", "Daroco", "Bourse", 2, "6 rue Vivienne, 75002", 48.8667, 2.3391, 2, 1, "tendance", "Pizzas et pâtes au feu de bois dans l'ancienne boutique de Jean Paul Gaultier.", "Le lieu est immense : parfait pour une grande tablée.", 90, true],
  ["pizzeria-popolare", "Pizzeria Popolare", "Sentier", 2, "111 rue Réaumur, 75002", 48.8687, 2.3443, 1, 1, "petit-budget,famille,tendance", "La pizzeria géante du groupe Big Mamma, pizzas napolitaines à petits prix.", "Pas de réservation : arrive à l'ouverture ou prépare-toi à patienter au bar.", 60, false],
  // 3e
  ["chez-omar", "Chez Omar", "Haut-Marais", 3, "47 rue de Bretagne, 75003", 48.8634, 2.3616, 2, 1, "famille", "Le couscous du Marais, dans une grande brasserie à miroirs qui ne désemplit pas.", "Pas de réservation : viens tôt, la semoule est à volonté.", 75, false],
  ["alain-miam-miam", "Chez Alain Miam Miam", "Haut-Marais", 3, "39 rue de Bretagne (Marché des Enfants Rouges), 75003", 48.8627, 2.362, 1, 2, "petit-budget,insolite", "Un sandwich-spectacle au Marché des Enfants Rouges : Alain empile fromages et légumes avec un sens du show.", "La file est longue mais c'est une expérience à part entière.", 40, false],
  ["enfants-du-marche", "Les Enfants du Marché", "Haut-Marais", 3, "39 rue de Bretagne, 75003", 48.8628, 2.3622, 2, 2, "bobo", "Un comptoir de chef au milieu du plus vieux marché couvert de Paris : produits ultra-frais et vins nature.", "On mange au comptoir, au coude-à-coude avec les habitués.", 60, false],
  // 4e
  ["benoit", "Benoit", "Châtelet", 4, "20 rue Saint-Martin, 75004", 48.8591, 2.3502, 3, 2, "romantique", "Un bistrot de 1912 resté dans son jus, cuisine bourgeoise dans les règles de l'art.", "Le déjeuner est la façon la plus douce de goûter à cette maison.", 105, true],
  ["miznon", "Miznon", "Le Marais", 4, "22 rue des Écouffes, 75004", 48.8568, 2.3587, 1, 1, "petit-budget", "Des pitas débordantes à l'israélienne et le célèbre chou-fleur rôti entier.", "Le chou-fleur entier se partage : parfait pour goûter un peu de tout.", 40, false],
  ["grand-coeur", "Grand Cœur", "Le Marais", 4, "41 rue du Temple, 75004", 48.8601, 2.3538, 3, 3, "cache,romantique", "Une cour pavée cachée derrière une porte cochère, avec une terrasse au calme absolu en plein Marais.", "L'été, la terrasse dans la cour est un secret bien gardé.", 90, true],
  ["chez-julien", "Chez Julien", "Saint-Paul", 4, "1 rue du Pont-Louis-Philippe, 75004", 48.8551, 2.3553, 2, 2, "romantique", "Un bistrot Belle Époque au bord de la Seine, face à l'église Saint-Gervais.", "Demande une table en terrasse au coucher du soleil.", 90, true],
  // 5e
  ["tour-argent", "La Tour d'Argent", "Quai de la Tournelle", 5, "15 quai de la Tournelle, 75005", 48.8502, 2.3549, 3, 1, "romantique", "Le mythe de la gastronomie parisienne, avec une vue plongeante sur Notre-Dame et son canard numéroté.", "Le menu du déjeuner est la façon la plus accessible de connaître la maison.", 150, true],
  ["petit-prince", "Le Petit Prince de Paris", "Quartier Latin", 5, "12 rue de Lanneau, 75005", 48.8488, 2.3464, 2, 3, "cache,romantique", "Un restaurant intime dans une ruelle médiévale du Quartier Latin, murs de pierre et bougies.", "La rue de Lanneau est une des plus vieilles du quartier : jette un œil aux façades.", 90, true],
  ["nouvelle-mairie", "Café de la Nouvelle Mairie", "Panthéon", 5, "19 rue des Fossés-Saint-Jacques, 75005", 48.8455, 2.3432, 2, 2, "bobo", "Bar à vins et bistrot de quartier derrière le Panthéon, avec une terrasse sur une placette tranquille.", "Parfait pour un déjeuner en terrasse après le jardin du Luxembourg.", 75, false],
  ["les-papilles", "Les Papilles", "Val-de-Grâce", 5, "30 rue Gay-Lussac, 75005", 48.843, 2.3408, 2, 2, "romantique", "Une cave à vins où l'on dîne entre les bouteilles, menu unique du marché.", "Tu choisis ton vin directement sur les étagères.", 90, true],
  // 6e
  ["polidor", "Polidor", "Odéon", 6, "41 rue Monsieur-le-Prince, 75006", 48.8497, 2.3401, 1, 2, "petit-budget,famille", "Un bistrot de 1845 où ont mangé Rimbaud, Hemingway et Joyce. Il apparaît dans « Minuit à Paris ».", "Les grandes tables d'hôtes se partagent : ambiance cantine d'autrefois.", 75, false],
  ["bouillon-racine", "Bouillon Racine", "Odéon", 6, "3 rue Racine, 75006", 48.8505, 2.3413, 2, 2, "romantique", "Un bouillon Art nouveau de 1906, miroirs, céramiques et vitraux classés.", "Monte à l'étage pour admirer la salle d'en haut.", 90, true],
  ["semilla", "Semilla", "Saint-Germain-des-Prés", 6, "54 rue de Seine, 75006", 48.8538, 2.3371, 3, 2, "tendance", "Cuisine du marché inventive dans une grande salle vivante de Saint-Germain.", "Assieds-toi au comptoir face à la cuisine ouverte.", 90, true],
  ["bon-saint-pourcain", "Le Bon Saint-Pourçain", "Saint-Sulpice", 6, "10 bis rue Servandoni, 75006", 48.8494, 2.3354, 3, 3, "cache,romantique", "Un bistrot confidentiel dans une ruelle derrière Saint-Sulpice, cuisine française délicate.", "La rue Servandoni s'appelait rue des Fossoyeurs : c'est là que loge d'Artagnan dans « Les Trois Mousquetaires ».", 90, true],
  // 7e
  ["cafe-constant", "Café Constant", "Gros-Caillou", 7, "139 rue Saint-Dominique, 75007", 48.8583, 2.3014, 2, 2, "famille", "Le bistrot de quartier d'un grand chef, à deux pas de la tour Eiffel.", "Pas de réservation : arrive à l'ouverture.", 75, false],
  ["ami-jean", "L'Ami Jean", "Gros-Caillou", 7, "27 rue Malar, 75007", 48.8596, 2.3037, 2, 2, "bobo", "Bistrot basque bruyant et généreux, célèbre pour son riz au lait servi en saladier.", "Garde de la place pour le riz au lait, c'est la star.", 90, true],
  ["arpege", "Arpège", "Invalides", 7, "84 rue de Varenne, 75007", 48.8556, 2.3171, 3, 1, "romantique", "La grande table d'Alain Passard, entièrement tournée vers les légumes de ses potagers.", "Réserve longtemps à l'avance, c'est une expérience d'exception.", 180, true],
  ["les-cocottes", "Les Cocottes", "Gros-Caillou", 7, "135 rue Saint-Dominique, 75007", 48.8584, 2.302, 2, 1, "famille", "Des plats servis en cocottes de fonte, au comptoir, par l'équipe de Christian Constant.", "Enchaîne avec une balade sur le Champ-de-Mars.", 60, false],
  // 8e
  ["boeuf-sur-le-toit", "Le Bœuf sur le Toit", "Champs-Élysées", 8, "34 rue du Colisée, 75008", 48.8711, 2.3099, 2, 2, "jazz,romantique", "Brasserie Art déco héritière du cabaret des Années folles où jouaient Cocteau et les musiciens de jazz.", "Le plateau de fruits de mer est la spécialité.", 90, true],
  ["pavillon-ledoyen", "Pavillon Ledoyen", "Champs-Élysées", 8, "8 avenue Dutuit, 75008", 48.8664, 2.3163, 3, 2, "romantique", "Un pavillon néoclassique dans les jardins des Champs-Élysées, une des plus anciennes tables de Paris.", "Pour une grande occasion : le cadre vaut à lui seul le détour.", 180, true],
  ["mori-venice", "Mori Venice Bar", "Bourse", 2, "2 rue du Quatre-Septembre, 75002", 48.8691, 2.3396, 3, 2, "romantique", "Cuisine vénitienne élégante face au palais Brongniart.", "Les pâtes à l'encre de seiche sont la signature vénitienne.", 90, true],
  ["chez-savy", "Chez Savy", "Champs-Élysées", 8, "23 rue Bayard, 75008", 48.8667, 2.3044, 2, 3, "cache", "Un bistrot aveyronnais des années 1950 resté intact, à deux pas de l'avenue Montaigne : aligot et viandes de l'Aubrac.", "Le contraste avec le luxe des boutiques voisines fait tout le charme.", 90, true],
  ["laurent", "Laurent", "Champs-Élysées", 8, "41 avenue Gabriel, 75008", 48.8683, 2.3151, 3, 2, "romantique", "Un pavillon néoclassique dans les jardins des Champs-Élysées, terrasse sous les marronniers.", "La terrasse aux beaux jours est l'une des plus élégantes de Paris.", 150, true],
  // 9e
  ["bon-georges", "Le Bon Georges", "Saint-Georges", 9, "45 rue Saint-Georges, 75009", 48.8789, 2.3375, 2, 2, "bobo", "Un bistrot à l'ancienne avec une ardoise de viandes de race et une cave bien pensée.", "Demande conseil pour le vin, la carte est longue.", 90, true],
  ["hotel-amour", "Hôtel Amour", "Pigalle", 9, "8 rue de Navarin, 75009", 48.8793, 2.3392, 2, 2, "romantique,tendance", "Le restaurant d'un hôtel au charme bohème, avec un jardin caché à l'arrière.", "Demande le jardin, c'est la meilleure table aux beaux jours.", 90, true],
  // 10e
  ["bouillon-julien", "Bouillon Julien", "Faubourg-Saint-Denis", 10, "16 rue du Faubourg-Saint-Denis, 75010", 48.8705, 2.3534, 2, 2, "romantique", "Une salle Art nouveau de 1906, vitraux, bois sculpté et panneaux dans le style de Mucha, à des prix de bouillon.", "Réserve pour dîner sous les grands panneaux décoratifs.", 75, true],
  ["chez-michel", "Chez Michel", "Gare du Nord", 10, "10 rue de Belzunce, 75010", 48.8792, 2.3521, 2, 3, "cache", "Cuisine bretonne généreuse près de la gare du Nord, gibier en saison.", "La carte suit les saisons et la chasse : demande le plat du jour.", 90, true],
  ["le-galopin", "Le Galopin", "Sainte-Marthe", 10, "34 rue Sainte-Marthe, 75010", 48.8736, 2.3706, 3, 3, "cache,bobo", "Menu surprise d'un jeune chef, dans la ruelle colorée de la place Sainte-Marthe.", "La place Sainte-Marthe, juste à côté, est un des villages les plus charmants de Paris.", 120, true],
  ["urfa-durum", "Urfa Dürüm", "Faubourg-Saint-Denis", 10, "58 rue du Faubourg-Saint-Denis, 75010", 48.8728, 2.3541, 1, 2, "petit-budget", "Un sandwich kurde grillé au feu de bois, galette cuite devant toi. Tout petit, très bon.", "À emporter, ou sur les deux tabourets de la vitrine.", 20, false],
  // 11e
  ["le-servan", "Le Servan", "Voltaire", 11, "32 rue Saint-Maur, 75011", 48.8568, 2.3806, 2, 2, "tendance", "Une cuisine métissée franco-asiatique dans une salle aux moulures d'époque.", "Le déjeuner est une affaire, le soir se réserve.", 90, true],
  ["clamato", "Clamato", "Charonne", 11, "80 rue de Charonne, 75011", 48.8535, 2.3812, 2, 2, "tendance,bobo", "Le bar de la mer de l'équipe de Septime : huîtres, crus et poissons, sans réservation.", "Viens à l'ouverture, ça se remplit en quelques minutes.", 75, false],
  ["deux-amis", "Aux Deux Amis", "Oberkampf", 11, "45 rue Oberkampf, 75011", 48.8649, 2.3702, 2, 2, "bobo", "Bar à vins de quartier, assiettes à partager et comptoir en zinc toujours animé.", "Parfait pour un apéro dînatoire avant de sortir à Oberkampf.", 75, false],
  ["le-president", "Le Président", "Belleville", 11, "120 rue du Faubourg-du-Temple, 75011", 48.8708, 2.3771, 1, 2, "famille,petit-budget", "Un immense restaurant chinois de banquet au premier étage, idéal pour les grandes tablées.", "Viens à plusieurs et partage : c'est fait pour ça.", 90, true],
  // 12e
  ["square-trousseau", "Le Square Trousseau", "Aligre", 12, "1 rue Antoine-Vollon, 75012", 48.8508, 2.3771, 2, 2, "romantique", "Brasserie 1900 face à un square, zinc d'époque et belle terrasse.", "Le dimanche, enchaîne avec le marché d'Aligre juste à côté.", 90, true],
  ["table-verjus", "Table", "Gare de Lyon", 12, "3 rue de Prague, 75012", 48.8497, 2.3774, 3, 3, "cache", "La table de Bruno Verjus, obsédé par le produit, avec un grand comptoir face à la cuisine.", "Place-toi au comptoir pour voir le chef travailler.", 150, true],
  // 13e
  ["avant-gout", "L'Avant-Goût", "Butte-aux-Cailles", 13, "26 rue Bobillot, 75013", 48.8279, 2.3527, 2, 2, "bobo", "Un bistrot de quartier réputé pour son pot-au-feu de cochon aux épices.", "Idéal avant une soirée à la Butte-aux-Cailles.", 90, true],
  ["lao-lane-xang", "Lao Lane Xang 2", "Quartier asiatique", 13, "102 avenue d'Ivry, 75013", 48.8248, 2.3622, 1, 2, "petit-budget", "Une institution laotienne et thaïe du 13e, à la carte immense.", "Le larb et le poulet au basilic sont des valeurs sûres.", 60, false],
  // 14e
  ["la-coupole", "La Coupole", "Montparnasse", 14, "102 boulevard du Montparnasse, 75014", 48.8427, 2.3284, 2, 1, "romantique,famille", "La brasserie Art déco mythique de Montparnasse, piliers peints par les artistes des années 1920.", "Le curry d'agneau est une tradition de la maison depuis son ouverture.", 90, true],
  ["le-dome", "Le Dôme", "Montparnasse", 14, "108 boulevard du Montparnasse, 75014", 48.8426, 2.3289, 3, 1, "romantique", "Ancien QG des peintres de Montparnasse devenu grande table de poissons.", "Sa poissonnerie voisine propose les mêmes produits à emporter.", 90, true],
  ["creperie-josselin", "Crêperie de Josselin", "Montparnasse", 14, "67 rue du Montparnasse, 75014", 48.8414, 2.3252, 1, 1, "petit-budget,famille", "La rue des crêperies bretonnes, près de la gare Montparnasse : celle-ci est la plus célèbre.", "La complète et une bolée de cidre, rien de plus.", 45, false],
  ["le-severo", "Le Severo", "Pernety", 14, "8 rue des Plantes, 75014", 48.8307, 2.3244, 2, 3, "cache", "Une boucherie devenue bistrot à viande de référence, cave impressionnante affichée au mur.", "Commande la côte de bœuf à deux.", 90, true],
  // 15e
  ["cafe-du-commerce", "Le Café du Commerce", "Commerce", 15, "51 rue du Commerce, 75015", 48.8466, 2.2947, 2, 1, "famille", "Une ancienne cantine d'ouvriers sur trois étages autour d'un patio, avec un toit qui s'ouvre aux beaux jours.", "Demande une table en haut, sous la verrière.", 75, true],
  ["le-grand-pan", "Le Grand Pan", "Vaugirard", 15, "20 rue Rosenwald, 75015", 48.8342, 2.3043, 2, 3, "cache", "Un bistrot à viandes de quartier, côtes grillées servies sur planche.", "Viens avec l'appétit : les pièces se partagent.", 90, true],
  ["neige-ete", "Neige d'Été", "Vaugirard", 15, "12 rue de l'Amiral-Roussin, 75015", 48.8448, 2.3004, 3, 3, "cache,romantique", "Une table épurée et gastronomique, cuisine au charbon de bois, dans une rue calme du 15e.", "Pour un dîner d'exception loin des foules.", 150, true],
  // 16e
  ["monsieur-bleu", "Monsieur Bleu", "Trocadéro", 16, "20 avenue de New-York, 75016", 48.8634, 2.2969, 3, 1, "romantique,tendance", "Le restaurant chic du Palais de Tokyo, terrasse face à la tour Eiffel.", "Réserve la terrasse pour le coucher du soleil.", 90, true],
  ["la-gare", "La Gare", "La Muette", 16, "19 chaussée de la Muette, 75016", 48.8577, 2.2717, 2, 2, "famille", "Un restaurant installé dans l'ancienne gare de Passy-La Muette, sur la Petite Ceinture.", "Enchaîne avec le jardin du Ranelagh, juste à côté.", 90, true],
  ["petit-retro", "Le Petit Rétro", "Victor-Hugo", 16, "5 rue Mesnil, 75016", 48.8686, 2.2849, 2, 3, "cache", "Un bistrot 1900 aux carreaux de céramique Art nouveau, cuisine française traditionnelle.", "Admire les faïences Art nouveau d'origine.", 75, true],
  // 17e
  ["coretta", "Coretta", "Batignolles", 17, "151 bis rue Cardinet, 75017", 48.8877, 2.3132, 2, 2, "tendance", "Une table moderne face au parc Clichy-Batignolles, avec vue depuis l'étage.", "Monte à l'étage pour la vue sur le parc.", 90, true],
  ["bistrot-flaubert", "Le Bistrot d'à Côté Flaubert", "Ternes", 17, "10 rue Gustave-Flaubert, 75017", 48.8806, 2.2985, 2, 2, "romantique", "Un bistrot rétro, collection de barbotines aux murs, cuisine lyonnaise.", "Pour un déjeuner de quartier après le marché de Poncelet.", 75, true],
  ["bistrot-des-dames", "Le Bistrot des Dames", "Batignolles", 17, "18 rue des Dames, 75017", 48.8837, 2.3218, 2, 3, "cache,romantique", "Un bistrot de quartier avec un jardin caché à l'arrière, rare dans Paris.", "Demande à manger dans le jardin aux beaux jours.", 75, false],
  // 18e
  ["maison-rose", "La Maison Rose", "Montmartre", 18, "2 rue de l'Abreuvoir, 75018", 48.8876, 2.3386, 2, 1, "romantique", "La petite maison rose peinte par Utrillo, devenue restaurant au sommet de Montmartre.", "Viens tôt le matin pour la photo sans la foule.", 75, true],
  ["moulin-galette", "Le Moulin de la Galette", "Montmartre", 18, "83 rue Lepic, 75018", 48.8868, 2.3363, 2, 1, "romantique", "Restaurant au pied du dernier moulin de Montmartre peint par Renoir.", "La terrasse sous le moulin est un classique.", 90, true],
  ["coq-et-fils", "Le Coq & Fils", "Montmartre", 18, "98 rue Lepic, 75018", 48.8876, 2.3355, 3, 2, "romantique", "La maison de la volaille d'Antoine Westermann, sur les hauteurs de la Butte.", "Le poulet rôti entier se partage à deux.", 90, true],
  // 19e
  ["mensae", "Mensae", "Jourdain", 19, "23 rue Mélingue, 75019", 48.8764, 2.3886, 2, 3, "cache,bobo", "Bistrot moderne de quartier près des Buttes-Chaumont, cuisine de saison.", "Parfait avant ou après une balade aux Buttes-Chaumont.", 90, true],
  ["chapeau-melon", "Le Chapeau Melon", "Belleville", 19, "92 rue Rébeval, 75019", 48.8745, 2.3799, 2, 3, "cache,bobo", "Une cave à vins nature le jour, table d'hôte à menu unique le soir.", "Réserve le soir : menu unique, places comptées.", 120, true],
  ["paname-brewing", "Paname Brewing Company", "Bassin de la Villette", 19, "41 bis quai de la Loire, 75019", 48.8862, 2.3749, 1, 2, "tendance,petit-budget", "Une brasserie artisanale au bord du bassin de la Villette, bières maison et pizzas, terrasse sur l'eau.", "La terrasse flottante au coucher du soleil est le meilleur spot du bassin.", 90, false],
  // 20e
  ["allobroges", "Les Allobroges", "Maraîchers", 20, "71 rue des Grands-Champs, 75020", 48.853, 2.4046, 2, 3, "cache", "Une table fine et discrète au fin fond du 20e, loin de tout circuit touristique.", "L'occasion de découvrir le quartier des Maraîchers, très village.", 90, true],
  ["mama-shelter-resto", "Mama Shelter", "Gambetta", 20, "109 rue de Bagnolet, 75020", 48.8586, 2.4028, 2, 1, "tendance,famille", "La brasserie festive de l'hôtel Mama Shelter, pizzas et plats à partager, rooftop en saison.", "Le brunch du dimanche est une institution de l'Est parisien.", 90, true],
];

export const RESTO_SPOTS: Spot[] = ROWS.map(([id, name, quartier, arrondissement, address, lat, lng, price, hidden, moods, pitch, tip, duration, bookable]) => ({
  id, name, category: "resto", quartier, arrondissement, address, lat, lng, price, hidden,
  moods: moods.split(",").filter(Boolean) as Mood[],
  pitch, tip, duration,
  bookable: bookable ? "table" : undefined,
}));
