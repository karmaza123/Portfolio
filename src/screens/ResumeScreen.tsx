import { Link } from "react-router-dom";
import { MaraHeader } from "../components/MaraHeader";
import { CONTACT_EMAIL, CONTACT_MAILTO } from "../constants/contact";
import { Reveal } from "../components/Reveal";
import "./MaraHomePage.css";
import "./ResumeScreen.css";

const SUMMARY_PARAS = [
  "10+ years as a product designer, creating user-focused designs for digital and physical products. Skilled in concept development, prototyping, and user testing.",
  "Expert at collaborating with cross-functional teams to deliver functional and visually appealing products.",
  "Passionate about innovation and enhancing user experience through design.",
] as const;

const SKILLS = [
  "User-Centered Design (UCD)",
  "UI/UX Design",
  "Design Thinking & Problem-Solving",
  "Adobe Creative Suite (Illustrator, Photoshop)",
  "Figma, Sketch, and InVision",
  "Interaction Design",
  "Material Selection & Manufacturing Processes",
  "Collaboration with Engineering and Marketing Teams",
  "Brand Identity & Visual Design",
  "Presentation & Communication Skills",
] as const;

const EXPERIENCE = [
  {
    num: "01",
    company: "Powerpay",
    role: "Product Designer",
    period: "May 2025 — Present",
    companyLine:
      "Innovative startup building digital products for the energy sector — digital financial products.",
    description:
      "UX/UI and product strategy across mobile apps, web interfaces, and admin systems — involved in nearly every stage of the product development process.",
  },
  {
    num: "02",
    company: "Nordsec",
    role: "Product Designer",
    period: "June 2022 — October 2022",
    companyLine: "B2B digital services for the gaming sector.",
    description:
      "UX/UI for digital products: research, wireframing, and cross-functional collaboration to deliver user-friendly, effective design solutions.",
  },
  {
    num: "03",
    company: "Betsolutions",
    role: "Product Designer",
    period: "January 2021 — June 2022",
    companyLine: "Digital games for the gambling sector.",
    description:
      "Designed engaging gaming products to drive user satisfaction. Research, prototyping, and testing aligned with business strategy and user experience goals.",
  },
  {
    num: "04",
    company: "Webiz Georgia",
    role: "Product Designer",
    period: "March 2020 — August 2020",
    companyLine: "B2C freelance platform providing digital solutions.",
    description: "End-to-end product design for the platform offering.",
  },
  {
    num: "05",
    company: "Proservice",
    role: "UI/UX Designer",
    period: "October 2016 — March 2020",
    companyLine: "Digital service provider platform.",
    description: "UX/UI design for web and mobile products.",
  },
  {
    num: "06",
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

/** Served from `/public` at dev and build time */
const RESUME_PDF_URL = "/Dimitri-Karmazanashvili-Resume.pdf";

export function ResumeScreen() {
  return (
    <div className="mp mp-resume">
      <MaraHeader active="resume" />

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
            Product design across fintech, gaming, and platforms — from discovery to developer-ready UI.
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

      <footer className="mp-footer">
        <p className="mp-footer-left">© {new Date().getFullYear()} Dimitri Karmazanashvili</p>
        <p className="mp-footer-right">Tbilisi — Working globally</p>
      </footer>
    </div>
  );
}
