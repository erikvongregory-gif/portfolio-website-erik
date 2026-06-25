"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Module-level handle so other components (e.g. modals) can pause/resume scrolling.
let lenisInstance: Lenis | null = null;

export function stopLenis() {
  lenisInstance?.stop();
}

export function startLenis() {
  lenisInstance?.start();
}

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
    });
    lenisInstance = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Smooth in-page anchor jumps (account for the fixed header). Handles both
    // bare "#section" links and "/#section" links (used by the header/footer),
    // the latter only while we're already on the homepage so cross-page links
    // (e.g. from /ueber-uns) still navigate normally.
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;

      let hash: string | null = null;
      if (href.startsWith("#")) {
        hash = href;
      } else if (href.startsWith("/#") && window.location.pathname === "/") {
        hash = href.slice(1);
      }
      if (!hash || hash.length < 2) return;

      const el = document.querySelector(hash);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -96 });
    };
    // Capture phase so we intercept the click before Next.js <Link> performs
    // its client-side navigation (which would otherwise win and swallow the jump).
    document.addEventListener("click", onClick, true);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick, true);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return null;
}
