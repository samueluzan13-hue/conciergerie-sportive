import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Icon } from "../components/Icon";
import { MarcoLogo } from "../components/MarcoLogo";
import { useSpotSheet } from "../components/SpotSheet";
import { SpotPhoto } from "../components/SpotPhoto";
import { MOOD_LABEL, SPOTS, type Mood, type Spot } from "../data/spots";
import { HOTEL_PRICE_LABEL, HOTEL_SPOTS } from "../data/spots-hotels";
import { generatePlan, type Who } from "../lib/planner";
import { reserveUrl } from "../lib/reservation";
import { setState, useStore } from "../lib/store";
import {
  AIRPORTS, CABIN_LABEL, SORT_LABEL, googleFlightsUrl, hotelCompareUrl, kayakUrl, placeName, skyscannerUrl, toIata,
  type Cabin, type FlightSearch, type FlightSort,
} from "../lib/travel";

type Tab = "hotels" | "vols" | "sejour";
const TABS: [Tab, string, string][] = [["hotels", "Hôtels", "bed"], ["vols", "Vols", "plane"], ["sejour", "Séjour sur mesure", "sparkles"]];

export function Voyages() {
  const [params, setParams] = useSearchParams();
  const [tab, setTab] = useState<Tab>("hotels");
  useEffect(() => {
    const t = params.get("tab");
    if (t === "hotels" || t === "vols" || t === "sejour") setTab(t);
  }, [params]);
  return (
    <div className="page">
      <div className="voyage-hero compact">
        <span className="eyebrow light">Marco Voyages</span>
        <h1 className="serif">Dormir, partir, tout réserver ici.</h1>
      </div>
      <div className="seg" role="tablist">
        {TABS.map(([id, label, icon]) => (
          <button key={id} role="tab" aria-selected={tab === id} className={tab === id ? "on" : ""} onClick={() => { setTab(id); setParams({}, { replace: true }); }}>
            <Icon name={icon} size={16} /> {label}
          </button>
        ))}
      </div>
      {tab === "hotels" && <Hotels />}
      {tab === "vols" && <Flights />}
      {tab === "sejour" && <Sejour />}
    </div>
  );
}

/* ---------------- Hôtels ---------------- */
type HotelSort = "prix" | "prix-desc" | "etoiles" | "pepites";
const HOTEL_SORT: Record<HotelSort, string> = { prix: "Moins cher", "prix-desc": "Plus cher", etoiles: "Étoiles", pepites: "Pépites" };
const STYLES: Mood[] = ["romantique", "famille", "tendance", "petit-budget", "cache", "insolite", "bobo"];
const today = () => new Date().toISOString().slice(0, 10);
const plusDays = (d: string, n: number) => new Date(new Date(d).getTime() + n * 86400000).toISOString().slice(0, 10);

const order = (s: Spot) => {
  const i = HOTEL_SPOTS.findIndex((h) => h.id === s.id);
  return i < 0 ? 50 : i;
};

function Hotels() {
  const open = useSpotSheet();
  const [sort, setSort] = useState<HotelSort>("prix");
  const [budget, setBudget] = useState<0 | 1 | 2 | 3>(0);
  const [style, setStyle] = useState<Mood | "">("");
  const [arr, setArr] = useState(0);
  const [checkin, setCheckin] = useState(plusDays(today(), 7));
  const [checkout, setCheckout] = useState(plusDays(today(), 9));
  const [adults, setAdults] = useState(2);
  const hotels = useMemo(() => {
    const list = SPOTS.filter((s) => s.category === "hotel" && (!budget || s.price === budget) && (!style || s.moods.includes(style)) && (!arr || s.arrondissement === arr));
    const by: Record<HotelSort, (a: Spot, b: Spot) => number> = {
      // dans une même gamme, l'ordre de la sélection va du plus abordable au plus cher (palaces en dernier)
      prix: (a, b) => a.price - b.price || order(a) - order(b),
      "prix-desc": (a, b) => b.price - a.price || order(b) - order(a),
      etoiles: (a, b) => (b.stars ?? 0) - (a.stars ?? 0) || a.price - b.price,
      pepites: (a, b) => b.hidden - a.hidden || a.price - b.price,
    };
    return list.sort(by[sort]);
  }, [sort, budget, style, arr]);
  const nights = Math.max(1, Math.round((new Date(checkout).getTime() - new Date(checkin).getTime()) / 86400000));

  return (
    <section className="stack">
      <div className="card travel-form">
        <div className="booking-grid">
          <label>Arrivée<input type="date" value={checkin} min={today()} onChange={(e) => { setCheckin(e.target.value); if (e.target.value >= checkout) setCheckout(plusDays(e.target.value, 1)); }} /></label>
          <label>Départ<input type="date" value={checkout} min={plusDays(checkin, 1)} onChange={(e) => setCheckout(e.target.value)} /></label>
          <label>Voyageurs<input type="number" min={1} max={8} value={adults} onChange={(e) => setAdults(Math.max(1, Math.min(8, +e.target.value || 1)))} /></label>
          <label>Trier<select value={sort} onChange={(e) => setSort(e.target.value as HotelSort)}>{Object.entries(HOTEL_SORT).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
        </div>
        <div className="chip-grid">
          {([0, 1, 2, 3] as const).map((b) => (
            <button key={b} className={`chip ${budget === b ? "on" : ""}`} onClick={() => setBudget(b)}>{b ? "€".repeat(b) : "Tous les prix"}</button>
          ))}
          <select className="chip-select" value={arr} onChange={(e) => setArr(+e.target.value)} aria-label="Arrondissement">
            <option value={0}>Tout Paris</option>
            {Array.from({ length: 20 }, (_, i) => i + 1).map((a) => <option key={a} value={a}>{a === 1 ? "1er" : `${a}e`}</option>)}
          </select>
        </div>
        <div className="chip-grid">
          {STYLES.map((m) => (
            <button key={m} className={`chip small ${style === m ? "on" : ""}`} onClick={() => setStyle(style === m ? "" : m)}>{MOOD_LABEL[m]}</button>
          ))}
        </div>
      </div>
      <p className="tiny muted">{hotels.length} hôtel{hotels.length > 1 ? "s" : ""} · {nights} nuit{nights > 1 ? "s" : ""} · prix indicatifs, à confirmer pour tes dates</p>
      {hotels.length === 0 && <p className="muted small">Aucun hôtel ne correspond : élargis le budget ou le quartier.</p>}
      {hotels.map((h) => (
        <article key={h.id} className="hotel-row">
          <div className="hotel-main" onClick={() => open(h.id)}>
            <div className="hotel-art"><SpotPhoto spot={h} height={84} rounded={14} /></div>
            <div className="grow">
              <strong>{h.name}</strong>
              <p className="tiny muted">{h.stars ? "★".repeat(h.stars) : "Auberge"} · {h.quartier}, {h.arrondissement === 1 ? "1er" : `${h.arrondissement}e`}</p>
              <p className="tiny">{HOTEL_PRICE_LABEL[h.price]}</p>
              <p className="tiny muted hotel-pitch">{h.pitch}</p>
            </div>
          </div>
          <div className="hotel-actions">
            <a className="btn-mini primary" href={reserveUrl(h)} target="_blank" rel="noreferrer">Réserver à l'hôtel</a>
            <a className="btn-mini" href={hotelCompareUrl(h.name, checkin, checkout, adults)} target="_blank" rel="noreferrer">Comparer les prix</a>
          </div>
        </article>
      ))}
      <AskMarco text={`Je cherche un hôtel à Paris du ${checkin} au ${checkout} pour ${adults} personne${adults > 1 ? "s" : ""}${budget ? `, budget ${HOTEL_PRICE_LABEL[budget].toLowerCase()}` : ""}${style ? `, plutôt ${MOOD_LABEL[style].toLowerCase()}` : ""}. Lesquels me conseilles-tu et pourquoi ?`} label="Demander à Marco de choisir pour moi" />
    </section>
  );
}

/* ---------------- Vols ---------------- */
function Flights() {
  const [from, setFrom] = useState("Paris (tous les aéroports)");
  const [to, setTo] = useState("");
  const [depart, setDepart] = useState(plusDays(today(), 14));
  const [back, setBack] = useState(plusDays(today(), 18));
  const [oneWay, setOneWay] = useState(false);
  const [adults, setAdults] = useState(1);
  const [cabin, setCabin] = useState<Cabin>("economy");
  const [sort, setSort] = useState<FlightSort>("prix");
  const [search, setSearch] = useState<FlightSearch | null>(null);
  const [error, setError] = useState("");

  const go = () => {
    const f = toIata(from), t = toIata(to);
    if (!f || !t) return setError("Choisis une ville dans la liste (ou tape son code à 3 lettres, ex. LIS).");
    if (f === t) return setError("Le départ et l'arrivée sont identiques.");
    setError("");
    setSearch({ from: f, to: t, depart, back: oneWay ? undefined : back, adults, cabin, sort });
  };

  return (
    <section className="stack">
      <div className="card travel-form">
        <datalist id="airports">{AIRPORTS.map(([c, n]) => <option key={c + n} value={n}>{c}</option>)}</datalist>
        <label>De<input list="airports" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Paris" /></label>
        <label>Vers<input list="airports" value={to} onChange={(e) => setTo(e.target.value)} placeholder="Lisbonne, Tel Aviv, New York…" /></label>
        <div className="booking-grid">
          <label>Aller<input type="date" value={depart} min={today()} onChange={(e) => { setDepart(e.target.value); if (e.target.value > back) setBack(plusDays(e.target.value, 3)); }} /></label>
          <label>Retour<input type="date" value={back} min={depart} disabled={oneWay} onChange={(e) => setBack(e.target.value)} /></label>
          <label>Voyageurs<input type="number" min={1} max={9} value={adults} onChange={(e) => setAdults(Math.max(1, Math.min(9, +e.target.value || 1)))} /></label>
          <label>Classe<select value={cabin} onChange={(e) => setCabin(e.target.value as Cabin)}>{Object.entries(CABIN_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
        </div>
        <label className="check-row"><input type="checkbox" checked={oneWay} onChange={(e) => setOneWay(e.target.checked)} /> Aller simple</label>
        <div className="chip-grid">
          {(Object.keys(SORT_LABEL) as FlightSort[]).map((k) => (
            <button key={k} className={`chip small ${sort === k ? "on" : ""}`} onClick={() => { setSort(k); if (search) setSearch({ ...search, sort: k }); }}>{SORT_LABEL[k]}</button>
          ))}
        </div>
        {error && <p className="tiny error-text">{error}</p>}
        <button className="btn btn-primary btn-block" onClick={go}><Icon name="plane" size={18} /> Chercher les vols</button>
      </div>

      {search && (
        <div className="card flight-results">
          <h2 className="serif section-title">{placeName(search.from)} → {placeName(search.to)}</h2>
          <p className="small muted">
            {new Date(search.depart).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
            {search.back ? ` → ${new Date(search.back).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}` : " · aller simple"} · {search.adults} voyageur{search.adults > 1 ? "s" : ""} · {CABIN_LABEL[search.cabin]} · {SORT_LABEL[search.sort].toLowerCase()}
          </p>
          <a className="flight-link main" href={kayakUrl(search)} target="_blank" rel="noreferrer">
            <span><strong>Kayak</strong><span className="tiny muted">Résultats déjà triés : {SORT_LABEL[search.sort].toLowerCase()}</span></span><Icon name="arrowRight" size={18} />
          </a>
          <a className="flight-link" href={googleFlightsUrl(search)} target="_blank" rel="noreferrer">
            <span><strong>Google Vols</strong><span className="tiny muted">Calendrier des prix pour trouver le jour le moins cher</span></span><Icon name="arrowRight" size={18} />
          </a>
          <a className="flight-link" href={skyscannerUrl(search)} target="_blank" rel="noreferrer">
            <span><strong>Skyscanner</strong><span className="tiny muted">Compagnies low cost et agences comparées</span></span><Icon name="arrowRight" size={18} />
          </a>
          <p className="tiny muted">Marco compare pour toi sur les trois sites : tu réserves ensuite directement auprès de la compagnie ou de l'agence de ton choix.</p>
          <AskMarco
            text={`Je veux aller de ${placeName(search.from)} à ${placeName(search.to)} autour du ${search.depart}${search.back ? `, retour le ${search.back}` : ""}, ${search.adults} voyageur(s). Quel aéroport, quelles compagnies et quels jours pour payer le moins cher ?`}
            label="Demander à Marco comment payer moins cher"
          />
        </div>
      )}
    </section>
  );
}

function AskMarco({ text, label }: { text: string; label: string }) {
  const navigate = useNavigate();
  return (
    <button className="btn btn-soft btn-block" onClick={() => navigate(`/marco?q=${encodeURIComponent(text)}&ia=1`)}>
      <Icon name="sparkles" size={18} /> {label}
    </button>
  );
}

/* ---------------- Séjour sur mesure ---------------- */

const CITIES = [
  { name: "Paris", live: true },
  { name: "Lisbonne", live: false },
  { name: "Barcelone", live: false },
  { name: "Rome", live: false },
  { name: "Londres", live: false },
  { name: "Amsterdam", live: false },
];

const INCLUDE = ["Hébergement", "Restaurants", "Activités", "Transports"];

function Sejour() {
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
    <div className="stack">
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
                <p className="small muted">Choisis ton hôtel dans l'onglet Hôtels : Marco te propose ceux qui sont proches de tes étapes.</p>
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
