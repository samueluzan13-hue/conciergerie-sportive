// SMS au client quand l'équipe Marco valide ou refuse sa réservation.
// Message transactionnel (pas de publicité) : expéditeur identifié, détails de la réservation, code Marco.
// Texte limité aux caractères GSM (é, è, à, ù… oui ; ê, â, ô, ç non) pour tenir en 1 ou 2 SMS sans surcoût.
import type { Booking } from "./cloud";

const gsm = (s: string) =>
  s.replace(/[êë]/g, "e").replace(/[âä]/g, "a").replace(/[îï]/g, "i").replace(/[ôö]/g, "o").replace(/[ûü]/g, "u").replace(/ç/g, "c")
    .replace(/[ÀÂ]/g, "A").replace(/[ÈÊË]/g, "E").replace(/[ÎÏ]/g, "I").replace(/Ô/g, "O").replace(/[ÙÛ]/g, "U")
    .replace(/[’‘]/g, "'").replace(/[«»“”]/g, '"').replace(/[–—]/g, "-").replace(/ /g, " ");

/** Téléphone au format international (06… → +336…). */
export function intlPhone(p: string) {
  const d = p.replace(/[^\d+]/g, "");
  if (d.startsWith("+")) return d;
  if (d.startsWith("00")) return `+${d.slice(2)}`;
  if (/^0\d{9}$/.test(d)) return `+33${d.slice(1)}`;
  return d;
}

function when(b: Pick<Booking, "date" | "time" | "kind" | "checkout">) {
  const d = (x: string) => new Date(`${x}T12:00`).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" }).replace(/\.$/, "");
  if (b.kind === "hotel" && b.checkout) return `du ${d(b.date)} au ${d(b.checkout)}`;
  return `le ${d(b.date)} à ${b.time.replace(":", "h")}`;
}

export function bookingSms(b: Pick<Booking, "place" | "date" | "time" | "people" | "code" | "kind" | "checkout" | "address">, status: "confirmee" | "impossible", reponse = "") {
  const who = `${b.people} pers.`;
  const extra = reponse.trim() ? ` ${reponse.trim().replace(/\s+/g, " ").slice(0, 120)}` : "";
  const text =
    status === "confirmee"
      ? `Marco : votre réservation ${b.kind === "hotel" ? "à" : "chez"} ${b.place} ${when(b)} (${who}) est confirmée.${b.code ? ` Code ${b.code} à présenter sur place.` : ""}${extra} Bonne visite !`
      : `Marco : désolé, ${b.place} ne peut pas vous accueillir ${when(b)} (${who}).${extra} Ouvrez Marco pour choisir un autre créneau ou une autre adresse.`;
  return gsm(text);
}

/** Lien WhatsApp avec le message prêt (fonctionne sur ordinateur via WhatsApp Web et sur téléphone). */
export const whatsappLink = (phone: string, body: string) => `https://wa.me/${intlPhone(phone).replace(/^\+/, "")}?text=${encodeURIComponent(body)}`;

/** Lien qui ouvre l'application SMS du téléphone avec le message déjà écrit (fonctionne sur iPhone et Android). */
export const smsLink = (phone: string, body: string) => `sms:${intlPhone(phone)}?&body=${encodeURIComponent(body)}`;

/** Envoi automatique par le serveur (site en ligne avec Twilio). */
export async function smsConfig(): Promise<boolean> {
  if (import.meta.env.VITE_PREVIEW) return false;
  try {
    const r = await fetch("/api/sms");
    return r.ok && (await r.json()).enabled === true;
  } catch {
    return false;
  }
}

export async function sendSms(phone: string, body: string, adminKey: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const r = await fetch("/api/sms", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-marco-admin": adminKey },
      body: JSON.stringify({ to: intlPhone(phone), body }),
    });
    const j = await r.json().catch(() => ({}));
    return r.ok ? { ok: true } : { ok: false, error: j.error ?? `Erreur ${r.status}` };
  } catch {
    return { ok: false, error: "Réseau indisponible" };
  }
}

/** La demande du client, envoyée sur le WhatsApp de l'équipe Marco (aucun accès à la base nécessaire). */
export function requestMessage(r: { place: string; address?: string; date: string; time: string; people: number; name: string; phone: string; note?: string; code: string; kind?: string; checkout?: string }) {
  const d = (x: string) => new Date(`${x}T12:00`).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  const when = r.kind === "hotel" && r.checkout ? `du ${d(r.date)} au ${d(r.checkout)}` : `le ${d(r.date)} à ${r.time.replace(":", "h")}`;
  return [
    `Bonjour Marco, je souhaite réserver :`,
    `${r.place}${r.address ? ` (${r.address})` : ""}`,
    `${when}, ${r.people} pers.`,
    `Nom : ${r.name} · Tél : ${r.phone}`,
    ...(r.note ? [`Précisions : ${r.note}`] : []),
    `Code Marco : ${r.code}`,
  ].join("\n");
}
