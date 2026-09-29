import { useState } from "react";
import { spotById } from "../data/spots";
import { requestBooking, useCloud } from "../lib/cloud";
import { log } from "../lib/diag";
import type { BookingDraft } from "../lib/meta";
import { duckyUrl, reserveUrl } from "../lib/reservation";
import { addBooking, useStore } from "../lib/store";
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
  const spot = draft.spotId ? spotById(draft.spotId) : undefined;
  const direct = spot ? reserveUrl(spot) : duckyUrl(draft.place);
  const valid = name.trim().length > 1 && /\d{6,}/.test(phone.replace(/\D/g, "")) && date >= today() && /^\d{2}:\d{2}$/.test(time);
  const canAsk = cloud.db && !!cloud.userId && cloud.canWrite;

  const submit = async () => {
    if (!valid) return;
    setState("sending");
    try {
      const id = await requestBooking({ place: draft.place, spotId: draft.spotId, date, time, people, name: name.trim(), phone: phone.trim(), note: note.trim() });
      addBooking({ id, place: draft.place, spotId: draft.spotId, date, time, people, status: "en_attente" });
      setState("sent");
    } catch (e) {
      log("resa:error", e);
      setState("error");
    }
  };

  const when = new Date(`${date}T${time}`).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

  if (state === "sent")
    return (
      <div className="booking-card sent">
        <p className="booking-title"><Icon name="check" size={16} /> Demande envoyée à l'équipe Marco</p>
        <p className="small">{draft.place} · {when} à {time} · {people} pers.</p>
        <p className="tiny muted">On réserve pour toi et tu reçois la confirmation ici et dans <Link to="/profil" className="link">Profil › Mes réservations</Link>.</p>
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
            {state === "sending" ? "Envoi…" : "Confirmer, Marco s'en occupe"}
          </button>
          {state === "error" && <p className="tiny error-text">La demande n'est pas partie. Réessaie, ou réserve directement ci-dessous.</p>}
          <p className="tiny muted">Ton nom et ton téléphone servent uniquement à cette réservation et sont visibles par l'équipe Marco qui la traite.</p>
        </>
      ) : (
        <p className="small">Dans cette version, la réservation par l'équipe Marco n'est pas encore disponible pour ton compte : réserve directement auprès du restaurant.</p>
      )}
      <a className="link small" href={direct} target="_blank" rel="noreferrer">Ou réserver moi-même sur le site du restaurant ›</a>
    </div>
  );
}
