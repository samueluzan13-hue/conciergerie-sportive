import { useEffect, useState } from "react";
import { Link } from "../components/Nav";
import { Icon } from "../components/Icon";
import { SpotCard, SpotRow } from "../components/SpotCard";
import { MOOD_LABEL, QUARTIERS, spotById, type Mood } from "../data/spots";
import { STREETS } from "../data/streets";
import { useCloud, watchBooking } from "../lib/cloud";
import { fmtPrice } from "../lib/booking";
import { Markdown } from "../components/Markdown";
import { applyCall, getCall } from "../lib/voice";
import { forget, setState, updateBooking, updateProfile, useStore } from "../lib/store";

export function Profile() {
  const { profile, saved, history, plans, streetsRead } = useStore((s) => s);
  const cloud = useCloud();
  const memory = useStore((s) => s.memory ?? []);
  const bookings = useStore((s) => s.bookings ?? []);
  const trips = useStore((s) => s.trips ?? []);
  const [openTrip, setOpenTrip] = useState<string | null>(null);
  const bookingIds = bookings.map((b) => b.id + b.status).join(",");
  // suivi en direct : l'équipe Marco confirme (ou non) dans la base
  useEffect(() => {
    const offs = bookings.filter((b) => !b.callId).map((b) => watchBooking(b.id, (x) => x && updateBooking(b.id, { status: x.status, reponse: x.reponse || undefined })));
    // appels de l'agent vocal encore en cours : on relève le résultat
    const calling = bookings.filter((b) => b.callId && b.status === "en_attente");
    const poll = () => calling.forEach((b) => getCall(b.callId!).then((r) => r && applyCall(b, r)));
    if (calling.length) poll();
    const timer = calling.length ? setInterval(poll, 10000) : undefined;
    return () => {
      offs.forEach((off) => off());
      clearInterval(timer);
    };
  }, [bookingIds, cloud.db]); // eslint-disable-line react-hooks/exhaustive-deps
  const [editing, setEditing] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
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

      {trips.length > 0 && (
        <section>
          <h2 className="serif section-title"><Icon name="plane" size={16} /> Mes voyages</h2>
          <ul className="booking-list">
            {trips.map((t) => (
              <li key={t.id} className="trip-item" onClick={() => t.text && setOpenTrip(openTrip === t.id ? null : t.id)}>
                <div className="grow">
                  <strong className="small">{t.title}</strong>
                  <p className="tiny muted">{t.detail}</p>
                  {t.reference && <p className="tiny">Référence {t.reference}{t.price ? ` · ${fmtPrice(t.price, t.currency)}` : ""}</p>}
                  {t.payUrl && <p className="tiny">{fmtPrice(t.price, t.currency)} · <a className="link" href={t.payUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>Payer sur le site ›</a></p>}
                  {t.kind === "sejour" && <p className="tiny">Budget estimé sur place : {fmtPrice(t.price, t.currency)} · {openTrip === t.id ? "masquer" : "voir le programme"}</p>}
                  {openTrip === t.id && t.text && <div className="trip-text"><Markdown text={t.text} /></div>}
                </div>
                <span className={`status ${t.demo || t.payUrl ? "" : "status-confirmee"}`}>
                  {t.kind === "sejour" ? "Programme" : t.payUrl ? "À payer" : t.demo ? "Exemple" : "Réservé"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {bookings.length > 0 && (
        <section>
          <h2 className="serif section-title"><Icon name="calendar" size={16} /> Mes réservations</h2>
          <ul className="booking-list">
            {bookings.map((b) => (
              <li key={b.id}>
                <div className="grow">
                  <strong className="small">{b.place}</strong>
                  <p className="tiny muted">
                    {new Date(`${b.date}T${b.time}`).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })} à {b.time} · {b.people} pers.
                  </p>
                  {b.reponse && <p className="tiny">Marco : {b.reponse}</p>}
                </div>
                <span className={`status status-${b.status}`}>
                  {b.status === "confirmee" ? "Confirmée" : b.status === "impossible" ? "Impossible" : "En cours"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <div className="section-head">
          <h2 className="serif section-title"><Icon name="sparkles" size={16} /> Ce que Marco sait de toi</h2>
          {memory.length > 0 && <button className="link tiny" onClick={() => forget()}>Tout effacer</button>}
        </div>
        {memory.length ? (
          <ul className="memory-list">
            {memory.map((m) => (
              <li key={m}>
                <span className="small">{m}</span>
                <button className="icon-btn small" aria-label={`Oublier : ${m}`} onClick={() => forget(m)}><Icon name="close" size={14} /></button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted small">Rien pour l'instant. Quand tu dis à Marco quelque chose sur toi (un régime, des enfants, ton budget…), il le retient ici pour mieux te conseiller. Tu peux tout effacer quand tu veux.</p>
        )}
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

      {cloud.isAdmin && (
        <Link to="/base" className="propose-card">
          <Icon name="settings" size={20} />
          <div className="grow">
            <strong>Gérer la base de données</strong>
            <p className="small muted">Ajouter, modifier ou retirer des lieux et des rues, voir les propositions.</p>
          </div>
          <Icon name="arrowRight" size={18} />
        </Link>
      )}

      <p className="tiny muted center">
        {cloud.db && cloud.userId ? "Tes données sont sauvegardées sur ton compte." : "Tes données sont enregistrées sur cet appareil."}
      </p>

      {confirmReset ? (
        <div className="confirm-box">
          <p className="small">Effacer ton profil, tes favoris et tes plans ?</p>
          <div className="row gap-8">
            <button className="btn btn-ghost grow" onClick={() => setConfirmReset(false)}>Annuler</button>
            <button
              className="btn btn-danger grow"
              onClick={() => {
                setState(() => ({ profile: { name: "", quartier: QUARTIERS[0].name, moods: [], onboarded: false }, saved: [], history: [], plans: [], streetsRead: [], memory: [], bookings: [], trips: [] }));
                setConfirmReset(false);
              }}
            >
              Effacer
            </button>
          </div>
        </div>
      ) : (
        <button className="btn-text danger" onClick={() => setConfirmReset(true)}>Réinitialiser mon profil</button>
      )}
    </div>
  );
}
