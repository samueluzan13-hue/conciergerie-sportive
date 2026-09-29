import { useState } from "react";
import { Icon } from "../components/Icon";
import { MarcoLogo } from "../components/MarcoLogo";
import { MOOD_LABEL, QUARTIERS, type Mood } from "../data/spots";
import { updateProfile } from "../lib/store";

export function Onboarding() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [quartier, setQuartier] = useState(QUARTIERS[0].name);
  const [moods, setMoods] = useState<Mood[]>([]);

  const finish = () => updateProfile({ name: name.trim(), quartier, moods, onboarded: true });

  return (
    <div className="onboarding">
      {step === 0 && (
        <div className="ob-step ob-intro">
          <MarcoLogo size={120} />
          <h1 className="serif">Salut, moi c'est Marco.</h1>
          <p className="lead">Tu veux visiter Paris sans finir dans un attrape-touristes ? Marco s'en occupe.</p>
          <ul className="ob-list">
            <li><Icon name="sparkles" size={18} /> Tu dis ce que tu veux faire, je construis le plan.</li>
            <li><Icon name="pin" size={18} /> Les adresses cachées de ton quartier.</li>
            <li><Icon name="book" size={18} /> L'histoire (et les potins) de chaque rue.</li>
          </ul>
          <button className="btn btn-primary btn-block" onClick={() => setStep(1)}>C'est parti</button>
          <button className="btn-text" onClick={finish}>Passer, je veux juste explorer</button>
        </div>
      )}

      {step === 1 && (
        <div className="ob-step">
          <p className="eyebrow">1 / 3</p>
          <h1 className="serif">Comment je t'appelle ?</h1>
          <input className="input" autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Ton prénom" onKeyDown={(e) => e.key === "Enter" && setStep(2)} />
          <button className="btn btn-primary btn-block" onClick={() => setStep(2)}>Continuer</button>
        </div>
      )}

      {step === 2 && (
        <div className="ob-step">
          <p className="eyebrow">2 / 3</p>
          <h1 className="serif">Tu vis ou tu dors où{name ? `, ${name}` : ""} ?</h1>
          <p className="muted">Je te sortirai les pépites cachées autour de chez toi.</p>
          <div className="chip-grid">
            {QUARTIERS.map((q) => (
              <button key={q.name} className={`chip ${quartier === q.name ? "on" : ""}`} onClick={() => setQuartier(q.name)}>{q.name}</button>
            ))}
          </div>
          <button className="btn btn-primary btn-block" onClick={() => setStep(3)}>Continuer</button>
        </div>
      )}

      {step === 3 && (
        <div className="ob-step">
          <p className="eyebrow">3 / 3</p>
          <h1 className="serif">Plutôt quel genre ?</h1>
          <p className="muted">Choisis autant que tu veux, je m'adapte.</p>
          <div className="chip-grid">
            {(Object.keys(MOOD_LABEL) as Mood[]).map((m) => (
              <button key={m} className={`chip ${moods.includes(m) ? "on" : ""}`} onClick={() => setMoods((x) => (x.includes(m) ? x.filter((y) => y !== m) : [...x, m]))}>
                {MOOD_LABEL[m]}
              </button>
            ))}
          </div>
          <button className="btn btn-primary btn-block" onClick={finish}>Montre-moi Paris</button>
        </div>
      )}
    </div>
  );
}
