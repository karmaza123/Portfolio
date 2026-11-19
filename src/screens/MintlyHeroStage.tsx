import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Icon, usePrefersReducedMotion } from "./mintlyUi";
import "./MintlyHeroStage.css";

const IMG = "/case-studies/mintly/showcase";
const TABS = ["All", "Active", "Finished", "Saved"] as const;

/** Running mm:ss clock, starting from a fixed offset so it reads like a class already in progress. */
function useClock(startSeconds: number, running: boolean) {
  const [t, setT] = useState(startSeconds);
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setT((v) => v + 1), 1000);
    return () => window.clearInterval(id);
  }, [running]);
  const m = Math.floor(t / 60);
  const s = t % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Hero composition for the Mintly case study: the finished Space home and Creator
 * Rewards screens, rebuilt in code, with floating components layered on top.
 * Layers drift apart with the cursor; everything enters in sequence on load.
 */
export function MintlyHeroStage() {
  const reduced = usePrefersReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState(0);
  const [toast, setToast] = useState(false);
  const [viewers, setViewers] = useState(42);
  const clock = useClock(12 * 60 + 48, !reduced);

  useEffect(() => {
    if (reduced) {
      setToast(true);
      return;
    }
    const tabs = window.setInterval(() => setTab((i) => (i + 1) % TABS.length), 2600);
    const views = window.setInterval(() => setViewers((v) => v + (Math.random() > 0.35 ? 1 : 0)), 1800);
    // Toast: first appears after the entry sequence, then repeats.
    let hide = 0;
    const show = () => {
      setToast(true);
      hide = window.setTimeout(() => setToast(false), 2600);
    };
    const first = window.setTimeout(show, 1500);
    const loop = window.setInterval(show, 6200);
    return () => {
      window.clearInterval(tabs);
      window.clearInterval(views);
      window.clearTimeout(first);
      window.clearTimeout(hide);
      window.clearInterval(loop);
    };
  }, [reduced]);

  // Cursor parallax: write -1..1 offsets as CSS variables; layers scale them by depth.
  useEffect(() => {
    const el = stageRef.current;
    if (!el || reduced || !window.matchMedia("(hover: hover)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 2 - 1;
      const y = ((e.clientY - r.top) / r.height) * 2 - 1;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--mx", Math.max(-1, Math.min(1, x)).toFixed(3));
        el.style.setProperty("--my", Math.max(-1, Math.min(1, y)).toFixed(3));
      });
    };
    const onLeave = () => {
      el.style.setProperty("--mx", "0");
      el.style.setProperty("--my", "0");
    };
    window.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced]);

  return (
    <div ref={stageRef} className="mh" aria-hidden>
      {/* Back: Space home */}
      <div className="mh-layer mh-layer--back" style={{ "--depth": 10 } as CSSProperties}>
        <div className="mh-win mh-win--home">
          <div className="mh-rail">
            <span className="mh-logo" />
            <span className="mh-rail-dot is-on"><Icon name="home" size={13} /></span>
            <span className="mh-rail-dot"><Icon name="compass" size={13} /></span>
            <span className="mh-rail-dot"><Icon name="megaphone" size={13} /></span>
            <span className="mh-rail-dot"><Icon name="plus" size={13} /></span>
          </div>
          <div className="mh-home">
            <div className="mh-cover">
              <img src={`${IMG}/tbilisi.webp`} alt="" />
            </div>
            <div className="mh-profile">
              <span className="mh-profile-av">TM</span>
              <span className="mh-profile-copy">
                <b>Tbilisi Makers</b>
                <small>Design · Education · 1,240 members</small>
              </span>
              <span className="mh-follow"><Icon name="plus" size={11} />Follow</span>
            </div>
            <div className="mh-home-row">
              <div className="mh-product">
                <img src={`${IMG}/tablet.webp`} alt="" />
                <span><b>₾12</b> / month</span>
                <em>Illustration club</em>
              </div>
              <div className="mh-post">
                <span className="mh-post-head"><i />Nino K. · 2h</span>
                <div className="mh-post-img">
                  <img src={`${IMG}/selfie.webp`} alt="" />
                  <span className="mh-tag">UGC</span>
                </div>
                <span className="mh-post-foot"><Icon name="heart" size={11} />128<Icon name="message" size={11} />14</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Front: Creator Rewards · Discover */}
      <div className="mh-layer mh-layer--front" style={{ "--depth": 22 } as CSSProperties}>
        <div className="mh-win mh-win--rewards">
          <div className="mh-banner">
            <span className="mh-gift"><Icon name="gift" size={18} /></span>
            <span className="mh-banner-copy">
              <small>Creator Rewards</small>
              <b>Get paid per 1,000 views</b>
            </span>
            <span className="mh-bars">
              {Array.from({ length: 7 }, (_, i) => (
                <i key={i} style={{ "--i": i, "--h": `${26 + i * 11}%` } as CSSProperties} />
              ))}
            </span>
          </div>
          <div className="mh-seg" style={{ "--idx": tab } as CSSProperties}>
            <span className="mh-seg-thumb" />
            {TABS.map((t, i) => (
              <span key={t} className={i === tab ? "is-on" : undefined}>{t}</span>
            ))}
          </div>
          <div className="mh-cards">
            {[
              { img: "creator.webp", rate: "₾1.5", title: "Unbox the new runners", p: 59 },
              { img: "mountain.webp", rate: "₾2", title: "Summit gear — trail clips", p: 31 },
            ].map((c, i) => (
              <div key={c.title} className="mh-card" style={{ "--i": i, "--p": `${c.p}%` } as CSSProperties}>
                <div className="mh-card-img">
                  <img src={`${IMG}/${c.img}`} alt="" />
                  <span className="mh-tag">{i ? "Clipping" : "UGC"}</span>
                </div>
                <div className="mh-card-body">
                  <span className="mh-rate"><b>{c.rate}</b> / 1,000 views</span>
                  <b className="mh-card-title">{c.title}</b>
                  <span className="mh-progress"><i /></span>
                  <span className="mh-join">Join campaign</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating: live class tile */}
      <div className="mh-layer mh-layer--live" style={{ "--depth": 34 } as CSSProperties}>
        <div className="mh-live">
          <img src={`${IMG}/host.webp`} alt="" />
          <span className="mh-live-badge"><i />Live {clock}</span>
          <span className="mh-live-views"><Icon name="eye" size={11} />{viewers}</span>
          <span className="mh-live-name">Pricing your first course</span>
        </div>
      </div>

      {/* Floating: payout chips */}
      <div className="mh-layer mh-layer--chips" style={{ "--depth": 30 } as CSSProperties}>
        <div className="mh-chips">
          <span><Icon name="tiktok" size={11} />₾2</span>
          <span><Icon name="instagram" size={11} />₾1.5</span>
          <span><Icon name="youtube" size={11} />₾3</span>
        </div>
      </div>

      {/* Floating: toast */}
      <div className="mh-layer mh-layer--toast" style={{ "--depth": 40 } as CSSProperties}>
        <div className={`mh-toast${toast ? " is-on" : ""}`}>
          <span><Icon name="check" size={12} /></span>
          Video submitted
        </div>
      </div>
    </div>
  );
}
