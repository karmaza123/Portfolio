import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ScrollToHash } from "./components/ScrollToHash";
import { MaraChrome } from "./components/MaraChrome";
import { MaraAppearanceProvider } from "./context/MaraAppearance";
import { CaseStudyScreen } from "./screens/CaseStudyScreen";
import { MaraHomePage } from "./screens/MaraHomePage";
import { ResumeScreen } from "./screens/ResumeScreen";
import { WorkPage } from "./screens/WorkPage";

// Portal pages are code-split so portfolio visitors never download them.
const PortalLoginScreen = lazy(() =>
  import("./screens/portal/PortalLoginScreen").then((m) => ({ default: m.PortalLoginScreen })),
);
const PortalDashboardScreen = lazy(() =>
  import("./screens/portal/PortalDashboardScreen").then((m) => ({ default: m.PortalDashboardScreen })),
);

function App() {
  return (
    <MaraAppearanceProvider>
      <div className="app-stack">
        <div className="mara-noise" aria-hidden />
        <MaraChrome />
        <div className="mara-router">
          <BrowserRouter>
            <ScrollToHash />
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<MaraHomePage />} />
                <Route path="/work" element={<WorkPage />} />
                <Route path="/resume" element={<ResumeScreen />} />
                <Route path="/project/:slug" element={<CaseStudyScreen />} />
                <Route path="/portal" element={<Navigate to="/portal/login" replace />} />
                <Route path="/portal/login" element={<PortalLoginScreen />} />
                <Route path="/portal/dashboard" element={<PortalDashboardScreen />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </div>
      </div>
    </MaraAppearanceProvider>
  );
}

export default App;
