import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "../components/Icon";
import { MarcoLogo } from "../components/MarcoLogo";
import { SpotCard, SpotRow } from "../components/SpotCard";
import { QUARTIERS, SPOTS, type Mood } from "../data/spots";
import { STREETS } from "../data/streets";
import { distanceKm } from "../lib/geo";
import { useStore } from "../lib/store";

const STORIES: { mood: Mood; label: string; letter: string }[] = [
  { mood: "tendance", label: "Tendance", letter: "T" },
  { mood: "insolite", label: "Insolite", letter: "I" },
  { mood: "bobo", label: "Bobo", letter: "B" },
  { mood: "jazz", label: "Jazz", letter: "J" },
  { mood: "cache", label: "Caché", letter: "C" },
  { mood: "romantique", label: "Date", letter: "D" },
  { mood: "petit-budget", label: "Fauché", letter: "€" },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Encore debout";
  if (h < 12) return "Bonjour";
  if (h < 18) return "Bon après-midi";
  return "Bonsoir";
}

export function Home() {
  const profile = useStore((s) => s.profile);
  const navigate = useNavigate();
  const [street, setStreet] = useState("");

  const q = QUARTIERS.find((x) => x.name === profile.quartier) ?? QUARTIERS[0];
  const nearby = useMemo(
    () =>
      SPOTS.filter((s) => s.hidden >= 2)
        .map((s) => ({ s, d: distanceKm(q, s) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, 6),
    [q],
  );
  const forYou = useMemo(() => {
    const m = profile.moods;
    return SPOTS.filter((s) => !m.length || s.moods.some((x) => m.includes(x))).slice(0, 8);
  }, [profile.moods]);
  const streetOfDay = STREETS[new Date().getDate() % STREETS.length];
  const favorites = ["musee-chasse", "vert-galant", "candelaria", "arts-forains"].map((id) => SPOTS.find((s) => s.id === id)!);

  return (
    <div className="page">
      <header className="top-bar">
        <div>
          <p className="eyebrow">{greeting()}</p>
          <h1 className="serif hello">{profile.name || "toi"} <span className="wave">👋</span></h1>
        </div>
        <div className="top-actions">
          <Link to="/voyages" className="icon-btn" aria-label="Voyages"><Icon name="plane" size={20} /></Link>
          <Link to="/profil" className="icon-btn" aria-label="Enregistrements"><Icon name="bookmark" size={20} /></Link>
        </div>
      </header>

      <section className="hero">
        <div className="hero-mascot"><MarcoLogo size={78} /></div>
        <h2 className="serif">Où est-ce qu'on t'emmène aujourd'hui ?</h2>
        <p className="muted">Des pépites parisiennes rien que pour toi.</p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => navigate("/marco")}>
            <Icon name="sparkles" size={18} /> Demander à Marco
          </button>
          <button className="btn btn-ghost" onClick={() => navigate("/planner")}>
            <Icon name="calendar" size={18} /> Planifier
          </button>
        </div>
      </section>

      <div className="stories" role="list">
        {STORIES.map((st) => (
          <button key={st.mood} className={`story ${profile.moods.includes(st.mood) ? "active" : ""}`} onClick={() => navigate(`/explorer?mood=${st.mood}`)} role="listitem">
            <span className="story-ring"><span className="story-inner serif">{st.letter}</span></span>
            <span className="tiny">{st.label}</span>
          </button>
        ))}
      </div>

      <section className="street-card">
        <div className="row gap-8">
          <Icon name="book" size={20} />
          <span className="eyebrow light">Raconte-moi une rue</span>
        </div>
        <h2 className="serif">Tape une rue, Marco te raconte son histoire.</h2>
        <form
          className="street-form"
          onSubmit={(e) => {
            e.preventDefault();
            navigate(`/rues?q=${encodeURIComponent(street)}`);
          }}
        >
          <input value={street} onChange={(e) => setStreet(e.target.value)} placeholder="Ex. rue Mouffetard" aria-label="Nom de rue" />
          <button className="btn-round" aria-label="Raconter"><Icon name="arrowRight" size={20} /></button>
        </form>
        <Link to={`/rues?q=${encodeURIComponent(streetOfDay.name)}`} className="street-of-day">
          <span className="tiny">La rue du jour</span>
          <strong>{streetOfDay.name}</strong>
          <span className="small clamp-2">{streetOfDay.anecdote}</span>
        </Link>
      </section>

      <section>
        <div className="section-head">
          <h2 className="serif">Pépites près de chez toi</h2>
          <Link to="/carte" className="link small">Carte</Link>
        </div>
        <p className="muted small section-sub">Autour de {profile.quartier} · les adresses que les voisins gardent pour eux</p>
        <div className="h-scroll">
          {nearby.map(({ s }) => (
            <div key={s.id} className="h-item"><SpotCard spot={s} /></div>
          ))}
        </div>
      </section>

      <section>
        <div className="section-head">
          <h2 className="serif">Rien que pour toi</h2>
          <Link to="/explorer" className="link small">Voir tout</Link>
        </div>
        <div className="h-scroll">
          {forYou.map((s) => (
            <div key={s.id} className="h-item"><SpotCard spot={s} /></div>
          ))}
        </div>
      </section>

      <section>
        <div className="section-head">
          <h2 className="serif">Nos coups de cœur</h2>
        </div>
        <div className="stack">
          {favorites.map((s) => <SpotRow key={s.id} spot={s} />)}
        </div>
      </section>

      <Link to="/voyages" className="soon-card">
        <div>
          <span className="eyebrow">Bientôt sur Marco</span>
          <h2 className="serif">Réserve tout ton voyage, au même endroit.</h2>
          <p className="small">Hébergement, restos, activités : un plan sur-mesure, pas un circuit bateau.</p>
        </div>
        <Icon name="arrowRight" size={22} />
      </Link>
    </div>
  );
}
