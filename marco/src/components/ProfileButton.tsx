import { useLocation } from "react-router-dom";
import { useStore } from "../lib/store";
import { Link } from "./Nav";

/** L'initiale de l'utilisateur, en haut à droite de chaque écran : un appui ouvre le profil. */
export function ProfileButton() {
  const name = useStore((s) => s.profile.name);
  const { pathname } = useLocation();
  // l'accueil a déjà son initiale dans son en-tête, et le profil n'en a pas besoin
  if (pathname === "/" || pathname === "/profil") return null;
  return (
    <Link to="/profil" className="profile-fab serif" aria-label="Mon profil">
      {(name || "M").charAt(0).toUpperCase()}
    </Link>
  );
}
