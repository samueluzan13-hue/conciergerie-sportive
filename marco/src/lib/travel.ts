// Vols et hôtels : liens vers les comparateurs, pré-remplis et triés selon le choix de l'utilisateur.
// (Les prix en direct demandent un accord avec un fournisseur de vols ; en attendant, Marco pré-remplit les meilleurs comparateurs.)

export type FlightSort = "prix" | "prix-desc" | "rapide" | "meilleur";
export type Cabin = "economy" | "premium" | "business" | "first";

export interface FlightSearch {
  from: string; // code IATA de ville ou d'aéroport (PAR, LIS…)
  to: string;
  depart: string; // AAAA-MM-JJ
  back?: string; // vide = aller simple
  adults: number;
  cabin: Cabin;
  sort: FlightSort;
}

export const CABIN_LABEL: Record<Cabin, string> = { economy: "Économique", premium: "Premium éco", business: "Affaires", first: "Première" };
export const SORT_LABEL: Record<FlightSort, string> = { prix: "Moins cher d'abord", "prix-desc": "Plus cher d'abord", rapide: "Plus rapide", meilleur: "Meilleur compromis" };

/** Villes et aéroports les plus demandés (code de ville IATA = tous les aéroports de la ville). */
export const AIRPORTS: [string, string][] = [
  ["PAR", "Paris (tous les aéroports)"], ["CDG", "Paris Charles-de-Gaulle"], ["ORY", "Paris Orly"], ["BVA", "Paris Beauvais"],
  ["LYS", "Lyon"], ["MRS", "Marseille"], ["NCE", "Nice"], ["TLS", "Toulouse"], ["BOD", "Bordeaux"], ["NTE", "Nantes"], ["MPL", "Montpellier"], ["BIQ", "Biarritz"], ["AJA", "Ajaccio"], ["BIA", "Bastia"],
  ["LON", "Londres"], ["DUB", "Dublin"], ["AMS", "Amsterdam"], ["BRU", "Bruxelles"], ["GVA", "Genève"], ["BER", "Berlin"], ["MUC", "Munich"], ["VIE", "Vienne"], ["PRG", "Prague"], ["BUD", "Budapest"], ["CPH", "Copenhague"], ["STO", "Stockholm"],
  ["LIS", "Lisbonne"], ["OPO", "Porto"], ["MAD", "Madrid"], ["BCN", "Barcelone"], ["SVQ", "Séville"], ["PMI", "Palma de Majorque"], ["ROM", "Rome"], ["MIL", "Milan"], ["VCE", "Venise"], ["NAP", "Naples"], ["ATH", "Athènes"], ["MLA", "Malte"], ["IST", "Istanbul"],
  ["TLV", "Tel Aviv"], ["RAK", "Marrakech"], ["CMN", "Casablanca"], ["TUN", "Tunis"], ["DJE", "Djerba"], ["ALG", "Alger"], ["DSS", "Dakar"], ["ABJ", "Abidjan"], ["CAI", "Le Caire"], ["DXB", "Dubaï"],
  ["NYC", "New York"], ["MIA", "Miami"], ["LAX", "Los Angeles"], ["YMQ", "Montréal"], ["PTP", "Pointe-à-Pitre"], ["FDF", "Fort-de-France"], ["RUN", "La Réunion"], ["MRU", "Maurice"], ["BKK", "Bangkok"], ["TYO", "Tokyo"],
];

export function toIata(text: string): string | null {
  const t = text.trim();
  if (/^[A-Za-z]{3}$/.test(t)) return t.toUpperCase();
  const n = t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const hit = AIRPORTS.find(([code, name]) => name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").startsWith(n) || code.toLowerCase() === n);
  return hit ? hit[0] : null;
}

export const placeName = (code: string) => AIRPORTS.find(([c]) => c === code)?.[1] ?? code;

/** Kayak : seul comparateur qui accepte le tri dans l'adresse (prix croissant, décroissant, durée, meilleur). */
export function kayakUrl(s: FlightSearch) {
  const cabin = s.cabin === "economy" ? "" : `/${s.cabin === "premium" ? "premium" : s.cabin}`;
  const sort = { prix: "price_a", "prix-desc": "price_b", rapide: "duration_a", meilleur: "bestflight_a" }[s.sort];
  return `https://www.kayak.fr/flights/${s.from}-${s.to}/${s.depart}${s.back ? `/${s.back}` : ""}${cabin}/${s.adults}adults?sort=${sort}`;
}

export function skyscannerUrl(s: FlightSearch) {
  const d = (x: string) => x.slice(2).replace(/-/g, "");
  const cabin = { economy: "economy", premium: "premiumeconomy", business: "business", first: "first" }[s.cabin];
  return `https://www.skyscanner.fr/transport/vols/${s.from.toLowerCase()}/${s.to.toLowerCase()}/${d(s.depart)}/${s.back ? `${d(s.back)}/` : ""}?adultsv2=${s.adults}&cabinclass=${cabin}&rtn=${s.back ? 1 : 0}`;
}

export function googleFlightsUrl(s: FlightSearch) {
  const cabin = { economy: "", premium: " premium economy", business: " business class", first: " first class" }[s.cabin];
  const q = `Flights from ${s.from} to ${s.to} on ${s.depart}${s.back ? ` through ${s.back}` : " one way"} ${s.adults} adult${s.adults > 1 ? "s" : ""}${cabin}`;
  return `https://www.google.com/travel/flights?q=${encodeURIComponent(q)}&hl=fr&curr=EUR`;
}

/** Comparer le prix d'un hôtel précis pour des dates (Google Hôtels réunit les sites de réservation et le site officiel). */
export function hotelCompareUrl(name: string, checkin?: string, checkout?: string, adults = 2) {
  const dates = checkin && checkout ? ` du ${checkin} au ${checkout}` : "";
  return `https://www.google.com/travel/hotels?q=${encodeURIComponent(`${name} Paris${dates}`)}&hl=fr&curr=EUR&adults=${adults}`;
}
