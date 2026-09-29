import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Icon } from "../components/Icon";
import { Markdown } from "../components/Markdown";
import { MarcoLogo } from "../components/MarcoLogo";
import { SpotRow } from "../components/SpotCard";
import { SPOTS, spotById } from "../data/spots";
import { STREETS, type StreetStory } from "../data/streets";
import { arrLabel, findVoie, searchVoies, storyFor, VOIES, voiesByArr, type Voie } from "../data/voies";
import { askMarco } from "../lib/ai";
import { getRecit, saveRecit } from "../lib/cloud";
import { log } from "../lib/diag";
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

/** Fiche d'une voie de l'annuaire : infos officielles + récit de Marco (IA). */
function VoieView({ v, query }: { v?: Voie; query: string }) {
  const [story, setStory] = useState<string | null>(null);
  const [state, setState] = useState<"loading" | "done" | "none">("loading");
  const name = v?.n ?? query;

  useEffect(() => {
    let cancelled = false;
    setStory(null);
    setState("loading");
    const ctx = v
      ? `Voie : ${v.n} (${arrLabel(v.a)} arrondissement${v.a.length > 1 ? "s" : ""}).${v.o ? ` Origine officielle du nom : ${v.o}` : ""}${v.h ? ` Historique officiel : ${v.h}` : ""}`
      : `Voie demandée : "${query}" (elle n'est pas dans l'annuaire de l'app ; vérifie qu'elle existe bien à Paris).`;
    log("street:ai", name);
    (async () => {
    // 1. déjà raconté ? (base partagée)
    const cached = v ? await getRecit(v.n) : null;
    if (cancelled) return;
    if (cached) {
      setStory(cached);
      setState("done");
      return;
    }
    // 2. sinon Marco l'écrit, et on le garde pour les suivants
    const r = await askMarco(
      [
        {
          role: "user",
          content: `${ctx}\n\nRaconte-moi cette voie de Paris en trois parties courtes, avec ces titres exacts : "### L'histoire" (origine du nom, évolution), "### Le fait historique" (un événement daté qui s'est produit dans la voie ou tout près, avec l'année en début de paragraphe) et "### L'anecdote" (drôle, dans ton ton). Termine par une ligne "À voir tout près :" avec une ou deux adresses de ta sélection si c'est pertinent. N'invente rien : si tu n'es pas sûr d'un fait, dis-le franchement ou reste général.`,
        },
      ],
      { deep: true, onText: (t) => !cancelled && (setStory(t), setState("loading")) },
    );
    if (cancelled) return;
    setStory(r);
    setState(r ? "done" : "none");
    if (r && v && r.length > 200 && /anecdote/i.test(r)) saveRecit(v.n, r);
    })();
    return () => {
      cancelled = true;
    };
  }, [name]); // eslint-disable-line react-hooks/exhaustive-deps

  const nearby = useMemo(() => (v ? SPOTS.filter((s) => v.a.includes(s.arrondissement)).slice(0, 3) : []), [v]);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, Paris`)}`;

  return (
    <article className="story-view">
      <p className="eyebrow">{v ? `${v.t} · ${arrLabel(v.a)} arrondissement${v.a.length > 1 ? "s" : ""}` : "Voie de Paris"}</p>
      <h2 className="serif story-title">{name}</h2>
      {!v && <p className="small muted">Cette voie n'est pas encore dans l'annuaire de Marco : vérifie l'orthographe ou choisis une suggestion ci-dessus.</p>}

      {v?.o && (
        <div className="story-block">
          <span className="story-label"><Icon name="book" size={16} /> Origine du nom</span>
          <p>{v.o}</p>
        </div>
      )}
      {v?.h && (
        <div className="story-block fact">
          <span className="story-label">Historique officiel</span>
          <p>{v.h}</p>
        </div>
      )}

      <div className="story-block anecdote">
        <div className="anecdote-head">
          <MarcoLogo size={34} mood={state === "loading" ? "happy" : "wink"} />
          <span className="story-label">Marco raconte</span>
        </div>
        {story ? (
          <Markdown text={story} />
        ) : state === "loading" ? (
          <p className="small">Marco fouille dans les archives… (la première fois, autorise l'IA si on te le demande)</p>
        ) : (
          <p className="small">
            Marco n'a pas encore écrit l'histoire de cette voie, et son IA n'est pas disponible ici.
            {v ? ` Elle traverse le ${arrLabel(v.a)} arrondissement${v.a.length > 1 ? "s" : ""}.` : ""}
          </p>
        )}
      </div>

      <a className="btn btn-ghost" href={mapsUrl} target="_blank" rel="noreferrer">
        <Icon name="pin" size={18} /> Voir sur Google Maps
      </a>

      {nearby.length > 0 && (
        <>
          <h3 className="serif" style={{ marginTop: 8 }}>Les pépites du coin</h3>
          <div className="stack">{nearby.map((s) => <SpotRow key={s.id} spot={s} />)}</div>
        </>
      )}
    </article>
  );
}

export function Streets() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const q = params.get("q") ?? "";
  const [input, setInput] = useState(q);
  const [arr, setArr] = useState(1);
  const [focused, setFocused] = useState(false);

  const story = q ? storyFor(q) : undefined;
  const voie = q && !story ? findVoie(q) : undefined;
  const suggestions = useMemo(() => (input.trim() && (focused || input !== q) ? searchVoies(input, 8) : []), [input, q, focused]);
  const list = useMemo(() => voiesByArr(arr), [arr]);

  useEffect(() => {
    setInput(q);
    if (story) markStreetRead(story.id);
  }, [q]); // eslint-disable-line react-hooks/exhaustive-deps

  const open = (name: string) => {
    setFocused(false);
    setParams({ q: name });
    document.querySelector(".content")?.scrollTo(0, 0);
  };

  return (
    <div className="page">
      <button className="back" onClick={() => (q ? setParams({}) : navigate(-1))} aria-label="Retour"><Icon name="arrowLeft" size={20} /></button>
      <div>
        <h1 className="serif page-title">Raconte-moi une rue</h1>
        <p className="muted small">{VOIES.length.toLocaleString("fr-FR")} rues, avenues, boulevards et places de Paris référencés.</p>
      </div>

      <div className="street-search">
        <form
          className="search"
          onSubmit={(e) => {
            e.preventDefault();
            const best = suggestions[0];
            if (input.trim()) open(best && searchVoies(input, 1)[0] ? best.n : input.trim());
          }}
        >
          <Icon name="search" size={18} />
          <input
            id="street-query"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            placeholder="Rue, avenue, boulevard, place…"
            aria-label="Nom de la voie"
            autoComplete="off"
            enterKeyHint="search"
          />
          {input && (
            <button type="button" className="icon-plain" aria-label="Effacer" onPointerDown={(e) => e.preventDefault()} onClick={() => setInput("")}>
              <Icon name="close" size={16} />
            </button>
          )}
        </form>
        {suggestions.length > 0 && (
          <div className="suggestions" role="listbox">
            {suggestions.map((s) => (
              <button key={s.n} role="option" onPointerDown={(e) => e.preventDefault()} onClick={() => open(s.n)}>
                <span>
                  {s.n}
                  {storyFor(s.n) && <span className="told"> · racontée</span>}
                </span>
                <span className="muted tiny">{arrLabel(s.a)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {story && <StoryView s={story} />}
      {q && !story && <VoieView key={voie?.n ?? q} v={voie} query={q} />}

      {!q && (
        <>
          <section>
            <h3 className="serif section-title">Racontées par Marco</h3>
            <div className="chips-scroll">
              {STREETS.map((s) => (
                <button key={s.id} className="chip" onClick={() => open(s.name)}>{s.name}</button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="serif section-title">Toutes les voies par arrondissement</h3>
            <div className="arr-grid" role="tablist" aria-label="Arrondissement">
              {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                <button key={n} role="tab" aria-selected={arr === n} className={`arr-btn ${arr === n ? "on" : ""}`} onClick={() => setArr(n)}>
                  {n === 1 ? "1er" : `${n}e`}
                </button>
              ))}
            </div>
            <p className="tiny muted" style={{ margin: "10px 0 6px" }}>{list.length} voies dans le {arr === 1 ? "1er" : `${arr}e`}</p>
            <div className="voie-list">
              {list.map((v) => (
                <button key={v.n} className="voie-item" onClick={() => open(v.n)}>
                  <span className="grow">{v.n}</span>
                  {storyFor(v.n) ? <span className="year-pill tiny">racontée</span> : <Icon name="arrowRight" size={14} />}
                </button>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
