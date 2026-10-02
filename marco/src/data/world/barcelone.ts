import type { CityGuide } from "./types";

export const BARCELONE: CityGuide = {
  spots: [
    // ---- Restos ----
    ["bcn-cal-pep", "Cal Pep", "resto", "El Born", "Plaça de les Olles 8", 41.3836, 2.183, 3, 2, "tendance", "Un comptoir mythique où le chef choisit pour toi : fruits de mer, tortilla, friture du jour.", "Arrive avant l'ouverture et installe-toi au comptoir, c'est là que tout se passe.", 90, "https://www.calpep.com"],
    ["bcn-xampanyet", "El Xampanyet", "resto", "El Born", "Carrer de Montcada 22", 41.3847, 2.181, 1, 2, "petit-budget,tendance", "Une bodega carrelée de bleu où l'on boit le cava de la maison avec des anchois.", "Juste en face du musée Picasso : parfait en sortant de la visite.", 60],
    ["bcn-cova-fumada", "La Cova Fumada", "resto", "Barceloneta", "Carrer del Baluard 56", 41.3795, 2.1895, 1, 3, "cache,petit-budget", "La bodega sans enseigne où aurait été inventée la bomba, boulette de pomme de terre piquante.", "Pas d'enseigne : cherche la porte en bois et la file d'habitués, et viens le midi.", 60],
    ["bcn-can-sole", "Can Solé", "resto", "Barceloneta", "Carrer de Sant Carles 4", 41.379, 2.1885, 3, 2, "romantique", "Une maison de 1903 qui sert l'une des paellas les plus respectées de la ville.", "La paella se commande pour deux minimum : réserve et viens à deux.", 100],
    ["bcn-quimet", "Quimet & Quimet", "resto", "Poble-sec", "Carrer del Poeta Cabanyes 25", 41.374, 2.165, 2, 2, "cache,tendance", "Une minuscule cave tapissée de bouteilles où l'on mange des montaditos debout.", "Pas de chaises : viens tôt, l'endroit est minuscule et se remplit vite.", 60],
    ["bcn-boqueria", "Marché de la Boqueria", "resto", "El Raval", "La Rambla 91", 41.3817, 2.1716, 1, 1, "famille", "Le grand marché couvert de Barcelone et ses comptoirs où l'on déjeune au milieu des étals.", "Vas-y le matin et fuis les stands de l'entrée : les meilleurs comptoirs sont au fond.", 60],
    ["bcn-disfrutar", "Disfrutar", "resto", "Eixample", "Carrer de Villarroel 163", 41.3875, 2.153, 3, 1, "romantique", "La table créative tenue par trois anciens d'elBulli, régulièrement classée parmi les meilleures du monde.", "Réserve des mois à l'avance : les tables partent dès l'ouverture des réservations.", 180, "https://www.disfrutarbarcelona.com"],
    ["bcn-canete", "Bar Cañete", "resto", "El Raval", "Carrer de la Unió 17", 41.3791, 2.1738, 3, 2, "tendance", "Un long comptoir façon bistrot de luxe, tapas classiques parfaitement exécutées, près du Liceu.", "Prends la place au comptoir pour voir les cuisiniers travailler.", 90],
    // ---- Bars ----
    ["bcn-paradiso", "Paradiso", "bar", "El Born", "Carrer de Rera Palau 4", 41.3839, 2.1838, 2, 3, "cache,tendance", "On entre par la porte d'un frigo dans une petite boutique de pastrami : derrière, l'un des meilleurs bars du monde.", "La file commence avant l'ouverture : vas-y tôt en semaine.", 90],
    ["bcn-marsella", "Bar Marsella", "bar", "El Raval", "Carrer de Sant Pau 65", 41.3783, 2.1712, 1, 3, "cache,insolite,petit-budget", "Un bar de 1820 couvert de poussière et de légendes, où l'on boit l'absinthe à la fourchette.", "Commande une absinthe : on te donne une fourchette, du sucre et de l'eau, à toi de jouer.", 60],
    ["bcn-dry-martini", "Dry Martini", "bar", "Eixample", "Carrer d'Aribau 162", 41.395, 2.153, 3, 2, "romantique,jazz", "Un bar à l'anglaise qui compte ses martinis servis depuis l'ouverture sur un compteur.", "Laisse le barman choisir ton martini, c'est sa spécialité.", 60],
    ["bcn-calders", "Bar Calders", "bar", "Sant Antoni", "Carrer del Parlament 25", 41.3757, 2.1617, 1, 2, "bobo,petit-budget", "Le QG du vermouth dans le quartier le plus vivant du moment, terrasse sur une rue piétonne.", "L'heure du vermouth, c'est avant le déjeuner du week-end.", 60],
    // ---- Cafés ----
    ["bcn-quatre-gats", "Els Quatre Gats", "cafe", "Barri Gòtic", "Carrer de Montsió 3", 41.3856, 2.1739, 2, 2, "romantique", "Le café moderniste où le jeune Picasso a fait sa première exposition en 1900.", "Prends juste un café au bar pour profiter du décor sans le menu touristique.", 45],
    ["bcn-dulcinea", "Granja Dulcinea", "cafe", "Barri Gòtic", "Carrer de Petritxol 2", 41.3829, 2.1734, 1, 2, "famille,petit-budget", "Chocolat chaud épais et churros dans une granja de 1941, sur la ruelle des chocolatiers.", "La rue Petritxol est la rue du chocolat : compare avec la granja d'en face.", 30],
    // ---- Culture ----
    ["bcn-sagrada", "Sagrada Família", "culture", "Eixample", "Carrer de Mallorca 401", 41.4036, 2.1744, 2, 1, "famille", "La basilique de Gaudí, toujours en construction depuis 1882, et sa forêt de colonnes lumineuses.", "Réserve en ligne et choisis la fin d'après-midi : la lumière à travers les vitraux est incroyable.", 120, "https://sagradafamilia.org"],
    ["bcn-palau-musica", "Palau de la Música Catalana", "culture", "El Born", "Carrer del Palau de la Música 4-6", 41.3875, 2.1753, 2, 2, "romantique", "Une salle de concert moderniste coiffée d'une verrière en forme de soleil inversé.", "Plutôt qu'une visite, prends une place pour un concert : la salle s'apprécie en musique.", 90, "https://www.palaumusica.cat"],
    ["bcn-picasso", "Museu Picasso", "culture", "El Born", "Carrer de Montcada 15-23", 41.3852, 2.1809, 2, 1, "famille", "Les années de formation de Picasso, dans cinq palais médiévaux de la rue Montcada.", "L'entrée est gratuite certains créneaux : regarde le site avant de réserver.", 120, "https://museupicasso.bcn.cat"],
    ["bcn-casa-batllo", "Casa Batlló", "culture", "Eixample", "Passeig de Gràcia 43", 41.3917, 2.1649, 3, 1, "famille", "La maison-dragon de Gaudí, toute en courbes, en os et en écailles.", "Vas-y à l'ouverture pour éviter la foule dans l'escalier central.", 75],
    ["bcn-sant-pau", "Recinte Modernista de Sant Pau", "culture", "Eixample", "Carrer de Sant Antoni Maria Claret 167", 41.4114, 2.1745, 2, 3, "cache,romantique", "Un ancien hôpital moderniste aux pavillons couverts de mosaïques, bien moins bondé que les œuvres de Gaudí.", "Remonte ensuite l'avenue Gaudí à pied jusqu'à la Sagrada Família.", 90],
    // ---- Nature ----
    ["bcn-park-guell", "Park Güell", "nature", "Gràcia", "Carrer d'Olot", 41.4145, 2.1527, 2, 1, "famille,romantique", "Le parc de Gaudí, son banc ondulant en mosaïque et sa vue sur toute la ville.", "La zone monumentale se réserve à heure fixe ; le reste du parc est gratuit.", 90, "https://parkguell.barcelona"],
    ["bcn-bunkers", "Bunkers del Carmel", "nature", "Gràcia", "Carrer de Marià Labèrnia", 41.4194, 2.1619, 1, 3, "cache,romantique,petit-budget", "Les anciennes batteries antiaériennes de la guerre civile, devenues le meilleur panorama de Barcelone.", "Monte avec un pique-nique pour le coucher du soleil, et redescends avant la nuit noire.", 90],
    ["bcn-barceloneta", "Plage de la Barceloneta", "nature", "Barceloneta", "Passeig Marítim de la Barceloneta", 41.3784, 2.1925, 1, 1, "famille,petit-budget", "La plage du centre-ville, à quinze minutes à pied de la cathédrale.", "Marche vers le nord : plus tu t'éloignes du port, plus la plage est calme.", 120],
    // ---- Insolite ----
    ["bcn-sant-felip-neri", "Plaça de Sant Felip Neri", "insolite", "Barri Gòtic", "Plaça de Sant Felip Neri", 41.3836, 2.1752, 1, 3, "cache,romantique", "Une placette silencieuse dont la façade d'église porte encore les impacts du bombardement de 1938.", "Viens tôt le matin : c'est l'endroit le plus paisible de la vieille ville.", 20],
    ["bcn-born-ccm", "El Born Centre de Cultura i Memòria", "insolite", "El Born", "Plaça Comercial 12", 41.3857, 2.1838, 1, 2, "cache,famille", "Sous la charpente d'un ancien marché, les rues de la ville détruite après le siège de 1714.", "Les ruines se voient depuis les passerelles, gratuitement.", 45],
    // ---- Activités ----
    ["bcn-picornell", "Piscines Bernat Picornell", "activite", "Montjuïc", "Avinguda de l'Estadi 30-38", 41.3645, 2.153, 1, 3, "cache,famille,petit-budget", "Nager dans le bassin olympique des Jeux de 1992, en plein air sur la colline de Montjuïc.", "L'été, des séances de cinéma sont organisées au bord du bassin.", 90],
    ["bcn-tablao-cordobes", "Tablao Cordobés", "activite", "Barri Gòtic", "La Rambla 35", 41.3777, 2.1755, 2, 1, "romantique", "Un tablao flamenco de référence, dans une salle à la décoration andalouse.", "Réserve le spectacle seul, le dîner n'est pas obligatoire.", 75],
    ["bcn-camp-nou", "Visite du Camp Nou", "activite", "Les Corts", "Carrer d'Arístides Maillol 12", 41.3809, 2.1228, 2, 1, "famille", "Le musée et le stade du FC Barcelone, le plus grand stade d'Europe.", "Vérifie l'état des travaux de rénovation avant d'y aller : le parcours change régulièrement.", 90],
    // ---- Hôtels ----
    ["bcn-generator", "Generator Barcelona", "hotel", "Gràcia", "Carrer de Còrsega 373", 41.3995, 2.159, 1, 1, "petit-budget,tendance", "Une auberge design avec chambres privées, entre Gràcia et le Passeig de Gràcia.", "Les chambres privées avec terrasse partent vite.", 0, "https://staygenerator.com", 0],
    ["bcn-brummell", "Hotel Brummell", "hotel", "Poble-sec", "Carrer Nou de la Rambla 174", 41.3735, 2.164, 2, 2, "bobo", "Un petit hôtel lumineux avec piscine et cours de yoga, dans le quartier des bars à tapas.", "Parfait pour vivre Barcelone comme un local, au pied de Montjuïc.", 0, "", 3],
    ["bcn-casa-bonay", "Casa Bonay", "hotel", "Eixample", "Gran Via de les Corts Catalanes 700", 41.3935, 2.1736, 2, 2, "tendance,bobo", "Un hôtel installé dans un immeuble de 1869, cafés et rooftop très fréquentés.", "Le rooftop est un excellent endroit pour l'apéritif.", 0, "https://www.casabonay.com", 4],
    ["bcn-casa-fuster", "Hotel Casa Fuster", "hotel", "Gràcia", "Passeig de Gràcia 132", 41.398, 2.1575, 3, 2, "romantique,jazz", "Un palais moderniste avec un café-jazz réputé au rez-de-chaussée.", "Les concerts de jazz du Café Vienés valent le détour.", 0, "", 5],
    ["bcn-hotel-arts", "Hotel Arts Barcelona", "hotel", "Poblenou", "Carrer de la Marina 19-21", 41.3866, 2.1965, 3, 1, "romantique,famille", "Une tour face à la mer, piscine au pied de la plage et vue sur toute la côte.", "Demande un étage élevé côté mer.", 0, "", 5],
  ],
  streets: [
    {
      id: "bcn-rambla", name: "La Rambla", aliases: ["Les Rambles", "Las Ramblas", "Rambla"], arrondissement: "Ciutat Vella", lat: 41.3809, lng: 2.1735,
      histoire: "Son nom vient de l'arabe « ramla », le lit de sable d'un torrent. La Rambla était un ruisseau qui longeait la muraille médiévale ; une fois couvert, il est devenu la grande promenade de la ville, bordée de couvents puis de théâtres et de marchés.",
      fait: { annee: "1847", texte: "Inauguration du Gran Teatre del Liceu sur la Rambla, l'un des plus grands opéras d'Europe, plusieurs fois détruit et reconstruit depuis." },
      anecdote: "Celui qui boit à la fontaine de Canaletes, en haut de la Rambla, reviendra forcément à Barcelone. Les supporters du Barça s'y rassemblent après chaque victoire : la fontaine a donc beaucoup de travail.",
      aVoir: ["bcn-boqueria", "bcn-canete"],
    },
    {
      id: "bcn-montcada", name: "Carrer de Montcada", aliases: ["Montcada", "Carrer Montcada"], arrondissement: "El Born", lat: 41.3848, lng: 2.1812,
      histoire: "Ouverte au Moyen Âge et nommée d'après la puissante famille Montcada, c'était la rue des riches marchands de la Barcelone maritime : leurs palais gothiques à cour intérieure s'y succèdent encore.",
      fait: { annee: "1963", texte: "Le musée Picasso ouvre dans le palais Aguilar ; il s'étend depuis sur cinq palais médiévaux de la rue." },
      anecdote: "En face des palais où l'on admire Picasso, le Xampanyet sert du cava à prix modeste depuis des décennies. Les marchands médiévaux auraient approuvé : on fait des affaires et on trinque dans la même rue.",
      aVoir: ["bcn-picasso", "bcn-xampanyet"],
    },
    {
      id: "bcn-passeig-gracia", name: "Passeig de Gràcia", aliases: ["Paseo de Gracia", "Passeig de Gracia"], arrondissement: "Eixample", lat: 41.3917, lng: 2.1649,
      histoire: "C'était une route de campagne entre Barcelone et le village de Gràcia. Après la démolition des murailles et le plan d'extension de Cerdà, elle devient le boulevard chic de la bourgeoisie, qui rivalise de façades modernistes.",
      fait: { annee: "1906", texte: "Gaudí termine la transformation de la Casa Batlló, voisine de la Casa Amatller et de la Casa Lleó Morera : trois chefs-d'œuvre côte à côte." },
      anecdote: "Ce pâté de maisons s'appelle la « Manzana de la Discordia ». En espagnol, « manzana » veut dire à la fois « pâté de maisons » et « pomme » : une pomme de la discorde où trois architectes se disputaient la plus belle façade.",
      aVoir: ["bcn-casa-batllo", "bcn-casa-fuster"],
    },
    {
      id: "bcn-bisbe", name: "Carrer del Bisbe", aliases: ["Pont del Bisbe", "Bisbe"], arrondissement: "Barri Gòtic", lat: 41.3834, lng: 2.1765,
      histoire: "La « rue de l'Évêque » relie la cathédrale à la place Sant Jaume, cœur politique de la ville depuis l'époque romaine. Elle est enjambée par un pont gothique qui relie le palais de la Généralité à la maison des chanoines.",
      fait: { annee: "1928", texte: "Le célèbre pont néogothique est construit par l'architecte Joan Rubió… il n'a donc rien de médiéval." },
      anecdote: "Une légende dit qu'un crâne transpercé d'un poignard est caché sous le pont, et que celui qui le retirerait détruirait Barcelone. Les touristes photographient le pont « médiéval » sans se douter qu'il a moins de cent ans.",
      aVoir: ["bcn-sant-felip-neri", "bcn-quatre-gats"],
    },
  ],
  nights: [
    { district: "El Born", vibe: "Ruelles médiévales, bars à cocktails parmi les meilleurs du monde et petits bars à vin.", venues: [
      { name: "Paradiso", address: "Carrer de Rera Palau 4", kind: "Cocktails", tip: "La porte du frigo cache le bar." },
      { name: "El Xampanyet", address: "Carrer de Montcada 22", kind: "Bodega", tip: "Cava et anchois pour commencer." },
      { name: "Rubí Bar", address: "Carrer dels Banys Vells 6", kind: "Gin tonic", tip: "Petit bar chaleureux aux gins maison." },
    ] },
    { district: "El Raval", vibe: "Le quartier canaille : bars centenaires, absinthe et petits clubs.", venues: [
      { name: "Bar Marsella", address: "Carrer de Sant Pau 65", kind: "Absinthe", tip: "Depuis 1820, rien n'a bougé." },
      { name: "Boadas", address: "Carrer dels Tallers 1", kind: "Cocktails", tip: "Le plus vieux bar à cocktails de la ville, depuis 1933." },
      { name: "Moog", address: "Carrer de l'Arc del Teatre 3", kind: "Club électro", tip: "Un petit club techno qui tourne jusqu'au matin." },
    ] },
    { district: "Poble-sec", vibe: "Pintxos sur la calle Blai, puis concerts et clubs dans une salle de bal des années 1940.", venues: [
      { name: "Carrer de Blai", address: "Carrer de Blai", kind: "Pintxos", tip: "Rue piétonne de bars à pintxos à petit prix." },
      { name: "Sala Apolo", address: "Carrer Nou de la Rambla 113", kind: "Club et concerts", tip: "Une ancienne salle de bal devenue lieu culte." },
    ] },
    { district: "Gràcia", vibe: "L'esprit village : soirées en terrasse sur les places jusqu'à tard.", venues: [
      { name: "Plaça del Sol", address: "Plaça del Sol", kind: "Terrasses", tip: "La place des soirées étudiantes." },
      { name: "Plaça de la Virreina", address: "Plaça de la Virreina", kind: "Terrasses", tip: "Plus calme, plus familiale." },
    ] },
    { district: "Poblenou", vibe: "Anciennes usines devenues clubs géants, à deux pas de la plage.", venues: [
      { name: "Razzmatazz", address: "Carrer dels Almogàvers 122", kind: "Club", tip: "Cinq salles, du rock à la techno." },
    ] },
  ],
  diet: [
    { diet: "halal", name: "El Raval", streets: "Carrer de Sant Pau, carrer de l'Hospital, Rambla del Raval", text: "Restaurants pakistanais, marocains et syriens, boucheries halal à chaque rue." },
    { diet: "casher", name: "Sant Gervasi (autour de la synagogue)", streets: "Carrer de l'Avenir", text: "Peu d'adresses : la communauté juive de Barcelone est centrée autour de la synagogue de la rue Avenir, où l'on peut se renseigner sur les repas casher." },
  ],
};
