import type { CityGuide } from "./types";

export const LISBONNE: CityGuide = {
  spots: [
    // ---- Restos ----
    ["lis-ramiro", "Cervejaria Ramiro", "resto", "Intendente", "Avenida Almirante Reis 1", 38.7208, -9.1355, 2, 1, "tendance", "La brasserie de fruits de mer préférée des Lisboètes : crevettes à l'ail, palourdes, et un prego pour finir.", "On termine traditionnellement par un petit sandwich au bœuf, le prego, en guise de dessert.", 90, "https://www.cervejariaramiro.pt"],
    ["lis-time-out-market", "Time Out Market", "resto", "Cais do Sodré", "Avenida 24 de Julho 49", 38.7069, -9.1458, 2, 1, "famille", "La grande halle du marché de la Ribeira, où les meilleurs chefs de la ville tiennent un comptoir.", "Le marché traditionnel juste à côté ouvre le matin : fruits et poissons d'abord, chefs ensuite.", 60],
    ["lis-rua-das-flores", "Taberna da Rua das Flores", "resto", "Chiado", "Rua das Flores 103", 38.7094, -9.144, 2, 2, "bobo,cache", "Une taverne minuscule qui sert la cuisine portugaise d'autrefois, écrite à la craie chaque jour.", "Pas de réservation pour le dîner : arrive à l'ouverture et inscris ton nom.", 75],
    ["lis-cevicheria", "A Cevicheria", "resto", "Príncipe Real", "Rua Dom Pedro V 129", 38.716, -9.148, 2, 1, "tendance", "Ceviches pimpants sous une pieuvre géante suspendue au plafond.", "On attend souvent dehors avec un pisco sour offert, c'est presque le meilleur moment.", 60],
    ["lis-ze-mouraria", "Zé da Mouraria", "resto", "Mouraria", "Rua João do Outeiro 24", 38.7158, -9.1358, 1, 3, "cache,petit-budget", "Une tasca de quartier ouverte seulement le midi, aux assiettes gargantuesques.", "Une assiette pour deux suffit largement : demande conseil au serveur.", 60],
    ["lis-belcanto", "Belcanto", "resto", "Chiado", "Largo de São Carlos 10", 38.7095, -9.1415, 3, 1, "romantique", "La table gastronomique de José Avillez, qui revisite la cuisine portugaise avec malice.", "Réserve bien à l'avance, surtout le week-end.", 180],
    // ---- Bars ----
    ["lis-ginjinha", "A Ginjinha", "bar", "Baixa", "Largo de São Domingos 8", 38.714, -9.1385, 1, 2, "petit-budget,insolite", "Un comptoir de 1840 qui ne sert qu'une chose : la ginjinha, liqueur de griotte, avec ou sans cerise.", "Demande « com elas » pour avoir les cerises au fond du verre.", 15],
    ["lis-pensao-amor", "Pensão Amor", "bar", "Cais do Sodré", "Rua do Alecrim 19", 38.7071, -9.1435, 2, 2, "insolite,romantique", "Un ancien hôtel de passe du port devenu bar baroque, entre velours rouge et bibliothèque coquine.", "Monte dans les petites salles de l'étage, chacune a son décor.", 90],
    ["lis-park", "Park", "bar", "Bairro Alto", "Calçada do Combro 58", 38.711, -9.1475, 2, 3, "cache,romantique", "Un bar-jardin installé sur le toit d'un parking, face au Tage.", "Prends l'ascenseur du parking jusqu'au dernier étage : il n'y a pas d'enseigne.", 90],
    ["lis-red-frog", "Red Frog Speakeasy", "bar", "Príncipe Real", "Rua do Salitre 5A", 38.7192, -9.1465, 2, 3, "cache", "Un speakeasy primé : on sonne à une porte anonyme pour entrer.", "Cherche la petite grenouille rouge près de la porte.", 90],
    // ---- Cafés ----
    ["lis-brasileira", "A Brasileira", "cafe", "Chiado", "Rua Garrett 120", 38.7107, -9.1424, 1, 1, "romantique", "Le café historique du Chiado, avec la statue de Fernando Pessoa assise en terrasse.", "Commande une « bica », le nom lisboète de l'expresso.", 30],
    ["lis-manteigaria", "Manteigaria", "cafe", "Chiado", "Rua do Loreto 2", 38.7106, -9.144, 1, 1, "petit-budget,famille", "Des pastéis de nata sortis du four toutes les quelques minutes, à manger debout au comptoir.", "Saupoudre de cannelle et mange-le tiède, c'est tout le secret.", 15],
    ["lis-pasteis-belem", "Pastéis de Belém", "cafe", "Belém", "Rua de Belém 84-92", 38.6975, -9.2032, 1, 1, "famille,petit-budget", "La fabrique d'origine des pastéis de nata, selon une recette tenue secrète depuis 1837.", "Ignore la file pour emporter : entre et assieds-toi dans les salles du fond.", 45, "https://pasteisdebelem.pt"],
    // ---- Culture ----
    ["lis-jeronimos", "Monastère des Jerónimos", "culture", "Belém", "Praça do Império", 38.6979, -9.2068, 2, 1, "famille", "Le chef-d'œuvre du style manuélin, construit grâce à l'or des grandes découvertes.", "Le cloître est la partie payante, et la plus belle.", 90],
    ["lis-azulejo", "Musée national de l'Azulejo", "culture", "Alfama", "Rua da Madre de Deus 4", 38.7247, -9.1137, 1, 2, "cache", "Cinq siècles de carreaux de faïence dans un couvent à l'église entièrement dorée.", "Ne rate pas le grand panorama de Lisbonne avant le tremblement de terre, en azulejos.", 90],
    ["lis-maat", "MAAT", "culture", "Belém", "Avenida Brasília", 38.6957, -9.1925, 2, 1, "bobo", "Le musée d'art, d'architecture et de technologie, dont on peut arpenter le toit ondulé au bord du Tage.", "Le toit est accessible gratuitement : idéal au coucher du soleil.", 75],
    ["lis-gulbenkian", "Musée Calouste Gulbenkian", "culture", "Intendente", "Avenida de Berna 45A", 38.7375, -9.1545, 2, 2, "romantique", "La collection d'un magnat du pétrole, de l'Égypte antique à Lalique, dans un jardin superbe.", "Le jardin est gratuit et parfait pour une pause.", 120],
    ["lis-castelo", "Castelo de São Jorge", "culture", "Alfama", "Rua de Santa Cruz do Castelo", 38.7139, -9.1335, 2, 1, "famille", "Le château qui domine Lisbonne, ses remparts et ses paons.", "Arrive en fin de journée pour la lumière sur les toits.", 90],
    // ---- Nature ----
    ["lis-senhora-monte", "Miradouro da Senhora do Monte", "nature", "Mouraria", "Largo Monte", 38.719, -9.133, 1, 2, "romantique,petit-budget", "Le plus haut belvédère de Lisbonne, avec le château et le Tage à tes pieds.", "Monte au coucher du soleil avec quelque chose à boire.", 45],
    ["lis-estrela", "Jardim da Estrela", "nature", "Príncipe Real", "Praça da Estrela", 38.7138, -9.1595, 1, 2, "famille,petit-budget", "Un jardin romantique avec kiosque et étang, en face de la basilique de l'Estrela.", "Le kiosque-café est parfait pour un café au calme.", 45],
    // ---- Insolite ----
    ["lis-bica", "Ascenseur da Bica", "insolite", "Bairro Alto", "Rua de São Paulo 234", 38.7085, -9.1468, 1, 1, "romantique", "Un funiculaire de 1892 qui grimpe une ruelle pentue entre le linge qui sèche.", "Monte puis redescends à pied pour admirer la rue.", 20],
    ["lis-lx-factory", "LX Factory", "insolite", "Alcântara", "Rua Rodrigues de Faria 103", 38.7035, -9.1785, 1, 1, "bobo,tendance", "Une ancienne usine textile devenue quartier de restaurants, de boutiques et de la librairie Ler Devagar.", "La librairie Ler Devagar, avec son vélo volant, vaut le détour.", 90],
    ["lis-feira-ladra", "Feira da Ladra", "insolite", "Alfama", "Campo de Santa Clara", 38.7157, -9.126, 1, 2, "petit-budget", "Le marché aux puces de la « voleuse », le mardi et le samedi.", "Vas-y le matin et négocie gentiment.", 90],
    // ---- Activités ----
    ["lis-tram-28", "Tram 28", "activite", "Mouraria", "Praça Martim Moniz", 38.7166, -9.136, 1, 1, "famille,petit-budget", "Le vieux tramway jaune qui traverse les quartiers historiques en grinçant dans les virages.", "Monte au terminus de Martim Moniz tôt le matin pour avoir une place assise.", 60],
    ["lis-clube-fado", "Clube de Fado", "activite", "Alfama", "Rua de São João da Praça 94", 38.71, -9.13, 3, 2, "romantique,jazz", "Une maison de fado sous des voûtes anciennes, avec des fadistes reconnus.", "Pendant le fado, silence absolu : on ne parle pas, on ne mange pas.", 150],
    // ---- Hôtels ----
    ["lis-destination-hostel", "Lisbon Destination Hostel", "hotel", "Baixa", "Largo do Duque de Cadaval 17", 38.7146, -9.141, 1, 2, "petit-budget", "Une auberge installée sous la verrière de la gare du Rossio, avec chambres privées.", "Les dîners communs sont un bon moyen de rencontrer du monde.", 0, "", 0],
    ["lis-memmo-alfama", "Memmo Alfama", "hotel", "Alfama", "Travessa das Merceeiras 27", 38.7108, -9.1312, 2, 2, "romantique", "Un petit hôtel au cœur de l'Alfama, avec piscine et terrasse face au Tage.", "Le bar de la terrasse est ouvert aux non-résidents.", 0, "", 4],
    ["lis-lumiares", "The Lumiares", "hotel", "Bairro Alto", "Rua do Diário de Notícias 142", 38.7125, -9.145, 2, 2, "romantique", "Un palais du Bairro Alto transformé en appartements-hôtel, avec rooftop.", "Les suites ont une cuisine, pratique pour un long séjour.", 0, "", 5],
    ["lis-bairro-alto-hotel", "Bairro Alto Hotel", "hotel", "Chiado", "Praça Luís de Camões 2", 38.7107, -9.1435, 3, 1, "romantique", "L'hôtel chic du Chiado, avec une terrasse qui domine le Tage.", "La terrasse est parfaite pour un verre au coucher du soleil.", 0, "", 5],
    ["lis-pestana-palace", "Pestana Palace", "hotel", "Alcântara", "Rua Jau 54", 38.7055, -9.188, 3, 2, "romantique,famille", "Un palais du XIXe siècle entouré d'un grand jardin tropical avec piscine.", "Le jardin est un havre de calme, idéal en famille.", 0, "", 5],
  ],
  streets: [
    {
      id: "lis-rua-augusta", name: "Rua Augusta", aliases: ["Augusta"], arrondissement: "Baixa", lat: 38.71, lng: -9.1375,
      histoire: "La grande rue piétonne de la Baixa a été tracée au cordeau après la destruction de la ville basse. Le marquis de Pombal fait reconstruire le quartier selon un plan en damier, avec des immeubles identiques pensés pour résister aux séismes.",
      fait: { annee: "1755", texte: "Le 1er novembre, un tremblement de terre, suivi d'un tsunami et d'incendies, détruit une grande partie de Lisbonne et fait des dizaines de milliers de morts." },
      anecdote: "Pour tester la structure antisismique en bois des nouveaux immeubles, on raconte que des soldats marchaient au pas autour d'une maquette pour simuler un tremblement de terre. La méthode était artisanale, mais les immeubles tiennent encore.",
      aVoir: ["lis-ginjinha"],
    },
    {
      id: "lis-rua-garrett", name: "Rua Garrett", aliases: ["Garrett", "Chiado"], arrondissement: "Chiado", lat: 38.7105, lng: -9.1418,
      histoire: "La rue élégante du Chiado porte le nom de l'écrivain romantique Almeida Garrett. Elle aligne librairies, cafés historiques et boutiques depuis le XIXe siècle.",
      fait: { annee: "1988", texte: "Le 25 août, un grand incendie ravage le Chiado et détruit une vingtaine d'immeubles ; l'architecte Álvaro Siza dirige la reconstruction." },
      anecdote: "Devant le café A Brasileira, la statue de bronze de Fernando Pessoa est assise à une table de terrasse. Il y a toujours quelqu'un sur la chaise d'à côté pour la photo : le poète solitaire n'a jamais eu autant de compagnie.",
      aVoir: ["lis-brasileira", "lis-manteigaria"],
    },
    {
      id: "lis-rua-bica", name: "Rua da Bica de Duarte Belo", aliases: ["Bica", "Rua da Bica"], arrondissement: "Bairro Alto", lat: 38.7085, lng: -9.1468,
      histoire: "Cette ruelle en pente raide relie le bord du Tage au haut de la ville. Elle est desservie par un funiculaire qui grimpe entre les façades et les balcons fleuris.",
      fait: { annee: "1892", texte: "Mise en service de l'ascenseur da Bica, l'un des trois funiculaires historiques de Lisbonne, classé monument national." },
      anecdote: "Les habitants font sécher leur linge au-dessus de la voie : chaque montée du funiculaire passe sous une haie de draps et de chaussettes, que les touristes photographient avec un respect de musée.",
      aVoir: ["lis-bica", "lis-park"],
    },
    {
      id: "lis-bacalhoeiros", name: "Rua dos Bacalhoeiros", aliases: ["Bacalhoeiros", "Casa dos Bicos"], arrondissement: "Alfama", lat: 38.7087, lng: -9.1335,
      histoire: "La « rue des marchands de morue » rappelle l'époque où le poisson séché arrivait par le fleuve. On y trouve la Casa dos Bicos, au mur hérissé de pierres taillées en pointes de diamant.",
      fait: { annee: "1523", texte: "Brás de Albuquerque, fils du vice-roi des Indes, fait construire la Casa dos Bicos. Elle abrite depuis 2012 la fondation de José Saramago." },
      anecdote: "Les cendres de Saramago, prix Nobel de littérature, reposent au pied d'un olivier planté devant la maison. L'arbre vient de son village natal : l'écrivain est rentré à la maison, mais en ville.",
      aVoir: ["lis-castelo"],
    },
  ],
  nights: [
    { district: "Bairro Alto", vibe: "Des centaines de petits bars : on achète son verre et on boit dans la rue, jusque tard.", venues: [
      { name: "Pavilhão Chinês", address: "Rua Dom Pedro V 89", kind: "Bar-musée", tip: "Des milliers de jouets et objets en vitrine." },
      { name: "Tasca do Chico", address: "Rua do Diário de Notícias 39", kind: "Fado vadio", tip: "Fado amateur, n'importe qui peut chanter." },
    ] },
    { district: "Cais do Sodré", vibe: "L'ancien quartier des marins : la rue rose, les bars rétro et les clubs sous les arches.", venues: [
      { name: "Pensão Amor", address: "Rua do Alecrim 19", kind: "Bar", tip: "Velours rouge et esprit cabaret." },
      { name: "Musicbox", address: "Rua Nova do Carvalho 24", kind: "Club", tip: "Concerts et DJ sous les arches du pont." },
    ] },
    { district: "Alfama", vibe: "Le fado dans les ruelles du plus vieux quartier.", venues: [
      { name: "Clube de Fado", address: "Rua de São João da Praça 94", kind: "Fado", tip: "Réserve et respecte le silence." },
      { name: "Mesa de Frades", address: "Rua dos Remédios 139A", kind: "Fado", tip: "Une ancienne chapelle couverte d'azulejos." },
    ] },
    { district: "Príncipe Real", vibe: "Cocktails chics et bars cachés dans le quartier le plus élégant.", venues: [
      { name: "Red Frog", address: "Rua do Salitre 5A", kind: "Speakeasy", tip: "Sonne à la porte anonyme." },
      { name: "Foxtrot", address: "Travessa de Santa Teresa 28", kind: "Bar", tip: "Un bar aux allures des années 1920." },
    ] },
    { district: "Santa Apolónia", vibe: "Le grand club de Lisbonne, au bord du Tage.", venues: [
      { name: "Lux Frágil", address: "Avenida Infante Dom Henrique, Armazém A", kind: "Club", tip: "Finis la nuit sur la terrasse face au fleuve." },
    ] },
  ],
  diet: [
    { diet: "halal", name: "Martim Moniz et Mouraria", streets: "Rua do Benformoso, Praça Martim Moniz", text: "Le quartier le plus cosmopolite : restaurants bangladais, indiens, pakistanais et épiceries halal." },
    { diet: "casher", name: "Rato (synagogue Shaaré Tikvá)", streets: "Rua Alexandre Herculano", text: "Très peu d'adresses casher à Lisbonne : renseigne-toi auprès de la communauté ou du Beit Chabad, qui proposent des repas." },
  ],
};
