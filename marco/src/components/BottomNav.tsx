import { NavLink } from "./Nav";
import { Icon } from "./Icon";
import { MarcoLogo } from "./MarcoLogo";

const ITEMS = [
  { to: "/", label: "Accueil", icon: "home" },
  { to: "/explorer", label: "Explorer", icon: "compass" },
  { to: "/marco", label: "Marco", icon: "" },
  { to: "/carte", label: "Carte", icon: "pin" },
  { to: "/profil", label: "Profil", icon: "user" },
];

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navigation principale">
      {ITEMS.map((it) =>
        it.icon ? (
          <NavLink key={it.to} to={it.to} end={it.to === "/"} className="nav-item">
            <Icon name={it.icon} size={22} />
            <span>{it.label}</span>
          </NavLink>
        ) : (
          <NavLink key={it.to} to={it.to} className="nav-marco" aria-label="Parler à Marco">
            <span className="nav-marco-bubble">
              <MarcoLogo size={34} inverted />
            </span>
          </NavLink>
        ),
      )}
    </nav>
  );
}
