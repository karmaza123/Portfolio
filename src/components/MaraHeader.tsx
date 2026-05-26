import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AppearanceToggles, IconDisplay } from "./AppearanceToggles";
import { BrandMark } from "./BrandMark";
import { CONTACT_MAILTO } from "../constants/contact";
import { useIsMobileLayout } from "../hooks/useIsMobileLayout";

export type MaraHeaderActive = "home" | "resume" | "work";

type MaraHeaderProps = {
  active?: MaraHeaderActive;
};

export function MaraHeader({ active = "home" }: MaraHeaderProps) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobileLayout();
  const drawerId = useId();
  const appearanceDetailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (!isMobile) setOpen(false);
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile || !open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, isMobile]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const el = appearanceDetailsRef.current;
    if (!el) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!el.open) return;
      const t = e.target as Node;
      if (el.contains(t)) return;
      el.open = false;
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const close = () => setOpen(false);

  return (
    <>
      <nav className="mp-nav" aria-label="Primary">
        <Link to="/" className="mp-nav-brand" aria-label="Home" onClick={close}>
          <BrandMark className="mp-nav-brand-mark" />
        </Link>

        <ul className="mp-nav-links mp-nav-links--desktop">
          <li>
            <Link to="/work" aria-current={active === "work" ? "page" : undefined}>
              Work
            </Link>
          </li>
          <li>
            <Link to={{ pathname: "/", hash: "about" }}>About</Link>
          </li>
          <li>
            <Link to={{ pathname: "/", hash: "process" }}>Process</Link>
          </li>
          <li>
            <Link to="/resume" aria-current={active === "resume" ? "page" : undefined}>
              Resume
            </Link>
          </li>
          <li>
            <Link to={{ pathname: "/", hash: "contact" }}>Contact</Link>
          </li>
        </ul>

        <div className="mp-nav-end">
          <a
            href={CONTACT_MAILTO}
            className="mp-nav-status mp-nav-status--action"
            aria-label="Email Dimitri — available"
          >
            <span className="mp-status-dot" aria-hidden />
            Available
          </a>

          <details ref={appearanceDetailsRef} className="mp-nav-appearance">
            <summary className="mp-nav-appearance-summary" aria-label="Display preferences">
              <IconDisplay className="mp-nav-appearance-icon" />
            </summary>
            <div className="mp-nav-appearance-panel">
              <AppearanceToggles />
            </div>
          </details>

          <button
            type="button"
            className="mp-nav-burger"
            aria-expanded={open}
            aria-controls={drawerId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="mp-nav-burger-lines" aria-hidden>
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </nav>

      <div
        id={drawerId}
        className={`mp-nav-drawer${open ? " mp-nav-drawer--open" : ""}`}
        aria-hidden={!open}
        inert={!open}
      >
        <button type="button" className="mp-nav-drawer-scrim" aria-label="Close menu" onClick={close} />
        <div className="mp-nav-drawer-panel" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="mp-nav-drawer-head">
            <span className="mp-section-label">Menu</span>
            <button type="button" className="mp-nav-drawer-close" onClick={close} aria-label="Close menu">
              ×
            </button>
          </div>
          <ul className="mp-nav-drawer-links">
            <li>
              <Link to="/work" onClick={close} aria-current={active === "work" ? "page" : undefined}>
                Work
              </Link>
            </li>
            <li>
              <Link to={{ pathname: "/", hash: "about" }} onClick={close}>
                About
              </Link>
            </li>
            <li>
              <Link to={{ pathname: "/", hash: "process" }} onClick={close}>
                Process
              </Link>
            </li>
            <li>
              <Link to="/resume" onClick={close} aria-current={active === "resume" ? "page" : undefined}>
                Resume
              </Link>
            </li>
            <li>
              <Link to={{ pathname: "/", hash: "contact" }} onClick={close}>
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
