import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../components/Icon";
import { MarcoLogo } from "../components/MarcoLogo";
import { NIGHT, NIGHT_NOTE } from "../data/guides";
import { QUARTIERS, SPOTS } from "../data/spots";
import { distanceKm } from "../lib/geo";
import { useStore } from "../lib/store";

const label = (n: number) => (n === 1 ? "1er" : `${n}e`);

/** Arrondissement le plus proche du quartier de l'utilisateur. */
function homeArr(quartier: string) {
  const q = QUARTIERS.find((x) => x.name === quartier);
  if (!q) return 11;
  const nearest = [...SPOTS].sort((a, b) => distanceKm(q, a) - distanceKm(q, b))[0];
  return nearest?.arrondissement ?? 11;
}

export function Nights() {
  const navigate = useNavigate();
  const quartier = useStore((s) => s.profile.quartier);
  const [arr, setArr] = useState(() => homeArr(quartier));
  const guide = useMemo(() => NIGHT.find((n) => n.arr === arr), [arr]);

  return (
    <div className="page">
      <button className="back" onClick={() => navigate(-1)} aria-label="Retour"><Icon name="arrowLeft" size={20} /></button>
      <div>
        <h1 className="serif page-title">Sortir ce soir</h1>
        <p className="muted small">L'ambiance de la nuit et les bons lieux, arrondissement par arrondissement.</p>
      </div>

      <div className="arr-grid" role="tablist" aria-label="Arrondissement">
        {NIGHT.map((n) => (
          <button key={n.arr} role="tab" aria-selected={arr === n.arr} className={`arr-btn ${arr === n.arr ? "on" : ""}`} onClick={() => setArr(n.arr)}>
            {label(n.arr)}
          </button>
        ))}
      </div>

      {guide && (
        <>
          <section className="night-hero">
            <span className="eyebrow light">Le {label(guide.arr)} la nuit</span>
            <p className="serif">{guide.vibe}</p>
          </section>

          <div className="stack">
            {guide.venues.map((v) => (
              <article key={v.name} className="night-card">
                <div className="row-between">
                  <h3>{v.name}</h3>
                  <span className="tag">{v.kind}</span>
                </div>
                <p className="small muted">{v.address}, Paris {label(guide.arr)}</p>
                <p className="small">{v.tip}</p>
                <div className="row gap-8 night-actions">
                  <a className="btn-mini primary" href={`https://www.google.com/search?q=${encodeURIComponent(`${v.name} Paris programme`)}`} target="_blank" rel="noreferrer">
                    <Icon name="calendar" size={14} /> Programme
                  </a>
                  <a className="btn-mini" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${v.name}, ${v.address}, Paris`)}`} target="_blank" rel="noreferrer">
                    <Icon name="pin" size={14} /> Y aller
                  </a>
                </div>
              </article>
            ))}
          </div>
          <p className="tiny muted">{NIGHT_NOTE}</p>
        </>
      )}

      <button className="marco-card" onClick={() => navigate(`/marco?q=${encodeURIComponent(`Qu'est-ce que je peux faire ce soir dans le ${label(arr)} ?`)}`)}>
        <MarcoLogo size={48} />
        <span className="speech">
          <span className="serif">Demande à Marco un plan pour ce soir</span>
          <span className="small">Un apéro, un dîner, puis où finir la soirée dans le {label(arr)}.</span>
        </span>
      </button>
    </div>
  );
}

