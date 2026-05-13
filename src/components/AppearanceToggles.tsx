import { useMaraAppearance } from "../context/MaraAppearance";

function IconLightMode({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconContrast({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 4v16" stroke="currentColor" strokeWidth="1.5" />
      <path fill="currentColor" d="M12 4A8 8 0 0 1 12 20V4Z" opacity="0.35" />
    </svg>
  );
}

export function AppearanceToggles() {
  const { theme, setTheme, highContrast, setHighContrast } = useMaraAppearance();
  const lightOn = theme === "light";

  const toggleLight = () => {
    setTheme(lightOn ? "dark" : "light");
  };

  const toggleContrast = () => {
    setHighContrast(!highContrast);
  };

  return (
    <div className="mp-appearance" role="group" aria-label="Display preferences">
      <div className="mp-appearance-grid">
        <div className="mp-appearance-card">
          <div className="mp-appearance-card-top">
            <IconLightMode className="mp-appearance-icon" />
            <button
              type="button"
              className="mp-appearance-switch"
              role="switch"
              aria-checked={lightOn}
              aria-label="Light mode"
              onClick={toggleLight}
            >
              <span className="mp-appearance-switch-thumb" />
            </button>
          </div>
          <span className="mp-appearance-card-title">Light mode</span>
        </div>
        <div className="mp-appearance-card">
          <div className="mp-appearance-card-top">
            <IconContrast className="mp-appearance-icon" />
            <button
              type="button"
              className="mp-appearance-switch"
              role="switch"
              aria-checked={highContrast}
              aria-label="High contrast"
              onClick={toggleContrast}
            >
              <span className="mp-appearance-switch-thumb" />
            </button>
          </div>
          <span className="mp-appearance-card-title">Contrast</span>
        </div>
      </div>
    </div>
  );
}
