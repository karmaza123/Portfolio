import { Link } from "react-router-dom";
import { MaraHeader } from "../components/MaraHeader";
import { CONTACT_EMAIL, CONTACT_MAILTO } from "../constants/contact";
import { Reveal } from "../components/Reveal";
import { SiteFooter } from "../components/SiteFooter";
import "./MaraHomePage.css";
import "./ResumeScreen.css";

const SUMMARY_PARAS = [
  "Senior Product Designer with 10+ years designing web and mobile products for fintech, energy, B2B and creator-economy platforms.",
  "I own the full process end to end — research, flows, prototyping, UI and design systems — and ship my own designs to production in React and TypeScript.",
  "I build Figma component libraries and design tokens wired directly into code, with full light/dark theming, and work remotely with distributed, cross-functional teams.",
] as const;

const SKILLS = [
  "UX/UI & interaction design",
  "User research & usability testing",
  "User flows & information architecture",
  "Wireframing & prototyping",
  "Design systems, tokens & theming",
  "Accessibility & responsive design",
  "React, TypeScript & Material UI",
  "Fintech & payments (SEPA direct debit)",
  "SaaS dashboards & admin portals",
  "Figma, FigJam, Illustrator, Photoshop",
  "Jira, Git & code review",
  "Brand identity & visual design",
] as const;

const EXPERIENCE = [
  {
    num: "01",
    company: "PowerPay",
    role: "Senior Product Designer · Full-time",
    period: "May 2025 — Present",
    companyLine:
      "Energy-sector fintech startup with consumer, supplier, producer and trader portals.",
    description:
      "Design the financial product end to end and ship it in production React/TypeScript. Designed the SEPA direct-debit mandate flow, own the Figma component library and tokens wired to Material UI, delivered full light/dark theming, redesigned table filtering across the dashboard, and designed landing pages for all four audiences.",
  },
  {
    num: "02",
    company: "Independent",
    role: "Product & Brand Designer",
    period: "June 2014 — Present",
    companyLine:
      "Freelance practice alongside full-time roles; full-time freelance June 2024 — May 2025.",
    description:
      "Mintly, a creator-economy platform: product design and a complete design system with dark/light themes. Ancestry Tree, a genealogy product: desktop and mobile profile with a working front-end prototype. Product UI, landing pages, brand identity and print for clients across industries.",
  },
  {
    num: "03",
    company: "Nordasec",
    role: "Product Designer · Remote (Tallinn, Estonia)",
    period: "June 2022 — June 2024",
    companyLine: "B2B digital services provider.",
    description:
      "Led UX/UI design for B2B digital products end to end. Ran user research and wireframing to shape product direction, and partnered with engineering, product and business teams to turn requirements into usable interfaces.",
  },
  {
    num: "04",
    company: "BetSolutions",
    role: "Product Designer",
    period: "January 2021 — June 2022",
    companyLine: "B2B digital entertainment products.",
    description:
      "Designed player-facing products focused on engagement; ran research, prototyping and testing, iterated on results, and worked with engineering and product through release.",
  },
  {
    num: "05",
    company: "Webiz Georgia",
    role: "Product Designer",
    period: "March 2020 — August 2020",
    companyLine: "B2C freelance platform.",
    description: "Product design, interface design and user flows, through developer handoff.",
  },
  {
    num: "06",
    company: "ProService",
    role: "UI/UX Designer",
    period: "October 2016 — March 2020",
    companyLine: "Digital services platform.",
    description:
      "UI/UX design for 3.5 years: user flows, interfaces and visual design, working with developers into production.",
  },
  {
    num: "07",
    company: "Smart Web Studio",
    role: "UI Designer",
    period: "January 2016 — September 2016",
    companyLine: "Design studio delivering digital solutions.",
    description: "UI design for client-facing products and marketing surfaces.",
  },
] as const;

const EDUCATION = [
  {
    school: '"ITVET" Information Technologies Academy',
    course: "Web Design & Development",
    location: "Tbilisi, Georgia",
    dates: "2015 — 2016",
  },
  {
    school: '"ITVET" Information Technologies Academy',
    course: "Graphic Design & Animation",
    location: "Tbilisi, Georgia",
    dates: "2014 — 2015",
  },
] as const;

/** Icon links in the hero; same targets as the Connect section below. */
const QUICK_LINKS = [
  {
    label: `Email ${CONTACT_EMAIL}`,
    href: CONTACT_MAILTO,
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
  },
  {
    label: "Call +995 597 73 48 70",
    href: "tel:+995597734870",
    icon: (
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/karmaza/",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
      </>
    ),
  },
  {
    label: "Behance",
    href: "https://www.behance.net/karmazan",
    icon: (
      <>
        <path d="M3 6h5a3 3 0 0 1 0 6H3zM3 12h6a3 3 0 0 1 0 6H3z" />
        <path d="M14 14h7a3.5 3.5 0 1 0-1 2.5M15 7h5" />
      </>
    ),
  },
] as const;

/** Served from `/public` at dev and build time */
const RESUME_PDF_URL = "/Dimitri-Karmazanashvili-Resume.pdf";

export function ResumeScreen() {
  return (
    <div className="mp mp-resume">
      <MaraHeader active="resume" />

      <main id="main-content" tabIndex={-1}>
      <header className="mpr-hero">
        <Reveal>
          <Link to="/" className="mpr-back mpr-back--hero-top">
            ← Back to portfolio
          </Link>
          <p className="mpr-hero-kicker">Senior Product Designer — Tbilisi</p>
          <h1 className="mpr-hero-title">
            Dimitri
            <br />
            <span className="mpr-hero-title-accent">Karmazanashvili</span>
          </h1>
          <p className="mpr-hero-lead">
            Product design, design systems and design engineering for fintech, energy and B2B platforms — from research to production React.
          </p>
          <div className="mpr-hero-actions">
            <a
              href={RESUME_PDF_URL}
              className="mpr-download"
              download="Dimitri-Karmazanashvili-Resume.pdf"
            >
              Download resume <span className="mpr-download-icon" aria-hidden>↓</span>
            </a>
          </div>
        </Reveal>
        <Reveal staggerIndex={1} className="mpr-quick-reveal">
          <nav className="mpr-quick" aria-label="Quick contact">
            {QUICK_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="mpr-quick-link"
                aria-label={l.label}
                title={l.label}
                {...(l.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
              >
                <svg viewBox="0 0 24 24" aria-hidden>
                  {l.icon}
                </svg>
              </a>
            ))}
          </nav>
        </Reveal>
      </header>

      <section className="mpr-section mpr-summary" aria-labelledby="mpr-summary-h">
        <Reveal>
          <div className="mpr-section-head">
            <span className="mp-section-label">[ Summary ]</span>
            <h2 id="mpr-summary-h" className="mpr-section-title">
              Profile
            </h2>
          </div>
          <div className="mpr-summary-body">
            {SUMMARY_PARAS.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="mpr-section mpr-exp-wrap" aria-labelledby="mpr-exp-h">
        <Reveal>
          <div className="mpr-section-head">
            <span className="mp-section-label">[ Experience ]</span>
            <h2 id="mpr-exp-h" className="mpr-section-title">
              Work history
            </h2>
          </div>
        </Reveal>
        <div className="mpr-exp-list">
          {EXPERIENCE.map((job, i) => (
            <Reveal key={job.company} staggerIndex={i % 5}>
              <article className="mpr-exp-row">
                <span className="mpr-exp-num">{job.num}</span>
                <div className="mpr-exp-main">
                  <div className="mpr-exp-top">
                    <h3 className="mpr-exp-company">{job.company}</h3>
                    <span className="mpr-exp-period">{job.period}</span>
                  </div>
                  <p className="mpr-exp-role">{job.role}</p>
                  <p className="mpr-exp-company-desc">{job.companyLine}</p>
                  <p className="mpr-exp-desc">{job.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mpr-section mpr-skills-wrap" aria-labelledby="mpr-skills-h">
        <Reveal>
          <div className="mpr-section-head">
            <span className="mp-section-label">[ Skills ]</span>
            <h2 id="mpr-skills-h" className="mpr-section-title">
              Capabilities
            </h2>
          </div>
        </Reveal>
        <div className="mpr-skills-grid">
          {SKILLS.map((skill, i) => (
            <Reveal key={skill} staggerIndex={i % 6}>
              <div className="mpr-skill-cell">
                <span className="mpr-skill-text">{skill}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="mpr-split">
        <section className="mpr-section mpr-edu" aria-labelledby="mpr-edu-h">
          <Reveal>
            <div className="mpr-section-head">
              <span className="mp-section-label">[ Education ]</span>
              <h2 id="mpr-edu-h" className="mpr-section-title">
                Training
              </h2>
            </div>
            <ul className="mpr-edu-list">
              {EDUCATION.map((e) => (
                <li key={e.course} className="mpr-edu-card">
                  <p className="mpr-edu-school">{e.school}</p>
                  <p className="mpr-edu-course">{e.course}</p>
                  <p className="mpr-edu-meta">
                    {e.location} · {e.dates}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        <section className="mpr-section mpr-contact" aria-labelledby="mpr-contact-h">
          <Reveal staggerIndex={1}>
            <div className="mpr-section-head">
              <span className="mp-section-label">[ Contact ]</span>
              <h2 id="mpr-contact-h" className="mpr-section-title">
                Connect
              </h2>
            </div>
            <ul className="mpr-contact-list">
              <li>
                <a href={CONTACT_MAILTO} className="mpr-contact-link">
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a href="tel:+995597734870" className="mpr-contact-link">
                  +995 597 73 48 70
                </a>
              </li>
              <li>
                <a
                  href="https://www.behance.net/karmazan"
                  className="mpr-contact-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  behance.net/karmazan
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/in/karmaza/"
                  className="mpr-contact-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  linkedin.com/in/karmaza
                </a>
              </li>
            </ul>
          </Reveal>
        </section>
      </div>
      </main>

      <SiteFooter />
    </div>
  );
}
