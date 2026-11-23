"use client";

import { Text } from "@once-ui-system/core/components";
import { useEffect, useRef, useState } from "react";
import { SrOnly } from "./MesseLayout";

/**
 * "3 Sek." that ticks 1 → 2 → 3 in real seconds the first time it scrolls into
 * view, so the visitor feels how short the window is. Static with reduced motion.
 */
export function SecondsTick({ to = 3, className }: { to?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(to);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        let i = 1;
        setN(i);
        timer = window.setInterval(() => {
          i += 1;
          setN(i);
          if (i >= to) window.clearInterval(timer);
        }, 1000);
      },
      { threshold: 0.6 },
    );
    // Start from 0 only once the script runs, so the server HTML keeps the final value.
    setN(0);
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearInterval(timer);
    };
  }, [to]);

  return (
    <Text className={className}>
      <span ref={ref} aria-hidden="true">
        <span style={{ fontVariantNumeric: "tabular-nums" }}>{n}</span> Sek.
      </span>
      <SrOnly>{to} Sekunden</SrOnly>
    </Text>
  );
}
