import type { Mood, Spot } from "./spots";

// Hôtels de Paris, du petit budget au palace. Prix indicatifs par nuit pour une chambre double,
// très variables selon les dates : 1 = moins de 150 €, 2 = 150 à 350 €, 3 = plus de 350 €.
// [id, nom, quartier, arr, adresse, lat, lng, prix, caché(1-3), étoiles (0 = auberge), ambiances, pitch, astuce, site officiel]
type Row = [string, string, string, number, string, number, number, 1 | 2 | 3, 1 | 2 | 3, number, string, string, string, string];

const ROWS: Row[] = [
  // ---- Petits budgets ----
  ["hotel-generator", "Generator Paris", "Colonel-Fabien", 10, "9-11 place du Colonel-Fabien, 75010", 48.8777, 2.3704, 1, 1, 0, "petit-budget,tendance", "Une auberge de jeunesse design avec chambres privées, bar sur le toit et vue sur le Sacré-Cœur.", "Prends une chambre privée avec terrasse : le prix d'un hôtel 2 étoiles, la vue en plus.", "https://staygenerator.com"],
  ["hotel-les-piaules", "Les Piaules", "Belleville", 11, "59 boulevard de Belleville, 75011", 48.8706, 2.3772, 1, 2, 0, "petit-budget,bobo", "Une auberge chaleureuse au cœur de Belleville, avec un rooftop qui regarde tout Paris.", "Le bar du rez-de-chaussée est ouvert à tous : idéal pour rencontrer du monde.", "https://www.lespiaules.com"],
  ["hotel-st-christophers", "St Christopher's Inn Canal", "Bassin de la Villette", 19, "159 rue de Crimée, 75019", 48.8897, 2.3772, 1, 2, 0, "petit-budget,famille", "Une grande auberge au bord du bassin de la Villette, dans un ancien entrepôt.", "Le quartier du canal se vit le soir : guinguettes et bateaux sont à deux pas.", ""],
  ["hotel-grandes-ecoles", "Hôtel des Grandes Écoles", "Quartier Latin", 5, "75 rue du Cardinal-Lemoine, 75005", 48.8455, 2.3501, 1, 3, 3, "romantique,cache", "Trois maisons autour d'un jardin fleuri caché derrière une porte cochère : la campagne au Quartier latin.", "Demande une chambre côté jardin et prends le petit-déjeuner dehors aux beaux jours.", ""],
  ["hotel-esmeralda", "Hôtel Esmeralda", "Saint-Michel", 5, "4 rue Saint-Julien-le-Pauvre, 75005", 48.8522, 2.3475, 1, 3, 1, "romantique,cache,petit-budget", "Un petit hôtel hors du temps face au square Viviani, avec vue sur Notre-Dame depuis certaines chambres.", "Les chambres sont modestes mais la vue sur Notre-Dame vaut tous les palaces.", ""],
  ["hotel-mama-shelter-east", "Mama Shelter Paris East", "Saint-Blaise", 20, "109 rue de Bagnolet, 75020", 48.8613, 2.4043, 1, 1, 4, "tendance,famille,petit-budget", "Un hôtel festif et pas cher signé Starck, avec grande brasserie, pizzeria et rooftop.", "Les brunchs du dimanche sont célèbres : réserve même si tu ne dors pas sur place.", "https://mamashelter.com"],
  ["hotel-citizenm-gare-de-lyon", "citizenM Paris Gare de Lyon", "Gare de Lyon", 12, "8 rue Van-Gogh, 75012", 48.8438, 2.3718, 1, 1, 4, "tendance,petit-budget", "Des chambres compactes et très bien pensées face à la Seine, à deux pas de la gare de Lyon.", "Parfait pour un départ en train tôt le matin.", "https://www.citizenm.com"],
  // ---- Charme et adresses de quartier ----
  ["hotel-henriette", "Hôtel Henriette", "Gobelins", 13, "9 rue des Gobelins, 75013", 48.8368, 2.3517, 2, 3, 3, "romantique,bobo,cache", "Un hôtel de charme chiné, coloré et intime, avec un patio fleuri, dans un quartier calme.", "Le patio est un vrai coin de verdure pour un verre au calme en fin de journée.", "https://www.hotelhenriette.com"],
  ["hotel-paradiso", "Hôtel Paradiso", "Nation", 12, "135 boulevard Diderot, 75012", 48.8478, 2.3929, 2, 2, 4, "insolite,romantique", "L'hôtel-cinéma : un écran géant et un vidéoprojecteur dans chaque chambre, et une salle de cinéma privatisable.", "Réserve la salle de cinéma pour une séance entre amis : c'est l'expérience à faire.", "https://www.mk2hotelparadiso.com"],
  ["hotel-amour-chambres", "Hôtel Amour", "SoPi", 9, "8 rue de Navarin, 75009", 48.8800, 2.3389, 2, 2, 3, "romantique,tendance,bobo", "Un hôtel canaille et arty du sud de Pigalle, avec un jardin caché très couru le soir.", "Le jardin-restaurant est l'un des plus jolis secrets du 9e : réserve ta table.", "https://www.hotelamourparis.fr"],
  ["hotel-le-pigalle", "Le Pigalle", "Pigalle", 9, "9 rue Frochot, 75009", 48.8816, 2.3373, 2, 2, 4, "tendance,jazz,bobo", "Un hôtel qui célèbre la nuit de Pigalle : platines et vinyles dans certaines chambres.", "Le bar du rez-de-chaussée est un bon point de départ pour une soirée à Pigalle.", "https://www.lepigalle.paris"],
  ["hotel-panache", "Hôtel Panache", "Grands Boulevards", 9, "1 rue Geoffroy-Marie, 75009", 48.8737, 2.3446, 2, 2, 4, "bobo,romantique", "Un hôtel Art déco revisité, chambres aux formes triangulaires et bistrot de quartier.", "À deux pas du Bouillon Chartier et des passages couverts.", "https://www.hotelpanache.com"],
  ["hotel-caron-beaumarchais", "Hôtel Caron de Beaumarchais", "Le Marais", 4, "12 rue Vieille-du-Temple, 75004", 48.8571, 2.3557, 2, 3, 3, "romantique,cache", "Un petit hôtel XVIIIe siècle plein de charme, au cœur du Marais, en hommage à l'auteur du « Mariage de Figaro ».", "Les chambres sont petites mais l'emplacement est parfait pour tout faire à pied.", ""],
  ["hotel-fabric", "Hôtel Fabric", "Oberkampf", 11, "31 rue de la Folie-Méricourt, 75011", 48.8641, 2.3716, 2, 2, 4, "bobo,tendance", "Une ancienne usine textile devenue hôtel au calme, à deux pas des bars d'Oberkampf.", "Le petit-déjeuner servi jusqu'à tard est parfait après une soirée dans le quartier.", "https://www.hotelfabric.com"],
  ["hotel-le-citizen", "Le Citizen Hotel", "Canal Saint-Martin", 10, "96 quai de Jemmapes, 75010", 48.8724, 2.3641, 2, 2, 3, "bobo,romantique", "Un petit hôtel lumineux face au canal Saint-Martin, minimaliste et chaleureux.", "Demande une chambre côté canal : la vue sur les passerelles vaut le détour.", ""],
  ["hotel-hoxton", "The Hoxton Paris", "Sentier", 2, "30-32 rue du Sentier, 75002", 48.8693, 2.3463, 2, 1, 4, "tendance,bobo", "Un hôtel particulier du XVIIIe transformé en hôtel animé, avec cour, bar et restaurant.", "Les chambres « Shoebox » sont les moins chères et suffisent largement pour une nuit.", "https://thehoxton.com"],
  ["hotel-novotel-halles", "Novotel Paris Les Halles", "Les Halles", 1, "8 place Marguerite-de-Navarre, 75001", 48.8616, 2.3467, 2, 1, 4, "famille", "Un hôtel pratique pour les familles : chambres pour quatre et le métro au pied de l'hôtel.", "Le jardin Nelson-Mandela et ses jeux sont juste à côté.", "https://all.accor.com"],
  ["hotel-jeu-de-paume", "Hôtel du Jeu de Paume", "Île Saint-Louis", 4, "54 rue Saint-Louis-en-l'Île, 75004", 48.8517, 2.3568, 2, 3, 4, "romantique,cache", "Un ancien jeu de paume du XVIIe siècle sur l'île Saint-Louis, avec poutres apparentes et jardin.", "Le soir, l'île se vide des touristes : balade sur les quais garantie.", ""],
  // ---- Design et boutique-hôtels ----
  ["hotel-national-arts-metiers", "Hôtel National des Arts et Métiers", "Arts et Métiers", 3, "243 rue Saint-Martin, 75003", 48.8667, 2.3530, 3, 2, 5, "tendance,bobo", "Un hôtel au design soigné avec un rooftop qui domine les toits du Haut-Marais.", "Le rooftop est ouvert aux non-résidents en saison : vas-y pour l'apéro.", "https://hotelnational.paris"],
  ["hotel-providence", "Hôtel Providence", "Strasbourg-Saint-Denis", 10, "90 rue René-Boulanger, 75010", 48.8697, 2.3594, 3, 3, 4, "romantique,cache", "Une maison bourgeoise du XIXe siècle à la déco soignée, avec un bar à cocktails dans chaque chambre.", "Le bar du rez-de-chaussée est un secret bien gardé du quartier.", ""],
  ["hotel-petit-moulin", "Hôtel du Petit Moulin", "Haut-Marais", 3, "29-31 rue de Poitou, 75003", 48.8618, 2.3634, 3, 3, 4, "romantique,insolite", "Une ancienne boulangerie dont la façade d'origine est restée, avec des chambres décorées par Christian Lacroix.", "Chaque chambre est différente : regarde les photos et choisis la tienne.", ""],
  ["hotel-grands-boulevards", "Hôtel des Grands Boulevards", "Grands Boulevards", 2, "17 boulevard Poissonnière, 75002", 48.8712, 2.3446, 3, 2, 4, "tendance,romantique", "Un hôtel au goût de maison de campagne chic, avec un restaurant italien et un rooftop.", "Le rooftop a l'un des meilleurs panoramas du centre de Paris.", "https://www.grandsboulevardshotel.com"],
  ["hotel-bachaumont", "Hôtel Bachaumont", "Montorgueil", 2, "18 rue Bachaumont, 75002", 48.8655, 2.3457, 3, 2, 4, "tendance", "Un hôtel des années 1920 au cœur du quartier Montorgueil, avec un bar à cocktails réputé.", "La rue piétonne Montorgueil est au bout de la rue pour les courses du matin.", "https://www.hotelbachaumont.com"],
  ["hotel-les-bains", "Hôtel Les Bains", "Le Marais", 3, "7 rue du Bourg-l'Abbé, 75003", 48.8635, 2.3527, 3, 2, 5, "insolite,tendance", "Les anciens bains Guerbois devenus boîte de nuit mythique puis hôtel, avec une piscine en sous-sol.", "La piscine de l'ancien club est l'un des lieux les plus étonnants de Paris.", "https://www.lesbains-paris.com"],
  ["hotel-terrass", "Terrass\" Hôtel", "Montmartre", 18, "12-14 rue Joseph-de-Maistre, 75018", 48.8866, 2.3332, 3, 2, 4, "romantique", "L'hôtel de Montmartre et son rooftop face à tout Paris, de la tour Eiffel à Notre-Dame.", "Monte au rooftop pour le coucher du soleil, même pour un simple verre.", "https://www.terrass-hotel.com"],
  ["hotel-particulier-montmartre", "Hôtel Particulier Montmartre", "Montmartre", 18, "23 avenue Junot, 75018", 48.8883, 2.3352, 3, 3, 4, "romantique,cache", "Un hôtel particulier caché au fond d'une impasse, avec seulement quelques suites et un jardin secret.", "Le bar et le jardin accueillent aussi les non-résidents pour un verre très confidentiel.", "https://www.hotel-particulier-montmartre.com"],
  ["hotel-molitor", "Hôtel Molitor", "Porte d'Auteuil", 16, "13 rue Nungesser-et-Coli, 75016", 48.8452, 2.2524, 3, 2, 5, "insolite,famille", "La piscine Art déco Molitor, sauvée et transformée en hôtel : nager dans un monument des années 1930.", "Le séjour donne accès aux deux bassins, dont le bassin extérieur chauffé en hiver.", "https://www.mltr.fr"],
  // ---- Palaces et grands hôtels ----
  ["hotel-lutetia", "Hôtel Lutetia", "Saint-Germain-des-Prés", 6, "45 boulevard Raspail, 75006", 48.8510, 2.3270, 3, 1, 5, "romantique", "Le grand hôtel Art nouveau de la rive gauche, entièrement rénové, avec son bar Joséphine.", "Le bar Joséphine accueille tout le monde : un cocktail sous la fresque vaut le détour.", "https://www.hotellutetia.com"],
  ["hotel-l-hotel", "L'Hôtel", "Saint-Germain-des-Prés", 6, "13 rue des Beaux-Arts, 75006", 48.8565, 2.3352, 3, 3, 5, "romantique,cache", "Un tout petit hôtel autour d'une cage d'escalier vertigineuse, là où Oscar Wilde a fini ses jours.", "Demande à voir la piscine voûtée dans les caves, réservable en privé.", "https://www.l-hotel.com"],
  ["hotel-ritz", "Ritz Paris", "Place Vendôme", 1, "15 place Vendôme, 75001", 48.8681, 2.3289, 3, 1, 5, "romantique", "Le palace mythique de la place Vendôme, du bar Hemingway à la suite Coco Chanel.", "Sans dormir sur place, le bar Hemingway est la façon la plus accessible de goûter au Ritz.", "https://www.ritzparis.com"],
  ["hotel-le-meurice", "Le Meurice", "Tuileries", 1, "228 rue de Rivoli, 75001", 48.8651, 2.3281, 3, 1, 5, "romantique", "Un palace face aux Tuileries, surnommé l'hôtel des rois, au décor revu par Philippe Starck.", "L'heure du thé au Dalí est une belle alternative à une nuit sur place.", "https://www.dorchestercollection.com"],
  ["hotel-cheval-blanc", "Cheval Blanc Paris", "Pont-Neuf", 1, "8 quai du Louvre, 75001", 48.8591, 2.3427, 3, 1, 5, "romantique", "Le palace de la Samaritaine, avec vue sur la Seine et piscine de 30 mètres.", "Le restaurant et le bar sont accessibles pour profiter de la vue sans y dormir.", "https://www.chevalblanc.com"],
  ["hotel-le-bristol", "Le Bristol Paris", "Faubourg Saint-Honoré", 8, "112 rue du Faubourg-Saint-Honoré, 75008", 48.8718, 2.3149, 3, 1, 5, "romantique,famille", "Un palace familial et classique, avec piscine sur le toit et le chat Socrate qui règne sur le hall.", "Le jardin intérieur est l'un des plus grands des palaces parisiens.", "https://www.oetkercollection.com"],
  ["hotel-shangri-la", "Shangri-La Paris", "Iéna", 16, "10 avenue d'Iéna, 75016", 48.8636, 2.2935, 3, 2, 5, "romantique", "L'ancien palais du prince Roland Bonaparte, avec des chambres qui regardent la tour Eiffel en face.", "Précise une chambre « vue tour Eiffel » : c'est toute la magie de l'adresse.", "https://www.shangri-la.com"],
  ["hotel-raphael", "Hôtel Raphael", "Étoile", 16, "17 avenue Kléber, 75016", 48.8722, 2.2933, 3, 2, 5, "romantique,cache", "Un grand hôtel discret près de l'Étoile, avec un rooftop face à la tour Eiffel et à l'Arc de Triomphe.", "Le rooftop, ouvert l'été, est un des secrets les mieux gardés de l'Ouest parisien.", "https://www.raphael-hotel.com"],
];

export const HOTEL_SPOTS: Spot[] = ROWS.map(([id, name, quartier, arrondissement, address, lat, lng, price, hidden, stars, moods, pitch, tip, website]) => ({
  id,
  name,
  category: "hotel",
  quartier,
  arrondissement,
  address,
  lat,
  lng,
  price,
  hidden,
  stars,
  moods: moods.split(",") as Mood[],
  pitch,
  tip,
  duration: 0,
  bookable: "hotel",
  ...(website ? { website } : {}),
}));

/** Repères de prix affichés (indicatifs, par nuit pour une chambre double). */
export const HOTEL_PRICE_LABEL: Record<1 | 2 | 3, string> = {
  1: "Moins de 150 € la nuit",
  2: "150 à 350 € la nuit",
  3: "Plus de 350 € la nuit",
};
