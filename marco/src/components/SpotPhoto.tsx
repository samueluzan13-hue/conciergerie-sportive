import { useEffect, useState } from "react";
import type { Spot } from "../data/spots";
import { SpotArt } from "./SpotArt";

// Sur le vrai site, les photos peuvent venir de l'API officielle Google Places (via /api/photo).
// Dans l'aperçu claude.ai, seules les photos hébergées dans l'app s'affichent (images externes bloquées).
let googlePhotos: Promise<boolean> | null = null;
function googleEnabled() {
  if (import.meta.env.VITE_PREVIEW) return Promise.resolve(false);
  googlePhotos ??= fetch("/api/photo?status=1")
    .then((r) => (r.ok ? r.json() : { enabled: false }))
    .then((d) => Boolean(d.enabled))
    .catch(() => false);
  return googlePhotos;
}

export function photoUrl(spot: Spot): string | null {
  if (!spot.photo) return null;
  return /^[0-9a-f]{32}$/.test(spot.photo) ? `/_blob/${spot.photo}` : spot.photo;
}

/** Photo du lieu si elle existe, sinon l'illustration Marco. */
export function SpotPhoto({ spot, height, rounded = 18, showCredit = false }: { spot: Spot; height: number; rounded?: number; showCredit?: boolean }) {
  const own = photoUrl(spot);
  const [google, setGoogle] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
    if (!own) googleEnabled().then(setGoogle);
  }, [own]);

  const src = own ?? (google ? `/api/photo?q=${encodeURIComponent(`${spot.name} ${spot.address}`)}` : null);
  if (!src || failed) return <SpotArt spot={spot} height={height} rounded={rounded} />;

  const credit = own ? spot.photoCredit : "Photo : Google Maps";
  return (
    <div className="spot-photo" style={{ height, borderRadius: rounded }}>
      <img src={src} alt={spot.name} loading="lazy" decoding="async" onError={() => setFailed(true)} />
      {showCredit && credit && <span className="photo-credit">{credit}</span>}
    </div>
  );
}
