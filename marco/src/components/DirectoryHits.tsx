import { useEffect, useState } from "react";
import { isPlaceQuery, loadDirectory, searchPlaces, type SearchResult } from "../lib/annuaire";
import { useCity } from "../lib/store";
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
  if (!res || !isPlaceQuery(res.parsed) || !res.places.length) return null;
  const list = res.places.slice(0, more ? 8 : 3);
  return (
    <div className="dir-card">
      <h4>📒 Dans tout {city.name} : {res.total.toLocaleString("fr-FR")} adresse{res.total > 1 ? "s" : ""} pour ça</h4>
      <div className="place-list">
        {list.map((p) => <PlaceRow key={p.i} place={p} city={city} />)}
      </div>
      <div className="place-actions">
        {!more && res.places.length > 3 && <button className="btn-mini" onClick={() => setMore(true)}>Voir plus ici</button>}
        <Link to={`/annuaire?q=${encodeURIComponent(text)}`} className="btn-mini primary">Voir les {res.total.toLocaleString("fr-FR")} adresses</Link>
      </div>
    </div>
  );
}
