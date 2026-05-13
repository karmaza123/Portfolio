import { Link } from "react-router-dom";
import { MaraHeader } from "../components/MaraHeader";
import { ProjectsGrid } from "../components/ProjectsGrid";
import { Reveal } from "../components/Reveal";
import { HOME_PROJECTS } from "../data/homeProjects";
import "./MaraHomePage.css";

export function WorkPage() {
  return (
    <div className="mp">
      <MaraHeader active="work" />

      <main>
        <section className="mp-work" aria-labelledby="mp-work-page-title">
          <Reveal className="mp-section-header-wrap">
            <div className="mp-section-header">
              <span className="mp-section-label">[ Selected Work ]</span>
              <h1 id="mp-work-page-title" className="mp-section-title">
                All projects
              </h1>
            </div>
          </Reveal>
          <ProjectsGrid projects={HOME_PROJECTS} />
          <p className="mp-work-back-wrap">
            <Link to="/" className="mp-work-back-link">
              ← Back to home
            </Link>
          </p>
        </section>
      </main>

      <footer className="mp-footer">
        <p className="mp-footer-left">© {new Date().getFullYear()} Dimitri Karmazanashvili</p>
        <p className="mp-footer-right">Tbilisi — Working globally</p>
      </footer>
    </div>
  );
}
