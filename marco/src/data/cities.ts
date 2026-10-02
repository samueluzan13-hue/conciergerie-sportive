// Les villes de Marco. Paris est la ville d'origine ; chaque ville a ses quartiers, son plan dessiné
// (fleuve, mer, parcs, monuments) et ses données (lieux, rues racontées, soirées, casher / halal).

export type CityId = "paris" | "madrid" | "barcelone" | "londres" | "lisbonne" | "rome" | "amsterdam" | "new-york" | "berlin";

type LatLng = [number, number];

export interface District {
  name: string;
  lat: number;
  lng: number;
}

export interface CityGeo {
  /** cadre du plan : ouest, est (longitudes), nord, sud (latitudes) */
  bounds: { w: number; e: number; n: number; s: number };
  /** limite dessinée de la ville (périphérique à Paris) ; sinon tout le cadre est « ville » */
  outline?: LatLng[];
  /** fleuves (lignes) et mer (surfaces) */
  water: { pts: LatLng[]; width?: number; fill?: boolean }[];
  parks: { lat: number; lng: number; r: number }[];
  landmarks: { name: string; lat: number; lng: number }[];
  /** point de départ et largeur de la vue initiale (unités du plan, sur 1000) */
  start: LatLng;
  startWidth: number;
}

export interface City {
  id: CityId;
  name: string;
  country: string;
  /** code IATA de la ville (tous ses aéroports) */
  iata: string;
  currency: string;
  /** langue parlée sur place, pour les conseils de Marco */
  language: string;
  tagline: string;
  center: { lat: number; lng: number };
  districts: District[];
  geo: CityGeo;
}

const PARIS_GEO: CityGeo = {
  bounds: { w: 2.245, e: 2.425, n: 48.908, s: 48.81 },
  outline: [
    [48.901, 2.37], [48.899, 2.389], [48.888, 2.399], [48.878, 2.41], [48.862, 2.414], [48.846, 2.414], [48.834, 2.411],
    [48.827, 2.396], [48.82, 2.374], [48.817, 2.356], [48.816, 2.34], [48.82, 2.313], [48.827, 2.292], [48.835, 2.277],
    [48.844, 2.264], [48.856, 2.256], [48.87, 2.259], [48.878, 2.28], [48.885, 2.293], [48.896, 2.315], [48.901, 2.335],
  ],
  water: [
    { width: 13, pts: [
      [48.8265, 2.415], [48.833, 2.39], [48.8395, 2.376], [48.845, 2.366], [48.849, 2.36], [48.852, 2.354], [48.8535, 2.348],
      [48.8565, 2.342], [48.8585, 2.335], [48.862, 2.325], [48.864, 2.312], [48.8635, 2.301], [48.859, 2.292], [48.854, 2.285],
      [48.847, 2.278], [48.8395, 2.269], [48.834, 2.258],
    ] },
    { width: 4, pts: [[48.8858, 2.3702], [48.8784, 2.3703], [48.8716, 2.3653], [48.8648, 2.3667], [48.8572, 2.3683], [48.8502, 2.3661]] },
  ],
  parks: [
    { lat: 48.8462, lng: 2.3372, r: 16 }, { lat: 48.8635, lng: 2.3275, r: 14 }, { lat: 48.8799, lng: 2.3828, r: 15 },
    { lat: 48.8794, lng: 2.3088, r: 11 }, { lat: 48.8558, lng: 2.2983, r: 15 }, { lat: 48.844, lng: 2.359, r: 14 }, { lat: 48.821, lng: 2.338, r: 14 },
  ],
  landmarks: [
    { name: "Tour Eiffel", lat: 48.8584, lng: 2.2945 }, { name: "Arc de Triomphe", lat: 48.8738, lng: 2.295 },
    { name: "Louvre", lat: 48.8606, lng: 2.3376 }, { name: "Notre-Dame", lat: 48.853, lng: 2.3499 },
    { name: "Sacré-Cœur", lat: 48.8867, lng: 2.3431 }, { name: "Bastille", lat: 48.8532, lng: 2.3691 },
    { name: "Panthéon", lat: 48.8462, lng: 2.3464 }, { name: "Montparnasse", lat: 48.8421, lng: 2.3219 },
  ],
  start: [48.861, 2.347],
  startWidth: 620,
};

export const CITIES: City[] = [
  {
    id: "paris", name: "Paris", country: "France", iata: "PAR", currency: "EUR", language: "français",
    tagline: "La ville de Marco, arrondissement par arrondissement.",
    center: { lat: 48.8566, lng: 2.3522 },
    districts: [], // à Paris, on utilise les quartiers (QUARTIERS) et les arrondissements
    geo: PARIS_GEO,
  },
  {
    id: "madrid", name: "Madrid", country: "Espagne", iata: "MAD", currency: "EUR", language: "espagnol",
    tagline: "Tapas tardives, musées immenses et nuits qui finissent au petit matin.",
    center: { lat: 40.4168, lng: -3.7038 },
    districts: [
      { name: "Sol · Centro", lat: 40.4168, lng: -3.7038 }, { name: "Malasaña", lat: 40.4265, lng: -3.7045 },
      { name: "Chueca", lat: 40.4228, lng: -3.6973 }, { name: "La Latina", lat: 40.4115, lng: -3.7105 },
      { name: "Lavapiés", lat: 40.4087, lng: -3.701 }, { name: "Barrio de las Letras", lat: 40.414, lng: -3.698 },
      { name: "Salamanca", lat: 40.429, lng: -3.68 }, { name: "Retiro", lat: 40.4153, lng: -3.6845 },
      { name: "Chamberí", lat: 40.435, lng: -3.703 }, { name: "Palacio", lat: 40.418, lng: -3.714 },
    ],
    geo: {
      bounds: { w: -3.745, e: -3.665, n: 40.458, s: 40.385 },
      water: [{ width: 7, pts: [[40.445, -3.728], [40.43, -3.727], [40.418, -3.724], [40.408, -3.719], [40.399, -3.712], [40.392, -3.7], [40.387, -3.69]] }],
      parks: [{ lat: 40.4153, lng: -3.6844, r: 30 }, { lat: 40.4245, lng: -3.7177, r: 10 }, { lat: 40.4405, lng: -3.693, r: 6 }],
      landmarks: [
        { name: "Palacio Real", lat: 40.418, lng: -3.7143 }, { name: "Prado", lat: 40.4138, lng: -3.6921 },
        { name: "Puerta del Sol", lat: 40.4169, lng: -3.7035 }, { name: "Plaza Mayor", lat: 40.4155, lng: -3.7074 },
        { name: "Temple de Debod", lat: 40.424, lng: -3.7177 }, { name: "Puerta de Alcalá", lat: 40.42, lng: -3.6887 },
      ],
      start: [40.417, -3.702], startWidth: 640,
    },
  },
  {
    id: "barcelone", name: "Barcelone", country: "Espagne", iata: "BCN", currency: "EUR", language: "catalan et espagnol",
    tagline: "Gaudí, la mer au bout de la rue et des vermouths au soleil.",
    center: { lat: 41.387, lng: 2.17 },
    districts: [
      { name: "Barri Gòtic", lat: 41.383, lng: 2.1765 }, { name: "El Born", lat: 41.385, lng: 2.1825 },
      { name: "El Raval", lat: 41.38, lng: 2.169 }, { name: "Eixample", lat: 41.391, lng: 2.163 },
      { name: "Gràcia", lat: 41.403, lng: 2.156 }, { name: "Barceloneta", lat: 41.38, lng: 2.189 },
      { name: "Poble-sec", lat: 41.374, lng: 2.162 }, { name: "Poblenou", lat: 41.4, lng: 2.2 },
      { name: "Sant Antoni", lat: 41.378, lng: 2.161 }, { name: "Montjuïc", lat: 41.364, lng: 2.158 },
    ],
    geo: {
      bounds: { w: 2.115, e: 2.215, n: 41.424, s: 41.36 },
      water: [{ fill: true, pts: [[41.355, 2.17], [41.37, 2.181], [41.376, 2.185], [41.378, 2.192], [41.386, 2.2], [41.393, 2.206], [41.402, 2.215], [41.41, 2.226], [41.41, 2.3], [41.3, 2.3], [41.3, 2.17]] }],
      parks: [{ lat: 41.364, lng: 2.158, r: 34 }, { lat: 41.388, lng: 2.187, r: 12 }, { lat: 41.4145, lng: 2.1527, r: 14 }],
      landmarks: [
        { name: "Sagrada Família", lat: 41.4036, lng: 2.1744 }, { name: "Casa Batlló", lat: 41.3917, lng: 2.1649 },
        { name: "La Pedrera", lat: 41.3953, lng: 2.1619 }, { name: "Park Güell", lat: 41.4145, lng: 2.1527 },
        { name: "Cathédrale", lat: 41.384, lng: 2.1762 }, { name: "La Rambla", lat: 41.3809, lng: 2.1735 },
      ],
      start: [41.388, 2.172], startWidth: 640,
    },
  },
  {
    id: "londres", name: "Londres", country: "Royaume-Uni", iata: "LON", currency: "GBP", language: "anglais",
    tagline: "Pubs centenaires, marchés couverts et musées gratuits.",
    center: { lat: 51.5074, lng: -0.1278 },
    districts: [
      { name: "Soho", lat: 51.5136, lng: -0.1365 }, { name: "Covent Garden", lat: 51.5117, lng: -0.124 },
      { name: "Shoreditch", lat: 51.5245, lng: -0.078 }, { name: "Camden", lat: 51.539, lng: -0.1426 },
      { name: "Notting Hill", lat: 51.511, lng: -0.205 }, { name: "South Bank", lat: 51.5055, lng: -0.116 },
      { name: "Borough · Bermondsey", lat: 51.501, lng: -0.09 }, { name: "Mayfair", lat: 51.51, lng: -0.147 },
      { name: "Kensington", lat: 51.499, lng: -0.193 }, { name: "Marylebone", lat: 51.52, lng: -0.153 },
      { name: "La City", lat: 51.513, lng: -0.09 }, { name: "Whitechapel", lat: 51.517, lng: -0.06 },
    ],
    geo: {
      bounds: { w: -0.235, e: -0.02, n: 51.552, s: 51.458 },
      water: [{ width: 9, pts: [[51.49, -0.235], [51.4685, -0.215], [51.4755, -0.19], [51.4835, -0.16], [51.487, -0.125], [51.5007, -0.1215], [51.5085, -0.117], [51.5095, -0.104], [51.5079, -0.0877], [51.5055, -0.0754], [51.504, -0.06], [51.501, -0.045], [51.508, -0.03], [51.5, -0.015]] }],
      parks: [
        { lat: 51.5073, lng: -0.1657, r: 26 }, { lat: 51.5313, lng: -0.157, r: 24 }, { lat: 51.5025, lng: -0.134, r: 10 },
        { lat: 51.5045, lng: -0.1475, r: 10 }, { lat: 51.5363, lng: -0.039, r: 16 }, { lat: 51.4795, lng: -0.157, r: 13 },
      ],
      landmarks: [
        { name: "Big Ben", lat: 51.5007, lng: -0.1246 }, { name: "London Eye", lat: 51.5033, lng: -0.1196 },
        { name: "Tower Bridge", lat: 51.5055, lng: -0.0754 }, { name: "St Paul's", lat: 51.5138, lng: -0.0984 },
        { name: "British Museum", lat: 51.5194, lng: -0.127 }, { name: "Buckingham", lat: 51.5014, lng: -0.1419 },
      ],
      start: [51.51, -0.12], startWidth: 620,
    },
  },
  {
    id: "lisbonne", name: "Lisbonne", country: "Portugal", iata: "LIS", currency: "EUR", language: "portugais",
    tagline: "Sept collines, des miradouros partout et le fado dans les ruelles.",
    center: { lat: 38.711, lng: -9.139 },
    districts: [
      { name: "Baixa", lat: 38.711, lng: -9.137 }, { name: "Chiado", lat: 38.7105, lng: -9.142 },
      { name: "Bairro Alto", lat: 38.713, lng: -9.145 }, { name: "Alfama", lat: 38.7115, lng: -9.13 },
      { name: "Príncipe Real", lat: 38.717, lng: -9.149 }, { name: "Cais do Sodré", lat: 38.7065, lng: -9.144 },
      { name: "Mouraria", lat: 38.7155, lng: -9.1355 }, { name: "Belém", lat: 38.6975, lng: -9.206 },
      { name: "Alcântara", lat: 38.7035, lng: -9.1785 }, { name: "Intendente", lat: 38.7215, lng: -9.135 },
    ],
    geo: {
      bounds: { w: -9.225, e: -9.1, n: 38.75, s: 38.685 },
      water: [{ fill: true, pts: [[38.6925, -9.23], [38.6955, -9.2], [38.701, -9.18], [38.704, -9.16], [38.706, -9.145], [38.7075, -9.135], [38.711, -9.122], [38.72, -9.11], [38.735, -9.1], [38.735, -9.05], [38.62, -9.05], [38.62, -9.26]] }],
      parks: [{ lat: 38.729, lng: -9.154, r: 16 }, { lat: 38.7155, lng: -9.1595, r: 8 }],
      landmarks: [
        { name: "Castelo de São Jorge", lat: 38.7139, lng: -9.1335 }, { name: "Praça do Comércio", lat: 38.7075, lng: -9.1365 },
        { name: "Tour de Belém", lat: 38.6916, lng: -9.216 }, { name: "Jerónimos", lat: 38.6979, lng: -9.2068 },
        { name: "Santa Justa", lat: 38.7121, lng: -9.1394 }, { name: "LX Factory", lat: 38.7035, lng: -9.1785 },
      ],
      start: [38.712, -9.14], startWidth: 520,
    },
  },
  {
    id: "rome", name: "Rome", country: "Italie", iata: "ROM", currency: "EUR", language: "italien",
    tagline: "Trois mille ans d'histoire entre deux supplì et un spritz.",
    center: { lat: 41.8986, lng: 12.4769 },
    districts: [
      { name: "Centro Storico", lat: 41.899, lng: 12.473 }, { name: "Trastevere", lat: 41.888, lng: 12.47 },
      { name: "Monti", lat: 41.895, lng: 12.493 }, { name: "Testaccio", lat: 41.877, lng: 12.476 },
      { name: "Prati", lat: 41.907, lng: 12.462 }, { name: "Ghetto", lat: 41.8925, lng: 12.478 },
      { name: "Esquilino", lat: 41.896, lng: 12.504 }, { name: "San Lorenzo", lat: 41.898, lng: 12.515 },
      { name: "Pigneto", lat: 41.889, lng: 12.528 }, { name: "Campo de' Fiori", lat: 41.8956, lng: 12.4722 },
    ],
    geo: {
      bounds: { w: 12.44, e: 12.535, n: 41.925, s: 41.865 },
      water: [{ width: 8, pts: [[41.925, 12.467], [41.911, 12.471], [41.9035, 12.4685], [41.899, 12.469], [41.8945, 12.472], [41.8905, 12.4775], [41.885, 12.476], [41.88, 12.471], [41.872, 12.472], [41.865, 12.478]] }],
      parks: [{ lat: 41.9128, lng: 12.4852, r: 24 }, { lat: 41.8855, lng: 12.4605, r: 14 }, { lat: 41.8835, lng: 12.4875, r: 9 }],
      landmarks: [
        { name: "Colisée", lat: 41.8902, lng: 12.4922 }, { name: "Panthéon", lat: 41.8986, lng: 12.4769 },
        { name: "Fontaine de Trevi", lat: 41.9009, lng: 12.4833 }, { name: "Saint-Pierre", lat: 41.9022, lng: 12.4539 },
        { name: "Piazza Navona", lat: 41.8992, lng: 12.4731 }, { name: "Forum", lat: 41.8925, lng: 12.4853 },
      ],
      start: [41.897, 12.48], startWidth: 600,
    },
  },
  {
    id: "amsterdam", name: "Amsterdam", country: "Pays-Bas", iata: "AMS", currency: "EUR", language: "néerlandais (tout le monde parle anglais)",
    tagline: "Canaux, vélos et cafés bruns à la lumière des bougies.",
    center: { lat: 52.373, lng: 4.892 },
    districts: [
      { name: "Centrum · Dam", lat: 52.373, lng: 4.892 }, { name: "Jordaan", lat: 52.376, lng: 4.88 },
      { name: "Negen Straatjes", lat: 52.369, lng: 4.885 }, { name: "De Pijp", lat: 52.355, lng: 4.895 },
      { name: "Oost", lat: 52.361, lng: 4.925 }, { name: "Noord", lat: 52.39, lng: 4.915 },
      { name: "Museumkwartier", lat: 52.358, lng: 4.88 }, { name: "Plantage", lat: 52.366, lng: 4.91 },
      { name: "Oud-West", lat: 52.365, lng: 4.865 }, { name: "De Wallen", lat: 52.373, lng: 4.899 },
    ],
    geo: {
      bounds: { w: 4.845, e: 4.945, n: 52.405, s: 52.345 },
      water: [
        { fill: true, pts: [[52.386, 4.84], [52.384, 4.87], [52.3825, 4.89], [52.3815, 4.9], [52.381, 4.92], [52.379, 4.95], [52.385, 4.95], [52.387, 4.92], [52.3885, 4.89], [52.39, 4.84]] },
        { width: 5, pts: [[52.342, 4.905], [52.35, 4.903], [52.358, 4.904], [52.365, 4.901], [52.369, 4.8975]] },
      ],
      parks: [{ lat: 52.358, lng: 4.8686, r: 16 }, { lat: 52.387, lng: 4.874, r: 10 }, { lat: 52.36, lng: 4.92, r: 9 }, { lat: 52.354, lng: 4.896, r: 4 }],
      landmarks: [
        { name: "Dam", lat: 52.3731, lng: 4.8926 }, { name: "Rijksmuseum", lat: 52.36, lng: 4.8852 },
        { name: "Van Gogh", lat: 52.3584, lng: 4.8811 }, { name: "Anne Frank Huis", lat: 52.3752, lng: 4.884 },
        { name: "Centraal", lat: 52.3791, lng: 4.9003 }, { name: "Vondelpark", lat: 52.358, lng: 4.8686 },
      ],
      start: [52.369, 4.893], startWidth: 560,
    },
  },
  {
    id: "new-york", name: "New York", country: "États-Unis", iata: "NYC", currency: "USD", language: "anglais",
    tagline: "Rooftops, delis de légende et quartiers qui changent à chaque rue.",
    center: { lat: 40.738, lng: -73.99 },
    districts: [
      { name: "Lower East Side", lat: 40.715, lng: -73.9843 }, { name: "SoHo", lat: 40.7233, lng: -74.003 },
      { name: "Greenwich Village", lat: 40.7336, lng: -74.0027 }, { name: "East Village", lat: 40.7265, lng: -73.9815 },
      { name: "Chelsea", lat: 40.7465, lng: -74.0014 }, { name: "Midtown", lat: 40.7549, lng: -73.984 },
      { name: "Upper West Side", lat: 40.787, lng: -73.9754 }, { name: "Upper East Side", lat: 40.7736, lng: -73.9566 },
      { name: "Harlem", lat: 40.8116, lng: -73.9465 }, { name: "Williamsburg", lat: 40.714, lng: -73.96 },
      { name: "DUMBO", lat: 40.7033, lng: -73.989 }, { name: "Financial District", lat: 40.7075, lng: -74.011 },
    ],
    geo: {
      bounds: { w: -74.05, e: -73.93, n: 40.82, s: 40.685 },
      water: [
        { width: 26, pts: [[40.82, -73.962], [40.8, -73.977], [40.78, -73.993], [40.76, -74.007], [40.74, -74.0135], [40.72, -74.0155], [40.703, -74.02], [40.69, -74.03]] },
        { width: 14, pts: [[40.7005, -74.009], [40.7035, -73.9955], [40.71, -73.976], [40.727, -73.971], [40.745, -73.968], [40.76, -73.956], [40.775, -73.942], [40.79, -73.935]] },
      ],
      parks: [
        { lat: 40.768, lng: -73.978, r: 10 }, { lat: 40.775, lng: -73.971, r: 10 }, { lat: 40.783, lng: -73.9655, r: 10 },
        { lat: 40.79, lng: -73.959, r: 10 }, { lat: 40.796, lng: -73.953, r: 10 }, { lat: 40.7308, lng: -73.9973, r: 4 },
      ],
      landmarks: [
        { name: "Empire State", lat: 40.7484, lng: -73.9857 }, { name: "Times Square", lat: 40.758, lng: -73.9855 },
        { name: "Statue de la Liberté", lat: 40.6892, lng: -74.0445 }, { name: "Brooklyn Bridge", lat: 40.7061, lng: -73.9969 },
        { name: "One WTC", lat: 40.7127, lng: -74.0134 }, { name: "Central Park", lat: 40.7829, lng: -73.9654 },
      ],
      start: [40.738, -73.99], startWidth: 560,
    },
  },
  {
    id: "berlin", name: "Berlin", country: "Allemagne", iata: "BER", currency: "EUR", language: "allemand",
    tagline: "L'histoire à chaque coin de rue, les clubs jusqu'au lundi.",
    center: { lat: 52.52, lng: 13.405 },
    districts: [
      { name: "Mitte", lat: 52.525, lng: 13.4 }, { name: "Prenzlauer Berg", lat: 52.539, lng: 13.424 },
      { name: "Kreuzberg", lat: 52.499, lng: 13.403 }, { name: "Neukölln", lat: 52.481, lng: 13.435 },
      { name: "Friedrichshain", lat: 52.515, lng: 13.454 }, { name: "Charlottenburg", lat: 52.505, lng: 13.305 },
      { name: "Schöneberg", lat: 52.49, lng: 13.355 }, { name: "Tiergarten", lat: 52.5145, lng: 13.35 },
      { name: "Wedding", lat: 52.55, lng: 13.36 },
    ],
    geo: {
      bounds: { w: 13.29, e: 13.475, n: 52.555, s: 52.47 },
      water: [{ width: 7, pts: [[52.519, 13.29], [52.5165, 13.315], [52.523, 13.34], [52.5215, 13.37], [52.52, 13.377], [52.5205, 13.388], [52.519, 13.399], [52.511, 13.408], [52.5135, 13.418], [52.502, 13.445], [52.492, 13.465], [52.488, 13.475]] }],
      parks: [
        { lat: 52.5145, lng: 13.35, r: 22 }, { lat: 52.514, lng: 13.365, r: 16 }, { lat: 52.473, lng: 13.401, r: 22 },
        { lat: 52.528, lng: 13.435, r: 10 }, { lat: 52.496, lng: 13.437, r: 6 },
      ],
      landmarks: [
        { name: "Porte de Brandebourg", lat: 52.5163, lng: 13.3777 }, { name: "Reichstag", lat: 52.5186, lng: 13.3762 },
        { name: "Fernsehturm", lat: 52.5208, lng: 13.4094 }, { name: "East Side Gallery", lat: 52.505, lng: 13.4397 },
        { name: "Checkpoint Charlie", lat: 52.5075, lng: 13.3904 }, { name: "Mémorial", lat: 52.5139, lng: 13.3787 },
      ],
      start: [52.515, 13.39], startWidth: 600,
    },
  },
];

export const cityById = (id?: string): City => CITIES.find((c) => c.id === id) ?? CITIES[0];
export const isCityId = (id: unknown): id is CityId => typeof id === "string" && CITIES.some((c) => c.id === id);
