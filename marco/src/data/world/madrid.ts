import type { CityGuide } from "./types";

export const MADRID: CityGuide = {
  spots: [
    // ---- Restos ----
    ["mad-botin", "Sobrino de Botín", "resto", "Sol · Centro", "Calle de Cuchilleros 17", 40.4141, -3.708, 3, 1, "romantique", "Fondé en 1725, considéré comme le plus vieux restaurant du monde : cochon de lait rôti au four à bois.", "Demande une table dans la cave voûtée, la plus belle salle.", 100, "https://botin.es"],
    ["mad-casa-lucio", "Casa Lucio", "resto", "La Latina", "Calle de la Cava Baja 35", 40.4122, -3.7086, 2, 2, "tendance", "La maison des huevos rotos, ces œufs cassés sur des frites, dans la rue des tavernes de La Latina.", "Commande les huevos estrellados à partager, puis enchaîne sur les bars de la Cava Baja.", 90],
    ["mad-casa-labra", "Casa Labra", "resto", "Sol · Centro", "Calle de Tetuán 12", 40.4178, -3.7043, 1, 2, "petit-budget", "Une taverne de 1860 célèbre pour ses beignets de morue, servis au comptoir.", "On paie d'abord au guichet, puis on mange debout comme les Madrilènes.", 30],
    ["mad-la-bola", "Taberna La Bola", "resto", "Palacio", "Calle de la Bola 5", 40.4198, -3.7108, 2, 2, "famille", "Le cocido madrileño mijoté dans des pots en terre, servi en deux services comme il se doit.", "Le cocido se mange surtout le midi : arrive avec faim.", 90],
    ["mad-lhardy", "Lhardy", "resto", "Sol · Centro", "Carrera de San Jerónimo 8", 40.4166, -3.7008, 3, 2, "romantique", "Une maison de 1839 au décor d'époque : traiteur au rez-de-chaussée, salons feutrés à l'étage.", "Au comptoir du bas, sers-toi toi-même un bouillon chaud à la fontaine en argent.", 90],
    ["mad-mercado-san-miguel", "Mercado de San Miguel", "resto", "Sol · Centro", "Plaza de San Miguel", 40.4154, -3.709, 2, 1, "tendance,famille", "Une halle en fer forgé de 1916 transformée en marché gourmand : tapas, huîtres, vermouth.", "Vas-y en fin de matinée en semaine, avant la foule du soir.", 60],
    ["mad-el-brillante", "El Brillante", "resto", "Retiro", "Plaza del Emperador Carlos V 8", 40.4085, -3.6935, 1, 1, "petit-budget", "Le temple du sandwich aux calamars, juste en face de la gare d'Atocha et du musée Reina Sofía.", "Parfait après le Reina Sofía : un bocadillo et une caña, c'est le vrai déjeuner madrilène.", 30],
    ["mad-sala-despiece", "Sala de Despiece", "resto", "Chamberí", "Calle de Ponzano 11", 40.438, -3.6988, 2, 2, "tendance,bobo", "Une ancienne boucherie revisitée : tapas créatives servies au comptoir façon atelier de découpe.", "La calle Ponzano est la rue des bars branchés : continue la soirée sur place.", 80],
    // ---- Bars ----
    ["mad-museo-chicote", "Museo Chicote", "bar", "Sol · Centro", "Gran Vía 12", 40.4198, -3.7003, 2, 1, "jazz,romantique", "Le bar à cocktails mythique de la Gran Vía depuis 1931, fréquenté par Hemingway et Ava Gardner.", "Après minuit, un DJ prend le relais et l'ambiance change complètement.", 90],
    ["mad-salmon-guru", "Salmon Guru", "bar", "Barrio de las Letras", "Calle de Echegaray 21", 40.4149, -3.699, 2, 2, "tendance", "L'un des bars à cocktails les plus créatifs d'Europe, néons et verres extravagants.", "Arrive tôt, la file se forme vite le week-end.", 90],
    ["mad-la-venencia", "La Venencia", "bar", "Barrio de las Letras", "Calle de Echegaray 7", 40.4157, -3.6996, 1, 3, "cache,petit-budget", "Un bar à xérès figé dans le temps : on y boit du jerez servi au tonneau, sans photos ni pourboire.", "Pas de photos et pas de pourboire : ce sont les règles de la maison, respecte-les.", 60],
    ["mad-casa-alberto", "Casa Alberto", "bar", "Barrio de las Letras", "Calle de las Huertas 18", 40.414, -3.6995, 2, 2, "romantique", "Une taverne de 1827 où l'on boit le vermouth au robinet sous les bouteilles anciennes.", "Commande un vermut de grifo avec une banderilla : c'est le rituel du dimanche midi.", 60],
    ["mad-azotea-circulo", "Azotea du Círculo de Bellas Artes", "bar", "Sol · Centro", "Calle de Alcalá 42", 40.4185, -3.6965, 2, 1, "romantique", "Le toit-terrasse le plus célèbre de Madrid, face au dôme de l'édifice Metrópolis.", "Monte au coucher du soleil : la Gran Vía s'allume sous tes pieds.", 60],
    // ---- Cafés ----
    ["mad-san-gines", "Chocolatería San Ginés", "cafe", "Sol · Centro", "Pasadizo de San Ginés 5", 40.417, -3.7069, 1, 1, "famille,petit-budget", "Chocolat épais et churros depuis 1894, ouvert presque jour et nuit.", "Le meilleur moment : à 5 h du matin, à la sortie des clubs, comme les Madrilènes.", 30, "https://chocolateriasangines.com"],
    ["mad-cafe-gijon", "Café Gijón", "cafe", "Salamanca", "Paseo de Recoletos 21", 40.4235, -3.6925, 2, 2, "romantique", "Le café littéraire de Madrid depuis 1888, boiseries et tertulias d'écrivains.", "Prends la terrasse sur le paseo de Recoletos en été.", 45],
    // ---- Culture ----
    ["mad-prado", "Museo del Prado", "culture", "Retiro", "Calle de Ruiz de Alarcón 23", 40.4138, -3.6921, 2, 1, "famille", "Velázquez, Goya, Bosch : l'un des plus grands musées du monde. Les Ménines valent le voyage.", "L'entrée est gratuite les deux dernières heures du jour : arrive un peu avant.", 180, "https://www.museodelprado.es"],
    ["mad-reina-sofia", "Museo Reina Sofía", "culture", "Lavapiés", "Calle de Santa Isabel 52", 40.4086, -3.6944, 2, 1, "bobo", "L'art moderne espagnol, Dalí, Miró et surtout Guernica de Picasso.", "Prends l'ascenseur vitré extérieur pour la vue sur Madrid.", 150, "https://www.museoreinasofia.es"],
    ["mad-sorolla", "Museo Sorolla", "culture", "Chamberí", "Paseo del General Martínez Campos 37", 40.4355, -3.6925, 1, 3, "cache,romantique", "La maison-atelier du peintre de la lumière, avec un jardin andalou caché en plein Madrid.", "Le jardin se visite librement : idéal pour une pause à l'ombre.", 75],
    ["mad-palacio-real", "Palacio Real", "culture", "Palacio", "Calle de Bailén", 40.418, -3.7143, 2, 1, "famille", "Plus de 3 000 salles, la plus grande résidence royale d'Europe occidentale.", "La relève de la garde a lieu le mercredi et le samedi en fin de matinée.", 120],
    ["mad-cerralbo", "Museo Cerralbo", "culture", "Palacio", "Calle Ventura Rodríguez 17", 40.4237, -3.7146, 1, 3, "cache", "Un palais du XIXe siècle resté intact, rempli des collections d'un marquis passionné.", "La salle de bal dorée est à couper le souffle, et le musée est rarement plein.", 75],
    // ---- Nature ----
    ["mad-retiro", "Parc du Retiro et Palais de Cristal", "nature", "Retiro", "Plaza de la Independencia 7", 40.4153, -3.6844, 1, 1, "famille,romantique,petit-budget", "Le grand parc de Madrid : étang, barques, et un palais de verre posé au bord d'un lac.", "Loue une barque sur le grand étang, puis va voir le Palais de Cristal.", 120],
    ["mad-templo-debod", "Temple de Debod", "nature", "Palacio", "Calle Ferraz 1", 40.424, -3.7177, 1, 2, "romantique,petit-budget", "Un vrai temple égyptien offert par l'Égypte, posé dans un parc qui domine l'ouest de Madrid.", "C'est le meilleur coucher de soleil de la ville : arrive 30 minutes avant.", 45],
    // ---- Insolite ----
    ["mad-rastro", "El Rastro", "insolite", "La Latina", "Calle de la Ribera de Curtidores", 40.4087, -3.7075, 1, 1, "petit-budget", "Le grand marché aux puces du dimanche matin, depuis des siècles.", "Enchaîne avec un vermouth à La Latina : c'est le rituel du dimanche.", 120],
    ["mad-carboneras", "Couvent des Carboneras", "insolite", "Sol · Centro", "Plaza del Conde de Miranda 3", 40.4146, -3.7088, 1, 3, "cache,insolite", "Des religieuses cloîtrées vendent leurs biscuits à travers un tour en bois, sans jamais se montrer.", "Sonne, demande les gâteaux à voix haute et dépose l'argent sur le plateau qui tourne.", 20],
    ["mad-anden-0", "Andén 0, station fantôme de Chamberí", "insolite", "Chamberí", "Plaza de Chamberí", 40.4325, -3.702, 1, 3, "cache,famille", "Une station de métro fermée en 1966, restée intacte avec ses carreaux et ses publicités d'époque.", "Entrée gratuite, mais avec réservation : regarde les créneaux à l'avance.", 45],
    // ---- Activités ----
    ["mad-corral-moreria", "Corral de la Morería", "activite", "Palacio", "Calle de la Morería 17", 40.413, -3.7148, 3, 1, "romantique", "Le plus célèbre tablao flamenco du monde, depuis 1956.", "Réserve le spectacle seul si tu veux juste le flamenco, c'est moins cher que le dîner.", 90, "https://www.corraldelamoreria.com"],
    ["mad-cardamomo", "Cardamomo", "activite", "Barrio de las Letras", "Calle de Echegaray 15", 40.4152, -3.6994, 2, 2, "jazz", "Un tablao intimiste où les danseurs sont à deux mètres de toi.", "Les places au premier rang se réservent : le spectacle est très physique.", 60],
    ["mad-bernabeu", "Visite du stade Santiago Bernabéu", "activite", "Chamberí", "Avenida de Concha Espina 1", 40.4531, -3.6883, 2, 1, "famille", "Les vestiaires, le banc de touche et la salle des trophées du Real Madrid.", "Les jours de match, la visite est réduite : vérifie le calendrier.", 90, "https://www.realmadrid.com"],
    // ---- Hôtels ----
    ["mad-the-hat", "The Hat Madrid", "hotel", "La Latina", "Calle Imperial 9", 40.4146, -3.7077, 1, 2, "petit-budget,tendance", "Une auberge design à deux pas de la Plaza Mayor, avec un rooftop très animé.", "Chambres privées disponibles : le prix d'une auberge, le confort d'un petit hôtel.", 0, "", 0],
    ["mad-pestana-plaza-mayor", "Pestana Plaza Mayor", "hotel", "Sol · Centro", "Calle Imperial 8", 40.4148, -3.7072, 2, 1, "romantique", "Un hôtel installé dans un bâtiment de la Plaza Mayor, avec piscine sur le toit.", "Demande une chambre côté place pour la vue.", 0, "", 4],
    ["mad-only-you", "Only You Boutique Hotel", "hotel", "Chueca", "Calle del Barquillo 21", 40.4215, -3.696, 2, 2, "tendance,romantique", "Un palais du XIXe siècle relooké, au cœur de Chueca.", "Le bar du lobby est un bon point de départ pour une soirée à Chueca.", 0, "", 4],
    ["mad-four-seasons", "Four Seasons Madrid", "hotel", "Sol · Centro", "Calle de Sevilla 3", 40.4178, -3.6994, 3, 1, "romantique", "Sept bâtiments historiques réunis en un palace, avec spa sur quatre étages.", "Le rooftop du restaurant offre une vue superbe sur la Gran Vía.", 0, "", 5],
    ["mad-mandarin-ritz", "Mandarin Oriental Ritz", "hotel", "Retiro", "Plaza de la Lealtad 5", 40.4157, -3.6935, 3, 1, "romantique", "Le palace Belle Époque de Madrid, à deux pas du Prado.", "Le jardin-terrasse est parfait pour un verre même sans y dormir.", 0, "", 5],
  ],
  streets: [
    {
      id: "mad-cava-baja", name: "Calle de la Cava Baja", aliases: ["Cava Baja"], arrondissement: "La Latina", lat: 40.4122, lng: -3.7086,
      histoire: "Son nom vient de la « cava », le fossé creusé au pied de la muraille médiévale de Madrid. Une fois la muraille dépassée par la ville, le fossé est devenu une rue, et la rue s'est remplie d'auberges pour les voyageurs et les marchands qui arrivaient du sud.",
      fait: { annee: "1561", texte: "Philippe II installe la cour à Madrid : la ville explose, et les posadas de la Cava Baja accueillent muletiers, marchands et voyageurs venus de tout le royaume." },
      anecdote: "Les auberges sont devenues des bars à tapas, mais la fonction n'a pas changé : on y entre affamé et fatigué, on en ressort reposé et légèrement trop nourri.",
      aVoir: ["mad-casa-lucio", "mad-rastro"],
    },
    {
      id: "mad-gran-via", name: "Gran Vía", aliases: ["Gran Via"], arrondissement: "Sol · Centro", lat: 40.4198, lng: -3.705,
      histoire: "Percée au début du XXe siècle à travers un dédale de ruelles, la Gran Vía devait faire de Madrid une capitale moderne. Ses immeubles mélangent tous les styles de l'époque, et l'édifice Telefónica (1929) fut l'un des premiers gratte-ciel d'Europe.",
      fait: { annee: "1910", texte: "Le 4 avril 1910, le roi Alphonse XIII donne le premier coup de pioche des travaux, qui dureront plusieurs décennies." },
      anecdote: "Pendant le siège de Madrid (1936-1939), la tour Telefónica servait de poste d'observation et les obus pleuvaient tellement que les Madrilènes avaient surnommé la rue « l'avenue des obus ».",
      aVoir: ["mad-museo-chicote", "mad-azotea-circulo"],
    },
    {
      id: "mad-cervantes", name: "Calle de Cervantes", aliases: ["Cervantes", "Barrio de las Letras"], arrondissement: "Barrio de las Letras", lat: 40.4143, lng: -3.6975,
      histoire: "Le quartier des Lettres a abrité Cervantès, Lope de Vega, Quevedo et Góngora, qui se croisaient et se détestaient cordialement. Des citations de leurs œuvres sont gravées en lettres de bronze sur les pavés.",
      fait: { annee: "1616", texte: "Miguel de Cervantès meurt en avril 1616 dans une maison au coin de cette rue, alors appelée calle de Francos, et il est enterré tout près au couvent des Trinitaires." },
      anecdote: "Ironie madrilène : la maison de Lope de Vega se trouve rue Cervantès, et la tombe de Cervantès se trouve rue Lope de Vega. Les deux rivaux sont condamnés à cohabiter pour l'éternité.",
      aVoir: ["mad-casa-alberto", "mad-la-venencia"],
    },
    {
      id: "mad-plaza-mayor", name: "Plaza Mayor", aliases: ["Plaza Mayor de Madrid"], arrondissement: "Sol · Centro", lat: 40.4155, lng: -3.7074,
      histoire: "Achevée en 1619 sous Philippe III par l'architecte Juan Gómez de Mora, la place a servi de marché, d'arène pour les corridas, de scène pour les couronnements et pour les autodafés de l'Inquisition.",
      fait: { annee: "1790", texte: "Un grand incendie ravage un tiers de la place ; elle est reconstruite par Juan de Villanueva, l'architecte du Prado, qui lui donne son aspect fermé actuel." },
      anecdote: "La spécialité des bars autour de la place est le sandwich aux calamars… dans une ville située à plus de 300 kilomètres de la mer. Les Madrilènes n'y voient aucune contradiction.",
      aVoir: ["mad-mercado-san-miguel", "mad-carboneras"],
    },
  ],
  nights: [
    { district: "Malasaña", vibe: "Le berceau de la Movida des années 1980 : bars rock, concerts et terrasses sur les places jusqu'à tard.", venues: [
      { name: "Café La Palma", address: "Calle de la Palma 62", kind: "Concerts", tip: "Plusieurs salles, du concert acoustique au DJ set." },
      { name: "El Penta", address: "Calle de la Palma 4", kind: "Bar rock", tip: "Un bar de la Movida resté dans son jus." },
      { name: "Tupperware", address: "Corredera Alta de San Pablo 26", kind: "Bar kitsch", tip: "Déco pop des années 70 et musique indé." },
    ] },
    { district: "Chueca", vibe: "Le quartier LGBT et festif de Madrid : bars à cocktails, terrasses et soirées qui débordent dans la rue.", venues: [
      { name: "Museo Chicote", address: "Gran Vía 12", kind: "Cocktails", tip: "Le classique, avant de descendre vers Chueca." },
      { name: "Bar Cock", address: "Calle de la Reina 16", kind: "Cocktails", tip: "Un bar à l'ancienne, boiseries et cocktails classiques." },
    ] },
    { district: "Barrio de las Letras", vibe: "Flamenco, jazz et bars historiques entre la calle Huertas et la plaza Santa Ana.", venues: [
      { name: "Cardamomo", address: "Calle de Echegaray 15", kind: "Flamenco", tip: "Réserve le spectacle de 22 h." },
      { name: "Café Central", address: "Plaza del Ángel 10", kind: "Jazz", tip: "Un club de jazz Art déco, concerts chaque soir." },
      { name: "La Venencia", address: "Calle de Echegaray 7", kind: "Bar à xérès", tip: "Pour commencer la soirée comme en 1930." },
    ] },
    { district: "La Latina", vibe: "Le dimanche après le Rastro et tous les soirs : tapeo de bar en bar sur la Cava Baja.", venues: [
      { name: "Cava Baja", address: "Calle de la Cava Baja", kind: "Tapeo", tip: "Un verre et une tapa par bar, puis on avance." },
      { name: "Delic", address: "Costanilla de San Andrés 14", kind: "Bar", tip: "Terrasse sur la jolie plaza de la Paja." },
    ] },
    { district: "Sol · Centro", vibe: "Les grands clubs et les salles de concert mythiques, pour finir au petit matin.", venues: [
      { name: "Teatro Kapital", address: "Calle de Atocha 125", kind: "Club", tip: "Sept étages, sept ambiances." },
      { name: "Joy Eslava", address: "Calle del Arenal 11", kind: "Club", tip: "Une boîte installée dans un ancien théâtre du XIXe siècle." },
      { name: "Sala El Sol", address: "Calle de los Jardines 3", kind: "Concerts", tip: "La salle mythique de la Movida." },
    ] },
  ],
  diet: [
    { diet: "halal", name: "Lavapiés", streets: "Calle de Lavapiés, calle del Ave María, calle de la Fe", text: "Le quartier le plus métissé de Madrid : restaurants indiens, bangladais, marocains et sénégalais, souvent halal." },
    { diet: "casher", name: "Chamberí (autour de la synagogue)", streets: "Calle de Balmes", text: "La communauté juive de Madrid est petite : les adresses casher se trouvent surtout autour de la synagogue de la calle Balmes, renseigne-toi auprès de la communauté." },
  ],
};
