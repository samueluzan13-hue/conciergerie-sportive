(() => {
  "use strict";

  const SVG_NS = "http://www.w3.org/2000/svg";
  const STORE_KEY = "manif-ombre:moi";

  // Zone de l'avenue (chaussée + trottoirs) dans le repère du plan, hors ronds-points.
  const AVENUE = { x0: 262, x1: 1392, y0: 303, y1: 397 };
  const ROND_POINT = { cx: 981, cy: 350, r: 52 };

  const $ = (id) => document.getElementById(id);
  const crowd = $("crowd");
  const city = $("city");
  const svg = $("map");
  const frame = document.querySelector(".map-frame");
  const tooltip = $("tooltip");
  const meRing = $("me-ring");

  let supporters = [];
  let positions = [];
  let myId = null;
  try { myId = localStorage.getItem(STORE_KEY); } catch {}

  // ---------- Décor : îlots et avenues de l'Étoile ----------

  function drawDecor() {
    const blocks = $("blocks");
    const rows = [[-60, 80], [86, 170], [176, 290], [410, 520], [530, 640], [650, 800]];
    const cols = [];
    for (let x = -80; x < 1720; x += 118) cols.push(x);
    for (const [y0, y1] of rows) {
      for (const x of cols) {
        const w = 100 + ((x * 7 + y0) % 3) * 4;
        const r = document.createElementNS(SVG_NS, "rect");
        r.setAttribute("x", x);
        r.setAttribute("y", y0);
        r.setAttribute("width", w);
        r.setAttribute("height", y1 - y0 - 8);
        r.setAttribute("rx", 5);
        blocks.appendChild(r);
      }
    }
    // Les 12 avenues qui partent de la place de l'Étoile.
    const radials = $("radials");
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2 + Math.PI / 12;
      const p = document.createElementNS(SVG_NS, "path");
      const len = 420, half = 0.07;
      const pt = (ang, d) => `${160 + Math.cos(ang) * d} ${350 + Math.sin(ang) * d}`;
      p.setAttribute("d", `M${pt(a - half, 60)} L${pt(a - half / 6, len)} L${pt(a + half / 6, len)} L${pt(a + half, 60)} Z`);
      radials.appendChild(p);
    }
  }

  // ---------- Placement de la foule ----------

  // Chaque arrivant reçoit une place fixe : la position le long de l'avenue
  // suit le nombre d'or (remplissage régulier), la position en travers est
  // pseudo-aléatoire (effet de foule). Même numéro = même place, partout.
  const PHI = 0.6180339887498949;
  function rand(n) {
    let t = (n + 0x6d2b79f5) >>> 0;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  function slot(n) {
    for (let k = n; ; k += 7919) { // place prise par le rond-point : on en tire une autre
      const u = (0.5 + PHI * k) % 1;
      const x = AVENUE.x0 + u * (AVENUE.x1 - AVENUE.x0);
      const y = AVENUE.y0 + rand(k) * (AVENUE.y1 - AVENUE.y0);
      if (Math.hypot(x - ROND_POINT.cx, y - ROND_POINT.cy) > ROND_POINT.r) return { x, y };
    }
  }

  function dotRadius(count) {
    if (count < 150) return 6;
    if (count < 600) return 4.5;
    if (count < 2000) return 3;
    if (count < 6000) return 2;
    return 1.4;
  }

  function render(newId) {
    const r = dotRadius(supporters.length);
    const frag = document.createDocumentFragment();
    positions = supporters.map((s, i) => ({ s, ...slot(i) }));
    for (const p of positions) {
      if (supporters.length < 600) {
        const halo = document.createElementNS(SVG_NS, "circle");
        halo.setAttribute("class", "halo");
        halo.setAttribute("cx", p.x.toFixed(1));
        halo.setAttribute("cy", p.y.toFixed(1));
        halo.setAttribute("r", (r * 3).toFixed(1));
        frag.appendChild(halo);
      }
      const c = document.createElementNS(SVG_NS, "circle");
      c.setAttribute("cx", p.x.toFixed(1));
      c.setAttribute("cy", p.y.toFixed(1));
      c.setAttribute("r", r);
      if (p.s.id === newId) c.setAttribute("class", "new");
      c.dataset.id = p.s.id;
      frag.appendChild(c);
    }
    crowd.replaceChildren(frag);

    const mine = positions.find((p) => p.s.id === myId);
    meRing.setAttribute("cx", mine ? mine.x : -50);
    meRing.setAttribute("cy", mine ? mine.y : -50);
    meRing.setAttribute("r", r + 5);

    $("count").textContent = supporters.length.toLocaleString("fr-FR");
    $("map-empty").hidden = supporters.length > 0;
    renderFeed();
    $("joined").hidden = !mine;
    $("join-form").hidden = !!mine;
  }

  function renderFeed() {
    const list = $("feed");
    const latest = supporters.slice(-12).reverse();
    list.replaceChildren(...latest.map((s) => {
      const li = document.createElement("li");
      const dot = document.createElement("span");
      dot.className = "f-dot";
      const name = document.createElement("span");
      name.className = "f-name";
      name.textContent = s.name;
      const meta = document.createElement("span");
      meta.className = "f-meta";
      meta.textContent = [s.city, timeAgo(s.createdAt)].filter(Boolean).join(" · ");
      li.append(dot, name, meta);
      if (s.message) {
        const msg = document.createElement("span");
        msg.className = "f-msg";
        msg.textContent = `« ${s.message} »`;
        li.append(msg);
      }
      return li;
    }));
    $("feed-empty").hidden = supporters.length > 0;
  }

  function timeAgo(iso) {
    const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
    if (s < 60) return "à l'instant";
    if (s < 3600) return `il y a ${Math.floor(s / 60)} min`;
    if (s < 86400) return `il y a ${Math.floor(s / 3600)} h`;
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  }

  // ---------- Infobulle ----------

  let hot = null;
  function pointAt(evt) {
    const pt = svg.createSVGPoint();
    pt.x = evt.clientX; pt.y = evt.clientY;
    const local = pt.matrixTransform(city.getScreenCTM().inverse());
    let best = null, bestD = Math.max(14, dotRadius(supporters.length) * 3);
    for (const p of positions) {
      const d = Math.hypot(p.x - local.x, p.y - local.y);
      if (d < bestD) { bestD = d; best = p; }
    }
    return best;
  }

  function showTip(evt) {
    const p = pointAt(evt);
    if (hot) hot.classList.remove("hot");
    if (!p) { tooltip.hidden = true; hot = null; return; }
    hot = crowd.querySelector(`circle[data-id="${p.s.id}"]`);
    if (hot) hot.classList.add("hot");

    tooltip.replaceChildren();
    const name = document.createElement("strong");
    name.textContent = p.s.id === myId ? `${p.s.name} (vous)` : p.s.name;
    tooltip.append(name);
    if (p.s.city) {
      const c = document.createElement("span");
      c.className = "tt-city";
      c.textContent = p.s.city;
      tooltip.append(c);
    }
    if (p.s.message) {
      const m = document.createElement("span");
      m.className = "tt-msg";
      m.textContent = `« ${p.s.message} »`;
      tooltip.append(m);
    }
    const box = frame.getBoundingClientRect();
    const sp = svg.createSVGPoint();
    sp.x = p.x; sp.y = p.y;
    const screen = sp.matrixTransform(city.getScreenCTM());
    const x = screen.x - box.left + frame.scrollLeft;
    tooltip.style.left = `${Math.min(Math.max(x, 120 + frame.scrollLeft), frame.scrollLeft + box.width - 120)}px`;
    tooltip.style.top = `${screen.y - box.top}px`;
    tooltip.hidden = false;
  }

  svg.addEventListener("pointermove", (e) => { if (e.pointerType === "mouse") showTip(e); });
  svg.addEventListener("click", showTip);
  svg.addEventListener("pointerleave", (e) => {
    if (e.pointerType !== "mouse") return;
    tooltip.hidden = true;
    if (hot) hot.classList.remove("hot");
  });

  // ---------- Données ----------

  async function load() {
    try {
      const res = await fetch("/api/soutiens", { cache: "no-store" });
      const data = await res.json();
      supporters = data.supporters || [];
      if (myId && !supporters.some((s) => s.id === myId)) {
        myId = null;
        try { localStorage.removeItem(STORE_KEY); } catch {}
      }
      render();
    } catch {
      $("map-empty").textContent = "Impossible de charger la carte pour le moment. Rechargez la page dans un instant.";
    }
  }

  function listen() {
    if (!("EventSource" in window)) { setInterval(load, 15000); return; }
    const es = new EventSource("/api/direct");
    es.addEventListener("soutien", (e) => {
      const s = JSON.parse(e.data);
      if (supporters.some((x) => x.id === s.id)) return;
      supporters.push(s);
      render(s.id);
    });
    es.addEventListener("retrait", (e) => {
      const { id } = JSON.parse(e.data);
      supporters = supporters.filter((s) => s.id !== id);
      render();
    });
    // Après une coupure, on recharge tout pour rattraper ce qui a été manqué.
    let wasDown = false;
    es.addEventListener("error", () => { wasDown = true; });
    es.addEventListener("open", () => { if (wasDown) { wasDown = false; load(); } });
  }

  // ---------- Formulaire ----------

  const form = $("join-form");
  const msgEl = $("form-msg");
  const submitBtn = $("submit-btn");

  $("f-message").addEventListener("input", (e) => {
    $("char-count").textContent = `${e.target.value.length} / 140`;
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msgEl.textContent = "";
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    if (name.length < 2) { msgEl.textContent = "Indiquez un prénom ou un pseudo (2 caractères minimum)."; $("f-name").focus(); return; }
    if (!fd.get("consent")) { msgEl.textContent = "Cochez la case pour accepter l'affichage public de votre point."; return; }

    submitBtn.disabled = true;
    submitBtn.textContent = "Placement en cours…";
    try {
      const res = await fetch("/api/soutiens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          city: fd.get("city"),
          message: fd.get("message"),
          website: fd.get("website"),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "L'inscription n'a pas abouti. Réessayez.");
      if (data.supporter) {
        myId = data.supporter.id;
        try { localStorage.setItem(STORE_KEY, myId); } catch {}
        if (!supporters.some((s) => s.id === myId)) supporters.push(data.supporter);
        render(myId);
        document.querySelector(".map-section").scrollIntoView({ behavior: "smooth", block: "start" });
        toast("Votre point rouge est sur l'avenue.");
      }
      form.reset();
    } catch (err) {
      msgEl.textContent = err.message || "Connexion impossible. Vérifiez votre réseau et réessayez.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Placer mon point rouge";
    }
  });

  // ---------- Partage ----------

  function toast(text) {
    const t = document.createElement("div");
    t.className = "toast";
    t.setAttribute("role", "status");
    t.textContent = text;
    document.body.append(t);
    setTimeout(() => t.remove(), 2600);
  }

  async function share() {
    const url = location.origin + location.pathname;
    const text = "Je soutiens les commerçants des Champs-Élysées. Ajoute ton point rouge à la Manifestation de l'Ombre :";
    if (navigator.share) {
      try { await navigator.share({ title: "La Manifestation de l'Ombre", text, url }); return; } catch (e) { if (e.name === "AbortError") return; }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast("Lien copié.");
    } catch {
      toast(url);
    }
  }
  $("share-btn").addEventListener("click", share);
  $("share-btn-2").addEventListener("click", share);

  drawDecor();
  load().then(listen);
  setInterval(renderFeed, 60000);
})();
