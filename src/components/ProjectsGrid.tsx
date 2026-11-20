import { useState } from "react";
import { Link } from "react-router-dom";
import { getCaseStudy } from "../data/caseStudyContent";
import type { HomeProject } from "../data/homeProjects";
import { Reveal } from "./Reveal";
import "./ProjectsGrid.css";

type ProjectsGridProps = {
  projects: readonly HomeProject[];
};

type Layout = "list" | "grid";
const STORAGE_KEY = "mp-projects-layout";

function readLayout(): Layout {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "grid" ? "grid" : "list";
  } catch {
    return "list";
  }
}

/** Cover image for the grid view: explicit thumb, else the case study's first image. */
function thumbFor(p: HomeProject): string | undefined {
  if (p.thumb) return p.thumb;
  const cs = getCaseStudy(p.slug);
  return cs?.heroImage ?? cs?.gallery?.[0]?.src;
}

/** External projects open in a new tab; the rest route to their case study. */
function ProjectLink({
  p,
  className,
  children,
}: {
  p: HomeProject;
  className: string;
  children: React.ReactNode;
}) {
  if (p.href) {
    return (
      <a href={p.href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link to={`/project/${p.slug}`} className={className}>
      {children}
    </Link>
  );
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  const [layout, setLayout] = useState<Layout>(readLayout);

  const choose = (l: Layout) => {
    setLayout(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* storage unavailable — keep the choice for this visit only */
    }
  };

  return (
    <>
      <div className="mp-layout-switch" role="group" aria-label="Project layout">
        <button
          type="button"
          className={layout === "list" ? "is-on" : ""}
          aria-pressed={layout === "list"}
          onClick={() => choose("list")}
        >
          <svg viewBox="0 0 16 16" aria-hidden>
            <path d="M2 4h12M2 8h12M2 12h12" />
          </svg>
          List
        </button>
        <button
          type="button"
          className={layout === "grid" ? "is-on" : ""}
          aria-pressed={layout === "grid"}
          onClick={() => choose("grid")}
        >
          <svg viewBox="0 0 16 16" aria-hidden>
            <rect x="2" y="2" width="5" height="5" rx="1" />
            <rect x="9" y="2" width="5" height="5" rx="1" />
            <rect x="2" y="9" width="5" height="5" rx="1" />
            <rect x="9" y="9" width="5" height="5" rx="1" />
          </svg>
          Grid
        </button>
      </div>

      {layout === "grid" ? (
        <div className="mp-projects-cards">
          {projects.map((p, i) => {
            const thumb = thumbFor(p);
            return (
              <Reveal key={p.slug} staggerIndex={i % 6}>
                <ProjectLink p={p} className="mp-card">
                  <span className="mp-card-media">
                    {thumb ? (
                      <img src={thumb} alt="" loading="lazy" />
                    ) : (
                      <span className="mp-card-fallback" aria-hidden>
                        {p.title.charAt(0)}
                      </span>
                    )}
                  </span>
                  <span className="mp-card-body">
                    <span className="mp-card-top">
                      <span className="mp-project-num">{p.num}</span>
                      <span className="mp-card-year">{p.year}</span>
                    </span>
                    <h3 className="mp-card-title">{p.title}</h3>
                    <span className="mp-project-tags">
                      {p.tags.map((tag) => (
                        <span key={tag} className="mp-tag">
                          {tag}
                        </span>
                      ))}
                    </span>
                  </span>
                </ProjectLink>
              </Reveal>
            );
          })}
        </div>
      ) : (
        <div className="mp-projects-grid">
          {projects.map((p, i) => (
            <Reveal key={p.slug} staggerIndex={i % 5}>
              <ProjectLink p={p} className="mp-project-item">
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
              </ProjectLink>
            </Reveal>
          ))}
        </div>
      )}
    </>
  );
}
