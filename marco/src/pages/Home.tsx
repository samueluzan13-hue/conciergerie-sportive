import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "../components/Nav";
import { Icon } from "../components/Icon";
import { MarcoLogo } from "../components/MarcoLogo";
import { SpotCard, SpotRow } from "../components/SpotCard";
import { CityPicker } from "../components/CityPicker";
import { citySpots, QUARTIERS, type Mood } from "../data/spots";
import { cityStreets } from "../data/streets";
import { useCloud } from "../lib/cloud";
import { distanceKm } from "../lib/geo";
import { useCity, useStore } from "../lib/store";

const STORIES: { mood: Mood; label: string; letter: string }[] = [
  { mood: "cache", label: "Caché", letter: "C" },
  { mood: "romantique", label: "Date", letter: "D" },
  { mood: "insolite", label: "Insolite", letter: "I" },
  { mood: "tendance", label: "Tendance", letter: "T" },
  { mood: "bobo", label: "Bobo", letter: "B" },
  { mood: "jazz", label: "Jazz", letter: "J" },
  { mood: "petit-budget", label: "Fauché", letter: "€" },
  { mood: "famille", label: "Famille", letter: "F" },
];

const actions = (city: string, paris: boolean) => [
  { to: "/planner", icon: "calendar", title: "Planifier", sub: "Ma journée sur-mesure" },
  { to: "/rues", icon: "book", title: "Une rue", sub: "Son histoire, ses potins" },
  { to: "/soirees", icon: "star", title: "Sortir ce soir", sub: paris ? "La nuit, arrondissement par arrondissement" : "La nuit, quartier par quartier" },
  { to: "/annuaire?g=r", icon: "heart", title: "Où manger", sub: `Tous les restos de ${city}` },
  { to: "/annuaire?g=b", icon: "star", title: "Boire un verre", sub: "Tous les bars, pubs, bars à vin" },
  { to: "/annuaire?g=a", icon: "sparkles", title: "Activités", sub: "Musées, expos, parcs, sorties" },
  { to: "/annuaire?g=s", icon: "walk", title: "Sport & cours", sub: "Salles, yoga, ateliers, danse" },
  { to: "/voyages?tab=hotels", icon: "bed", title: "Dormir", sub: "Tous les hôtels, réservation directe" },
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
  const cloud = useCloud();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const city = useCity();
  const paris = city.id === "paris";
  const spots = useMemo(() => citySpots(city.id), [city.id, cloud.version]); // eslint-disable-line react-hooks/exhaustive-deps

  const home = paris ? QUARTIERS.find((x) => x.name === profile.quartier) ?? QUARTIERS[0] : city.center;
  const nearby = useMemo(
    () =>
      spots.filter((s) => s.hidden >= 2 && s.category !== "hotel")
        .map((s) => ({ s, d: distanceKm(home, s) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, 6),
    [home, spots],
  );
  // adresses tendance / cachées (sélection « TikTok »), mélangées à chaque visite
  const buzz = useMemo(() => spots.filter((s) => s.id.startsWith("tt-")).sort(() => Math.random() - 0.5).slice(0, 10), [spots]);
  const forYou = useMemo(() => {
    const m = profile.moods;
    const list = spots.filter((s) => s.category !== "hotel" && (!m.length || s.moods.some((x) => m.includes(x))));
    return (list.length ? list : spots.filter((s) => s.category !== "hotel")).slice(0, 8);
  }, [profile.moods, spots]);
  const streets = cityStreets(city.id);
  const streetOfDay = streets.length ? streets[new Date().getDate() % streets.length] : null;
  const favorites = useMemo(() => spots.filter((s) => s.category !== "hotel").sort((a, b) => b.hidden - a.hidden || a.name.localeCompare(b.name)).slice(0, 4), [spots]);

  return (
    <div className="page home">
      <header className="top-bar">
        <div className="grow">
          <p className="eyebrow">{greeting()}</p>
          <h1 className="serif hello">{profile.name || "toi"} <span className="wave">👋</span></h1>
          <CityPicker />
        </div>
        <Link to="/profil" className="avatar-sm serif" aria-label="Mon profil">{(profile.name || "M").charAt(0).toUpperCase()}</Link>
      </header>

      <form
        className="search search-home"
        onSubmit={(e) => {
          e.preventDefault();
          navigate(q.trim() ? `/marco?q=${encodeURIComponent(q.trim())}` : "/marco");
        }}
      >
        <Icon name="sparkles" size={18} />
        <input id="home-ask" value={q} onChange={(e) => setQ(e.target.value)} placeholder="T'as envie de quoi ?" aria-label="Demander à Marco" enterKeyHint="send" />
        <button className="btn-round sm" aria-label="Demander à Marco"><Icon name="arrowRight" size={18} /></button>
      </form>

      <section className="marco-card" onClick={() => navigate("/marco")}>
        <MarcoLogo size={58} />
        <div className="speech">
          <p className="serif">Tu veux visiter {city.name} sans finir dans un attrape-touristes ?</p>
          <span className="small">Dis-moi ce que tu veux faire, je construis le plan.</span>
        </div>
      </section>

      <nav className="actions" aria-label="Raccourcis">
        {actions(city.name, paris).map((a) => (
          <Link key={a.to} to={a.to} className="action">
            <span className="action-ico"><Icon name={a.icon} size={20} /></span>
            <strong>{a.title}</strong>
            <span className="tiny muted">{a.sub}</span>
          </Link>
        ))}
      </nav>

      <div className="stories" role="list" aria-label="Envies">
        {STORIES.map((st) => (
          <button key={st.mood} className={`story ${profile.moods.includes(st.mood) ? "active" : ""}`} onClick={() => navigate(`/explorer?mood=${st.mood}`)} role="listitem">
            <span className="story-ring"><span className="story-inner serif">{st.letter}</span></span>
            <span className="tiny">{st.label}</span>
          </button>
        ))}
      </div>

      <section>
        <div className="section-head">
          <h2 className="serif">{paris ? "Pépites près de chez toi" : `Les pépites de ${city.name}`}</h2>
          <Link to="/carte" className="link small">Carte</Link>
        </div>
        <p className="muted small section-sub">{paris ? `Autour de ${profile.quartier}` : `Autour du centre de ${city.name}`}</p>
        <div className="h-scroll">
          {nearby.map(({ s, d }) => (
            <div key={s.id} className="h-item"><SpotCard spot={s} distance={d} /></div>
          ))}
        </div>
      </section>

      {buzz.length > 0 && (
        <section>
          <div className="section-head">
            <h2 className="serif">Ce qui buzze à {city.name}</h2>
            <Link to="/explorer?mood=tendance" className="link small">Voir tout</Link>
          </div>
          <p className="muted small section-sub">Les adresses cachées et insolites qui tournent sur TikTok</p>
          <div className="h-scroll">
            {buzz.map((s) => (
              <div key={s.id} className="h-item"><SpotCard spot={s} /></div>
            ))}
          </div>
        </section>
      )}

      {streetOfDay && (
        <Link to={`/rues?q=${encodeURIComponent(streetOfDay.name)}`} className="street-card">
          <span className="eyebrow light"><Icon name="book" size={14} /> La rue du jour</span>
          <h2 className="serif">{streetOfDay.name}</h2>
          <p className="small clamp-3">{streetOfDay.anecdote}</p>
          <span className="street-cta small">Lire son histoire <Icon name="arrowRight" size={16} /></span>
        </Link>
      )}

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

      {cloud.db && (
        <Link to="/proposer" className="propose-card">
          <Icon name="heart" size={20} />
          <div className="grow">
            <strong>Tu connais une pépite ?</strong>
            <p className="small muted">Propose-la à Marco, on l'ajoute à la sélection.</p>
          </div>
          <Icon name="arrowRight" size={18} />
        </Link>
      )}

      <Link to="/voyages" className="soon-card">
        <div className="grow">
          <span className="eyebrow">Marco Voyages</span>
          <h2 className="serif">Vols, hôtels, appartements et séjour sur mesure.</h2>
        </div>
        <Icon name="arrowRight" size={22} />
      </Link>
    </div>
  );
}
