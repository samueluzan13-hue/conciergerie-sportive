import { useEffect, useState } from "react";
import { isPlaceQuery, loadDirectory, searchPlaces, type SearchResult } from "../lib/annuaire";
import { useCity } from "../lib/store";
import type { City } from "../data/cities";
import { Link } from "./Nav";
import { PlaceRow } from "./PlaceRow";

/** Sous la réponse de Marco : les adresses du répertoire complet qui correspondent à la demande, prêtes à réserver. */
export function DirectoryHits({ text }: { text: string }) {
  const city = useCity();
  const [res, setRes] = useState<SearchResult | null>(null);
  const [more, setMore] = useState(false);
  useEffect(() => {
    let live = true;
    loadDirectory(city.id).then(
      (all) => live && setRes(searchPlaces(all, city, text, { limit: 8 })),
      () => undefined,
    );
    return () => {
      live = false;
    };
  }, [text, city]);
  if (!res || !isPlaceQuery(res.parsed) || (!res.places.length && !res.related.length)) return null;
  const list = res.places.slice(0, more ? 8 : 3);
  return (
    <div className="dir-card">
      {res.places.length > 0 && (
        <>
          <h4>📒 Dans tout {city.name} : {res.total.toLocaleString("fr-FR")} adresse{res.total > 1 ? "s" : ""} pour ça</h4>
          <div className="place-list">
            {list.map((p) => <PlaceRow key={p.i} place={p} city={city} />)}
          </div>
        </>
      )}
      <RelatedPlaces res={res} city={city} max={more ? 8 : 3} />
      <div className="place-actions">
        {!more && (res.places.length > 3 || res.related.length > 3) && <button className="btn-mini" onClick={() => setMore(true)}>Voir plus ici</button>}
        <Link to={`/annuaire?q=${encodeURIComponent(text)}`} className="btn-mini primary">Voir les {res.total.toLocaleString("fr-FR")} adresses</Link>
      </div>
    </div>
  );
}

/** Halal / casher : les adresses où c'est fréquent mais pas confirmé, clairement signalées « à vérifier ». */
export function RelatedPlaces({ res, city, max = 12 }: { res: SearchResult; city: City; max?: number }) {
  if (!res.related.length) return null;
  return (
    <>
      <h4>{res.places.length ? "Et aussi, " : ""}souvent {res.likely} (à vérifier sur place)</h4>
      <p className="tiny muted">Cuisines où le {res.likely} est fréquent, sans certification connue de Marco : appelle ou demande sur place avant d'y aller.</p>
      <div className="place-list">
        {res.related.slice(0, max).map((p) => <PlaceRow key={`rel-${p.i}`} place={p} city={city} />)}
      </div>
    </>
  );
}
