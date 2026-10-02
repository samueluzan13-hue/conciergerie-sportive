import { useState } from "react";
import { createPortal } from "react-dom";
import { newCode, requestBooking, track, useCloud } from "../lib/cloud";
import { log } from "../lib/diag";
import { withUtm } from "../lib/partners";
import { addBooking, useStore } from "../lib/store";
import { Icon } from "./Icon";
import { Link } from "./Nav";

export interface ReserveTarget {
  place: string;
  /** clé stable du lieu (statistiques partenaires) */
  placeKey: string;
  city: string;
  address?: string;
  spotId?: string;
  /** table, activité ou chambre */
  kind: "table" | "activite" | "hotel";
  website?: string;
  phone?: string;
}

const today = () => new Date().toISOString().slice(0, 10);
const plusDays = (d: string, n: number) => new Date(new Date(d).getTime() + n * 86400000).toISOString().slice(0, 10);

/** « Réserver avec Marco » : partout dans l'app, pour n'importe quel lieu. Chaque réservation reçoit un code client Marco. */
export function ReserveButton({ target, className = "btn-mini primary", label }: { target: ReserveTarget; className?: string; label?: string }) {
  const [open, setOpen] = useState(false);
  const host = typeof document !== "undefined" ? document.querySelector(".device") : null;
  return (
    <>
      <button
        className={className}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        <Icon name={target.kind === "hotel" ? "bed" : "calendar"} size={14} /> {label ?? "Réserver avec Marco"}
      </button>
      {open && host && createPortal(<ReserveSheet target={target} onClose={() => setOpen(false)} />, host)}
    </>
  );
}

function ReserveSheet({ target: t, onClose }: { target: ReserveTarget; onClose: () => void }) {
  const profileName = useStore((s) => s.profile.name);
  const cloud = useCloud();
  const hotel = t.kind === "hotel";
  const [date, setDate] = useState(hotel ? plusDays(today(), 7) : today());
  const [checkout, setCheckout] = useState(plusDays(today(), 9));
  const [time, setTime] = useState(t.kind === "activite" ? "15:00" : "20:00");
  const [people, setPeople] = useState(2);
  const [name, setName] = useState(profileName);
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [state, setState] = useState<"form" | "sending" | "sent">("form");
  const [code, setCode] = useState("");
  const [online, setOnline] = useState(true);
  const valid = name.trim().length > 1 && /\d{6,}/.test(phone.replace(/\D/g, "")) && date >= today() && (hotel ? checkout > date : /^\d{2}:\d{2}$/.test(time));

  const submit = async () => {
    if (!valid) return;
    setState("sending");
    const base = {
      place: t.place, spotId: t.spotId, date, time: hotel ? "15:00" : time, people, name: name.trim(), phone: phone.trim(),
      note: [hotel ? `Séjour du ${date} au ${checkout}` : "", note.trim()].filter(Boolean).join(" · "),
      placeKey: t.placeKey, city: t.city, kind: t.kind, address: t.address ?? "", checkout: hotel ? checkout : "",
    };
    let id = `l${Date.now().toString(36)}`;
    let c = newCode();
    try {
      if (!cloud.db || !cloud.userId || !cloud.canWrite) throw new Error("hors ligne");
      ({ id, code: c } = await requestBooking({ ...base, code: c }));
    } catch (e) {
      // sans base (version partagée hors compte) : le code reste valable, le client réserve lui-même en le donnant
      log("resa:locale", String(e));
      setOnline(false);
      track({ placeKey: t.placeKey, place: t.place, city: t.city, action: "reserver" });
    }
    addBooking({ id, place: t.place, spotId: t.spotId, date, time: base.time, people, status: "en_attente", code: c, checkout: base.checkout || undefined });
    setCode(c);
    setState("sent");
  };

  const when = new Date(`${date}T12:00`).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet reserve-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={`Réserver ${t.place}`}>
        <div className="sheet-handle" />
        {state === "sent" ? (
          <>
            <p className="eyebrow">{online ? "Demande envoyée" : "Ta réservation Marco"}</p>
            <h2 className="serif">{t.place}</h2>
            <p className="small">{hotel ? `Du ${when} au ${new Date(`${checkout}T12:00`).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}` : `${when} à ${time}`} · {people} pers.</p>
            <div className="voucher big">
              <span className="tiny">Ton code Marco</span>
              <strong>{code}</strong>
              <span className="tiny">Montre-le en arrivant{hotel ? " à la réception" : ""} : c'est lui qui prouve que tu viens de la part de Marco.</span>
            </div>
            {online ? (
              <p className="small muted">L'équipe Marco réserve pour toi et te confirme ici et dans <Link to="/profil" className="link">Profil › Mes réservations</Link>.</p>
            ) : (
              <>
                <p className="small muted">Termine en un geste : appelle ou réserve sur le site, et donne ton code Marco.</p>
                <div className="place-actions">
                  {t.phone && <a className="btn-mini primary" href={`tel:${t.phone.replace(/[^\d+]/g, "")}`} onClick={() => track({ placeKey: t.placeKey, place: t.place, city: t.city, action: "appel" })}><Icon name="phone" size={14} /> Appeler</a>}
                  {t.website && <a className="btn-mini" href={withUtm(t.website)} target="_blank" rel="noreferrer" onClick={() => track({ placeKey: t.placeKey, place: t.place, city: t.city, action: "site" })}>Site officiel</a>}
                </div>
              </>
            )}
            <button className="btn btn-primary btn-block" onClick={onClose}>C'est noté</button>
          </>
        ) : (
          <>
            <p className="eyebrow">Réserver avec Marco</p>
            <h2 className="serif">{t.place}</h2>
            {t.address && <p className="small muted">{t.address}</p>}
            <div className="booking-grid">
              {hotel ? (
                <>
                  <label>Arrivée<input type="date" value={date} min={today()} onChange={(e) => { setDate(e.target.value); if (e.target.value >= checkout) setCheckout(plusDays(e.target.value, 1)); }} /></label>
                  <label>Départ<input type="date" value={checkout} min={plusDays(date, 1)} onChange={(e) => setCheckout(e.target.value)} /></label>
                </>
              ) : (
                <>
                  <label>Jour<input type="date" value={date} min={today()} onChange={(e) => setDate(e.target.value)} /></label>
                  <label>Heure<input type="time" value={time} onChange={(e) => setTime(e.target.value)} /></label>
                </>
              )}
              <label>{hotel ? "Voyageurs" : "Personnes"}<input type="number" min={1} max={20} value={people} onChange={(e) => setPeople(Math.max(1, Math.min(20, +e.target.value || 1)))} /></label>
            </div>
            <label className="field-plain">Nom de la réservation<input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>
            <label className="field-plain">Téléphone<input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="06 12 34 56 78" /></label>
            <label className="field-plain">Précisions (facultatif)<input value={note} onChange={(e) => setNote(e.target.value)} placeholder={hotel ? "Lit double, arrivée tardive…" : "Terrasse, anniversaire, poussette…"} /></label>
            <button className="btn btn-primary btn-block" disabled={!valid || state === "sending"} onClick={submit}>
              {state === "sending" ? "Envoi…" : "Confirmer, Marco s'en occupe"}
            </button>
            <p className="tiny muted">Tu reçois un code Marco à montrer en arrivant. Rien à payer ici.</p>
          </>
        )}
      </div>
    </div>
  );
}
