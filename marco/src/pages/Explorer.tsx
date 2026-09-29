import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Icon } from "../components/Icon";
import { SpotCard } from "../components/SpotCard";
import { CATEGORY_LABEL, MOOD_LABEL, SPOTS, type Category, type Mood } from "../data/spots";

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function Explorer() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<Category | "all">("all");
  const [hiddenOnly, setHiddenOnly] = useState(false);
  const mood = params.get("mood") as Mood | null;

  const results = useMemo(() => {
    const q = norm(query);
    return SPOTS.filter(
      (s) =>
        (cat === "all" || s.category === cat) &&
        (!mood || s.moods.includes(mood)) &&
        (!hiddenOnly || s.hidden === 3) &&
        (!q || norm(`${s.name} ${s.quartier} ${s.pitch} ${s.address}`).includes(q)),
    );
  }, [query, cat, mood, hiddenOnly]);

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
    </div>
  );
}
