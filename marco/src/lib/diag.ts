// Journal de diagnostic : garde les derniers événements et erreurs, et les enregistre
// dans l'espace privé de l'utilisateur (data/users/<id>/diag) quand la base est disponible.
type Entry = { t: string; ev: string; info?: string };

const entries: Entry[] = [];
let sink: ((entries: Entry[]) => void) | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;

export function log(ev: string, info?: unknown) {
  const text = info === undefined ? undefined : typeof info === "string" ? info : safeJson(info);
  entries.push({ t: new Date().toISOString(), ev, info: text?.slice(0, 500) });
  if (entries.length > 60) entries.splice(0, entries.length - 60);
  if (sink) {
    clearTimeout(timer);
    timer = setTimeout(() => sink?.(entries.slice()), 1500);
  }
}

function safeJson(x: unknown) {
  try {
    return x instanceof Error ? `${x.name}: ${x.message}\n${x.stack ?? ""}` : JSON.stringify(x);
  } catch {
    return String(x);
  }
}

export function setDiagSink(fn: (entries: Entry[]) => void) {
  sink = fn;
  fn(entries.slice());
}

export function layoutSnapshot() {
  const r = (sel: string) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return `${Math.round(b.width)}x${Math.round(b.height)}@${Math.round(b.top)}`;
  };
  return {
    win: `${innerWidth}x${innerHeight}`,
    framed: window.parent !== window,
    root: r("#root"),
    device: r(".device"),
    content: r(".content"),
    nav: r(".bottom-nav"),
    scroll: `${document.scrollingElement?.scrollTop ?? 0}`,
    ua: navigator.userAgent.slice(0, 120),
  };
}

export function installGlobalHandlers() {
  window.addEventListener("error", (e) => log("error", e.error ?? e.message));
  window.addEventListener("unhandledrejection", (e) => log("rejection", e.reason));
}
