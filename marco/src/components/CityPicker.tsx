import { useState } from "react";
import { CITIES } from "../data/cities";
import { setCity, useCity } from "../lib/store";
import { Icon } from "./Icon";

/** Choix de la ville explorée : toute l'app (lieux, carte, soirées, rues, IA) suit ce choix. */
export function CityPicker({ light = false }: { light?: boolean }) {
  const city = useCity();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className={`city-btn ${light ? "light" : ""}`} onClick={() => setOpen(true)} aria-haspopup="dialog">
        <Icon name="pin" size={14} /> {city.name} <span aria-hidden>▾</span>
      </button>
      {open && (
        <div className="city-overlay" role="dialog" aria-label="Choisir une ville" onClick={() => setOpen(false)}>
          <div className="city-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="row-between">
              <h2 className="serif">Où es-tu ?</h2>
              <button className="icon-btn" aria-label="Fermer" onClick={() => setOpen(false)}><Icon name="close" size={18} /></button>
            </div>
            <div className="city-grid">
              {CITIES.map((c) => (
                <button key={c.id} className={`city-tile ${c.id === city.id ? "on" : ""}`} onClick={() => { setCity(c.id); setOpen(false); }}>
                  <strong className="serif">{c.name}</strong>
                  <span className="tiny muted">{c.country}</span>
                </button>
              ))}
            </div>
            <p className="tiny muted">{city.tagline}</p>
          </div>
        </div>
      )}
    </>
  );
}
