import { Link } from "react-router-dom";
import { MaraHeader } from "../components/MaraHeader";
import { Reveal } from "../components/Reveal";
import "./CaseStudyScreen.css";
import "./SolarCaseStudy.css";

const IMG = "/case-studies/solar";
const LIVE = "https://solar.karmaza.design/#desert";

const META = [
  ["Type", "Quick concept"],
  ["My Role", "Product Designer"],
  ["Focus", "Operations dashboard, 3D site view"],
  ["Year", "2026"],
] as const;

/** Detail crops of the desktop screen, shown as small animated cards. */
const DETAILS = [
  { label: "Operations briefing", pos: "0% 0%", zoom: "420%" },
  { label: "Live output & park health", pos: "0% 75%", zoom: "420%" },
  { label: "Production vs forecast", pos: "100% 25%", zoom: "420%" },
  { label: "Weather & live cameras", pos: "100% 95%", zoom: "420%" },
] as const;

export function SolarCaseStudy() {
  return (
    <div className="aa sl">
      <MaraHeader active="work" />

      <Reveal className="aa-top-reveal">
        <header className="aa-top">
          <Link to="/" className="aa-back">
            ← Portfolio
          </Link>
          <div className="aa-brand" aria-label="Solar — Quick concept">
            <span className="aa-brand-text">Solar — Quick concept</span>
          </div>
          <span className="aa-top-spacer" aria-hidden />
        </header>
      </Reveal>

      <main id="main-content" tabIndex={-1}>
        <Reveal blur>
          <section className="aa-section sl-hero">
            <h1 className="aa-title">Sunfield Udabno, Solar Park</h1>
            <p className="sl-lede">
              A control room for a solar park in the Georgian desert. One screen tells
              the operator how the park is doing right now, what is costing money, and
              where on the site the problem is.
            </p>
            <dl className="sl-meta">
              {META.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <a className="sl-live" href={LIVE} target="_blank" rel="noopener noreferrer">
              Open live concept ↗
            </a>
          </section>
        </Reveal>

        <Reveal>
          <section className="aa-section">
            <div className="sl-browser">
              <div className="sl-browser-bar" aria-hidden>
                <span />
                <span />
                <span />
                <em>solar.karmaza.design</em>
              </div>
              <div className="sl-browser-view">
                <img
                  src={`${IMG}/desktop.png`}
                  alt="Solar park dashboard on desktop: briefing, live output, 3D park map and production chart"
                />
              </div>
            </div>
          </section>
        </Reveal>

        <section className="aa-section sl-text">
          <Reveal>
            <h2 className="aa-h2">The problem</h2>
            <p>
              Park operators usually jump between a monitoring tool, a spreadsheet and a
              map to answer a simple question: are we producing what we should, and if
              not, why? Numbers like "8.29 MW" mean little without the expected value and
              the money behind them.
            </p>
          </Reveal>
          <Reveal staggerIndex={1}>
            <h2 className="aa-h2">The idea</h2>
            <p>
              Put the park itself in the middle. A live 3D model of the site shows every
              block, inverter and substation, with faults pinned exactly where they
              happen. Around it, plain-language cards answer the questions in order:
              how are we doing, what needs attention, what does it cost.
            </p>
          </Reveal>
        </section>

        <section className="aa-section sl-details">
          {DETAILS.map((d, i) => (
            <Reveal key={d.label} staggerIndex={i}>
              <figure className="sl-detail" style={{ animationDelay: `${i * -1.5}s` }}>
                <span
                  className="sl-detail-img"
                  role="img"
                  aria-label={d.label}
                  style={{
                    backgroundImage: `url(${IMG}/desktop.png)`,
                    backgroundPosition: d.pos,
                    backgroundSize: d.zoom,
                  }}
                />
                <figcaption>{d.label}</figcaption>
              </figure>
            </Reveal>
          ))}
        </section>

        <section className="aa-section sl-mobile">
          <Reveal className="sl-mobile-copy">
            <h2 className="aa-h2">On the go</h2>
            <p>
              On a phone the map stays full screen. The output gauge sits on top, tools in
              a compact bar, and the park summary slides up as a sheet, so a technician on
              site can check a block without losing the map.
            </p>
          </Reveal>
          <div className="sl-phones">
            <Reveal staggerIndex={1}>
              <div className="sl-phone">
                <img src={`${IMG}/mobile.png`} alt="Solar park map on mobile with output gauge" />
              </div>
            </Reveal>
            <Reveal staggerIndex={2}>
              <div className="sl-phone sl-phone--alt">
                <div className="sl-phone-scroll">
                  <img src={`${IMG}/mobile.png`} alt="" aria-hidden />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="aa-section sl-text">
          <Reveal>
            <h2 className="aa-h2">What it shows</h2>
            <ul className="sl-list">
              <li>A one-line status: "Running 7% below expected", with the main reason.</li>
              <li>Every fault priced in euros, so the team fixes the costliest first.</li>
              <li>Output against expected and forecast through the day.</li>
              <li>Weather, a four-day forecast and live site cameras in one place.</li>
            </ul>
          </Reveal>
        </section>
      </main>
    </div>
  );
}
