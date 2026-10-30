// ===== En-tête : fond au défilement =====
const header = document.querySelector(".header");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ===== Menu mobile =====
const toggle = document.querySelector(".nav-toggle");
const setNav = (open) => {
  header.classList.toggle("nav-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
};
toggle.addEventListener("click", () => setNav(!header.classList.contains("nav-open")));
document.querySelectorAll(".nav a").forEach((a) => a.addEventListener("click", () => setNav(false)));

// ===== Onglets de la carte =====
const tabs = [...document.querySelectorAll(".tab")];
const activate = (tab) => {
  tabs.forEach((t) => {
    const active = t === tab;
    t.classList.toggle("is-active", active);
    t.setAttribute("aria-selected", String(active));
    t.tabIndex = active ? 0 : -1;
    document.getElementById(t.getAttribute("aria-controls")).hidden = !active;
  });
};
tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => activate(tab));
  tab.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
    next.focus();
    activate(next);
  });
});

// ===== Horaires : jour courant + statut ouvert/fermé =====
// Les horaires sont lus dans le tableau HTML (format "19h00 – 22h30").
const now = new Date();
const today = document.querySelector(`.hours tr[data-day="${now.getDay()}"]`);
const badge = document.getElementById("status-badge");
if (today) {
  today.classList.add("is-today");
  const match = today.querySelector("td").textContent.match(/(\d{1,2})h(\d{2}).*?(\d{1,2})h(\d{2})/);
  if (match) {
    const [, oh, om, ch, cm] = match.map(Number);
    const mins = now.getHours() * 60 + now.getMinutes();
    const open = mins >= oh * 60 + om && mins < ch * 60 + cm;
    badge.textContent = open
      ? `Ouvert · ferme à ${ch}h${String(cm).padStart(2, "0")}`
      : mins < oh * 60 + om
        ? `Fermé · ouvre à ${oh}h${String(om).padStart(2, "0")}`
        : "Fermé · à demain dès 19h";
    badge.classList.add(open ? "is-open" : "is-closed");
  }
}

// ===== Apparition au défilement =====
const io = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
  }),
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// ===== Année du pied de page =====
document.getElementById("year").textContent = now.getFullYear();
