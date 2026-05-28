import { Link } from "react-router-dom";
import { CONTACT_EMAIL, CONTACT_MAILTO } from "../constants/contact";
import { HeroCanvas } from "../components/HeroCanvas";
import { MaraHeader } from "../components/MaraHeader";
import { ProjectsGrid } from "../components/ProjectsGrid";
import { Reveal } from "../components/Reveal";
import { useIsMobileLayout } from "../hooks/useIsMobileLayout";
import { HOME_PROJECTS } from "../data/homeProjects";
import "./MaraHomePage.css";

const MARQUEE_ITEMS = [
  "UX Design",
  "Product Strategy",
  "Interface Design",
  "Design Systems",
  "Interaction Design",
  "User Research",
  "Prototyping",
  "Visual Design",
] as const;

const CLIENTS = ["Nordsec", "Betsolutions", "Webiz", "Proservice", "Smart Web", "ITVET"] as const;

const PROCESS = [
  {
    num: "01 /",
    title: "Discover",
    desc: "Deep-dive into users, market, and business goals. Interviews, research, and competitive context.",
  },
  {
    num: "02 /",
    title: "Define",
    desc: "Problem statements, journeys, and a brief everyone aligns on before high-fidelity work begins.",
  },
  {
    num: "03 /",
    title: "Design",
    desc: "Iterative UI and systems—wireframes to polished screens, tested early with real usage.",
  },
  {
    num: "04 /",
    title: "Deliver",
    desc: "Developer-ready specs and components. Close collaboration through implementation.",
  },
] as const;

const SKILLS = [
  { name: "UI/UX Design", width: "94%" },
  { name: "Design Systems", width: "88%" },
  { name: "Product Strategy", width: "82%" },
  { name: "Prototyping", width: "90%" },
  { name: "Brand & Visual", width: "85%" },
  { name: "Collaboration", width: "96%" },
] as const;

const AWARDS = [
  { name: "Product launches", year: "2022 — 2024", badge: "★" },
  { name: "Cross-industry work", year: "Healthcare · Finance · Gaming", badge: "★" },
  { name: "Global teams", year: "Remote & in-house", badge: "★" },
  { name: "8+ years craft", year: "Web & mobile", badge: "★" },
] as const;

const MOBILE_PROJECT_LIMIT = 4;

export function MaraHomePage() {
  const isMobile = useIsMobileLayout();
  const previewProjects =
    isMobile && HOME_PROJECTS.length > MOBILE_PROJECT_LIMIT
      ? HOME_PROJECTS.slice(0, MOBILE_PROJECT_LIMIT)
      : HOME_PROJECTS;
  const showViewMore = isMobile && HOME_PROJECTS.length > MOBILE_PROJECT_LIMIT;

  return (
    <div className="mp">
      <MaraHeader active="home" />

      <section className="mp-hero" aria-label="Introduction">
        <HeroCanvas />
        <div className="mp-hero-bg-text" aria-hidden>
          DESIGN
        </div>
        <p className="mp-hero-tag">Product Designer — Tbilisi</p>
        <h1 className="mp-hero-title">
          Crafting <em>digital</em>
          <br />
          experiences that
          <br />
          matter
        </h1>
        <div className="mp-hero-bottom">
          <p className="mp-hero-desc">
            I work at the intersection of strategy, brand, and interaction — turning complex problems
            into clear, human-centred products for web and mobile.
          </p>
          <div className="mp-hero-stats">
            <div>
              <span className="mp-stat-num">08+</span>
              <span className="mp-stat-label">Years</span>
            </div>
            <div>
              <span className="mp-stat-num">10+</span>
              <span className="mp-stat-label">Projects</span>
            </div>
            <div>
              <span className="mp-stat-num">∞</span>
              <span className="mp-stat-label">Curiosity</span>
            </div>
          </div>
          <a href="#work" className="mp-hero-cta" aria-describedby="work-heading">
            View selected work <span className="mp-hero-cta-arrow" aria-hidden>
              ↗
            </span>
          </a>
        </div>
      </section>

      <div className="mp-marquee-strip" aria-hidden>
        <div className="mp-marquee-track">
          <span className="mp-marquee-chunk">
            {MARQUEE_ITEMS.map((label) => (
              <span key={`a-${label}`} className="mp-marquee-pair">
                <span className="mp-marquee-item">{label}</span>
                <span className="mp-marquee-dot">✦</span>
              </span>
            ))}
          </span>
          <span className="mp-marquee-chunk">
            {MARQUEE_ITEMS.map((label) => (
              <span key={`b-${label}`} className="mp-marquee-pair">
                <span className="mp-marquee-item">{label}</span>
                <span className="mp-marquee-dot">✦</span>
              </span>
            ))}
          </span>
        </div>
      </div>

      <section id="work" className="mp-work" aria-labelledby="work-heading">
        <Reveal className="mp-section-header-wrap">
          <div className="mp-section-header">
            <span className="mp-section-label">[ 01 — Selected Work ]</span>
            <h2 id="work-heading" className="mp-section-title">
              Projects
            </h2>
          </div>
        </Reveal>
        <ProjectsGrid projects={previewProjects} />
        {showViewMore ? (
          <div className="mp-project-view-more">
            <Link to="/work" className="mp-view-more">
              View more
            </Link>
          </div>
        ) : null}
      </section>

      <section id="about" className="mp-about">
        <Reveal>
          <div className="mp-section-header">
            <span className="mp-section-label">[ 02 — About ]</span>
            <h2 className="mp-section-title">The Designer</h2>
          </div>
        </Reveal>
        <div className="mp-about-grid">
          <Reveal className="mp-about-left">
            <div className="mp-about-portrait">
              <div className="mp-about-portrait-inner">DK</div>
              <div className="mp-portrait-label">Dimitri Karmazanashvili — Tbilisi</div>
            </div>
          </Reveal>
          <Reveal staggerIndex={2} className="mp-about-right">
            <h2 className="mp-about-headline">
              Designing with
              <br />
              <em>intention.</em>
            </h2>
            <p>
              I&apos;m Dimitri — a product designer with over eight years of experience across web and
              mobile, from healthcare and finance to gaming and SaaS.
            </p>
            <p>
              My process is <strong>research-first</strong>. I align on goals and constraints, then ship
              UI with <strong>obsessive attention to detail</strong> — from information architecture to
              motion and handoff.
            </p>
            <p>
              I work as a senior IC with product and engineering teams, focusing on systems that scale.
            </p>
            <div className="mp-skills-grid">
              {SKILLS.map((s) => (
                <div key={s.name} className="mp-skill-item">
                  <div className="mp-skill-name">{s.name}</div>
                  <div className="mp-skill-bar">
                    <div className="mp-skill-bar-fill" style={{ width: s.width }} />
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mp-clients">
        <Reveal>
          <div className="mp-section-header">
            <span className="mp-section-label">[ 03 — Clients ]</span>
            <h2 className="mp-section-title">Trusted By</h2>
          </div>
        </Reveal>
        <Reveal>
          <div className="mp-clients-list">
            {CLIENTS.map((name) => (
              <div key={name} className="mp-client-item">
                <span className="mp-client-name">{name}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section id="process" className="mp-process">
        <Reveal>
          <div className="mp-section-header">
            <span className="mp-section-label">[ 04 — Process ]</span>
            <h2 className="mp-section-title">How I Work</h2>
          </div>
        </Reveal>
        <div className="mp-process-steps">
          {PROCESS.map((step, i) => (
            <Reveal key={step.title} staggerIndex={i}>
              <div className="mp-process-step">
                <p className="mp-step-num">{step.num}</p>
                <h3 className="mp-step-title">{step.title}</h3>
                <p className="mp-step-desc">{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mp-awards-row">
          {AWARDS.map((a, i) => (
            <Reveal key={a.name} staggerIndex={i}>
              <div className="mp-award-item">
                <div className="mp-award-badge">{a.badge}</div>
                <p className="mp-award-name">{a.name}</p>
                <p className="mp-award-year">{a.year}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="contact" className="mp-contact">
        <span className="mp-section-label mp-contact-label">[ 05 — Contact ]</span>
        <h2 className="mp-contact-headline">
          Let&apos;s build
          <br />
          something <em>real</em>
        </h2>
        <a href={CONTACT_MAILTO} className="mp-contact-email">
          {CONTACT_EMAIL}
        </a>
        <div className="mp-contact-links">
          <a href="https://www.behance.net/karmazan" className="mp-contact-link" target="_blank" rel="noreferrer">
            Behance
          </a>
          <Link to="/resume" className="mp-contact-link">
            Resume / CV
          </Link>
          <a href="tel:+995597734870" className="mp-contact-link">
            Phone
          </a>
        </div>
      </section>

      <footer className="mp-footer">
        <p className="mp-footer-left">© {new Date().getFullYear()} Dimitri Karmazanashvili</p>
        <p className="mp-footer-right">Tbilisi — Working globally</p>
      </footer>
    </div>
  );
}
