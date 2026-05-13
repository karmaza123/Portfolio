import { useEffect, useRef, useState } from "react";

/**
 * Mara Solis DS — custom cursor (circle, scales on targets), mix-blend-mode: difference.
 * Position updates on rAF + translate3d (no per-move React state) to avoid follow lag.
 * Disabled for coarse pointers and prefers-reduced-motion.
 */
export function MaraChrome() {
  const [on, setOn] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const pendingRef = useRef({ x: 0, y: 0, hidden: true });

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (coarse || reduce) return;

    setOn(true);
    document.documentElement.classList.add("mara-cursor-on");

    const interactive =
      "a, button, [role='button'], input, textarea, select, .pf-card--link, .pf-chip, .pf-cta-btn, .rs-nav-link, .aa-back, .mp-project-item, .mp-hero-cta, .mp-contact-email, .mp-contact-link, .mp-nav-brand, .mpr-back, .mpr-contact-link, .mpr-download, .mp-nav-status--action, .mp-nav-burger, .mp-nav-drawer-close, .mp-nav-drawer-scrim, .mp-nav-drawer-links a, .mp-view-more, .mp-nav-appearance-summary, .mp-appearance-switch";

    const CURSOR_HALF = 24;

    const apply = () => {
      rafRef.current = 0;
      const el = rootRef.current;
      if (!el) return;
      const p = pendingRef.current;
      let expanded = false;
      if (!p.hidden) {
        const hit = document.elementFromPoint(p.x, p.y);
        expanded = !!hit?.closest(interactive);
      }

      el.classList.toggle("mara-cursor--expanded", expanded);
      el.classList.toggle("mara-cursor--hidden", p.hidden);
      el.style.transform = `translate3d(${p.x - CURSOR_HALF}px, ${p.y - CURSOR_HALF}px, 0)`;
    };

    const schedule = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(apply);
    };

    const move = (e: MouseEvent) => {
      pendingRef.current.x = e.clientX;
      pendingRef.current.y = e.clientY;
      pendingRef.current.hidden = false;
      schedule();
    };

    const leave = () => {
      pendingRef.current.hidden = true;
      schedule();
    };

    window.addEventListener("mousemove", move, { passive: true });
    document.body.addEventListener("mouseleave", leave);

    return () => {
      document.documentElement.classList.remove("mara-cursor-on");
      window.removeEventListener("mousemove", move);
      document.body.removeEventListener("mouseleave", leave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!on) return null;

  return (
    <div ref={rootRef} className="mara-cursor mara-cursor--hidden" aria-hidden>
      <div className="mara-cursor-inner">
        <span className="mara-cursor-dot" aria-hidden />
      </div>
    </div>
  );
}
