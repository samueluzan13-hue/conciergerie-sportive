export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Temps de trajet estimé : à pied jusqu'à 2 km, sinon métro. */
export function travel(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const km = distanceKm(a, b) * 1.3; // les rues ne sont pas en ligne droite
  if (km <= 2) return { mode: "à pied" as const, minutes: Math.max(3, Math.round((km / 4.5) * 60)) };
  return { mode: "métro" as const, minutes: Math.round(12 + km * 2.5) };
}

export function formatTime(totalMinutes: number) {
  const h = Math.floor(totalMinutes / 60) % 24;
  const m = Math.round(totalMinutes % 60);
  return `${h}h${m.toString().padStart(2, "0")}`;
}
