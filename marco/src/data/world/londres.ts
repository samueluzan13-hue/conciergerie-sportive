import type { CityGuide } from "./types";

export const LONDRES: CityGuide = {
  spots: [
    // ---- Restos ----
    ["lon-dishoom", "Dishoom Covent Garden", "resto", "Covent Garden", "12 Upper St Martin's Lane", 51.5124, -0.1269, 2, 1, "tendance,famille", "L'hommage aux vieux cafés iraniens de Bombay : naan au bacon le matin, black dal le soir.", "Le petit-déjeuner se réserve et évite la longue file du soir.", 75, "https://www.dishoom.com"],
    ["lon-st-john", "St. JOHN", "resto", "La City", "26 St John Street", 51.5205, -0.1015, 3, 2, "bobo", "Le temple de la cuisine anglaise « du museau à la queue » dans un ancien fumoir à jambons.", "Termine par les madeleines sorties du four, elles se commandent au début du repas.", 100, "https://stjohnrestaurant.com"],
    ["lon-rules", "Rules", "resto", "Covent Garden", "35 Maiden Lane", 51.5106, -0.1232, 3, 1, "romantique", "Le plus vieux restaurant de Londres, ouvert en 1798 : gibier, tourtes et décor victorien.", "Le bar de l'étage est une jolie façon de voir le décor sans dîner.", 100, "https://rules.co.uk"],
    ["lon-borough-market", "Borough Market", "resto", "Borough · Bermondsey", "8 Southwark Street", 51.5055, -0.091, 1, 1, "famille,petit-budget", "Le grand marché gourmand de Londres, sous les voûtes ferroviaires, depuis plus de mille ans.", "Évite le samedi midi ; le jeudi ou le vendredi matin, on y circule enfin.", 60, "https://boroughmarket.org.uk"],
    ["lon-padella", "Padella", "resto", "Borough · Bermondsey", "6 Southwark Street", 51.5054, -0.0905, 1, 2, "petit-budget,tendance", "Des pâtes fraîches faites sous tes yeux, à prix doux, juste à côté de Borough Market.", "Pas de réservation : inscris-toi sur la liste d'attente en ligne et va boire un verre en attendant.", 60],
    ["lon-beigel-bake", "Beigel Bake", "resto", "Shoreditch", "159 Brick Lane", 51.5245, -0.0717, 1, 2, "petit-budget,insolite", "Ouvert jour et nuit : bagels au corned-beef tranché à la main, pour quelques livres.", "À 3 h du matin, la file mélange fêtards, taxis et chauffeurs de bus : c'est tout Londres.", 20],
    ["lon-kiln", "Kiln", "resto", "Soho", "58 Brewer Street", 51.5115, -0.1356, 2, 2, "tendance", "Une cuisine thaïe du nord grillée au feu de bois, au comptoir face aux flammes.", "Prends les places au comptoir du rez-de-chaussée, en face du grill.", 75],
    ["lon-bao", "Bao Soho", "resto", "Soho", "53 Lexington Street", 51.513, -0.136, 1, 2, "tendance,petit-budget", "Des petits pains taïwanais vapeur garnis, dans un comptoir minimaliste.", "Le bao classique au porc est la commande à ne pas rater.", 45],
    // ---- Bars ----
    ["lon-churchill-arms", "The Churchill Arms", "bar", "Kensington", "119 Kensington Church Street", 51.5069, -0.1946, 1, 1, "petit-budget", "Un pub couvert de fleurs du sol au toit, avec une cuisine thaïe cachée au fond.", "Le pad thaï du pub est une institution du quartier.", 60],
    ["lon-cheshire-cheese", "Ye Olde Cheshire Cheese", "bar", "La City", "145 Fleet Street", 51.5145, -0.1078, 1, 2, "cache,petit-budget", "Un pub reconstruit après le grand incendie de 1666, labyrinthe de salles sombres où buvait Dickens.", "Descends dans les caves voûtées : ce sont les plus vieilles salles.", 60],
    ["lon-nightjar", "Nightjar", "bar", "Shoreditch", "129 City Road", 51.5265, -0.088, 2, 3, "cache,jazz", "Un speakeasy en sous-sol, cocktails spectaculaires et musique live jazz et swing.", "La porte est anonyme : réserve, c'est presque toujours plein.", 90],
    ["lon-connaught", "The Connaught Bar", "bar", "Mayfair", "Carlos Place", 51.51, -0.15, 3, 2, "romantique", "L'un des bars les plus primés au monde : le martini est préparé sur un chariot à ta table.", "Laisse-toi conseiller une des teintures maison pour ton martini.", 60],
    ["lon-lamb-flag", "The Lamb & Flag", "bar", "Covent Garden", "33 Rose Street", 51.5116, -0.126, 1, 2, "cache,petit-budget", "L'un des plus vieux pubs de Covent Garden, au fond d'une ruelle pavée.", "Le soir, les habitués boivent dehors dans la ruelle, été comme hiver.", 60],
    // ---- Cafés ----
    ["lon-monmouth", "Monmouth Coffee", "cafe", "Borough · Bermondsey", "2 Park Street", 51.5053, -0.0907, 1, 1, "bobo", "Le café qui a lancé le café de spécialité à Londres, au bord de Borough Market.", "Prends ton flat white et un morceau de pain beurré au comptoir.", 20],
    ["lon-maison-bertaux", "Maison Bertaux", "cafe", "Soho", "28 Greek Street", 51.5137, -0.131, 1, 2, "romantique", "Une pâtisserie française fondée en 1871, la plus vieille de Londres, toute de guingois.", "Prends un éclair et un thé à l'étage, le décor est délicieusement fouillis.", 30],
    // ---- Culture ----
    ["lon-british-museum", "British Museum", "culture", "Covent Garden", "Great Russell Street", 51.5194, -0.127, 1, 1, "famille,petit-budget", "La pierre de Rosette, les momies, les frises du Parthénon : gratuit, comme la plupart des musées de Londres.", "Va voir les momies tôt le matin, et finis dans la Great Court sous la verrière.", 180, "https://www.britishmuseum.org"],
    ["lon-soane", "Sir John Soane's Museum", "culture", "Covent Garden", "13 Lincoln's Inn Fields", 51.517, -0.1175, 1, 3, "cache,insolite", "La maison d'un architecte collectionneur, bourrée de sculptures, de miroirs et de tableaux qui se déplient.", "Gratuit : demande au gardien d'ouvrir les panneaux de la salle des tableaux.", 60],
    ["lon-tate-modern", "Tate Modern", "culture", "South Bank", "Bankside", 51.5076, -0.0994, 1, 1, "famille,bobo", "Une ancienne centrale électrique devenue musée d'art moderne, gratuit et immense.", "Monte au dernier étage de la tour Blavatnik : la vue sur Saint-Paul est gratuite.", 120, "https://www.tate.org.uk"],
    ["lon-national-gallery", "National Gallery", "culture", "Covent Garden", "Trafalgar Square", 51.5089, -0.1283, 1, 1, "famille", "Van Gogh, Turner, Vermeer et des siècles de peinture européenne, gratuitement.", "Entre par la Sainsbury Wing pour commencer par les primitifs italiens.", 120],
    ["lon-dennis-severs", "Dennis Severs' House", "culture", "Shoreditch", "18 Folgate Street", 51.5203, -0.0767, 2, 3, "cache,insolite", "Une maison de 1724 mise en scène comme si ses habitants venaient de sortir de la pièce, à la bougie.", "La visite se fait en silence : laisse-toi porter par l'ambiance.", 60],
    // ---- Nature ----
    ["lon-primrose-hill", "Regent's Park et Primrose Hill", "nature", "Camden", "Primrose Hill Road", 51.539, -0.1606, 1, 2, "romantique,famille,petit-budget", "Une colline au nord de Regent's Park d'où l'on voit tout Londres.", "Viens au coucher du soleil avec de quoi pique-niquer.", 90],
    ["lon-hyde-park", "Hyde Park et la Serpentine", "nature", "Mayfair", "Hyde Park", 51.5073, -0.1657, 1, 1, "famille,petit-budget", "Le grand parc royal : barques sur la Serpentine et galerie d'art gratuite au bord de l'eau.", "Loue une barque ou un pédalo l'été.", 120],
    ["lon-kyoto-garden", "Kyoto Garden (Holland Park)", "nature", "Kensington", "Holland Park", 51.5028, -0.203, 1, 3, "cache,romantique", "Un jardin japonais caché dans Holland Park, avec cascade, carpes et paons en liberté.", "Viens en semaine le matin, c'est presque désert.", 45],
    // ---- Insolite ----
    ["lon-leadenhall", "Leadenhall Market", "insolite", "La City", "Gracechurch Street", 51.5128, -0.0835, 1, 2, "cache", "Un marché couvert victorien aux couleurs vives, qui a servi de décor au Chemin de Traverse.", "En semaine à midi, les traders de la City y boivent une pinte debout.", 30],
    ["lon-postmans-park", "Postman's Park", "insolite", "La City", "King Edward Street", 51.5168, -0.0975, 1, 3, "cache", "Un petit jardin où un mur de céramiques rend hommage à des héros anonymes morts en sauvant quelqu'un.", "Lis quelques plaques : chacune raconte une histoire vraie et bouleversante.", 20],
    ["lon-little-venice", "Little Venice", "insolite", "Marylebone", "Blomfield Road", 51.5225, -0.183, 1, 2, "romantique", "Des péniches colorées amarrées sur le canal, et un théâtre de marionnettes flottant.", "Suis le canal à pied jusqu'à Camden : une heure de balade au fil de l'eau.", 90],
    // ---- Activités ----
    ["lon-globe", "Shakespeare's Globe", "activite", "South Bank", "21 New Globe Walk", 51.5081, -0.0972, 2, 1, "famille,romantique", "Le théâtre de Shakespeare reconstruit à l'identique : on peut voir une pièce debout pour quelques livres.", "Les places debout devant la scène sont les moins chères et les plus vivantes.", 180, "https://www.shakespearesglobe.com"],
    ["lon-columbia-road", "Columbia Road Flower Market", "activite", "Shoreditch", "Columbia Road", 51.5293, -0.0697, 1, 2, "romantique,petit-budget", "Le dimanche matin, une rue entière se couvre de fleurs et de crieurs.", "Vers 14 h, les vendeurs bradent les derniers bouquets.", 60],
    ["lon-thames-clippers", "Bateau sur la Tamise (Uber Boat)", "activite", "South Bank", "Westminster Pier", 51.5016, -0.1234, 1, 1, "famille,petit-budget", "Le bateau-bus de Londres : la Tamise et ses monuments au prix d'un ticket de transport.", "Monte sur le pont extérieur entre Westminster et Tower Bridge.", 45],
    // ---- Hôtels ----
    ["lon-generator", "Generator London", "hotel", "Covent Garden", "37 Tavistock Place", 51.526, -0.124, 1, 1, "petit-budget,tendance", "Une auberge design dans une ancienne caserne de police, avec chambres privées.", "Le bar est animé tous les soirs.", 0, "https://staygenerator.com", 0],
    ["lon-hoxton-shoreditch", "The Hoxton Shoreditch", "hotel", "Shoreditch", "81 Great Eastern Street", 51.5262, -0.082, 2, 1, "tendance,bobo", "L'hôtel qui a lancé la vague des hôtels de quartier, au cœur de Shoreditch.", "Les chambres « Shoebox » sont les moins chères.", 0, "https://thehoxton.com", 4],
    ["lon-citizenm-tower", "citizenM Tower of London", "hotel", "La City", "40 Trinity Square", 51.5099, -0.0773, 2, 1, "tendance", "Des chambres compactes et malines face à la Tour de Londres, avec rooftop.", "Le rooftop donne directement sur Tower Bridge.", 0, "https://www.citizenm.com", 4],
    ["lon-zetter-townhouse", "The Zetter Townhouse Clerkenwell", "hotel", "La City", "49-50 St John's Square", 51.5225, -0.1028, 2, 3, "cache,romantique", "Une maison georgienne décorée comme chez une grand-tante excentrique, avec un bar à cocktails réputé.", "Le salon-bar vaut un cocktail même si tu ne dors pas sur place.", 0, "", 4],
    ["lon-savoy", "The Savoy", "hotel", "Covent Garden", "Strand", 51.5102, -0.1203, 3, 1, "romantique", "Le palace Art déco du Strand, et son American Bar mythique.", "Prends un cocktail à l'American Bar pour goûter au Savoy sans y dormir.", 0, "", 5],
    ["lon-claridges", "Claridge's", "hotel", "Mayfair", "Brook Street", 51.5126, -0.1477, 3, 1, "romantique", "Le grand hôtel Art déco de Mayfair, réputé pour son afternoon tea.", "L'afternoon tea se réserve très en avance.", 0, "https://www.claridges.co.uk", 5],
  ],
  streets: [
    {
      id: "lon-fleet-street", name: "Fleet Street", aliases: ["Fleet St"], arrondissement: "La City", lat: 51.5142, lng: -0.1068,
      histoire: "Elle doit son nom à la Fleet, une rivière aujourd'hui enterrée qui coule toujours sous la rue jusqu'à la Tamise. Pendant près de trois siècles, c'était la rue de la presse britannique, au point que « Fleet Street » désigne encore les journaux.",
      fait: { annee: "1702", texte: "Le Daily Courant, premier quotidien britannique, est publié près de Fleet Street. Les grands journaux y restent jusqu'à leur départ vers les Docklands dans les années 1980." },
      anecdote: "Au pub Ye Olde Cheshire Cheese vivait Polly, un perroquet célèbre pour ses jurons. À sa mort en 1926, des journaux du monde entier publièrent sa nécrologie : la presse savait honorer ses voisins.",
      aVoir: ["lon-cheshire-cheese", "lon-st-john"],
    },
    {
      id: "lon-carnaby-street", name: "Carnaby Street", aliases: ["Carnaby"], arrondissement: "Soho", lat: 51.5129, lng: -0.1389,
      histoire: "Nommée d'après une maison du XVIIe siècle, Karnaby House, cette petite rue de Soho est devenue dans les années 1960 l'épicentre de la mode mod et du Swinging London.",
      fait: { annee: "1966", texte: "Le magazine Time consacre sa une au « Swinging London » : Carnaby Street devient une destination mondiale de la mode jeune." },
      anecdote: "Tout a commencé avec John Stephen, un jeune tailleur écossais qui ouvre sa boutique en 1958. Il finira par posséder une quinzaine de boutiques dans la même rue et sera surnommé « le roi de Carnaby Street ».",
      aVoir: ["lon-kiln", "lon-bao"],
    },
    {
      id: "lon-portobello", name: "Portobello Road", aliases: ["Portobello"], arrondissement: "Notting Hill", lat: 51.5155, lng: -0.2053,
      histoire: "La rue doit son nom à une ferme baptisée en l'honneur de la prise de Porto Bello, au Panama, par l'amiral Vernon. Chemin de campagne devenu rue de marché au XIXe siècle, elle accueille aujourd'hui le plus célèbre marché aux antiquités de Londres.",
      fait: { annee: "1739", texte: "L'amiral Vernon s'empare de Porto Bello : la victoire est si populaire que des rues, des fermes et même un quartier d'Édimbourg prennent son nom." },
      anecdote: "La librairie de voyage du film « Coup de foudre à Notting Hill » était au 142 Portobello Road. Elle n'a jamais existé sous cette forme, mais les fans font toujours la queue pour la photo devant une boutique de souvenirs.",
      aVoir: ["lon-churchill-arms"],
    },
    {
      id: "lon-brick-lane", name: "Brick Lane", aliases: ["Brick Ln"], arrondissement: "Shoreditch", lat: 51.5215, lng: -0.0717,
      histoire: "Le nom vient des fabriques de briques et de tuiles installées ici au XVe siècle. La rue a accueilli successivement les huguenots français, les juifs d'Europe de l'Est puis la communauté bangladaise.",
      fait: { annee: "1743", texte: "Construction d'une chapelle huguenote au coin de Fournier Street. Elle deviendra une chapelle méthodiste, puis une synagogue en 1898, et enfin une mosquée en 1976." },
      anecdote: "Le même bâtiment a donc servi trois religions en deux siècles, sans changer de murs. Sur sa façade, un cadran solaire porte une devise latine : « Umbra sumus », nous sommes des ombres.",
      aVoir: ["lon-beigel-bake", "lon-dennis-severs"],
    },
  ],
  nights: [
    { district: "Soho", vibe: "Jazz, pubs centenaires et bars à cocktails au cœur de Londres.", venues: [
      { name: "Ronnie Scott's", address: "47 Frith Street", kind: "Jazz", tip: "Le club de jazz légendaire, depuis 1959." },
      { name: "Bar Termini", address: "7 Old Compton Street", kind: "Cocktails", tip: "Un bar italien minuscule, negronis parfaits." },
      { name: "The French House", address: "49 Dean Street", kind: "Pub", tip: "La bière ne s'y sert qu'en demi-pinte, par tradition." },
    ] },
    { district: "Shoreditch", vibe: "Le quartier créatif : speakeasies, clubs et rooftops.", venues: [
      { name: "Nightjar", address: "129 City Road", kind: "Cocktails et jazz", tip: "Réserve, c'est toujours plein." },
      { name: "Callooh Callay", address: "65 Rivington Street", kind: "Cocktails", tip: "Le bar secret est derrière l'armoire." },
      { name: "XOYO", address: "32-37 Cowper Street", kind: "Club", tip: "Les résidences de DJ durent des mois." },
    ] },
    { district: "Camden", vibe: "Rock, concerts et pubs de musiciens.", venues: [
      { name: "Jazz Café", address: "5 Parkway", kind: "Concerts", tip: "Soul, funk et jazz, avec balcon pour dîner." },
      { name: "KOKO", address: "1a Camden High Street", kind: "Salle de concert", tip: "Un théâtre de 1900 devenu salle mythique." },
      { name: "The Hawley Arms", address: "2 Castlehaven Road", kind: "Pub", tip: "Le pub préféré d'Amy Winehouse." },
    ] },
    { district: "Brixton", vibe: "Sud de Londres : sound systems, salles géantes et cuisine caribéenne.", venues: [
      { name: "O2 Academy Brixton", address: "211 Stockwell Road", kind: "Concerts", tip: "Un ancien cinéma Art déco, l'une des salles les plus aimées de Londres." },
    ] },
  ],
  diet: [
    { diet: "casher", name: "Golders Green", streets: "Golders Green Road", text: "Le quartier juif du nord de Londres : restaurants, boulangeries et épiceries casher sous certification de la United Synagogue ou de Kedassia." },
    { diet: "casher", name: "Stamford Hill", streets: "Stamford Hill, Dunsmure Road", text: "Une grande communauté hassidique : boulangeries et épiceries casher très strictes." },
    { diet: "halal", name: "Whitechapel et Brick Lane", streets: "Whitechapel Road, Brick Lane", text: "Le cœur bangladais de Londres : currys, grillades et sucreries halal." },
    { diet: "halal", name: "Edgware Road", streets: "Edgware Road", text: "Le « petit Beyrouth » de Londres : restaurants libanais, chichas et grillades halal jusqu'à tard." },
  ],
};
