import type { CityGuide } from "./types";

export const BERLIN: CityGuide = {
  spots: [
    // ---- Restos ----
    ["ber-curry-36", "Curry 36", "resto", "Kreuzberg", "Mehringdamm 36", 52.4935, 13.388, 1, 1, "petit-budget", "La currywurst berlinoise de référence, servie avec frites, jusque tard dans la nuit.", "Commande-la « ohne Darm » (sans peau) comme les puristes de l'Est, ou avec, comme à l'Ouest.", 20],
    ["ber-markthalle-neun", "Markthalle Neun", "resto", "Kreuzberg", "Eisenbahnstraße 42-43", 52.502, 13.431, 1, 2, "bobo,famille", "Une halle de 1891 sauvée par les habitants, avec un grand marché de street food le jeudi soir.", "Le Street Food Thursday est le meilleur moment pour venir.", 60],
    ["ber-nobelhart", "Nobelhart & Schmutzig", "resto", "Mitte", "Friedrichstraße 218", 52.506, 13.3905, 3, 2, "tendance", "Un comptoir gastronomique qui ne cuisine que des produits de la région de Berlin.", "Le dîner se prend au comptoir, face aux cuisiniers : réserve.", 180],
    ["ber-claerchens", "Clärchens Ballhaus", "resto", "Mitte", "Auguststraße 24", 52.5265, 13.3965, 2, 2, "romantique,jazz", "Une salle de bal de 1913 restée dans son jus : on y dîne et on y danse.", "Monte voir la salle des miroirs, à l'étage, encore marquée par la guerre.", 120],
    ["ber-konnopke", "Konnopke's Imbiss", "resto", "Prenzlauer Berg", "Schönhauser Allee 44b", 52.5405, 13.412, 1, 2, "petit-budget", "Le stand de currywurst sous le métro aérien, tenu par la même famille depuis 1930.", "Mange-la sous les rails du U2, c'est tout le charme.", 20],
    ["ber-zur-letzten-instanz", "Zur letzten Instanz", "resto", "Mitte", "Waisenstraße 14-16", 52.5165, 13.414, 2, 2, "famille", "Le plus vieux restaurant de Berlin, collé à un vestige de l'enceinte médiévale.", "Le jarret de porc (Eisbein) est la spécialité de la maison.", 90],
    ["ber-beth-cafe", "Beth Café", "resto", "Mitte", "Tucholskystraße 40", 52.5245, 13.393, 1, 3, "cache", "Un petit café casher de la communauté Adass Jisroel, avec cour intérieure.", "Un endroit calme pour un déjeuner simple dans le quartier de l'Oranienburger Straße.", 45, "", undefined, "casher"],
    ["ber-cookies-cream", "Cookies Cream", "resto", "Mitte", "Behrenstraße 55", 52.5165, 13.388, 3, 3, "cache,tendance", "Un restaurant végétarien étoilé caché au fond d'une cour de service, derrière un hôtel.", "L'entrée se trouve en passant par une cour de livraison : c'est voulu.", 150],
    // ---- Bars ----
    ["ber-klunkerkranich", "Klunkerkranich", "bar", "Neukölln", "Karl-Marx-Straße 66", 52.4815, 13.4335, 1, 2, "bobo,romantique", "Un jardin-bar installé sur le toit d'un parking de centre commercial, avec vue sur tout Berlin.", "Prends l'ascenseur du centre commercial jusqu'au dernier niveau du parking.", 90],
    ["ber-buck-and-breck", "Buck and Breck", "bar", "Mitte", "Brunnenstraße 177", 52.532, 13.4, 3, 3, "cache", "Un speakeasy de quelques places, sans enseigne : on sonne et on attend.", "Sonne à la porte : s'il y a de la place, on t'ouvre.", 75],
    ["ber-wuergeengel", "Würgeengel", "bar", "Kreuzberg", "Dresdener Straße 122", 52.4995, 13.418, 2, 2, "romantique", "Un bar à cocktails rétro de Kreuzberg, plafond vitré et lumière tamisée.", "Le nom vient d'un film de Buñuel : demande au barman de te le raconter.", 75],
    ["ber-prater", "Prater Garten", "bar", "Prenzlauer Berg", "Kastanienallee 7-9", 52.5405, 13.4105, 1, 1, "famille,petit-budget", "Le plus vieux jardin à bière de Berlin, depuis 1837, sous les marronniers.", "Commande au comptoir et choisis une grande table partagée.", 75],
    // ---- Cafés ----
    ["ber-the-barn", "The Barn", "cafe", "Mitte", "Auguststraße 58", 52.5275, 13.399, 1, 2, "bobo", "Le torréfacteur qui a lancé le café de spécialité à Berlin.", "Un flat white et un cinnamon roll, puis balade dans les galeries de l'Auguststraße.", 20],
    ["ber-einstein", "Café Einstein Stammhaus", "cafe", "Schöneberg", "Kurfürstenstraße 58", 52.5025, 13.3555, 2, 2, "romantique", "Un café viennois dans une villa de 1878, avec apfelstrudel et jardin.", "Le strudel aux pommes est la commande à ne pas rater.", 45],
    // ---- Culture ----
    ["ber-neues-museum", "Neues Museum", "culture", "Mitte", "Bodestraße 1-3", 52.52, 13.398, 2, 1, "famille", "Le buste de Néfertiti dans un musée reconstruit en gardant les cicatrices de la guerre.", "Réserve un créneau horaire en ligne, surtout le week-end.", 120],
    ["ber-east-side-gallery", "East Side Gallery", "culture", "Friedrichshain", "Mühlenstraße", 52.505, 13.4397, 1, 1, "petit-budget", "Le plus long morceau de Mur encore debout, couvert de fresques par des artistes du monde entier.", "Commence côté Ostbahnhof et termine au pont de l'Oberbaum.", 60],
    ["ber-memorial-mur", "Mémorial du Mur (Bernauer Straße)", "culture", "Mitte", "Bernauer Straße 111", 52.535, 13.39, 1, 2, "famille", "Le seul endroit où l'on comprend vraiment le Mur : chemin de ronde, mirador et no man's land.", "Monte sur la tour d'observation en face pour voir le dispositif d'en haut.", 90],
    ["ber-juedisches-museum", "Musée juif de Berlin", "culture", "Kreuzberg", "Lindenstraße 9-14", 52.502, 13.395, 2, 1, "famille", "Le bâtiment en zigzag de Daniel Libeskind, et deux mille ans d'histoire juive en Allemagne.", "La tour de l'Holocauste et le jardin de l'exil se vivent plus qu'ils ne se visitent.", 150],
    ["ber-reichstag", "Coupole du Reichstag", "culture", "Tiergarten", "Platz der Republik 1", 52.5186, 13.3762, 1, 1, "famille,petit-budget", "La coupole de verre du Parlement, avec une rampe en spirale au-dessus de la salle des députés.", "Gratuit, mais inscription obligatoire en ligne quelques jours avant.", 60],
    // ---- Nature ----
    ["ber-tempelhof", "Tempelhofer Feld", "nature", "Neukölln", "Tempelhofer Damm", 52.473, 13.401, 1, 2, "famille,petit-budget,insolite", "Un ancien aéroport devenu parc : on fait du vélo et du cerf-volant sur les pistes d'atterrissage.", "Loue un vélo et roule sur la piste principale, c'est irréel.", 120],
    ["ber-tiergarten", "Tiergarten", "nature", "Tiergarten", "Straße des 17. Juni", 52.5145, 13.35, 1, 1, "famille,romantique", "Le grand parc central de Berlin, entre la porte de Brandebourg et la colonne de la Victoire.", "Le Café am Neuen See, au bord du lac, est parfait l'été.", 120],
    // ---- Insolite ----
    ["ber-unterwelten", "Berliner Unterwelten", "insolite", "Wedding", "Brunnenstraße 105", 52.5485, 13.388, 2, 3, "cache,insolite", "Des visites guidées des bunkers et des tunnels sous Berlin, de la guerre froide à l'abri antiaérien.", "Réserve une visite en français ou en anglais à l'avance.", 90],
    ["ber-haus-schwarzenberg", "Haus Schwarzenberg", "insolite", "Mitte", "Rosenthaler Straße 39", 52.5245, 13.402, 1, 3, "cache,bobo", "Une cour couverte de street art, de cinéma indépendant et de petits musées, à côté des Hackesche Höfe propres et chics.", "Le petit musée d'Otto Weidt raconte comment il a caché des employés juifs.", 45],
    ["ber-mauerpark", "Mauerpark (dimanche)", "insolite", "Prenzlauer Berg", "Bernauer Straße 63-64", 52.543, 13.4025, 1, 2, "petit-budget,famille", "Le dimanche, un immense marché aux puces et un karaoké géant dans l'amphithéâtre du parc.", "Le karaoké commence l'après-midi : n'importe qui peut monter chanter.", 120],
    // ---- Activités ----
    ["ber-badeschiff", "Badeschiff", "activite", "Friedrichshain", "Eichenstraße 4", 52.4975, 13.453, 1, 2, "tendance", "Une piscine installée dans une ancienne barge, flottant sur la Spree.", "En été, viens en fin de journée pour le coucher du soleil sur l'eau.", 120],
    ["ber-spree", "Croisière sur la Spree", "activite", "Mitte", "Embarcadère de l'île aux Musées", 52.5195, 13.4005, 1, 1, "famille", "Une heure de bateau devant le Reichstag, la chancellerie et l'île aux Musées.", "Prends un bateau avec commentaire en anglais si tu ne parles pas allemand.", 60],
    // ---- Hôtels ----
    ["ber-generator-mitte", "Generator Berlin Mitte", "hotel", "Mitte", "Oranienburger Straße 65", 52.5245, 13.393, 1, 1, "petit-budget,tendance", "Une auberge design à deux pas des galeries de Mitte, avec chambres privées.", "Le bar organise des soirées presque tous les soirs.", 0, "https://staygenerator.com", 0],
    ["ber-michelberger", "Michelberger Hotel", "hotel", "Friedrichshain", "Warschauer Straße 39-40", 52.5065, 13.448, 1, 2, "bobo,tendance", "Un hôtel créatif dans une ancienne usine, à deux pas des clubs de Friedrichshain.", "Le restaurant de la cour est excellent même si tu ne dors pas sur place.", 0, "", 3],
    ["ber-oderberger", "Hotel Oderberger", "hotel", "Prenzlauer Berg", "Oderberger Straße 57", 52.539, 13.4065, 2, 2, "insolite,famille", "Un hôtel installé dans des bains publics de 1902, avec une piscine historique.", "La piscine est l'une des plus belles de Berlin.", 0, "", 4],
    ["ber-25hours-bikini", "25hours Hotel Bikini Berlin", "hotel", "Tiergarten", "Budapester Straße 40", 52.505, 13.338, 2, 1, "tendance,famille", "Un hôtel ludique avec vue sur les singes du zoo et un bar en rooftop.", "Demande une chambre côté jungle, avec vue sur le zoo.", 0, "", 4],
    ["ber-das-stue", "Das Stue", "hotel", "Tiergarten", "Drakestraße 1", 52.509, 13.346, 3, 2, "romantique", "Une ancienne ambassade des années 1930 transformée en hôtel élégant, en lisière du Tiergarten.", "La bibliothèque-bar est parfaite pour un verre au calme.", 0, "", 5],
    ["ber-adlon", "Hotel Adlon Kempinski", "hotel", "Mitte", "Unter den Linden 77", 52.516, 13.38, 3, 1, "romantique", "Le palace historique face à la porte de Brandebourg.", "Le hall et son éléphant de fontaine se visitent pour un thé.", 0, "", 5],
  ],
  streets: [
    {
      id: "ber-unter-den-linden", name: "Unter den Linden", aliases: ["Unter den Linden"], arrondissement: "Mitte", lat: 52.5172, lng: 13.3885,
      histoire: "La grande avenue de Berlin, de la porte de Brandebourg à l'île aux Musées, était d'abord un chemin de cavaliers vers le parc de chasse du Tiergarten. Les rois de Prusse l'ont bordée d'opéras, d'universités et de palais.",
      fait: { annee: "1647", texte: "Le Grand Électeur Frédéric-Guillaume fait planter les premiers tilleuls qui donnent son nom à l'avenue : « sous les tilleuls »." },
      anecdote: "En 1935, les tilleuls ont été abattus pour les travaux du métro et remplacés par des colonnes décorées. Les Berlinois ont protesté : une avenue « sous les tilleuls » sans tilleuls, c'était trop. Ils ont été replantés après la guerre.",
      aVoir: ["ber-adlon", "ber-neues-museum"],
    },
    {
      id: "ber-bernauer-strasse", name: "Bernauer Straße", aliases: ["Bernauer Strasse"], arrondissement: "Mitte", lat: 52.535, lng: 13.39,
      histoire: "Le Mur suivait exactement cette rue : les immeubles du côté sud étaient à l'Est, mais leur trottoir appartenait à l'Ouest. Il suffisait de sauter par la fenêtre pour changer de monde.",
      fait: { annee: "1961", texte: "En août, des habitants sautent depuis leurs fenêtres vers les pompiers de l'Ouest. Le 22 août, Ida Siekmann meurt en sautant : elle est l'une des premières victimes du Mur." },
      anecdote: "Le 15 août 1961, le jeune soldat est-allemand Conrad Schumann saute par-dessus les barbelés à l'angle de la rue. La photo de son saut, fusil à l'épaule, est devenue l'une des images les plus célèbres de la guerre froide.",
      aVoir: ["ber-memorial-mur", "ber-mauerpark"],
    },
    {
      id: "ber-oranienstrasse", name: "Oranienstraße", aliases: ["Oranienstrasse"], arrondissement: "Kreuzberg", lat: 52.5005, lng: 13.42,
      histoire: "La rue principale de Kreuzberg, coincée contre le Mur pendant la guerre froide, a accueilli les immigrés turcs, les squatteurs et les punks. Elle reste le cœur alternatif de Berlin.",
      fait: { annee: "1987", texte: "Le 1er mai, de violentes émeutes éclatent dans le quartier : elles marquent le début d'une longue tradition de manifestations du 1er mai à Kreuzberg." },
      anecdote: "Le club punk SO36, au numéro 190, porte le nom de l'ancien code postal du quartier, « Südost 36 ». Les Berlinois disent encore SO36 pour désigner ce coin de Kreuzberg, comme si la poste avait inventé une identité.",
      aVoir: ["ber-markthalle-neun", "ber-wuergeengel"],
    },
    {
      id: "ber-karl-marx-allee", name: "Karl-Marx-Allee", aliases: ["Stalinallee", "Karl Marx Allee"], arrondissement: "Friedrichshain", lat: 52.5175, lng: 13.43,
      histoire: "Construite par la RDA dans les années 1950 sous le nom de Stalinallee, l'avenue monumentale aligne des « palais pour les travailleurs » en style soviétique, longs de plusieurs centaines de mètres.",
      fait: { annee: "1953", texte: "Le 17 juin, la révolte ouvrière contre le régime est-allemand commence avec les ouvriers des chantiers de la Stalinallee." },
      anecdote: "En novembre 1961, Staline étant tombé en disgrâce, l'avenue est rebaptisée Karl-Marx-Allee du jour au lendemain, et sa statue disparaît pendant la nuit. Les plaques de rue, elles, ont été changées plus vite que les mentalités.",
      aVoir: ["ber-east-side-gallery"],
    },
  ],
  nights: [
    { district: "Friedrichshain", vibe: "La capitale de la techno : clubs mythiques dans d'anciennes centrales et usines.", venues: [
      { name: "Berghain", address: "Am Wriezener Bahnhof", kind: "Club techno", tip: "Sélection stricte à l'entrée, pas de photos à l'intérieur." },
      { name: "://about blank", address: "Markgrafendamm 24c", kind: "Club", tip: "Un club collectif avec un grand jardin." },
      { name: "Cassiopeia", address: "Revaler Straße 99", kind: "Club et concerts", tip: "Sur l'ancien site ferroviaire RAW." },
    ] },
    { district: "Kreuzberg", vibe: "Bars alternatifs, punk et cocktails au bord du canal.", venues: [
      { name: "SO36", address: "Oranienstraße 190", kind: "Concerts punk", tip: "Le club punk historique de Berlin." },
      { name: "Würgeengel", address: "Dresdener Straße 122", kind: "Cocktails", tip: "Ambiance rétro et feutrée." },
      { name: "Ankerklause", address: "Maybachufer 1", kind: "Bar", tip: "Un bar de marins au bord du Landwehrkanal." },
    ] },
    { district: "Neukölln", vibe: "Le quartier le plus jeune et le plus mélangé de Berlin.", venues: [
      { name: "Klunkerkranich", address: "Karl-Marx-Straße 66", kind: "Rooftop", tip: "Concerts et DJ sur le toit d'un parking." },
    ] },
    { district: "Mitte", vibe: "Salles de bal, speakeasies et cocktails chics.", venues: [
      { name: "Clärchens Ballhaus", address: "Auguststraße 24", kind: "Salle de bal", tip: "On y danse le swing et le tango." },
      { name: "Buck and Breck", address: "Brunnenstraße 177", kind: "Speakeasy", tip: "Sonne à la porte." },
    ] },
    { district: "Prenzlauer Berg", vibe: "Jardins à bière et soirées tranquilles en terrasse.", venues: [
      { name: "Prater Garten", address: "Kastanienallee 7-9", kind: "Jardin à bière", tip: "Le plus vieux de Berlin." },
    ] },
  ],
  diet: [
    { diet: "casher", name: "Mitte (Oranienburger Straße)", streets: "Oranienburger Straße, Tucholskystraße", text: "Autour de la Nouvelle Synagogue : cafés et épiceries casher, comme le Beth Café." },
    { diet: "casher", name: "Charlottenburg et Wilmersdorf", streets: "Autour du centre Chabad de la Münstersche Straße", text: "Restaurants et épiceries casher de la communauté de l'ouest de Berlin." },
    { diet: "halal", name: "Kreuzberg (Kottbusser Tor)", streets: "Oranienstraße, Adalbertstraße", text: "Le cœur turc de Berlin : döner, grillades et pâtisseries, souvent halal." },
    { diet: "halal", name: "Neukölln (Sonnenallee)", streets: "Sonnenallee", text: "La « rue arabe » de Berlin : restaurants libanais, syriens et palestiniens halal." },
  ],
};
