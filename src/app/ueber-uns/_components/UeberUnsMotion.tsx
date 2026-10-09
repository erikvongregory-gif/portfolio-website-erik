"use client";

import { useRef, type ReactNode } from "react";
import { Column } from "@once-ui-system/core";
import { gsap, useGsapScene } from "@/components/motion/gsap";

/** Hero: Wörter steigen, Akzent leuchtet auf, Porträt wird aufgedeckt. */
export function HeroMotion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGsapScene(ref, ({ motion }, scope) => {
    if (!motion) return;
    const q = gsap.utils.selector(scope);
    gsap
      .timeline({ delay: 0.15 })
      .from(q("[data-hero-word]"), { yPercent: 110, duration: 1.1, ease: "expo.out", stagger: 0.06 }, 0)
      .fromTo(
        q("[data-portrait]"),
        { clipPath: "inset(100% 0% 0% 0% round 1rem)" },
        { clipPath: "inset(0% 0% 0% 0% round 1rem)", duration: 1.3, ease: "expo.inOut" },
        0.1,
      )
      .from(q("[data-portrait-img]"), { scale: 1.25, duration: 1.8, ease: "expo.out" }, 0.3)
      .from(
        q("[data-hero-fade]"),
        { y: 16, opacity: 0, filter: "blur(8px)", duration: 0.9, ease: "expo.out", stagger: 0.1 },
        0.4,
      )
      .fromTo(
        q("[data-hero-accent]"),
        { backgroundPosition: "100% 0" },
        { backgroundPosition: "0% 0", duration: 1.4, ease: "power2.inOut" },
        0.9,
      );
  });

  return (
    <Column ref={ref} fillWidth horizontal="center">
      {children}
    </Column>
  );
}

/** Werte: Karten klappen in 3D nach vorne, Icons ploppen auf. */
export function ValuesMotion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGsapScene(ref, ({ motion }, scope) => {
    if (!motion) return;
    const q = gsap.utils.selector(scope);
    const cards = q("[data-value]") as HTMLElement[];
    cards.forEach((card) => {
      gsap.fromTo(
        card,
        { rotateX: 38, y: 70, opacity: 0, transformPerspective: 1100, transformOrigin: "50% 100%" },
        {
          rotateX: 0,
          y: 0,
          opacity: 1,
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: { trigger: card, start: "top 92%", end: "top 62%", scrub: 0.6 },
        },
      );
      gsap.from(card.querySelector("[data-value-icon]"), {
        scale: 0,
        rotate: -120,
        duration: 0.7,
        ease: "back.out(2.5)",
        scrollTrigger: { trigger: card, start: "top 70%", once: true },
      });
    });
  });

  return (
    <Column ref={ref} fillWidth>
      {children}
    </Column>
  );
}
