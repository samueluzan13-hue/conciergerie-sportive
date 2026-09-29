import { Fragment, type ReactNode } from "react";
import { spotById } from "../data/spots";
import { useSpotSheet } from "./SpotSheet";

function SpotChip({ id }: { id: string }) {
  const open = useSpotSheet();
  const spot = spotById(id);
  if (!spot) return null;
  return (
    <button className="spot-chip" onClick={() => open(id)}>
      {spot.name} <span aria-hidden>›</span>
    </button>
  );
}

function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\[\[spot:([a-z0-9-]+)\]\]|\*\*(.+?)\*\*|_(.+?)_/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(<SpotChip key={k++} id={m[1]} />);
    else if (m[2]) out.push(<strong key={k++}>{m[2]}</strong>);
    else if (m[3]) out.push(<em key={k++}>{m[3]}</em>);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** Mini rendu Markdown pour les réponses de Marco (titres, gras, listes, fiches lieux). */
export function Markdown({ text }: { text: string }) {
  const blocks = text.trim().split(/\n{2,}/);
  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        if (lines.every((l) => /^\s*([-*]|\d+\.)\s+/.test(l))) {
          return (
            <ul key={i} className="md-list">
              {lines.map((l, j) => (
                <li key={j}>{inline(l.replace(/^\s*([-*]|\d+\.)\s+/, ""))}</li>
              ))}
            </ul>
          );
        }
        return (
          <Fragment key={i}>
            {lines.map((l, j) => {
              const h = l.match(/^#{1,4}\s+(.*)/);
              if (h) return <h4 key={j} className="md-h serif">{inline(h[1])}</h4>;
              if (/^\s*[-*]\s+/.test(l)) return <p key={j} className="md-li">• {inline(l.replace(/^\s*[-*]\s+/, ""))}</p>;
              return l.trim() ? <p key={j}>{inline(l)}</p> : null;
            })}
          </Fragment>
        );
      })}
    </>
  );
}
