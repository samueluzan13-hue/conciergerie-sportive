import type { FlightSearch } from "../lib/travel";
import { googleFlightsUrl, kayakUrl, placeName, skyscannerUrl, SORT_LABEL } from "../lib/travel";
import { Icon } from "./Icon";
import { Link } from "./Nav";

/** Carte proposée par l'IA : les comparateurs de vols pré-remplis et triés. */
export function FlightCard({ s }: { s: FlightSearch }) {
  const d = (x: string) => new Date(x).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  return (
    <div className="booking-card flight-results">
      <p className="booking-title"><Icon name="plane" size={16} /> {placeName(s.from)} → {placeName(s.to)}</p>
      <p className="tiny muted">{d(s.depart)}{s.back ? ` → ${d(s.back)}` : " · aller simple"} · {s.adults} voyageur{s.adults > 1 ? "s" : ""} · {SORT_LABEL[s.sort].toLowerCase()}</p>
      <a className="flight-link main" href={kayakUrl(s)} target="_blank" rel="noreferrer"><strong>Voir les vols sur Kayak</strong><Icon name="arrowRight" size={18} /></a>
      <a className="flight-link" href={googleFlightsUrl(s)} target="_blank" rel="noreferrer"><strong>Google Vols</strong><Icon name="arrowRight" size={18} /></a>
      <a className="flight-link" href={skyscannerUrl(s)} target="_blank" rel="noreferrer"><strong>Skyscanner</strong><Icon name="arrowRight" size={18} /></a>
      <Link to="/voyages?tab=vols" className="link tiny">Changer les dates, la classe ou le tri ›</Link>
    </div>
  );
}
