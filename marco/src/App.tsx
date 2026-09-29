import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { BottomNav } from "./components/BottomNav";
import { MarcoLogo } from "./components/MarcoLogo";
import { SpotSheetProvider } from "./components/SpotSheet";
import { useStore } from "./lib/store";
import { Chat } from "./pages/Chat";
import { Explorer } from "./pages/Explorer";
import { Home } from "./pages/Home";
import { Onboarding } from "./pages/Onboarding";
import { Planner } from "./pages/Planner";
import { Profile } from "./pages/Profile";
import { Streets } from "./pages/Streets";
import { Voyages } from "./pages/Voyages";

const MapPage = lazy(() => import("./pages/MapPage").then((m) => ({ default: m.MapPage })));

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
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

export default function App() {
  const onboarded = useStore((s) => s.profile.onboarded);
  return (
    <BrowserRouter>
      <ScrollTop />
      <div className="shell">
        <DesktopAside />
        <div className="device">
          <SpotSheetProvider>
            {onboarded ? (
              <>
                <main className="content">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/explorer" element={<Explorer />} />
                    <Route path="/marco" element={<Chat />} />
                    <Route path="/carte" element={<Suspense fallback={<div className="page muted">Chargement de la carte…</div>}><MapPage /></Suspense>} />
                    <Route path="/profil" element={<Profile />} />
                    <Route path="/planner" element={<Planner />} />
                    <Route path="/rues" element={<Streets />} />
                    <Route path="/voyages" element={<Voyages />} />
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
    </BrowserRouter>
  );
}
