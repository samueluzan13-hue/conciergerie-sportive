import { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { SpotCard, SpotRow } from "../components/SpotCard";
import { MOOD_LABEL, QUARTIERS, spotById, type Mood } from "../data/spots";
import { STREETS } from "../data/streets";
import { setState, updateProfile, useStore } from "../lib/store";

export function Profile() {
  const { profile, saved, history, plans, streetsRead } = useStore((s) => s);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const savedSpots = saved.map(spotById).filter(Boolean);
  const historySpots = history.map(spotById).filter(Boolean);

  return (
    <div className="page">
      <header className="profile-head">
        <div className="avatar serif">{(profile.name || "M").charAt(0).toUpperCase()}</div>
        <div className="grow">
          {editing ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateProfile({ name: name.trim() });
                setEditing(false);
              }}
            >
              <input className="input" autoFocus value={name} onChange={(e) => setName(e.target.value)} onBlur={() => { updateProfile({ name: name.trim() }); setEditing(false); }} />
            </form>
          ) : (
            <h1 className="serif page-title" style={{ margin: 0 }} onClick={() => setEditing(true)}>{profile.name || "Voyageur"}</h1>
          )}
          <p className="muted small"><Icon name="pin" size={13} /> {profile.quartier}</p>
        </div>
        <button className="icon-btn" aria-label="Modifier le prénom" onClick={() => setEditing(true)}><Icon name="settings" size={18} /></button>
      </header>

      <div className="stats">
        <div><strong className="serif">{saved.length}</strong><span className="tiny muted">Lieux</span></div>
        <div><strong className="serif">{plans.length}</strong><span className="tiny muted">Plans</span></div>
        <div><strong className="serif">{streetsRead.length}</strong><span className="tiny muted">Rues</span></div>
      </div>

      <section>
        <h2 className="serif section-title">Mes goûts</h2>
        <div className="tags">
          {(Object.keys(MOOD_LABEL) as Mood[]).map((m) => (
            <button
              key={m}
              className={`chip ${profile.moods.includes(m) ? "on" : ""}`}
              onClick={() => updateProfile({ moods: profile.moods.includes(m) ? profile.moods.filter((x) => x !== m) : [...profile.moods, m] })}
            >
              {MOOD_LABEL[m]}
            </button>
          ))}
        </div>
        <label className="field">
          <span className="tiny muted">Mon quartier</span>
          <select className="input" value={profile.quartier} onChange={(e) => updateProfile({ quartier: e.target.value })}>
            {QUARTIERS.map((q) => <option key={q.name}>{q.name}</option>)}
          </select>
        </label>
      </section>

      <section>
        <div className="section-head">
          <h2 className="serif section-title"><Icon name="heart" size={16} /> Mes enregistrements</h2>
          <span className="tiny muted">{saved.length} lieu{saved.length > 1 ? "x" : ""}</span>
        </div>
        {savedSpots.length ? (
          <div className="grid-2">{savedSpots.map((s) => <SpotCard key={s!.id} spot={s!} />)}</div>
        ) : (
          <p className="muted small">Touche le cœur d'une adresse pour la garder ici. <Link className="link" to="/explorer">Explorer</Link></p>
        )}
      </section>

      {plans.length > 0 && (
        <section>
          <h2 className="serif section-title"><Icon name="calendar" size={16} /> Mes plans</h2>
          <div className="stack">
            {plans.map((p) => (
              <div key={p.id} className="plan-card">
                <div className="row-between">
                  <strong>{p.title}</strong>
                  <span className="tiny muted">{new Date(p.createdAt).toLocaleDateString("fr-FR")}</span>
                </div>
                <p className="small muted">{p.stops.map((s) => `${s.time} ${spotById(s.spotId)?.name ?? ""}`).join(" → ")}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {streetsRead.length > 0 && (
        <section>
          <h2 className="serif section-title"><Icon name="book" size={16} /> Rues découvertes</h2>
          <div className="tags">
            {streetsRead.map((id) => STREETS.find((s) => s.id === id)).filter(Boolean).map((s) => (
              <Link key={s!.id} to={`/rues?q=${encodeURIComponent(s!.name)}`} className="tag">{s!.name}</Link>
            ))}
          </div>
        </section>
      )}

      {historySpots.length > 0 && (
        <section>
          <h2 className="serif section-title"><Icon name="clock" size={16} /> Mon historique</h2>
          <div className="stack">{historySpots.slice(0, 5).map((s) => <SpotRow key={s!.id} spot={s!} />)}</div>
        </section>
      )}

      <button
        className="btn-text danger"
        onClick={() => {
          if (confirm("Effacer ton profil et tes enregistrements sur cet appareil ?")) {
            setState(() => ({ profile: { name: "", quartier: QUARTIERS[0].name, moods: [], onboarded: false }, saved: [], history: [], plans: [], streetsRead: [] }));
          }
        }}
      >
        Réinitialiser mon profil
      </button>
    </div>
  );
}
