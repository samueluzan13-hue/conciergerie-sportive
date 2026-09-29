import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { CATEGORY_LABEL, MOOD_LABEL, spotById, type Spot } from "../data/spots";
import { pushHistory } from "../lib/store";
import { Icon } from "./Icon";
import { SpotArt } from "./SpotArt";
import { HiddenBadge, Price, SaveButton } from "./SpotCard";

const Ctx = createContext<(id: string) => void>(() => {});

export const useSpotSheet = () => useContext(Ctx);

export function bookingUrl(spot: Spot) {
  if (spot.bookable === "table") return `https://www.thefork.fr/search?queryText=${encodeURIComponent(spot.name + " Paris")}`;
  return `https://www.getyourguide.fr/s/?q=${encodeURIComponent(spot.name + " Paris")}`;
}

export function directionsUrl(spot: Spot) {
  return `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`;
}

export function SpotSheetProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState<string | null>(null);
  const spot = id ? spotById(id) : undefined;

  useEffect(() => {
    if (!id) return;
    pushHistory(id);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setId(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [id]);

  return (
    <Ctx.Provider value={setId}>
      {children}
      {spot && (
        <div className="sheet-backdrop" onClick={() => setId(null)}>
          <div className="sheet" role="dialog" aria-modal="true" aria-label={spot.name} onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle" />
            <div className="sheet-art">
              <SpotArt spot={spot} height={170} rounded={22} />
              <button className="sheet-close" aria-label="Fermer" onClick={() => setId(null)}>
                <Icon name="close" size={18} />
              </button>
              <SaveButton id={spot.id} />
            </div>
            <div className="row-between" style={{ marginTop: 14 }}>
              <span className="eyebrow">{CATEGORY_LABEL[spot.category]} · {spot.quartier}</span>
              <Price level={spot.price} />
            </div>
            <h2 className="serif" style={{ margin: "6px 0 4px" }}>{spot.name}</h2>
            <p className="muted small">{spot.address}</p>
            <div className="tags" style={{ margin: "12px 0" }}>
              <HiddenBadge level={spot.hidden} />
              {spot.moods.map((m) => (
                <span key={m} className="tag">{MOOD_LABEL[m]}</span>
              ))}
              <span className="tag"><Icon name="clock" size={13} /> ~{spot.duration} min</span>
            </div>
            <p>{spot.pitch}</p>
            <div className="tip">
              <span className="tip-label">L'astuce de Marco</span>
              {spot.tip}
            </div>
            <div className="sheet-actions">
              {spot.bookable ? (
                <a className="btn btn-primary" href={bookingUrl(spot)} target="_blank" rel="noreferrer">
                  <Icon name="calendar" size={18} />
                  {spot.bookable === "table" ? "Réserver une table" : "Réserver l'activité"}
                </a>
              ) : null}
              <a className={`btn ${spot.bookable ? "btn-ghost" : "btn-primary"}`} href={directionsUrl(spot)} target="_blank" rel="noreferrer">
                <Icon name="pin" size={18} /> Y aller
              </a>
            </div>
            {spot.bookable && <p className="muted tiny center">Réservation chez nos partenaires, sans surcoût pour toi.</p>}
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}
