// Vols : villes et aéroports, et la forme d'une recherche (la recherche et la réservation se font dans Marco, voir lib/booking.ts).

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
