"use client";
import { useSafeReducedMotion } from "./useSafeReducedMotion";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type CountUpValueProps = {
  value: string;
  accentClassName?: string;
  className?: string;
  duration?: number;
};

function parseValue(value: string) {
  const match = value.trim().match(/^(\d+(?:\.\d+)?)(.*)$/);

  if (!match) {
    return {
      decimals: 0,
      suffix: "",
      target: 0,
    };
  }

  const [, numericValue, suffix] = match;
  const decimalPart = numericValue.split(".")[1];

  return {
    decimals: decimalPart?.length ?? 0,
    suffix,
    target: Number(numericValue),
  };
}

export default function CountUpValue({
  value,
  accentClassName = "",
  className = "",
  duration = 1250,
}: CountUpValueProps) {
  const reduceMotion = useSafeReducedMotion();
  const elementRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<number | null>(null);
  const hasStartedRef = useRef(false);
  const { decimals, suffix, target } = parseValue(value);
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) {
      return;
    }

    const startAnimation = () => {
      if (hasStartedRef.current) {
        return;
      }

      hasStartedRef.current = true;

      if (reduceMotion) {
        setCurrentValue(target);
        return;
      }

      const startTime = performance.now();

      const animate = (time: number) => {
        const progress = Math.min((time - startTime) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);

        setCurrentValue(target * easedProgress);

        if (progress < 1) {
          frameRef.current = window.requestAnimationFrame(animate);
        } else {
          setCurrentValue(target);
        }
      };

      frameRef.current = window.requestAnimationFrame(animate);
    };

    if (!("IntersectionObserver" in window)) {
      startAnimation();

      return () => {
        if (frameRef.current) {
          window.cancelAnimationFrame(frameRef.current);
        }
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          startAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();

      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [duration, reduceMotion, target]);

  const formattedValue =
    decimals > 0 ? currentValue.toFixed(decimals) : String(Math.round(currentValue));

  const renderedSuffix = suffix.startsWith("/") ? (
    <>
      <span className={accentClassName}>/</span>
      {suffix.slice(1)}
    </>
  ) : suffix ? (
    <span className={accentClassName}>{suffix}</span>
  ) : null;

  return (
    <span ref={elementRef} className={className} aria-label={value}>
      {formattedValue}
      {renderedSuffix}
    </span>
  );
}

