import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { MaraChrome } from "./components/MaraChrome";
import { MaraAppearanceProvider } from "./context/MaraAppearance";
import { CaseStudyScreen } from "./screens/CaseStudyScreen";
import { MaraHomePage } from "./screens/MaraHomePage";
import { ResumeScreen } from "./screens/ResumeScreen";
import { WorkPage } from "./screens/WorkPage";

function App() {
  return (
    <MaraAppearanceProvider>
      <div className="app-stack">
        <div className="mara-noise" aria-hidden />
        <MaraChrome />
        <div className="mara-router">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MaraHomePage />} />
              <Route path="/work" element={<WorkPage />} />
              <Route path="/resume" element={<ResumeScreen />} />
              <Route path="/project/:slug" element={<CaseStudyScreen />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </MaraAppearanceProvider>
  );
}

export default App;
