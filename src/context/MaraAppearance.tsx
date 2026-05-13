import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_THEME = "mp-theme";
const STORAGE_CONTRAST = "mp-contrast";

export type MaraTheme = "dark" | "light";

type MaraAppearanceValue = {
  theme: MaraTheme;
  setTheme: (t: MaraTheme) => void;
  highContrast: boolean;
  setHighContrast: (v: boolean) => void;
};

const MaraAppearanceContext = createContext<MaraAppearanceValue | null>(null);

function readTheme(): MaraTheme {
  if (typeof window === "undefined") return "dark";
  return localStorage.getItem(STORAGE_THEME) === "light" ? "light" : "dark";
}

function readContrast(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_CONTRAST) === "high";
}

function syncDocument(theme: MaraTheme, highContrast: boolean) {
  const root = document.documentElement;
  if (theme === "light") root.setAttribute("data-mp-theme", "light");
  else root.removeAttribute("data-mp-theme");
  if (highContrast) root.setAttribute("data-mp-contrast", "high");
  else root.removeAttribute("data-mp-contrast");
}

export function MaraAppearanceProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<MaraTheme>(readTheme);
  const [highContrast, setHighContrastState] = useState(readContrast);

  useLayoutEffect(() => {
    syncDocument(theme, highContrast);
  }, [theme, highContrast]);

  const setTheme = useCallback((t: MaraTheme) => {
    setThemeState(t);
    try {
      localStorage.setItem(STORAGE_THEME, t);
    } catch {
      /* ignore quota / private mode */
    }
  }, []);

  const setHighContrast = useCallback((v: boolean) => {
    setHighContrastState(v);
    try {
      localStorage.setItem(STORAGE_CONTRAST, v ? "high" : "normal");
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, highContrast, setHighContrast }),
    [theme, highContrast, setTheme, setHighContrast],
  );

  return <MaraAppearanceContext.Provider value={value}>{children}</MaraAppearanceContext.Provider>;
}

export function useMaraAppearance() {
  const ctx = useContext(MaraAppearanceContext);
  if (!ctx) {
    throw new Error("useMaraAppearance must be used within MaraAppearanceProvider");
  }
  return ctx;
}
