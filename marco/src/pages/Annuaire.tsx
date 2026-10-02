import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CityPicker } from "../components/CityPicker";
import { Icon } from "../components/Icon";
import { PlaceRow } from "../components/PlaceRow";
import { GROUP_ICON, GROUP_LABEL, loadDirectory, parseQuery, searchPlaces, type Group, type Place } from "../lib/annuaire";
import { useCity } from "../lib/store";

const GROUPS = Object.keys(GROUP_LABEL) as Group[];
const STEP = 40;

/** Le répertoire complet de la ville : toutes les adresses, triées, filtrables, réservables en un clic. */
export function Annuaire() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const city = useCity();
  const paris = city.id === "paris";
  const [all, setAll] = useState<Place[] | null>(null);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [group, setGroup] = useState<Group | "all">(() => {
    const g = params.get("g");
    return g && g in GROUP_LABEL ? (g as Group) : "all";
  });
  const [arr, setArr] = useState(Number(params.get("arr")) || 0);
  const [district, setDistrict] = useState("");
  const [shown, setShown] = useState(STEP);

  useEffect(() => {
    if ([...params.keys()].length) setParams({}, { replace: true });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setAll(null);
    setError(false);
    loadDirectory(city.id).then(setAll, () => setError(true));
  }, [city.id]);

  useEffect(() => setShown(STEP), [query, group, arr, district, city.id]);
  // la phrase tapée prime sur le filtre : « cours de peinture » depuis « Restos » repasse sur « Tout »
  useEffect(() => {
    if (group === "all" || !query.trim()) return;
    const g = parseQuery(query, city).groups;
    if (g.length && !g.includes(group)) setGroup("all");
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

  const counts = useMemo(() => {
    const c = {} as Record<Group, number>;
    for (const p of all ?? []) c[p.group] = (c[p.group] ?? 0) + 1;
    return c;
  }, [all]);

  const res = useMemo(
    () => (all ? searchPlaces(all, city, query, { group, arr: paris ? arr : 0, district: paris ? "" : district, limit: 2000 }) : null),
    [all, city, query, group, arr, district, paris],
  );

  return (
    <div className="page">
      <div className="row-between title-row">
        <h1 className="serif page-title">Tout {city.name}</h1>
        <CityPicker />
      </div>
      <p className="small muted annuaire-lead">
        {all ? `${all.length.toLocaleString("fr-FR")} adresses` : "Toutes les adresses"} : restos, bars, cafés, sorties, sport, cours, spas et hôtels. Écris comme tu parles («&nbsp;casher 17e&nbsp;», «&nbsp;yoga Gràcia&nbsp;», «&nbsp;cours de peinture&nbsp;»).
      </p>
      <form className="search" onSubmit={(e) => e.preventDefault()}>
        <Icon name="search" size={18} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Resto italien, bar à vin, piscine…" aria-label="Rechercher dans le répertoire" />
        {query && (
          <button type="button" className="icon-plain" aria-label="Effacer" onClick={() => setQuery("")}><Icon name="close" size={16} /></button>
        )}
      </form>

      <div className="chips-scroll">
        <button className={`chip ${group === "all" ? "on" : ""}`} onClick={() => setGroup("all")}>Tout</button>
        {GROUPS.map((g) => (
          <button key={g} className={`chip ${group === g ? "on" : ""}`} onClick={() => setGroup(g)}>
            {GROUP_ICON[g]} {GROUP_LABEL[g]}{counts[g] ? ` · ${counts[g].toLocaleString("fr-FR")}` : ""}
          </button>
        ))}
      </div>

      <div className="chips-scroll">
        {paris ? (
          <select className="chip chip-select" value={arr} onChange={(e) => setArr(Number(e.target.value))} aria-label="Arrondissement">
            <option value={0}>Tous les arrondissements</option>
            {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n === 1 ? "1er" : `${n}e`} arrondissement</option>)}
          </select>
        ) : (
          <select className="chip chip-select" value={district} onChange={(e) => setDistrict(e.target.value)} aria-label="Quartier">
            <option value="">Tous les quartiers</option>
            {city.districts.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
          </select>
        )}
      </div>

      {error && (
        <div className="empty">
          <p className="serif">Le répertoire ne s'est pas chargé.</p>
          <button className="btn btn-primary" onClick={() => { setError(false); loadDirectory(city.id).then(setAll, () => setError(true)); }}>Réessayer</button>
        </div>
      )}
      {!all && !error && <p className="small muted"><span className="typing-dots"><span /><span /><span /></span> Chargement de toutes les adresses de {city.name}…</p>}

      {res && (
        <>
          <p className="tiny muted">{res.total.toLocaleString("fr-FR")} adresse{res.total > 1 ? "s" : ""}</p>
          {res.places.length ? (
            <div className="place-list">
              {res.places.slice(0, shown).map((p) => <PlaceRow key={p.i} place={p} city={city} />)}
            </div>
          ) : (
            <div className="empty">
              <p className="serif">Rien dans le répertoire pour « {query} ».</p>
              <button className="btn btn-primary" onClick={() => navigate(`/marco?q=${encodeURIComponent(query)}&ia=1`)}>
                <Icon name="sparkles" size={18} /> Demander à Marco
              </button>
            </div>
          )}
          {shown < res.places.length && (
            <button className="btn btn-soft btn-block" onClick={() => setShown(shown + STEP)}>Voir plus d'adresses</button>
          )}
        </>
      )}
      <p className="tiny muted annuaire-credit">Données : Overture Maps Foundation (CDLA-Permissive-2.0), dont OpenStreetMap (ODbL). Horaires et disponibilités à confirmer auprès du lieu.</p>
    </div>
  );
}
