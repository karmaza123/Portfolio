import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { HOME_PROJECTS } from "../data/homeProjects";
import { Reveal } from "./Reveal";

/**
 * The shared frame around every case study: the same top bar and the same
 * footer on every project page, so the portfolio reads as one flow while each
 * project keeps its own design in between.
 */
export function CaseStudyTop({ title, mark }: { title: string; mark?: ReactNode }) {
  return (
    <Reveal className="aa-top-reveal">
      <header className="aa-top">
        <Link to="/work" className="aa-back">
          ← All work
        </Link>
        <div className="aa-brand" aria-label={title}>
          {mark}
          <span className="aa-brand-text">{title}</span>
        </div>
      </header>
    </Reveal>
  );
}

export function CaseStudyFooter({ slug }: { slug: string | undefined }) {
  const i = HOME_PROJECTS.findIndex((p) => p.slug === slug);
  const next = HOME_PROJECTS[(i + 1) % HOME_PROJECTS.length];
  // Not wrapped in Reveal: as the last element it may never cross Reveal's trigger margin.
  return (
      <footer className="aa-foot">
        <Link to="/work" className="aa-back">
          ← All work
        </Link>
        {next && next.slug !== slug ? (
          <Link to={`/project/${next.slug}`} className="aa-next">
            <span className="aa-next-label">Next project · {next.num}</span>
            <span className="aa-next-title">{next.title} →</span>
          </Link>
        ) : null}
      </footer>
  );
}
