import type { Row } from "./types";

export const MADRID_PLUS: Row[] = [
  // ---- Restos ----
  ["mad-casa-revuelta", "Casa Revuelta", "resto", "La Latina", "Calle de Latoneros 3", 40.4146, -3.7085, 1, 2, "petit-budget", "Une petite taverne célèbre pour ses tranches de morue frite, servies depuis des décennies.", "Viens le dimanche après le Rastro, comme les habitués.", 30],
  ["mad-casa-abuelo", "La Casa del Abuelo", "resto", "Sol · Centro", "Calle de la Victoria 12", 40.4167, -3.7019, 1, 1, "petit-budget", "Les gambas à l'ail grésillantes depuis 1906, à manger debout au comptoir.", "Accompagne-les du vin doux de la maison.", 30],
  ["mad-juana-la-loca", "Juana La Loca", "resto", "La Latina", "Plaza de la Puerta de Moros 4", 40.411, -3.711, 2, 2, "tendance", "Sa tortilla aux oignons caramélisés est considérée comme l'une des meilleures de Madrid.", "Commande-la en arrivant, elle part vite.", 75],
  ["mad-streetxo", "StreetXO", "resto", "Salamanca", "Calle de Serrano 52", 40.429, -3.6865, 2, 2, "tendance", "La street food explosive du chef triplement étoilé David Muñoz, au comptoir.", "Pas de réservation : arrive à l'ouverture.", 75],
  ["mad-san-fernando", "Mercado de San Fernando", "resto", "Lavapiés", "Calle de Embajadores 41", 40.4085, -3.7015, 1, 2, "bobo,petit-budget", "Le marché de quartier de Lavapiés, avec ses comptoirs de cuisines du monde le week-end.", "Le samedi midi, c'est l'apéro géant du quartier.", 60],
  ["mad-casa-dani", "Casa Dani", "resto", "Salamanca", "Mercado de la Paz, Calle de Ayala 28", 40.4268, -3.6815, 1, 2, "petit-budget", "Une tortilla de pommes de terre souvent primée, servie au cœur d'un marché couvert.", "Viens tôt le midi, la file s'allonge vite.", 30],
  ["mad-malacatin", "Taberna Malacatín", "resto", "La Latina", "Calle de la Ruda 5", 40.4108, -3.7077, 2, 2, "famille", "Un cocido madrileño généreux, servi à volonté dans une taverne carrelée de 1895.", "Réserve pour le midi : le cocido ne se sert qu'au déjeuner.", 90],
  // ---- Bars ----
  ["mad-ardosa", "Bodega de la Ardosa", "bar", "Malasaña", "Calle de Colón 13", 40.4235, -3.7015, 1, 2, "petit-budget", "Une bodega de 1892 aux murs couverts de bouteilles, connue pour sa tortilla et sa bière pression.", "La petite salle du fond se rejoint en passant sous le comptoir.", 45],
  ["mad-viva-madrid", "Viva Madrid", "bar", "Barrio de las Letras", "Calle de Manuel Fernández y González 7", 40.4152, -3.6995, 1, 1, "romantique", "Une façade d'azulejos peints parmi les plus photographiées de Madrid, et un bar animé derrière.", "Parfait pour commencer une soirée dans le quartier des Lettres.", 45],
  ["mad-1862-dry-bar", "1862 Dry Bar", "bar", "Malasaña", "Calle del Pez 27", 40.4237, -3.7055, 2, 2, "cache", "Un bar à cocktails classiques, feutré et sans esbroufe, au cœur de Malasaña.", "Demande un cocktail au vermouth, la spécialité.", 75],
  ["mad-angelita", "Angelita", "bar", "Chueca", "Calle de la Reina 4", 40.4196, -3.6993, 2, 2, "tendance", "Un bar à vins au rez-de-chaussée, un bar à cocktails au sous-sol.", "Laisse le sommelier te faire goûter des vins espagnols peu connus.", 75],
  // ---- Culture, nature, insolite ----
  ["mad-thyssen", "Musée Thyssen-Bornemisza", "culture", "Barrio de las Letras", "Paseo del Prado 8", 40.416, -3.6949, 2, 1, "famille", "Huit siècles de peinture, des primitifs italiens à Hopper, dans une collection privée unique.", "Le lundi, la collection permanente est gratuite.", 150],
  ["mad-botanico", "Real Jardín Botánico", "nature", "Retiro", "Plaza de Murillo 2", 40.411, -3.6915, 1, 2, "romantique", "Un jardin botanique du XVIIIe siècle, calme et ombragé, à côté du Prado.", "Parfait pour souffler entre deux musées.", 60],
  ["mad-caixaforum", "Jardin vertical du CaixaForum", "insolite", "Retiro", "Paseo del Prado 36", 40.411, -3.6935, 1, 2, "insolite", "Un mur végétal de 24 mètres de haut, avec des centaines d'espèces de plantes.", "Les expositions temporaires du CaixaForum sont souvent excellentes.", 30],
  ["mad-el-riojano", "Pastelería El Riojano", "cafe", "Sol · Centro", "Calle Mayor 10", 40.4165, -3.7055, 1, 2, "romantique", "Une pâtisserie de 1855 aux boiseries d'époque, avec un petit salon de thé caché au fond.", "Goûte les pastas del consejo, créées pour une reine.", 30],
  // ---- Activités ----
  ["mad-matadero", "Matadero Madrid", "activite", "Lavapiés", "Plaza de Legazpi 8", 40.392, -3.697, 1, 2, "bobo,famille", "Les anciens abattoirs devenus centre culturel : expositions, cinéma, théâtre et marchés.", "Combine avec une balade le long du parc Madrid Río.", 120],
  ["mad-hammam", "Hammam Al Ándalus", "activite", "Sol · Centro", "Calle de Atocha 14", 40.4135, -3.704, 2, 2, "romantique", "Des bains arabes sous des voûtes andalouses : bassins chaud, tiède et froid, massages.", "Réserve en soirée pour une parenthèse après les visites.", 120],
  ["mad-teleferico", "Teleférico de Madrid", "activite", "Palacio", "Paseo del Pintor Rosales", 40.426, -3.718, 1, 2, "famille", "Un téléphérique qui survole le parc de l'Ouest jusqu'à la Casa de Campo, avec Madrid en panorama.", "Prends l'aller-retour en fin d'après-midi.", 45],
];

export const BARCELONE_PLUS: Row[] = [
  // ---- Restos ----
  ["bcn-el-quim", "El Quim de la Boqueria", "resto", "El Raval", "Mercat de la Boqueria, La Rambla 91", 41.382, 2.1718, 2, 2, "tendance", "Un comptoir du marché où l'on mange des œufs au plat aux chipirons au milieu des étals.", "Viens tôt le matin et assieds-toi au comptoir.", 45],
  ["bcn-bar-del-pla", "Bar del Pla", "resto", "El Born", "Carrer de Montcada 2", 41.3842, 2.1806, 2, 2, "tendance", "Des tapas catalanes revisitées et des vins naturels, dans une salle chaleureuse.", "Goûte les croquettes et le tartare.", 75],
  ["bcn-la-pepita", "La Pepita", "resto", "Gràcia", "Carrer de Còrsega 343", 41.3988, 2.1592, 2, 2, "tendance", "Un bar à tapas aux murs couverts de dédicaces des clients, et ses fameuses pepitas.", "Les murs sont à toi : laisse un mot avant de partir.", 75],
  ["bcn-la-peninsular", "Bodega La Peninsular", "resto", "Barceloneta", "Carrer del Mar 29", 41.38, 2.1885, 1, 2, "petit-budget", "Une bodega de quartier pour des tapas simples et des bombas, loin de la foule du front de mer.", "Parfait avant ou après la plage.", 60],
  ["bcn-cerveceria-catalana", "Cervecería Catalana", "resto", "Eixample", "Carrer de Mallorca 236", 41.3925, 2.1615, 2, 1, "famille", "L'un des bars à tapas les plus populaires de l'Eixample, montaditos et fruits de mer.", "Il y a souvent la queue : inscris ton nom et va faire un tour.", 75],
  ["bcn-pinotxo", "Pinotxo Bar", "resto", "Sant Antoni", "Mercat de Sant Antoni", 41.379, 2.163, 2, 2, "tendance", "Le comptoir légendaire de la Boqueria, désormais au marché de Sant Antoni.", "Les pois chiches aux boudins sont la spécialité.", 45],
  ["bcn-teresa-carles", "Teresa Carles", "resto", "El Raval", "Carrer de Jovellanos 2", 41.385, 2.168, 2, 1, "famille", "La table végétarienne de référence de Barcelone, généreuse et créative.", "Le brunch du week-end est très demandé.", 75],
  // ---- Bars ----
  ["bcn-xampanyeria", "Can Paixano (La Xampanyeria)", "bar", "Barceloneta", "Carrer de la Reina Cristina 7", 41.382, 2.184, 1, 2, "petit-budget,insolite", "Une cave bondée où l'on boit du cava rosé à petit prix avec des petits sandwichs.", "Il faut jouer des coudes : c'est l'ambiance.", 45],
  ["bcn-two-schmucks", "Two Schmucks", "bar", "El Raval", "Carrer de Joaquín Costa 52", 41.383, 2.165, 2, 2, "tendance", "Un bar à cocktails déjanté régulièrement classé parmi les meilleurs du monde.", "Arrive tôt, le bar est petit.", 75],
  ["bcn-sips", "Sips", "bar", "Eixample", "Carrer de Muntaner 108", 41.3885, 2.1555, 3, 2, "romantique", "Un bar à cocktails qui a été élu meilleur bar du monde, aux créations très travaillées.", "Réserve si tu peux : il y a toujours du monde.", 75],
  ["bcn-bobby-gin", "Bobby Gin", "bar", "Gràcia", "Carrer de Francisco Giner 47", 41.4005, 2.1555, 2, 2, "tendance", "Un bar spécialisé dans le gin tonic, avec des dizaines de gins et de garnitures.", "Laisse le barman composer ton gin tonic.", 60],
  ["bcn-bosc-fades", "El Bosc de les Fades", "bar", "Barri Gòtic", "Passatge de la Banca 5", 41.3768, 2.177, 1, 2, "insolite,famille", "Un bar déguisé en forêt enchantée, arbres et fontaines compris, à côté du musée de cire.", "Un détour amusant en bas de la Rambla.", 30],
  // ---- Culture, insolite, café ----
  ["bcn-miro", "Fondation Joan Miró", "culture", "Montjuïc", "Parc de Montjuïc", 41.3685, 2.16, 2, 1, "famille", "Le musée lumineux dessiné pour Miró, avec terrasses et sculptures sur la colline.", "Le jardin de sculptures est accessible gratuitement.", 120],
  ["bcn-mnac", "MNAC et Palau Nacional", "culture", "Montjuïc", "Palau Nacional, Parc de Montjuïc", 41.3685, 2.1535, 2, 1, "famille", "Les fresques romanes catalanes et une vue magnifique depuis les marches du palais.", "Le toit-terrasse offre l'un des plus beaux panoramas de la ville.", 120],
  ["bcn-font-magica", "Fontaine magique de Montjuïc", "insolite", "Montjuïc", "Plaça de Carles Buïgas", 41.3713, 2.1517, 1, 1, "famille,romantique", "Un spectacle d'eau, de lumière et de musique en plein air, gratuit certains soirs.", "Vérifie les jours et horaires du spectacle avant d'y aller.", 45],
  ["bcn-cafe-opera", "Café de l'Òpera", "cafe", "Barri Gòtic", "La Rambla 74", 41.381, 2.1735, 1, 2, "romantique", "Un café Belle Époque face au Liceu, l'un des derniers témoins de la vieille Rambla.", "Commande un suís, chocolat chaud et chantilly.", 30],
  // ---- Activités ----
  ["bcn-cook-taste", "Cours de cuisine Cook and Taste", "activite", "Barri Gòtic", "Carrer del Paradís 3", 41.3832, 2.1772, 2, 2, "famille", "Un cours de cuisine catalane avec marché à la Boqueria, puis paella et sangria.", "Réserve le cours avec visite du marché.", 210],
  ["bcn-teleferic", "Téléphérique de Montjuïc", "activite", "Montjuïc", "Avinguda de Miramar 30", 41.3713, 2.1665, 2, 1, "famille", "Le téléphérique qui monte au château de Montjuïc, au-dessus du port.", "Continue à pied jusqu'au château pour la vue.", 45],
  ["bcn-aire", "AIRE Ancient Baths", "activite", "El Born", "Passeig de Picasso 22", 41.386, 2.184, 2, 2, "romantique", "Des bains thermaux dans un ancien entrepôt voûté, à la lueur des bougies.", "Réserve en couple en début de soirée.", 120],
];
