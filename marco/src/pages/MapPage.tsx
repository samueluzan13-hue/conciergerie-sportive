import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CityMap } from "../components/ParisMap";
import { CityPicker } from "../components/CityPicker";
import { SpotRow } from "../components/SpotCard";
import { CATEGORY_LABEL, citySpots, placeLabel, QUARTIERS, type Category } from "../data/spots";
import { cityStreets } from "../data/streets";
import { distanceKm } from "../lib/geo";
import { useCity, useStore } from "../lib/store";
import { useCloud } from "../lib/cloud";

export function MapPage() {
  const saved = useStore((s) => s.saved);
  const quartier = useStore((s) => s.profile.quartier);
  const navigate = useNavigate();
  const [mode, setMode] = useState<"reve" | "aime">("reve");
  const [cat, setCat] = useState<Category | "all" | "rues">("all");
  const [selected, setSelected] = useState<string | null>(null);
  const city = useCity();
  const { version } = useCloud();
  const home = city.id === "paris" ? QUARTIERS.find((q) => q.name === quartier) ?? null : city.center;

  const spots = useMemo(
    () =>
      citySpots(city.id).filter((s) => (mode === "aime" ? saved.includes(s.id) : true) && (cat === "all" || s.category === cat))
        .sort((a, b) => (home ? distanceKm(home, a) - distanceKm(home, b) : 0)),
    [mode, cat, saved, home, city.id, version], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const showStreets = cat === "rues";
  const sel = spots.find((s) => s.id === selected);

  return (
    <div className="map-page">
      <CityMap
        key={city.id}
        city={city.id}
        spots={showStreets ? [] : spots}
        streets={showStreets ? cityStreets(city.id) : undefined}
        selected={selected}
        home={home}
        onSpot={setSelected}
        onStreet={(s) => navigate(`/rues?q=${encodeURIComponent(s.name)}`)}
      />

      <div className="map-city"><CityPicker /></div>
      <div className="map-panel">
        <div className="segmented">
          <button className={mode === "aime" ? "on" : ""} onClick={() => setMode("aime")}>Ce que j'aime ({saved.length})</button>
          <button className={mode === "reve" ? "on" : ""} onClick={() => setMode("reve")}>Fais-moi rêver</button>
        </div>
        <div className="chips-scroll">
          <button className={`chip ${cat === "all" ? "on" : ""}`} onClick={() => setCat("all")}>Tout</button>
          {(Object.keys(CATEGORY_LABEL) as Category[]).map((c) => (
            <button key={c} className={`chip dot-${c} ${cat === c ? "on" : ""}`} onClick={() => setCat(c)}>{CATEGORY_LABEL[c]}</button>
          ))}
          <button className={`chip ${cat === "rues" ? "on" : ""}`} onClick={() => setCat("rues")}>Rues racontées</button>
        </div>

        {showStreets ? (
          <p className="muted small">Touche un losange sur la carte pour lire l'histoire de la rue.</p>
        ) : (
          <div className="stack map-list">
            {sel && <SpotRow spot={sel} meta={`Sélection · ${sel.quartier}`} />}
            {spots.length ? (
              spots.filter((s) => s.id !== selected).slice(0, 15).map((s) => (
                <SpotRow key={s.id} spot={s} meta={home ? `${placeLabel(s)} · ${distanceKm(home, s).toFixed(1).replace(".", ",")} km ${city.id === "paris" ? "de chez toi" : "du centre"}` : undefined} />
              ))
            ) : (
              <p className="muted small center">Aucun lieu enregistré pour l'instant. Touche le cœur d'une adresse pour la retrouver ici.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
