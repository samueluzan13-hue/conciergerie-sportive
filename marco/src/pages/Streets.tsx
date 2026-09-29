import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Icon } from "../components/Icon";
import { Markdown } from "../components/Markdown";
import { MarcoLogo } from "../components/MarcoLogo";
import { SpotRow } from "../components/SpotCard";
import { spotById } from "../data/spots";
import { findStreet, STREETS, suggestStreets, type StreetStory } from "../data/streets";
import { askMarco } from "../lib/ai";
import { markStreetRead } from "../lib/store";

function StoryView({ s }: { s: StreetStory }) {
  return (
    <article className="story-view">
      <p className="eyebrow">{s.arrondissement} arrondissement</p>
      <h2 className="serif story-title">{s.name}</h2>

      <div className="story-block">
        <span className="story-label"><Icon name="book" size={16} /> L'histoire</span>
        <p>{s.histoire}</p>
      </div>
      <div className="story-block fact">
        <span className="story-year serif">{s.fait.annee}</span>
        <span className="story-label">Le fait historique</span>
        <p>{s.fait.texte}</p>
      </div>
      <div className="story-block anecdote">
        <div className="anecdote-head">
          <MarcoLogo size={34} />
          <span className="story-label">L'anecdote de Marco</span>
        </div>
        <p>{s.anecdote}</p>
      </div>
      {s.aVoir?.length ? (
        <>
          <h3 className="serif" style={{ marginTop: 22 }}>À deux pas</h3>
          <div className="stack">
            {s.aVoir.map((id) => spotById(id)).filter(Boolean).map((sp) => <SpotRow key={sp!.id} spot={sp!} />)}
          </div>
        </>
      ) : null}
    </article>
  );
}

export function Streets() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const q = params.get("q") ?? "";
  const [input, setInput] = useState(q);
  const [aiStory, setAiStory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const found = q ? findStreet(q) : undefined;

  useEffect(() => {
    setInput(q);
    setAiStory(null);
    if (found) markStreetRead(found.id);
    if (!q || found) return;
    let cancelled = false;
    setLoading(true);
    askMarco([
      {
        role: "user",
        content: `Raconte-moi l'histoire de "${q}" à Paris, avec L'histoire, Le fait historique (daté) et L'anecdote. Si ce n'est pas une rue parisienne que tu connais, dis-le honnêtement.`,
      },
    ]).then((r) => {
      if (cancelled) return;
      setAiStory(r ?? "");
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [q]); // eslint-disable-line react-hooks/exhaustive-deps

  const suggestions = input && input !== q ? suggestStreets(input) : [];

  return (
    <div className="page">
      <button className="back" onClick={() => navigate(-1)} aria-label="Retour"><Icon name="arrowLeft" size={20} /></button>
      <h1 className="serif page-title">Raconte-moi une rue</h1>
      <p className="muted section-sub">Chaque rue a une histoire, un fait marquant et un potin. Marco te dit tout.</p>

      <form
        className="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) setParams({ q: input.trim() });
        }}
      >
        <Icon name="search" size={18} />
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Nom d'une rue de Paris" aria-label="Nom de rue" />
        <button className="icon-plain" aria-label="Raconter"><Icon name="arrowRight" size={18} /></button>
      </form>
      {suggestions.length > 0 && (
        <div className="suggestions">
          {suggestions.map((s) => (
            <button key={s.id} onClick={() => setParams({ q: s.name })}>{s.name} <span className="muted tiny">{s.arrondissement}</span></button>
          ))}
        </div>
      )}

      {found && <StoryView s={found} />}

      {q && !found && (
        <div className="story-view">
          {loading ? (
            <div className="thinking"><MarcoLogo size={36} mood="happy" /><span>Marco fouille dans les archives…</span></div>
          ) : aiStory ? (
            <div className="bubble-ai"><Markdown text={aiStory} /></div>
          ) : (
            <div className="empty">
              <p className="serif">Je n'ai pas encore la fiche de « {q} » dans ma mémoire hors-ligne.</p>
              <p className="muted small">Active l'IA de Marco (clé API côté serveur) pour qu'il raconte n'importe quelle rue de Paris. En attendant, choisis-en une ci-dessous.</p>
            </div>
          )}
        </div>
      )}

      {!q && (
        <>
          <h3 className="serif" style={{ marginTop: 18 }}>Les rues déjà racontées</h3>
          <div className="street-list">
            {STREETS.map((s) => (
              <button key={s.id} className="street-item" onClick={() => setParams({ q: s.name })}>
                <span>
                  <strong>{s.name}</strong>
                  <span className="muted tiny"> · {s.arrondissement}</span>
                </span>
                <span className="year-pill">{s.fait.annee}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
