import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";
import { MaraHeader } from "../components/MaraHeader";
import { Reveal } from "../components/Reveal";
import { MintlyHeroStage } from "./MintlyHeroStage";
import { MintlyShowcase } from "./MintlyShowcase";
import "./CaseStudyScreen.css";
import "./MintlyCaseStudy.css";



const META = [
  ["Role", "Product designer"],
  ["Scope", "Audit · System · Redesign"],
  ["Year", "2026"],
  ["Status", "Shipping"],
] as const;

const HEADLINE_COUNTS = [
  { before: "76", after: "12", label: "Button variants" },
  { before: "21", after: "10", label: "Font sizes → text styles" },
  { before: "22", after: "9", label: "Paddings → 4-pt steps" },
  { before: "28", after: "3", label: "Shadows → depth levels" },
] as const;

const PROCESS = [
  {
    step: "01",
    name: "Measure",
    stat: "13",
    unit: "screens",
    body: "Every text, button, field, icon and container on the live product, desktop and phone.",
  },
  {
    step: "02",
    name: "Diagnose",
    stat: "25",
    unit: "findings",
    body: "Logged with where each appears, how severe it is, and its fix.",
    severity: true,
  },
  {
    step: "03",
    name: "Map",
    stat: "16",
    unit: "parts → components",
    body: "Each one-off part matched to one standard counterpart.",
  },
  {
    step: "04",
    name: "Systemize",
    stat: "27",
    unit: "color tokens",
    body: "Plus type, spacing, radius and depth — each named by role, not value.",
  },
  {
    step: "05",
    name: "Apply",
    stat: "124",
    unit: "screens rebuilt",
    body: "From components only, at 1440, 834 and 390 — now shipping.",
  },
] as const;

const SEVERITY = [
  { label: "Major", count: 5, tone: "major" },
  { label: "Minor", count: 16, tone: "minor" },
  { label: "Cosmetic", count: 4, tone: "cosmetic" },
] as const;

/** Font sizes found across the 13 audited screens, with how often each appears. */
const FONT_SIZES: readonly [number, number][] = [
  [8.8, 57], [9, 47], [9.6, 35], [10, 76], [10.4, 28], [11, 81], [11.2, 15], [11.52, 33],
  [12, 373], [12.48, 12], [13, 73], [14, 294], [15, 63], [16, 42], [18, 76], [20, 5],
  [24, 30], [26.4, 4], [30, 9], [36, 8], [48, 3],
];
const FONT_MAX = Math.max(...FONT_SIZES.map(([, n]) => n));

const INVENTORY = [
  { value: "6", label: "Font weights", note: "900 to 400; 800 and 900 on headings only" },
  { value: "34", label: "Size / line-height pairs", note: "13px text alone used three line heights" },
  { value: "23", label: "Letter-spacing values", note: "From −0.66px to +2.4px" },
  { value: "125", label: "Upper-case labels", note: "Forced capitals turn Georgian into Mtavruli" },
  { value: "22", label: "Padding values", note: "5 of them off any 4-pt grid" },
  { value: "14", label: "Gap values", note: "6, 10, 3 and 18 break the rhythm" },
  { value: "12", label: "Corner radii", note: "Capsule written two different ways" },
  { value: "28", label: "Depth styles", note: "22 shadows, 6 blur strengths" },
  { value: "76", label: "Button variants", note: "16 to 70px tall, weights 400–700" },
  { value: "15", label: "Text fields", note: "20 to 48px tall, 12–16px text" },
  { value: "25", label: "Icon size / weight combos", note: "8 to 64px, filled and outlined mixed" },
  { value: "18px", label: "Smallest tap target", note: "Below the 44 × 44 minimum" },
] as const;

const FINDINGS = [
  {
    code: "T1",
    severity: "Major",
    area: "Typography",
    title: "Too many text sizes, many too small",
    fix: "10 text styles, nothing below 12px, body at 17px.",
  },
  {
    code: "B1",
    severity: "Major",
    area: "Components",
    title: "76 kinds of button",
    fix: "Filled, Tinted, Gray and Plain in three sizes — 12 buttons.",
  },
  {
    code: "L2",
    severity: "Minor",
    area: "Layout",
    title: "A three-column frame on every screen",
    fix: "Sidebar plus content; notifications open from the toolbar.",
  },
] as const;

const SYSTEM_STATS = [
  { value: "27", label: "Color tokens, 2 themes" },
  { value: "21", label: "Text styles" },
  { value: "3", label: "Weights" },
  { value: "9", label: "Spacing steps" },
  { value: "10", label: "Radius tokens" },
  { value: "18", label: "Component groups" },
  { value: "5", label: "Scripts tested" },
] as const;

const TYPE_SCALE = [
  { name: "Large Title", size: 34, lh: 41, ka: 46, weight: 700 },
  { name: "Title 1", size: 28, lh: 34, ka: 38, weight: 700 },
  { name: "Title 2", size: 22, lh: 28, ka: 30, weight: 700 },
  { name: "Title 3", size: 20, lh: 25, ka: 28, weight: 600 },
  { name: "Headline", size: 17, lh: 22, ka: 24, weight: 600 },
  { name: "Body", size: 17, lh: 22, ka: 26, weight: 400 },
  { name: "Callout", size: 16, lh: 21, ka: 24, weight: 400 },
  { name: "Subheadline", size: 15, lh: 20, ka: 22, weight: 400 },
  { name: "Footnote", size: 13, lh: 18, ka: 20, weight: 400 },
  { name: "Caption 1", size: 12, lh: 16, ka: 18, weight: 400 },
] as const;

const WEIGHT_NAME: Record<number, string> = { 400: "Regular", 600: "Semibold", 700: "Bold" };

const SPACING = [4, 8, 12, 16, 20, 24, 32, 40, 48] as const;
const RADII = [
  { v: 8, name: "xs" },
  { v: 12, name: "sm" },
  { v: 14, name: "14" },
  { v: 16, name: "16" },
  { v: 18, name: "18" },
  { v: 20, name: "control" },
  { v: 22, name: "md" },
  { v: 28, name: "lg" },
  { v: 32, name: "xl" },
  { v: 999, name: "full" },
] as const;
const BUTTON_STYLES = ["Filled", "Tinted", "Gray", "Plain"] as const;
const BUTTON_SIZES = [
  { name: "S", h: 32, font: 12 },
  { name: "M", h: 40, font: 13 },
  { name: "L", h: 50, font: 15 },
] as const;
const DEPTH = [
  { name: "Base", note: "Screen background" },
  { name: "Raised", note: "Cards, grouped sections" },
  { name: "Overlay", note: "Sheets, menus, popovers" },
] as const;

const APPLIED_STATS = [
  { value: "124", label: "Screens and overlays" },
  { value: "3", label: "Breakpoints: 1440 · 834 · 390" },
  { value: "749", label: "Frames in total" },
  { value: "2 × 2", label: "Themes × languages" },
] as const;

function Count({ before, after, label }: { before: string; after: string; label: string }) {
  return (
    <div className="mt-count">
      <div className="mt-count-vals">
        <span className="mt-count-before">{before}</span>
        <span className="mt-count-arrow" aria-hidden>
          →
        </span>
        <span className="mt-count-after">{after}</span>
      </div>
      <div className="mt-count-label">
        <span className="mt-visually-hidden">
          {before} before, {after} after:{" "}
        </span>
        {label}
      </div>
    </div>
  );
}

function SectionHead({ id, label, title, children }: { id: string; label: string; title: string; children: ReactNode }) {
  return (
    <Reveal>
      <header className="mt-head">
        <div className="mt-head-title">
          <span className="mt-label">{label}</span>
          <h2 id={id} className="mt-h2">
            {title}
          </h2>
        </div>
        <p className="mt-head-body">{children}</p>
      </header>
    </Reveal>
  );
}

/** Bespoke case study for the Mintly UI audit and design system. */
export function MintlyCaseStudy() {
  return (
    <div className="aa mt">
      <MaraHeader active="work" />

      <Reveal className="aa-top-reveal">
        <header className="aa-top">
          <Link to="/" className="aa-back">
            ← Portfolio
          </Link>
          <div className="aa-brand" aria-label="Mintly — Design system">
            <span className="aa-brand-text">Mintly — Design system</span>
          </div>
          <span className="aa-top-spacer" aria-hidden />
        </header>
      </Reveal>

      <main id="main-content" tabIndex={-1}>
        <section className="mt-hero" aria-labelledby="mt-title">
          <div className="mt-hero-grid">
            <Reveal blur className="mt-hero-copy">
              <span className="mt-label">[ Case study — Design system ]</span>
              <h1 id="mt-title" className="mt-title">
                <span className="mt-strike">76 buttons.</span>
                <br />
                Now <em>12.</em>
              </h1>
              <p className="mt-lede">
                A UI audit and design system for Mintly, a Georgian platform where businesses run
                campaigns and creators earn from them. I measured the live product, replaced the
                sprawl with one small, fixed system, and rebuilt the product’s screens on it.
              </p>
              <dl className="mt-meta">
                {META.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd className={label === "Status" ? "mt-live" : undefined}>{value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            {/* The stage runs its own entry sequence, so it is not wrapped in Reveal. */}
            <MintlyHeroStage />
          </div>

          <Reveal delayMs={120}>
            <div className="mt-counts">
              {HEADLINE_COUNTS.map((c) => (
                <Count key={c.label} {...c} />
              ))}
            </div>
          </Reveal>
        </section>

        <section className="mt-section" aria-labelledby="mt-process">
          <SectionHead id="mt-process" label="01 — Process" title="From audit to shipped screens">
            Five steps, each one feeding the next. Color was left out of the audit on purpose — the
            palette wasn’t decided yet, so every decision had to work with any of them.
          </SectionHead>

          <ol className="mt-flow">
            {PROCESS.map((p, i) => (
              <li key={p.step} className="mt-flow-step">
                <Reveal staggerIndex={i} className="mt-flow-reveal">
                  <div className="mt-flow-top">
                    <span className="mt-flow-num">{p.step}</span>
                    <span className="mt-flow-name">{p.name}</span>
                  </div>
                  <div className="mt-flow-stat">
                    <span className="mt-flow-value">{p.stat}</span>
                    <span className="mt-flow-unit">{p.unit}</span>
                  </div>
                  {"severity" in p ? (
                    <div className="mt-sevbar" role="img" aria-label="5 major, 16 minor, 4 cosmetic">
                      <div className="mt-sevbar-track">
                        {SEVERITY.map((s) => (
                          <span
                            key={s.label}
                            className={`mt-sevbar-seg mt-sevbar-seg--${s.tone}`}
                            style={{ flexGrow: s.count }}
                          />
                        ))}
                      </div>
                      <div className="mt-sevbar-legend" aria-hidden>
                        {SEVERITY.map((s) => (
                          <span key={s.label}>
                            <i className={`mt-sevbar-dot mt-sevbar-seg--${s.tone}`} />
                            {s.count} {s.label.toLowerCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  <p className="mt-flow-body">{p.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-section" aria-labelledby="mt-numbers">
          <SectionHead id="mt-numbers" label="02 — By the numbers" title="What the audit measured">
            Counted across 13 screens of the live product. The product worked — it was just built
            from far more visual variants than it needed.
          </SectionHead>

          <Reveal>
            <figure className="mt-chart">
              <figcaption className="mt-chart-head">
                <span className="mt-chart-title">Font sizes in use, by how often they appear</span>
                <span className="mt-chart-legend" aria-hidden>
                  <span>
                    <i className="mt-chart-key mt-chart-key--small" />
                    Below 12px
                  </span>
                  <span>
                    <i className="mt-chart-key" />
                    12px and up
                  </span>
                </span>
              </figcaption>
              <div className="mt-chart-plot" aria-hidden>
                {FONT_SIZES.map(([size, n]) => (
                  <div
                    key={size}
                    className={`mt-bar${size < 12 ? " mt-bar--small" : ""}`}
                    data-tip={`${size}px · ${n} uses`}
                    tabIndex={0}
                  >
                    {n >= 290 ? <span className="mt-bar-value">{n}</span> : null}
                    <span className="mt-bar-fill" style={{ "--h": `${(n / FONT_MAX) * 100}%` } as CSSProperties} />
                    <span className="mt-bar-label">{size}</span>
                  </div>
                ))}
              </div>
              <p className="mt-chart-foot">
                <strong>21 sizes</strong> in use. The 8 below 12px appear 372 times — <strong>27% of all text</strong>.
                7 are fractional values like 8.8, 11.52 and 26.4.
              </p>
              <table className="mt-visually-hidden">
                <caption>Font sizes in use and how often each appears</caption>
                <thead>
                  <tr>
                    <th scope="col">Size (px)</th>
                    <th scope="col">Uses</th>
                  </tr>
                </thead>
                <tbody>
                  {FONT_SIZES.map(([size, n]) => (
                    <tr key={size}>
                      <td>{size}</td>
                      <td>{n}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </figure>
          </Reveal>

          <div className="mt-tiles">
            {INVENTORY.map((t, i) => (
              <Reveal key={t.label} staggerIndex={i % 4} className="mt-tile">
                <span className="mt-tile-value">{t.value}</span>
                <span className="mt-tile-label">{t.label}</span>
                <span className="mt-tile-note">{t.note}</span>
              </Reveal>
            ))}
          </div>

          <div className="mt-findings">
            {FINDINGS.map((f, i) => (
              <Reveal key={f.code} staggerIndex={i} className="mt-finding">
                <div className="mt-finding-tags">
                  <span className="mt-finding-code">{f.code}</span>
                  <span className={`mt-sev${f.severity === "Major" ? " mt-sev--major" : ""}`}>{f.severity}</span>
                  <span className="mt-finding-area">{f.area}</span>
                </div>
                <h3 className="mt-finding-title">{f.title}</h3>
                <p className="mt-finding-fix">
                  <span>Fix</span>
                  {f.fix}
                </p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mt-section" aria-labelledby="mt-system">
          <SectionHead id="mt-system" label="03 — The system" title="One small, fixed set">
            Every value is named by role, not by what it looks like, so the brand color can still
            change in one place. Drawn here from the system’s own values.
          </SectionHead>

          <Reveal>
            <div className="mt-sysstats">
              {SYSTEM_STATS.map((s) => (
                <div key={s.label}>
                  <span className="mt-sysstats-value">{s.value}</span>
                  <span className="mt-sysstats-label">{s.label}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="mt-spec">
            <Reveal className="mt-panel mt-panel--type">
              <h3 className="mt-panel-title">Type scale</h3>
              <p className="mt-panel-note">Latin line height · Georgian set 10–15% taller</p>
              <ul className="mt-type">
                {TYPE_SCALE.map((t) => (
                  <li key={t.name}>
                    <span
                      className="mt-type-sample"
                      style={{ fontSize: t.size, lineHeight: `${t.lh}px`, fontWeight: t.weight }}
                    >
                      {t.name}
                    </span>
                    <span className="mt-type-spec">
                      {t.size} / {t.lh} · KA {t.ka} · {WEIGHT_NAME[t.weight]}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <div className="mt-spec-side">
              <Reveal staggerIndex={1} className="mt-panel">
                <h3 className="mt-panel-title">Buttons</h3>
                <p className="mt-panel-note">4 styles × 3 sizes · 32 / 40 / 50px</p>
                <div className="mt-buttons">
                  {BUTTON_STYLES.map((style) => (
                    <div key={style} className="mt-buttons-row">
                      <span className="mt-buttons-name">{style}</span>
                      {BUTTON_SIZES.map((s) => (
                        <span
                          key={s.name}
                          className={`mt-btn mt-btn--${style.toLowerCase()}`}
                          style={{ height: s.h, fontSize: s.font }}
                        >
                          Join
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </Reveal>

              <Reveal staggerIndex={2} className="mt-panel">
                <h3 className="mt-panel-title">Spacing</h3>
                <p className="mt-panel-note">4px base · 9 steps · 4 / 8 / 12-column grids</p>
                <div className="mt-spacing">
                  {SPACING.map((v) => (
                    <span key={v}>
                      <i style={{ height: v * 1.5 }} />
                      {v}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>

          <Reveal className="mt-panel mt-panel--shape">
            <h3 className="mt-panel-title">Radius &amp; depth</h3>
            <p className="mt-panel-note">10 tokens · 3 levels plus 2 blur materials</p>
            <div className="mt-shape">
              <div className="mt-radii">
                {RADII.map((r) => (
                  <span key={r.name}>
                    <i style={{ borderTopLeftRadius: Math.min(r.v, 40) }} />
                    {r.v === 999 ? "full" : r.v}
                  </span>
                ))}
              </div>
              <div className="mt-depth">
                {DEPTH.map((d, i) => (
                  <span key={d.name} className={`mt-depth-${i}`}>
                    <b>{d.name}</b>
                    {d.note}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        <section className="mt-section" aria-labelledby="mt-applied">
          <SectionHead id="mt-applied" label="04 — Applied" title="Every screen, rebuilt from parts">
            Structure, copy and components are identical in both themes, so a frame switches from
            dark to light with a single setting. The same screens carry Georgian and English, and the
            redesign is rolling out now — the finished screens follow below, live.
          </SectionHead>

          <Reveal>
            <div className="mt-sysstats mt-sysstats--4">
              {APPLIED_STATS.map((s) => (
                <div key={s.label}>
                  <span className="mt-sysstats-value">{s.value}</span>
                  <span className="mt-sysstats-label">{s.label}</span>
                </div>
              ))}
            </div>
          </Reveal>

        </section>

        <MintlyShowcase />

        {/* Not wrapped in Reveal: as the last element it never clears Reveal's -12% bottom margin. */}
        <footer className="aa-foot">
          <Link to="/" className="aa-back aa-back--foot">
            ← All projects
          </Link>
        </footer>
      </main>

    </div>
  );
}
