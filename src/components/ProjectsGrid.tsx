import { Link } from "react-router-dom";
import type { HomeProject } from "../data/homeProjects";
import { Reveal } from "./Reveal";

type ProjectsGridProps = {
  projects: readonly HomeProject[];
};

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  return (
    <div className="mp-projects-grid">
      {projects.map((p, i) => (
        <Reveal key={p.slug} staggerIndex={i % 5}>
          <Link to={`/project/${p.slug}`} className="mp-project-item">
            <span className="mp-project-num">{p.num}</span>
            <div className="mp-project-info">
              <h3>{p.title}</h3>
              <div className="mp-project-tags">
                {p.tags.map((tag) => (
                  <span key={tag} className="mp-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="mp-project-meta">
              <div className="mp-project-year">
                {p.year}
                {p.award ? (
                  <>
                    <br />
                    <span className="mp-project-award">{p.award}</span>
                  </>
                ) : null}
              </div>
              <span className="mp-project-arrow" aria-hidden>
                ↗
              </span>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
