// Côté app : recherche et réservation de vols et d'hébergements (route serveur /api/voyage, voir server/travel.ts).
// Dans l'aperçu claude.ai (pas de serveur), un mode démonstration clairement signalé permet de tester le parcours :
// aucune offre n'y est réelle et aucune réservation n'est faite.
import { CITIES, cityById, type CityId } from "../data/cities";
import { citySpots } from "../data/spots";
import { log } from "./diag";

export interface FlightSegment { flight: string; carrier: string; from: string; to: string; departAt: string; arriveAt: string }
export interface FlightSlice { from: string; to: string; duration: string; stops: number; departAt: string; arriveAt: string; segments: FlightSegment[]; bags: string }
export interface FlightOffer {
  id: string;
  price: number;
  currency: string;
  airline: { name: string; iata: string | null; logo: string | null };
  expiresAt: string;
  passengerIds: string[];
  refundable: boolean;
  changeable: boolean;
  slices: FlightSlice[];
}
export interface StayResult {
  id: string;
  name: string;
  stars: number | null;
  reviewScore: number | null;
  reviewCount: number | null;
  photo: string | null;
  address: string;
  lat: number | null;
  lng: number | null;
  price: number;
  currency: string;
  apartment: boolean;
}
export interface StayRoom {
  name: string;
  photo: string | null;
  beds: string;
  rates: { id: string; price: number; currency: string; board: string; refundable: boolean; refundableUntil: string | null; payAtHotel: number }[];
}
export interface Passenger { given_name: string; family_name: string; born_on: string; gender: "m" | "f"; email: string; phone_number: string }
export interface Confirmation { reference: string; price: number; currency: string; demo?: boolean }

export interface TravelConfig { flights: boolean; stays: boolean; booking: boolean; demo: boolean }

let config: Promise<TravelConfig> | null = null;
export function travelConfig(): Promise<TravelConfig> {
  config ??= (import.meta.env.VITE_PREVIEW
    ? Promise.resolve({ flights: false, stays: false, booking: false })
    : fetch("/api/voyage").then((r) => (r.ok ? r.json() : { flights: false, stays: false, booking: false })).catch(() => ({ flights: false, stays: false, booking: false }))
  ).then((c: Omit<TravelConfig, "demo">) => ({ ...c, demo: !c.flights }));
  return config;
}

async function post<T>(action: string, body: unknown): Promise<T> {
  const r = await fetch(`/api/voyage?action=${action}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await r.json().catch(() => ({}));
  log("voyage:" + action, { ok: r.ok, error: (data as { error?: string }).error });
  if (!r.ok) throw Object.assign(new Error((data as { error?: string }).error ?? "error"), { code: (data as { error?: string }).error, detail: (data as { message?: string }).message });
  return data as T;
}

/* ---------------- Vols ---------------- */
export interface FlightQuery { from: string; to: string; depart: string; back?: string; adults: number; cabin: "economy" | "premium_economy" | "business" | "first" }

export async function searchFlights(q: FlightQuery): Promise<FlightOffer[]> {
  if ((await travelConfig()).demo) return demoFlights(q);
  return (await post<{ offers: FlightOffer[] }>("vols", q)).offers;
}

export async function bookFlight(offer: FlightOffer, passengers: Passenger[]): Promise<Confirmation> {
  if ((await travelConfig()).demo) return { reference: demoRef(), price: offer.price, currency: offer.currency, demo: true };
  return post<Confirmation>("reserver-vol", { offerId: offer.id, passengers });
}

/* ---------------- Hébergements ---------------- */
export interface StayQuery { city: CityId; lat: number; lng: number; checkin: string; checkout: string; adults: number; rooms: number; kind: "hotel" | "appartement" }

export async function searchStays(q: StayQuery): Promise<StayResult[]> {
  const c = await travelConfig();
  if (c.demo || !c.stays) return demoStays(q);
  return (await post<{ results: StayResult[] }>("hebergements", { ...q, radius: 5 })).results;
}

export async function stayRooms(id: string, q: StayQuery): Promise<{ name: string; description: string; rooms: StayRoom[] }> {
  const c = await travelConfig();
  if (c.demo || !c.stays) return demoRooms(id, q);
  return post("chambres", { searchResultId: id });
}

export async function bookStay(rateId: string, price: number, currency: string, guest: { given_name: string; family_name: string; email: string; phone_number: string; requests?: string }): Promise<Confirmation> {
  const c = await travelConfig();
  if (c.demo || !c.stays) return { reference: demoRef(), price, currency, demo: true };
  return post<Confirmation>("reserver-chambre", { rateId, ...guest });
}

/* ---------------- Durées et formats ---------------- */
/** "PT2H35M" → minutes */
export function isoMinutes(d: string) {
  const m = /P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?/.exec(d ?? "");
  return m ? (+(m[1] ?? 0)) * 1440 + (+(m[2] ?? 0)) * 60 + (+(m[3] ?? 0)) : 0;
}
export const fmtDuration = (min: number) => `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, "0")}`;
export const fmtTime = (iso: string) => iso?.slice(11, 16) ?? "";
export const fmtPrice = (n: number, cur: string) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: cur || "EUR", maximumFractionDigits: 0 }).format(n);
export const offerMinutes = (o: FlightOffer) => o.slices.reduce((a, s) => a + isoMinutes(s.duration), 0);

/* ---------------- Mode démonstration (aperçu) ---------------- */
const demoRef = () => `DEMO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

function seeded(seed: string) {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296;
}

const CITY_BY_IATA = Object.fromEntries(CITIES.map((c) => [c.iata, c]));
function demoDistanceKm(a: string, b: string) {
  const ca = CITY_BY_IATA[a]?.center, cb = CITY_BY_IATA[b]?.center;
  if (!ca || !cb) return 1500;
  const R = 6371, rad = Math.PI / 180;
  const x = Math.sin(((cb.lat - ca.lat) * rad) / 2) ** 2 + Math.cos(ca.lat * rad) * Math.cos(cb.lat * rad) * Math.sin(((cb.lng - ca.lng) * rad) / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

function demoFlights(q: FlightQuery): FlightOffer[] {
  const rnd = seeded(`${q.from}${q.to}${q.depart}${q.back}${q.cabin}`);
  const km = demoDistanceKm(q.from, q.to);
  const base = Math.max(60, km * 0.09) * { economy: 1, premium_economy: 1.8, business: 3.6, first: 6 }[q.cabin];
  const airlines = ["Exemple Air", "Démo Airways", "Marco Jet (démo)", "Compagnie test"];
  const mk = (from: string, to: string, day: string, stops: number, i: number): FlightSlice => {
    const flyMin = Math.round(km / 13 + 35) + stops * (60 + Math.round(rnd() * 90));
    const dep = 6 * 60 + Math.round(rnd() * 14 * 60) + i;
    const arr = dep + flyMin;
    const t = (m: number) => `${day}T${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}:00`;
    return {
      from, to, stops, duration: `PT${Math.floor(flyMin / 60)}H${flyMin % 60}M`, departAt: t(dep), arriveAt: t(arr), bags: rnd() > 0.5 ? "1 bagage cabine" : "1 bagage cabine, 1 bagage en soute",
      segments: [{ flight: `XX${100 + Math.round(rnd() * 800)}`, carrier: "Démo", from, to, departAt: t(dep), arriveAt: t(arr) }],
    };
  };
  return Array.from({ length: 8 }, (_, i) => {
    const stops = rnd() > 0.65 ? 1 : 0;
    const airline = airlines[i % airlines.length];
    const slices = [mk(q.from, q.to, q.depart, stops, i)];
    if (q.back) slices.push(mk(q.to, q.from, q.back, stops, i));
    const price = Math.round(base * (q.back ? 1.8 : 1) * (0.7 + rnd() * 1.1) * (stops ? 0.82 : 1)) * q.adults;
    return {
      id: `demo-${i}`, price, currency: "EUR", airline: { name: airline, iata: null, logo: null }, expiresAt: "", passengerIds: Array.from({ length: q.adults }, (_, k) => `p${k}`),
      refundable: rnd() > 0.6, changeable: rnd() > 0.4, slices,
    };
  });
}

function nights(q: StayQuery) {
  return Math.max(1, Math.round((new Date(q.checkout).getTime() - new Date(q.checkin).getTime()) / 86400000));
}

function demoStays(q: StayQuery): StayResult[] {
  const rnd = seeded(`${q.city}${q.checkin}${q.kind}`);
  const city = cityById(q.city);
  const n = nights(q);
  if (q.kind === "hotel") {
    return citySpots(q.city).filter((s) => s.category === "hotel").map((h) => ({
      id: `demo-${h.id}`, name: h.name, stars: h.stars ?? null, reviewScore: Math.round((7.5 + rnd() * 2) * 10) / 10, reviewCount: Math.round(200 + rnd() * 2000),
      photo: null, address: `${h.address}, ${city.name}`, lat: h.lat, lng: h.lng,
      price: Math.round(({ 1: 90, 2: 210, 3: 520 }[h.price] ?? 150) * (0.8 + rnd() * 0.5)) * n * q.rooms, currency: "EUR", apartment: false,
    }));
  }
  const districts = city.districts.length ? city.districts : [{ name: "Le Marais", lat: 48.857, lng: 2.358 }, { name: "Montmartre", lat: 48.886, lng: 2.341 }, { name: "Canal Saint-Martin", lat: 48.871, lng: 2.365 }, { name: "Saint-Germain", lat: 48.853, lng: 2.333 }, { name: "Bastille", lat: 48.853, lng: 2.369 }];
  const kinds = ["Studio lumineux", "Appartement avec balcon", "Loft", "Deux-pièces familial", "Appartement de charme", "Duplex sous les toits"];
  return districts.slice(0, 8).map((d, i) => ({
    id: `demo-apt-${i}`, name: `${kinds[i % kinds.length]} · ${d.name}`, stars: null, reviewScore: Math.round((8 + rnd() * 1.8) * 10) / 10, reviewCount: Math.round(20 + rnd() * 300),
    photo: null, address: `${d.name}, ${city.name}`, lat: d.lat, lng: d.lng,
    price: Math.round((70 + rnd() * 160) * n * (q.adults > 2 ? 1.4 : 1)), currency: "EUR", apartment: true,
  }));
}

function demoRooms(id: string, q: StayQuery) {
  const rnd = seeded(id);
  const n = nights(q);
  const base = 60 + rnd() * 200;
  const room = (name: string, k: number): StayRoom => ({
    name, photo: null, beds: k > 1.2 ? "1 grand lit et 1 canapé-lit" : "1 grand lit",
    rates: [
      { id: `${id}-${name}-flex`, price: Math.round(base * k * n * 1.12), currency: "EUR", board: "room_only", refundable: true, refundableUntil: q.checkin, payAtHotel: 0 },
      { id: `${id}-${name}-pdj`, price: Math.round(base * k * n * 1.25), currency: "EUR", board: "breakfast", refundable: true, refundableUntil: q.checkin, payAtHotel: 0 },
      { id: `${id}-${name}-nr`, price: Math.round(base * k * n), currency: "EUR", board: "room_only", refundable: false, refundableUntil: null, payAtHotel: 0 },
    ],
  });
  return Promise.resolve({
    name: "",
    description: "Exemple de chambres et de tarifs : dans l'app en ligne, ce sont les vraies disponibilités de l'hébergement.",
    rooms: q.kind === "appartement" ? [room("Logement entier", 1.3)] : [room("Chambre double", 1), room("Chambre supérieure", 1.35), room("Suite", 2.1)],
  });
}
