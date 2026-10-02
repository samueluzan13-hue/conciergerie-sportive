import type { CityGuide } from "./types";

export const ROME: CityGuide = {
  spots: [
    // ---- Restos ----
    ["rom-da-enzo", "Da Enzo al 29", "resto", "Trastevere", "Via dei Vascellari 29", 41.8872, 12.4772, 2, 2, "tendance", "Une trattoria minuscule du Trastevere : carbonara, artichauts à la juive et tiramisu maison.", "Pas de réservation pour toutes les tables : arrive à l'ouverture.", 75],
    ["rom-roscioli", "Roscioli Salumeria con Cucina", "resto", "Campo de' Fiori", "Via dei Giubbonari 21", 41.8935, 12.474, 3, 1, "romantique", "Une épicerie fine devenue table culte : charcuteries, burrata et une carbonara de référence.", "Réserve une table dans la cave, au milieu des bouteilles.", 90, "https://www.salumeriaroscioli.com"],
    ["rom-da-remo", "Pizzeria da Remo", "resto", "Testaccio", "Piazza di Santa Maria Liberatrice 44", 41.878, 12.476, 1, 2, "petit-budget,famille", "La pizza romaine fine et craquante, cuite au feu de bois, dans un brouhaha joyeux.", "On remplit soi-même le bon de commande : commence par des supplì.", 60],
    ["rom-armando", "Armando al Pantheon", "resto", "Centro Storico", "Salita dei Crescenzi 31", 41.8995, 12.476, 2, 1, "romantique", "Une trattoria familiale depuis 1961, à quelques mètres du Panthéon, fidèle aux classiques romains.", "Réserve plusieurs jours avant : les habitués sont nombreux.", 90, "https://www.armandoalpantheon.it"],
    ["rom-supplizio", "Supplizio", "resto", "Centro Storico", "Via dei Banchi Vecchi 143", 41.8985, 12.468, 1, 2, "petit-budget", "Le temple du supplì, croquette de riz fourrée à la mozzarella qui file.", "Prends le classique, puis un à la carbonara pour comparer.", 20],
    ["rom-baghetto", "Ba'Ghetto", "resto", "Ghetto", "Via del Portico d'Ottavia 57", 41.8925, 12.478, 2, 1, "famille", "La cuisine judéo-romaine dans le Ghetto : artichauts à la juive, fleurs de courgette, viandes grillées.", "Commande les carciofi alla giudia, frits deux fois jusqu'à être croustillants.", 90, "https://www.baghetto.com", undefined, "casher"],
    ["rom-mercato-testaccio", "Mercato di Testaccio", "resto", "Testaccio", "Via Aldo Manuzio", 41.8765, 12.4745, 1, 2, "petit-budget,famille", "Le marché couvert d'un quartier populaire, avec des comptoirs de street food romaine.", "Viens le matin en semaine, quand les Romains font leurs courses.", 60],
    ["rom-trapizzino", "Trapizzino", "resto", "Testaccio", "Via Giovanni Branca 88", 41.879, 12.4735, 1, 2, "petit-budget", "Le sandwich triangulaire inventé ici : de la pâte à pizza garnie de plats mijotés romains.", "Le pollo alla cacciatora est le parfum signature.", 20],
    // ---- Bars ----
    ["rom-bar-del-fico", "Bar del Fico", "bar", "Centro Storico", "Piazza del Fico 26", 41.9003, 12.4706, 2, 1, "tendance", "L'apéritif à la romaine sous le grand figuier, à deux pas de la Piazza Navona.", "Le soir, des Romains jouent aux échecs sous l'arbre.", 60],
    ["rom-freni-frizioni", "Freni e Frizioni", "bar", "Trastevere", "Via del Politeama 4", 41.89, 12.47, 1, 2, "bobo,petit-budget", "Un ancien garage devenu bar, avec un apéritif à buffet très généreux.", "L'aperitivo commence vers 19 h : le buffet est compris avec le verre.", 75],
    ["rom-jerry-thomas", "Jerry Thomas Speakeasy", "bar", "Centro Storico", "Vicolo Cellini 30", 41.8978, 12.4687, 2, 3, "cache,jazz", "Un speakeasy façon prohibition, avec mot de passe et cocktails d'époque.", "Le mot de passe se trouve en réservant : regarde leur site.", 90],
    ["rom-goccetto", "Il Goccetto", "bar", "Centro Storico", "Via dei Banchi Vecchi 14", 41.8982, 12.468, 2, 3, "cache,romantique", "Une enoteca de quartier au plafond peint, plus de 800 vins et des fromages.", "Demande au patron de te faire goûter un vin du Latium.", 60],
    // ---- Cafés ----
    ["rom-sant-eustachio", "Sant'Eustachio Il Caffè", "cafe", "Centro Storico", "Piazza di Sant'Eustachio 82", 41.8981, 12.475, 1, 1, "petit-budget", "Un expresso mousseux préparé à l'abri des regards, avec une recette secrète depuis 1938.", "Le café est déjà sucré : précise « amaro » si tu le veux sans sucre.", 15],
    ["rom-caffe-greco", "Antico Caffè Greco", "cafe", "Centro Storico", "Via dei Condotti 86", 41.9057, 12.4807, 2, 1, "romantique", "Le plus vieux café de Rome, depuis 1760, où passaient Goethe, Keats et Casanova.", "Boire au comptoir coûte bien moins cher qu'en salle.", 30],
    ["rom-giolitti", "Giolitti", "cafe", "Centro Storico", "Via degli Uffici del Vicario 40", 41.9012, 12.4772, 1, 1, "famille,petit-budget", "Le glacier historique de Rome depuis 1900, à deux pas du Panthéon.", "Paie d'abord à la caisse, puis choisis tes parfums au comptoir.", 20],
    // ---- Culture ----
    ["rom-borghese", "Galleria Borghese", "culture", "Centro Storico", "Piazzale Scipione Borghese 5", 41.9142, 12.4921, 2, 2, "romantique", "Les sculptures du Bernin et les tableaux du Caravage dans une villa au milieu du parc.", "Réservation obligatoire à heure fixe : prends tes billets plusieurs jours avant.", 120],
    ["rom-colisee", "Colisée et Forum romain", "culture", "Monti", "Piazza del Colosseo", 41.8902, 12.4922, 2, 1, "famille", "L'amphithéâtre antique et le cœur de la Rome impériale, avec un seul billet.", "Réserve en ligne et commence par le Palatin, moins bondé le matin.", 180, "https://colosseo.it"],
    ["rom-vatican", "Musées du Vatican", "culture", "Prati", "Viale Vaticano", 41.9065, 12.4536, 3, 1, "famille", "Des kilomètres de chefs-d'œuvre jusqu'à la chapelle Sixtine.", "Prends le premier créneau du matin et file directement à la Sixtine.", 210, "https://www.museivaticani.va"],
    ["rom-doria-pamphilj", "Galleria Doria Pamphilj", "culture", "Centro Storico", "Via del Corso 305", 41.898, 12.4815, 2, 3, "cache,romantique", "Un palais encore habité par une famille princière, avec une galerie dorée et le portrait d'Innocent X par Velázquez.", "L'audioguide est commenté par un membre de la famille : à ne pas rater.", 90],
    ["rom-pantheon", "Panthéon", "culture", "Centro Storico", "Piazza della Rotonda", 41.8986, 12.4769, 1, 1, "famille,petit-budget", "Le temple romain le mieux conservé, avec sa coupole ouverte sur le ciel depuis près de 2 000 ans.", "Quand il pleut, regarde la pluie tomber par l'oculus.", 30],
    // ---- Nature ----
    ["rom-giardino-aranci", "Giardino degli Aranci", "nature", "Testaccio", "Piazza Pietro d'Illiria", 41.885, 12.48, 1, 2, "romantique,petit-budget", "Un jardin d'orangers sur l'Aventin, avec une vue sur les coupoles de Rome.", "Au coucher du soleil, c'est l'un des plus beaux panoramas de la ville.", 30],
    ["rom-pincio", "Villa Borghese et terrasse du Pincio", "nature", "Centro Storico", "Viale del Belvedere", 41.9113, 12.479, 1, 1, "famille,romantique", "Le grand parc de Rome et sa terrasse qui domine la Piazza del Popolo.", "Loue une rosalie (vélo à quatre roues) pour traverser le parc en famille.", 90],
    // ---- Insolite ----
    ["rom-buco-serratura", "Le trou de serrure de l'Aventin", "insolite", "Testaccio", "Piazza dei Cavalieri di Malta", 41.8833, 12.4778, 1, 3, "cache,insolite", "Par le trou de la serrure d'un portail, on aperçoit la coupole de Saint-Pierre parfaitement encadrée.", "Il y a souvent une petite file : elle avance vite et ça vaut le coup.", 15],
    ["rom-capucins", "Crypte des Capucins", "insolite", "Centro Storico", "Via Vittorio Veneto 27", 41.9044, 12.4888, 1, 2, "insolite", "Des chapelles décorées avec les ossements de milliers de moines, du sol au plafond.", "Ce n'est pas pour les âmes sensibles, mais c'est inoubliable.", 45],
    ["rom-coppede", "Quartiere Coppedè", "insolite", "Centro Storico", "Piazza Mincio", 41.917, 12.5, 1, 3, "cache", "Un petit quartier extravagant des années 1920, entre Art nouveau, médiéval et conte de fées.", "Commence par l'arche d'entrée et son lustre suspendu, puis la fontaine des grenouilles.", 45],
    ["rom-san-clemente", "Basilique Saint-Clément", "insolite", "Monti", "Via Labicana 95", 41.8893, 12.4976, 1, 2, "cache", "Une église du XIIe siècle construite sur une église du IVe, elle-même bâtie sur un temple antique.", "Descends jusqu'au niveau le plus bas : on entend une rivière souterraine.", 60],
    // ---- Activités ----
    ["rom-caracalla", "Thermes de Caracalla", "activite", "Testaccio", "Viale delle Terme di Caracalla", 41.879, 12.4925, 1, 2, "famille", "Les gigantesques thermes impériaux, qui accueillent l'été des opéras en plein air.", "Regarde le programme de l'opéra d'été : une soirée sous les ruines.", 90],
    // ---- Hôtels ----
    ["rom-beehive", "The Beehive", "hotel", "Esquilino", "Via Marghera 8", 41.902, 12.503, 1, 2, "petit-budget,bobo", "Une petite auberge écologique et chaleureuse près de la gare Termini, chambres privées incluses.", "Le jardin et le café végétarien sont ouverts à tous.", 0, "", 0],
    ["rom-santa-maria", "Hotel Santa Maria", "hotel", "Trastevere", "Vicolo del Piede 2", 41.8895, 12.4695, 2, 2, "romantique,cache", "Un ancien cloître du Trastevere transformé en hôtel, avec cour plantée d'orangers.", "Le calme de la cour au cœur du quartier le plus animé.", 0, "", 3],
    ["rom-artemide", "Hotel Artemide", "hotel", "Monti", "Via Nazionale 22", 41.9005, 12.4935, 2, 1, "famille", "Un hôtel Art nouveau confortable, avec rooftop, entre Termini et le Colisée.", "Le minibar est compris dans le prix de la chambre.", 0, "", 4],
    ["rom-hassler", "Hotel Hassler", "hotel", "Centro Storico", "Piazza della Trinità dei Monti 6", 41.906, 12.4835, 3, 1, "romantique", "Le palace en haut des marches de la Piazza di Spagna.", "Le restaurant panoramique offre une vue incroyable.", 0, "https://www.hotelhasslerroma.com", 5],
    ["rom-de-russie", "Hotel de Russie", "hotel", "Centro Storico", "Via del Babuino 9", 41.91, 12.477, 3, 1, "romantique", "Un palace entre la Piazza del Popolo et la Piazza di Spagna, avec un jardin secret en terrasses.", "Le bar Stravinskij dans le jardin vaut un verre même sans y dormir.", 0, "", 5],
  ],
  streets: [
    {
      id: "rom-via-corso", name: "Via del Corso", aliases: ["Corso", "Via del Corso"], arrondissement: "Centro Storico", lat: 41.9015, lng: 12.4808,
      histoire: "C'était la Via Lata de l'Antiquité, la grande voie qui entrait dans Rome par le nord. Elle a pris le nom de « Corso » à cause des courses de chevaux du carnaval qui s'y déroulaient chaque année.",
      fait: { annee: "1466", texte: "Le pape Paul II installe les courses du carnaval sur cette rue, qui part de la Piazza del Popolo. Elles y auront lieu pendant plus de quatre siècles." },
      anecdote: "Les chevaux couraient sans cavalier, excités par la foule. Les courses ont été interdites en 1874 après un accident mortel devant le roi : depuis, sur le Corso, on ne court plus qu'après les soldes.",
      aVoir: ["rom-doria-pamphilj", "rom-caffe-greco"],
    },
    {
      id: "rom-via-margutta", name: "Via Margutta", aliases: ["Margutta"], arrondissement: "Centro Storico", lat: 41.9085, lng: 12.4795,
      histoire: "Une rue discrète au pied du Pincio, qui accueille depuis des siècles des ateliers de peintres, de sculpteurs et d'artisans. Fellini y a vécu avec Giulietta Masina, au numéro 110.",
      fait: { annee: "1953", texte: "Le film « Vacances romaines » tourne ici l'appartement du journaliste joué par Gregory Peck, au numéro 51." },
      anecdote: "Depuis le film, des milliers de couples viennent chercher la porte de Gregory Peck. Ceux qui sont venus en Vespa ont droit à un supplément de nostalgie.",
      aVoir: ["rom-de-russie", "rom-pincio"],
    },
    {
      id: "rom-portico-ottavia", name: "Via del Portico d'Ottavia", aliases: ["Portico d'Ottavia", "Ghetto"], arrondissement: "Ghetto", lat: 41.8925, lng: 12.4785,
      histoire: "La rue doit son nom au portique construit par Auguste en l'honneur de sa sœur Octavie, dont les colonnes antiques se dressent encore au milieu des maisons. C'est le cœur du Ghetto, où vit l'une des plus anciennes communautés juives d'Europe.",
      fait: { annee: "1555", texte: "Le pape Paul IV ordonne la création du Ghetto : les juifs de Rome y sont enfermés derrière des murs jusqu'en 1870. Le 16 octobre 1943, la rafle nazie y arrête plus d'un millier de personnes." },
      anecdote: "Le quartier a donné à la cuisine romaine son plat le plus célèbre : l'artichaut frit à la juive, si croustillant qu'on le mange comme une fleur, feuille par feuille.",
      aVoir: ["rom-baghetto"],
    },
    {
      id: "rom-via-coronari", name: "Via dei Coronari", aliases: ["Coronari"], arrondissement: "Centro Storico", lat: 41.9005, lng: 12.4705,
      histoire: "Elle doit son nom aux « coronari », les vendeurs de chapelets qui s'adressaient aux pèlerins en route vers Saint-Pierre. C'est aujourd'hui la rue des antiquaires.",
      fait: { annee: "1475", texte: "Pour le Jubilé, le pape Sixte IV fait redresser et paver ce qui s'appelait alors la Via Recta, pour faciliter le passage des pèlerins." },
      anecdote: "Les marchands de chapelets ont été remplacés par des antiquaires, mais le principe est resté le même : vendre des objets précieux à des gens venus de loin et pressés.",
      aVoir: ["rom-supplizio", "rom-goccetto"],
    },
  ],
  nights: [
    { district: "Trastevere", vibe: "Ruelles pavées, bars à aperitivo et bières artisanales jusqu'à tard.", venues: [
      { name: "Freni e Frizioni", address: "Via del Politeama 4", kind: "Aperitivo", tip: "Le buffet est compris avec le verre." },
      { name: "Ma Che Siete Venuti a Fà", address: "Via Benedetta 25", kind: "Bières artisanales", tip: "Un minuscule pub de bières italiennes." },
    ] },
    { district: "Campo de' Fiori", vibe: "Le centre historique la nuit : places animées, speakeasies et enoteche.", venues: [
      { name: "Jerry Thomas", address: "Vicolo Cellini 30", kind: "Speakeasy", tip: "Réserve pour avoir le mot de passe." },
      { name: "Bar del Fico", address: "Piazza del Fico 26", kind: "Bar", tip: "Sous le figuier, l'apéritif à la romaine." },
    ] },
    { district: "Monti", vibe: "Le quartier bohème au pied du Colisée : bars à vin et concerts.", venues: [
      { name: "Ai Tre Scalini", address: "Via Panisperna 251", kind: "Bar à vin", tip: "Une façade couverte de lierre." },
      { name: "Blackmarket Hall", address: "Via de' Ciancaleoni 31", kind: "Cocktails et concerts", tip: "Salons vintage et musique live." },
    ] },
    { district: "Testaccio", vibe: "Les clubs creusés dans le mont Testaccio, une colline faite d'amphores antiques.", venues: [
      { name: "Akab", address: "Via di Monte Testaccio 68-69", kind: "Club", tip: "Un club historique de la via di Monte Testaccio." },
    ] },
    { district: "Pigneto", vibe: "Le quartier alternatif, rue piétonne pleine de bars et de terrasses.", venues: [
      { name: "Necci dal 1924", address: "Via Fanfulla da Lodi 68", kind: "Bar", tip: "Le bar où Pasolini tournait ses films." },
    ] },
  ],
  diet: [
    { diet: "casher", name: "Le Ghetto", streets: "Via del Portico d'Ottavia", text: "Le cœur de la cuisine judéo-romaine : restaurants casher, boulangerie et pâtisserie juive Boccione. Vérifie la certification de chaque adresse." },
    { diet: "halal", name: "Esquilino et Piazza Vittorio", streets: "Via Principe Eugenio, Piazza Vittorio Emanuele II", text: "Le quartier le plus cosmopolite de Rome : restaurants bangladais, indiens et maghrébins, souvent halal." },
  ],
};
