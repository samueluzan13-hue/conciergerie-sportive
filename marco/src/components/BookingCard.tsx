import { useEffect, useState } from "react";
import { spotById } from "../data/spots";
import { newCode, requestBooking, track, useCloud } from "../lib/cloud";
import { withUtm } from "../lib/partners";
import { autopilotConfig, submitReservation } from "../lib/autopilot";
import { requestMessage, whatsappLink } from "../lib/sms";
import { log } from "../lib/diag";
import type { BookingDraft } from "../lib/meta";
import { duckyUrl, reserveUrl } from "../lib/reservation";
import { addBooking, useStore } from "../lib/store";
import { applyCall, getCall, startCall, voiceConfig, type CallResult } from "../lib/voice";
import { Icon } from "./Icon";
import { Link } from "./Nav";

const today = () => new Date().toISOString().slice(0, 10);

/** Carte de réservation proposée par l'IA : l'utilisateur complète, confirme, et l'équipe Marco réserve. */
export function BookingCard({ draft }: { draft: BookingDraft }) {
  const profileName = useStore((s) => s.profile.name);
  const cloud = useCloud();
  const [date, setDate] = useState(draft.date || today());
  const [time, setTime] = useState(draft.time || "20:00");
  const [people, setPeople] = useState(draft.people);
  const [name, setName] = useState(profileName);
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [state, setState] = useState<"form" | "sending" | "sent" | "error">("form");
  const [code, setCode] = useState("");
  const [serverAuto, setServerAuto] = useState<boolean | null>(null);
  // l'agent vocal de Marco appelle lui-même le restaurant (site en ligne, si configuré)
  const [voice, setVoice] = useState(false);
  const [call, setCall] = useState<{ id: string; bookingId: string; scheduledFor?: string } | null>(null);
  const [result, setResult] = useState<CallResult | null>(null);
  useEffect(() => {
    voiceConfig().then((c) => setVoice(c.auto));
  }, []);
  useEffect(() => {
    if (!call) return;
    let stop = false;
    const started = Date.now();
    const tick = async () => {
      if (stop) return;
      const r = await getCall(call.id);
      if (r) setResult(r);
      if (r && r.outcome !== "en_cours") return applyCall({ id: call.bookingId, time }, r);
      // on suit l'appel jusqu'à 10 min (s'il est programmé plus tard, le profil prendra le relais)
      if (Date.now() - started < 600_000 && !call.scheduledFor) setTimeout(tick, 5000);
    };
    const t = setTimeout(tick, call.scheduledFor ? 0 : 4000);
    return () => {
      stop = true;
      clearTimeout(t);
    };
  }, [call]); // eslint-disable-line react-hooks/exhaustive-deps
  const spot = draft.spotId ? spotById(draft.spotId) : undefined;
  const direct = spot ? reserveUrl(spot) : duckyUrl(draft.place);
  const valid = name.trim().length > 1 && /\d{6,}/.test(phone.replace(/\D/g, "")) && date >= today() && /^\d{2}:\d{2}$/.test(time);
  // on peut toujours réserver : avec la base, l'équipe Marco s'en charge ; sans, le client garde son code Marco et termine lui-même
  const canAsk = true;
  const online = voice || (cloud.db && !!cloud.userId && cloud.canWrite);

  const submit = async () => {
    if (!valid) return;
    setState("sending");
    if (voice) {
      try {
        const c = await startCall({ place: draft.place, address: spot?.address, date, time, people, name: name.trim(), phone: phone.trim(), note: note.trim() || undefined });
        const id = `v${Date.now().toString(36)}`;
        addBooking({ id, place: draft.place, spotId: draft.spotId, date, time, people, status: "en_attente", callId: c.callId });
        setCall({ id: c.callId, bookingId: id, scheduledFor: c.scheduledFor });
        setState("sent");
      } catch (e) {
        log("voice:error", e);
        setState("error");
      }
      return;
    }
    const ap = await autopilotConfig();
    if (ap.enabled) {
      try {
        const r = await submitReservation({ place: draft.place, placeKey: draft.spotId ? `spot:${draft.spotId}` : `nom:${draft.place.toLowerCase()}`, city: spot?.city ?? "paris", kind: "table", address: spot?.address ?? "", date, time, people, name: name.trim(), phone: phone.trim(), note: note.trim() });
        addBooking({ id: r.id, place: draft.place, spotId: draft.spotId, date, time, people, status: "en_attente", code: r.code, server: true });
        setCode(r.code);
        setServerAuto(r.auto);
        setState("sent");
        return;
      } catch (e) {
        log("resa:serveur", String(e));
      }
    }
    if (!online) {
      const c = newCode();
      addBooking({ id: `l${Date.now().toString(36)}`, place: draft.place, spotId: draft.spotId, date, time, people, status: "en_attente", code: c });
      track({ placeKey: draft.spotId ? `spot:${draft.spotId}` : `nom:${draft.place.toLowerCase()}`, place: draft.place, city: spot?.city ?? "paris", action: "reserver" });
      setCode(c);
      setState("sent");
      return;
    }
    try {
      const { id, code } = await requestBooking({ place: draft.place, spotId: draft.spotId, date, time, people, name: name.trim(), phone: phone.trim(), note: note.trim(), city: spot?.city ?? "paris", address: spot?.address ?? "", kind: "table" });
      addBooking({ id, place: draft.place, spotId: draft.spotId, date, time, people, status: "en_attente", code });
      setCode(code);
      setState("sent");
    } catch (e) {
      log("resa:error", e);
      setState("error");
    }
  };

  const when = new Date(`${date}T${time}`).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

  if (state === "sent" && call) {
    const o = result?.outcome ?? "en_cours";
    const done = o !== "en_cours";
    const ok = o === "confirmee" || o === "alternative";
    const at = call.scheduledFor ? new Date(call.scheduledFor).toLocaleString("fr-FR", { weekday: "long", hour: "2-digit", minute: "2-digit" }) : "";
    return (
      <div className={`booking-card ${done ? (ok ? "sent" : "failed") : "calling"}`}>
        <p className="booking-title">
          <Icon name={done ? (ok ? "check" : "close") : "phone"} size={16} />
          {!done
            ? call.scheduledFor
              ? `Marco appellera ${draft.place} ${at}`
              : result?.stage === "in-progress"
                ? `Marco est au téléphone avec ${draft.place}…`
                : `Marco appelle ${draft.place}…`
            : ok
              ? "Table réservée !"
              : o === "complet"
                ? "C'est complet"
                : "Réservation non faite"}
        </p>
        <p className="small">{draft.place} · {when} à {result?.time || time} · {people} pers.</p>
        {done && result?.summary && <p className="small muted">{result.summary}</p>}
        {!done && <p className="tiny muted">{call.scheduledFor ? "Les restaurants ne sont appelés qu'entre 10 h et 22 h." : "Ça prend en général une à trois minutes. Tu peux quitter cet écran : le résultat arrive dans ton profil."}</p>}
        {done && !ok && <a className="link small" href={direct} target="_blank" rel="noreferrer">Réserver moi-même sur le site du restaurant ›</a>}
        <Link to="/profil" className="link tiny">Voir mes réservations ›</Link>
      </div>
    );
  }

  if (state === "sent")
    return (
      <div className="booking-card sent">
        <p className="booking-title"><Icon name="check" size={16} /> {online ? "Demande envoyée à l'équipe Marco" : "Ta réservation Marco est prête"}</p>
        <p className="small">{draft.place} · {when} à {time} · {people} pers.</p>
        {code && <p className="voucher">Ton code Marco : <strong>{code}</strong><span className="tiny">Montre-le en arrivant</span></p>}
        {!online && serverAuto === null && (
          <>
            {cloud.teamPhone ? (
              <>
                <p className="tiny muted">Dernière étape : envoie ta demande à l'équipe Marco, elle réserve pour toi.</p>
                <a className="btn btn-primary btn-block" target="_blank" rel="noreferrer" href={whatsappLink(cloud.teamPhone, requestMessage({ place: draft.place, address: spot?.address, date, time, people, name: name.trim(), phone: phone.trim(), note: note.trim(), code }))}>Envoyer ma demande à Marco (WhatsApp)</a>
                <a className="link small" href={withUtm(direct)} target="_blank" rel="noreferrer">Ou réserver moi-même sur le site du lieu ›</a>
              </>
            ) : (
              <>
                <p className="tiny muted">Dernière étape : réserve sur le site du lieu (ou appelle-le) et donne ton code Marco.</p>
                <a className="btn btn-primary btn-block" href={withUtm(direct)} target="_blank" rel="noreferrer">Finaliser sur le site du lieu</a>
              </>
            )}
          </>
        )}
        {serverAuto !== null && <p className="tiny muted">{serverAuto ? "Marco appelle le lieu pour toi" : "L'équipe Marco réserve pour toi"} : tu reçois un SMS dès que c'est confirmé.</p>}
        {online && serverAuto === null && <p className="tiny muted">On réserve pour toi et tu reçois la confirmation ici et dans <Link to="/profil" className="link">Profil › Mes réservations</Link>.</p>}
      </div>
    );

  return (
    <div className="booking-card">
      <p className="booking-title"><Icon name="calendar" size={16} /> Réserver {draft.place}</p>
      {canAsk ? (
        <>
          <div className="booking-grid">
            <label>Jour<input type="date" value={date} min={today()} onChange={(e) => setDate(e.target.value)} /></label>
            <label>Heure<input type="time" value={time} onChange={(e) => setTime(e.target.value)} /></label>
            <label>Personnes<input type="number" min={1} max={20} value={people} onChange={(e) => setPeople(Math.max(1, Math.min(20, +e.target.value || 1)))} /></label>
          </div>
          <label>Nom de la réservation<input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>
          <label>Téléphone (pour la confirmation du restaurant)<input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="06 12 34 56 78" /></label>
          <label>Précisions (facultatif)<input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Terrasse, anniversaire, poussette…" /></label>
          <button className="btn btn-primary btn-block" disabled={!valid || state === "sending"} onClick={submit}>
            {state === "sending" ? "Envoi…" : voice ? "Confirmer, Marco appelle le restaurant" : online ? "Confirmer, Marco s'en occupe" : "Confirmer et recevoir mon code Marco"}
          </button>
          {state === "error" && <p className="tiny error-text">{voice ? "Marco n'a pas pu lancer l'appel (numéro du restaurant introuvable ou appel déjà fait). Réserve directement ci-dessous." : "La demande n'est pas partie. Réessaie, ou réserve directement ci-dessous."}</p>}
          <p className="tiny muted">
            {voice
              ? "L'assistant vocal de Marco appelle le restaurant en se présentant comme tel. Ton nom et ton téléphone ne sont donnés qu'au restaurant, s'il les demande."
              : "Tu reçois un SMS dès que le lieu a répondu. Ton nom et ton téléphone servent uniquement à cette réservation et ne sont vus que par l'équipe Marco qui la traite."}
          </p>
        </>
      ) : (
        <p className="small">Dans cette version, la réservation par l'équipe Marco n'est pas encore disponible pour ton compte : réserve directement auprès du restaurant.</p>
      )}
      <a className="link small" href={direct} target="_blank" rel="noreferrer">Ou réserver moi-même sur le site du restaurant ›</a>
    </div>
  );
}
