import { useEffect, useState } from "react";

/** Matches `MaraHomePage.css` mobile nav / layout breakpoint. */
const MOBILE_MQ = "(max-width: 720px)";

export function useIsMobileLayout() {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(MOBILE_MQ).matches : false,
  );

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const onChange = () => setMatches(mq.matches);
    mq.addEventListener("change", onChange);
    onChange();
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return matches;
}
