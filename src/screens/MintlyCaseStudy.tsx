import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MaraHeader } from "../components/MaraHeader";
import { Reveal } from "../components/Reveal";
import "./CaseStudyScreen.css";
import "./MintlyCaseStudy.css";

const IMG = "/case-studies/mintly";

type Shot = { src: string; alt: string; w: number; h: number };

const META = [
  ["Role", "Product designer"],
  ["Scope", "Audit · System · Redesign"],
  ["Year", "2026"],
  ["Status", "Shipping"],
] as const;

const HEADLINE_COUNTS = [
  { before: "76", after: "12", label: "Button variants" },
  { before: "21", after: "11", label: "Font sizes → text styles" },
  { before: "22", after: "9", label: "Paddings → 4-pt steps" },
  { before: "28", after: "3", label: "Shadows → depth levels" },
] as const;

const MORE_COUNTS = [
  { before: "6", after: "3", label: "Font weights" },
  { before: "12", after: "4", label: "Corner radii, plus capsule" },
  { before: "15", after: "2", label: "Text fields → single + multi-line" },
  { before: "25", after: "3", label: "Icon sizes, one line weight" },
] as const;

const FINDINGS = [
  {
    code: "T1",
    severity: "Major",
    area: "Typography",
    title: "Too many text sizes, many of them too small",
    saw: "21 sizes in use. 8 of them sit below 12px and make up 27% of all text — card details, badges and stats run 8.8–11.5px.",
    fix: "11 system text styles, Large Title to Caption 2. Nothing below 11px; body text 16–17px.",
    img: "before-t1.webp",
    where: "Discover card",
  },
  {
    code: "B1",
    severity: "Major",
    area: "Components",
    title: "76 kinds of button",
    saw: "Buttons range from 16 to 70px high, with 0–16px or capsule corners, 9.6–16px text and weights 400–700. The same action looks different on different screens.",
    fix: "Four styles — Filled, Tinted, Gray, Plain — in Small, Medium and Large. 12 buttons in total.",
    img: "before-b1.webp",
    where: "Create product",
  },
  {
    code: "T5",
    severity: "Minor",
    area: "Typography",
    title: "Tight line height on Georgian headings",
    saw: "Large headings use a line height close to the font size (36/40px), so Georgian letters with tall ascenders and descenders almost touch between lines.",
    fix: "Georgian line heights 10–15% taller than the defaults, defined once per style in the type scale.",
    img: "before-t5.webp",
    where: "Sign-up headline",
  },
  {
    code: "L2",
    severity: "Minor",
    area: "Layout",
    title: "A three-column frame on every screen",
    saw: "A 256px menu and a 288px notifications panel are always open, so content gets about half the width — and the notifications column is usually empty.",
    fix: "Sidebar plus content. Notifications open as a popover or sheet from the toolbar.",
    img: "before-l2.webp",
    where: "Discover",
  },
  {
    code: "R1",
    severity: "Minor",
    area: "Shape & depth",
    title: "Twelve corner radii",
    saw: "Capsule (defined two ways), 32, 24, 21.6, 16, 14, 12, 11, 8, 6 and 4px — neighbouring elements often have different corners.",
    fix: "6 for small controls, 10 for buttons and fields, 16 for cards, 24 for sheets; capsule only for tags and switches.",
    img: "before-r1.webp",
    where: "Space dashboard",
  },
  {
    code: "F1",
    severity: "Minor",
    area: "Components",
    title: "Fifteen kinds of text field",
    saw: "Fields are 20–48px high with 0, 8, 12 or 16px corners and 12–16px text. Sign-up uses 48px fields; settings drop to 38px with 13px text.",
    fix: "One text field — 44–48px, 16–17px text, label above, hint below — and one multi-line version.",
    img: "before-f1.webp",
    where: "Settings · contact details",
  },
] as const;

const shot = (file: string, alt: string, w: number, h: number): Shot => ({
  src: `${IMG}/${file}`,
  alt,
  w,
  h,
});

const FOUNDATIONS = [
  {
    title: "Color by role",
    body: "Surfaces, labels, separators, fills, accent and status — each token has a dark and a light value. The accent is a single slot, so the brand colour can change in one place.",
    img: shot("ds-colors.webp", "Semantic color tokens with dark and light values", 1758, 2400),
  },
  {
    title: "Type scale",
    body: "11 styles, three weights, with Georgian line heights set 10–15% taller so both scripts breathe.",
    img: shot("ds-type.webp", "Type scale with Georgian and Latin specimens", 1920, 2314),
  },
  {
    title: "4-pt spacing",
    body: "Nine steps from 4 to 48, with fixed insets for screens, cards and lists.",
    img: shot("ds-grid.webp", "Grid and spacing scale", 1920, 1777),
  },
  {
    title: "Radius & depth",
    body: "Four radii plus capsule, three depth levels — base, raised, overlay — and two blur materials.",
    img: shot("ds-radius.webp", "Corner radii, depth levels and materials", 1920, 1798),
  },
] as const;

const COMPONENTS = {
  buttons: shot(
    "ds-buttons.webp",
    "Button matrix: four styles, three sizes, all states, with right-to-left mirrors",
    2000,
    1026,
  ),
  states: shot(
    "ds-states.webp",
    "Interaction states for every control, in the dark and light themes",
    2000,
    2131,
  ),
  fields: shot("ds-fields.webp", "Text, search, multi-line and password fields", 2000, 1008),
  cards: shot("ds-cards.webp", "Campaign, space and product cards", 2000, 1473),
  nav: shot("ds-nav.webp", "Sidebar, navigation bar and phone tab bar", 2000, 568),
};

const APPLIED = {
  discoverDark: shot("discover-dark.webp", "Discover, rebuilt with the system — dark theme", 1440, 1597),
  discoverLight: shot("discover-light.webp", "Discover, rebuilt with the system — light theme", 1440, 1597),
  campaignDark: shot("campaign-dark.webp", "Campaign page — dark theme", 1440, 1295),
  campaignLight: shot("campaign-light.webp", "Campaign page — light theme", 1440, 1295),
  discoverEn: shot("discover-en.webp", "Discover in English", 1440, 1574),
  devices: shot("devices.webp", "Discover and campaign page on tablet and phone", 2000, 1284),
};

/** Bespoke case study for the Mintly UI audit and design system. */
export function MintlyCaseStudy() {
  const [zoom, setZoom] = useState<Shot | null>(null);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoom(null);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [zoom]);

  const Figure = ({
    img,
    caption,
    className,
  }: {
    img: Shot;
    caption?: string;
    className?: string;
  }) => (
    <figure className={`mt-figure${className ? ` ${className}` : ""}`}>
      <button
        type="button"
        className="mt-imgbtn"
        onClick={() => setZoom(img)}
        aria-label={`Enlarge image: ${img.alt}`}
      >
        <img src={img.src} alt={img.alt} width={img.w} height={img.h} loading="lazy" />
      </button>
      {caption ? <figcaption className="mt-caption">{caption}</figcaption> : null}
    </figure>
  );

  const Count = ({ before, after, label }: { before: string; after: string; label: string }) => (
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
                campaigns and creators earn from them. I measured 13 live screens, logged 25
                findings, and replaced the sprawl with one small, fixed system — then rebuilt the
                product on it in dark and light, Georgian and English.
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

            <Reveal staggerIndex={1} className="mt-stage-reveal">
              <div className="mt-stage" aria-hidden>
                <div className="mt-shot mt-shot--light">
                  <img src={`${IMG}/hero-light.webp`} alt="" width={1440} height={730} />
                </div>
                <div className="mt-shot mt-shot--dark">
                  <img src={`${IMG}/hero-dark.webp`} alt="" width={1440} height={730} />
                </div>
                <span className="mt-chip mt-chip--dark">Dark</span>
                <span className="mt-chip mt-chip--light">Light</span>
              </div>
            </Reveal>
          </div>

          <Reveal delayMs={120}>
            <div className="mt-counts mt-counts--hero">
              {HEADLINE_COUNTS.map((c) => (
                <Count key={c.label} {...c} />
              ))}
            </div>
          </Reveal>
        </section>

        <section className="mt-section" aria-labelledby="mt-audit">
          <Reveal>
            <header className="mt-section-head">
              <span className="mt-label">01 — Audit</span>
              <h2 id="mt-audit" className="mt-h2">
                Measured before anything was redrawn
              </h2>
              <p className="mt-body">
                The product worked, but it was built from far more visual variants than it needed. I
                measured every visible text, button, field, icon and container across 13 screens of
                the live product — desktop layouts plus phone checks — and logged each problem with
                where it appears, how severe it is, and its system counterpart. Colour was left out
                on purpose: the palette wasn’t decided yet, so everything had to work with any of
                them.
              </p>
            </header>
          </Reveal>

          <Reveal>
            <div className="mt-audit-stats">
              <div>
                <span className="mt-stat-num">13</span>
                <span className="mt-stat-label">Screens measured</span>
              </div>
              <div>
                <span className="mt-stat-num">25</span>
                <span className="mt-stat-label">Findings</span>
              </div>
              <div>
                <span className="mt-stat-num">6</span>
                <span className="mt-stat-label">
                  Areas: type, layout, shape, components, navigation, icons
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-counts">
              {MORE_COUNTS.map((c) => (
                <Count key={c.label} {...c} />
              ))}
            </div>
          </Reveal>

          <div className="mt-findings">
            {FINDINGS.map((f, i) => (
              <Reveal key={f.code} staggerIndex={i % 2} className="mt-finding-reveal">
                <article className="mt-finding">
                  <button
                    type="button"
                    className="mt-imgbtn mt-finding-img"
                    onClick={() =>
                      setZoom({
                        src: `${IMG}/${f.img}`,
                        alt: `Before: ${f.where}`,
                        w: 546,
                        h: 348,
                      })
                    }
                    aria-label={`Enlarge before screenshot: ${f.where}`}
                  >
                    <img
                      src={`${IMG}/${f.img}`}
                      alt={`Before: ${f.where}`}
                      width={546}
                      height={348}
                      loading="lazy"
                    />
                    <span className="mt-finding-where">Before · {f.where}</span>
                  </button>
                  <div className="mt-finding-body">
                    <div className="mt-finding-tags">
                      <span className="mt-finding-code">{f.code}</span>
                      <span
                        className={`mt-sev${f.severity === "Major" ? " mt-sev--major" : ""}`}
                      >
                        {f.severity}
                      </span>
                      <span className="mt-finding-area">{f.area}</span>
                    </div>
                    <h3 className="mt-finding-title">{f.title}</h3>
                    <p className="mt-finding-k">What I saw</p>
                    <p className="mt-finding-p">{f.saw}</p>
                    <p className="mt-finding-k mt-finding-k--fix">In the system</p>
                    <p className="mt-finding-p mt-finding-p--fix">{f.fix}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <p className="mt-note">Private details — balances, user names and space categories — are blurred.</p>
        </section>

        <section className="mt-section" aria-labelledby="mt-foundations">
          <Reveal>
            <header className="mt-section-head">
              <span className="mt-label">02 — Foundations</span>
              <h2 id="mt-foundations" className="mt-h2">
                Tokens that work with any palette
              </h2>
              <p className="mt-body">
                The foundations were shown in neutral grey on purpose, so colour could be decided
                separately and slot into them without changes. Every value is named by what it does,
                not what it looks like.
              </p>
            </header>
          </Reveal>
          <div className="mt-foundations">
            {FOUNDATIONS.map((f, i) => (
              <Reveal key={f.title} staggerIndex={i % 2} className="mt-foundation">
                <Figure img={f.img} />
                <h3 className="mt-h3">{f.title}</h3>
                <p className="mt-small">{f.body}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mt-section" aria-labelledby="mt-components">
          <Reveal>
            <header className="mt-section-head">
              <span className="mt-label">03 — Components</span>
              <h2 id="mt-components" className="mt-h2">
                From one-offs to a fixed set
              </h2>
              <p className="mt-body">
                Every part of the old interface was mapped to one standard counterpart, and the
                library was built from those: buttons, fields, selection controls, cards, lists,
                navigation, overlays, feedback, tables and notifications. Each component is specified
                for every state in both themes, and buttons ship with right-to-left mirrors.
              </p>
            </header>
          </Reveal>
          <Reveal>
            <Figure
              img={COMPONENTS.buttons}
              caption="Buttons — 4 styles × 3 sizes × every state, plus right-to-left mirrors"
            />
          </Reveal>
          <div className="mt-pair">
            <Reveal className="mt-pair-item">
              <Figure img={COMPONENTS.fields} caption="Fields — one text field, one multi-line" />
            </Reveal>
            <Reveal staggerIndex={1} className="mt-pair-item">
              <Figure img={COMPONENTS.cards} caption="Cards — campaign, space, product" />
            </Reveal>
          </div>
          <Reveal>
            <Figure
              img={COMPONENTS.states}
              caption="Interaction states — default, hover, pressed, focus, disabled, error, success, loading, selected"
            />
          </Reveal>
          <Reveal>
            <Figure img={COMPONENTS.nav} caption="Navigation — desktop sidebar, navigation bar, phone tab bar" />
          </Reveal>
        </section>

        <section className="mt-section" aria-labelledby="mt-applied">
          <Reveal>
            <header className="mt-section-head">
              <span className="mt-label">04 — Applied</span>
              <h2 id="mt-applied" className="mt-h2">
                One system, two themes, two scripts
              </h2>
              <p className="mt-body">
                The screens were rebuilt entirely from system components. Structure, copy and
                components are identical in both themes — only the colour mode changes, so switching
                a frame from dark to light is a single setting.
              </p>
            </header>
          </Reveal>
          <div className="mt-pair">
            <Reveal className="mt-pair-item">
              <Figure img={APPLIED.discoverDark} caption="Discover · dark" />
            </Reveal>
            <Reveal staggerIndex={1} className="mt-pair-item">
              <Figure img={APPLIED.discoverLight} caption="Discover · light" />
            </Reveal>
          </div>
          <div className="mt-pair">
            <Reveal className="mt-pair-item">
              <Figure img={APPLIED.campaignDark} caption="Campaign page · dark" />
            </Reveal>
            <Reveal staggerIndex={1} className="mt-pair-item">
              <Figure img={APPLIED.campaignLight} caption="Campaign page · light" />
            </Reveal>
          </div>
          <div className="mt-pair mt-pair--offset">
            <Reveal className="mt-pair-item">
              <h3 className="mt-h3">Georgian first, Latin alongside</h3>
              <p className="mt-small">
                The type scale was tuned for Georgian — taller line heights, no wide capital-letter
                labels — and the same screens carry English without any layout changes.
              </p>
              <Figure img={APPLIED.discoverEn} caption="Discover · English" />
            </Reveal>
            <Reveal staggerIndex={1} className="mt-pair-item">
              <h3 className="mt-h3">Down to tablet and phone</h3>
              <p className="mt-small">
                The same components reflow to a 834px tablet and a 390px phone, with the sidebar
                becoming a tab bar.
              </p>
              <Figure img={APPLIED.devices} caption="Tablet and phone" />
            </Reveal>
          </div>
        </section>

        <section className="mt-section mt-close" aria-labelledby="mt-close">
          <Reveal>
            <span className="mt-label">Where it stands</span>
            <h2 id="mt-close" className="mt-h2">
              Shipping now, screen by screen
            </h2>
            <p className="mt-body">
              The redesign is rolling out into the live product. Because every screen is assembled
              from the same tokens and components, the remaining decisions — like the final brand
              colour — land in one place instead of across dozens of screens.
            </p>
          </Reveal>
        </section>

        {/* Not wrapped in Reveal: as the last element it never clears Reveal's -12% bottom margin. */}
        <footer className="aa-foot">
          <Link to="/" className="aa-back aa-back--foot">
            ← All projects
          </Link>
        </footer>
      </main>

      {zoom && (
        <div
          className="aa-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={zoom.alt}
          onClick={() => setZoom(null)}
        >
          <button
            type="button"
            className="aa-lightbox-close"
            onClick={() => setZoom(null)}
            aria-label="Close image viewer"
          >
            ×
          </button>
          <img className="aa-lightbox-img" src={zoom.src} alt={zoom.alt} />
        </div>
      )}
    </div>
  );
}
