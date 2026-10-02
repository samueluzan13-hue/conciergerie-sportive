// Côté app : pilote automatique des réservations (site en ligne uniquement, voir server/autopilot.ts).
import type { Booking } from "./cloud";

export interface ServerBooking {
  id: string; code: string; place: string; placeKey: string; city: string; kind: string; address: string;
  date: string; time: string; checkout: string; people: number; name: string; phone: string; note: string;
  status: "en_attente" | "appel" | "confirmee" | "impossible"; reponse: string; honored: boolean; createdAt: number; smsAt?: number;
}

let config: Promise<{ enabled: boolean; auto: boolean }> | null = null;
export function autopilotConfig() {
  if (import.meta.env.VITE_PREVIEW) return Promise.resolve({ enabled: false, auto: false });
  config ??= fetch("/api/reservations")
    .then((r) => (r.ok ? r.json() : { enabled: false, auto: false }))
    .catch(() => ({ enabled: false, auto: false }));
  return config;
}

export async function submitReservation(b: Record<string, unknown>): Promise<{ id: string; code: string; auto: boolean }> {
  const r = await fetch("/api/reservations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) });
  if (!r.ok) throw new Error(`reservations ${r.status}`);
  return r.json();
}

export async function reservationStatus(id: string, code: string): Promise<Pick<ServerBooking, "status" | "reponse" | "time"> | null> {
  const r = await fetch(`/api/reservations?id=${encodeURIComponent(id)}&code=${encodeURIComponent(code)}`).catch(() => null);
  return r?.ok ? r.json() : null;
}

export async function adminReservations(key: string): Promise<ServerBooking[] | null> {
  const r = await fetch("/api/reservations?all=1", { headers: { "x-marco-admin": key } }).catch(() => null);
  return r?.ok ? ((await r.json()).bookings as ServerBooking[]) : null;
}

export async function adminUpdate(key: string, id: string, patch: { status?: "confirmee" | "impossible"; reponse?: string; honored?: boolean }) {
  const r = await fetch(`/api/reservations?id=${encodeURIComponent(id)}`, { method: "PATCH", headers: { "Content-Type": "application/json", "x-marco-admin": key }, body: JSON.stringify(patch) });
  return r.ok;
}

/** Pour les statistiques partenaires : même forme que les réservations de la base claude.ai. */
export const asBooking = (b: ServerBooking): Booking => ({
  ...b, userId: "", spotId: b.placeKey.startsWith("spot:") ? b.placeKey.slice(5) : undefined,
  status: b.status === "appel" ? "en_attente" : b.status, smsAt: b.smsAt ?? 0,
});
