"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useScrollSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);
  const [hasMeasured, setHasMeasured] = useState(false);
  const [scrollMax, setScrollMax] = useState(0);
  const [scrollValue, setScrollValue] = useState(0);

  const syncScrollState = useCallback(() => {
    const element = scrollRef.current;

    if (!element) {
      return;
    }

    const nextScrollMax = Math.max(0, element.scrollWidth - element.clientWidth);
    const nextScrollValue = element.scrollLeft;

    setScrollMax((current) => (current === nextScrollMax ? current : nextScrollMax));
    setScrollValue((current) => (current === nextScrollValue ? current : nextScrollValue));
    setHasMeasured((current) => (current ? current : true));
  }, []);

  useEffect(() => {
    syncScrollState();
    window.addEventListener("resize", syncScrollState);

    return () => {
      window.removeEventListener("resize", syncScrollState);

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [syncScrollState]);

  const handleScroll = () => {
    const element = scrollRef.current;

    if (element) {
      const nextScrollValue = element.scrollLeft;

      setScrollValue((current) => (current === nextScrollValue ? current : nextScrollValue));
    }
  };

  const handleSliderChange = (value: number) => {
    const element = scrollRef.current;

    if (element) {
      element.scrollLeft = value;
      setScrollValue((current) => (current === value ? current : value));
    }
  };

  const scrollByDirection = (direction: "next" | "prev") => {
    const element = scrollRef.current;

    if (!element) {
      return;
    }

    const distance = Math.max(260, element.clientWidth * 0.72);

    element.scrollBy({
      left: direction === "next" ? distance : -distance,
      behavior: "smooth",
    });

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(syncScrollState, 260);
  };

  return {
    canScrollNext: !hasMeasured || scrollValue < scrollMax - 2,
    canScrollPrev: hasMeasured && scrollValue > 2,
    handleScroll,
    handleSliderChange,
    scrollByDirection,
    scrollMax,
    scrollRef,
    scrollValue,
    syncScrollState,
  };
}
