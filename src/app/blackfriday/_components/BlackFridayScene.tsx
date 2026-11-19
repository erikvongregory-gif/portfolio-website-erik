"use client";

import { useRef, type ReactNode } from "react";
import { Column } from "@once-ui-system/core";
import classNames from "classnames";
import { gsap, ScrollTrigger, useGsapScene } from "@/components/motion/gsap";
import styles from "./blackfriday.module.scss";

const fmt = (n: number) => `${Math.round(n).toLocaleString("de-DE")} €`;

/**
 * Seitenrahmen mit allen GSAP-Animationen der Black-Friday-Seite.
 * Regel: Inhalte im ersten Bildschirm werden nie per JS versteckt (LCP); alles darunter
 * bekommt seinen Startzustand, bevor es in Sicht kommt. Bei reduzierter Bewegung passiert nichts.
 */
export function BlackFridayScene({
  children,
  className,
}: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGsapScene(ref, ({ motion, desktop }, root) => {
    if (!motion) return;
    const q = gsap.utils.selector(root);
    const cleanups: (() => void)[] = [];

    // ---------- Hero: Buchstabenwelle über „Black Friday.“ ----------
    const letters = q("[data-bf-letter]");
    if (letters.length) {
      gsap
        .timeline({ repeat: -1, repeatDelay: 4.5, delay: 1.1 })
        .to(letters, {
          yPercent: -16,
          scale: 1.06,
          duration: 0.32,
          ease: "power2.out",
          stagger: 0.045,
        })
        .to(
          letters,
          { yPercent: 0, scale: 1, duration: 0.6, ease: "elastic.out(1, 0.45)", stagger: 0.045 },
          0.32,
        );
    }

    // ---------- Hero: Lichter folgen der Maus, Inhalt zieht beim Scrollen weg ----------
    const hero = q("[data-bf-hero]")[0] as HTMLElement | undefined;
    const glows = q("[data-bf-glow]");
    if (hero && glows.length && desktop) {
      const movers = glows.map((g, i) => ({
        x: gsap.quickTo(g, "x", { duration: 1.4 + i * 0.4, ease: "power3.out" }),
        y: gsap.quickTo(g, "y", { duration: 1.4 + i * 0.4, ease: "power3.out" }),
        depth: (i % 2 === 0 ? 1 : -1) * (60 + i * 30),
      }));
      const onMove = (e: PointerEvent) => {
        const r = hero.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        for (const m of movers) {
          m.x(nx * m.depth);
          m.y(ny * m.depth);
        }
      };
      hero.addEventListener("pointermove", onMove);
      cleanups.push(() => hero.removeEventListener("pointermove", onMove));
    }

    const heroContent = q("[data-bf-hero-content]")[0];
    if (hero && heroContent) {
      gsap.to(heroContent, {
        yPercent: -8,
        opacity: 0.35,
        ease: "none",
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(q("[data-bf-snow]"), {
        yPercent: 18,
        ease: "none",
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
      });
    }

    // ---------- Laufband: Tempo und Neigung folgen der Scrollgeschwindigkeit ----------
    const track = q("[data-bf-ticker]")[0];
    if (track) {
      gsap.set(track, { animation: "none" });
      const loop = gsap.to(track, { xPercent: -50, duration: 28, ease: "none", repeat: -1 });
      const skewTo = gsap.quickTo(track, "skewX", { duration: 0.5, ease: "power3.out" });
      let settle: gsap.core.Tween | null = null;
      ScrollTrigger.create({
        trigger: track,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = self.getVelocity();
          const boost = gsap.utils.clamp(1, 6, 1 + Math.abs(v) / 400);
          settle?.kill();
          loop.timeScale(boost * (v < 0 ? -1 : 1));
          skewTo(gsap.utils.clamp(-8, 8, -v / 250));
          settle = gsap.to(loop, {
            timeScale: v < 0 ? -1 : 1,
            duration: 1.2,
            ease: "power2.out",
            delay: 0.1,
          });
          gsap.delayedCall(0.15, () => skewTo(0));
        },
      });
    }

    // ---------- Geschenkkarten: auspacken, Preis fällt ----------
    for (const card of q("[data-bf-card]")) {
      const c = gsap.utils.selector(card);
      const price = c("[data-bf-price]")[0] as HTMLElement | undefined;
      const from = Number(price?.dataset.from ?? 0);
      const to = Number(price?.dataset.to ?? 0);
      const counter = { v: from };

      const tl = gsap.timeline({
        scrollTrigger: { trigger: card, start: "top 80%", once: true },
        defaults: { ease: "power3.out" },
      });
      tl.from(card, {
        y: 70,
        rotateX: 10,
        opacity: 0,
        duration: 0.9,
        transformPerspective: 900,
        clearProps: "transform,opacity",
      })
        .from(c("[data-bf-ribbon]"), { scaleY: 0, transformOrigin: "50% 0%", duration: 0.7 }, 0.2)
        .from(
          c("[data-bf-bow]"),
          {
            scale: 0,
            rotate: -40,
            transformOrigin: "50% 50%",
            duration: 1,
            ease: "elastic.out(1, 0.5)",
          },
          0.45,
        )
        .from(
          c("[data-bf-pop]"),
          { scale: 0, rotate: -14, duration: 0.6, ease: "back.out(2.4)", stagger: 0.08 },
          0.5,
        );

      if (price && from && to) {
        price.textContent = fmt(from);
        cleanups.push(() => {
          price.textContent = fmt(to);
        });
        tl.to(
          counter,
          {
            v: to,
            duration: 1.3,
            ease: "expo.out",
            onUpdate: () => {
              price.textContent = fmt(counter.v);
            },
          },
          0.55,
        )
          .from(c("[data-bf-strike]"), { opacity: 0, x: -12, duration: 0.4 }, 0.55)
          .fromTo(
            price,
            { scale: 1 },
            { scale: 1.08, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" },
            1.75,
          );
      }

      tl.from(c("[data-bf-feature]"), { x: -14, opacity: 0, duration: 0.45, stagger: 0.05 }, 0.6);
    }

    // ---------- Leistungen: gestaffelt aus dem Boden ----------
    const included = q("[data-bf-included]");
    if (included.length) {
      gsap.set(included, { y: 50, opacity: 0 });
      ScrollTrigger.batch(included, {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.08 }),
      });
      for (const card of included) {
        const icon = card.querySelector("[data-bf-icon]");
        if (!icon) continue;
        gsap.from(icon, {
          rotate: -90,
          scale: 0.3,
          duration: 0.9,
          ease: "back.out(2)",
          scrollTrigger: { trigger: card, start: "top 85%", once: true },
        });
      }
    }

    // ---------- Ablauf: Linie zeichnet sich, Schritte rasten ein ----------
    const stepsWrap = q("[data-bf-steps]")[0];
    if (stepsWrap) {
      const line = q("[data-bf-stepline]");
      gsap.fromTo(
        line,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          transformOrigin: "0% 50%",
          scrollTrigger: { trigger: stepsWrap, start: "top 75%", end: "bottom 55%", scrub: 0.6 },
        },
      );
      const steps = q("[data-bf-step]");
      steps.forEach((step, i) => {
        const num = step.querySelector("[data-bf-stepnum]");
        const tl = gsap.timeline({
          scrollTrigger: { trigger: step, start: "top 82%", once: true },
          delay: desktop ? i * 0.12 : 0,
        });
        tl.from(step, { y: 60, opacity: 0, duration: 0.8, ease: "power3.out" });
        if (num) tl.from(num, { scale: 2.2, opacity: 0, duration: 0.7, ease: "expo.out" }, 0.1);
      });
    }

    // ---------- Garantie: Siegel dreht sich ein und schwebt ----------
    const seal = q("[data-bf-seal]")[0];
    if (seal) {
      gsap
        .timeline({ scrollTrigger: { trigger: seal, start: "top 85%", once: true } })
        .from(seal, { rotate: -200, scale: 0, duration: 1.2, ease: "elastic.out(1, 0.55)" })
        .to(seal, { rotate: 4, y: -6, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1 });
    }

    // ---------- Formular: Karte hebt sich in den Blick ----------
    const form = q("[data-bf-form] form")[0];
    if (form) {
      gsap.from(form, {
        y: 80,
        rotateX: 8,
        scale: 0.96,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        transformPerspective: 1000,
        scrollTrigger: { trigger: form, start: "top 85%", once: true },
      });
    }

    // ---------- Magnetische Buttons (nur Desktop mit Maus) ----------
    if (desktop && window.matchMedia("(hover: hover)").matches) {
      for (const el of q("[data-bf-magnetic]") as HTMLElement[]) {
        const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * 0.25);
          yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        });
      }
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
