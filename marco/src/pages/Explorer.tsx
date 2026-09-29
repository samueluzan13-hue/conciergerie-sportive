import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Icon } from "../components/Icon";
import { SpotCard } from "../components/SpotCard";
import { Link } from "../components/Nav";
import { useCloud } from "../lib/cloud";
import { CATEGORY_LABEL, DIET_LABEL, MOOD_LABEL, SPOTS, type Category, type Diet, type Mood } from "../data/spots";
import { DIET_NOTE, DIET_ZONES } from "../data/guides";

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export function Explorer() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<Category | "all">("all");
  const [hiddenOnly, setHiddenOnly] = useState(false);
  const mood = params.get("mood") as Mood | null;
  const dietParam = params.get("diet");
  const diet: Diet | null = dietParam === "casher" || dietParam === "halal" ? dietParam : null;
  const [arr, setArr] = useState(0);
  const setDiet = (d: Diet | null) => {
    const next = new URLSearchParams(params);
    if (d) next.set("diet", d);
    else next.delete("diet");
    setParams(next);
  };
  const cloud = useCloud();

  const results = useMemo(() => {
    const q = norm(query);
    return SPOTS.filter(
      (s) =>
        (cat === "all" || s.category === cat) &&
        (!mood || s.moods.includes(mood)) &&
        (!hiddenOnly || s.hidden === 3) &&
        (!diet || Boolean(s.diet?.includes(diet))) &&
        (!arr || s.arrondissement === arr) &&
        (!q || norm(`${s.name} ${s.quartier} ${s.pitch} ${s.address}`).includes(q)),
    );
  }, [query, cat, mood, hiddenOnly, diet, arr]);

  return (
    <div className="page">
      <h1 className="serif page-title">Marco Direct</h1>
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
        {(Object.keys(DIET_LABEL) as Diet[]).map((d) => (
          <button key={d} className={`chip ${diet === d ? "on" : ""}`} onClick={() => setDiet(diet === d ? null : d)}>{DIET_LABEL[d]}</button>
        ))}
        <select id="explorer-arr" className="chip chip-select" value={arr} onChange={(e) => setArr(Number(e.target.value))} aria-label="Arrondissement">
          <option value={0}>Tous les arrondissements</option>
          {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n === 1 ? "1er" : `${n}e`} arrondissement</option>)}
        </select>
      </div>

      {diet && (
        <section className="diet-zones">
          <h2 className="serif section-title">Où manger {diet} à Paris</h2>
          <div className="stack">
            {DIET_ZONES.filter((z) => z.diet === diet && (!arr || z.arr.includes(arr))).map((z) => (
              <div key={z.name} className="zone-card">
                <div className="row-between"><strong>{z.name}</strong><span className="tag">{z.arr.map((x) => (x === 1 ? "1er" : `${x}e`)).join(", ")}</span></div>
                <p className="small">{z.text}</p>
                <p className="tiny muted">{z.streets}</p>
              </div>
            ))}
            {arr > 0 && !DIET_ZONES.some((z) => z.diet === diet && z.arr.includes(arr)) && (
              <p className="small muted">Pas encore de quartier {diet} repéré dans le {arr === 1 ? "1er" : `${arr}e`} : essaie un arrondissement voisin, ou demande à Marco.</p>
            )}
          </div>
          <p className="tiny muted">{DIET_NOTE}</p>
        </section>
      )}

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

      <p className="tiny muted">{results.length} adresse{results.length > 1 ? "s" : ""}</p>
      {results.length ? (
        <div className="grid-2">
          {results.map((s) => <SpotCard key={s.id} spot={s} />)}
        </div>
      ) : (
        <div className="empty">
          <p className="serif">Rien dans ma sélection pour « {query} ».</p>
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
