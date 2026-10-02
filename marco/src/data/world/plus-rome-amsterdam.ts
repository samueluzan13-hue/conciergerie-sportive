import type { Row } from "./types";

export const ROME_PLUS: Row[] = [
  // ---- Restos ----
  ["rom-flavio", "Flavio al Velavevodetto", "resto", "Testaccio", "Via di Monte Testaccio 97", 41.876, 12.4755, 2, 2, "famille", "Une trattoria creusée dans le mont Testaccio : on voit les amphores antiques derrière les vitres.", "Les classiques romains (carbonara, amatriciana, cacio e pepe) sont parfaits ici.", 90],
  ["rom-felice", "Felice a Testaccio", "resto", "Testaccio", "Via Mastro Giorgio 29", 41.879, 12.474, 2, 1, "tendance", "Le cacio e pepe mélangé à table devant toi, dans une institution de 1936.", "Réserve : la salle est toujours pleine.", 90],
  ["rom-pizzarium", "Pizzarium Bonci", "resto", "Prati", "Via della Meloria 43", 41.907, 12.4475, 1, 2, "petit-budget", "La pizza al taglio de Gabriele Bonci, garnitures créatives sur une pâte légère.", "À deux pas des musées du Vatican : idéal après la visite.", 20],
  ["rom-da-teo", "Trattoria Da Teo", "resto", "Trastevere", "Piazza dei Ponziani 7a", 41.8875, 12.477, 2, 2, "famille", "Une trattoria du Trastevere fréquentée par les Romains, en terrasse sur une place calme.", "Les artichauts à la romaine en saison sont à ne pas rater.", 90],
  ["rom-forno-roscioli", "Antico Forno Roscioli", "resto", "Campo de' Fiori", "Via dei Chiavari 34", 41.8945, 12.4735, 1, 2, "petit-budget", "La boulangerie historique pour la pizza bianca et les parts de pizza rouge.", "Prends une part de pizza rossa et mange-la sur le Campo de' Fiori.", 15],
  ["rom-pianostrada", "Pianostrada", "resto", "Campo de' Fiori", "Via delle Zoccolette 22", 41.893, 12.472, 2, 2, "tendance", "Une cuisine romaine moderne tenue par des femmes, avec un joli jardin intérieur.", "Les focaccias garnies sont la signature.", 90],
  ["rom-nonna-betta", "Nonna Betta", "resto", "Ghetto", "Via del Portico d'Ottavia 16", 41.8922, 12.4785, 2, 2, "famille", "La cuisine judéo-romaine traditionnelle au cœur du Ghetto.", "Goûte les fleurs de courgette frites et le carciofo alla giudia.", 90],
  ["rom-ai-marmi", "Pizzeria Ai Marmi", "resto", "Trastevere", "Viale di Trastevere 53", 41.886, 12.472, 1, 2, "petit-budget", "Une pizzeria bruyante aux tables de marbre, pizza fine et supplì.", "Surnommée « la morgue » à cause des tables de marbre : ambiance garantie.", 60],
  ["rom-mercato-centrale", "Mercato Centrale Roma", "resto", "Esquilino", "Via Giovanni Giolitti 36", 41.8995, 12.5005, 1, 1, "famille", "Une halle gourmande dans la gare Termini, pizza, pâtes fraîches et glaces.", "Pratique en arrivant à Rome par le train.", 60],
  // ---- Bars ----
  ["rom-drink-kong", "Drink Kong", "bar", "Monti", "Piazza di San Martino ai Monti 8", 41.8955, 12.498, 2, 2, "tendance", "Un bar à cocktails futuriste entre néons et esthétique japonaise, parmi les meilleurs du monde.", "Arrive tôt, c'est plein dès 22 h.", 75],
  ["rom-sorpasso", "Il Sorpasso", "bar", "Prati", "Via Properzio 31", 41.9055, 12.463, 2, 2, "tendance", "Le bar à aperitivo de Prati : charcuteries, vins et cocktails jusqu'à tard.", "Parfait pour l'apéritif après le Vatican.", 75],
  ["rom-terrazza-borromini", "Terrazza Borromini", "bar", "Centro Storico", "Via di Santa Maria dell'Anima 30", 41.8995, 12.4715, 3, 2, "romantique", "Une terrasse panoramique au-dessus de la Piazza Navona et des coupoles.", "Réserve une table au coucher du soleil.", 75],
  ["rom-salotto-42", "Salotto 42", "bar", "Centro Storico", "Piazza di Pietra 42", 41.8995, 12.48, 2, 2, "romantique", "Un salon-bar design face aux colonnes du temple d'Hadrien.", "La terrasse face aux colonnes antiques est magique le soir.", 60],
  // ---- Culture, nature, insolite ----
  ["rom-castel-sant-angelo", "Château Saint-Ange", "culture", "Prati", "Lungotevere Castello 50", 41.9031, 12.4663, 2, 1, "famille", "Le mausolée d'Hadrien devenu forteresse des papes, avec une terrasse sur tout Rome.", "Monte jusqu'à la terrasse de l'ange pour la vue sur Saint-Pierre.", 90],
  ["rom-capitolini", "Musées du Capitole", "culture", "Centro Storico", "Piazza del Campidoglio 1", 41.893, 12.4825, 2, 1, "famille", "La louve de Rome, Marc Aurèle à cheval et la plus belle vue sur le Forum.", "Le passage souterrain du Tabularium donne une vue imprenable sur le Forum.", 120],
  ["rom-gianicolo", "Terrasse du Janicule", "nature", "Trastevere", "Piazzale Giuseppe Garibaldi", 41.8915, 12.461, 1, 2, "romantique,petit-budget", "Le belvédère des Romains, avec tout le centre historique à tes pieds.", "Un coup de canon est tiré chaque jour à midi.", 45],
  ["rom-orto-botanico", "Orto Botanico di Roma", "nature", "Trastevere", "Largo Cristina di Svezia 23a", 41.892, 12.466, 1, 3, "cache,famille", "Un jardin botanique caché derrière un palais du Trastevere, avec un jardin japonais.", "Un vrai havre de calme loin de la foule.", 75],
  ["rom-palazzo-valentini", "Domus romaines du Palazzo Valentini", "insolite", "Centro Storico", "Via IV Novembre 119a", 41.896, 12.483, 2, 3, "cache,famille", "Des maisons romaines sous un palais, ressuscitées par des projections lumineuses.", "Visite sur réservation uniquement, en petits groupes.", 90],
  ["rom-regoli", "Pasticceria Regoli", "cafe", "Esquilino", "Via dello Statuto 60", 41.8945, 12.5025, 1, 2, "petit-budget", "Le maritozzo à la crème, la brioche romaine du petit-déjeuner, depuis 1916.", "Viens tôt le matin, les maritozzi partent vite.", 20],
  // ---- Activités ----
  ["rom-appia-velo", "Vélo sur la Via Appia Antica", "activite", "Appia Antica", "Via Appia Antica 175", 41.858, 12.516, 1, 2, "famille,romantique", "Pédaler sur l'antique voie romaine pavée, entre tombeaux et catacombes.", "Le dimanche, la voie est fermée aux voitures.", 180],
];

export const AMSTERDAM_PLUS: Row[] = [
  // ---- Restos ----
  ["ams-cafe-de-reiger", "Café de Reiger", "resto", "Jordaan", "Nieuwe Leliestraat 34", 52.3755, 4.882, 2, 2, "romantique", "Un café brun du Jordaan qui sert une cuisine néerlandaise simple et soignée.", "Viens en semaine, le soir, pour l'ambiance de quartier.", 90],
  ["ams-vleminckx", "Vleminckx de Sausmeester", "resto", "Negen Straatjes", "Voetboogstraat 33", 52.3672, 4.8905, 1, 1, "petit-budget", "Les meilleures frites d'Amsterdam, avec une vingtaine de sauces.", "Prends-les avec de la sauce « oorlog » (mayonnaise, satay et oignons).", 15],
  ["ams-greetje", "Restaurant Greetje", "resto", "Centrum · Dam", "Peperstraat 23", 52.374, 4.9045, 2, 2, "romantique", "La cuisine néerlandaise revisitée, avec des recettes anciennes remises au goût du jour.", "Le menu de dégustation hollandais est une belle découverte.", 120],
  ["ams-toko-joyce", "Toko Joyce", "resto", "De Wallen", "Nieuwmarkt 38", 52.3725, 4.9005, 1, 2, "petit-budget", "Des assiettes indonésiennes et surinamiennes à petit prix, sur la place du Nieuwmarkt.", "Commande une assiette garnie à emporter et mange-la sur la place.", 30],
  ["ams-fou-fow", "Fou Fow Ramen", "resto", "Jordaan", "Elandsgracht 2a", 52.37, 4.8805, 1, 2, "petit-budget", "Des ramens réconfortants, parfaits pour un soir de pluie.", "Le tonkotsu est la commande la plus populaire.", 45],
  ["ams-bakers-roasters", "Bakers & Roasters", "cafe", "De Pijp", "Eerste Jacob van Campenstraat 54", 52.357, 4.8915, 2, 2, "tendance", "Le brunch néo-zélandais devenu institution de De Pijp.", "Il y a souvent la queue le week-end : viens en semaine.", 60],
  ["ams-gartine", "Gartine", "cafe", "Negen Straatjes", "Taksteeg 7", 52.3685, 4.8915, 1, 3, "cache,romantique", "Un minuscule salon de thé caché dans une ruelle, avec des produits du potager des propriétaires.", "Le high tea se réserve.", 60],
  ["ams-laatste-kruimel", "De Laatste Kruimel", "cafe", "Centrum · Dam", "Langebrugsteeg 4", 52.37, 4.8935, 1, 2, "famille", "Des gâteaux et quiches maison, avec une petite terrasse sur le canal.", "Le gâteau du jour est toujours une bonne idée.", 30],
  // ---- Bars ----
  ["ams-t-smalle", "Café 't Smalle", "bar", "Jordaan", "Egelantiersgracht 12", 52.377, 4.8825, 1, 2, "romantique", "Un café brun avec une petite terrasse flottante sur l'un des plus jolis canaux.", "La terrasse au ras de l'eau est la meilleure place de la ville.", 60],
  ["ams-tales-spirits", "Tales & Spirits", "bar", "Centrum · Dam", "Lijnbaanssteeg 5-7", 52.377, 4.8935, 2, 2, "tendance", "Un bar à cocktails primé dans une ruelle du centre, ambiance de cabinet de curiosités.", "Réserve le week-end.", 75],
  ["ams-arendsnest", "Proeflokaal Arendsnest", "bar", "Jordaan", "Herengracht 90", 52.378, 4.889, 1, 2, "petit-budget", "Un bar qui ne sert que des bières néerlandaises, des dizaines à la pression.", "Demande une planche de dégustation.", 60],
  ["ams-skylounge", "SkyLounge", "bar", "Centrum · Dam", "Oosterdoksstraat 4", 52.377, 4.909, 2, 1, "romantique", "Un rooftop au 11e étage avec une vue sur la gare centrale et l'IJ.", "Monte au coucher du soleil.", 60],
  // ---- Culture, insolite ----
  ["ams-rembrandthuis", "Maison de Rembrandt", "culture", "Plantage", "Jodenbreestraat 4", 52.3694, 4.9012, 2, 2, "famille", "La maison et l'atelier où Rembrandt a vécu et peint pendant près de vingt ans.", "Ne rate pas la démonstration de gravure.", 75],
  ["ams-moco", "Moco Museum", "culture", "Museumkwartier", "Honthorststraat 20", 52.3583, 4.8818, 2, 1, "tendance", "Banksy et l'art urbain dans une villa face au Rijksmuseum.", "Réserve en ligne pour éviter la file.", 75],
  ["ams-artis", "Artis (zoo et Micropia)", "activite", "Plantage", "Plantage Kerklaan 38-40", 52.366, 4.9165, 2, 1, "famille", "Le plus vieux zoo des Pays-Bas, avec un planétarium et un musée des microbes.", "Micropia est unique au monde : à voir avec des enfants.", 180],
  ["ams-bloemenmarkt", "Bloemenmarkt", "insolite", "Negen Straatjes", "Singel, entre Koningsplein et Muntplein", 52.3665, 4.8915, 1, 1, "petit-budget", "Le marché aux fleurs installé sur des péniches le long du Singel.", "Les bulbes de tulipes se rapportent facilement.", 30],
  ["ams-poezenboot", "De Poezenboot", "insolite", "Centrum · Dam", "Singel 38G", 52.378, 4.8935, 1, 3, "cache,famille", "Un refuge pour chats installé sur une péniche, qui se visite.", "Horaires d'ouverture limités : vérifie avant d'y aller.", 20],
  // ---- Activités ----
  ["ams-heineken", "Heineken Experience", "activite", "De Pijp", "Stadhouderskade 78", 52.3578, 4.8919, 2, 1, "tendance", "La brasserie historique Heineken, en visite interactive avec dégustation.", "Réserve en ligne pour un créneau moins cher.", 90],
  ["ams-concertgebouw", "Concerts du midi au Concertgebouw", "activite", "Museumkwartier", "Concertgebouwplein 10", 52.3563, 4.879, 1, 2, "romantique,petit-budget", "Une des plus belles salles de concert du monde, avec des concerts gratuits à midi certains jours.", "Vérifie le calendrier des concerts gratuits du midi.", 45],
  ["ams-westerpark", "Westerpark et Westergas", "nature", "Oud-West", "Haarlemmerweg 8-10", 52.3865, 4.874, 1, 2, "bobo,famille", "Un grand parc autour d'une ancienne usine à gaz, avec bars, cinéma et marchés.", "Le marché du dimanche y est très sympa.", 120],
];
