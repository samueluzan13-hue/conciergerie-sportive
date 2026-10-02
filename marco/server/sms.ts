// Envoi de SMS transactionnels (confirmation / refus de réservation) via Twilio.
// Variables : TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, et TWILIO_FROM (numéro ou nom d'expéditeur « Marco »)
// ou TWILIO_MESSAGING_SERVICE_SID. Réservé à l'équipe : en-tête x-marco-admin = MARCO_ADMIN_TOKEN.

const enabled = () => Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && (process.env.TWILIO_FROM || process.env.TWILIO_MESSAGING_SERVICE_SID));

export async function handleSms(method: string, raw: string, adminToken?: string): Promise<{ status: number; body: unknown }> {
  if (method === "GET") return { status: 200, body: { enabled: enabled() } };
  if (method !== "POST") return { status: 405, body: { error: "Méthode non autorisée" } };
  if (!enabled()) return { status: 503, body: { error: "SMS non configurés sur ce site" } };
  if (!process.env.MARCO_ADMIN_TOKEN || adminToken !== process.env.MARCO_ADMIN_TOKEN) return { status: 401, body: { error: "Clé admin invalide" } };
  let to = "", text = "";
  try {
    const j = JSON.parse(raw || "{}");
    to = String(j.to ?? "");
    text = String(j.body ?? "");
  } catch {
    return { status: 400, body: { error: "Requête invalide" } };
  }
  if (!/^\+\d{8,15}$/.test(to) || !text.trim() || text.length > 480) return { status: 400, body: { error: "Numéro ou message invalide" } };
  const form = new URLSearchParams({ To: to, Body: text });
  if (process.env.TWILIO_MESSAGING_SERVICE_SID) form.set("MessagingServiceSid", process.env.TWILIO_MESSAGING_SERVICE_SID);
  else form.set("From", process.env.TWILIO_FROM!);
  const sid = process.env.TWILIO_ACCOUNT_SID!;
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${sid}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
  });
  const j = (await res.json().catch(() => ({}))) as { sid?: string; message?: string };
  if (!res.ok) return { status: 502, body: { error: j.message ?? "Envoi refusé par Twilio" } };
  return { status: 200, body: { ok: true, id: j.sid } };
}
