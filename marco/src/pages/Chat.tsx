import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "../components/Nav";
import { Icon } from "../components/Icon";
import { Markdown } from "../components/Markdown";
import { MarcoLogo } from "../components/MarcoLogo";
import { askMarco, checkAi, type ChatMessage } from "../lib/ai";
import { localReply } from "../lib/localBrain";
import { useStore } from "../lib/store";

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
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkAi().then(setAi);
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(messages.slice(-30)));
    } catch {
      /* ignore */
    }
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy, live]);

  // Sur téléphone, on masque la barre du bas pendant la saisie (le clavier prend la place).
  useEffect(() => () => document.body.classList.remove("typing"), []);

  const send = async (text: string) => {
    const t = text.trim();
    if (!t || busy) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: t }];
    setMessages(next);
    setInput("");
    setBusy(true);
    setLive("");
    const reply = (await askMarco(next, { onText: setLive })) ?? localReply(t);
    if (!(await checkAi())) await new Promise((r) => setTimeout(r, 450)); // laisse le temps de voir Marco réfléchir
    setMessages([...next, { role: "assistant", content: reply }]);
    setLive("");
    setBusy(false);
  };

  useEffect(() => {
    const q = params.get("q");
    if (q) {
      setParams({}, { replace: true });
      send(q);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="bubble-user">{m.content}</div>
          ) : (
            <div key={i} className="bubble-row">
              <MarcoLogo size={30} />
              <div className="bubble-ai"><Markdown text={m.content} /></div>
            </div>
          ),
        )}
        {busy && (
          <div className="bubble-row">
            <MarcoLogo size={30} mood="happy" />
            {live ? (
              <div className="bubble-ai"><Markdown text={live} /></div>
            ) : (
              <div className="bubble-ai typing-dots"><span /><span /><span /></div>
            )}
          </div>
        )}
        <div ref={endRef} />
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
