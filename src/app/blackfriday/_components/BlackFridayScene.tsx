"use client";

import { useRef, type ReactNode } from "react";
import { Column } from "@once-ui-system/core/components";
import classNames from "classnames";
import { gsap, ScrollTrigger, useGsapScene } from "@/components/motion/gsap";
import styles from "./blackfriday.module.scss";

const fmt = (n: number) => `${Math.round(n).toLocaleString("de-DE")} €`;

/**
 * Page frame with the (calm) motion of the Black Friday page.
 * Rule: nothing in the first screen is hidden by JS (LCP). Content below fades
 * up once, the package prices count down from the regular price. With reduced
 * motion nothing happens.
 */
export function BlackFridayScene({
  children,
  className,
}: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGsapScene(ref, ({ motion }, root) => {
    if (!motion) return;
    const q = gsap.utils.selector(root);
    const cleanups: (() => void)[] = [];

    // Soft fade-up for blocks below the fold.
    const reveal = q("[data-bf-reveal]");
    if (reveal.length) {
      gsap.set(reveal, { y: 28, opacity: 0 });
      ScrollTrigger.batch(reveal, {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.08 }),
      });
    }

    // Package prices count down from the regular price.
    for (const price of q("[data-bf-price]") as HTMLElement[]) {
      const from = Number(price.dataset.from ?? 0);
      const to = Number(price.dataset.to ?? 0);
      if (!from || !to) continue;
      const counter = { v: from };
      price.textContent = fmt(from);
      cleanups.push(() => {
        price.textContent = fmt(to);
      });
      gsap.to(counter, {
        v: to,
        duration: 1.4,
        ease: "expo.out",
        scrollTrigger: { trigger: price, start: "top 85%", once: true },
        onUpdate: () => {
          price.textContent = fmt(counter.v);
        },
      });
    }

    return () => {
      for (const fn of cleanups) fn();
    };
  });

  return (
    <Column
      ref={ref}
      data-theme="dark"
      className={classNames(styles.page, className)}
      fillWidth
      horizontal="center"
    >
      {children}
    </Column>
  );
}
