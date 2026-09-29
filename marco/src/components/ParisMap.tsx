import { useRef, useState, type PointerEvent as RPointerEvent } from "react";
import type { Spot } from "../data/spots";
import type { StreetStory } from "../data/streets";
import { Icon } from "./Icon";

// Carte de Paris dessinée (aucune tuile externe) : projection simple lat/lng -> plan.
const LNG0 = 2.245, LNG1 = 2.425, LAT0 = 48.908, LAT1 = 48.81;
const W = 1000;
const K = Math.cos((48.86 * Math.PI) / 180);
const H = Math.round((W * (LAT0 - LAT1)) / ((LNG1 - LNG0) * K));

export const project = (lat: number, lng: number) => ({
  x: ((lng - LNG0) / (LNG1 - LNG0)) * W,
  y: ((LAT0 - lat) / (LAT0 - LAT1)) * H,
});

const path = (pts: [number, number][], close = false) =>
  pts.map(([la, ln], i) => {
    const p = project(la, ln);
    return `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  }).join(" ") + (close ? "Z" : "");

const PERIPH: [number, number][] = [
  [48.901, 2.37], [48.899, 2.389], [48.888, 2.399], [48.878, 2.41], [48.862, 2.414], [48.846, 2.414], [48.834, 2.411],
  [48.827, 2.396], [48.82, 2.374], [48.817, 2.356], [48.816, 2.34], [48.82, 2.313], [48.827, 2.292], [48.835, 2.277],
  [48.844, 2.264], [48.856, 2.256], [48.87, 2.259], [48.878, 2.28], [48.885, 2.293], [48.896, 2.315], [48.901, 2.335],
];
const SEINE: [number, number][] = [
  [48.8265, 2.415], [48.833, 2.39], [48.8395, 2.376], [48.845, 2.366], [48.849, 2.36], [48.852, 2.354], [48.8535, 2.348],
  [48.8565, 2.342], [48.8585, 2.335], [48.862, 2.325], [48.864, 2.312], [48.8635, 2.301], [48.859, 2.292], [48.854, 2.285],
  [48.847, 2.278], [48.8395, 2.269], [48.834, 2.258],
];
const CANAL: [number, number][] = [[48.8858, 2.3702], [48.8784, 2.3703], [48.8716, 2.3653], [48.8648, 2.3667], [48.8572, 2.3683], [48.8502, 2.3661]];
const LANDMARKS: { name: string; lat: number; lng: number }[] = [
  { name: "Tour Eiffel", lat: 48.8584, lng: 2.2945 },
  { name: "Arc de Triomphe", lat: 48.8738, lng: 2.295 },
  { name: "Louvre", lat: 48.8606, lng: 2.3376 },
  { name: "Notre-Dame", lat: 48.853, lng: 2.3499 },
  { name: "Sacré-Cœur", lat: 48.8867, lng: 2.3431 },
  { name: "Bastille", lat: 48.8532, lng: 2.3691 },
  { name: "Panthéon", lat: 48.8462, lng: 2.3464 },
  { name: "Montparnasse", lat: 48.8421, lng: 2.3219 },
];
const PARKS: { lat: number; lng: number; r: number }[] = [
  { lat: 48.8462, lng: 2.3372, r: 16 }, // Luxembourg
  { lat: 48.8635, lng: 2.3275, r: 14 }, // Tuileries
  { lat: 48.8799, lng: 2.3828, r: 15 }, // Buttes-Chaumont
  { lat: 48.8794, lng: 2.3088, r: 11 }, // Monceau
  { lat: 48.8558, lng: 2.2983, r: 15 }, // Champ-de-Mars
  { lat: 48.8440, lng: 2.3590, r: 14 }, // Jardin des Plantes
  { lat: 48.8210, lng: 2.3380, r: 14 }, // Montsouris
];

export const CAT_COLOR: Record<Spot["category"], string> = {
  resto: "var(--c-resto)", bar: "var(--c-bar)", cafe: "var(--c-cafe)",
  culture: "var(--c-culture)", nature: "var(--c-nature)", insolite: "var(--c-insolite)", activite: "var(--c-activite)",
};

interface Props {
  spots: Spot[];
  streets?: StreetStory[];
  selected?: string | null;
  onSpot?: (id: string) => void;
  onStreet?: (s: StreetStory) => void;
  home?: { lat: number; lng: number } | null;
}

export function ParisMap({ spots, streets, selected, onSpot, onStreet, home }: Props) {
  const [vb, setVb] = useState(() => {
    const c = project(48.861, 2.347); // centre : Châtelet
    const w = 620, h = w * (H / W);
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
        aria-label="Carte de Paris avec les adresses Marco"
      >
        <rect x={-500} y={-500} width={W + 1000} height={H + 1000} fill="var(--map-out)" />
        <path d={path(PERIPH, true)} fill="var(--map-land)" stroke="var(--map-road)" strokeWidth={5} strokeLinejoin="round" />
        {PARKS.map((p, i) => {
          const c = project(p.lat, p.lng);
          return <circle key={i} cx={c.x} cy={c.y} r={p.r} fill="var(--map-park)" />;
        })}
        <path d={path(SEINE)} fill="none" stroke="var(--map-water)" strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" />
        <path d={path(CANAL)} fill="none" stroke="var(--map-water)" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        {LANDMARKS.map((l) => {
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
      <span className="map-hint tiny"><Icon name="pin" size={12} /> Glisse pour te déplacer, pince pour zoomer</span>
    </div>
  );
}
