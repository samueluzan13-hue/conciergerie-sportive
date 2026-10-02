import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../components/Icon";
import { Markdown } from "../components/Markdown";
import { MarcoLogo } from "../components/MarcoLogo";
import { useSpotSheet } from "../components/SpotSheet";
import { CITIES, cityById, type CityId } from "../data/cities";
import { CATEGORY_LABEL, placeLabel } from "../data/spots";
import { askMarco, checkAi } from "../lib/ai";
import { fmtPrice } from "../lib/booking";
import { log } from "../lib/diag";
import { parseReply } from "../lib/meta";
import { generatePlan, type Envie, type Plan, type Who } from "../lib/planner";
import { addTrip, useCity } from "../lib/store";
import { AIRPORTS, toIata } from "../lib/travel";

const today = () => new Date().toISOString().slice(0, 10);
const plusDays = (d: string, n: number) => new Date(new Date(d).getTime() + n * 86400000).toISOString().slice(0, 10);

type Pace = "tranquille" | "equilibre" | "intense";
type Lodging = "hotel" | "appartement" | "deja";
const INTERESTS: [string, string, Envie[]][] = [
  ["culture", "Musées et histoire", ["culture"]],
  ["food", "Bien manger", ["manger"]],
  ["nuit", "Sortir le soir", ["verre"]],
  ["nature", "Parcs et balades", ["nature"]],
  ["insolite", "Insolite et caché", ["insolite"]],
  ["activites", "Activités", ["activite"]],
  ["cafe", "Cafés et douceurs", ["cafe"]],
];

/** Budget indicatif par personne et par jour (hors vols), selon la gamme. */
const BUDGET: Record<1 | 2 | 3, { night: number; food: number; fun: number; label: string }> = {
  1: { night: 45, food: 35, fun: 15, label: "Malin" },
  2: { night: 110, food: 70, fun: 35, label: "Confort" },
  3: { night: 260, food: 150, fun: 80, label: "Grand luxe" },
};

export function TripPlanner() {
  const current = useCity();
  const navigate = useNavigate();
  const openSpot = useSpotSheet();
  const [cityId, setCityId] = useState<CityId>(current.id === "paris" ? "lisbonne" : current.id);
  const [from, setFrom] = useState("Paris (tous les aéroports)");
  const [start, setStart] = useState(plusDays(today(), 21));
  const [end, setEnd] = useState(plusDays(today(), 24));
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(0);
  const [budget, setBudget] = useState<1 | 2 | 3>(2);
  const [pace, setPace] = useState<Pace>("equilibre");
  const [interests, setInterests] = useState<string[]>(["culture", "food", "insolite"]);
  const [lodging, setLodging] = useState<Lodging>("hotel");
  const [notes, setNotes] = useState("");
  const [days, setDays] = useState<Plan[] | null>(null);
  const [story, setStory] = useState("");
  const [writing, setWriting] = useState(false);
  const [saved, setSaved] = useState(false);

  const city = cityById(cityId);
  const nbDays = Math.max(1, Math.min(10, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86400000) + 1));
  const nights = Math.max(0, nbDays - 1);
  const people = adults + kids;
  const who: Who = kids ? "famille" : adults === 1 ? "solo" : adults === 2 ? "date" : "amis";
  const b = BUDGET[budget];
  const estimate = useMemo(
    () => ({
      lodging: lodging === "deja" ? 0 : b.night * nights * Math.max(1, adults) + (kids ? b.night * 0.3 * nights * kids : 0),
      food: b.food * nbDays * adults + b.food * 0.6 * nbDays * kids,
      fun: b.fun * nbDays * people,
    }),
    [b, nights, nbDays, adults, kids, people, lodging],
  );
  const total = estimate.lodging + estimate.food + estimate.fun;

  const build = async () => {
    // 1. Programme jour par jour tout de suite, à partir des adresses Marco de la ville
    const used = new Set<string>();
    const envies = INTERESTS.filter(([k]) => interests.includes(k)).flatMap(([, , e]) => e);
    const plans = Array.from({ length: nbDays }, (_, d) =>
      generatePlan({
        city: cityId,
        who,
        duration: pace === "tranquille" ? "3h" : "journee",
        budget,
        envies,
        quartier: city.districts[d % Math.max(1, city.districts.length)]?.name ?? "",
        hiddenOnly: interests.includes("insolite") && d % 2 === 1,
        exclude: used,
      }),
    );
    setDays(plans);
    setStory("");
    setSaved(false);
    log("trip:build", { city: cityId, nbDays });
    document.querySelector(".content")?.scrollTo({ top: 99999, behavior: "smooth" });

    // 2. Marco (IA) écrit le séjour complet, avec le rythme, les restos et ses conseils
    if (!(await checkAi())) return;
    setWriting(true);
    const outline = plans.map((p, i) => `Jour ${i + 1} : ${p.stops.map((s) => `${s.start} ${s.spot.name} [id:${s.spot.id}]`).join(", ")}`).join("\n");
    const ask = `Prépare-moi un séjour sur mesure à ${city.name}, du ${start} au ${end} (${nbDays} jours), au départ de ${from}.
Voyageurs : ${adults} adulte(s)${kids ? ` et ${kids} enfant(s)` : ""}. Budget : ${b.label.toLowerCase()} (environ ${b.food} € par personne et par jour pour manger). Rythme : ${pace}. Envies : ${INTERESTS.filter(([k]) => interests.includes(k)).map(([, l]) => l.toLowerCase()).join(", ") || "un peu de tout"}. Hébergement : ${lodging === "deja" ? "déjà trouvé" : lodging}.${notes.trim() ? ` Précisions : ${notes.trim()}.` : ""}
Voici une première trame construite avec ta sélection d'adresses (tu peux la réorganiser et la compléter) :
${outline}

Écris le séjour jour par jour : un titre ### par jour (avec un thème), puis matin / midi / après-midi / soir avec des horaires, les trajets logiques par quartier, un restaurant pour chaque repas (adapté au budget), et une astuce de Marco par jour. Utilise les marqueurs [[spot:ID]] pour les adresses de la sélection. Ajoute à la fin une section ### Avant de partir (quartier où dormir et pourquoi, transport depuis l'aéroport, pass ou réservations à faire à l'avance, ce qu'il faut savoir sur place). ${lodging !== "deja" ? `Propose aussi [[go:/voyages?tab=${lodging === "appartement" ? "appartements" : "hotels"}&city=${cityId}&checkin=${start}&checkout=${end}&adults=${people}&go=1|Voir les ${lodging === "appartement" ? "appartements" : "hôtels"} disponibles]].` : ""} Reste concis : une à trois lignes par moment de la journée.`;
    const text = await askMarco([{ role: "user", content: ask }], { deep: true, city: cityId, onText: setStory });
    setWriting(false);
    if (text) setStory(text);
  };

  const fromIata = toIata(from) ?? "PAR";
  const flightLink = `/voyages?tab=vols&from=${fromIata}&to=${city.iata}&depart=${start}&back=${end}&adults=${people}&sort=prix`;
  const stayLink = `/voyages?tab=${lodging === "appartement" ? "appartements" : "hotels"}&city=${cityId}&checkin=${start}&checkout=${end}&adults=${people}&go=1`;

  const save = () => {
    const text = story ? parseReply(story).body.slice(0, 8000) : days?.map((p, i) => `### Jour ${i + 1}\n${p.stops.map((s) => `- **${s.start}** · [[spot:${s.spot.id}]]`).join("\n")}`).join("\n\n") ?? "";
    addTrip({
      id: `sejour-${Date.now()}`, kind: "sejour", title: `Séjour à ${city.name}`, detail: `${nbDays} jours · ${people} voyageur${people > 1 ? "s" : ""} · budget ${b.label.toLowerCase()}`,
      date: start, reference: "", price: Math.round(total), currency: "EUR", text, createdAt: Date.now(),
    });
    setSaved(true);
  };

  return (
    <section className="stack">
      <div className="card travel-form">
        <h2 className="serif section-title"><MarcoLogo size={26} /> Ton séjour, construit autour de toi</h2>
        <label>Où ça ?
          <select value={cityId} onChange={(e) => { setCityId(e.target.value as CityId); setDays(null); setStory(""); }}>
            {CITIES.map((c) => <option key={c.id} value={c.id}>{c.name} · {c.country}</option>)}
          </select>
        </label>
        <datalist id="trip-airports">{AIRPORTS.map(([c, n]) => <option key={c + n} value={n}>{c}</option>)}</datalist>
        <div className="booking-grid">
          <label>Départ de<input list="trip-airports" value={from} onChange={(e) => setFrom(e.target.value)} /></label>
          <label>Hébergement
            <select value={lodging} onChange={(e) => setLodging(e.target.value as Lodging)}>
              <option value="hotel">Hôtel</option><option value="appartement">Appartement</option><option value="deja">Déjà trouvé</option>
            </select>
          </label>
          <label>Arrivée<input type="date" value={start} min={today()} onChange={(e) => { setStart(e.target.value); if (e.target.value > end) setEnd(plusDays(e.target.value, 2)); }} /></label>
          <label>Retour<input type="date" value={end} min={start} max={plusDays(start, 9)} onChange={(e) => setEnd(e.target.value)} /></label>
          <label>Adultes<input type="number" min={1} max={8} value={adults} onChange={(e) => setAdults(Math.max(1, Math.min(8, +e.target.value || 1)))} /></label>
          <label>Enfants<input type="number" min={0} max={6} value={kids} onChange={(e) => setKids(Math.max(0, Math.min(6, +e.target.value || 0)))} /></label>
        </div>
        <p className="small"><strong>Budget</strong></p>
        <div className="chip-grid">
          {([1, 2, 3] as const).map((k) => (
            <button key={k} className={`chip small ${budget === k ? "on" : ""}`} onClick={() => setBudget(k)}>{"€".repeat(k)} {BUDGET[k].label}</button>
          ))}
        </div>
        <p className="small"><strong>Rythme</strong></p>
        <div className="chip-grid">
          {([["tranquille", "Tranquille"], ["equilibre", "Équilibré"], ["intense", "À fond"]] as [Pace, string][]).map(([k, l]) => (
            <button key={k} className={`chip small ${pace === k ? "on" : ""}`} onClick={() => setPace(k)}>{l}</button>
          ))}
        </div>
        <p className="small"><strong>Tes envies</strong></p>
        <div className="chip-grid">
          {INTERESTS.map(([k, l]) => (
            <button key={k} className={`chip small ${interests.includes(k) ? "on" : ""}`} onClick={() => setInterests((x) => (x.includes(k) ? x.filter((y) => y !== k) : [...x, k]))}>
              {interests.includes(k) && <Icon name="check" size={12} />} {l}
            </button>
          ))}
        </div>
        <label>Précisions (facultatif)<input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anniversaire, poussette, on adore le vin, on ne veut pas courir…" /></label>
        <div className="estimate">
          <p className="small"><strong>Budget estimé sur place : {fmtPrice(total, "EUR")}</strong> <span className="tiny muted">hors vols</span></p>
          <p className="tiny muted">
            {lodging !== "deja" ? `Hébergement ${fmtPrice(estimate.lodging, "EUR")} · ` : ""}Repas {fmtPrice(estimate.food, "EUR")} · Activités {fmtPrice(estimate.fun, "EUR")} — repères indicatifs pour {people} voyageur{people > 1 ? "s" : ""}, {nbDays} jour{nbDays > 1 ? "s" : ""}.
          </p>
        </div>
        <button className="btn btn-primary btn-block" onClick={build}><Icon name="sparkles" size={18} /> Construire mon séjour</button>
      </div>

      {days && (
        <>
          <div className="card trip-book">
            <p className="small"><strong>Réserve en deux gestes</strong></p>
            <button className="flight-link main" onClick={() => navigate(flightLink)}>
              <span><strong>Ton vol</strong><span className="tiny muted">{from.split(" (")[0]} → {city.name}, du moins cher au plus cher</span></span><Icon name="arrowRight" size={18} />
            </button>
            {lodging !== "deja" && (
              <button className="flight-link" onClick={() => navigate(stayLink)}>
                <span><strong>{lodging === "appartement" ? "Ton appartement" : "Ton hôtel"}</strong><span className="tiny muted">{nights} nuit{nights > 1 ? "s" : ""} à {city.name}, disponibilités en direct</span></span><Icon name="arrowRight" size={18} />
              </button>
            )}
          </div>

          {(story || writing) && (
            <div className="card trip-story">
              <div className="row gap-8"><MarcoLogo size={30} mood={writing ? "happy" : "wink"} /><strong className="serif">Le séjour de Marco</strong></div>
              {story ? <Markdown text={story} /> : <p className="small muted"><span className="spinner" /> Marco écrit ton séjour jour par jour…</p>}
            </div>
          )}

          {!story && !writing && (
            <div className="stack">
              {days.map((p, i) => (
                <div key={i} className="plan-card">
                  <div className="row-between"><strong>Jour {i + 1}</strong><span className="tiny muted">{new Date(plusDays(start, i)).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</span></div>
                  {p.stops.map((s) => (
                    <button key={s.spot.id} className="trip-stop" onClick={() => openSpot(s.spot.id)}>
                      <span className="tiny"><strong>{s.start}</strong></span>
                      <span className="grow small">{s.spot.name} <span className="muted tiny">· {CATEGORY_LABEL[s.spot.category]} · {placeLabel(s.spot)}</span></span>
                      <Icon name="arrowRight" size={14} />
                    </button>
                  ))}
                  {!p.stops.length && <p className="tiny muted">Journée libre : demande à Marco des idées.</p>}
                </div>
              ))}
            </div>
          )}

          <button className="btn btn-soft btn-block" disabled={saved || writing} onClick={save}>
            <Icon name={saved ? "check" : "bookmark"} size={18} /> {saved ? "Séjour enregistré dans ton profil" : "Enregistrer ce séjour"}
          </button>
        </>
      )}
    </section>
  );
}
