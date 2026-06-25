"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type ScrollPinScaleProps = {
  children: ReactNode;
  /** Length of the pinned scroll track as a multiple of the viewport height. */
  track?: number;
  /** Number of grow/shrink pulses across the track. */
  pulses?: number;
  /** Base amplitude; pulse k grows by step * k (0.1, 0.2, 0.3, ...). */
  step?: number;
};

export function ScrollPinScale({
  children,
  track = 3,
  pulses = 4,
  step = 0.1,
}: ScrollPinScaleProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(mq.matches && !rm.matches);
    update();
    mq.addEventListener("change", update);
    rm.addEventListener("change", update);
    return () => {
      mq.removeEventListener("change", update);
      rm.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      if (innerRef.current) innerRef.current.style.transform = "";
      return;
    }
    let raf = 0;
    const apply = () => {
      raf = 0;
      const trackEl = trackRef.current;
      const inner = innerRef.current;
      if (!trackEl || !inner) return;
      const rect = trackEl.getBoundingClientRect();
      const distance = rect.height - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(distance, 1));
      const p = distance > 0 ? scrolled / distance : 0;

      const seg = p * pulses;
      const i = Math.min(Math.floor(seg), pulses - 1);
      const local = seg - i;
      const bump = Math.sin(local * Math.PI);
      const amplitude = step * (i + 1);
      const scale = 1 + bump * amplitude;

      inner.style.transform = `scale(${scale.toFixed(4)})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled, pulses, step]);

  if (!enabled) return <>{children}</>;

  return (
    <div ref={trackRef} style={{ position: "relative", width: "100%", height: `${track * 100}vh` }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div ref={innerRef} style={{ width: "100%", willChange: "transform" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
