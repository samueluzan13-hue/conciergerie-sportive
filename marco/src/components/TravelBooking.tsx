import { useEffect, useMemo, useState } from "react";
import { cityById, type CityId } from "../data/cities";
import {
  bookFlight, bookStay, fmtDuration, fmtPrice, fmtTime, isoMinutes, offerMinutes, searchFlights, searchStays, stayRooms, travelConfig,
  type Confirmation, type FlightOffer, type FlightQuery, type Passenger, type StayQuery, type StayResult, type StayRoom, type TravelConfig,
} from "../lib/booking";
import { log } from "../lib/diag";
import { placeName } from "../lib/travel";
import { addTrip, useStore } from "../lib/store";
import { Icon } from "./Icon";
import { Link } from "./Nav";

export type FlightSortKey = "prix" | "prix-desc" | "rapide" | "meilleur";
export const FLIGHT_SORT: Record<FlightSortKey, string> = { prix: "Moins cher", "prix-desc": "Plus cher", rapide: "Plus rapide", meilleur: "Meilleur compromis" };

/** Téléphone au format international (06… → +336…). */
const intl = (p: string) => {
  const d = p.replace(/[^\d+]/g, "");
  if (d.startsWith("+")) return d;
  if (d.startsWith("00")) return `+${d.slice(2)}`;
  if (/^0\d{9}$/.test(d)) return `+33${d.slice(1)}`;
  return d;
};

function DemoBanner({ config }: { config: TravelConfig | null }) {
  if (!config?.demo) return null;
  return (
    <p className="demo-banner tiny">
      <strong>Démonstration</strong> : dans cet aperçu, les offres sont des exemples et aucune réservation n'est faite. Sur le site en ligne, Marco affiche les vrais vols et hébergements disponibles et réserve directement.
    </p>
  );
}

function Confirmed({ c, title, detail, onClose }: { c: Confirmation; title: string; detail: string; onClose: () => void }) {
  return (
    <div className="booking-card sent">
      <p className="booking-title"><Icon name="check" size={16} /> {c.demo ? "Réservation d'exemple enregistrée" : "C'est réservé !"}</p>
      <p className="small"><strong>{title}</strong></p>
      <p className="small muted">{detail}</p>
      <p className="small">Référence : <strong>{c.reference}</strong> · {fmtPrice(c.price, c.currency)}</p>
      {c.demo && <p className="tiny muted">Mode démonstration : aucun billet n'a été émis et rien n'a été payé.</p>}
      <div className="row gap-8">
        <Link to="/profil" className="btn-mini primary">Mes voyages</Link>
        <button className="btn-mini" onClick={onClose}>Continuer</button>
      </div>
    </div>
  );
}

/* =================================================================== */
/* Vols                                                                 */
/* =================================================================== */
export function FlightResults({ query, sort, onSort, onFocus }: { query: FlightQuery; sort: FlightSortKey; onSort: (s: FlightSortKey) => void; onFocus?: (booking: boolean) => void }) {
  const [config, setConfig] = useState<TravelConfig | null>(null);
  const [offers, setOffers] = useState<FlightOffer[] | null>(null);
  const [error, setError] = useState("");
  const [directOnly, setDirectOnly] = useState(false);
  const [open, setOpen] = useState<FlightOffer | null>(null);

  useEffect(() => {
    let off = false;
    setOffers(null);
    setError("");
    travelConfig().then(setConfig);
    searchFlights(query)
      .then((o) => !off && setOffers(o))
      .catch((e) => !off && setError(e.code === "not_configured" ? "La recherche de vols n'est pas encore activée sur ce site." : "Impossible de charger les vols pour l'instant. Réessaie dans un instant."));
    return () => {
      off = true;
    };
  }, [JSON.stringify(query)]); // eslint-disable-line react-hooks/exhaustive-deps

  const list = useMemo(() => {
    if (!offers) return [];
    const l = offers.filter((o) => !directOnly || o.slices.every((s) => s.stops === 0));
    const minP = Math.min(...l.map((o) => o.price)), minT = Math.min(...l.map(offerMinutes));
    const score = (o: FlightOffer) => o.price / minP + offerMinutes(o) / minT;
    const by: Record<FlightSortKey, (a: FlightOffer, b: FlightOffer) => number> = {
      prix: (a, b) => a.price - b.price,
      "prix-desc": (a, b) => b.price - a.price,
      rapide: (a, b) => offerMinutes(a) - offerMinutes(b),
      meilleur: (a, b) => score(a) - score(b),
    };
    return [...l].sort(by[sort]);
  }, [offers, sort, directOnly]);

  useEffect(() => {
    onFocus?.(!!open);
    document.querySelector(".content")?.scrollTo({ top: 0 });
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  if (open) return <FlightBooking offer={open} query={query} config={config} onBack={() => setOpen(null)} />;

  return (
    <div className="stack">
      <DemoBanner config={config} />
      <div className="chip-grid">
        {(Object.keys(FLIGHT_SORT) as FlightSortKey[]).map((k) => (
          <button key={k} className={`chip small ${sort === k ? "on" : ""}`} onClick={() => onSort(k)}>{FLIGHT_SORT[k]}</button>
        ))}
        <button className={`chip small ${directOnly ? "on" : ""}`} onClick={() => setDirectOnly(!directOnly)}>Direct uniquement</button>
      </div>
      {error && <p className="small error-text">{error}</p>}
      {!offers && !error && <p className="small muted"><span className="spinner" /> Marco interroge les compagnies…</p>}
      {offers && !list.length && <p className="small muted">Aucun vol trouvé pour ces critères. Essaie d'autres dates ou enlève le filtre « direct ».</p>}
      {list.map((o, i) => (
        <button key={o.id} className="flight-offer" onClick={() => setOpen(o)}>
          <div className="row-between">
            <span className="airline">
              {o.airline.logo ? <img src={o.airline.logo} alt="" width={22} height={22} /> : <Icon name="plane" size={18} />} {o.airline.name}
            </span>
            <strong className="price">{fmtPrice(o.price, o.currency)}</strong>
          </div>
          {o.slices.map((s, k) => (
            <div key={k} className="slice">
              <span className="t">{fmtTime(s.departAt)}</span>
              <span className="line"><span className="tiny muted">{fmtDuration(isoMinutes(s.duration))} · {s.stops ? `${s.stops} escale` : "direct"}</span></span>
              <span className="t">{fmtTime(s.arriveAt)}</span>
              <span className="tiny muted codes">{s.from} → {s.to}</span>
            </div>
          ))}
          <div className="tags">
            {i === 0 && sort === "prix" && <span className="tag hot">Le moins cher</span>}
            {o.refundable && <span className="tag">Remboursable</span>}
            {o.changeable && <span className="tag">Modifiable</span>}
            {o.slices[0]?.bags && <span className="tag">{o.slices[0].bags}</span>}
          </div>
        </button>
      ))}
    </div>
  );
}

function FlightBooking({ offer, query, config, onBack }: { offer: FlightOffer; query: FlightQuery; config: TravelConfig | null; onBack: () => void }) {
  const profileName = useStore((s) => s.profile.name);
  const [pax, setPax] = useState<Omit<Passenger, "email" | "phone_number">[]>(() =>
    offer.passengerIds.map((_, i) => ({ given_name: i === 0 ? profileName : "", family_name: "", born_on: "", gender: "m" })),
  );
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<"form" | "sending" | "error">("form");
  const [error, setError] = useState("");
  const [done, setDone] = useState<Confirmation | null>(null);
  const valid = pax.every((p) => p.given_name.trim() && p.family_name.trim() && p.born_on) && /^\S+@\S+\.\S+$/.test(email) && /^\+\d{8,15}$/.test(intl(phone));
  const title = `${placeName(query.from)} → ${placeName(query.to)} · ${offer.airline.name}`;
  const detail = `${new Date(query.depart).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}${query.back ? ` – ${new Date(query.back).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}` : ""} · ${pax.length} voyageur${pax.length > 1 ? "s" : ""}`;

  const submit = async () => {
    setState("sending");
    try {
      const c = await bookFlight(offer, pax.map((p) => ({ ...p, email: email.trim(), phone_number: intl(phone) })));
      addTrip({ id: `vol-${Date.now()}`, kind: "vol", title, detail, date: query.depart, reference: c.reference, price: c.price, currency: c.currency, demo: c.demo, createdAt: Date.now() });
      setDone(c);
    } catch (e) {
      log("voyage:vol:error", e);
      const code = (e as { code?: string }).code;
      setError(
        code === "booking_disabled"
          ? "La réservation directe des vols n'est pas encore ouverte sur Marco. Ton vol n'a pas été réservé."
          : code === "passengers"
            ? "Vérifie les informations des voyageurs (noms, dates de naissance, e-mail, téléphone)."
            : "La compagnie n'a pas confirmé : le prix ou la disponibilité a peut-être changé. Relance la recherche.",
      );
      setState("error");
    }
  };

  if (done) return <Confirmed c={done} title={title} detail={detail} onClose={onBack} />;

  return (
    <div className="stack">
      <button className="link small" onClick={onBack}>← Retour aux vols</button>
      <DemoBanner config={config} />
      <div className="card flight-detail">
        <div className="row-between"><strong>{offer.airline.name}</strong><strong className="price">{fmtPrice(offer.price, offer.currency)}</strong></div>
        {offer.slices.map((s, k) => (
          <div key={k} className="detail-slice">
            <p className="eyebrow">{k === 0 ? "Aller" : "Retour"} · {new Date(s.departAt).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</p>
            {s.segments.map((g, j) => (
              <p key={j} className="small">
                <strong>{fmtTime(g.departAt)}</strong> {placeName(g.from)} → <strong>{fmtTime(g.arriveAt)}</strong> {placeName(g.to)} <span className="muted">· vol {g.flight} ({g.carrier})</span>
              </p>
            ))}
            {s.bags && <p className="tiny muted">Inclus : {s.bags}</p>}
          </div>
        ))}
        <p className="tiny muted">{offer.refundable ? "Remboursable avant le départ (conditions de la compagnie)." : "Non remboursable."} {offer.changeable ? "Modifiable." : "Non modifiable."}</p>
      </div>

      <div className="card travel-form">
        <h3 className="serif">Voyageurs</h3>
        <p className="tiny muted">Noms exactement comme sur le passeport ou la carte d'identité.</p>
        {pax.map((p, i) => (
          <div key={i} className="pax">
            <p className="small"><strong>Voyageur {i + 1}</strong></p>
            <div className="booking-grid">
              <label>Prénom<input value={p.given_name} onChange={(e) => setPax((x) => x.map((y, k) => (k === i ? { ...y, given_name: e.target.value } : y)))} autoComplete={i === 0 ? "given-name" : "off"} /></label>
              <label>Nom<input value={p.family_name} onChange={(e) => setPax((x) => x.map((y, k) => (k === i ? { ...y, family_name: e.target.value } : y)))} autoComplete={i === 0 ? "family-name" : "off"} /></label>
              <label>Date de naissance<input type="date" value={p.born_on} max={new Date().toISOString().slice(0, 10)} onChange={(e) => setPax((x) => x.map((y, k) => (k === i ? { ...y, born_on: e.target.value } : y)))} /></label>
              <label>Genre (billet)<select value={p.gender} onChange={(e) => setPax((x) => x.map((y, k) => (k === i ? { ...y, gender: e.target.value as "m" | "f" } : y)))}><option value="m">Homme</option><option value="f">Femme</option></select></label>
            </div>
          </div>
        ))}
        <h3 className="serif">Contact</h3>
        <div className="booking-grid">
          <label>E-mail<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></label>
          <label>Téléphone<input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="06 12 34 56 78" /></label>
        </div>
        {error && <p className="small error-text">{error}</p>}
        <button className="btn btn-primary btn-block" disabled={!valid || state === "sending"} onClick={submit}>
          {state === "sending" ? "Réservation en cours…" : `Réserver pour ${fmtPrice(offer.price, offer.currency)}`}
        </button>
        <p className="tiny muted">Le billet est émis directement par la compagnie. Tes informations ne servent qu'à cette réservation.</p>
      </div>
    </div>
  );
}

/* =================================================================== */
/* Hôtels et appartements                                               */
/* =================================================================== */
export type StaySortKey = "prix" | "prix-desc" | "note" | "etoiles";
export const STAY_SORT: Record<StaySortKey, string> = { prix: "Moins cher", "prix-desc": "Plus cher", note: "Mieux notés", etoiles: "Étoiles" };

export function StayResults({ query, preselect, onPreselected, onFocus }: { query: StayQuery; preselect?: string | null; onPreselected?: () => void; onFocus?: (booking: boolean) => void }) {
  const [config, setConfig] = useState<TravelConfig | null>(null);
  const [results, setResults] = useState<StayResult[] | null>(null);
  const [error, setError] = useState("");
  const [sort, setSort] = useState<StaySortKey>("prix");
  const [open, setOpen] = useState<StayResult | null>(null);

  useEffect(() => {
    let off = false;
    setResults(null);
    setError("");
    travelConfig().then(setConfig);
    searchStays(query)
      .then((r) => !off && setResults(r))
      .catch(() => !off && setError("Impossible de charger les hébergements pour l'instant."));
    return () => {
      off = true;
    };
  }, [JSON.stringify(query)]); // eslint-disable-line react-hooks/exhaustive-deps

  // ouverture directe d'un hôtel de la sélection Marco
  useEffect(() => {
    if (!preselect || !results) return;
    const norm = (x: string) => x.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
    const hit = results.find((r) => r.id === `demo-${preselect}`) ?? results.find((r) => norm(r.name).includes(norm(preselect)) || norm(preselect).includes(norm(r.name)));
    if (hit) setOpen(hit);
    onPreselected?.();
  }, [preselect, results]); // eslint-disable-line react-hooks/exhaustive-deps

  const list = useMemo(() => {
    const by: Record<StaySortKey, (a: StayResult, b: StayResult) => number> = {
      prix: (a, b) => a.price - b.price,
      "prix-desc": (a, b) => b.price - a.price,
      note: (a, b) => (b.reviewScore ?? 0) - (a.reviewScore ?? 0),
      etoiles: (a, b) => (b.stars ?? 0) - (a.stars ?? 0) || a.price - b.price,
    };
    return [...(results ?? [])].sort(by[sort]);
  }, [results, sort]);

  const nights = Math.max(1, Math.round((new Date(query.checkout).getTime() - new Date(query.checkin).getTime()) / 86400000));

  useEffect(() => {
    onFocus?.(!!open);
    if (open) document.querySelector(".content")?.scrollTo({ top: 0 });
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  if (open) return <StayBooking stay={open} query={query} config={config} onBack={() => setOpen(null)} />;

  return (
    <div className="stack">
      <DemoBanner config={config} />
      <div className="chip-grid">
        {(Object.keys(STAY_SORT) as StaySortKey[]).map((k) => (
          <button key={k} className={`chip small ${sort === k ? "on" : ""}`} onClick={() => setSort(k)}>{STAY_SORT[k]}</button>
        ))}
      </div>
      {error && <p className="small error-text">{error}</p>}
      {!results && !error && <p className="small muted"><span className="spinner" /> Marco cherche les disponibilités…</p>}
      {results && !list.length && <p className="small muted">Rien de disponible à ces dates. Essaie d'autres dates.</p>}
      {list.map((r) => (
        <button key={r.id} className="stay-offer" onClick={() => setOpen(r)}>
          {r.photo ? <img src={r.photo} alt="" className="stay-photo" /> : <span className="stay-photo placeholder"><Icon name="bed" size={26} /></span>}
          <span className="grow">
            <strong>{r.name}</strong>
            <span className="tiny muted">{r.stars ? `${"★".repeat(Math.round(r.stars))} · ` : ""}{r.address}</span>
            {r.reviewScore ? <span className="tiny">Note {r.reviewScore}/10{r.reviewCount ? ` · ${r.reviewCount} avis` : ""}</span> : null}
            <span className="price-line"><strong>{fmtPrice(r.price, r.currency)}</strong> <span className="tiny muted">pour {nights} nuit{nights > 1 ? "s" : ""}</span></span>
          </span>
        </button>
      ))}
    </div>
  );
}

const BOARD: Record<string, string> = { room_only: "Logement seul", breakfast: "Petit-déjeuner inclus", half_board: "Demi-pension", full_board: "Pension complète", all_inclusive: "Tout compris" };

function StayBooking({ stay, query, config, onBack }: { stay: StayResult; query: StayQuery; config: TravelConfig | null; onBack: () => void }) {
  const profileName = useStore((s) => s.profile.name);
  const [rooms, setRooms] = useState<StayRoom[] | null>(null);
  const [description, setDescription] = useState("");
  const [rate, setRate] = useState<StayRoom["rates"][number] & { room: string } | null>(null);
  const [given, setGiven] = useState(profileName);
  const [family, setFamily] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [requests, setRequests] = useState("");
  const [state, setState] = useState<"form" | "sending" | "error">("form");
  const [error, setError] = useState("");
  const [done, setDone] = useState<Confirmation | null>(null);

  useEffect(() => {
    stayRooms(stay.id, query).then((r) => (setRooms(r.rooms), setDescription(r.description))).catch(() => setError("Impossible de charger les chambres."));
  }, [stay.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const city = cityById(query.city);
  const title = stay.name;
  const detail = `${city.name} · du ${new Date(query.checkin).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })} au ${new Date(query.checkout).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })} · ${query.adults} voyageur${query.adults > 1 ? "s" : ""}${rate ? ` · ${rate.room}` : ""}`;
  const valid = rate && given.trim() && family.trim() && /^\S+@\S+\.\S+$/.test(email) && /^\+\d{8,15}$/.test(intl(phone));

  const submit = async () => {
    if (!rate) return;
    setState("sending");
    try {
      const c = await bookStay(rate.id, rate.price, rate.currency, { given_name: given.trim(), family_name: family.trim(), email: email.trim(), phone_number: intl(phone), requests: requests.trim() || undefined });
      addTrip({ id: `stay-${Date.now()}`, kind: query.kind === "appartement" ? "appartement" : "hotel", title, detail, date: query.checkin, reference: c.reference, price: c.price, currency: c.currency, demo: c.demo, createdAt: Date.now() });
      setDone(c);
    } catch (e) {
      log("voyage:stay:error", e);
      setError((e as { code?: string }).code === "booking_disabled" ? "La réservation directe des hébergements n'est pas encore ouverte sur Marco. Rien n'a été réservé." : "L'hébergement n'a pas confirmé : le tarif a peut-être changé. Choisis à nouveau ta chambre.");
      setState("error");
    }
  };

  if (done) return <Confirmed c={done} title={title} detail={detail} onClose={onBack} />;

  return (
    <div className="stack">
      <button className="link small" onClick={onBack}>← Retour aux résultats</button>
      <DemoBanner config={config} />
      <div className="card">
        <h3 className="serif">{stay.name}</h3>
        <p className="tiny muted">{stay.address}</p>
        {description && <p className="small">{description}</p>}
      </div>
      {!rooms && !error && <p className="small muted"><span className="spinner" /> Chargement des chambres…</p>}
      {rooms?.map((room) => (
        <div key={room.name} className="card room">
          <strong>{room.name}</strong>
          {room.beds && <p className="tiny muted">{room.beds}</p>}
          {room.rates.map((rt) => (
            <button key={rt.id} className={`rate ${rate?.id === rt.id ? "on" : ""}`} onClick={() => setRate({ ...rt, room: room.name })}>
              <span className="grow">
                <span className="small">{BOARD[rt.board] ?? rt.board}</span>
                <span className="tiny muted">{rt.refundable ? `Annulation gratuite${rt.refundableUntil ? ` jusqu'au ${new Date(rt.refundableUntil).toLocaleDateString("fr-FR")}` : ""}` : "Non remboursable"}{rt.payAtHotel ? ` · ${fmtPrice(rt.payAtHotel, rt.currency)} à payer sur place` : ""}</span>
              </span>
              <strong>{fmtPrice(rt.price, rt.currency)}</strong>
            </button>
          ))}
        </div>
      ))}
      {rate && (
        <div className="card travel-form">
          <h3 className="serif">Tes coordonnées</h3>
          <div className="booking-grid">
            <label>Prénom<input value={given} onChange={(e) => setGiven(e.target.value)} autoComplete="given-name" /></label>
            <label>Nom<input value={family} onChange={(e) => setFamily(e.target.value)} autoComplete="family-name" /></label>
            <label>E-mail<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></label>
            <label>Téléphone<input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="06 12 34 56 78" /></label>
          </div>
          <label>Demande particulière (facultatif)<input value={requests} onChange={(e) => setRequests(e.target.value)} placeholder="Arrivée tardive, lit bébé…" /></label>
          {error && <p className="small error-text">{error}</p>}
          <button className="btn btn-primary btn-block" disabled={!valid || state === "sending"} onClick={submit}>
            {state === "sending" ? "Réservation en cours…" : `Réserver pour ${fmtPrice(rate.price, rate.currency)}`}
          </button>
        </div>
      )}
    </div>
  );
}

export const cityLabel = (id: CityId) => cityById(id).name;
