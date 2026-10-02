import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../components/Icon";
import { CATEGORY_LABEL, MOOD_LABEL, QUARTIERS, SPOTS, spotById, type Category, type Mood, type Spot } from "../data/spots";
import { STREETS, type StreetStory } from "../data/streets";
import { CITIES, type CityId } from "../data/cities";
import { answerBooking, deleteSpot, deleteStreet, deleteSuggestion, saveSpot, saveStreet, useCloud, type Booking, type Suggestion } from "../lib/cloud";
import { duckyUrl, reserveUrl } from "../lib/reservation";

type Tab = "lieux" | "rues" | "propositions" | "reservations";

const EMPTY_SPOT: Spot = {
  id: "", name: "", category: "resto", quartier: QUARTIERS[0].name, arrondissement: 1, address: "",
  lat: QUARTIERS[0].lat, lng: QUARTIERS[0].lng, price: 2, hidden: 2, moods: [], pitch: "", tip: "", duration: 60,
};
const EMPTY_STREET: StreetStory = {
  id: "", name: "", aliases: [], arrondissement: "", lat: 48.8566, lng: 2.3522, histoire: "", fait: { annee: "", texte: "" }, anecdote: "", aVoir: [],
};

/** Bouton de suppression en deux temps (les boîtes de confirmation du navigateur ne sont pas disponibles partout). */
/** Une demande de réservation : l'équipe appelle ou réserve en ligne, puis répond à l'utilisateur. */
function BookingRow({ b }: { b: Booking }) {
  const [msg, setMsg] = useState(b.reponse);
  const spot = b.spotId ? spotById(b.spotId) : undefined;
  const when = new Date(`${b.date}T${b.time}`).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  return (
    <div className="admin-row col">
      <div className="row gap-8" style={{ justifyContent: "space-between" }}>
        <strong>{b.place}</strong>
        <span className={`status status-${b.status}`}>{b.status === "confirmee" ? "Confirmée" : b.status === "impossible" ? "Impossible" : "À traiter"}</span>
      </div>
      <span className="small">{when} à {b.time} · {b.people} pers. · au nom de {b.name} · <a className="link" href={`tel:${b.phone.replace(/[^\d+]/g, "")}`}>{b.phone}</a></span>
      {b.note && <p className="small muted">« {b.note} »</p>}
      <a className="link small" href={spot ? reserveUrl(spot) : duckyUrl(b.place)} target="_blank" rel="noreferrer">Site du restaurant ›</a>
      <input className="input" value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Message pour l'utilisateur (ex. Table en terrasse, confirmée par SMS)" />
      <div className="row gap-8">
        <button className="btn-mini primary" onClick={() => answerBooking(b.id, "confirmee", msg)}>Confirmée</button>
        <button className="btn-mini" onClick={() => answerBooking(b.id, "impossible", msg || "Complet à cet horaire : dis-moi si un autre créneau te va.")}>Impossible</button>
      </div>
    </div>
  );
}

function DeleteButton({ onConfirm }: { onConfirm: () => Promise<void> }) {
  const [armed, setArmed] = useState(false);
  return armed ? (
    <span className="row gap-8">
      <button className="btn-mini danger" onClick={() => onConfirm().finally(() => setArmed(false))}>Confirmer</button>
      <button className="btn-mini" onClick={() => setArmed(false)}>Annuler</button>
    </span>
  ) : (
    <button className="btn-mini" onClick={() => setArmed(true)} aria-label="Supprimer"><Icon name="close" size={14} /> Supprimer</button>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="field"><span className="label">{label}</span>{children}</label>;
}

function SpotForm({ initial, onDone }: { initial: Spot; onDone: () => void }) {
  const [s, setS] = useState<Spot>(initial);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof Spot>(k: K, v: Spot[K]) => setS((x) => ({ ...x, [k]: v }));

  return (
    <form
      className="card form"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!s.name.trim() || !s.pitch.trim()) return setErr("Il faut au moins un nom et une description.");
        setBusy(true);
        try {
          await saveSpot({ ...s, name: s.name.trim() });
          onDone();
        } catch {
          setErr("L'enregistrement a échoué. Vérifie ta connexion et tes droits d'édition, puis réessaie.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <h2 className="serif section-title">{initial.id ? "Modifier le lieu" : "Nouveau lieu"}</h2>
      <Field label="Nom"><input id="s-name" className="input" value={s.name} onChange={(e) => set("name", e.target.value)} maxLength={120} required /></Field>
      <div className="form-row">
        <Field label="Catégorie">
          <select id="s-cat" className="input" value={s.category} onChange={(e) => set("category", e.target.value as Category)}>
            {(Object.keys(CATEGORY_LABEL) as Category[]).map((c) => <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>)}
          </select>
        </Field>
        <Field label="Ville">
          <select id="s-city" className="input" value={s.city ?? "paris"} onChange={(e) => set("city", e.target.value === "paris" ? undefined : (e.target.value as CityId))}>
            {CITIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        {(s.city ?? "paris") === "paris" && <Field label="Arrondissement"><input id="s-arr" className="input" type="number" min={1} max={20} value={s.arrondissement} onChange={(e) => set("arrondissement", Number(e.target.value))} /></Field>}
      </div>
      <Field label="Site officiel (réservation directe)"><input id="s-website" className="input" type="url" inputMode="url" value={s.website ?? ""} onChange={(e) => set("website", e.target.value.trim() || undefined)} placeholder="https://…" /></Field>
      <Field label="Adresse"><input id="s-address" className="input" value={s.address} onChange={(e) => set("address", e.target.value)} placeholder="12 rue …, 75011" /></Field>
      <Field label="Quartier (place le point sur la carte)">
        <select
          id="s-quartier"
          className="input"
          value={QUARTIERS.some((q) => q.name === s.quartier) ? s.quartier : ""}
          onChange={(e) => {
            const q = QUARTIERS.find((x) => x.name === e.target.value);
            if (q) setS((x) => ({ ...x, quartier: q.name, lat: q.lat, lng: q.lng }));
          }}
        >
          <option value="">{s.quartier || "Choisir…"}</option>
          {QUARTIERS.map((q) => <option key={q.name}>{q.name}</option>)}
        </select>
      </Field>
      <div className="form-row">
        <Field label="Latitude"><input id="s-lat" className="input" type="number" step="0.0001" value={s.lat} onChange={(e) => set("lat", Number(e.target.value))} /></Field>
        <Field label="Longitude"><input id="s-lng" className="input" type="number" step="0.0001" value={s.lng} onChange={(e) => set("lng", Number(e.target.value))} /></Field>
      </div>
      <p className="tiny muted">Astuce : dans Google Maps, un appui long sur le lieu affiche ses coordonnées.</p>
      <div className="form-row">
        <Field label="Prix">
          <select id="s-price" className="input" value={s.price} onChange={(e) => set("price", Number(e.target.value) as Spot["price"])}>
            <option value={1}>€</option><option value={2}>€€</option><option value={3}>€€€</option>
          </select>
        </Field>
        <Field label="Caché ?">
          <select id="s-hidden" className="input" value={s.hidden} onChange={(e) => set("hidden", Number(e.target.value) as Spot["hidden"])}>
            <option value={1}>Connu</option><option value={2}>Peu connu</option><option value={3}>Pépite cachée</option>
          </select>
        </Field>
      </div>
      <div className="form-row">
        <Field label="Durée (min)"><input id="s-duration" className="input" type="number" min={10} max={300} value={s.duration} onChange={(e) => set("duration", Number(e.target.value))} /></Field>
        <Field label="Réservation">
          <select id="s-book" className="input" value={s.bookable ?? ""} onChange={(e) => set("bookable", (e.target.value || undefined) as Spot["bookable"])}>
            <option value="">Aucune</option><option value="table">Table</option><option value="activite">Activité</option>
          </select>
        </Field>
      </div>
      <Field label="Ambiances">
        <div className="chip-grid">
          {(Object.keys(MOOD_LABEL) as Mood[]).map((m) => (
            <button type="button" key={m} className={`chip sm ${s.moods.includes(m) ? "on" : ""}`} onClick={() => set("moods", s.moods.includes(m) ? s.moods.filter((x) => x !== m) : [...s.moods, m])}>{MOOD_LABEL[m]}</button>
          ))}
        </div>
      </Field>
      <Field label="Description (ton Marco)"><textarea id="s-pitch" className="input textarea" rows={3} value={s.pitch} onChange={(e) => set("pitch", e.target.value)} maxLength={600} /></Field>
      <Field label="L'astuce de Marco"><textarea id="s-tip" className="input textarea" rows={2} value={s.tip} onChange={(e) => set("tip", e.target.value)} maxLength={600} /></Field>
      {err && <p className="error small">{err}</p>}
      <div className="row gap-8">
        <button type="button" className="btn btn-ghost" onClick={onDone}>Annuler</button>
        <button className="btn btn-primary grow" disabled={busy}>{busy ? "Enregistrement…" : "Enregistrer"}</button>
      </div>
    </form>
  );
}

function StreetForm({ initial, onDone }: { initial: StreetStory; onDone: () => void }) {
  const [s, setS] = useState<StreetStory>(initial);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof StreetStory>(k: K, v: StreetStory[K]) => setS((x) => ({ ...x, [k]: v }));
  return (
    <form
      className="card form"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!s.name.trim() || !s.histoire.trim()) return setErr("Il faut au moins le nom et l'histoire.");
        setBusy(true);
        try {
          await saveStreet({ ...s, name: s.name.trim() });
          onDone();
        } catch {
          setErr("L'enregistrement a échoué. Vérifie ta connexion et tes droits d'édition, puis réessaie.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <h2 className="serif section-title">{initial.id ? "Modifier la rue" : "Nouvelle rue"}</h2>
      <Field label="Nom"><input id="r-name" className="input" value={s.name} onChange={(e) => set("name", e.target.value)} placeholder="Rue de …" required /></Field>
      <div className="form-row">
        <Field label="Arrondissement"><input id="r-arr" className="input" value={s.arrondissement} onChange={(e) => set("arrondissement", e.target.value)} placeholder="5e" /></Field>
        <Field label="Autres noms (virgules)"><input id="r-alias" className="input" value={s.aliases.join(", ")} onChange={(e) => set("aliases", e.target.value.split(",").map((x) => x.trim()).filter(Boolean))} /></Field>
      </div>
      <div className="form-row">
        <Field label="Latitude"><input id="r-lat" className="input" type="number" step="0.0001" value={s.lat} onChange={(e) => set("lat", Number(e.target.value))} /></Field>
        <Field label="Longitude"><input id="r-lng" className="input" type="number" step="0.0001" value={s.lng} onChange={(e) => set("lng", Number(e.target.value))} /></Field>
      </div>
      <Field label="L'histoire"><textarea id="r-hist" className="input textarea" rows={4} value={s.histoire} onChange={(e) => set("histoire", e.target.value)} /></Field>
      <div className="form-row">
        <Field label="Année du fait"><input id="r-year" className="input" value={s.fait.annee} onChange={(e) => set("fait", { ...s.fait, annee: e.target.value })} placeholder="1789" /></Field>
      </div>
      <Field label="Le fait historique"><textarea id="r-fait" className="input textarea" rows={3} value={s.fait.texte} onChange={(e) => set("fait", { ...s.fait, texte: e.target.value })} /></Field>
      <Field label="L'anecdote drôle"><textarea id="r-anec" className="input textarea" rows={3} value={s.anecdote} onChange={(e) => set("anecdote", e.target.value)} /></Field>
      {err && <p className="error small">{err}</p>}
      <div className="row gap-8">
        <button type="button" className="btn btn-ghost" onClick={onDone}>Annuler</button>
        <button className="btn btn-primary grow" disabled={busy}>{busy ? "Enregistrement…" : "Enregistrer"}</button>
      </div>
    </form>
  );
}

export function Admin() {
  const navigate = useNavigate();
  const cloud = useCloud();
  const [tab, setTab] = useState<Tab>("lieux");
  const pending = cloud.bookings.filter((b) => b.status === "en_attente").length;
  const [editSpot, setEditSpot] = useState<Spot | null>(null);
  const [editStreet, setEditStreet] = useState<StreetStory | null>(null);
  const [filter, setFilter] = useState("");

  if (!cloud.db || !cloud.isAdmin) {
    return (
      <div className="page">
        <button className="back" onClick={() => navigate(-1)} aria-label="Retour"><Icon name="arrowLeft" size={20} /></button>
        <h1 className="serif page-title">Base de données</h1>
        <p className="muted">Cet espace est réservé aux éditeurs de Marco. {cloud.db ? "" : "La base n'est pas disponible sur cette version."}</p>
      </div>
    );
  }

  if (editSpot) return <div className="page"><SpotForm initial={editSpot} onDone={() => setEditSpot(null)} /></div>;
  if (editStreet) return <div className="page"><StreetForm initial={editStreet} onDone={() => setEditStreet(null)} /></div>;

  const f = filter.toLowerCase();
  const fromSuggestion = (x: Suggestion): Spot => {
    const q = QUARTIERS.find((y) => y.name === x.quartier) ?? QUARTIERS[0];
    return { ...EMPTY_SPOT, name: x.name, address: x.address, quartier: q.name, lat: q.lat, lng: q.lng, pitch: x.why };
  };

  return (
    <div className="page">
      <button className="back" onClick={() => navigate(-1)} aria-label="Retour"><Icon name="arrowLeft" size={20} /></button>
      <div>
        <h1 className="serif page-title">Base de données</h1>
        <p className="muted small">{SPOTS.length} lieux · {STREETS.length} rues · {cloud.suggestions.length} proposition{cloud.suggestions.length > 1 ? "s" : ""}</p>
      </div>
      <div className="segmented three">
        <button className={tab === "lieux" ? "on" : ""} onClick={() => setTab("lieux")}>Lieux</button>
        <button className={tab === "rues" ? "on" : ""} onClick={() => setTab("rues")}>Rues</button>
        <button className={tab === "reservations" ? "on" : ""} onClick={() => setTab("reservations")}>
          Réservations{pending ? ` (${pending})` : ""}
        </button>
        <button className={tab === "propositions" ? "on" : ""} onClick={() => setTab("propositions")}>
          Propositions{cloud.suggestions.length ? ` (${cloud.suggestions.length})` : ""}
        </button>
      </div>

      {tab === "reservations" && (
        <div className="admin-list">
          {cloud.bookings.length === 0 && <p className="muted small">Aucune demande. Elles arrivent ici quand un utilisateur confirme une réservation proposée par Marco dans le chat.</p>}
          {cloud.bookings.map((b) => <BookingRow key={b.id} b={b} />)}
        </div>
      )}

      {tab !== "propositions" && tab !== "reservations" && (
        <div className="row gap-8">
          <div className="search grow">
            <Icon name="search" size={16} />
            <input id="admin-filter" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filtrer" aria-label="Filtrer" />
          </div>
          <button className="btn btn-primary" onClick={() => (tab === "lieux" ? setEditSpot(EMPTY_SPOT) : setEditStreet(EMPTY_STREET))}>+ Ajouter</button>
        </div>
      )}

      {tab === "lieux" && (
        <div className="admin-list">
          {SPOTS.filter((s) => !f || `${s.name} ${s.quartier}`.toLowerCase().includes(f)).map((s) => (
            <div key={s.id} className="admin-row">
              <div className="grow">
                <strong>{s.name}</strong>
                <span className="tiny muted">{CATEGORY_LABEL[s.category]} · {s.quartier}{s.hidden === 3 ? " · pépite" : ""}</span>
              </div>
              <button className="btn-mini" onClick={() => setEditSpot(s)}>Modifier</button>
              <DeleteButton onConfirm={() => deleteSpot(s.id)} />
            </div>
          ))}
        </div>
      )}

      {tab === "rues" && (
        <div className="admin-list">
          {STREETS.filter((s) => !f || s.name.toLowerCase().includes(f)).map((s) => (
            <div key={s.id} className="admin-row">
              <div className="grow">
                <strong>{s.name}</strong>
                <span className="tiny muted">{s.arrondissement} · {s.fait.annee}</span>
              </div>
              <button className="btn-mini" onClick={() => setEditStreet(s)}>Modifier</button>
              <DeleteButton onConfirm={() => deleteStreet(s.id)} />
            </div>
          ))}
        </div>
      )}

      {tab === "propositions" && (
        <div className="admin-list">
          {cloud.suggestions.length === 0 && <p className="muted small">Aucune proposition pour l'instant. Les utilisateurs peuvent en envoyer depuis l'accueil (« Tu connais une pépite ? »).</p>}
          {cloud.suggestions.map((x) => (
            <div key={x.id} className="admin-row col">
              <div>
                <strong>{x.name}</strong>
                <span className="tiny muted"> · {x.quartier} · {new Date(x.createdAt).toLocaleDateString("fr-FR")}</span>
              </div>
              {x.address && <span className="small">{x.address}</span>}
              {x.why && <p className="small muted">{x.why}</p>}
              <div className="row gap-8">
                <button className="btn-mini primary" onClick={() => setEditSpot(fromSuggestion(x))}>Transformer en lieu</button>
                <DeleteButton onConfirm={() => deleteSuggestion(x.id)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
