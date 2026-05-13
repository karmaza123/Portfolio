import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger order (multiplied by --motion-stagger in CSS). */
  staggerIndex?: number;
  /** Extra delay in ms before the transition runs. */
  delayMs?: number;
  /** Slight blur while hidden (no effect if user prefers reduced motion). */
  blur?: boolean;
};

export function Reveal({
  children,
  className = "",
  staggerIndex = 0,
  delayMs = 0,
  blur = false,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting);
        if (hit) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.06 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const staggerMs = staggerIndex * 100;
  const style = {
    "--reveal-delay": `${delayMs + staggerMs}ms`,
  } as CSSProperties;

  const cls = [
    "reveal",
    blur ? "reveal--blur" : "",
    visible ? "reveal--visible" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={ref} className={cls} style={style}>
      {children}
    </div>
  );
}
