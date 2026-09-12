"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import { Instrument_Serif } from "next/font/google";
import { Column, Text } from "@once-ui-system/core";
import { ContactDialog } from "@/components/ContactDialog";
import { subscribeScroll } from "@/components/motion/SmoothScroll";
import { Section } from "./Section";
import styles from "./FinalCta.module.scss";

const instrument = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

/** True 393×852 mobile screenshots, pre-composited under photoreal bezel. */
const SHOTS = [
  {
    src: "/images/final-cta/phone-live-lt.webp",
    alt: "Salon Liora – Mobile",
    x: -1,
    y: -1,
    rot: -12,
    stackRot: -8,
  },
  {
    src: "/images/final-cta/phone-live-rt.webp",
    alt: "Da Peppe – Mobile",
    x: 1,
    y: -1,
    rot: 9,
    stackRot: 5,
  },
  {
    src: "/images/final-cta/phone-live-lb.webp",
    alt: "Ingenieurbüro Jungen – Mobile",
    x: -1,
    y: 1,
    rot: 7,
    stackRot: -4,
  },
  {
    src: "/images/final-cta/phone-live-rb.webp",
    alt: "Lünebräu – Mobile",
    x: 1,
    y: 1,
    rot: -7,
    stackRot: 6,
  },
] as const;

function Sparkle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="evgSparkle" x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8db3ff" />
          <stop offset="0.35" stopColor="#4aa3f0" />
          <stop offset="0.65" stopColor="#b2dbff" />
          <stop offset="1" stopColor="#6f94f1" />
        </linearGradient>
        <filter id="evgSparkleGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        filter="url(#evgSparkleGlow)"
        fill="url(#evgSparkle)"
        d="M32 2.5
           C34.2 18.8 45.2 29.8 61.5 32
           C45.2 34.2 34.2 45.2 32 61.5
           C29.8 45.2 18.8 34.2 2.5 32
           C18.8 29.8 29.8 18.8 32 2.5Z"
      />
    </svg>
  );
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

type FinalCtaProps = {
  buttonLabel?: string;
  href?: string;
};

export function FinalCta({
  buttonLabel = "Kostenloser Entwurf",
  href,
}: FinalCtaProps = {}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const shotRefs = useRef<(HTMLLIElement | null)[]>([]);
  const pointer = useRef({ x: 0, y: 0 });
  const raf = useRef(0);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const paint = () => {
      raf.current = 0;
      const section = stage.closest("section") ?? stage;
      const rect = section.getBoundingClientRect();
      const stageRect = stage.getBoundingClientRect();
      const vh = window.innerHeight || 1;

      // Cards fan first; copy fades in only once they are clearly opening (Blink).
      const start = vh * 0.38;
      const end = vh * -0.07;
      const raw = reduced ? 1 : clamp01((start - rect.top) / (start - end));
      const p = easeOutCubic(raw);
      const copy = reduced ? 1 : easeOutCubic(clamp01((p - 0.52) / 0.36));

      const maxX = Math.min(stageRect.width * 0.38, 36 * 16);
      const maxY = Math.min(stageRect.height * 0.32, 20 * 16);
      const { x: mx, y: my } = pointer.current;
      const mouse = 14 * p;

      shotRefs.current.forEach((el, i) => {
        if (!el) return;
        const shot = SHOTS[i];
        const tx = shot.x * maxX * p + mx * mouse * shot.x;
        const ty = shot.y * maxY * p + my * mouse * shot.y;
        const rot = shot.stackRot + (shot.rot - shot.stackRot) * p + mx * 2.1 * p * shot.x;
        el.style.setProperty("--tx", `${tx.toFixed(2)}px`);
        el.style.setProperty("--ty", `${ty.toFixed(2)}px`);
        el.style.setProperty("--rot", `${rot.toFixed(2)}deg`);
      });

      stage.style.setProperty("--copy", copy.toFixed(3));
      stage.dataset.spread = p > 0.55 ? "open" : p > 0.08 ? "opening" : "stacked";
      stage.dataset.copy = copy > 0.55 ? "on" : "off";
    };

    const schedule = () => {
      if (!raf.current) raf.current = requestAnimationFrame(paint);
    };

    const onMove = (e: PointerEvent) => {
      if (reduced) return;
      const r = stage.getBoundingClientRect();
      pointer.current = {
        x: ((e.clientX - r.left) / r.width - 0.5) * 2,
        y: ((e.clientY - r.top) / r.height - 0.5) * 2,
      };
      schedule();
    };

    const onLeave = () => {
      pointer.current = { x: 0, y: 0 };
      schedule();
    };

    paint();
    const unsub = subscribeScroll(schedule);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    return () => {
      unsub();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <Section id="kontakt" paddingY="128" maxWidth={90} gap="16" className={styles.section}>
      <div
        ref={stageRef}
        className={styles.stage}
        data-spread="stacked"
        data-copy="off"
        style={{ "--copy": 0 } as CSSProperties}
      >
        <Column className={styles.copy} horizontal="center" align="center" gap="24">
          <Text className={styles.eyebrow} as="p">
            <span className={styles.dots} aria-hidden="true" />
            Verpass diese Chance nicht
          </Text>

          <h2 className={styles.title}>
            <span className={styles.line}>
              Hol dir jetzt <Sparkle className={styles.sparkle} /> deinen
            </span>
            <span className={styles.line}>unfairen Website-Vorteil</span>
            <em className={`${styles.serif} ${instrument.className}`}>*mit EvGlab</em>
          </h2>

          <div className={styles.cta}>
            {href ? (
              <a className={styles.linkFallback} href={href}>
                {buttonLabel}
              </a>
            ) : (
              <ContactDialog label={buttonLabel} size="l" funnel />
            )}
          </div>
        </Column>

        <ul className={styles.shots} aria-hidden="true">
          {SHOTS.map((shot, i) => (
            <li
              key={shot.src}
              ref={(el) => {
                shotRefs.current[i] = el;
              }}
              className={styles.shot}
              style={{ zIndex: 4 - i }}
            >
              <div className={styles.phone}>
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 320px"
                  className={styles.phoneShot}
                  priority
                  unoptimized
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
