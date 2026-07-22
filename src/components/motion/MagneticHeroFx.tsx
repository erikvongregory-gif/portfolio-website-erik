"use client";

import { useEffect, useRef } from "react";
import { clearHeroSpotlight } from "@/lib/heroSpotlight";
import styles from "./MagneticHeroFx.module.scss";

/**
 * Ambient magnetic light for the hero. Tracks cursor / touch, lerps for
 * smoothness, and paints studio sheen onto any `[data-sheen]` descendants.
 */
export function MagneticHeroFx() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    const root = glow?.parentElement;
    if (!glow || !root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      root.style.setProperty("--spot-x", "62%");
      root.style.setProperty("--spot-y", "38%");
      root.style.setProperty("--spot-active", "0.35");
      return;
    }

    let raf = 0;
    let tx = 0.62;
    let ty = 0.38;
    let cx = tx;
    let cy = ty;
    let tActive = 0;
    let active = 0;
    let sheenNodes: HTMLElement[] = [];
    let sheenScanAt = 0;

    const scanSheen = (now: number) => {
      if (now - sheenScanAt < 500 && sheenNodes.length) return;
      sheenScanAt = now;
      sheenNodes = Array.from(root.querySelectorAll<HTMLElement>("[data-sheen]"));
    };

    const tick = (now: number) => {
      cx += (tx - cx) * 0.14;
      cy += (ty - cy) * 0.14;
      tActive += (active - tActive) * 0.12;

      root.style.setProperty("--spot-x", `${cx * 100}%`);
      root.style.setProperty("--spot-y", `${cy * 100}%`);
      root.style.setProperty("--spot-active", String(tActive));

      if (tActive > 0.01) {
        scanSheen(now);
        const r = root.getBoundingClientRect();
        const x = r.left + cx * r.width;
        const y = r.top + cy * r.height;
        const strength = Math.min(1, tActive);
        for (const el of sheenNodes) {
          const br = el.getBoundingClientRect();
          if (br.width < 8 || br.height < 8) continue;
          el.style.setProperty("--mx", String((x - br.left) / br.width));
          el.style.setProperty("--my", String((y - br.top) / br.height));
          el.style.setProperty("--sheen", String(strength));
        }
      } else if (sheenNodes.length) {
        for (const el of sheenNodes) el.style.setProperty("--sheen", "0");
        sheenNodes = [];
      }

      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return;
      tx = (e.clientX - r.left) / r.width;
      ty = (e.clientY - r.top) / r.height;
      active = 1;
    };

    const onLeave = () => {
      active = 0;
    };

    root.addEventListener("pointerenter", onMove);
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    root.addEventListener("pointerdown", onMove);

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener("pointerenter", onMove);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("pointerdown", onMove);
      clearHeroSpotlight(root);
    };
  }, []);

  return <div ref={glowRef} className={styles.glow} aria-hidden="true" />;
}
