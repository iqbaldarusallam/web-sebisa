"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Hydration-safe replacement for framer-motion useReducedMotion.
 * Returns false during SSR and initial client render so server HTML
 * always matches client HTML. After mount reads the real OS preference
 * via matchMedia and re-renders if it differs.
 */
export function useSafeReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const readPreference = useCallback(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    setPrefersReducedMotion(readPreference());

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    function handleChange() {
      setPrefersReducedMotion(mql.matches);
    }

    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, [readPreference]);

  return prefersReducedMotion;
}
