import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Spot as SpotT } from "../data/spots";
import { bookingKind, CATEGORY_LABEL, MOOD_LABEL, spotById, usuallyNoBooking, type Spot } from "../data/spots";
import { pushHistory } from "../lib/store";
import { Icon } from "./Icon";
import { reserveUrl, siteLabel } from "../lib/reservation";
import { SpotPhoto } from "./SpotPhoto";
import { getAssets, setSpotPhoto } from "../lib/cloud";
import { HiddenBadge, Price, SaveButton } from "./SpotCard";

const Ctx = createContext<(id: string) => void>(() => {});

export const useSpotSheet = () => useContext(Ctx);

/** Réservation directe sur le site officiel du lieu. */
export const bookingUrl = (spot: Spot) => reserveUrl(spot);

export function directionsUrl(spot: Spot) {
  return `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`;
}

function PhotoEditor({ spot }: { spot: SpotT }) {
  const [canUpload, setCanUpload] = useState(false);
  const [open, setOpen] = useState(false);
  const [credit, setCredit] = useState(spot.photoCredit ?? "");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  useEffect(() => {
    getAssets().then((a) => setCanUpload(Boolean(a)));
  }, []);
  if (!canUpload) return null;
  if (!open) {
    return (
      <button className="btn-text" onClick={() => setOpen(true)}>
        <Icon name="plus" size={14} /> {spot.photo ? "Changer la photo" : "Ajouter une photo"}
      </button>
    );
  }
  return (
    <div className="photo-edit">
      <strong className="small">Photo de {spot.name}</strong>
      <p className="tiny muted">Utilise une photo que tu as prise ou dont tu as les droits (pas de copie depuis Google Maps).</p>
      <input id={`credit-${spot.id}`} className="input" value={credit} onChange={(e) => setCredit(e.target.value)} placeholder="Crédit (ex. Photo : Samuel)" maxLength={120} />
      <input
        id={`photo-${spot.id}`}
        type="file"
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setState("sending");
          try {
            await setSpotPhoto(spot.id, file, credit);
            setState("done");
          } catch {
            setState("error");
          }
        }}
      />
      {state === "sending" && <p className="small">Envoi de la photo…</p>}
      {state === "done" && <p className="small">Photo ajoutée ✔</p>}
      {state === "error" && <p className="error small">L'envoi a échoué. Vérifie que tu as les droits d'édition et que le fichier est une image, puis réessaie.</p>}
    </div>
  );
}

export function SpotSheetProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState<string | null>(null);
  const spot = id ? spotById(id) : undefined;
  const book = spot ? bookingKind(spot) : undefined;

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
              <SpotPhoto spot={spot} height={200} rounded={22} showCredit />
              <button className="sheet-close" aria-label="Fermer" onClick={() => setId(null)}>
                <Icon name="close" size={18} />
              </button>
              <SaveButton id={spot.id} />
            </div>
            <PhotoEditor key={spot.id} spot={spot} />
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
              {book ? (
                <a className="btn btn-primary" href={bookingUrl(spot)} target="_blank" rel="noreferrer">
                  <Icon name="calendar" size={18} />
                  {book === "table" ? "Réserver au restaurant" : "Réserver sur le site officiel"}
                </a>
              ) : null}
              <a className={`btn ${book ? "btn-ghost" : "btn-primary"}`} href={directionsUrl(spot)} target="_blank" rel="noreferrer">
                <Icon name="pin" size={18} /> Y aller
              </a>
            </div>
            {book && (
              <p className="muted tiny center">
                {usuallyNoBooking(spot)
                  ? "Ce lieu fonctionne souvent sans réservation : son site te le confirmera, sinon viens directement."
                  : spot.website
                    ? `Tu réserves directement auprès du lieu, sur ${siteLabel(spot.website)}.`
                    : "Marco t'emmène sur le site officiel du lieu : vérifie que c'est bien le bon avant de réserver."}
              </p>
            )}
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}
