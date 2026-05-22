import { useEffect, useRef, useState } from "react";
import { isInteractiveAt, isTextAt } from "../lib/cursorHit";

const CURSOR_HALF = 24;

/**
 * Mara Solis DS — custom cursor (circle on links, backslash on text).
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

    const apply = () => {
      rafRef.current = 0;
      const el = rootRef.current;
      if (!el) return;
      const { x, y, hidden } = pendingRef.current;

      const expanded = !hidden && isInteractiveAt(x, y);
      const overText = !hidden && !expanded && isTextAt(x, y);

      el.classList.toggle("mara-cursor--expanded", expanded);
      el.classList.toggle("mara-cursor--text", overText);
      el.classList.toggle("mara-cursor--hidden", hidden);
      el.style.transform = `translate3d(${x - CURSOR_HALF}px, ${y - CURSOR_HALF}px, 0)`;
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
        <span className="mara-cursor-slash" aria-hidden />
      </div>
    </div>
  );
}
