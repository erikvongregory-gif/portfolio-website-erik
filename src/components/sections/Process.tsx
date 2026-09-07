"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Column, Heading, Row, Text } from "@once-ui-system/core";
import classNames from "classnames";
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

function prefersPlainMotion() {
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    window.matchMedia("(max-width: 1023px)").matches ||
    window.matchMedia("(pointer: coarse)").matches ||
    CSS.supports("-webkit-touch-callout", "none")
  );
}

export function Process() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState<Set<number>>(() => new Set());

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (prefersPlainMotion()) {
      setLit(new Set(steps.map((_, i) => i)));
      return;
    }

    const nodes = el.querySelectorAll<HTMLElement>("[data-step]");
    const stepIo = new IntersectionObserver(
      (entries) => {
        setLit((prev) => {
          const next = new Set(prev);
          let changed = false;
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            const i = Number(e.target.getAttribute("data-step"));
            if (!next.has(i)) {
              next.add(i);
              changed = true;
            }
          }
          return changed ? next : prev;
        });
      },
      { threshold: 0.35 },
    );
    nodes.forEach((n) => stepIo.observe(n));
    return () => stepIo.disconnect();
  }, []);

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
                <span key={w} className={styles.word}>
                  {w}
                </span>
              ))}
            </span>
            <span className={styles.line}>
              {["dann", "bist", "du", "live."].map((w) => (
                <span key={w} className={styles.word}>
                  {w}
                </span>
              ))}
            </span>
          </Heading>
          <Text variant="body-default-l" onBackground="neutral-medium" wrap="balance">
            Du brauchst kein Technik-Wissen. Ich führe dich durch alles.
          </Text>
        </Column>

        <Column flex={7} fillWidth className={styles.list}>
          {steps.map((s, i) => (
            <Row
              key={s.n}
              data-step={i}
              fillWidth
              gap="20"
              vertical="start"
              className={classNames(styles.step, lit.has(i) && styles.on)}
              style={{ "--i": i } as CSSProperties}
            >
              <span className={styles.num} aria-hidden="true">
                {s.n}
              </span>
              <Column gap="12" flex={1} paddingY="4">
                <Row className={styles.pill} vertical="center">
                  Schritt {s.n}
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
