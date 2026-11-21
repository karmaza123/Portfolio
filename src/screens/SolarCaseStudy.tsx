import { useEffect, useRef, useState, type CSSProperties } from "react";
import { MaraHeader } from "../components/MaraHeader";
import { Reveal } from "../components/Reveal";
import { CaseStudyFooter, CaseStudyTop } from "../components/CaseStudyFrame";
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

/** The three parks in the concept (site's #meadow / #alpine / #desert). */
const PARKS = [
  { id: "meadow", name: "Kakheti", where: "Alazani Valley", since: "May 2024", hue: "#4a8f6a" },
  { id: "alpine", name: "Gudauri", where: "2,196 m, mountains", since: "Oct 2025", hue: "#4f7fb0" },
  { id: "desert", name: "Udabno", where: "Kvemo Kartli steppe", since: "Mar 2025", hue: "#c08a3e" },
] as const;

/**
 * Tour steps. `box` = the card's rectangle on the screenshot, in %
 * [left, top, width, height]. Without a box the whole screen is shown.
 */
type Step = { kicker: string; title: string; body: string; box?: readonly number[] };

const STEPS: readonly Step[] = [
  {
    kicker: "Overview",
    title: "Three parks, one control room",
    body: "Valley, mountain and steppe. Each park gets its own live 3D model with its terrain and weather, while the cards around it stay the same, so an operator reads any site the same way. Switch parks above the screen.",
  },
  {
    kicker: "01 · Briefing",
    title: "One sentence first",
    body: "\"Running 7% below expected, mainly Inverter D.\" The operator knows the state of the park before reading a single chart, with what it is costing right now.",
    box: [1, 1.6, 20, 33.2],
  },
  {
    kicker: "02 · Live output",
    title: "Numbers with context",
    body: "8.29 MW means little alone. The gauge shows it against the 9.6 MVA limit and the expected 8.88 MW, with park health measured against its targets.",
    box: [1, 36.2, 20, 46.2],
  },
  {
    kicker: "03 · The site",
    title: "Faults where they happen",
    body: "Alarms are pinned to the exact table, string or inverter on the map. Red for faults, amber for warnings, so a technician knows where to walk.",
    box: [21, 22, 52, 50],
  },
  {
    kicker: "04 · Production & money",
    title: "Every fault has a price",
    body: "Output is drawn against expected and forecast through the day, and losses are shown in euros, so the team fixes the costliest problem first.",
    box: [76.5, 1.6, 22.5, 53.6],
  },
  {
    kicker: "05 · Weather & cameras",
    title: "What's coming, what's there",
    body: "Today's conditions, a four-day energy forecast and live site cameras, so a crew can check a block before driving out to it.",
    box: [76.5, 56.6, 22.5, 41.9],
  },
];

/** Index of the step whose block is nearest the middle of the viewport. */
function useActiveStep(refs: React.RefObject<(HTMLElement | null)[]>) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const update = () => {
      const mid = window.innerHeight / 2;
      let best = 0;
      let bestDist = Infinity;
      refs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActive(best);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [refs]);
  return active;
}

export function SolarCaseStudy() {
  const stepRefs = useRef<(HTMLElement | null)[]>([]);
  const active = useActiveStep(stepRefs);
  const box = STEPS[active].box;
  const [park, setPark] = useState<(typeof PARKS)[number]["id"]>("meadow");
  const hue = PARKS.find((p) => p.id === park)!.hue;

  // Gentle push-in toward the highlighted card; the spotlight does the pointing.
  const cx = box ? box[0] + box[2] / 2 : 50;
  const cy = box ? box[1] + box[3] / 2 : 50;
  const screenStyle = {
    transformOrigin: `${cx}% ${cy}%`,
    transform: box ? "scale(1.06)" : "scale(1)",
  } as CSSProperties;
  const spotStyle = (
    box
      ? { left: `${box[0]}%`, top: `${box[1]}%`, width: `${box[2]}%`, height: `${box[3]}%`, opacity: 1 }
      : { left: "0%", top: "0%", width: "100%", height: "100%", opacity: 0 }
  ) as CSSProperties;

  return (
    <div className="aa sl" style={{ "--sl-amber": hue } as CSSProperties}>
      <MaraHeader active="work" />

      <CaseStudyTop title="Sunfield — Solar parks concept" />

      <main id="main-content" tabIndex={-1}>
        <Reveal blur>
          <section className="aa-section sl-hero">
            <h1 className="aa-title">Sunfield, Solar Parks</h1>
            <p className="sl-lede">
              A control room for three solar parks across Georgia: a valley, a mountain pass and a desert steppe. Operators usually
              jump between a monitoring tool, a spreadsheet and a map to answer one
              question: are we producing what we should, and if not, why? This concept
              answers it on one screen.
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

        <section className="sl-tour" aria-label="Product tour">
          <div className="sl-stage">
            <div className="sl-parks" role="tablist" aria-label="Choose a park">
              {PARKS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={park === p.id}
                  className={`sl-park${park === p.id ? " is-on" : ""}`}
                  style={{ "--park": p.hue } as CSSProperties}
                  onClick={() => setPark(p.id)}
                >
                  <span className="sl-park-name">{p.name}</span>
                  <span className="sl-park-where">
                    {p.where} · since {p.since}
                  </span>
                </button>
              ))}
            </div>
            <div className="sl-browser">
              <div className="sl-browser-bar" aria-hidden>
                <span />
                <span />
                <span />
                <em>solar.karmaza.design</em>
              </div>
              <div className="sl-screen">
                <div className="sl-screen-inner" style={screenStyle}>
                  {PARKS.map((p) => (
                    <img
                      key={p.id}
                      className={park === p.id ? "is-on" : undefined}
                      src={`${IMG}/${p.id}-desktop.png`}
                      alt={
                        park === p.id
                          ? `Sunfield ${p.name} dashboard: briefing, live output, 3D park map, production chart, weather and cameras`
                          : ""
                      }
                      aria-hidden={park !== p.id}
                    />
                  ))}
                  <span className="sl-spot" style={spotStyle} aria-hidden />
                </div>
              </div>
            </div>
            <ol className="sl-progress" aria-hidden>
              {STEPS.map((s, i) => (
                <li key={s.title} className={i === active ? "is-on" : i < active ? "is-done" : undefined} />
              ))}
            </ol>
          </div>

          <div className="sl-steps">
            {STEPS.map((s, i) => (
              <article
                key={s.title}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                className={`sl-step${i === active ? " is-on" : ""}`}
              >
                <p className="sl-step-kicker">{s.kicker}</p>
                <h2 className="sl-step-title">{s.title}</h2>
                <p className="sl-step-body">{s.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="aa-section sl-mobile">
          <Reveal className="sl-mobile-copy">
            <p className="sl-step-kicker">Mobile</p>
            <h2 className="aa-h2">The map stays on screen</h2>
            <p>
              On a phone the output gauge sits on top, tools fold into a compact bar, and
              the park summary slides up as a sheet, so a technician on site can check a
              block without losing the map.
            </p>
          </Reveal>
          <div className="sl-phones">
            {PARKS.map((p, i) => (
              <Reveal key={p.id} staggerIndex={i + 1}>
                <figure className={`sl-phone-wrap${i === 1 ? " sl-phone-wrap--mid" : ""}`}>
                  <div className="sl-phone">
                    <img src={`${IMG}/${p.id}-mobile.png`} alt={`Sunfield ${p.name} on mobile`} />
                  </div>
                  <figcaption style={{ "--park": p.hue } as CSSProperties}>{p.where}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>

        <CaseStudyFooter slug="solar-concept" />
      </main>
    </div>
  );
}
