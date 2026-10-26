// Manifestation de l'ombre — serveur sans dépendance (Node >= 18).
// Sert la page, enregistre les soutiens dans un fichier JSON et pousse
// chaque nouvelle inscription en direct aux visiteurs (Server-Sent Events).

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "soutiens.json");
const PUBLIC_DIR = path.join(__dirname, "public");
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";

const LIMITS = { name: 40, city: 40, message: 140 };
const MAX_PER_IP_PER_HOUR = 5;

// ---------- Stockage ----------

fs.mkdirSync(DATA_DIR, { recursive: true });
let supporters = [];
try {
  supporters = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
} catch {
  supporters = [];
}

let saving = Promise.resolve();
function persist() {
  const snapshot = JSON.stringify(supporters);
  saving = saving.then(async () => {
    const tmp = DATA_FILE + ".tmp";
    await fs.promises.writeFile(tmp, snapshot);
    await fs.promises.rename(tmp, DATA_FILE);
  }).catch((err) => console.error("Écriture impossible :", err));
}

// ---------- Utilitaires ----------

function clean(value, max) {
  return String(value ?? "")
    .replace(/[\u0000-\u001f\u007f<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function clientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  return (fwd ? String(fwd).split(",")[0] : req.socket.remoteAddress || "").trim();
}

// Limite de débit en mémoire ; l'IP n'est jamais écrite sur disque.
const hits = new Map();
function rateLimited(ip) {
  const key = crypto.createHash("sha256").update(ip).digest("hex");
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < 3600_000);
  if (recent.length >= MAX_PER_IP_PER_HOUR) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  return false;
}
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of hits) if (v.every((t) => now - t >= 3600_000)) hits.delete(k);
}, 600_000).unref();

function sendJson(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(body));
}

function readBody(req, max = 4096) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (c) => {
      size += c.length;
      if (size > max) {
        reject(new Error("too_large"));
        req.destroy();
      } else chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

const publicView = ({ id, name, city, message, createdAt }) => ({ id, name, city, message, createdAt });

// ---------- Direct (SSE) ----------

const streams = new Set();
function broadcast(event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of streams) res.write(payload);
}
setInterval(() => {
  for (const res of streams) res.write(": ping\n\n");
}, 25_000).unref();

// ---------- Fichiers statiques ----------

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".png": "image/png",
};

function serveStatic(req, res, pathname) {
  const rel = pathname === "/" ? "index.html" : pathname.slice(1);
  const file = path.normalize(path.join(PUBLIC_DIR, rel));
  if (!file.startsWith(PUBLIC_DIR + path.sep)) return sendJson(res, 404, { error: "introuvable" });
  fs.readFile(file, (err, buf) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("Page introuvable");
    }
    res.writeHead(200, {
      "Content-Type": TYPES[path.extname(file)] || "application/octet-stream",
      "Cache-Control": "public, max-age=300",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(buf);
  });
}

// ---------- Routes ----------

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  const { pathname } = url;

  if (pathname === "/api/soutiens" && req.method === "GET") {
    return sendJson(res, 200, { count: supporters.length, supporters: supporters.map(publicView) });
  }

  if (pathname === "/api/soutiens" && req.method === "POST") {
    let body;
    try {
      body = JSON.parse(await readBody(req));
    } catch {
      return sendJson(res, 400, { error: "Requête illisible." });
    }
    // Champ piège invisible : un robot le remplit, un humain non.
    if (body.website) return sendJson(res, 201, { ok: true });

    const name = clean(body.name, LIMITS.name);
    const city = clean(body.city, LIMITS.city);
    const message = clean(body.message, LIMITS.message);
    if (name.length < 2) return sendJson(res, 400, { error: "Indiquez un prénom ou un pseudo (2 caractères minimum)." });
    if (rateLimited(clientIp(req))) {
      return sendJson(res, 429, { error: "Trop d'inscriptions depuis cette connexion. Réessayez dans une heure." });
    }

    const supporter = { id: crypto.randomUUID(), name, city, message, createdAt: new Date().toISOString() };
    supporters.push(supporter);
    persist();
    broadcast("soutien", publicView(supporter));
    return sendJson(res, 201, { ok: true, supporter: publicView(supporter), count: supporters.length });
  }

  if (pathname === "/api/direct" && req.method === "GET") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-store",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    });
    res.write("retry: 5000\n\n");
    streams.add(res);
    req.on("close", () => streams.delete(res));
    return;
  }

  // Modération : DELETE /api/soutiens/<id> avec l'en-tête Authorization: Bearer <ADMIN_TOKEN>
  const del = pathname.match(/^\/api\/soutiens\/([\w-]+)$/);
  if (del && req.method === "DELETE") {
    const auth = String(req.headers.authorization || "");
    const ok = ADMIN_TOKEN &&
      auth.length === ADMIN_TOKEN.length + 7 &&
      crypto.timingSafeEqual(Buffer.from(auth), Buffer.from("Bearer " + ADMIN_TOKEN));
    if (!ok) return sendJson(res, 401, { error: "Non autorisé." });
    const before = supporters.length;
    supporters = supporters.filter((s) => s.id !== del[1]);
    if (supporters.length === before) return sendJson(res, 404, { error: "Introuvable." });
    persist();
    broadcast("retrait", { id: del[1] });
    return sendJson(res, 200, { ok: true, count: supporters.length });
  }

  if (req.method === "GET" || req.method === "HEAD") return serveStatic(req, res, pathname);
  sendJson(res, 405, { error: "Méthode non autorisée." });
});

server.listen(PORT, () => {
  console.log(`Manifestation de l'ombre : http://localhost:${PORT} (${supporters.length} soutiens)`);
});
