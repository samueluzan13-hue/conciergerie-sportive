import { Fragment, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "../components/Nav";
import { Icon } from "../components/Icon";
import { Markdown } from "../components/Markdown";
import { MarcoLogo } from "../components/MarcoLogo";
import { aiIssue, askMarco, checkAi, type ChatMessage } from "../lib/ai";
import { aiPermission, requestAi } from "../lib/cloud";
import { log } from "../lib/diag";
import { isGenericReply, lastLocalWasStrong, localReply } from "../lib/localBrain";
import { parseReply } from "../lib/meta";
import { remember, savePlan, useStore } from "../lib/store";

const QUICK = [
  "J'ai 3 heures à Paris",
  "Un bar caché pour un date",
  "Raconte-moi la rue Mouffetard",
  "Un resto pas cher",
  "Une journée en famille sans attrape-touristes",
  "Du jazz ce soir",
];

const KEY = "marco.chat.v1";

export function Chat() {
  const name = useStore((s) => s.profile.name);
  const [params, setParams] = useSearchParams();
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      return JSON.parse(sessionStorage.getItem(KEY) ?? "[]");
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [live, setLive] = useState("");
  const [ai, setAi] = useState<boolean | null>(null);
  // autorisation de l'IA dans l'aperçu claude.ai : "prompt" = pas encore activée, "denied" = refusée
  const [perm, setPerm] = useState<string>("granted");

  useEffect(() => {
    checkAi().then(setAi);
    aiPermission().then(setPerm);
  }, []);

  const activate = async () => {
    const st = await requestAi();
    setPerm(st);
    log("ai:activate", st);
  };

  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(messages.slice(-30)));
    } catch {
      /* ignore */
    }
    // on fait défiler uniquement la zone du chat (scrollIntoView peut déplacer toute la page dans un cadre)
    const box = document.querySelector(".content");
    if (box) box.scrollTop = box.scrollHeight;
  }, [messages, busy, live]);

  // Sur téléphone, on masque la barre du bas pendant la saisie (le clavier prend la place).
  useEffect(() => () => document.body.classList.remove("typing"), []);

  const [savedPlan, setSavedPlan] = useState<number | null>(null);

  const send = async (text: string, opts: { aiOnly?: boolean } = {}) => {
    const t = text.trim();
    if (!t || busy) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: t }];
    setMessages(next);
    setInput("");
    setBusy(true);
    setLive("");
    log("chat:send", t.slice(0, 60));
    // 1. La base d'adresses de Marco répond tout de suite quand elle a de quoi répondre précisément.
    //    Sinon (rien dans l'arrondissement demandé, question hors base), on laisse l'IA répondre directement.
    const local = localReply(t);
    const aiOn = await checkAi();
    // une relance (bouton) dépend de la conversation : seule l'IA sait y répondre
    const strong = lastLocalWasStrong() && !isGenericReply(local) && !(opts.aiOnly && aiOn);
    setAi(aiOn);
    const base: ChatMessage[] = strong ? [...next, { role: "assistant", content: local }] : next;
    if (strong) setMessages(base);
    log("chat:local", { strong, aiOn });
    // 2. L'IA (Claude, sous le nom de Marco) répond à tout ; si elle n'est pas disponible, la base prend le relais.
    let reply: string | null = null;
    try {
      if (aiOn) reply = await askMarco(next, { onText: setLive, alreadyShown: strong ? local : undefined });
      else await new Promise((r) => setTimeout(r, 300));
    } catch (e) {
      log("chat:error", e);
    }
    if (reply) {
      const memos = parseReply(reply).memos;
      remember(memos);
      if (memos.length) log("chat:memo", memos.length);
    }
    if (aiIssue() === "denied") setPerm("denied");
    else aiPermission().then(setPerm);
    setMessages(reply ? [...base, { role: "assistant", content: reply }] : strong ? base : [...base, { role: "assistant", content: local }]);
    setLive("");
    setBusy(false);
  };

  useEffect(() => {
    const q = params.get("q");
    if (q) {
      const aiOnly = params.get("ia") === "1";
      setParams({}, { replace: true });
      send(q, { aiOnly });
    }
  }, [params]); // eslint-disable-line react-hooks/exhaustive-deps

  const lastAi = !busy && messages.length > 0 && messages[messages.length - 1].role === "assistant" ? messages.length - 1 : -1;

  return (
    <div className="page chat-page">
      <header className="chat-head">
        <MarcoLogo size={44} />
        <div className="grow">
          <h1 className="serif">Marco</h1>
          <p className="tiny muted">
            <span className={`dot ${ai ? "on" : ""}`} /> {ai === null ? "Connexion…" : ai ? "En ligne · ton pote qui a tout fait" : "Mode hors-ligne · réponses depuis la base Marco"}
          </p>
        </div>
        {messages.length > 0 && (
          <button className="icon-btn" aria-label="Nouvelle conversation" onClick={() => setMessages([])}>
            <Icon name="refresh" size={18} />
          </button>
        )}
      </header>

      {perm === "prompt" && (
        <div className="ai-banner">
          <p className="small"><b>Active l'IA de Marco</b> pour qu'il réponde à toutes tes questions (sport dans le 8e, atelier peinture dans le 15e, resto casher dans le 17e…).</p>
          <button className="btn btn-primary" onClick={activate}>Activer</button>
        </div>
      )}
      {perm === "denied" && (
        <div className="ai-banner">
          <p className="small">L'IA de Marco est désactivée : je réponds seulement avec ma base d'adresses. Pour la réactiver, ouvre le menu <b>Autorisations</b> de la page et autorise l'IA, puis recharge.</p>
        </div>
      )}

      <div className="chat-scroll">
        {messages.length === 0 && (
          <div className="chat-empty">
            <MarcoLogo size={92} />
            <h2 className="serif">Salut{name ? ` ${name}` : ""} ! Dis-moi ce que tu veux faire.</h2>
            <p className="muted small">Une envie, une contrainte, un budget, un nom de rue… Je construis le plan.</p>
            <div className="quick">
              {QUICK.map((q) => (
                <button key={q} className="chip" onClick={() => send(q)}>{q}</button>
              ))}
            </div>
            <Link to="/planner" className="link small">Ou utilise le planificateur pas à pas →</Link>
          </div>
        )}

        {messages.map((m, i) => {
          if (m.role === "user") return <div key={i} className="bubble-user">{m.content}</div>;
          const meta = parseReply(m.content);
          return (
            <Fragment key={i}>
              <div className="bubble-row">
                <MarcoLogo size={30} />
                <div className="bubble-ai">
                  <Markdown text={m.content} />
                  {meta.memos.length > 0 && (
                    <p className="memo-note tiny">
                      <Icon name="bookmark" size={13} /> Marco retient : {meta.memos.join(" · ")} <Link to="/profil" className="link">Gérer</Link>
                    </p>
                  )}
                </div>
              </div>
              {i === lastAi && (
                <div className="follow-ups">
                  {meta.plan && (
                    <button
                      className="chip chip-plan"
                      disabled={savedPlan === i}
                      onClick={() => {
                        savePlan({ id: `ia-${Date.now()}`, title: meta.plan!.title, createdAt: Date.now(), stops: meta.plan!.stops });
                        setSavedPlan(i);
                        log("chat:plan", meta.plan!.stops.length);
                      }}
                    >
                      <Icon name={savedPlan === i ? "check" : "calendar"} size={14} /> {savedPlan === i ? "Plan enregistré" : "Enregistrer ce plan"}
                    </button>
                  )}
                  {meta.suggestions.map((q) => (
                    <button key={q} className="chip" onClick={() => send(q, { aiOnly: true })}>{q}</button>
                  ))}
                  {ai && (
                    <button className="chip chip-ghost" onClick={() => send("Propose-moi d'autres idées, différentes de celles-ci", { aiOnly: true })}>
                      <Icon name="refresh" size={13} /> Autres idées
                    </button>
                  )}
                </div>
              )}
            </Fragment>
          );
        })}
        {busy && (
          <div className="bubble-row">
            <MarcoLogo size={30} mood="happy" />
            {live ? (
              <div className="bubble-ai"><Markdown text={live} /></div>
            ) : (
              <div className="bubble-ai searching"><span className="typing-dots"><span /><span /><span /></span> <span className="tiny muted">Marco cherche…</span></div>
            )}
          </div>
        )}
      </div>

      <form
        className="chat-input"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input
          id="chat-message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => document.body.classList.add("typing")}
          // on attend un peu : sinon la barre bouge pendant l'appui sur « Envoyer » et le clic tombe à côté
          onBlur={() => setTimeout(() => document.activeElement?.id !== "chat-message" && document.body.classList.remove("typing"), 250)}
          placeholder="Écris à Marco…"
          aria-label="Message"
          enterKeyHint="send"
        />
        <button className="btn-round" disabled={!input.trim() || busy} aria-label="Envoyer" onPointerDown={(e) => e.preventDefault()}><Icon name="send" size={18} /></button>
      </form>
    </div>
  );
}
