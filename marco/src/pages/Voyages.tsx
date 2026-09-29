import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../components/Icon";
import { MarcoLogo } from "../components/MarcoLogo";
import { generatePlan, type Who } from "../lib/planner";
import { setState, useStore } from "../lib/store";

const CITIES = [
  { name: "Paris", live: true },
  { name: "Lisbonne", live: false },
  { name: "Barcelone", live: false },
  { name: "Rome", live: false },
  { name: "Londres", live: false },
  { name: "Amsterdam", live: false },
];

const INCLUDE = ["Hébergement", "Restaurants", "Activités", "Transports"];

export function Voyages() {
  const navigate = useNavigate();
  const profile = useStore((s) => s.profile);
  const waitlist = useStore((s) => s.waitlist);
  const [city, setCity] = useState("Paris");
  const [days, setDays] = useState(3);
  const [who, setWho] = useState<Who>("date");
  const [include, setInclude] = useState<string[]>(["Hébergement", "Restaurants", "Activités"]);
  const [preview, setPreview] = useState<ReturnType<typeof generatePlan>[] | null>(null);
  const [email, setEmail] = useState("");

  const cityLive = CITIES.find((c) => c.name === city)?.live;

  return (
    <div className="page">
      <button className="back" onClick={() => navigate(-1)} aria-label="Retour"><Icon name="arrowLeft" size={20} /></button>
      <div className="voyage-hero">
        <span className="eyebrow light">Marco Voyages · bientôt</span>
        <h1 className="serif">Ton voyage, réservé en un seul endroit.</h1>
        <p>Pas un circuit bateau : un séjour construit autour de toi, avec les bonnes adresses, les tables réservées et les activités calées.</p>
      </div>

      <section className="card">
        <h2 className="serif section-title">Où ça ?</h2>
        <div className="chip-grid">
          {CITIES.map((c) => (
            <button key={c.name} className={`chip ${city === c.name ? "on" : ""}`} onClick={() => { setCity(c.name); setPreview(null); }}>
              {c.name} {!c.live && <span className="soon">bientôt</span>}
            </button>
          ))}
        </div>

        <h2 className="serif section-title">Combien de jours ?</h2>
        <div className="stepper">
          <button onClick={() => setDays(Math.max(1, days - 1))} aria-label="Moins">−</button>
          <strong>{days} jour{days > 1 ? "s" : ""}</strong>
          <button onClick={() => setDays(Math.min(7, days + 1))} aria-label="Plus">+</button>
        </div>

        <h2 className="serif section-title">Avec qui ?</h2>
        <div className="chip-grid">
          {([["solo", "Solo"], ["date", "En couple"], ["amis", "Entre amis"], ["famille", "En famille"]] as [Who, string][]).map(([v, l]) => (
            <button key={v} className={`chip ${who === v ? "on" : ""}`} onClick={() => setWho(v)}>{l}</button>
          ))}
        </div>

        <h2 className="serif section-title">Marco s'occupe de…</h2>
        <div className="chip-grid">
          {INCLUDE.map((i) => (
            <button key={i} className={`chip ${include.includes(i) ? "on" : ""}`} onClick={() => setInclude((x) => (x.includes(i) ? x.filter((y) => y !== i) : [...x, i]))}>
              {include.includes(i) && <Icon name="check" size={14} />} {i}
            </button>
          ))}
        </div>

        <button
          className="btn btn-primary btn-block"
          style={{ marginTop: 18 }}
          onClick={() =>
            setPreview(
              Array.from({ length: days }, (_, d) =>
                generatePlan({ who, duration: "journee", budget: 2, envies: [], quartier: profile.quartier, hiddenOnly: d % 2 === 0 }),
              ),
            )
          }
          disabled={!cityLive}
        >
          <Icon name="sparkles" size={18} /> {cityLive ? "Voir un aperçu de mon séjour" : `${city} arrive bientôt sur Marco`}
        </button>
      </section>

      {preview && (
        <section>
          <h2 className="serif section-title">Aperçu : {days} jour{days > 1 ? "s" : ""} à Paris</h2>
          <div className="stack">
            {preview.map((p, i) => (
              <div key={i} className="plan-card">
                <div className="row-between"><strong>Jour {i + 1}</strong><span className="tiny muted">{p.stops.length} étapes</span></div>
                <p className="small muted">{p.stops.map((s) => `${s.start} ${s.spot.name}`).join(" → ")}</p>
              </div>
            ))}
            {include.includes("Hébergement") && (
              <div className="plan-card dashed">
                <strong>Hébergement</strong>
                <p className="small muted">Sélection d'hôtels de caractère près de tes étapes, réservables ici dès l'ouverture.</p>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="card waitlist">
        <MarcoLogo size={48} />
        <h2 className="serif">Sois le premier à réserver avec Marco</h2>
        {waitlist ? (
          <p className="small"><Icon name="check" size={14} /> C'est noté ! On te prévient à <strong>{waitlist}</strong> dès l'ouverture des réservations.</p>
        ) : (
          <form
            className="street-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (/\S+@\S+\.\S+/.test(email)) setState((s) => ({ ...s, waitlist: email.trim() }));
            }}
          >
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Ton e-mail" aria-label="E-mail" required />
            <button className="btn-round" aria-label="M'inscrire"><Icon name="arrowRight" size={20} /></button>
          </form>
        )}
        <p className="tiny muted">Pour l'instant ton e-mail reste sur ton appareil (démo) : il faudra brancher un service d'inscription.</p>
      </section>
    </div>
  );
}
