import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../components/Icon";
import { MarcoLogo } from "../components/MarcoLogo";
import { SpotPhoto } from "../components/SpotPhoto";
import { bookingUrl, useSpotSheet } from "../components/SpotSheet";
import { bookingKind, CATEGORY_LABEL, QUARTIERS } from "../data/spots";
import { generatePlan, type Budget, type Duration, type Envie, type Plan, type PlanInput, type Who } from "../lib/planner";
import { savePlan, useStore } from "../lib/store";

const WHO: { v: Who; label: string; sub: string }[] = [
  { v: "solo", label: "Solo", sub: "Moi, moi et moi" },
  { v: "date", label: "Un date", sub: "Faut impressionner" },
  { v: "amis", label: "Entre potes", sub: "La bande au complet" },
  { v: "famille", label: "En famille", sub: "Avec les petits" },
];
const DURATION: { v: Duration; label: string; sub: string }[] = [
  { v: "3h", label: "3 heures", sub: "Un après-midi express" },
  { v: "soiree", label: "Une soirée", sub: "Du coucher de soleil à tard" },
  { v: "journee", label: "Une journée", sub: "Du café du matin au dernier verre" },
];
const ENVIES: { v: Envie; label: string }[] = [
  { v: "manger", label: "Bien manger" },
  { v: "verre", label: "Boire un verre" },
  { v: "culture", label: "Culture" },
  { v: "insolite", label: "Insolite" },
  { v: "nature", label: "Prendre l'air" },
  { v: "cafe", label: "Café & douceurs" },
  { v: "activite", label: "Une activité" },
];

const STEPS = ["Qui ?", "Combien de temps ?", "Tes envies", "Ton budget", "On part d'où ?"];

export function Planner() {
  const profile = useStore((s) => s.profile);
  const navigate = useNavigate();
  const openSpot = useSpotSheet();
  const [step, setStep] = useState(0);
  const [input, setInput] = useState<PlanInput>({
    who: "solo",
    duration: "3h",
    budget: 2,
    envies: [],
    quartier: profile.quartier,
    hiddenOnly: true,
  });
  const [plan, setPlan] = useState<Plan | null>(null);
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState<"" | "copied" | "manual">("");

  const set = <K extends keyof PlanInput>(k: K, v: PlanInput[K]) => setInput((x) => ({ ...x, [k]: v }));
  const build = () => {
    setPlan(generatePlan(input));
    setSaved(false);
  };

  if (plan) {
    const shareText = `${plan.title} — mon plan Marco :\n${plan.stops.map((s) => `${s.start} ${s.spot.name} (${s.spot.address})`).join("\n")}`;
    return (
      <div className="page">
        <button className="back" onClick={() => setPlan(null)} aria-label="Modifier"><Icon name="arrowLeft" size={20} /></button>
        <div className="plan-head">
          <MarcoLogo size={52} />
          <div>
            <p className="eyebrow">Ton plan est prêt</p>
            <h1 className="serif page-title" style={{ margin: 0 }}>{plan.title}</h1>
          </div>
        </div>
        <p className="muted">{plan.intro}</p>
        <p className="small plan-meta">
          <Icon name="clock" size={14} /> {Math.floor(plan.totalMinutes / 60)}h{String(plan.totalMinutes % 60).padStart(2, "0")} · {plan.stops.length} étapes · départ {input.quartier}
        </p>

        <ol className="timeline">
          {plan.stops.map((s, i) => (
            <li key={s.spot.id}>
              {s.travel && (
                <div className="travel">
                  <Icon name={s.travel.mode === "à pied" ? "walk" : "metro"} size={14} /> {s.travel.minutes} min {s.travel.mode}
                </div>
              )}
              <div className="tl-item">
                <div className="tl-time">
                  <strong>{s.start}</strong>
                  <span className="tiny muted">{s.end}</span>
                </div>
                <div className="tl-dot">{i + 1}</div>
                <div className="tl-card" onClick={() => openSpot(s.spot.id)}>
                  <div className="tl-art"><SpotPhoto spot={s.spot} height={70} rounded={12} /></div>
                  <div className="grow">
                    <span className="tiny eyebrow">{CATEGORY_LABEL[s.spot.category]} · {s.spot.quartier}</span>
                    <h3>{s.spot.name}</h3>
                    <p className="small muted">{s.why}</p>
                    {bookingKind(s.spot) && (
                      <a className="book-link" href={bookingUrl(s.spot)} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                        <Icon name="calendar" size={14} /> {bookingKind(s.spot) === "table" ? "Réserver au restaurant" : "Réserver"}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="plan-actions">
          <button
            className="btn btn-primary"
            disabled={saved}
            onClick={() => {
              savePlan({ id: String(Date.now()), title: plan.title, createdAt: Date.now(), stops: plan.stops.map((s) => ({ spotId: s.spot.id, time: s.start })) });
              setSaved(true);
            }}
          >
            <Icon name={saved ? "check" : "bookmark"} size={18} /> {saved ? "Enregistré" : "Enregistrer"}
          </button>
          <button
            className="btn btn-ghost"
            onClick={async () => {
              try {
                if (navigator.share && !import.meta.env.VITE_PREVIEW) {
                  await navigator.share({ title: plan.title, text: shareText });
                  return;
                }
              } catch {
                /* partage refusé : on copie */
              }
              try {
                await navigator.clipboard.writeText(shareText);
                setShared("copied");
              } catch {
                setShared("manual");
              }
            }}
          >
            <Icon name={shared === "copied" ? "check" : "share"} size={18} /> {shared === "copied" ? "Copié" : "Partager"}
          </button>
          <button className="btn btn-ghost" onClick={build}><Icon name="refresh" size={18} /> Autre plan</button>
        </div>
        {shared === "manual" && <textarea id="share-text" className="input textarea" readOnly rows={5} value={shareText} onFocus={(e) => e.target.select()} />}
        <button className="btn btn-soft btn-block" onClick={() => navigate(`/marco?q=${encodeURIComponent(`Affine mon plan « ${plan.title} » : ${plan.stops.map((s) => `${s.start} ${s.spot.name}`).join(", ")}. `)}`)}>
          <Icon name="sparkles" size={18} /> Affiner avec Marco
        </button>
      </div>
    );
  }

  return (
    <div className="page planner">
      <header className="plan-head">
        <MarcoLogo size={44} />
        <div>
          <h1 className="serif page-title" style={{ margin: 0 }}>Planificateur</h1>
          <p className="tiny muted">Marco t'aide à tout organiser</p>
        </div>
      </header>
      <div className="progress"><span style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} /></div>
      <p className="tiny muted">Étape {step + 1} sur {STEPS.length}</p>
      <h2 className="serif step-title">{STEPS[step]}</h2>

      {step === 0 && (
        <div className="options">
          {WHO.map((o) => (
            <button key={o.v} className={`option ${input.who === o.v ? "on" : ""}`} onClick={() => set("who", o.v)}>
              <strong>{o.label}</strong><span className="small muted">{o.sub}</span>
            </button>
          ))}
        </div>
      )}
      {step === 1 && (
        <div className="options">
          {DURATION.map((o) => (
            <button key={o.v} className={`option ${input.duration === o.v ? "on" : ""}`} onClick={() => set("duration", o.v)}>
              <strong>{o.label}</strong><span className="small muted">{o.sub}</span>
            </button>
          ))}
        </div>
      )}
      {step === 2 && (
        <>
          <p className="muted small">Choisis-en plusieurs, ou aucune et laisse Marco décider.</p>
          <div className="chip-grid">
            {ENVIES.map((o) => (
              <button
                key={o.v}
                className={`chip ${input.envies.includes(o.v) ? "on" : ""}`}
                onClick={() => set("envies", input.envies.includes(o.v) ? input.envies.filter((x) => x !== o.v) : [...input.envies, o.v])}
              >
                {o.label}
              </button>
            ))}
          </div>
        </>
      )}
      {step === 3 && (
        <>
          <div className="options">
            {([1, 2, 3] as Budget[]).map((b) => (
              <button key={b} className={`option ${input.budget === b ? "on" : ""}`} onClick={() => set("budget", b)}>
                <strong>{"€".repeat(b)}</strong>
                <span className="small muted">{b === 1 ? "Malin, presque gratuit" : b === 2 ? "Raisonnable" : "Je me fais plaisir"}</span>
              </button>
            ))}
          </div>
          <label className="switch" style={{ marginTop: 16 }}>
            <input type="checkbox" checked={input.hiddenOnly} onChange={(e) => set("hiddenOnly", e.target.checked)} />
            <span className="switch-track" />
            <span className="small">Zéro attrape-touristes (priorité aux pépites cachées)</span>
          </label>
        </>
      )}
      {step === 4 && (
        <div className="chip-grid">
          {QUARTIERS.map((q) => (
            <button key={q.name} className={`chip ${input.quartier === q.name ? "on" : ""}`} onClick={() => set("quartier", q.name)}>{q.name}</button>
          ))}
        </div>
      )}

      <div className="planner-foot">
        {step > 0 && <button className="btn btn-ghost" onClick={() => setStep(step - 1)}>Retour</button>}
        <button className="btn btn-primary grow" onClick={() => (step < STEPS.length - 1 ? setStep(step + 1) : build())}>
          {step < STEPS.length - 1 ? "Continuer" : "Construire mon plan"}
        </button>
      </div>
    </div>
  );
}
