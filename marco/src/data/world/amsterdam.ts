import type { CityGuide } from "./types";

export const AMSTERDAM: CityGuide = {
  spots: [
    // ---- Restos ----
    ["ams-foodhallen", "Foodhallen", "resto", "Oud-West", "Bellamyplein 51", 52.367, 4.868, 1, 1, "famille,tendance", "Un ancien dépôt de tramways transformé en halle gourmande : bitterballen, dim sum, tacos.", "Goûte les bitterballen de De Ballenbar, la boulette frite néerlandaise.", 60],
    ["ams-moeders", "Moeders", "resto", "Jordaan", "Rozengracht 251", 52.3735, 4.876, 2, 2, "famille", "La cuisine néerlandaise « de maman », dans une salle couverte de photos de mères envoyées par les clients.", "Prends la rijsttafel hollandaise pour goûter plusieurs plats traditionnels.", 90],
    ["ams-pancake-bakery", "The Pancake Bakery", "resto", "Jordaan", "Prinsengracht 191", 52.377, 4.8845, 1, 1, "famille,petit-budget", "Des crêpes néerlandaises géantes, sucrées ou salées, dans un entrepôt du XVIIe siècle.", "La crêpe lard-fromage-pomme est le classique local.", 60],
    ["ams-blauw", "Blauw", "resto", "Oud-West", "Amstelveenseweg 158", 52.3555, 4.858, 2, 2, "romantique", "Une rijsttafel indonésienne de référence : une vingtaine de petits plats à partager.", "Héritage colonial oblige, c'est la cuisine « étrangère » la plus aimée des Néerlandais.", 120],
    ["ams-van-dobben", "Eetsalon Van Dobben", "resto", "Centrum · Dam", "Korte Reguliersdwarsstraat 5", 52.3665, 4.896, 1, 2, "petit-budget", "Le temple de la kroket depuis 1945, à manger dans un petit pain avec de la moutarde.", "Prends un broodje kroket au comptoir, comme un Amstellodamois.", 20],
    ["ams-albert-cuyp", "Marché Albert Cuyp", "resto", "De Pijp", "Albert Cuypstraat", 52.3555, 4.8945, 1, 1, "famille,petit-budget", "Le grand marché de rue de De Pijp : stroopwafels chaudes, harengs crus et fromages.", "Goûte un hareng cru à la néerlandaise, oignons hachés et cornichons.", 60],
    ["ams-de-kas", "De Kas", "resto", "Oost", "Kamerlingh Onneslaan 3", 52.354, 4.933, 3, 2, "romantique", "Un restaurant installé dans une serre municipale, qui cuisine ce qui pousse sur place.", "Réserve en fin de journée : la lumière dans la serre est magique.", 120, "https://restaurantdekas.com"],
    // ---- Bars ----
    ["ams-hoppe", "Café Hoppe", "bar", "Negen Straatjes", "Spui 18-20", 52.3685, 4.8895, 1, 1, "petit-budget", "Un café brun de 1670 au sol couvert de sable, où l'on boit debout jusque sur le trottoir.", "Commande une jenever, le genièvre local, avec une bière.", 45],
    ["ams-in-t-aepjen", "In 't Aepjen", "bar", "De Wallen", "Zeedijk 1", 52.3755, 4.9005, 1, 2, "cache,insolite", "Un bar installé dans l'une des deux dernières maisons en bois du centre, du XVIe siècle.", "Le nom vient des singes que les marins laissaient en paiement.", 45],
    ["ams-wynand-fockink", "Wynand Fockink", "bar", "Centrum · Dam", "Pijlsteeg 31", 52.3725, 4.895, 1, 3, "cache,insolite", "Une salle de dégustation de liqueurs de 1679, cachée dans une ruelle derrière le Dam.", "Le premier verre, rempli à ras bord, se boit sans les mains : penche-toi.", 30],
    ["ams-door-74", "Door 74", "bar", "Centrum · Dam", "Reguliersdwarsstraat 74", 52.3665, 4.8935, 2, 3, "cache,jazz", "Un speakeasy derrière une porte noire anonyme, cocktails parmi les meilleurs de la ville.", "Réserve par message, et frappe à la porte noire.", 90],
    ["ams-brouwerij-ij", "Brouwerij 't IJ", "bar", "Oost", "Funenkade 7", 52.3667, 4.9265, 1, 2, "petit-budget,bobo", "Une brasserie artisanale installée au pied d'un moulin à vent.", "Prends la planche de dégustation en terrasse, face au moulin.", 60],
    // ---- Cafés ----
    ["ams-winkel-43", "Winkel 43", "cafe", "Jordaan", "Noordermarkt 43", 52.38, 4.8865, 1, 2, "famille", "La tarte aux pommes la plus célèbre d'Amsterdam, épaisse et servie avec crème fouettée.", "Le lundi et le samedi, le marché de la Noordermarkt s'installe juste devant.", 30],
    // ---- Culture ----
    ["ams-rijksmuseum", "Rijksmuseum", "culture", "Museumkwartier", "Museumstraat 1", 52.36, 4.8852, 2, 1, "famille", "La Ronde de nuit de Rembrandt, Vermeer et tout le Siècle d'or néerlandais.", "Le passage sous le musée est une piste cyclable : regarde avant de traverser.", 180, "https://www.rijksmuseum.nl"],
    ["ams-van-gogh", "Musée Van Gogh", "culture", "Museumkwartier", "Museumplein 6", 52.3584, 4.8811, 2, 1, "famille", "La plus grande collection Van Gogh au monde, des débuts sombres aux Tournesols.", "Billets uniquement en ligne, à heure fixe : réserve avant de partir.", 120, "https://www.vangoghmuseum.nl"],
    ["ams-anne-frank", "Maison d'Anne Frank", "culture", "Jordaan", "Westermarkt 20", 52.3752, 4.884, 2, 1, "famille", "L'annexe secrète où Anne Frank a écrit son journal, cachée pendant plus de deux ans.", "Les billets sont mis en ligne quelques semaines avant : réserve dès leur ouverture.", 75, "https://www.annefrank.org"],
    ["ams-ons-lieve-heer", "Ons' Lieve Heer op Solder", "culture", "De Wallen", "Oudezijds Voorburgwal 38", 52.3747, 4.9, 2, 3, "cache,insolite", "Une église catholique clandestine du XVIIe siècle cachée dans le grenier d'une maison de marchand.", "Le contraste avec le quartier rouge juste dehors est saisissant.", 75],
    ["ams-stedelijk", "Stedelijk Museum", "culture", "Museumkwartier", "Museumplein 10", 52.358, 4.8798, 2, 1, "bobo", "L'art moderne et le design, de Mondrian à Warhol, dans un bâtiment en forme de baignoire.", "La collection de design est l'une des plus belles d'Europe.", 120],
    // ---- Nature ----
    ["ams-vondelpark", "Vondelpark", "nature", "Museumkwartier", "Vondelpark", 52.358, 4.8686, 1, 1, "famille,petit-budget", "Le grand parc d'Amsterdam, où toute la ville pique-nique au premier rayon de soleil.", "L'été, le théâtre en plein air propose des spectacles gratuits.", 90],
    ["ams-hortus", "Hortus Botanicus", "nature", "Plantage", "Plantage Middenlaan 2a", 52.3667, 4.908, 2, 2, "cache,famille", "L'un des plus vieux jardins botaniques du monde, avec des serres tropicales.", "Le caféier qui pousse ici aurait donné naissance à une partie des plantations du monde.", 75],
    // ---- Insolite ----
    ["ams-begijnhof", "Begijnhof", "insolite", "Negen Straatjes", "Begijnhof 29", 52.3693, 4.8899, 1, 3, "cache,romantique", "Une cour secrète du XIVe siècle où vivaient les béguines, avec la plus vieille maison en bois de la ville.", "C'est un lieu habité : parle à voix basse.", 30],
    ["ams-ndsm", "NDSM Werf", "insolite", "Noord", "NDSM-Plein", 52.401, 4.892, 1, 2, "bobo,insolite", "Un chantier naval reconverti en ville d'artistes, avec graffitis géants et marché aux puces.", "Le ferry gratuit depuis la gare centrale met un quart d'heure.", 120],
    // ---- Activités ----
    ["ams-adam-lookout", "A'DAM Lookout", "activite", "Noord", "Overhoeksplein 5", 52.384, 4.902, 2, 1, "famille", "Une plateforme panoramique avec une balançoire au-dessus du vide, à 100 mètres de haut.", "Le ferry gratuit depuis l'arrière de la gare centrale t'y emmène en 3 minutes.", 60],
    ["ams-canaux", "Croisière sur les canaux", "activite", "Centrum · Dam", "Embarcadères face à la gare centrale", 52.3785, 4.9005, 2, 1, "famille,romantique", "Les canaux classés à l'Unesco vus depuis l'eau, en une heure.", "Préfère un petit bateau ouvert à un grand bateau vitré : on voit beaucoup mieux.", 60],
    ["ams-velo", "Balade à vélo dans le Jordaan", "activite", "Jordaan", "Westerstraat", 52.378, 4.882, 1, 2, "petit-budget,romantique", "Le meilleur moyen de découvrir Amsterdam : comme les habitants, à vélo, le long des canaux.", "Garde ta droite et ne t'arrête jamais au milieu d'une piste cyclable.", 120],
    // ---- Hôtels ----
    ["ams-clinknoord", "ClinkNOORD", "hotel", "Noord", "Badhuiskade 3", 52.3858, 4.902, 1, 2, "petit-budget,bobo", "Une auberge installée dans un ancien laboratoire, au bord de l'IJ, à un ferry du centre.", "Le ferry gratuit permet d'être en ville en cinq minutes.", 0, "", 0],
    ["ams-hoxton", "The Hoxton Amsterdam", "hotel", "Negen Straatjes", "Herengracht 255", 52.3735, 4.8885, 2, 1, "tendance,romantique", "Cinq maisons de canal du XVIIe siècle réunies en un hôtel chaleureux.", "Demande une chambre côté canal.", 0, "https://thehoxton.com", 4],
    ["ams-v-nesplein", "Hotel V Nesplein", "hotel", "Centrum · Dam", "Nes 49", 52.37, 4.8935, 2, 2, "tendance", "Un hôtel design au cœur du quartier des théâtres, à deux pas du Dam.", "Parfait pour tout faire à pied.", 0, "", 4],
    ["ams-pulitzer", "Pulitzer Amsterdam", "hotel", "Negen Straatjes", "Prinsengracht 323", 52.3712, 4.884, 3, 1, "romantique", "Vingt-cinq maisons de canal reliées par des jardins secrets.", "Un bateau-salon de 1909 propose des balades privées sur les canaux.", 0, "", 5],
    ["ams-conservatorium", "Conservatorium Hotel", "hotel", "Museumkwartier", "Van Baerlestraat 27", 52.358, 4.88, 3, 1, "romantique", "Un ancien conservatoire de musique néogothique sous une verrière contemporaine, face aux musées.", "Le lounge sous la verrière est parfait pour un thé.", 0, "", 5],
  ],
  streets: [
    {
      id: "ams-dam", name: "Dam", aliases: ["Damrak", "Place du Dam"], arrondissement: "Centrum · Dam", lat: 52.3731, lng: 4.8926,
      histoire: "Au XIIIe siècle, des pêcheurs construisent un barrage sur l'Amstel pour se protéger de la mer : la ville qui naît autour s'appelle Amstelredam, « le barrage sur l'Amstel ». La place du Dam occupe l'emplacement de ce barrage.",
      fait: { annee: "1275", texte: "Le comte Floris V exempte de péage les habitants de « Amestelledamme » : c'est la première mention écrite de la ville." },
      anecdote: "Le Damrak, la grande avenue qui mène à la gare, était un bras d'eau où accostaient les bateaux. On l'a comblé au XIXe siècle : à Amsterdam, même les rues ont commencé leur carrière comme canal.",
      aVoir: ["ams-wynand-fockink", "ams-v-nesplein"],
    },
    {
      id: "ams-prinsengracht", name: "Prinsengracht", aliases: ["Prinsengracht"], arrondissement: "Jordaan", lat: 52.3752, lng: 4.8836,
      histoire: "Le « canal du Prince », en hommage à Guillaume d'Orange, est le plus extérieur des trois grands canaux creusés au XVIIe siècle, au sommet de la puissance commerciale de la ville. Les maisons de marchands s'y alignent avec leurs pignons sculptés.",
      fait: { annee: "1942", texte: "En juillet, la famille Frank se cache dans l'annexe du 263 Prinsengracht. Elle y restera plus de deux ans, jusqu'à son arrestation le 4 août 1944." },
      anecdote: "Les maisons penchent vers la rue, et c'est voulu : avec un crochet sous le toit, on hisse les meubles par les fenêtres, car les escaliers sont trop étroits. Le penchant évite que le piano ne cogne la façade.",
      aVoir: ["ams-anne-frank", "ams-pancake-bakery"],
    },
    {
      id: "ams-zeedijk", name: "Zeedijk", aliases: ["Zeedijk"], arrondissement: "De Wallen", lat: 52.3755, lng: 4.9005,
      histoire: "Le Zeedijk était littéralement la « digue de la mer », qui protégeait la ville au Moyen Âge. Devenue la rue des marins, elle accueille aujourd'hui le quartier chinois d'Amsterdam.",
      fait: { annee: "1550", texte: "Construction de la maison en bois du numéro 1, l'une des deux seules encore debout dans le centre après l'interdiction des façades en bois pour cause d'incendies." },
      anecdote: "Les marins sans le sou payaient leur logement avec les singes ramenés de voyage. Les chambres grouillaient de puces : « être logé chez le singe » est devenu une expression néerlandaise pour dire qu'on s'est fait avoir.",
      aVoir: ["ams-in-t-aepjen", "ams-ons-lieve-heer"],
    },
    {
      id: "ams-herengracht", name: "Herengracht", aliases: ["Herengracht", "Gouden Bocht"], arrondissement: "Negen Straatjes", lat: 52.365, lng: 4.893,
      histoire: "Le « canal des Seigneurs » était l'adresse des familles les plus riches du Siècle d'or. Sa courbe dorée, la Gouden Bocht, aligne des hôtels particuliers deux fois plus larges que la moyenne.",
      fait: { annee: "1613", texte: "Début du creusement de la ceinture des canaux, le grand projet d'extension qui a fait d'Amsterdam la ville la plus moderne d'Europe." },
      anecdote: "Les impôts étaient calculés selon la largeur de la façade, d'où ces maisons étroites et profondes. Les très riches, eux, achetaient deux parcelles côte à côte pour montrer qu'ils pouvaient payer double.",
      aVoir: ["ams-hoxton", "ams-pulitzer"],
    },
  ],
  nights: [
    { district: "Leidseplein", vibe: "Les grandes salles de concert de la ville, dans des églises et des laiteries reconverties.", venues: [
      { name: "Paradiso", address: "Weteringschans 6-8", kind: "Concerts", tip: "Une ancienne église devenue temple du rock." },
      { name: "Melkweg", address: "Lijnbaansgracht 234a", kind: "Concerts et club", tip: "Une ancienne laiterie, plusieurs salles." },
    ] },
    { district: "Centrum · Dam", vibe: "Cafés bruns centenaires, salles de dégustation et speakeasies.", venues: [
      { name: "Wynand Fockink", address: "Pijlsteeg 31", kind: "Liqueurs", tip: "Le premier verre se boit sans les mains." },
      { name: "Café Hoppe", address: "Spui 18-20", kind: "Café brun", tip: "On boit debout jusque sur le trottoir." },
      { name: "Door 74", address: "Reguliersdwarsstraat 74", kind: "Speakeasy", tip: "Réservation par message." },
    ] },
    { district: "Noord", vibe: "De l'autre côté de l'IJ : friches industrielles et club sous la tour A'DAM.", venues: [
      { name: "Shelter", address: "Overhoeksplein 3", kind: "Club techno", tip: "Un club dans le sous-sol de la tour A'DAM." },
    ] },
    { district: "Oost", vibe: "Brasseries artisanales et bars de quartier, loin des touristes.", venues: [
      { name: "Brouwerij 't IJ", address: "Funenkade 7", kind: "Brasserie", tip: "Bière au pied du moulin." },
    ] },
  ],
  diet: [
    { diet: "casher", name: "Buitenveldert et Amstelveen", streets: "Gelderlandplein, Kastelenstraat", text: "Le cœur de la vie juive actuelle d'Amsterdam : boulangeries, épiceries et restaurants casher." },
    { diet: "casher", name: "Rivierenbuurt", streets: "Scheldestraat", text: "Quelques adresses casher historiques, comme le traiteur Sal Meijer." },
    { diet: "halal", name: "Oost et Oud-West", streets: "Javastraat, Kinkerstraat, De Clercqstraat", text: "Boulangeries et restaurants turcs et marocains, souvent halal." },
  ],
};
