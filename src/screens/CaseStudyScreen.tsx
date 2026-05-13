import type { CSSProperties } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Reveal } from "../components/Reveal";
import { getCaseStudy } from "../data/caseStudyContent";
import "./CaseStudyScreen.css";

const WORKFLOW_STEPS = [
  "Research & Discovery",
  "Concept Development",
  "Brand Identity & Visual Design",
  "UI/UX Design for Digital Platforms",
  "Iteration & Refinement",
  "Finalization & Implementation",
] as const;

function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M8 72V24c0-8 8-16 24-16s24 8 24 16v48"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M20 52c4-12 10-18 12-22 2 4 8 10 12 22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="38" r="4" fill="currentColor" />
    </svg>
  );
}

export function CaseStudyScreen() {
  const { slug } = useParams();
  const data = getCaseStudy(slug);

  if (!data) {
    return <Navigate to="/" replace />;
  }

  const themeStyle = {
    ...(data.accentGold ? { "--aa-gold": data.accentGold } : {}),
    ...(data.accentTeal ? { "--aa-teal": data.accentTeal } : {}),
  } as CSSProperties;

  return (
    <div className="aa" style={themeStyle}>
      <Reveal className="aa-top-reveal">
        <header className="aa-top">
          <Link to="/" className="aa-back">
            ← Portfolio
          </Link>
          <div className="aa-brand" aria-label={data.brandLine}>
            <LogoMark className="aa-brand-mark" />
            <span className="aa-brand-text">{data.brandLine}</span>
          </div>
          <span className="aa-top-spacer" aria-hidden />
        </header>
      </Reveal>

      <Reveal blur className="aa-hero-reveal">
        <section className="aa-hero aa-section">
          <h1 className="aa-title">{data.heroTitle}</h1>
          <div className="aa-collage" aria-hidden>
            <div className="aa-collage-piece aa-collage-piece--1" />
            <div className="aa-collage-piece aa-collage-piece--2" />
            <div className="aa-collage-piece aa-collage-piece--3" />
            <div className="aa-collage-piece aa-collage-piece--4" />
          </div>
          <div className="aa-prose">
            <p>{data.intro}</p>
          </div>
          <div className="aa-split">
            <div>
              <h2 className="aa-h2">{data.purposeHeading}</h2>
              <ul className="aa-list">
                {data.purposePoints.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
            <div className="aa-stationery">
              <div className="aa-envelope aa-envelope--front">
                <span className="aa-envelope-logo">{data.envelopeWord}</span>
                <span className="aa-envelope-meta">{data.envelopeMeta}</span>
              </div>
              <div className="aa-envelope aa-envelope--back">
                <span className="aa-envelope-back-line" />
                <span className="aa-envelope-back-line" />
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal delayMs={60} className="aa-workflow-reveal">
        <section className="aa-workflow aa-section">
          <h2 className="aa-workflow-title">Workflow</h2>
          <ol className="aa-steps">
            {WORKFLOW_STEPS.map((label, i) => (
              <li key={label} className="aa-step">
                <Reveal staggerIndex={i} className="aa-step-reveal">
                  <>
                    <span className="aa-step-node">{i + 1}</span>
                    <span className="aa-step-label">{label}</span>
                  </>
                </Reveal>
              </li>
            ))}
          </ol>
        </section>
      </Reveal>

      <Reveal delayMs={40} className="aa-logo-block-reveal">
        <section className="aa-section aa-logo-block">
          <h2 className="aa-h2 aa-h2--light">{data.guidelinesHeading}</h2>
          <div className="aa-logo-grid">
            <Reveal staggerIndex={0} className="aa-logo-cell">
          <div className="aa-logo-panel aa-logo-panel--grid">
            <div className="aa-logo-grid-bg" />
            <div className="aa-logo-lockup aa-logo-lockup--light">
              <LogoMark className="aa-logo-svg" />
              <span>{data.lockupLine}</span>
            </div>
          </div>
            </Reveal>
            <Reveal staggerIndex={1} className="aa-logo-cell">
          <div className="aa-logo-panel">
            <p className="aa-caption">Primary lockups</p>
            <div className="aa-logo-rows">
              <div className="aa-logo-lockup aa-logo-lockup--stack">
                <LogoMark className="aa-logo-svg aa-logo-svg--sm" />
                <span>Stacked</span>
              </div>
              <div className="aa-logo-lockup aa-logo-lockup--inline">
                <LogoMark className="aa-logo-svg aa-logo-svg--sm" />
                <span>Horizontal</span>
              </div>
            </div>
            <div className="aa-logo-rows aa-logo-rows--gold">
              <div className="aa-logo-lockup aa-logo-lockup--gold">
                <LogoMark className="aa-logo-svg aa-logo-svg--sm" />
                <span>Accent on dark</span>
              </div>
            </div>
          </div>
            </Reveal>
            <Reveal staggerIndex={2} className="aa-logo-cell">
          <div className="aa-logo-panel aa-logo-panel--rules">
            <div>
              <p className="aa-caption">Minimum size</p>
              <p className="aa-rule-text">Print: 28mm width · Digital: 120px width minimum.</p>
            </div>
            <div className="aa-clearspace">
              <p className="aa-caption">Minimum clear space</p>
              <div className="aa-clearspace-box">
                <span className="aa-clearspace-x">×</span>
                <div className="aa-clearspace-inner">
                  <LogoMark className="aa-logo-svg aa-logo-svg--xs" />
                </div>
              </div>
            </div>
            <div>
              <p className="aa-caption">Logo mark</p>
              <div className="aa-mark-solo">
                <LogoMark className="aa-logo-svg" />
              </div>
            </div>
          </div>
            </Reveal>
        </div>
        </section>
      </Reveal>

      <Reveal className="aa-assets-reveal">
        <section className="aa-section aa-assets">
          <p className="aa-assets-lede">{data.assetLede}</p>
          <div className="aa-assets-grid">
            <Reveal staggerIndex={0} className="aa-asset-reveal aa-asset-reveal--mag">
              <article className="aa-asset aa-asset--mag">
                <span className="aa-asset-tag">{data.editorialTag}</span>
                <h3 className="aa-asset-title">{data.editorialTitle}</h3>
                <p className="aa-asset-sub">{data.editorialSub}</p>
              </article>
            </Reveal>
            <Reveal staggerIndex={1} className="aa-asset-reveal aa-asset-reveal--card-v">
              <article className="aa-asset aa-asset--card-v">
                <LogoMark className="aa-logo-svg aa-logo-svg--sm" />
                <span className="aa-asset-small">Business card · vertical</span>
              </article>
            </Reveal>
            <Reveal staggerIndex={2} className="aa-asset-reveal aa-asset-reveal--card-h">
              <article className="aa-asset aa-asset--card-h">
                <div>
                  <p className="aa-asset-name">{data.horizontalName}</p>
                  <p className="aa-asset-role">{data.horizontalRole}</p>
                </div>
                <span className="aa-asset-small">{data.horizontalOrg}</span>
              </article>
            </Reveal>
            <Reveal staggerIndex={3} className="aa-asset-reveal aa-asset-reveal--letter">
              <article className="aa-asset aa-asset--letter">
                <div className="aa-letterhead-logo">{data.letterheadWord}</div>
                <p className="aa-letter-lines" />
                <p className="aa-letter-lines aa-letter-lines--short" />
              </article>
            </Reveal>
            <Reveal staggerIndex={4} className="aa-asset-reveal aa-asset-reveal--poster">
              <article className="aa-asset aa-asset--poster">
                <span className="aa-poster-kicker">{data.posterKicker}</span>
                <h3 className="aa-poster-title">{data.posterTitle}</h3>
              </article>
            </Reveal>
            <Reveal staggerIndex={5} className="aa-asset-reveal aa-asset-reveal--ticket">
              <article className="aa-asset aa-asset--ticket">
                <div className="aa-ticket-bar" />
                <div className="aa-ticket-body">
                  <span className="aa-ticket-title">{data.ticketTitle}</span>
                  <span className="aa-ticket-date">{data.ticketDate}</span>
                  <span className="aa-ticket-code">||||| |||| |||</span>
                </div>
              </article>
            </Reveal>
          </div>
        </section>
      </Reveal>

      <Reveal delayMs={100} className="aa-foot-reveal">
        <footer className="aa-foot">
          <Link to="/" className="aa-back aa-back--foot">
            ← All projects
          </Link>
        </footer>
      </Reveal>
    </div>
  );
}
