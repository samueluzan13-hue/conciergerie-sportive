import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Icon } from "../components/Icon";
import { useSpotSheet } from "../components/SpotSheet";
import { SpotPhoto } from "../components/SpotPhoto";
import { FlightResults, StayResults, type FlightSortKey } from "../components/TravelBooking";
import { CITIES, cityById, isCityId, type CityId } from "../data/cities";
import { citySpots, MOOD_LABEL, placeLabel, type Mood, type Spot } from "../data/spots";
import { HOTEL_PRICE_LABEL } from "../data/spots-hotels";
import type { FlightQuery, StayQuery } from "../lib/booking";
import { useCloud } from "../lib/cloud";
import { useCity } from "../lib/store";
import { AIRPORTS, placeName, toIata } from "../lib/travel";
import { TripPlanner } from "./TripPlanner";

type Tab = "vols" | "hotels" | "appartements" | "sejour";
const TABS: [Tab, string, string][] = [["vols", "Vols", "plane"], ["hotels", "Hôtels", "bed"], ["appartements", "Apparts", "home"], ["sejour", "Sur mesure", "sparkles"]];

const today = () => new Date().toISOString().slice(0, 10);
const plusDays = (d: string, n: number) => new Date(new Date(d).getTime() + n * 86400000).toISOString().slice(0, 10);

export function Voyages() {
  const [params, setParams] = useSearchParams();
  const [tab, setTab] = useState<Tab>("vols");
  // paramètres reçus du chat, d'une fiche ou du séjour sur mesure (on les lit une fois puis on nettoie l'adresse)
  const [incoming, setIncoming] = useState<Record<string, string>>({});
  useEffect(() => {
    const t = params.get("tab");
    if (t === "vols" || t === "hotels" || t === "appartements" || t === "sejour") setTab(t);
    if ([...params.keys()].length) {
      setIncoming(Object.fromEntries(params.entries()));
      setParams({}, { replace: true });
    }
  }, [params]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="page">
      <div className="voyage-hero compact">
        <span className="eyebrow light">Marco Voyages</span>
        <h1 className="serif">Vols, hôtels, apparts : tout se réserve ici.</h1>
      </div>
      <div className="seg" role="tablist">
        {TABS.map(([id, label, icon]) => (
          <button key={id} role="tab" aria-selected={tab === id} className={tab === id ? "on" : ""} onClick={() => setTab(id)}>
            <Icon name={icon} size={16} /> {label}
          </button>
        ))}
      </div>
      {tab === "vols" && <Flights incoming={incoming} />}
      {tab === "hotels" && <Stays kind="hotel" incoming={incoming} />}
      {tab === "appartements" && <Stays kind="appartement" incoming={incoming} />}
      {tab === "sejour" && <TripPlanner />}
    </div>
  );
}

/* ---------------- Vols ---------------- */
const CABINS: [FlightQuery["cabin"], string][] = [["economy", "Économique"], ["premium_economy", "Premium éco"], ["business", "Affaires"], ["first", "Première"]];

function Flights({ incoming }: { incoming: Record<string, string> }) {
  const city = useCity();
  const [from, setFrom] = useState(city.id === "paris" ? "" : "Paris (tous les aéroports)");
  const [to, setTo] = useState(city.id === "paris" ? "" : placeName(city.iata));
  const [depart, setDepart] = useState(plusDays(today(), 14));
  const [back, setBack] = useState(plusDays(today(), 18));
  const [oneWay, setOneWay] = useState(false);
  const [adults, setAdults] = useState(1);
  const [cabin, setCabin] = useState<FlightQuery["cabin"]>("economy");
  const [sort, setSort] = useState<FlightSortKey>("prix");
  const [query, setQuery] = useState<FlightQuery | null>(null);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    if (!incoming.from && !incoming.to) return;
    const f = incoming.from ?? "PAR", t = incoming.to ?? "";
    setFrom(placeName(f));
    setTo(placeName(t));
    if (incoming.depart) setDepart(incoming.depart);
    if (incoming.back) setBack(incoming.back);
    setOneWay(!incoming.back);
    const a = Math.min(9, Math.max(1, Number(incoming.adults) || 1));
    setAdults(a);
    const srt = (["prix", "prix-desc", "rapide", "meilleur"] as const).find((x) => x === incoming.sort) ?? "prix";
    setSort(srt);
    if (/^[A-Z]{3}$/.test(f) && /^[A-Z]{3}$/.test(t) && incoming.depart) setQuery({ from: f, to: t, depart: incoming.depart, back: incoming.back || undefined, adults: a, cabin: "economy" });
  }, [incoming]);

  const go = () => {
    const f = toIata(from), t = toIata(to);
    if (!f || !t) return setError("Choisis une ville dans la liste (ou tape son code à 3 lettres, ex. LIS).");
    if (f === t) return setError("Le départ et l'arrivée sont identiques.");
    setError("");
    setQuery({ from: f, to: t, depart, back: oneWay ? undefined : back, adults, cabin });
  };

  return (
    <section className="stack">
      {!booking && <div className="card travel-form">
        <datalist id="airports">{AIRPORTS.map(([c, n]) => <option key={c + n} value={n}>{c}</option>)}</datalist>
        <div className="booking-grid">
          <label>De<input list="airports" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Paris" /></label>
          <label>Vers<input list="airports" value={to} onChange={(e) => setTo(e.target.value)} placeholder="Lisbonne, Rome…" /></label>
          <label>Aller<input type="date" value={depart} min={today()} onChange={(e) => { setDepart(e.target.value); if (e.target.value > back) setBack(plusDays(e.target.value, 3)); }} /></label>
          <label>Retour<input type="date" value={back} min={depart} disabled={oneWay} onChange={(e) => setBack(e.target.value)} /></label>
          <label>Voyageurs<input type="number" min={1} max={9} value={adults} onChange={(e) => setAdults(Math.max(1, Math.min(9, +e.target.value || 1)))} /></label>
          <label>Classe<select value={cabin} onChange={(e) => setCabin(e.target.value as FlightQuery["cabin"])}>{CABINS.map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
        </div>
        <label className="check-row"><input type="checkbox" checked={oneWay} onChange={(e) => setOneWay(e.target.checked)} /> Aller simple</label>
        <div className="chip-grid cities-quick">
          {CITIES.filter((c) => c.id !== "paris").map((c) => (
            <button key={c.id} className="chip small" onClick={() => setTo(placeName(c.iata))}>{c.name}</button>
          ))}
        </div>
        {error && <p className="tiny error-text">{error}</p>}
        <button className="btn btn-primary btn-block" onClick={go}><Icon name="plane" size={18} /> Voir les vols</button>
      </div>}
      {query && (
        <>
          {!booking && <h2 className="serif section-title">{placeName(query.from)} → {placeName(query.to)}</h2>}
          <FlightResults query={query} sort={sort} onSort={setSort} onFocus={setBooking} />
        </>
      )}
    </section>
  );
}

/* ---------------- Hôtels et appartements ---------------- */
type HotelSort = "prix" | "prix-desc" | "etoiles" | "pepites";
const STYLES: Mood[] = ["romantique", "famille", "tendance", "petit-budget", "cache", "insolite", "bobo"];

function Stays({ kind, incoming }: { kind: "hotel" | "appartement"; incoming: Record<string, string> }) {
  const current = useCity();
  const [cityId, setCityId] = useState<CityId>(current.id);
  const [checkin, setCheckin] = useState(plusDays(today(), 7));
  const [checkout, setCheckout] = useState(plusDays(today(), 9));
  const [adults, setAdults] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [query, setQuery] = useState<StayQuery | null>(null);
  const [preselect, setPreselect] = useState<string | null>(null);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    if (isCityId(incoming.city)) setCityId(incoming.city);
    if (incoming.checkin) setCheckin(incoming.checkin);
    if (incoming.checkout) setCheckout(incoming.checkout);
    if (incoming.adults) setAdults(Math.max(1, Math.min(8, Number(incoming.adults) || 2)));
    if (incoming.hotel || incoming.go) {
      const c = cityById(isCityId(incoming.city) ? incoming.city : cityId);
      setQuery({ city: c.id, lat: c.center.lat, lng: c.center.lng, checkin: incoming.checkin || checkin, checkout: incoming.checkout || checkout, adults: Number(incoming.adults) || adults, rooms, kind });
      if (incoming.hotel) setPreselect(incoming.hotel);
    }
  }, [incoming]); // eslint-disable-line react-hooks/exhaustive-deps

  const city = cityById(cityId);
  const search = (preselectId?: string, at?: Spot) => {
    setQuery({ city: city.id, lat: at?.lat ?? city.center.lat, lng: at?.lng ?? city.center.lng, checkin, checkout, adults, rooms, kind });
    setPreselect(preselectId ?? null);
    document.querySelector(".content")?.scrollTo({ top: 260, behavior: "smooth" });
  };

  return (
    <section className="stack">
      {!booking && <div className="card travel-form">
        <label>Destination
          <select value={cityId} onChange={(e) => { setCityId(e.target.value as CityId); setQuery(null); }}>
            {CITIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        <div className="booking-grid">
          <label>Arrivée<input type="date" value={checkin} min={today()} onChange={(e) => { setCheckin(e.target.value); if (e.target.value >= checkout) setCheckout(plusDays(e.target.value, 1)); }} /></label>
          <label>Départ<input type="date" value={checkout} min={plusDays(checkin, 1)} onChange={(e) => setCheckout(e.target.value)} /></label>
          <label>Voyageurs<input type="number" min={1} max={8} value={adults} onChange={(e) => setAdults(Math.max(1, Math.min(8, +e.target.value || 1)))} /></label>
          <label>{kind === "hotel" ? "Chambres" : "Logements"}<input type="number" min={1} max={4} value={rooms} onChange={(e) => setRooms(Math.max(1, Math.min(4, +e.target.value || 1)))} /></label>
        </div>
        <button className="btn btn-primary btn-block" onClick={() => search()}>
          <Icon name="search" size={18} /> {kind === "hotel" ? "Voir les hôtels disponibles" : "Voir les appartements disponibles"}
        </button>
        {kind === "appartement" && (
          <p className="tiny muted">
            Airbnb ne permet à aucune autre application d'afficher ou de réserver ses logements. Marco te propose les appartements et résidences disponibles chez ses partenaires de réservation, réservables ici.
          </p>
        )}
      </div>}

      {query && (
        <>
          {!booking && <h2 className="serif section-title">{kind === "hotel" ? "Hôtels" : "Appartements"} à {cityById(query.city).name}</h2>}
          <StayResults key={JSON.stringify(query)} query={query} preselect={preselect} onPreselected={() => setPreselect(null)} onFocus={setBooking} />
        </>
      )}

      {kind === "hotel" && !booking && <HotelSelection cityId={cityId} onBook={(h) => search(h.id, h)} />}
    </section>
  );
}

/** La sélection d'hôtels de Marco pour la ville : tri, filtres, et réservation dans l'app. */
function HotelSelection({ cityId, onBook }: { cityId: CityId; onBook: (h: Spot) => void }) {
  const open = useSpotSheet();
  const { version } = useCloud();
  const [sort, setSort] = useState<HotelSort>("prix");
  const [budget, setBudget] = useState<0 | 1 | 2 | 3>(0);
  const [style, setStyle] = useState<Mood | "">("");
  const city = cityById(cityId);
  const hotels = useMemo(() => {
    const all = citySpots(cityId).filter((s) => s.category === "hotel");
    const order = (s: Spot) => all.indexOf(s);
    const list = all.filter((s) => (!budget || s.price === budget) && (!style || s.moods.includes(style)));
    const by: Record<HotelSort, (a: Spot, b: Spot) => number> = {
      prix: (a, b) => a.price - b.price || order(a) - order(b),
      "prix-desc": (a, b) => b.price - a.price || order(b) - order(a),
      etoiles: (a, b) => (b.stars ?? 0) - (a.stars ?? 0) || a.price - b.price,
      pepites: (a, b) => b.hidden - a.hidden || a.price - b.price,
    };
    return list.sort(by[sort]);
  }, [cityId, sort, budget, style, version]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!citySpots(cityId).some((s) => s.category === "hotel")) return null;
  return (
    <section className="stack">
      <h2 className="serif section-title">La sélection de Marco à {city.name}</h2>
      <div className="chip-grid">
        {(["prix", "prix-desc", "etoiles", "pepites"] as HotelSort[]).map((k) => (
          <button key={k} className={`chip small ${sort === k ? "on" : ""}`} onClick={() => setSort(k)}>{{ prix: "Moins cher", "prix-desc": "Plus cher", etoiles: "Étoiles", pepites: "Pépites" }[k]}</button>
        ))}
        {([0, 1, 2, 3] as const).map((b) => (
          <button key={b} className={`chip small ${budget === b ? "on" : ""}`} onClick={() => setBudget(b)}>{b ? "€".repeat(b) : "Tous les prix"}</button>
        ))}
      </div>
      <div className="chip-grid">
        {STYLES.map((m) => (
          <button key={m} className={`chip small ${style === m ? "on" : ""}`} onClick={() => setStyle(style === m ? "" : m)}>{MOOD_LABEL[m]}</button>
        ))}
      </div>
      {hotels.map((h) => (
        <article key={h.id} className="hotel-row">
          <div className="hotel-main" onClick={() => open(h.id)}>
            <div className="hotel-art"><SpotPhoto spot={h} height={84} rounded={14} /></div>
            <div className="grow">
              <strong>{h.name}</strong>
              <p className="tiny muted">{h.stars ? "★".repeat(h.stars) : "Auberge"} · {placeLabel(h)}</p>
              <p className="tiny">{HOTEL_PRICE_LABEL[h.price]} (indicatif)</p>
              <p className="tiny muted hotel-pitch">{h.pitch}</p>
            </div>
          </div>
          <div className="hotel-actions">
            <button className="btn-mini primary" onClick={() => onBook(h)}>Voir les chambres et réserver</button>
          </div>
        </article>
      ))}
    </section>
  );
}

export const voyageParams = (p: Record<string, string | number | undefined>) =>
  Object.entries(p).filter(([, v]) => v !== undefined && v !== "").map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join("&");

export function useVoyageNav() {
  const navigate = useNavigate();
  return (p: Record<string, string | number | undefined>) => navigate(`/voyages?${voyageParams(p)}`);
}
