import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ParisMap } from "../components/ParisMap";
import { SpotRow } from "../components/SpotCard";
import { CATEGORY_LABEL, QUARTIERS, SPOTS, type Category } from "../data/spots";
import { STREETS } from "../data/streets";
import { distanceKm } from "../lib/geo";
import { useStore } from "../lib/store";

export function MapPage() {
  const saved = useStore((s) => s.saved);
  const quartier = useStore((s) => s.profile.quartier);
  const navigate = useNavigate();
  const [mode, setMode] = useState<"reve" | "aime">("reve");
  const [cat, setCat] = useState<Category | "all" | "rues">("all");
  const [selected, setSelected] = useState<string | null>(null);
  const home = QUARTIERS.find((q) => q.name === quartier) ?? null;

  const spots = useMemo(
    () =>
      SPOTS.filter((s) => (mode === "aime" ? saved.includes(s.id) : true) && (cat === "all" || s.category === cat))
        .sort((a, b) => (home ? distanceKm(home, a) - distanceKm(home, b) : 0)),
    [mode, cat, saved, home],
  );
  const showStreets = cat === "rues";
  const sel = spots.find((s) => s.id === selected);

  return (
    <div className="map-page">
      <ParisMap
        spots={showStreets ? [] : spots}
        streets={showStreets ? STREETS : undefined}
        selected={selected}
        home={home}
        onSpot={setSelected}
        onStreet={(s) => navigate(`/rues?q=${encodeURIComponent(s.name)}`)}
      />

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
                <SpotRow key={s.id} spot={s} meta={home ? `${s.quartier} · ${distanceKm(home, s).toFixed(1).replace(".", ",")} km de chez toi` : undefined} />
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
