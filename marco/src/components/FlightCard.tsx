import type { FlightSearch } from "../lib/travel";
import { placeName, SORT_LABEL } from "../lib/travel";
import { Icon } from "./Icon";
import { Link } from "./Nav";

/** Carte proposée par l'IA : ouvre la recherche de vols de Marco, déjà remplie et triée. */
export function FlightCard({ s }: { s: FlightSearch }) {
  const d = (x: string) => new Date(x).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  const to = `/voyages?tab=vols&from=${s.from}&to=${s.to}&depart=${s.depart}${s.back ? `&back=${s.back}` : ""}&adults=${s.adults}&sort=${s.sort}`;
  return (
    <div className="booking-card flight-results">
      <p className="booking-title"><Icon name="plane" size={16} /> {placeName(s.from)} → {placeName(s.to)}</p>
      <p className="tiny muted">{d(s.depart)}{s.back ? ` → ${d(s.back)}` : " · aller simple"} · {s.adults} voyageur{s.adults > 1 ? "s" : ""} · {SORT_LABEL[s.sort].toLowerCase()}</p>
      <Link to={to} className="btn btn-primary btn-block"><Icon name="plane" size={18} /> Voir les vols et réserver</Link>
    </div>
  );
}
