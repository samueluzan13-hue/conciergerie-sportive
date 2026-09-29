interface Props {
  size?: number;
  mood?: "wink" | "happy";
  className?: string;
  /** version inversée (M crème, visage orange) pour les fonds orange */
  inverted?: boolean;
}

/** La mascotte : un M orange qui fait un clin d'œil. */
export function MarcoLogo({ size = 40, mood = "wink", className, inverted }: Props) {
  const body = inverted ? "var(--cream)" : "var(--orange)";
  const face = inverted ? "var(--orange)" : "var(--cream)";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Marco" role="img">
      <path
        d="M12 84V32C12 18 22 10 33 10C41 10 46 15 50 22C54 15 59 10 67 10C78 10 88 18 88 32V84C88 90 84 93 79 93H67C62 93 59 90 59 85V80C59 76 55 74 50 74C45 74 41 76 41 80V85C41 90 38 93 33 93H21C16 93 12 90 12 84Z"
        fill={body}
      />
      <g stroke={face} strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {mood === "wink" ? (
          <path d="M60 36L71 41L60 46" />
        ) : (
          <path d="M60 42Q66 35 72 42" />
        )}
        <path d="M31 55Q50 71 69 55" />
      </g>
      {mood === "wink" ? <circle cx="35" cy="41" r="6" fill={face} /> : <path d="M29 42Q35 35 41 42" stroke={face} strokeWidth="5.5" strokeLinecap="round" fill="none" />}
    </svg>
  );
}
