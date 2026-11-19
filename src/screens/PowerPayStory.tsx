import { useEffect, useState, type ReactNode } from "react";
import { Reveal } from "../components/Reveal";
import type { GalleryImage } from "../data/caseStudyContent";
import { PowerPayAppIntro } from "./PowerPayAppIntro";
import "./PowerPayStory.css";

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Cycles 0..count-1 every `ms` until the user takes over. */
function useAutoStep(count: number, ms: number) {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto || reducedMotion()) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % count), ms);
    return () => window.clearInterval(id);
  }, [auto, count, ms]);
  const pick = (v: number) => {
    setAuto(false);
    setI(v);
  };
  return [i, pick] as const;
}

function Segmented({
  items,
  value,
  onChange,
  label,
}: {
  items: readonly string[];
  value: number;
  onChange: (i: number) => void;
  label: string;
}) {
  return (
    <div className="pp-seg" role="tablist" aria-label={label}>
      {items.map((t, i) => (
        <button
          key={t}
          type="button"
          role="tab"
          aria-selected={value === i}
          className={value === i ? "pp-seg-btn is-on" : "pp-seg-btn"}
          onClick={() => onChange(i)}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

const anchor = (s: string) => "pp-" + s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

type HeroToken = string | { img: number } | { note: string };

/** Browser window in the UI hero: real role dashboards, each scrolled like a live session. */
const BROWSER_ROLES = [
  { role: "Consumer", shot: 0 },
  { role: "Supplier", shot: 1 },
  { role: "Producer", shot: 2 },
  { role: "Investor", shot: 3 },
];

function BrowserIntro({ gallery }: { gallery: readonly GalleryImage[] }) {
  const [i] = useAutoStep(BROWSER_ROLES.length, 3400);
  return (
    <div className="pp-hero-visual" aria-hidden>
      <div className="pp-window">
        <div className="pp-window-bar">
          <i /><i /><i />
          <span className="pp-window-tabs">
            {BROWSER_ROLES.map((r, k) => (
              <b key={r.role} className={k === i ? "is-on" : ""}>{r.role}</b>
            ))}
          </span>
        </div>
        <div className="pp-window-screen">
          {BROWSER_ROLES.map((r, k) =>
            gallery[r.shot] ? (
              <img key={r.shot} src={gallery[r.shot].src} alt="" className={k === i ? "is-on" : ""} />
            ) : null,
          )}
        </div>
      </div>
    </div>
  );
}

/** Phone in the hero that runs a coded app launch. */
function PhoneIntro() {
  return (
    <div className="pp-phone" role="img" aria-label="PowerPay app launching: splash, welcome, then the dashboard">
      <div className="pp-phone-screen">
        <PowerPayAppIntro />
      </div>
    </div>
  );
}

const HEROES: Record<
  string,
  {
    label: string;
    tokens: HeroToken[];
    chapters: string[];
    tiles: number[];
    phone?: number[];
    visual?: "browser" | "flow";
  }
> = {
  "powerpay-application": {
    label: "Case study — Mobile app",
    tokens: ["Energy bills", { note: "A mobile app for households, businesses and prosumers." }, "people can", "actually read"],
    chapters: ["The problem", "Getting in", "Usage", "Billing", "Behind the bill", "Control"],
    tiles: [4, 10],
    phone: [0, 1, 2, 3, 4],
  },
  "powerpay-ui-design": {
    label: "Case study — UI design",
    tokens: ["One system,", "four roles,", "one look", { note: "Dashboards for consumers, suppliers, producers and investors." }],
    visual: "browser",
    chapters: ["The problem", "Navigation", "Supplier setup", "Dashboards", "Money", "Details"],
    tiles: [3, 5],
  },
  "powerpay-ux-design": {
    label: "Case study — UX design",
    tokens: ["Fewer steps,", "less doubt,", "clear finish", { note: "Onboarding, sign-up and switching energy supplier." }],
    visual: "flow",
    chapters: ["The problem", "First contact", "Discovery", "Research", "Entry points", "Accounts", "Sign-up", "Switching supplier", "Behind the switch"],
    tiles: [0, 7],
  },
};

function Hero({ slug, title, gallery }: { slug: string; title: string; gallery: readonly GalleryImage[] }) {
  const h = HEROES[slug];
  if (!h) return null;
  return (
    <header className="pp-hero">
      <div className="pp-hero-meta">
        <span className="pp-bracket"><i className="pp-mark" aria-hidden />[PowerPay]</span>
        <span className="pp-bracket">[{h.label}]</span>
      </div>
      <div
        className={
          h.phone
            ? "pp-hero-frame pp-hero-frame--phone"
            : h.visual
              ? "pp-hero-frame pp-hero-frame--visual"
              : "pp-hero-frame"
        }
      >
        {h.phone && <PhoneIntro />}
        {h.visual === "browser" && <BrowserIntro gallery={gallery} />}
        {h.visual === "flow" && (
          <div className="pp-hero-visual pp-hero-visual--flow" aria-hidden>
            <div className="pp-window">
              <div className="pp-window-bar"><i /><i /><i /><span>Switch supplier</span></div>
              <SplitFlowWidget label="Supplier switch application" steps={SWITCH_STEPS} />
            </div>
          </div>
        )}
        <span className="pp-cross pp-cross--tl" aria-hidden>✦</span>
        <span className="pp-cross pp-cross--tr" aria-hidden>✦</span>
        <span className="pp-cross pp-cross--bl" aria-hidden>✦</span>
        <span className="pp-cross pp-cross--br" aria-hidden>✦</span>
        <h1 className="pp-hero-title" aria-label={title}>
          {h.tokens.map((t, i) =>
            typeof t === "string" ? (
              <span key={i} className="pp-hero-word" aria-hidden>{t} </span>
            ) : "img" in t ? (
              gallery[t.img] && (
                <span key={i} className="pp-hero-chip" aria-hidden>
                  <img src={gallery[t.img].src} alt="" />
                </span>
              )
            ) : (
              <span key={i} className="pp-hero-note" aria-hidden>{t.note}</span>
            ),
          )}
        </h1>
      </div>
      <div className="pp-hero-bottom">
        <ol className="pp-index">
          {h.chapters.map((c, i) => (
            <li key={c}>
              <a href={`#${anchor(c)}`}>
                <span>({i + 1})</span>
                <span>{c}</span>
              </a>
            </li>
          ))}
        </ol>
        <div className="pp-tiles">
          {h.tiles.map((n) =>
            gallery[n] ? (
              <span key={n} className="pp-tile"><img src={gallery[n].src} alt="" loading="lazy" /></span>
            ) : null,
          )}
          <a className="pp-tile pp-tile--cta" href={`#${anchor(h.chapters[0])}`}>
            <span className="pp-tile-arrow" aria-hidden>↘</span>
            <span>Read the story</span>
          </a>
        </div>
      </div>
    </header>
  );
}

function Shot({ img, onZoom }: { img: GalleryImage; onZoom: (g: GalleryImage) => void }) {
  return (
    <button type="button" className="pp-shot" onClick={() => onZoom(img)} aria-label={`Open full screen: ${img.alt}`}>
      <span className="pp-shot-frame">
        <img src={img.src} alt="" width={img.w} height={img.h} loading="lazy" />
      </span>
      <span className="pp-shot-cap">{img.alt}</span>
    </button>
  );
}

function Chapter({
  kicker,
  title,
  children,
  widget,
  shots,
  onZoom,
  flip,
  phone,
  artifact,
  legend,
}: {
  kicker: string;
  title: string;
  children: ReactNode;
  widget?: ReactNode;
  shots?: GalleryImage[];
  onZoom: (g: GalleryImage) => void;
  flip?: boolean;
  phone?: boolean;
  artifact?: GalleryImage;
  legend?: { label: string; tone: "go" | "later" | "no" | "plain" }[];
}) {
  return (
    <Reveal className="pp-chapter-reveal">
      <section id={anchor(kicker)} className={flip ? "pp-chapter pp-chapter--flip" : "pp-chapter"}>
        <div className="pp-chapter-text">
          <p className="pp-kicker">{kicker}</p>
          <h2 className="pp-title">{title}</h2>
          <div className="pp-body">{children}</div>
        </div>
        {widget && <div className="pp-chapter-widget">{widget}</div>}
        {artifact && (
          <figure className="pp-artifact">
            <button type="button" onClick={() => onZoom(artifact)} aria-label={`Open full size: ${artifact.alt}`}>
              <img src={artifact.src} alt="" width={artifact.w} height={artifact.h} loading="lazy" />
              <span className="pp-artifact-zoom" aria-hidden>Click to enlarge ↗</span>
            </button>
            {legend && (
              <figcaption className="pp-artifact-legend">
                {legend.map((l) => (
                  <span key={l.label}>
                    <i className={`pp-tone pp-tone--${l.tone}`} />
                    {l.label}
                  </span>
                ))}
              </figcaption>
            )}
          </figure>
        )}
        {shots && shots.length > 0 && (
          <div className={phone ? "pp-shots pp-shots--phone" : `pp-shots pp-shots--${Math.min(shots.length, 4)}`}>
            {shots.map((s) => (
              <Shot key={s.src} img={s} onZoom={onZoom} />
            ))}
          </div>
        )}
      </section>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Widgets                                                             */
/* ------------------------------------------------------------------ */

/** Illustrative usage chart — mirrors the app's Day/Week/Month/Year control. */
const USAGE: Record<string, { labels: string[]; used: number[]; sent: number[] }> = {
  Day: { labels: ["00", "04", "08", "12", "16", "20"], used: [20, 14, 46, 38, 52, 88], sent: [0, 0, 30, 72, 54, 6] },
  Week: { labels: ["M", "T", "W", "T", "F", "S", "S"], used: [52, 48, 60, 55, 64, 82, 76], sent: [38, 44, 30, 50, 42, 60, 66] },
  Month: { labels: ["W1", "W2", "W3", "W4"], used: [62, 70, 58, 74], sent: [40, 52, 46, 36] },
  Year: { labels: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], used: [90, 84, 70, 58, 46, 40, 44, 48, 56, 68, 80, 92], sent: [10, 16, 30, 48, 66, 78, 82, 74, 56, 34, 18, 8] },
};
const RANGES = ["Day", "Week", "Month", "Year"] as const;

function UsageWidget() {
  const [r, setR] = useAutoStep(RANGES.length, 2600);
  const [prosumer, setProsumer] = useState(true);
  const d = USAGE[RANGES[r]];
  return (
    <figure className="pp-card pp-usage">
      <div className="pp-card-head">
        <Segmented items={RANGES} value={r} onChange={setR} label="Usage range" />
        <label className="pp-toggle">
          <input type="checkbox" checked={prosumer} onChange={(e) => setProsumer(e.target.checked)} />
          <span>Prosumer view</span>
        </label>
      </div>
      <div className="pp-bars" style={{ ["--n" as string]: d.labels.length }}>
        {d.labels.map((l, i) => (
          <div key={i} className="pp-bar-col">
            <div className="pp-bar-pair">
              <span className="pp-bar pp-bar--used" style={{ ["--v" as string]: d.used[i] / 100 }} />
              <span
                className="pp-bar pp-bar--sent"
                style={{ ["--v" as string]: prosumer ? d.sent[i] / 100 : 0 }}
              />
            </div>
            <span className="pp-bar-label">{l}</span>
          </div>
        ))}
      </div>
      <figcaption className="pp-legend">
        <span><i className="pp-dot pp-dot--used" /> Used</span>
        {prosumer && <span><i className="pp-dot pp-dot--sent" /> Sent back to the grid</span>}
        <span className="pp-legend-note">Illustrative data</span>
      </figcaption>
    </figure>
  );
}

/** An invoice that builds itself line by line — the "no mystery total" idea. */
const INVOICE = [
  ["Energy used", "412 kWh"],
  ["Tariff", "Domestic, day / night"],
  ["Network fee", "Included"],
  ["Taxes", "Itemised"],
] as const;

function InvoiceWidget() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (reducedMotion()) {
      setStep(INVOICE.length + 1);
      return;
    }
    const id = window.setInterval(() => setStep((s) => (s > INVOICE.length + 2 ? 0 : s + 1)), 900);
    return () => window.clearInterval(id);
  }, []);
  return (
    <figure className="pp-card pp-invoice" aria-label="An invoice broken into its parts">
      <p className="pp-invoice-title">Invoice · November</p>
      <ul>
        {INVOICE.map(([k, v], i) => (
          <li key={k} className={step > i ? "is-in" : ""}>
            <span>{k}</span>
            <span>{v}</span>
          </li>
        ))}
      </ul>
      <p className={step > INVOICE.length ? "pp-invoice-total is-in" : "pp-invoice-total"}>
        <span>Total</span>
        <span>Every part explained</span>
      </p>
    </figure>
  );
}

/** Before / after: how many things you need to know at once. */
function CompareWidget() {
  return (
    <figure className="pp-card pp-compare" aria-label="Before and after">
      <div>
        <p className="pp-compare-h">Before</p>
        <p className="pp-compare-big">One long form</p>
        <div className="pp-compare-bar"><span style={{ width: "100%" }} /></div>
        <p className="pp-compare-note">Everything asked at once, no sense of the end</p>
      </div>
      <div>
        <p className="pp-compare-h">After</p>
        <p className="pp-compare-big">One thing per step</p>
        <div className="pp-compare-bar pp-compare-bar--steps">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} style={{ animationDelay: `${i * 160}ms` }} />
          ))}
        </div>
        <p className="pp-compare-note">Progress always visible, a clear finish line</p>
      </div>
    </figure>
  );
}

/* Split flow — vertical stepper left, live step content right
   (the PowerPay application pattern). */
type SplitStep = {
  title: string;
  hint: string;
  heading: string;
  lines?: string[];
  fields?: string[];
  otp?: boolean;
  signature?: boolean;
  consent?: string;
  choice?: [string, string];
  cta: string;
};

function SplitFlowWidget({ steps, label }: { steps: SplitStep[]; label: string }) {
  const [s, setS] = useAutoStep(steps.length, 3400);
  const st = steps[s];
  return (
    <figure className="pp-card pp-split" aria-label={label}>
      <ol className="pp-split-steps">
        {steps.map((x, i) => (
          <li key={x.title} className={i < s ? "is-done" : i === s ? "is-on" : ""}>
            <button type="button" onClick={() => setS(i)} aria-current={i === s ? "step" : undefined}>
              <span className="pp-split-num" aria-hidden>{i < s ? "✓" : i + 1}</span>
              <span>
                <span className="pp-split-title">{x.title}</span>
                <span className="pp-split-hint">{x.hint}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
      <div className="pp-split-panel" key={s}>
        <p className="pp-split-heading">{st.heading}</p>
        {st.lines && (
          <ul className="pp-split-lines">
            {st.lines.map((l, i) => (
              <li key={l} style={{ animationDelay: `${i * 80}ms` }}>{l}</li>
            ))}
          </ul>
        )}
        {st.fields && (
          <div className="pp-split-fields">
            {st.fields.map((f, i) => (
              <span key={f} className="pp-field" style={{ animationDelay: `${i * 90}ms` }}>
                <span className="pp-field-label">{f}</span>
                <span className="pp-field-input" aria-hidden><i style={{ animationDelay: `${300 + i * 260}ms` }} /></span>
              </span>
            ))}
          </div>
        )}
        {st.otp && (
          <div className="pp-otp" aria-hidden>
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} style={{ animationDelay: `${200 + i * 180}ms` }}>•</span>
            ))}
          </div>
        )}
        {st.signature && (
          <svg className="pp-sign" viewBox="0 0 300 90" aria-hidden>
            <path d="M10 62 C 30 20, 45 20, 52 55 S 70 80, 82 40 S 100 10, 110 50 S 130 75, 150 45 C 165 25, 175 30, 180 52 S 200 70, 215 38 C 225 20, 240 30, 245 50 L 290 48" />
          </svg>
        )}
        {st.choice && (
          <div className="pp-choice">
            <span className="is-on">{st.choice[0]}</span>
            <span>{st.choice[1]}</span>
          </div>
        )}
        {st.consent && (
          <p className="pp-consent"><span className="pp-check" aria-hidden />{st.consent}</p>
        )}
        <span className="pp-split-cta">{st.cta}</span>
      </div>
    </figure>
  );
}

const SWITCH_STEPS: SplitStep[] = [
  {
    title: "Prerequisites",
    hint: "Have your recent electricity bills ready",
    heading: "Before you start",
    lines: [
      "Complete every section as well as you can",
      "Sign in the form, or upload your signature",
      "Required fields are marked with *",
      "You'll get a notification with the result",
    ],
    consent: "I agree that my data is used only to process this application",
    cta: "Start",
  },
  {
    title: "Personal details",
    hint: "Who is requesting the supplier change",
    heading: "Personal details",
    fields: ["Full name *", "ID number *", "Email *", "Phone"],
    cta: "Continue",
  },
  {
    title: "Meter details",
    hint: "Your current supplier and account",
    heading: "Meter details",
    fields: ["Current supplier *", "Account number *", "Meter number *", "Premises address *"],
    cta: "Continue",
  },
  {
    title: "Signature",
    hint: "Sign the application before review",
    heading: "Sign here",
    signature: true,
    cta: "Sign and continue",
  },
  {
    title: "Registration",
    hint: "Create an account to follow your switch",
    heading: "Create your account",
    fields: ["Email *", "Password *"],
    cta: "Submit application",
  },
];

const SIGNUP_STEPS: SplitStep[] = [
  { title: "Email", hint: "Where we send your code", heading: "What's your email?", fields: ["Email *"], cta: "Send code" },
  { title: "Verification", hint: "Enter the 6-digit code", heading: "Check your inbox", otp: true, cta: "Verify" },
  {
    title: "Basic info",
    hint: "Your name and the terms",
    heading: "Tell us about you",
    fields: ["First name *", "Last name *"],
    consent: "I agree to the terms of use",
    cta: "Continue",
  },
  {
    title: "Organisation",
    hint: "Optional — add one now or later",
    heading: "Signing up for a company?",
    choice: ["Create organisation", "Skip for now"],
    cta: "Finish",
  },
];

const APP_ONBOARDING_STEPS: SplitStep[] = [
  {
    title: "Welcome",
    hint: "What the app does, in a few screens",
    heading: "Your energy, in one app",
    lines: ["See your usage by day, week, month or year", "Read and pay every invoice", "Manage your account and payments"],
    cta: "Get started",
  },
  { title: "Sign in", hint: "Email and password, or a social account", heading: "Welcome back", fields: ["Email *", "Password *"], cta: "Sign in" },
  { title: "Verify", hint: "Enter the code we sent", heading: "Check your inbox", otp: true, cta: "Verify" },
  {
    title: "Register",
    hint: "New here? A few details to start",
    heading: "Create your account",
    fields: ["Full name *", "Email *", "Password *"],
    consent: "I agree to the terms of use",
    cta: "Create account",
  },
];

const BILLING_STEPS: SplitStep[] = [
  { title: "Meter data", hint: "Readings arrive from the meter", heading: "Readings received", lines: ["Smart meter interval data", "Manual readings where needed", "Checked before billing"], cta: "Next: calculate" },
  { title: "Calculation", hint: "Usage × tariff, fees and taxes", heading: "Invoice calculated", lines: ["Consumption per tariff period", "Network fees", "Taxes, itemised"], cta: "Next: send" },
  { title: "Delivery", hint: "Every customer gets their invoice", heading: "Invoice sent", lines: ["In the app", "By email, as a PDF"], cta: "Next: payment" },
  { title: "Payment", hint: "Paid in the app or by direct debit", heading: "Payment tracked", choice: ["Pay now in the app", "Automatic payment"], cta: "Next: statement" },
  { title: "Statement", hint: "Every bill and payment on one timeline", heading: "Statement updated", lines: ["Balance up to date", "Download a statement any time"], cta: "Done" },
];

const SETTINGS_STEPS: SplitStep[] = [
  { title: "Profile", hint: "Your name, contact and address", heading: "Profile", fields: ["Full name", "Phone", "Address"], cta: "Save changes" },
  { title: "Security", hint: "Password and two-step sign-in", heading: "Security", fields: ["Current password", "New password"], consent: "Turn on two-step sign-in", cta: "Update password" },
  { title: "Notifications", hint: "Choose what you hear about", heading: "Notifications", choice: ["New invoice — on", "Payment reminder — on"], cta: "Save changes" },
  { title: "Payment methods", hint: "Cards and automatic payments", heading: "Payment methods", choice: ["Saved card", "Add a payment method"], cta: "Save changes" },
];

const ROLE_STEPS: SplitStep[] = [
  { title: "Consumer", hint: "Households and businesses using power", heading: "What a consumer sees first", lines: ["Usage today", "Next bill", "Pay in one tap"], cta: "Open dashboard" },
  { title: "Supplier", hint: "Energy companies serving customers", heading: "What a supplier sees first", lines: ["Customers", "Switch requests", "Billing runs"], cta: "Open dashboard" },
  { title: "Producer", hint: "People and companies generating power", heading: "What a producer sees first", lines: ["Generation", "Power sent to the grid", "Earnings"], cta: "Open dashboard" },
  { title: "Investor", hint: "People funding energy projects", heading: "What an investor sees first", lines: ["Portfolio", "Returns", "Investment calculator"], cta: "Open dashboard" },
];

const NAV_STEPS: SplitStep[] = [
  { title: "Dashboard", hint: "The role's overview", heading: "Dashboard", lines: ["Key numbers for this role", "Charts and recent activity"], cta: "Open" },
  { title: "CRM", hint: "Customers and contacts", heading: "CRM", lines: ["Customer list", "Contact details and history"], cta: "Open" },
  { title: "Billing", hint: "Invoices and payments", heading: "Billing", lines: ["Invoices", "Payments", "Statements"], cta: "Open" },
  { title: "Switch Supplier", hint: "Switch requests and their status", heading: "Switch Supplier", lines: ["New requests", "In progress", "Completed"], cta: "Open" },
  { title: "MDMS", hint: "Meter data", heading: "Meter data", lines: ["Meters", "Readings", "Data checks"], cta: "Open" },
  { title: "Supplier Settings", hint: "Tariffs and company setup", heading: "Supplier settings", lines: ["Tariffs", "Billing settings", "Templates"], cta: "Open" },
  { title: "Account Settings", hint: "Profile, team and security", heading: "Account settings", lines: ["Profile", "Team and roles", "Security"], cta: "Open" },
  { title: "Report an Issue", hint: "Get help fast", heading: "Report an issue", fields: ["What happened?"], cta: "Send report" },
];

const SUPPLIER_SETUP_STEPS: SplitStep[] = [
  { title: "Organisation", hint: "Company name and details", heading: "Create your organisation", fields: ["Company name *", "Registration number *", "Address *"], cta: "Continue" },
  { title: "Team", hint: "Invite colleagues and set roles", heading: "Invite your team", fields: ["Email", "Role"], cta: "Send invites" },
  { title: "Customers", hint: "Bring in your customer list", heading: "Import customers", choice: ["Upload a file", "Connect meter data"], cta: "Import" },
  { title: "Billing", hint: "Turn on invoicing", heading: "Set up billing", lines: ["Tariffs", "Billing cycle", "Invoice template"], cta: "Activate billing" },
  { title: "Switching", hint: "Accept switch requests", heading: "Set up supplier switching", lines: ["Application form", "Review steps"], cta: "Activate switching" },
  { title: "Payments", hint: "How customers pay you", heading: "Payment settings", choice: ["Card payments", "Direct debit"], cta: "Finish setup" },
];

const RESEARCH_STEPS: SplitStep[] = [
  { title: "1 · Email", hint: "Start with email or a social account", heading: "What if the email already exists?", lines: ["Show sign-in instead, with a password reset", "If the code was never entered, send a new one"], cta: "Decision: one entry, smart branching" },
  { title: "2 · Code", hint: "One-time code sent by email", heading: "What if people never enter the code?", lines: ["Pause the sign-up and keep the email", "Send a fresh code if they come back"], cta: "Decision: never lose a half-finished sign-up" },
  { title: "3 · About you", hint: "Name, password, terms", heading: "What about invited team members?", lines: ["Invited people skip the code step", "Name and password, then straight to the dashboard", "Open question: ask for a phone number too?"], cta: "Decision: invites are the shortcut" },
  { title: "4 · Organisation", hint: "Optional — individuals can skip", heading: "How do we verify a company?", lines: ["Check the name isn't already taken", "Company verification comes later, not at sign-up"], cta: "Decision: don't block sign-up on paperwork" },
  { title: "5 · Plan", hint: "Pick a plan, start a trial", heading: "What if no plan is picked?", lines: ["Gentle reminder at each sign-in", "Show remaining trial days in the header"], cta: "Decision: remind, don't block" },
  { title: "6 · Team", hint: "Invite colleagues, or skip", heading: "What if invites are ignored?", lines: ["Send invitation emails", "Remind after a while", "Allow pasting a list of emails"], cta: "Decision: teams can grow later" },
  { title: "7 · Dashboard", hint: "Done — straight into the product", heading: "Land somewhere useful", lines: ["Role-based welcome message", "Demo mode to explore safely"], cta: "Go to dashboard" },
];

/** Animated pipeline: steps light up in order, then loop. */
function PipelineWidget({ steps, caption }: { steps: readonly string[]; caption: string }) {
  const [s, setS] = useAutoStep(steps.length + 1, 1100);
  return (
    <figure className="pp-card pp-pipe">
      <ol>
        {steps.map((st, i) => (
          <li key={st} className={i < s ? "is-done" : i === s ? "is-on" : ""}>
            <button type="button" onClick={() => setS(i)}>
              <span className="pp-pipe-dot" aria-hidden />
              {st}
            </button>
          </li>
        ))}
      </ol>
      <figcaption className="pp-legend"><span>{caption}</span></figcaption>
    </figure>
  );
}

/** Many doors, one hallway: entry points converge on the role selector. */
const DOORS = ["Sign up in the app", "Invited by a supplier", "After a supplier switch", "Social sign-in"];
const AFTER = ["Choose a role", "Try a demo", "Activate the role"];

function EntryWidget() {
  const [d, setD] = useAutoStep(DOORS.length, 1800);
  return (
    <figure className="pp-card pp-entry" aria-label="Ways into PowerPay">
      <div className="pp-entry-doors">
        {DOORS.map((x, i) => (
          <button key={x} type="button" className={i === d ? "is-on" : ""} onClick={() => setD(i)}>
            {x}
          </button>
        ))}
      </div>
      <div className="pp-entry-merge" aria-hidden>
        <span key={d} />
      </div>
      <ol className="pp-entry-after">
        {AFTER.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ol>
      <figcaption className="pp-legend"><span>Four ways in, one way forward</span></figcaption>
    </figure>
  );
}

/** Account model: individual vs organisation, with team and family. */
function AccountsWidget() {
  const [m, setM] = useAutoStep(2, 3000);
  const kids =
    m === 0
      ? ["Family members", "Own wallet", "Can add an organisation later"]
      : ["Admin", "Team members", "Roles & permissions", "Shared wallet"];
  return (
    <figure className="pp-card pp-acc">
      <Segmented items={["Individual", "Organisation"]} value={m} onChange={setM} label="Account type" />
      <div className="pp-acc-tree" key={m}>
        <div className="pp-acc-root">{m === 0 ? "Individual account" : "Organisation"}</div>
        <div className="pp-acc-kids">
          {kids.map((k, i) => (
            <span key={k} style={{ animationDelay: `${i * 90}ms` }}>
              {k}
            </span>
          ))}
        </div>
      </div>
      <figcaption className="pp-legend">
        <span>One person can belong to several organisations and switch between them</span>
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Stories                                                            */
/* ------------------------------------------------------------------ */

export function PowerPayStory({
  slug,
  gallery,
  onZoom,
  title,
}: {
  slug: string;
  gallery: readonly GalleryImage[];
  onZoom: (g: GalleryImage) => void;
  title: string;
}) {
  const g = (...i: number[]) => i.map((n) => gallery[n]).filter(Boolean);

  if (slug === "powerpay-application") {
    return (
      <div className="pp-story">
        <Hero slug={slug} title={title} gallery={gallery} />
        <Chapter kicker="The problem" title="One number, no story" onZoom={onZoom} widget={<CompareWidget />}>
          <p>Energy bills show one total at the end of the month. People don't know where it came from, when they used the most, or how to pay without calling support.</p>
          <p>The app had to work for households, businesses and prosumers — people who both use power and send it back to the grid.</p>
        </Chapter>
        <Chapter kicker="Getting in" title="Start in a minute" onZoom={onZoom} widget={<SplitFlowWidget label="App onboarding steps" steps={APP_ONBOARDING_STEPS} />} shots={g(0, 1, 2, 3)} phone flip>
          <p>Onboarding, sign-in and registration are short screens with one question each, and errors say what to fix right where they happen.</p>
          <p>A short intro shows what the app does before it asks for anything.</p>
        </Chapter>
        <Chapter kicker="Usage" title="One control, every question" onZoom={onZoom} widget={<UsageWidget />} shots={g(4, 5, 6, 7, 8, 9)} phone>
          <p>Day, week, month and year sit in one switch, so the same screen answers "why was today high?" and "how does this year compare?".</p>
          <p>Prosumers see power used and power sent back side by side — their own chart, not a household chart with extra lines.</p>
        </Chapter>
        <Chapter kicker="Billing" title="A total you can trust" onZoom={onZoom} widget={<InvoiceWidget />} shots={g(10, 11, 12)} phone flip>
          <p>Every invoice opens into its parts — consumption, tariff, fees and taxes. The statement of account puts every bill and payment on one timeline.</p>
        </Chapter>
        <Chapter
          kicker="Behind the bill"
          title="From meter to inbox"
          onZoom={onZoom}
          widget={
            <SplitFlowWidget label="Monthly billing cycle" steps={BILLING_STEPS} />
          }
        >
          <p>Bills are produced in cycles: meter readings come in, invoices are calculated per tariff, sent to every customer and matched with payments. The customer only sees the result — a clear invoice and an up-to-date statement.</p>
        </Chapter>
        <Chapter kicker="Control" title="Your account, your rules" onZoom={onZoom} widget={<SplitFlowWidget label="Settings areas" steps={SETTINGS_STEPS} />} shots={g(13, 14, 15, 16, 17)} phone flip>
          <p>Profile, security, notifications and payment methods live in one settings area with the same layout on every screen.</p>
          <p>Each area explains itself in one line, so people find the right setting without opening every page.</p>
        </Chapter>
      </div>
    );
  }

  if (slug === "powerpay-ui-design") {
    return (
      <div className="pp-story">
        <Hero slug={slug} title={title} gallery={gallery} />
        <Chapter kicker="The problem" title="Four users, one product" onZoom={onZoom} widget={<SplitFlowWidget label="User roles" steps={ROLE_STEPS} />}>
          <p>Consumers, suppliers, producers and investors need very different things. Four separate products would mean four interfaces to learn and a brand that changes from screen to screen.</p>
          <p>Instead: one design system, and a dashboard per role that puts that role's most important data first.</p>
        </Chapter>
        <Chapter kicker="Navigation" title="Eight areas, always in reach" onZoom={onZoom} widget={<SplitFlowWidget label="Sidebar areas" steps={NAV_STEPS} />} flip>
          <p>A compact sidebar keeps every main area one click away and leaves the most room for data. The same eight items appear in every dashboard.</p>
        </Chapter>
        <Chapter
          kicker="Supplier setup"
          title="Ready to bill in one sitting"
          onZoom={onZoom}
          widget={
            <SplitFlowWidget label="Supplier setup steps" steps={SUPPLIER_SETUP_STEPS} />
          }
        >
          <p>A new energy supplier is guided through a checklist: create the organisation, invite the team, bring in customers, then turn on billing and supplier switching. Each module is activated only when it's needed.</p>
        </Chapter>
        <Chapter kicker="Dashboards" title="Same parts, different priorities" onZoom={onZoom} shots={g(0, 1, 2)}>
          <p>Cards, tables and charts are shared. What changes is the order: usage and bills for consumers, customers and switch requests for suppliers, generation for producers.</p>
        </Chapter>
        <Chapter kicker="Money" title="Numbers that stand out" onZoom={onZoom} shots={g(3, 4, 5)} flip>
          <p>One green from the PowerPay logo is kept for status and key figures, so balances, alerts and trends stand out instead of competing with decoration.</p>
        </Chapter>
        <Chapter kicker="Details" title="Down to the meter" onZoom={onZoom} shots={g(6, 7)}>
          <p>Meter readings and invoice details use the same tables and type scale, so going deeper never feels like entering a different product.</p>
        </Chapter>
      </div>
    );
  }

  // powerpay-ux-design
  return (
    <div className="pp-story">
        <Hero slug={slug} title={title} gallery={gallery} />
      <Chapter kicker="The problem" title="Where people give up" onZoom={onZoom} widget={<CompareWidget />}>
        <p>Signing up for energy and switching supplier are usually slow and paper-heavy. People drop out halfway because they don't know what's needed or how many steps are left.</p>
        <p>The goal: show what's needed before starting, ask for one thing at a time, and always show where you are.</p>
      </Chapter>
      <Chapter kicker="First contact" title="Show the value first" onZoom={onZoom} shots={g(0, 1)} flip>
        <p>A short welcome tour shows invoices, the wallet, the power chart and supplier switching before asking for anything.</p>
      </Chapter>
      <Chapter
        kicker="Discovery"
        title="Mapping the whole product first"
        onZoom={onZoom}
        artifact={gallery[9]}
        legend={[
          { label: "In scope now", tone: "go" },
          { label: "Next", tone: "later" },
          { label: "Not now", tone: "no" },
        ]}
      >
        <p>Before drawing any screen, I mapped every path through the product on one board: registration, supplier switching, supplier setup, billing and the dashboards — and how they connect.</p>
        <p>Colour-coding each step as now, next or not now turned a long wish list into a first release that could actually ship.</p>
      </Chapter>
      <Chapter
        kicker="Research"
        title="Asking “what if?” at every step"
        onZoom={onZoom}
        flip
        widget={<SplitFlowWidget label="Sign-up research, step by step" steps={RESEARCH_STEPS} />}
      >
        <p>I benchmarked sign-up flows from well-known products, then walked through ours one step at a time and wrote down what could go wrong.</p>
        <p>Each question became a design decision — so edge cases were solved on the board, not discovered in production.</p>
      </Chapter>
      <Chapter kicker="Entry points" title="Many doors, one hallway" onZoom={onZoom} widget={<EntryWidget />} artifact={gallery[10]}>
        <p>People arrive in different ways: they sign up themselves, are invited by their supplier, land here after switching supplier, or use a social account. Every path ends in the same place — pick a role, try a demo, then activate it.</p>
        <p>Each path gets its own welcome message, so nobody sees a generic greeting that ignores how they got here.</p>
      </Chapter>
      <Chapter kicker="Accounts" title="People, teams and families" onZoom={onZoom} widget={<AccountsWidget />} flip>
        <p>An account can be personal or an organisation. Organisations have an admin, team members and roles; personal accounts can add family members. Mapping these relationships early kept every later screen clear about who can see and pay for what.</p>
        <p>To test it, I wrote eight fictional personas with overlapping roles — someone who runs several companies, someone who's a team member in two, someone who's a family member on another person's account — and checked every screen against them.</p>
      </Chapter>
      <Chapter
        kicker="Sign-up"
        title="One step, one question"
        onZoom={onZoom}
        widget={<SplitFlowWidget label="Sign-up steps" steps={SIGNUP_STEPS} />}
        shots={g(2, 3, 4)}
      >
        <p>Each step asks for one thing. The list on the left shows what's done, what's now and what's next, with a one-line reason for every step — so people know why they're being asked before they answer.</p>
        <p>Adding an organisation is optional and can wait until later.</p>
      </Chapter>
      <Chapter
        kicker="Switching supplier"
        title="No surprises at the end"
        onZoom={onZoom}
        flip
        widget={<SplitFlowWidget label="Supplier switch steps" steps={SWITCH_STEPS} />}
        shots={g(5, 6, 7, 8)}
      >
        <p>The switch starts with what to prepare — recent bills — and what to expect, then collects personal details, meter details and a signature, with separate paths for individuals and businesses.</p>
        <p>Creating an account comes last, after the application is complete, so nobody has to register before seeing what's involved.</p>
      </Chapter>
      <Chapter
        kicker="Behind the switch"
        title="What happens after Submit"
        onZoom={onZoom}
        widget={
          <PipelineWidget
            caption="The supplier side of a switch request"
            steps={["Request received", "Details reviewed", "Application generated", "Sent to network operator", "Reply received", "Customer onboarded"]}
          />
        }
      >
        <p>The customer's part ends at Submit, but the supplier's starts there. The supplier dashboard turns each request into a tracked job, so the customer can be told exactly where their switch is.</p>
      </Chapter>
    </div>
  );
}
