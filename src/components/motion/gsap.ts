"use client";

import { useEffect, useLayoutEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { subscribeScroll } from "./SmoothScroll";

let registered = false;

/** Registriert ScrollTrigger einmalig und koppelt es an den globalen Lenis-Scroll. */
export function ensureGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  subscribeScroll(() => ScrollTrigger.update());

  // Seitenhöhe ändert sich nach dem Aufbau (Bilder, Pins, Schriften) – Trigger-Positionen nachziehen.
  let timer = 0;
  let lastHeight = 0;
  const ro = new ResizeObserver(() => {
    const h = document.documentElement.scrollHeight;
    if (Math.abs(h - lastHeight) < 2) return;
    lastHeight = h;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => ScrollTrigger.refresh(), 200);
  });
  ro.observe(document.body);
  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
  registered = true;
}

export type SceneConditions = { motion: boolean; reduced: boolean; desktop: boolean };

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Baut eine GSAP-Szene in einem matchMedia-Kontext auf. Bei Wechsel von Viewport
 * oder reduced motion wird alles zurückgesetzt und neu aufgebaut.
 */
export function useGsapScene(
  ref: RefObject<HTMLElement | null>,
  setup: (conditions: SceneConditions, scope: HTMLElement) => void | (() => void),
) {
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    ensureGsap();
    const mm = gsap.matchMedia(el);
    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
        desktop: "(min-width: 1024px)",
      },
      (ctx) => setup(ctx.conditions as SceneConditions, el),
    );
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Szene wird einmal aufgebaut
  }, []);
}

export { gsap, ScrollTrigger };
