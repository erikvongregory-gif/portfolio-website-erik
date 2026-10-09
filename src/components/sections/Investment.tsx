"use client";

import { useRef } from "react";
import { Column, Heading, Icon, Row, Tag, Text } from "@once-ui-system/core";
import { gsap, useGsapScene } from "@/components/motion/gsap";
import { Section } from "./Section";
import styles from "./Investment.module.scss";

const outcomes = [
  "Mehr Anfragen und Umsatz",
  "Professioneller erster Eindruck",
  "Bessere Google-Sichtbarkeit",
  "Keine Pflege und Updates auf deiner Seite",
];

/** Aufsteigende Wertkurve (rein dekorativ, ohne Zahlen). */
const CURVE =
  "M0 285 C 160 280, 260 262, 360 228 S 540 140, 660 110 S 860 50, 1000 14";

export function Investment() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGsapScene(rootRef, ({ motion }, scope) => {
    const q = gsap.utils.selector(scope);
    const curve = scope.querySelector<SVGPathElement>("[data-curve]");
    const rows = q("[data-outcome]");

    if (!motion) return;

    // ——— Auftritt Kopf ———
    gsap
      .timeline({ scrollTrigger: { trigger: scope, start: "top 72%", once: true } })
      .from(q("[data-eyebrow]"), { y: 14, opacity: 0, duration: 0.6, ease: "expo.out" })
      .from(q("[data-title-line]"), { yPercent: 115, duration: 1, ease: "expo.out", stagger: 0.12 }, 0.08)
      .from(q("[data-desc]"), { y: 16, opacity: 0, filter: "blur(8px)", duration: 0.9, ease: "expo.out" }, 0.3);

    // ——— Ausgabe → Investition ———
    gsap
      .timeline({
        scrollTrigger: { trigger: scope, start: "top 60%", end: "top 15%", scrub: 0.6 },
      })
      .fromTo(q("[data-strike]"), { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "power2.inOut" })
      .to(q("[data-spend]"), { opacity: 0.35, duration: 0.3 }, 0.2)
      .fromTo(
        q("[data-invest]"),
        { backgroundPosition: "100% 0" },
        { backgroundPosition: "0% 0", duration: 0.7, ease: "none" },
        0.35,
      );

    // ——— Wertkurve zeichnen ———
    if (curve) {
      const len = curve.getTotalLength();
      gsap.set(curve, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(curve, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: { trigger: scope, start: "top 75%", end: "bottom 55%", scrub: 0.8 },
      });
      gsap.fromTo(
        q("[data-curve-area]"),
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          ease: "none",
          scrollTrigger: { trigger: scope, start: "top 75%", end: "bottom 55%", scrub: 0.8 },
        },
      );
      gsap.fromTo(
        q("[data-curve-dot]"),
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          transformOrigin: "50% 50%",
          ease: "back.out(3)",
          scrollTrigger: { trigger: scope, start: "bottom 62%", end: "bottom 55%", scrub: 0.6 },
        },
      );
    }

    // ——— Ergebnisse auf der Schiene ———
    const list = q("[data-list]")[0];
    gsap.fromTo(
      q("[data-rail-fill]"),
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: list, start: "top 70%", end: "bottom 50%", scrub: 0.6 },
      },
    );
    rows.forEach((row) => {
      const r = gsap.utils.selector(row);
      gsap
        .timeline({ scrollTrigger: { trigger: row, start: "top 72%", end: "top 52%", scrub: 0.6 } })
        .fromTo(row, { opacity: 0.3, x: 18 }, { opacity: 1, x: 0, ease: "power2.out", duration: 1 })
        .fromTo(r("[data-node]"), { scale: 0.4 }, { scale: 1, ease: "back.out(3)", duration: 0.5 }, 0.3)
        .fromTo(r("[data-check]"), { scale: 0, rotate: -45 }, { scale: 1, rotate: 0, ease: "back.out(3)", duration: 0.5 }, 0.4);
    });
  });

  return (
    <Section id="investition" background="surface" gap="48" className={styles.section}>
      <Column ref={rootRef} fillWidth gap="48" className={styles.scene}>
        <svg
          className={styles.curve}
          viewBox="0 0 1000 300"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="invest-curve" x1="0" y1="0" x2="1000" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="rgb(91, 108, 255)" stopOpacity="0" />
              <stop offset="0.5" stopColor="rgb(91, 108, 255)" stopOpacity="0.35" />
              <stop offset="1" stopColor="rgb(154, 166, 255)" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="invest-area" x1="0" y1="0" x2="0" y2="300" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="rgb(91, 108, 255)" stopOpacity="0.22" />
              <stop offset="1" stopColor="rgb(91, 108, 255)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${CURVE} L1000 300 L0 300 Z`} className={styles.area} data-curve-area />
          <path d={CURVE} data-curve stroke="url(#invest-curve)" />
          <circle cx="1000" cy="14" r="5" data-curve-dot className={styles.curveDot} />
        </svg>

        <Row fillWidth gap="64" vertical="start" m={{ direction: "column", gap: "40" }}>
          <Column flex={1} gap="16" maxWidth={42}>
            <Tag size="s" variant="neutral" data-eyebrow>
              Die Investition
            </Tag>
            <Heading
              as="h2"
              variant="display-strong-s"
              onBackground="neutral-strong"
              wrap="balance"
              style={{ letterSpacing: "-0.03em", lineHeight: 1.05 }}
            >
              <span className={styles.line}>
                <span className={styles.lineInner} data-title-line>
                  Keine{" "}
                  <span className={styles.spend} data-spend>
                    Ausgabe
                    <span className={styles.strike} data-strike aria-hidden="true" />
                  </span>
                  .
                </span>
              </span>{" "}
              <span className={styles.line}>
                <span className={styles.lineInner} data-title-line>
                  <span className={styles.invest} data-invest>
                    Eine Investition.
                  </span>
                </span>
              </span>
            </Heading>
            <Text variant="body-default-l" onBackground="neutral-weak" wrap="balance" data-desc>
              Eine gute Website gewinnt Kunden, schafft Vertrauen und spart Zeit. Oft schneller, als
              man denkt.
            </Text>
          </Column>

          <Column flex={1} paddingTop="8" fillWidth>
            <Column gap="16" fillWidth className={styles.list} data-list>
              <span className={styles.rail} aria-hidden="true">
                <span className={styles.railFill} data-rail-fill />
              </span>
              {outcomes.map((item, i) => (
                <Row
                  key={item}
                  gap="16"
                  vertical="center"
                  paddingTop={i === 0 ? undefined : "16"}
                  borderTop={i === 0 ? undefined : "neutral-alpha-weak"}
                  className={styles.outcome}
                  data-outcome
                >
                  <span className={styles.node} data-node aria-hidden="true">
                    <span className={styles.check} data-check>
                      <Icon name="check" size="xs" />
                    </span>
                  </span>
                  <Text variant="body-default-l" onBackground="neutral-medium">
                    {item}
                  </Text>
                </Row>
              ))}
            </Column>
          </Column>
        </Row>

        <Text
          variant="body-default-s"
          onBackground="neutral-weak"
          wrap="balance"
          style={{ maxWidth: "40rem" }}
        >
          Für Unternehmen oft steuerlich als Betriebsausgabe berücksichtigungsfähig. Im Einzelfall
          berät dich dein Steuerberater.
        </Text>
      </Column>
    </Section>
  );
}
