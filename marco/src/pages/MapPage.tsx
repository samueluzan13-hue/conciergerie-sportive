import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer, Tooltip } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { SpotRow } from "../components/SpotCard";
import { useSpotSheet } from "../components/SpotSheet";
import { CATEGORY_LABEL, SPOTS, type Category } from "../data/spots";
import { STREETS } from "../data/streets";
import { useStore } from "../lib/store";

const pin = (cls: string, label = "") =>
  L.divIcon({ className: "", html: `<div class="map-pin ${cls}">${label}</div>`, iconSize: [30, 30], iconAnchor: [15, 30] });

const ICONS: Record<string, L.DivIcon> = {};
const iconFor = (key: string, label?: string) => (ICONS[key] ??= pin(key, label));

export function MapPage() {
  const saved = useStore((s) => s.saved);
  const openSpot = useSpotSheet();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"reve" | "aime">("reve");
  const [cat, setCat] = useState<Category | "all" | "rues">("all");

  const spots = useMemo(
    () => SPOTS.filter((s) => (mode === "aime" ? saved.includes(s.id) : true) && (cat === "all" || s.category === cat)),
    [mode, cat, saved],
  );
  const showStreets = cat === "rues";

  return (
    <div className="page map-page">
      <div className="map-wrap">
        <MapContainer center={[48.8606, 2.3476]} zoom={13} zoomControl={false} className="map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          {!showStreets &&
            spots.map((s) => (
              <Marker key={s.id} position={[s.lat, s.lng]} icon={iconFor(`cat-${s.category}${s.hidden === 3 ? " hidden" : ""}`)} eventHandlers={{ click: () => openSpot(s.id) }}>
                <Tooltip direction="top" offset={[0, -28]}>{s.name}</Tooltip>
              </Marker>
            ))}
          {showStreets &&
            STREETS.map((s) => (
              <Marker key={s.id} position={[s.lat, s.lng]} icon={iconFor("street")} eventHandlers={{ click: () => navigate(`/rues?q=${encodeURIComponent(s.name)}`) }}>
                <Tooltip direction="top" offset={[0, -28]}>{s.name} · {s.fait.annee}</Tooltip>
              </Marker>
            ))}
        </MapContainer>
      </div>

      <div className="map-panel">
        <div className="segmented">
          <button className={mode === "aime" ? "on" : ""} onClick={() => setMode("aime")}>Ce que j'aime</button>
          <button className={mode === "reve" ? "on" : ""} onClick={() => setMode("reve")}>Fais-moi rêver</button>
        </div>
        <div className="chips-scroll">
          <button className={`chip ${cat === "all" ? "on" : ""}`} onClick={() => setCat("all")}>Tout</button>
          {(Object.keys(CATEGORY_LABEL) as Category[]).map((c) => (
            <button key={c} className={`chip ${cat === c ? "on" : ""}`} onClick={() => setCat(c)}>{CATEGORY_LABEL[c]}</button>
          ))}
          <button className={`chip ${cat === "rues" ? "on" : ""}`} onClick={() => setCat("rues")}>Rues racontées</button>
        </div>
        {!showStreets && (
          <div className="stack map-list">
            {spots.length ? spots.slice(0, 12).map((s) => <SpotRow key={s.id} spot={s} />) : (
              <p className="muted small center">Aucun lieu enregistré pour l'instant. Touche le cœur d'une adresse pour la retrouver ici.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
