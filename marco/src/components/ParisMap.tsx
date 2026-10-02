import { useRef, useState, type PointerEvent as RPointerEvent } from "react";
import type { Spot } from "../data/spots";
import type { StreetStory } from "../data/streets";
import { cityById, type CityGeo, type CityId } from "../data/cities";
import { Icon } from "./Icon";

// Plan de ville dessiné (aucune tuile externe) : projection simple lat/lng -> plan, d'après le cadre de chaque ville.
const W = 1000;

function projector(geo: CityGeo) {
  const { w, e, n, s } = geo.bounds;
  const K = Math.cos((((n + s) / 2) * Math.PI) / 180);
  const H = Math.round((W * (n - s)) / ((e - w) * K));
  const project = (lat: number, lng: number) => ({ x: ((lng - w) / (e - w)) * W, y: ((n - lat) / (n - s)) * H });
  const path = (pts: [number, number][], close = false) =>
    pts.map(([la, ln], i) => {
      const p = project(la, ln);
      return `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    }).join(" ") + (close ? "Z" : "");
  return { H, project, path };
}

export const CAT_COLOR: Record<Spot["category"], string> = {
  resto: "var(--c-resto)", bar: "var(--c-bar)", cafe: "var(--c-cafe)",
  culture: "var(--c-culture)", nature: "var(--c-nature)", insolite: "var(--c-insolite)", activite: "var(--c-activite)", hotel: "var(--c-hotel)",
};

interface Props {
  spots: Spot[];
  streets?: StreetStory[];
  selected?: string | null;
  onSpot?: (id: string) => void;
  onStreet?: (s: StreetStory) => void;
  home?: { lat: number; lng: number } | null;
  city?: CityId;
}

export function CityMap({ spots, streets, selected, onSpot, onStreet, home, city = "paris" }: Props) {
  const c0 = cityById(city);
  const geo = c0.geo;
  const { H, project, path } = projector(geo);
  const [vb, setVb] = useState(() => {
    const c = project(geo.start[0], geo.start[1]);
    const w = geo.startWidth, h = w * (H / W);
    return { x: c.x - w / 2, y: c.y - h / 2, w, h };
  });
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{ id: number; x: number; y: number; moved: boolean } | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<number | null>(null);

  const zoom = (factor: number, cx = vb.x + vb.w / 2, cy = vb.y + vb.h / 2) =>
    setVb((v) => {
      const w = Math.min(W * 1.1, Math.max(160, v.w * factor));
      const h = w * (H / W);
      return { w, h, x: cx - ((cx - v.x) * w) / v.w, y: cy - ((cy - v.y) * h) / v.h };
    });

  const toUnits = (dx: number) => {
    const r = svgRef.current?.getBoundingClientRect();
    return r ? (dx * vb.w) / r.width : dx;
  };

  const onDown = (e: RPointerEvent) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: false };
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = Math.hypot(a.x - b.x, a.y - b.y);
    }
  };
  const onMove = (e: RPointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      zoom(pinch.current / d);
      pinch.current = d;
      if (drag.current) drag.current.moved = true;
      return;
    }
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x, dy = e.clientY - d.y;
    if (!d.moved && Math.hypot(dx, dy) < 6) return;
    if (!d.moved) svgRef.current?.setPointerCapture(e.pointerId);
    d.moved = true;
    d.x = e.clientX; d.y = e.clientY;
    const ux = toUnits(dx), uy = toUnits(dy);
    setVb((v) => ({ ...v, x: v.x - ux, y: v.y - uy }));
  };
  const onUp = (e: RPointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (pointers.current.size === 0) setTimeout(() => (drag.current = null), 0);
  };
  const tap = (fn: () => void) => () => {
    if (!drag.current?.moved) fn();
  };

  const s = vb.w / 420; // échelle des symboles (taille constante à l'écran)
  return (
    <div className="paris-map">
      <svg
        ref={svgRef}
        viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onWheel={(e) => {
          const r = svgRef.current!.getBoundingClientRect();
          zoom(e.deltaY > 0 ? 1.12 : 0.89, vb.x + ((e.clientX - r.left) / r.width) * vb.w, vb.y + ((e.clientY - r.top) / r.height) * vb.h);
        }}
        role="img"
        aria-label={`Carte de ${c0.name} avec les adresses Marco`}
      >
        <rect x={-500} y={-500} width={W + 1000} height={H + 1000} fill={geo.outline ? "var(--map-out)" : "var(--map-land)"} />
        {geo.outline && <path d={path(geo.outline, true)} fill="var(--map-land)" stroke="var(--map-road)" strokeWidth={5} strokeLinejoin="round" />}
        {geo.parks.map((p, i) => {
          const c = project(p.lat, p.lng);
          return <circle key={i} cx={c.x} cy={c.y} r={p.r} fill="var(--map-park)" />;
        })}
        {geo.water.map((w, i) =>
          w.fill ? (
            <path key={i} d={path(w.pts, true)} fill="var(--map-water)" />
          ) : (
            <path key={i} d={path(w.pts)} fill="none" stroke="var(--map-water)" strokeWidth={w.width ?? 8} strokeLinecap="round" strokeLinejoin="round" />
          ),
        )}
        {geo.landmarks.map((l) => {
          const c = project(l.lat, l.lng);
          return (
            <g key={l.name} className="map-landmark">
              <circle cx={c.x} cy={c.y} r={3.2 * s} fill="var(--map-label)" />
              <text x={c.x + 6 * s} y={c.y + 4 * s} fontSize={12.5 * s}>{l.name}</text>
            </g>
          );
        })}
        {home && (() => {
          const c = project(home.lat, home.lng);
          return <circle cx={c.x} cy={c.y} r={22 * s} fill="var(--orange)" opacity={0.14} />;
        })()}
        {spots.map((sp) => {
          const c = project(sp.lat, sp.lng);
          const on = selected === sp.id;
          const r = (on ? 13 : 9.5) * s;
          return (
            <g key={sp.id} className="map-dot" onClick={tap(() => onSpot?.(sp.id))} role="button" aria-label={sp.name}>
              <circle cx={c.x} cy={c.y} r={r + 3 * s} fill="var(--paper)" />
              <circle cx={c.x} cy={c.y} r={r} fill={CAT_COLOR[sp.category]} />
              {sp.hidden === 3 && <circle cx={c.x} cy={c.y} r={r + 6 * s} fill="none" stroke="var(--orange)" strokeWidth={2 * s} strokeDasharray={`${3 * s} ${3 * s}`} />}
              {on && <text x={c.x} y={c.y - r - 9 * s} fontSize={14 * s} textAnchor="middle" className="map-selected">{sp.name}</text>}
            </g>
          );
        })}
        {streets?.map((st) => {
          const c = project(st.lat, st.lng);
          return (
            <g key={st.id} className="map-dot" onClick={tap(() => onStreet?.(st))} role="button" aria-label={st.name}>
              <rect x={c.x - 9 * s} y={c.y - 9 * s} width={18 * s} height={18 * s} rx={4 * s} fill="var(--ink)" transform={`rotate(45 ${c.x} ${c.y})`} />
              <text x={c.x} y={c.y - 16 * s} fontSize={11 * s} textAnchor="middle" className="map-street-label">{st.name.replace(/^(Rue|Avenue|Boulevard|Place) (de la |des |du |de l'|de )?/, "")}</text>
            </g>
          );
        })}
      </svg>
      <div className="map-zoom">
        <button onClick={() => zoom(0.75)} aria-label="Zoomer">+</button>
        <button onClick={() => zoom(1.33)} aria-label="Dézoomer">−</button>
      </div>
      <span className="map-hint tiny" key={city}><Icon name="pin" size={12} /> Glisse pour te déplacer, pince pour zoomer</span>
    </div>
  );
}

/** Rétrocompatibilité : la carte de Paris. */
export const ParisMap = (p: Omit<Props, "city">) => <CityMap {...p} city="paris" />;
