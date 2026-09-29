import type { Spot } from "../data/spots";

const THEMES: Record<Spot["category"], [string, string, string]> = {
  resto: ["#F08A4B", "#C4502D", "#FFD9B8"],
  bar: ["#4A2E55", "#8A3F5E", "#F7C59F"],
  cafe: ["#D19A66", "#8E5B3A", "#FBE3C4"],
  culture: ["#8A3434", "#C9663F", "#F6D3B3"],
  nature: ["#6F8F5B", "#AFC27E", "#F2F0D0"],
  insolite: ["#2F5D62", "#6FA08F", "#DCEFE4"],
};

const EMBLEM: Record<Spot["category"], string> = {
  resto: "M30 62c0-11 9-20 20-20s20 9 20 20zM26 66h48M50 38v4",
  bar: "M36 34h28L50 54zM50 54v14M42 68h16",
  cafe: "M34 44h26v12a13 13 0 0 1-26 0zM60 48h4a5 5 0 0 1 0 10h-5M42 32c0 3 3 3 3 6M50 32c0 3 3 3 3 6",
  culture: "M30 46l20-12 20 12zM34 48v18M44 48v18M56 48v18M66 48v18M28 70h44",
  nature: "M50 70V46M50 52c-10 0-16-7-16-16 10 0 16 7 16 16zM50 58c10 0 16-7 16-16-10 0-16 7-16 16z",
  insolite: "M50 32l4 12h12l-10 7 4 12-10-7-10 7 4-12-10-7h12z",
};

/** Illustration générée pour chaque lieu (pas de dépendance à des photos externes). */
export function SpotArt({ spot, height = 120, rounded = 18 }: { spot: Spot; height?: number; rounded?: number }) {
  const [a, b, c] = THEMES[spot.category];
  const gid = `g-${spot.id}`;
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height, display: "block", borderRadius: rounded }} aria-hidden="true">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#${gid})`} />
      {/* fenêtres parisiennes en arche */}
      <g fill={c} opacity="0.13">
        <path d="M-6 100V40a16 16 0 0 1 32 0v60z" />
        <path d="M78 100V30a16 16 0 0 1 32 0v70z" />
      </g>
      <circle cx="82" cy="18" r="10" fill={c} opacity="0.25" />
      <path d={EMBLEM[spot.category]} fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
    </svg>
  );
}
