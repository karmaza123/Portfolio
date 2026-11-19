import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Reveal } from "../components/Reveal";
import { Icon, useCountUp, useInView, usePrefersReducedMotion, type IconName } from "./mintlyUi";
import "./MintlyShowcase.css";

const IMG = "/case-studies/mintly/showcase";

function AppRail({ active }: { active: IconName }) {
  const items: IconName[] = ["home", "compass", "megaphone", "plus", "users", "book", "info"];
  return (
    <nav className="ms-rail" aria-hidden>
      <span className="ms-logo" />
      {items.map((n) => (
        <span key={n} className={`ms-rail-item${n === active ? " is-active" : ""}`}>
          <Icon name={n} size={18} />
        </span>
      ))}
      <span className="ms-rail-item ms-rail-item--end">
        <Icon name="settings" size={18} />
      </span>
    </nav>
  );
}

/* —— 2. Launch your campaign (5 steps + live preview) —— */

const STEPS = ["Basics", "Budget & rates", "Assets", "Schedule", "Launch"] as const;
const CAMPAIGN_NAME = "Sketch the city in 30 seconds";

function LaunchCampaign() {
  const reduced = usePrefersReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>();
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState(0);
  const [launched, setLaunched] = useState(false);
  const [paused, setPaused] = useState(false);
  const budget = useCountUp(5000, inView && step >= 1, 900);

  // Type the campaign name, then walk through the steps on its own.
  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setTyped(CAMPAIGN_NAME.length);
      return;
    }
    if (typed < CAMPAIGN_NAME.length) {
      const t = window.setTimeout(() => setTyped((n) => n + 1), 45);
      return () => window.clearTimeout(t);
    }
  }, [inView, typed, reduced]);

  useEffect(() => {
    if (!inView || reduced || paused || typed < CAMPAIGN_NAME.length) return;
    const t = window.setTimeout(
      () => {
        if (step < STEPS.length - 1) setStep((s) => s + 1);
        else if (!launched) setLaunched(true);
        else {
          setLaunched(false);
          setStep(0);
        }
      },
      step === STEPS.length - 1 && launched ? 3200 : 2400,
    );
    return () => window.clearTimeout(t);
  }, [inView, reduced, paused, step, typed, launched]);

  const go = (i: number) => {
    setPaused(true);
    setLaunched(false);
    setStep(i);
  };

  const name = CAMPAIGN_NAME.slice(0, typed);
  const hasPhoto = step >= 2;

  return (
    <div ref={ref} className={`ms-window${inView ? " is-in" : ""}`}>
      <AppRail active="megaphone" />
      <div className="ms-screen ms-launch">
        <header className="ms-launch-head">
          <div>
            <span className="ms-eyebrow-pill">Creator Rewards</span>
            <h3>Launch your campaign</h3>
          </div>
          <span className="ms-crumb">Step {step + 1} of 5</span>
        </header>
        <div className="ms-steps" role="tablist" aria-label="Campaign steps">
          {STEPS.map((s, i) => (
            <button
              key={s}
              type="button"
              role="tab"
              aria-selected={i === step}
              className={i === step ? "is-on" : i < step ? "is-done" : undefined}
              onClick={() => go(i)}
            >
              <i>{i < step ? <Icon name="check" size={11} /> : i + 1}</i>
              {s}
            </button>
          ))}
        </div>
        <div className="ms-steps-bar">
          <i style={{ "--p": `${((step + 1) / 5) * 100}%` } as CSSProperties} />
        </div>

        <div className="ms-launch-grid">
          <section className="ms-panel ms-form" key={step}>
            {step === 0 ? (
              <>
                <label>Campaign name</label>
                <span className="ms-input">
                  {name}
                  <i className="ms-caret" />
                </span>
                <label>Type</label>
                <span className="ms-optrow">
                  <span className="is-on">UGC</span>
                  <span>Clipping</span>
                  <span>Both</span>
                </span>
                <label>Platforms</label>
                <span className="ms-optrow">
                  <span className="is-on">TikTok</span>
                  <span className="is-on">Instagram Reels</span>
                  <span>YouTube Shorts</span>
                </span>
              </>
            ) : step === 1 ? (
              <>
                <label>Total budget</label>
                <span className="ms-input ms-input--big">₾{Math.round(budget).toLocaleString("en-US")}</span>
                <label>Rate per 1,000 views</label>
                <ul className="ms-rates ms-rates--form">
                  {[
                    ["tiktok", "TikTok", "₾2"],
                    ["instagram", "Instagram Reels", "₾1.5"],
                  ].map(([icon, n, r], i) => (
                    <li key={n} style={{ "--i": i } as CSSProperties}>
                      <span>
                        <Icon name={icon as IconName} size={15} />
                        {n}
                      </span>
                      <b>{r}</b>
                    </li>
                  ))}
                </ul>
              </>
            ) : step === 2 ? (
              <>
                <label>Campaign thumbnail</label>
                <span className="ms-optrow">
                  <span className="is-on">Photo</span>
                  <span>Video</span>
                </span>
                <div className="ms-drop">
                  <img src={`${IMG}/cafe.webp`} alt="" />
                  <span><Icon name="check" size={13} />cafe-sketch.jpg · uploaded</span>
                </div>
              </>
            ) : step === 3 ? (
              <>
                <label>Runs</label>
                <span className="ms-optrow">
                  <span className="is-on">1 Nov</span>
                  <span className="ms-optrow-arrow"><Icon name="arrow" size={14} /></span>
                  <span className="is-on">30 Nov</span>
                </span>
                <label>Visibility</label>
                <span className="ms-optrow">
                  <span className="is-on">Public</span>
                  <span>Members only</span>
                </span>
                <span className="ms-hint">Public campaigns appear in Discover for every creator.</span>
              </>
            ) : (
              <>
                <label>Ready to launch</label>
                <ul className="ms-summary">
                  <li><span>Budget</span><b>₾5,000</b></li>
                  <li><span>Rates</span><b>₾1.5–2 / 1K views</b></li>
                  <li><span>Runs</span><b>1–30 Nov</b></li>
                  <li><span>Visibility</span><b>Public</b></li>
                </ul>
                <span className={`ms-btn ms-btn--gold ms-launch-btn${launched ? " is-done" : ""}`}>
                  {launched ? (
                    <>
                      <Icon name="check" size={15} />
                      Launched
                    </>
                  ) : (
                    <>
                      <Icon name="arrow" size={15} />
                      Launch campaign
                    </>
                  )}
                </span>
              </>
            )}
          </section>

          <aside className="ms-panel ms-preview">
            <span className="ms-eyebrow">Live preview</span>
            <span className="ms-hint">How creators will see it in Discover</span>
            <div className={`ms-preview-card${launched ? " is-live" : ""}`}>
              <div className="ms-preview-img">
                <span className={`ms-preview-ph${hasPhoto ? " is-gone" : ""}`}><Icon name="image" size={22} /></span>
                <img className={hasPhoto ? "is-on" : undefined} src={`${IMG}/cafe.webp`} alt="" />
                <span className="ms-tag">UGC</span>
              </div>
              <div className="ms-card-body">
                <p className="ms-rate">
                  <b>{step >= 1 ? "₾1.5" : "₾0"}</b> / 1,000 views
                </p>
                <h4 className="ms-card-title">{name || "Campaign name"}</h4>
                <p className="ms-handle">
                  <span className="ms-avatar">TM</span>@tbilisi.makers
                </p>
                <div className="ms-budget">
                  <span>Paid out</span>
                  <span>₾0 / ₾{step >= 1 ? "5,000" : "0"}</span>
                </div>
                <div className="ms-progress"><i style={{ width: 0 }} /></div>
                <p className="ms-meta">
                  <span className={`ms-status ${launched ? "ms-status--active" : "ms-status--saved"}`}>
                    {launched ? "Active" : "Draft"}
                  </span>
                  {step >= 3 ? "1–30 Nov" : "No date"}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* —— 3a. Space analytics —— */

function SpaceAnalytics() {
  const [ref, inView] = useInView<HTMLDivElement>();
  const spent = useCountUp(7860, inView, 1400);
  const views = useCountUp(482, inView, 1400);
  const creators = useCountUp(37, inView, 1200);
  const approval = useCountUp(86, inView, 1200);
  const pipeline = [
    { label: "Approved", n: 64, tone: "mint" },
    { label: "Pending", n: 12, tone: "gold" },
    { label: "Rejected", n: 9, tone: "rose" },
  ];
  const total = pipeline.reduce((a, b) => a + b.n, 0);
  return (
    <div ref={ref} className={`ms-window ms-window--compact${inView ? " is-in" : ""}`}>
      <div className="ms-screen">
        <span className="ms-panel-label">Operations</span>
        <h3 className="ms-win-title">Space overview</h3>
        <section className="ms-panel ms-panel--tight">
          <div className="ms-budget">
            <span>Budget &amp; spend</span>
            <span className="ms-mint">{Math.round((spent / 12400) * 100)}% deployed</span>
          </div>
          <p className="ms-big">
            ₾{Math.round(spent).toLocaleString("en-US")}
            <small> / ₾12,400</small>
          </p>
          <div className="ms-progress ms-progress--lg ms-progress--mint">
            <i style={{ "--p": `${(spent / 12400) * 100}%` } as CSSProperties} />
          </div>
        </section>
        <div className="ms-tiles3">
          <div className="ms-panel ms-panel--tight">
            <span className="ms-panel-label">Views</span>
            <b>{Math.round(views)}K</b>
          </div>
          <div className="ms-panel ms-panel--tight">
            <span className="ms-panel-label">Creators</span>
            <b>{Math.round(creators)}</b>
          </div>
          <div className="ms-panel ms-panel--tight">
            <span className="ms-panel-label">Approval</span>
            <b>{Math.round(approval)}%</b>
          </div>
        </div>
        <section className="ms-panel ms-panel--tight">
          <span className="ms-panel-label">Submission pipeline · {total}</span>
          <div className="ms-stack">
            {pipeline.map((p, i) => (
              <i
                key={p.label}
                className={`ms-stack--${p.tone}`}
                style={{ "--w": `${(p.n / total) * 100}%`, "--i": i } as CSSProperties}
              />
            ))}
          </div>
          <div className="ms-stack-legend">
            {pipeline.map((p) => (
              <span key={p.label}>
                <i className={`ms-stack--${p.tone}`} />
                {p.n} {p.label.toLowerCase()}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/* —— 3b. Affiliate program —— */

function AffiliateProgram() {
  const reduced = usePrefersReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>();
  const [on, setOn] = useState(false);
  const [rate, setRate] = useState(10);
  const [renew, setRenew] = useState(false);

  // Switch the program on, then slide the commission up to 30%.
  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setOn(true);
      setRate(30);
      return;
    }
    const a = window.setTimeout(() => setOn(true), 500);
    const b = window.setInterval(() => setRate((r) => (r < 30 ? r + 1 : r)), 70);
    const c = window.setTimeout(() => setRenew(true), 2600);
    return () => {
      window.clearTimeout(a);
      window.clearInterval(b);
      window.clearTimeout(c);
    };
  }, [inView, reduced]);

  return (
    <div ref={ref} className={`ms-window ms-window--compact${inView ? " is-in" : ""}`}>
      <div className="ms-screen">
        <span className="ms-panel-label">Growth</span>
        <h3 className="ms-win-title">Affiliate program</h3>
        <div className="ms-product-pick">
          <img src={`${IMG}/laptop.webp`} alt="" />
          <span>
            <b>Course · Pricing your first course</b>
            <small>₾45 · one-time</small>
          </span>
          <Icon name="check" size={16} />
        </div>
        <ul className="ms-settings">
          <li>
            <span>
              <b>Affiliate program</b>
              <small>Let others promote this product for a cut of each sale.</small>
            </span>
            <button
              type="button"
              className={`ms-switch${on ? " is-on" : ""}`}
              role="switch"
              aria-checked={on}
              aria-label="Affiliate program"
              onClick={() => setOn((v) => !v)}
            >
              <i />
            </button>
          </li>
          <li className={on ? undefined : "is-off"}>
            <span>
              <b>Commission rate</b>
              <small>
                The affiliate keeps ₾{((45 * rate) / 100).toFixed(2)} of each ₾45 sale.
              </small>
            </span>
            <span className="ms-value">{rate}%</span>
          </li>
          <li className={on ? undefined : "is-off"}>
            <span className="ms-slider">
              <i style={{ "--p": `${(rate / 50) * 100}%` } as CSSProperties} />
            </span>
          </li>
          <li className={on ? undefined : "is-off"}>
            <span>
              <b>Pay on renewals</b>
              <small>Off means affiliates earn on the first payment only.</small>
            </span>
            <button
              type="button"
              className={`ms-switch${renew ? " is-on" : ""}`}
              role="switch"
              aria-checked={renew}
              aria-label="Pay on renewals"
              onClick={() => setRenew((v) => !v)}
            >
              <i />
            </button>
          </li>
          <li className={on ? undefined : "is-off"}>
            <span>
              <b>Attribution window</b>
              <small>How long after a click a purchase still counts.</small>
            </span>
            <span className="ms-value">30 days</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

/* —— 3. App Store —— */

const APPS: readonly { name: string; cat: string; desc: string; icon: IconName; tone: string; cover: string; state: "Add" | "Added" | "Soon" }[] = [
  { name: "Creator Rewards", cat: "Grow", desc: "Run campaigns and pay creators per view.", icon: "gift", tone: "gold", cover: "bars", state: "Added" },
  { name: "Gateway", cat: "Sell", desc: "Sell access to any link — Telegram, Discord, Notion.", icon: "link", tone: "blue", cover: "stripes", state: "Added" },
  { name: "Courses", cat: "Teach", desc: "Structured lessons with video, PDF and quizzes.", icon: "book", tone: "coral", cover: "pages", state: "Add" },
  { name: "Mintly Cloud", cat: "Sell", desc: "Shared drive that sells as a product.", icon: "cloud", tone: "violet", cover: "clouds", state: "Add" },
  { name: "Consulting", cat: "Teach", desc: "Paid 1:1 calls with booking and video.", icon: "video", tone: "cyan", cover: "ripple", state: "Add" },
  { name: "Live Stream", cat: "Teach", desc: "Go live and sell tickets to your stream.", icon: "radio", tone: "red", cover: "live", state: "Add" },
  { name: "Shop", cat: "Sell", desc: "Physical and digital goods, direct to members.", icon: "bag", tone: "pink", cover: "diamonds", state: "Soon" },
  { name: "Chat", cat: "Community", desc: "Real-time messages and group chats.", icon: "chat", tone: "purple", cover: "bubbles", state: "Soon" },
];

function AppCover({ kind }: { kind: string }) {
  if (kind === "bars")
    return (
      <div className="ac ac--bars">
        {Array.from({ length: 7 }, (_, i) => (
          <i key={i} style={{ "--i": i, "--h": `${30 + i * 10}%` } as CSSProperties} />
        ))}
      </div>
    );
  if (kind === "pages")
    return (
      <div className="ac ac--pages">
        <i /><i /><i />
      </div>
    );
  if (kind === "clouds")
    return (
      <div className="ac ac--clouds">
        <i /><i /><i /><i />
      </div>
    );
  if (kind === "ripple")
    return (
      <div className="ac ac--ripple">
        <i /><i /><i /><b />
      </div>
    );
  if (kind === "live")
    return (
      <div className="ac ac--live">
        <span className="ac-corner" /><span className="ac-corner" /><span className="ac-corner" /><span className="ac-corner" />
        <b />
      </div>
    );
  if (kind === "diamonds") return <div className="ac ac--diamonds" />;
  if (kind === "bubbles")
    return (
      <div className="ac ac--bubbles">
        <i /><i /><i /><i />
      </div>
    );
  return <div className="ac ac--stripes" />;
}

function AppStore() {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [added, setAdded] = useState<Record<string, boolean>>({});
  return (
    <div ref={ref} className={`ms-apps${inView ? " is-in" : ""}`}>
      {APPS.map((a, i) => {
        const isAdded = a.state === "Added" || added[a.name];
        return (
          <article key={a.name} className={`ms-app ms-app--${a.tone}`} style={{ "--i": i } as CSSProperties}>
            <AppCover kind={a.cover} />
            <div className="ms-app-body">
              <div className="ms-app-head">
                <span className="ms-app-icon"><Icon name={a.icon} size={18} /></span>
                <span>
                  <b>{a.name}</b>
                  <small>{a.cat}</small>
                </span>
                {a.state === "Soon" ? (
                  <span className="ms-pill">Coming soon</span>
                ) : (
                  <button
                    type="button"
                    className={`ms-pill ms-pill--action${isAdded ? " is-added" : ""}`}
                    onClick={() => setAdded((s) => ({ ...s, [a.name]: true }))}
                  >
                    {isAdded ? (
                      <>
                        <Icon name="check" size={13} /> Added
                      </>
                    ) : (
                      "Add"
                    )}
                  </button>
                )}
              </div>
              <p>{a.desc}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}

/* —— 4. Components —— */

const BTN_STATES = ["Default", "Hover", "Pressed", "Loading", "Done"] as const;

function ComponentStrip() {
  const reduced = usePrefersReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>();
  const [step, setStep] = useState(0);
  const [on, setOn] = useState(true);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (!inView || reduced) return;
    const t = window.setInterval(() => setStep((s) => (s + 1) % BTN_STATES.length), 1100);
    const s = window.setInterval(() => setOn((v) => !v), 2400);
    const q = window.setInterval(() => setToast((v) => !v), 2000);
    return () => {
      window.clearInterval(t);
      window.clearInterval(s);
      window.clearInterval(q);
    };
  }, [inView, reduced]);

  const state = BTN_STATES[step];
  return (
    <div ref={ref} className="ms-comps">
      <div className="ms-comp">
        <span className="ms-comp-label">Button · {state}</span>
        <div className="ms-comp-stage">
          <span className={`ms-btn ms-btn--mint ms-demo-btn is-${state.toLowerCase()}`}>
            {state === "Loading" ? <span className="ms-spinner ms-spinner--dark" /> : null}
            {state === "Done" ? <Icon name="check" size={16} /> : null}
            {state === "Loading" ? "Joining" : state === "Done" ? "Joined" : "Join campaign"}
          </span>
        </div>
      </div>
      <div className="ms-comp">
        <span className="ms-comp-label">Switch · {on ? "On" : "Off"}</span>
        <div className="ms-comp-stage">
          <button
            type="button"
            className={`ms-switch${on ? " is-on" : ""}`}
            role="switch"
            aria-checked={on}
            aria-label="Notify me about new campaigns"
            onClick={() => setOn((v) => !v)}
          >
            <i />
          </button>
          <span className="ms-switch-text">Notify me about new campaigns</span>
        </div>
      </div>
      <div className="ms-comp">
        <span className="ms-comp-label">Toast</span>
        <div className="ms-comp-stage ms-comp-stage--toast">
          <div className={`ms-toast ms-toast--inline${toast || reduced ? " is-on" : ""}`}>
            <span><Icon name="check" size={14} /></span>
            Video submitted
          </div>
        </div>
      </div>
      <div className="ms-comp">
        <span className="ms-comp-label">Payout chips</span>
        <div className="ms-comp-stage">
          <div className={`ms-chips ms-chips--demo${inView ? " is-in" : ""}`}>
            <span><Icon name="tiktok" size={13} />TikTok · ₾2</span>
            <span><Icon name="instagram" size={13} />Instagram · ₾1.5</span>
            <span><Icon name="youtube" size={13} />YouTube · ₾3</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* —— Section —— */

function Caption({ num, title, children }: { num: string; title: string; children: ReactNode }) {
  return (
    <div className="ms-caption">
      <span className="ms-caption-num">{num}</span>
      <div>
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
    </div>
  );
}

export function MintlyShowcase() {
  return (
    <section className="mt-section ms" aria-labelledby="mt-finished">
      <Reveal>
        <header className="mt-head">
          <div className="mt-head-title">
            <span className="mt-label">05 — The finished product</span>
            <h2 id="mt-finished" className="mt-h2">
              Built from the system, live
            </h2>
          </div>
          <p className="mt-head-body">
            The shipped screens, rebuilt here in code with the system’s own tokens — not
            screenshots. The campaign builds itself step by step, numbers count up and budgets fill.
            Click around.
          </p>
        </header>
      </Reveal>

      <div className="ms-block">
        <Caption num="5.1" title="Launch your campaign">
          Five steps with a live preview: the card creators will see updates as each field fills in.
        </Caption>
        <LaunchCampaign />
      </div>

      <div className="ms-block">
        <Caption num="5.2" title="Space analytics · Affiliate program">
          The owner’s side: budget health at a glance, and a commission that explains itself in money.
        </Caption>
        <div className="ms-duo">
          <SpaceAnalytics />
          <AffiliateProgram />
        </div>
      </div>

      <div className="ms-block">
        <Caption num="5.3" title="App Store">
          Eight apps, each with its own color and a moving cover drawn from the same parts.
        </Caption>
        <AppStore />
      </div>

      <div className="ms-block">
        <Caption num="5.4" title="Components in motion">
          Feedback in 80–160ms, entrances in 200–320ms — the timings from the motion proposal.
        </Caption>
        <ComponentStrip />
      </div>
    </section>
  );
}
