import type { CityId } from "./cities";
import { WORLD_STREETS } from "./world-streets";
export interface StreetStory {
  id: string;
  /** ville (absent = Paris) */
  city?: CityId;
  name: string;
  aliases: string[];
  arrondissement: string;
  lat: number;
  lng: number;
  /** L'histoire de la rue : origine du nom, évolution */
  histoire: string;
  /** Un fait historique qui s'est déroulé dans la rue ou à proximité */
  fait: { annee: string; texte: string };
  /** L'anecdote qui fait sourire */
  anecdote: string;
  /** ids de spots à proximité */
  aVoir?: string[];
}

export const STREETS: StreetStory[] = [
  {
    id: "rivoli",
    name: "Rue de Rivoli",
    aliases: ["rivoli"],
    arrondissement: "1er et 4e",
    lat: 48.8625, lng: 2.3335,
    histoire:
      "Elle porte le nom de la victoire de Bonaparte à Rivoli, en Italie, en janvier 1797. Percée à partir de 1802, elle devait offrir à Paris une grande artère rectiligne et élégante, avec ses fameuses arcades uniformes le long des Tuileries.",
    fait: {
      annee: "1944",
      texte:
        "Pendant l'Occupation, le général von Choltitz, commandant allemand du Grand Paris, avait installé son quartier général à l'hôtel Meurice, rue de Rivoli. C'est là qu'il fut arrêté le 25 août 1944, jour de la Libération.",
    },
    anecdote:
      "Le règlement d'origine des arcades était ultra-snob : on voulait une rue chic, donc pas de commerces bruyants ou salissants sous les arcades. Deux siècles plus tard, c'est… la capitale du magnet tour Eiffel. L'histoire a de l'humour.",
    aVoir: ["galerie-vivienne", "vert-galant"],
  },
  {
    id: "paix",
    name: "Rue de la Paix",
    aliases: ["paix", "rue de la paix"],
    arrondissement: "2e",
    lat: 48.8691, lng: 2.3311,
    histoire:
      "Ouverte en 1806 sous le nom de rue Napoléon, elle est rebaptisée rue de la Paix en 1814, après la chute de l'Empire. Elle relie la place Vendôme à l'Opéra et devient vite l'adresse du luxe parisien.",
    fait: {
      annee: "1858",
      texte:
        "Charles Frederick Worth, considéré comme le père de la haute couture, ouvre sa maison au n°7. Quelques décennies plus tard, Cartier s'installe au n°13 : la rue devient le temple mondial de l'élégance.",
    },
    anecdote:
      "C'est la case la plus chère du Monopoly français. Autrement dit, des millions d'enfants ont fait faillite ici bien avant d'avoir un compte en banque.",
    aVoir: ["bar-hemingway"],
  },
  {
    id: "mouffetard",
    name: "Rue Mouffetard",
    aliases: ["mouffetard", "la mouffe"],
    arrondissement: "5e",
    lat: 48.8425, lng: 2.3497,
    histoire:
      "L'une des plus vieilles rues de Paris : elle suit le tracé de la voie romaine qui partait de Lutèce vers le sud et l'Italie. Son nom viendrait des « mouffettes », les odeurs pestilentielles qui remontaient de la Bièvre, rivière polluée par les tanneurs et teinturiers.",
    fait: {
      annee: "1922",
      texte:
        "Ernest Hemingway s'installe avec sa femme Hadley tout près, au 74 rue du Cardinal-Lemoine. Il décrira le quartier et son marché dans « Paris est une fête ».",
    },
    anecdote:
      "Traduction libre du nom : « la rue qui pue ». Aujourd'hui, ça sent le fromage, le pain chaud et la crêpe. Belle reconversion.",
    aVoir: ["arenes-lutece", "mosquee-the"],
  },
  {
    id: "rosiers",
    name: "Rue des Rosiers",
    aliases: ["rosiers", "rosier"],
    arrondissement: "4e",
    lat: 48.8572, lng: 2.3592,
    histoire:
      "Son nom viendrait des rosiers qui poussaient dans les jardins longeant l'enceinte de Philippe Auguste, au XIIIe siècle. Elle est depuis longtemps le cœur du « Pletzl », le quartier juif du Marais.",
    fait: {
      annee: "1982",
      texte:
        "Le 9 août 1982, un attentat frappe le restaurant Jo Goldenberg, au n°7 : six personnes sont tuées. Une plaque rappelle aujourd'hui la mémoire des victimes.",
    },
    anecdote:
      "La vraie guerre ici, c'est celle du falafel : deux files d'attente, deux écoles, à quelques mètres l'une de l'autre. Marco refuse de prendre parti. (Marco ment, il a son préféré.)",
    aVoir: ["musee-chasse"],
  },
  {
    id: "saint-denis",
    name: "Rue Saint-Denis",
    aliases: ["saint denis", "st denis", "saint-denis"],
    arrondissement: "1er et 2e",
    lat: 48.8641, lng: 2.3496,
    histoire:
      "Une des plus anciennes rues de Paris, sur la route menant à la basilique de Saint-Denis. C'était la voie royale : les rois l'empruntaient pour leurs entrées solennelles dans la capitale.",
    fait: {
      annee: "1672",
      texte:
        "Au bout de la rue, la Porte Saint-Denis est érigée pour célébrer les victoires de Louis XIV sur le Rhin. L'arc de triomphe avant l'Arc de Triomphe.",
    },
    anecdote:
      "Les rois entraient dans Paris par cette rue… et en ressortaient aussi par là, direction la basilique où ils étaient enterrés. Aller-retour garanti.",
    aVoir: ["passage-panoramas", "syndicat"],
  },
  {
    id: "chat-qui-peche",
    name: "Rue du Chat-qui-Pêche",
    aliases: ["chat qui peche", "chat-qui-peche", "chat qui pêche"],
    arrondissement: "5e",
    lat: 48.8531, lng: 2.3456,
    histoire:
      "Ouverte vers 1540, c'est l'une des rues les plus étroites de Paris : moins de deux mètres par endroits. Avant la construction des quais, elle descendait directement jusqu'à la Seine. Son nom viendrait d'une enseigne.",
    fait: {
      annee: "1540",
      texte:
        "À l'époque, la rue servait d'accès au fleuve pour les habitants du quartier. Elle a survécu aux grands travaux d'Haussmann qui ont effacé tant de ruelles médiévales.",
    },
    anecdote:
      "La légende raconte qu'un chat noir y pêchait les poissons d'une seule patte. Les étudiants du coin, persuadés que c'était le diable, l'auraient… jeté à la Seine. Le chat a gagné : 500 ans plus tard, c'est lui qui a la rue.",
    aVoir: ["shakespeare", "caveau-huchette"],
  },
  {
    id: "montmorency",
    name: "Rue de Montmorency",
    aliases: ["montmorency", "nicolas flamel"],
    arrondissement: "3e",
    lat: 48.8633, lng: 2.3537,
    histoire:
      "Elle doit son nom à l'hôtel des seigneurs de Montmorency qui s'y trouvait. Au n°51 se dresse la maison de Nicolas Flamel, construite en 1407, souvent présentée comme l'une des plus anciennes maisons de Paris.",
    fait: {
      annee: "1407",
      texte:
        "Nicolas Flamel, écrivain public et libraire enrichi, fait bâtir cette maison pour y loger gratuitement des pauvres, à condition qu'ils prient pour son âme. Les inscriptions sont toujours visibles sur la façade.",
    },
    anecdote:
      "Après sa mort, on a prêté à Flamel des pouvoirs d'alchimiste et la fameuse pierre philosophale. Résultat : il apparaît dans Harry Potter. Pas mal pour un écrivain public du XVe siècle.",
    aVoir: ["musee-chasse", "candelaria"],
  },
  {
    id: "martyrs",
    name: "Rue des Martyrs",
    aliases: ["martyrs", "martyr"],
    arrondissement: "9e et 18e",
    lat: 48.8804, lng: 2.3399,
    histoire:
      "Elle monte vers Montmartre, le « mont des Martyrs » : la tradition veut que saint Denis, premier évêque de Paris, y ait été martyrisé au IIIe siècle. Aujourd'hui, c'est une des rues commerçantes les plus gourmandes de Paris.",
    fait: {
      annee: "1534",
      texte:
        "Le 15 août 1534, Ignace de Loyola et ses compagnons prononcent leurs vœux dans une chapelle de Montmartre, tout près : c'est l'acte fondateur des Jésuites.",
    },
    anecdote:
      "Selon la légende, saint Denis, décapité, aurait ramassé sa tête et marché plusieurs kilomètres en la tenant dans ses mains. Le tout premier « à emporter » de Paris.",
    aVoir: ["vie-romantique"],
  },
  {
    id: "vaugirard",
    name: "Rue de Vaugirard",
    aliases: ["vaugirard"],
    arrondissement: "6e et 15e",
    lat: 48.8434, lng: 2.3131,
    histoire:
      "Elle menait autrefois au village de Vaugirard, rattaché à Paris en 1860. Avec plus de 4 km, c'est la plus longue rue de Paris.",
    fait: {
      annee: "1615",
      texte:
        "Marie de Médicis fait construire le palais du Luxembourg, au bord de la rue. Il abrite aujourd'hui le Sénat.",
    },
    anecdote:
      "Faire la rue de Vaugirard en entier à pied, c'est plus de 4 km. Si tu le fais, Marco t'offre moralement un croissant. Moralement.",
    aVoir: ["zadkine"],
  },
  {
    id: "lappe",
    name: "Rue de Lappe",
    aliases: ["lappe"],
    arrondissement: "11e",
    lat: 48.8541, lng: 2.3727,
    histoire:
      "Rue étroite à deux pas de la Bastille, elle doit son nom à Girard de Lappe, un maraîcher qui possédait des terrains ici. Au début du XXe siècle, elle devient la rue des bals musette, où Auvergnats et musiciens italiens inventent un son très parisien.",
    fait: {
      annee: "1789",
      texte:
        "À quelques centaines de mètres, le 14 juillet 1789, la foule prend la forteresse de la Bastille. La Révolution commence au coin de la rue.",
    },
    anecdote:
      "La musette, c'est le mariage improbable de la cabrette auvergnate et de l'accordéon des musiciens italiens. Deux communautés qui ne parlaient pas la même langue, une seule piste de danse : Paris dans toute sa splendeur.",
    aVoir: ["coulee-verte", "baron-rouge"],
  },
  {
    id: "cremieux",
    name: "Rue Crémieux",
    aliases: ["cremieux", "crémieux"],
    arrondissement: "12e",
    lat: 48.8467, lng: 2.3707,
    histoire:
      "Petite rue pavée et piétonne bordée de maisons basses aux façades colorées. Elle porte le nom d'Adolphe Crémieux, avocat et ministre de la Justice.",
    fait: {
      annee: "1870",
      texte:
        "Adolphe Crémieux signe le décret qui porte son nom, accordant la citoyenneté française aux Juifs d'Algérie.",
    },
    anecdote:
      "Devenue star d'Instagram, la rue a vu défiler tant de shootings photo que les riverains ont demandé à pouvoir la fermer certains jours. Un compte s'est même moqué des poses des influenceurs. Viens, admire… et chuchote.",
    aVoir: ["coulee-verte", "baron-rouge"],
  },
  {
    id: "lepic",
    name: "Rue Lepic",
    aliases: ["lepic"],
    arrondissement: "18e",
    lat: 48.8855, lng: 2.3355,
    histoire:
      "Rue sinueuse qui grimpe la butte Montmartre en lacets, tracée pour faciliter la montée des charrettes. Elle porte le nom du général Lepic, héros des guerres napoléoniennes. Le Moulin de la Galette veille au sommet.",
    fait: {
      annee: "1886",
      texte:
        "Vincent van Gogh s'installe au 54 rue Lepic avec son frère Théo. Il y peindra de nombreuses vues de Montmartre et de ses moulins pendant deux ans.",
    },
    anecdote:
      "Au n°15 se trouve le Café des Deux Moulins, où travaille Amélie Poulain. Des fans du monde entier viennent y casser la croûte d'une crème brûlée à la petite cuillère.",
    aVoir: ["tres-particulier", "musee-montmartre"],
  },
  {
    id: "faubourg-saint-honore",
    name: "Rue du Faubourg-Saint-Honoré",
    aliases: ["faubourg saint honore", "faubourg saint-honoré", "fbg saint honore", "elysee"],
    arrondissement: "8e",
    lat: 48.8707, lng: 2.3165,
    histoire:
      "Prolongement hors les murs de la rue Saint-Honoré, elle devient au XVIIIe siècle l'adresse des hôtels particuliers de l'aristocratie. Aujourd'hui : palais de l'Élysée, ambassades et grandes maisons de mode.",
    fait: {
      annee: "1848",
      texte:
        "Le palais de l'Élysée, au n°55, ancienne demeure de la marquise de Pompadour, devient la résidence du président de la République : Louis-Napoléon Bonaparte, premier président élu, s'y installe.",
    },
    anecdote:
      "En 1899, le président Félix Faure meurt à l'Élysée dans des circonstances… galantes. Clemenceau aurait lâché : « Il voulait être César, il ne fut que Pompée. » Le trash talk politique ne date pas d'hier.",
    aVoir: ["petit-palais"],
  },
  {
    id: "champs-elysees",
    name: "Avenue des Champs-Élysées",
    aliases: ["champs elysees", "champs", "champs-élysées", "champs élysées"],
    arrondissement: "8e",
    lat: 48.8698, lng: 2.3075,
    histoire:
      "Au XVIIe siècle, André Le Nôtre, le jardinier de Versailles, trace une grande perspective dans le prolongement des Tuileries. D'abord promenade champêtre, elle devient « la plus belle avenue du monde ».",
    fait: {
      annee: "1944",
      texte:
        "Le 26 août 1944, au lendemain de la Libération, le général de Gaulle descend l'avenue à pied, acclamé par une foule immense.",
    },
    anecdote:
      "Dans la mythologie grecque, les Champs Élysées sont… le séjour des morts vertueux. L'avenue la plus animée de Paris porte donc le nom du paradis des défunts. Ambiance.",
    aVoir: ["petit-palais"],
  },
  {
    id: "oberkampf",
    name: "Rue Oberkampf",
    aliases: ["oberkampf", "oberkampf"],
    arrondissement: "11e",
    lat: 48.8653, lng: 2.3737,
    histoire:
      "Elle honore Christophe-Philippe Oberkampf, industriel qui a rendu célèbre la toile de Jouy au XVIIIe siècle. Longtemps populaire et ouvrière, elle est devenue l'une des rues de la nuit parisienne.",
    fait: {
      annee: "1852",
      texte:
        "Tout près, le Cirque d'Hiver est inauguré. Ce cirque en dur, toujours en activité, est l'un des plus anciens du monde.",
    },
    anecdote:
      "On raconte que Napoléon, en visite dans la manufacture d'Oberkampf, aurait retiré sa propre Légion d'honneur pour l'épingler sur l'industriel. Le genre de cadeau qu'on ne refuse pas.",
    aVoir: ["clown-bar", "mary-celeste", "perchoir"],
  },
  {
    id: "bac",
    name: "Rue du Bac",
    aliases: ["bac", "rue du bac"],
    arrondissement: "7e",
    lat: 48.8545, lng: 2.3255,
    histoire:
      "Son nom vient du bac, un bateau qui permettait de traverser la Seine au XVIe siècle, notamment pour transporter les pierres destinées à la construction du palais des Tuileries.",
    fait: {
      annee: "1830",
      texte:
        "Au n°140, dans la chapelle des Filles de la Charité, une jeune religieuse, Catherine Labouré, rapporte des apparitions de la Vierge. La chapelle de la Médaille miraculeuse attire aujourd'hui des pèlerins du monde entier.",
    },
    anecdote:
      "Au n°46, chez Deyrolle, tu peux croiser un ours, un lion ou un zèbre… empaillés, depuis le XIXe siècle. La rue la plus chic du 7e cache le zoo le plus calme de Paris.",
    aVoir: ["deyrolle", "flore"],
  },
  {
    id: "montorgueil",
    name: "Rue Montorgueil",
    aliases: ["montorgueil"],
    arrondissement: "1er et 2e",
    lat: 48.8651, lng: 2.3469,
    histoire:
      "Son nom viendrait du « mont orgueilleux », une petite butte du quartier. Rue marchande depuis le Moyen Âge, elle alimentait les Halles toutes proches, le « ventre de Paris ».",
    fait: {
      annee: "1730",
      texte:
        "Nicolas Stohrer, pâtissier de la reine Marie Leszczynska, ouvre sa boutique au n°51. C'est aujourd'hui la plus ancienne pâtisserie de Paris.",
    },
    anecdote:
      "Le baba au rhum serait né parce que le roi Stanislas, père de la reine, trouvait sa brioche trop sèche. Il l'a arrosée d'alcool. Un problème, une solution.",
    aVoir: ["frenchie", "passage-panoramas"],
  },
  {
    id: "huchette",
    name: "Rue de la Huchette",
    aliases: ["huchette"],
    arrondissement: "5e",
    lat: 48.8528, lng: 2.3463,
    histoire:
      "Rue médiévale du Quartier Latin, elle doit son nom à une ancienne enseigne. Longtemps rue d'étudiants et de rôtisseurs, elle est aujourd'hui couverte de restaurants… à éviter pour la plupart.",
    fait: {
      annee: "1957",
      texte:
        "Le Théâtre de la Huchette commence à jouer « La Cantatrice chauve » et « La Leçon » d'Ionesco. Il les joue depuis, sans interruption : un record mondial.",
    },
    anecdote:
      "Des générations de spectateurs ont vu la même pièce, avec plusieurs générations de comédiens. La cantatrice, elle, est toujours chauve.",
    aVoir: ["caveau-huchette", "shakespeare"],
  },
  {
    id: "francs-bourgeois",
    name: "Rue des Francs-Bourgeois",
    aliases: ["francs bourgeois", "francs-bourgeois"],
    arrondissement: "3e et 4e",
    lat: 48.8578, lng: 2.3615,
    histoire:
      "Au XIVe siècle, une maison d'aumône y accueillait des pauvres dits « francs », c'est-à-dire exemptés d'impôts parce qu'ils ne pouvaient pas payer. La rue traverse aujourd'hui le cœur du Marais, entre hôtels particuliers et boutiques.",
    fait: {
      annee: "1880",
      texte:
        "Le musée Carnavalet, consacré à l'histoire de Paris, ouvre au public dans l'hôtel où avait vécu Madame de Sévigné, au bout de la rue.",
    },
    anecdote:
      "Ironie de l'histoire : la rue qui porte le nom de pauvres dispensés d'impôts est aujourd'hui l'une des plus chères de Paris pour faire du shopping.",
    aVoir: ["musee-chasse"],
  },
  {
    id: "place-vosges",
    name: "Place des Vosges",
    aliases: ["vosges", "place royale"],
    arrondissement: "3e et 4e",
    lat: 48.8556, lng: 2.3655,
    histoire:
      "Inaugurée en 1612 sous le nom de place Royale, c'est la plus ancienne place planifiée de Paris : 36 pavillons identiques en brique et pierre autour d'un jardin.",
    fait: {
      annee: "1832",
      texte:
        "Victor Hugo s'installe au n°6, où il vit jusqu'en 1848 et écrit une partie des Misérables. Son appartement est aujourd'hui un musée gratuit.",
    },
    anecdote:
      "Pourquoi « des Vosges » ? En 1800, on l'a rebaptisée en l'honneur du département des Vosges, le premier à avoir payé ses impôts. Être bon élève paie… littéralement.",
    aVoir: ["musee-chasse", "coulee-verte"],
  },
  {
    id: "ferronnerie",
    name: "Rue de la Ferronnerie",
    aliases: ["ferronnerie"],
    arrondissement: "1er",
    lat: 48.8604, lng: 2.3478,
    histoire:
      "Son nom vient des ferronniers qui y tenaient boutique au Moyen Âge, près des Halles. Une petite rue étroite… qui a changé l'histoire de France.",
    fait: {
      annee: "1610",
      texte:
        "Le 14 mai 1610, le carrosse d'Henri IV est bloqué dans la rue par un encombrement. François Ravaillac en profite pour poignarder le roi. Une plaque au sol marque l'endroit.",
    },
    anecdote:
      "Henri IV est peut-être la plus célèbre victime d'un embouteillage parisien. Depuis, les Parisiens ont gardé les bouchons, mais heureusement pas le reste.",
    aVoir: ["duc-lombards"],
  },
  {
    id: "haussmann",
    name: "Boulevard Haussmann",
    aliases: ["haussmann", "bd haussmann"],
    arrondissement: "8e et 9e",
    lat: 48.8738, lng: 2.3293,
    histoire:
      "Il porte le nom du baron Haussmann, préfet de la Seine de 1853 à 1870, qui a transformé Paris : grands boulevards, immeubles alignés, parcs, égouts. Le Paris qu'on connaît, c'est lui.",
    fait: {
      annee: "1907",
      texte:
        "Marcel Proust s'installe au 102 boulevard Haussmann. Il fait tapisser sa chambre de liège pour s'isoler du bruit et y écrit une grande partie de « À la recherche du temps perdu ».",
    },
    anecdote:
      "Haussmann a fait démolir sa propre maison natale pour percer… le boulevard qui porte son nom. Le sens du sacrifice, ou de la communication.",
    aVoir: ["nissim-camondo"],
  },
  {
    id: "cortot",
    name: "Rue Cortot",
    aliases: ["cortot"],
    arrondissement: "18e",
    lat: 48.8877, lng: 2.3405,
    histoire:
      "Petite rue calme du sommet de Montmartre, nommée d'après le sculpteur Jean-Pierre Cortot. Au n°12, la plus vieille maison de la Butte a accueilli des dizaines d'artistes.",
    fait: {
      annee: "1876",
      texte:
        "Renoir loue un atelier au 12 rue Cortot et y peint une partie du « Bal du moulin de la Galette ». La maison abrite aujourd'hui le musée de Montmartre.",
    },
    anecdote:
      "Le compositeur Erik Satie vivait au n°6 dans une chambre si petite qu'il l'appelait « le placard ». Il y a vécu une histoire passionnée avec la peintre Suzanne Valadon, qui habitait… au n°12, juste à côté.",
    aVoir: ["musee-montmartre", "tres-particulier"],
  },
  {
    id: "rennes",
    name: "Rue de Rennes",
    aliases: ["rennes"],
    arrondissement: "6e",
    lat: 48.8476, lng: 2.3289,
    histoire:
      "Percée sous le Second Empire pour relier Saint-Germain-des-Prés à la gare Montparnasse, d'où partaient les trains vers la Bretagne… et Rennes.",
    fait: {
      annee: "1944",
      texte:
        "Le 25 août 1944, le général von Choltitz signe la reddition des troupes allemandes de Paris à la gare Montparnasse, au bout de la rue.",
    },
    anecdote:
      "En 1895, un train arrivant de Granville rate son freinage, traverse la façade de l'ancienne gare Montparnasse et finit le nez sur la place. La photo est restée célèbre. Question retard, il était plutôt en avance.",
    aVoir: ["zadkine"],
  },
  {
    id: "saint-jacques",
    name: "Rue Saint-Jacques",
    aliases: ["saint jacques", "st jacques", "saint-jacques"],
    arrondissement: "5e",
    lat: 48.8478, lng: 2.3434,
    histoire:
      "C'est l'ancien axe nord-sud de la Lutèce romaine. Au Moyen Âge, elle devient le point de départ parisien des pèlerins vers Saint-Jacques-de-Compostelle.",
    fait: {
      annee: "1253",
      texte:
        "Robert de Sorbon fonde tout près un collège pour étudiants pauvres en théologie : la future Sorbonne, qui donnera son nom à l'université.",
    },
    anecdote:
      "Des pèlerins partaient d'ici pour marcher jusqu'en Espagne, à plus de 1 500 km. C'est à ce jour l'itinéraire le plus long que Marco n'ait jamais osé proposer.",
    aVoir: ["shakespeare", "arenes-lutece"],
  },
  {
    id: "faubourg-saint-antoine",
    name: "Rue du Faubourg-Saint-Antoine",
    aliases: ["faubourg saint antoine", "faubourg saint-antoine"],
    arrondissement: "11e et 12e",
    lat: 48.8515, lng: 2.3775,
    histoire:
      "Depuis le Moyen Âge, le faubourg est le royaume des ébénistes et artisans du meuble. Ses cours et passages cachent encore des ateliers.",
    fait: {
      annee: "1789",
      texte:
        "En avril 1789, l'émeute de la manufacture Réveillon, spécialisée dans le papier peint, éclate dans le faubourg. Quelques semaines plus tard, les faubouriens participent à la prise de la Bastille.",
    },
    anecdote:
      "En 1783, dans le jardin de cette même manufacture Réveillon, une montgolfière décolle avec un humain à bord (encore attaché au sol). Du papier peint à la conquête du ciel, il n'y a qu'un pas.",
    aVoir: ["baron-rouge", "coulee-verte"],
  },
  {
    id: "vieille-du-temple",
    name: "Rue Vieille-du-Temple",
    aliases: ["vieille du temple", "vieille-du-temple"],
    arrondissement: "3e et 4e",
    lat: 48.8594, lng: 2.3601,
    histoire:
      "Elle menait à l'enclos des Templiers, au nord du Marais. Longue rue du Marais, elle mêle hôtels particuliers, galeries et bars.",
    fait: {
      annee: "1407",
      texte:
        "Le 23 novembre 1407, Louis d'Orléans, frère du roi Charles VI, est assassiné dans la rue sur ordre de Jean sans Peur. Ce meurtre déclenche la guerre civile entre Armagnacs et Bourguignons.",
    },
    anecdote:
      "La tour du Temple, où Louis XVI fut emprisonné, a été rasée sur ordre de Napoléon en 1808 pour éviter qu'elle ne devienne un lieu de pèlerinage royaliste. Napoléon : champion du « circulez, y a rien à voir ».",
    aVoir: ["musee-chasse", "candelaria"],
  },
  {
    id: "abreuvoir",
    name: "Rue de l'Abreuvoir",
    aliases: ["abreuvoir", "maison rose"],
    arrondissement: "18e",
    lat: 48.8875, lng: 2.3385,
    histoire:
      "Son nom vient de l'ancien chemin qui menait les chevaux et le bétail à l'abreuvoir de Montmartre. À l'angle, la Maison Rose, peinte par Utrillo, est une des images les plus célèbres de la Butte.",
    fait: {
      annee: "1860",
      texte:
        "Montmartre, jusque-là commune indépendante, est annexée à Paris avec d'autres villages. Les vignes et moulins deviennent alors des curiosités parisiennes.",
    },
    anecdote:
      "La Maison Rose a été peinte par Utrillo… qui n'avait pas un sou et payait souvent ses verres avec des tableaux. Les tableaux valent aujourd'hui un peu plus que les verres.",
    aVoir: ["musee-montmartre", "tres-particulier"],
  },
];

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[-']/g, " ")
    .replace(/\b(rue|avenue|av|boulevard|bd|place|de la|du|des|de|d|l|la|le)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function findStreet(query: string, city?: CityId): StreetStory | undefined {
  const q = normalize(query);
  if (!q) return undefined;
  const STREETS = city ? cityStreets(city) : ALL();
  return (
    STREETS.find((s) => normalize(s.name) === q || s.aliases.some((a) => normalize(a) === q)) ??
    STREETS.find((s) => normalize(s.name).includes(q) || s.aliases.some((a) => normalize(a).includes(q))) ??
    STREETS.find((s) => q.includes(normalize(s.name)) || s.aliases.some((a) => q.includes(normalize(a))))
  );
}

const ALL = () => STREETS;

export function suggestStreets(query: string, max = 5): StreetStory[] {
  const q = normalize(query);
  if (!q) return [];
  return STREETS.filter(
    (s) => normalize(s.name).includes(q) || s.aliases.some((a) => normalize(a).startsWith(q)),
  ).slice(0, max);
}

STREETS.push(...WORLD_STREETS);

export const streetCity = (s: StreetStory): CityId => s.city ?? "paris";
export const cityStreets = (city: CityId) => STREETS.filter((s) => streetCity(s) === city);
