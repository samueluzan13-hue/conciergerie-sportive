import { useEffect } from "react";
import { BrowserRouter, MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { BottomNav } from "./components/BottomNav";
import { MarcoLogo } from "./components/MarcoLogo";
import { SpotSheetProvider } from "./components/SpotSheet";
import { useCloud } from "./lib/cloud";
import { connectCloud, useStore } from "./lib/store";
import { Admin } from "./pages/Admin";
import { MapPage } from "./pages/MapPage";
import { Propose } from "./pages/Propose";
import { Chat } from "./pages/Chat";
import { Explorer } from "./pages/Explorer";
import { Home } from "./pages/Home";
import { Onboarding } from "./pages/Onboarding";
import { Planner } from "./pages/Planner";
import { Profile } from "./pages/Profile";
import { Streets } from "./pages/Streets";
import { Voyages } from "./pages/Voyages";


function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => document.querySelector(".content")?.scrollTo(0, 0), [pathname]);
  return null;
}

function DesktopAside() {
  return (
    <aside className="desktop-aside" aria-hidden="true">
      <MarcoLogo size={96} />
      <h1 className="serif">MARCO</h1>
      <p className="lead">L'utilisateur dit ce qu'il veut faire.<br />Marco construit le plan.</p>
      <ul>
        <li>« Google te donne 400 options. Marco t'en donne 3 bonnes. »</li>
        <li>« J'ai 3 heures à Paris. Personne n'avait de plan. Marco en avait un. »</li>
      </ul>
      <p className="tiny muted">Ajoute Marco à ton écran d'accueil pour l'utiliser comme une app.</p>
    </aside>
  );
}

// La version aperçu (page unique) navigue en mémoire, sans modifier l'URL.
const Router = import.meta.env.VITE_PREVIEW ? MemoryRouter : BrowserRouter;

export default function App() {
  const onboarded = useStore((s) => s.profile.onboarded);
  // Quand les lieux / rues arrivent de la base, on redessine les écrans avec les nouvelles données.
  const { version } = useCloud();
  useEffect(() => connectCloud(), []);
  return (
    <Router>
      <ScrollTop />
      <div className="shell">
        <DesktopAside />
        <div className="device">
          <SpotSheetProvider>
            {onboarded ? (
              <>
                <main className="content" key={version}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/explorer" element={<Explorer />} />
                    <Route path="/marco" element={<Chat />} />
                    <Route path="/carte" element={<MapPage />} />
                    <Route path="/profil" element={<Profile />} />
                    <Route path="/planner" element={<Planner />} />
                    <Route path="/rues" element={<Streets />} />
                    <Route path="/voyages" element={<Voyages />} />
                    <Route path="/proposer" element={<Propose />} />
                    <Route path="/base" element={<Admin />} />
                    <Route path="*" element={<Home />} />
                  </Routes>
                </main>
                <BottomNav />
              </>
            ) : (
              <Onboarding />
            )}
          </SpotSheetProvider>
        </div>
      </div>
    </Router>
  );
}
