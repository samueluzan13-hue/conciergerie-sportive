import { useNavigate } from "react-router-dom";
import type { City } from "../data/cities";
import { bookUrl, GROUP_ICON, isSocial, mapsUrl, placeArea, placeKind, roomBookingUrls, telUrl, webUrl, type Place } from "../lib/annuaire";
import { siteLabel } from "../lib/reservation";
import { Icon } from "./Icon";

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export interface Stay { checkin?: string; checkout?: string; adults?: number; rooms?: number }

/** Une adresse du répertoire, avec les gestes utiles en un clic : réserver, appeler, y aller, demander à Marco. */
export function PlaceRow({ place: p, city, stay }: { place: Place; city: City; stay?: Stay }) {
  const navigate = useNavigate();
  const area = placeArea(p, city);
  const tel = telUrl(p);
  const site = webUrl(p);
  const hotel = p.group === "h";
  const rooms = hotel ? roomBookingUrls(p, city, stay) : null;
  const canBook = p.group === "r" || p.group === "k" || p.group === "w" || p.group === "s" || p.group === "n";
  return (
    <article className="place-row">
      <div className="place-main">
        <span className="place-ico" aria-hidden="true">{GROUP_ICON[p.group]}</span>
        <div className="grow">
          <strong>{p.name}</strong>
          <p className="tiny muted">
            {placeKind(p)}
            {area && ` · ${area}`}
            {p.tags.filter((t) => t !== norm(placeKind(p))).map((t) => <span key={t} className="place-tag">{t}</span>)}
          </p>
          {p.address && <p className="tiny place-addr">{p.address}{p.postcode && !p.address.includes(p.postcode) ? `, ${p.postcode}` : ""}</p>}
        </div>
      </div>
      <div className="place-actions">
        {hotel && rooms && (
          <>
            {rooms.official ? (
              <a className="btn-mini primary" href={rooms.official} target="_blank" rel="noreferrer"><Icon name="bed" size={14} /> Réserver la chambre</a>
            ) : (
              <a className="btn-mini primary" href={rooms.booking} target="_blank" rel="noreferrer"><Icon name="bed" size={14} /> Réserver la chambre</a>
            )}
            {rooms.official && <a className="btn-mini" href={rooms.booking} target="_blank" rel="noreferrer">Prix aux dates</a>}
          </>
        )}
        {!hotel && canBook && site && !isSocial(p) && (
          <a className="btn-mini primary" href={bookUrl(p, city)} target="_blank" rel="noreferrer"><Icon name="calendar" size={14} /> Réserver</a>
        )}
        {!hotel && site && (isSocial(p) || !canBook) && (
          <a className="btn-mini" href={site} target="_blank" rel="noreferrer">{isSocial(p) ? (p.web.includes("instagram") ? "Instagram" : "Facebook") : siteLabel(site)}</a>
        )}
        {tel && <a className="btn-mini" href={tel}><Icon name="phone" size={14} /> Appeler</a>}
        <a className="btn-mini" href={mapsUrl(p, city)} target="_blank" rel="noreferrer"><Icon name="pin" size={14} /> Y aller</a>
        <button
          className="btn-mini"
          onClick={() =>
            navigate(`/marco?q=${encodeURIComponent(
              p.group === "r"
                ? `Réserve-moi une table chez ${p.name} (${p.address || area}, ${city.name}). Dis-moi d'abord ce que c'est, les horaires et les prix.`
                : `Parle-moi de ${p.name} (${p.address || area}, ${city.name}) : c'est comment, horaires, prix, et aide-moi à réserver.`,
            )}&ia=1`)
          }
        >
          <Icon name="sparkles" size={14} /> {p.group === "r" ? "Marco réserve" : "Demander à Marco"}
        </button>
      </div>
    </article>
  );
}
