import { CATEGORY_LABEL, type Spot } from "../data/spots";
import { toggleSaved, useStore } from "../lib/store";
import { Icon } from "./Icon";
import { SpotArt } from "./SpotArt";
import { useSpotSheet } from "./SpotSheet";

export function Price({ level }: { level: number }) {
  return (
    <span className="price">
      {"€€€".split("").map((e, i) => (
        <span key={i} className={i < level ? "on" : ""}>{e}</span>
      ))}
    </span>
  );
}

export function HiddenBadge({ level }: { level: number }) {
  if (level < 3) return null;
  return <span className="badge-hidden">Pépite cachée</span>;
}

export function SaveButton({ id }: { id: string }) {
  const saved = useStore((s) => s.saved.includes(id));
  return (
    <button
      className={`save-btn ${saved ? "on" : ""}`}
      aria-label={saved ? "Retirer des enregistrements" : "Enregistrer"}
      onClick={(e) => {
        e.stopPropagation();
        toggleSaved(id);
      }}
    >
      <Icon name="heart" size={18} filled={saved} />
    </button>
  );
}

export function SpotCard({ spot }: { spot: Spot }) {
  const open = useSpotSheet();
  return (
    <article className="spot-card" onClick={() => open(spot.id)}>
      <div className="spot-card-art">
        <SpotArt spot={spot} height={112} rounded={16} />
        <span className="chip-cat">{CATEGORY_LABEL[spot.category]}</span>
        <SaveButton id={spot.id} />
      </div>
      <h3>{spot.name}</h3>
      <p className="muted small">{spot.quartier}</p>
      <div className="row-between small">
        <Price level={spot.price} />
        <HiddenBadge level={spot.hidden} />
      </div>
    </article>
  );
}

export function SpotRow({ spot, meta }: { spot: Spot; meta?: string }) {
  const open = useSpotSheet();
  return (
    <article className="spot-row" onClick={() => open(spot.id)}>
      <div className="spot-row-art">
        <SpotArt spot={spot} height={64} rounded={14} />
      </div>
      <div className="grow">
        <h3>{spot.name}</h3>
        <p className="muted small">{meta ?? `${spot.quartier} · ${CATEGORY_LABEL[spot.category]}`}</p>
        <p className="small clamp-1">{spot.pitch}</p>
      </div>
      <SaveButton id={spot.id} />
    </article>
  );
}
