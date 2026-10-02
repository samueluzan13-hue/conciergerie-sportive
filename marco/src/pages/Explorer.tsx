import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Icon } from "../components/Icon";
import { SpotCard } from "../components/SpotCard";
import { Link } from "../components/Nav";
import { useCloud } from "../lib/cloud";
import { CityPicker } from "../components/CityPicker";
import { CATEGORY_LABEL, citySpots, MOOD_LABEL, type Category, type Mood } from "../data/spots";
import { useCity } from "../lib/store";

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export function Explorer() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<Category | "all">(() => {
    const c = params.get("cat"); // (?cat=resto) : fonctionne aussi avec la navigation en mémoire
    return c && c in CATEGORY_LABEL ? (c as Category) : "all";
  });
  const [hiddenOnly, setHiddenOnly] = useState(false);
  const mood = params.get("mood") as Mood | null;
  const [arr, setArr] = useState(0);
  const [district, setDistrict] = useState("");
  const cloud = useCloud();
  const city = useCity();
  const paris = city.id === "paris";

  const results = useMemo(() => {
    const q = norm(query);
    return citySpots(city.id).filter(
      (s) =>
        (cat === "all" || s.category === cat) &&
        (!mood || s.moods.includes(mood)) &&
        (!hiddenOnly || s.hidden === 3) &&
        (paris ? !arr || s.arrondissement === arr : !district || s.quartier === district) &&
        (!q || norm(`${s.name} ${s.quartier} ${s.pitch} ${s.address}`).includes(q)),
    );
  }, [query, cat, mood, hiddenOnly, arr, district, city.id, cloud.version]); // eslint-disable-line react-hooks/exhaustive-deps
  const districts = useMemo(() => [...new Set(citySpots(city.id).map((s) => s.quartier))].sort((a, b) => a.localeCompare(b, "fr")), [city.id, cloud.version]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="page">
      <div className="row-between title-row">
        <h1 className="serif page-title">Marco Direct</h1>
        <CityPicker />
      </div>
      <form
        className="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (!results.length && query.trim()) navigate(`/marco?q=${encodeURIComponent(query)}`);
        }}
      >
        <Icon name="search" size={18} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="T'as envie de quoi ?" aria-label="Rechercher" />
        <button type="button" className="icon-plain" aria-label="Demander à Marco" onClick={() => navigate(`/marco${query ? `?q=${encodeURIComponent(query)}` : ""}`)}>
          <Icon name="sparkles" size={18} />
        </button>
      </form>

      <div className="chips-scroll">
        <button className={`chip ${cat === "all" ? "on" : ""}`} onClick={() => setCat("all")}>Tout</button>
        {(Object.keys(CATEGORY_LABEL) as Category[]).map((c) => (
          <button key={c} className={`chip ${cat === c ? "on" : ""}`} onClick={() => setCat(c)}>{CATEGORY_LABEL[c]}</button>
        ))}
      </div>

      <div className="chips-scroll">
        {paris ? (
          <select id="explorer-arr" className="chip chip-select" value={arr} onChange={(e) => setArr(Number(e.target.value))} aria-label="Arrondissement">
            <option value={0}>Tous les arrondissements</option>
            {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n === 1 ? "1er" : `${n}e`} arrondissement</option>)}
          </select>
        ) : (
          <select id="explorer-arr" className="chip chip-select" value={district} onChange={(e) => setDistrict(e.target.value)} aria-label="Quartier">
            <option value="">Tous les quartiers</option>
            {districts.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        )}
      </div>

      <div className="row-between filters">
        <label className="switch">
          <input type="checkbox" checked={hiddenOnly} onChange={(e) => setHiddenOnly(e.target.checked)} />
          <span className="switch-track" />
          <span className="small">Pépites cachées seulement</span>
        </label>
        {mood && (
          <button className="tag tag-removable" onClick={() => setParams({})}>
            {MOOD_LABEL[mood]} <Icon name="close" size={12} />
          </button>
        )}
      </div>

      <Link to={`/annuaire${query ? `?q=${encodeURIComponent(query)}` : cat === "resto" ? "?g=r" : cat === "bar" ? "?g=b" : cat === "cafe" ? "?g=c" : cat === "hotel" ? "?g=h" : ""}`} className="propose-card">
        <Icon name="compass" size={20} />
        <div className="grow"><strong>Tout {city.name} : toutes les adresses</strong><p className="small muted">Ici, la sélection de Marco. Le répertoire complet a tous les restos, bars, activités et hôtels, avec réservation en un clic.</p></div>
        <Icon name="arrowRight" size={18} />
      </Link>

      <p className="tiny muted">{results.length} adresse{results.length > 1 ? "s" : ""} dans la sélection</p>
      {results.length ? (
        <div className="grid-2">
          {results.map((s) => <SpotCard key={s.id} spot={s} />)}
        </div>
      ) : (
        <div className="empty">
          <p className="serif">Rien dans ma sélection pour « {query} ».</p>
          <button className="btn btn-soft" onClick={() => navigate(`/annuaire?q=${encodeURIComponent(query)}`)}>Chercher dans tout {city.name}</button>
          <button className="btn btn-primary" onClick={() => navigate(`/marco?q=${encodeURIComponent(query)}`)}>
            <Icon name="sparkles" size={18} /> Demander à Marco
          </button>
        </div>
      )}
      {cloud.db && (
        <Link to="/proposer" className="propose-card">
          <Icon name="heart" size={20} />
          <div className="grow"><strong>Il manque une adresse ?</strong><p className="small muted">Propose-la, on l'ajoute à la sélection.</p></div>
          <Icon name="arrowRight" size={18} />
        </Link>
      )}
    </div>
  );
}
