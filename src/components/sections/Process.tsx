"use client";

import { useRef, type CSSProperties } from "react";
import { Column, Heading, Row, Text } from "@once-ui-system/core";
import { gsap, ScrollTrigger, useGsapScene } from "@/components/motion/gsap";
import { Section } from "./Section";
import styles from "./Process.module.scss";

const steps = [
  {
    n: "1",
    title: "Erstgespräch",
    body: "Kostenlos und unverbindlich. Ich höre zu, stelle Fragen und verstehe dein Business.",
    meta: "30 Min, kostenlos",
  },
  {
    n: "2",
    title: "Konzept und Angebot",
    body: "Klare Strategie und ein transparentes Angebot. Du weißt von Anfang an, was gebaut wird und was es kostet.",
    meta: "2 bis 3 Tage",
  },
  {
    n: "3",
    title: "Design und Texte",
    body: "Ich gestalte und schreibe die Texte, du gibst Feedback. Sauber von Anfang an, maximal zwei Runden.",
    meta: "Feedback in 2 Runden",
  },
  {
    n: "4",
    title: "Umsetzung",
    body: "Ich baue alles selbst: schnell, mobil und suchmaschinenfreundlich. Kein Outsourcing, kein Overhead.",
    meta: "ca. 7 Tage",
  },
  {
    n: "5",
    title: "Launch und Betreuung",
    body: "Deine Website geht online, ich erkläre dir alles und bleibe dein Ansprechpartner.",
    meta: "Go-Live und Support",
  },
];

export function Process() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGsapScene(rootRef, ({ motion, desktop }, scope) => {
    const q = gsap.utils.selector(scope);
    const stepEls = q("[data-step]") as HTMLElement[];

    if (!motion || !desktop) {
      for (const el of stepEls) el.classList.add(styles.on);
      return () => {
        for (const el of stepEls) el.classList.remove(styles.on);
      };
    }

    // ——— Überschrift: Wörter steigen ———
    gsap.from(q("[data-word]"), {
      yPercent: 110,
      opacity: 0,
      duration: 1,
      ease: "expo.out",
      stagger: 0.07,
      scrollTrigger: { trigger: scope, start: "top 72%", once: true },
    });

    // ——— Schiene + wandernder Punkt ———
    const list = q("[data-list]")[0];
    gsap
      .timeline({
        scrollTrigger: { trigger: list, start: "top 60%", end: "bottom 60%", scrub: 0.6 },
      })
      .fromTo(q("[data-rail-fill]"), { scaleY: 0 }, { scaleY: 1, ease: "none" }, 0)
      .fromTo(q("[data-rail-dot]"), { top: "0%" }, { top: "100%", ease: "none" }, 0);

    // ——— Schritte: aktiv schalten, Ziffer rollt ———
    const live = q("[data-live]");
    gsap.set(live, { scale: 0, opacity: 0 });
    stepEls.forEach((el, i) => {
      const num = el.querySelector("[data-num]");
      const roll = () =>
        gsap.fromTo(num, { yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: "expo.out" });
      const isLast = i === stepEls.length - 1;
      ScrollTrigger.create({
        trigger: el,
        start: "top 60%",
        end: "max",
        toggleClass: { targets: el, className: styles.on },
        onEnter: () => {
          roll();
          if (isLast) gsap.to(live, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(2.5)" });
        },
        onLeaveBack: () => {
          if (isLast) gsap.to(live, { scale: 0, opacity: 0, duration: 0.3, ease: "power2.in" });
        },
      });
    });
  });

  return (
    <Section id="ablauf" paddingY="128" maxWidth={72} gap="48">
      <Row
        ref={rootRef}
        fillWidth
        gap="64"
        vertical="start"
        className={styles.scene}
        s={{ direction: "column", gap: "40" }}
        m={{ direction: "column", gap: "40" }}
        l={{ direction: "row", gap: "64" }}
      >
        <Column flex={5} className={styles.header} maxWidth={28} gap="16">
          <Heading
            as="h2"
            className={styles.headline}
            variant="display-strong-m"
            onBackground="neutral-strong"
            style={{ letterSpacing: "-0.04em", lineHeight: 1.05 }}
          >
            <span className={styles.line}>
              {["Fünf", "Schritte,"].map((w) => (
                <span key={w} className={styles.wordMask}>
                  <span className={styles.word} data-word>
                    {w}
                  </span>
                </span>
              ))}
            </span>
            <span className={styles.line}>
              {["dann", "bist", "du", "live."].map((w) => (
                <span key={w} className={styles.wordMask}>
                  <span className={styles.word} data-word>
                    {w}
                  </span>
                </span>
              ))}
            </span>
          </Heading>
          <Text variant="body-default-l" onBackground="neutral-medium" wrap="balance">
            Du brauchst kein Technik-Wissen. Ich führe dich durch alles.
          </Text>
          <Row className={styles.live} vertical="center" gap="8" data-live aria-hidden="true">
            <span className={styles.liveDot} />
            Live
          </Row>
        </Column>

        <Column flex={7} fillWidth className={styles.list} data-list>
          <span className={styles.rail} aria-hidden="true">
            <span className={styles.railFill} data-rail-fill />
            <span className={styles.railDot} data-rail-dot />
          </span>
          {steps.map((s, i) => (
            <Row
              key={s.n}
              data-step={i}
              fillWidth
              gap="20"
              vertical="start"
              className={styles.step}
              style={{ "--i": i } as CSSProperties}
            >
              <span className={styles.num} aria-hidden="true">
                <span className={styles.numInner} data-num>
                  {s.n}
                </span>
              </span>
              <Column gap="12" flex={1} paddingY="4">
                <Row className={styles.pill} vertical="center">
                  <span className={styles.pillLabel}>Schritt {s.n}</span>
                </Row>
                <Text className={styles.title} variant="heading-strong-m">
                  {s.title}
                </Text>
                <Text className={styles.body} variant="body-default-m" onBackground="neutral-weak">
                  {s.body}
                </Text>
                <Text className={styles.meta} variant="label-default-s" onBackground="neutral-weak">
                  {s.meta}
                </Text>
              </Column>
            </Row>
          ))}
        </Column>
      </Row>
    </Section>
  );
}
