// Le dernier geste : payer directement sur le site de la compagnie aérienne, de l'hôtel ou d'Airbnb.
import { spotById } from "../data/spots";
import { reserveUrl } from "./reservation";
import { cityById } from "../data/cities";

/** Sites officiels des compagnies aériennes (code IATA → site). */
const AIRLINES: Record<string, [string, string]> = {
  AF: ["Air France", "https://wwws.airfrance.fr"], KL: ["KLM", "https://www.klm.fr"], TO: ["Transavia", "https://www.transavia.com"],
  HV: ["Transavia", "https://www.transavia.com"], IB: ["Iberia", "https://www.iberia.com"], I2: ["Iberia Express", "https://www.iberiaexpress.com"],
  VY: ["Vueling", "https://www.vueling.com"], UX: ["Air Europa", "https://www.aireuropa.com"], U2: ["easyJet", "https://www.easyjet.com"],
  EC: ["easyJet", "https://www.easyjet.com"], DS: ["easyJet", "https://www.easyjet.com"], FR: ["Ryanair", "https://www.ryanair.com"],
  TP: ["TAP Air Portugal", "https://www.flytap.com"], AZ: ["ITA Airways", "https://www.ita-airways.com"], LH: ["Lufthansa", "https://www.lufthansa.com"],
  EW: ["Eurowings", "https://www.eurowings.com"], LX: ["Swiss", "https://www.swiss.com"], OS: ["Austrian", "https://www.austrian.com"],
  SN: ["Brussels Airlines", "https://www.brusselsairlines.com"], BA: ["British Airways", "https://www.britishairways.com"], VS: ["Virgin Atlantic", "https://www.virginatlantic.com"],
  EI: ["Aer Lingus", "https://www.aerlingus.com"], V7: ["Volotea", "https://www.volotea.com"], W6: ["Wizz Air", "https://wizzair.com"],
  DY: ["Norwegian", "https://www.norwegian.com"], SK: ["SAS", "https://www.flysas.com"], AY: ["Finnair", "https://www.finnair.com"],
  DL: ["Delta", "https://www.delta.com"], UA: ["United", "https://www.united.com"], AA: ["American Airlines", "https://www.aa.com"],
  B6: ["JetBlue", "https://www.jetblue.com"], LY: ["El Al", "https://www.elal.com"], AT: ["Royal Air Maroc", "https://www.royalairmaroc.com"],
  TU: ["Tunisair", "https://www.tunisair.com"], AH: ["Air Algérie", "https://airalgerie.dz"], EK: ["Emirates", "https://www.emirates.com"],
  TK: ["Turkish Airlines", "https://www.turkishairlines.com"], SS: ["Corsair", "https://www.flycorsair.com"], TX: ["Air Caraïbes", "https://www.aircaraibes.com"],
  XK: ["Air Corsica", "https://www.aircorsica.com"],
};

const ducky = (q: string) => `https://duckduckgo.com/?q=${encodeURIComponent(`!ducky ${q}`)}`;

/** Lien vers le site officiel de la compagnie (réservation et paiement chez elle). */
export function airlineSite(iata: string | null, name: string) {
  const known = iata ? AIRLINES[iata.toUpperCase()] : undefined;
  return known ? known[1] : ducky(`${name} site officiel réservation`);
}

/** Site officiel d'un hébergement : la fiche Marco s'il est dans la sélection, sinon on le retrouve par son nom. */
export function hotelSite(name: string, cityId: string, spotId?: string) {
  const spot = spotId ? spotById(spotId) : undefined;
  if (spot) return reserveUrl(spot);
  const city = cityById(cityId);
  return import.meta.env.VITE_PREVIEW ? ducky(`${name} ${city.name} site officiel`) : `/api/reserve?q=${encodeURIComponent(name)}&city=${city.id}`;
}

/** Recherche Airbnb pré-remplie : les vrais logements et les vrais prix, réservation et paiement sur Airbnb. */
export function airbnbUrl(o: { city: string; country: string; checkin: string; checkout: string; adults: number; children?: number; maxPrice?: number; entire?: boolean }) {
  const p = new URLSearchParams({ checkin: o.checkin, checkout: o.checkout, adults: String(o.adults) });
  if (o.children) p.set("children", String(o.children));
  if (o.maxPrice) p.set("price_max", String(o.maxPrice));
  if (o.entire) p.append("room_types[]", "Entire home/apt");
  return `https://www.airbnb.fr/s/${encodeURIComponent(`${o.city}--${o.country}`)}/homes?${p.toString()}`;
}
