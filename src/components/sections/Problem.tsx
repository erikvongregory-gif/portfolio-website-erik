"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Column, Grid, Heading, Text } from "@once-ui-system/core";
import classNames from "classnames";
import { Section } from "./Section";
import styles from "./Problem.module.scss";

const pairs = [
  {
    today: "Sieht aus wie eine Vorlage",
    todayBody: "Baukasten-Optik. Deine Marke geht in der Masse unter.",
    next: "Sieht aus wie deine Marke",
    nextBody: "Eigene Form, die man wiedererkennt. Kein Template.",
  },
  {
    today: "Besucher kommen und gehen",
    todayBody: "Kein klarer nächster Schritt. Interesse verpufft.",
    next: "Interesse wird zur Anfrage",
    nextBody: "Führung bis zur Nachricht. Ohne Umwege.",
  },
  {
    today: "Langsam und auf dem Handy verloren",
    todayBody: "Ladezeiten und eine schwache Mobil-Ansicht kosten Kunden.",
    next: "Schnell. Auch mobil.",
    nextBody: "Leicht, suchmaschinenfreundlich, auf dem Handy zuerst.",
  },
  {
    today: "Agentur-Pingpong, niemand verantwortlich",
    todayBody: "Wechselnde Juniors. Du jagst Updates hinterher.",
    next: "Du sprichst direkt mit mir",
    nextBody: "Eine Person. Von der Idee bis zum Launch.",
  },
];

export function Problem() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio > 0) {
            setInView(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: [0, 0.12, 0.25], rootMargin: "0px 0px -36% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Section id="problem" paddingY="128" maxWidth={72} gap="48">
      <Column
        ref={rootRef}
        fillWidth
        gap="48"
        className={classNames(styles.scene, inView && styles.in)}
      >
        <Column gap="16" maxWidth={48}>
          <Heading
            as="h2"
            className={styles.title}
            variant="display-strong-m"
            onBackground="neutral-strong"
            style={{ letterSpacing: "-0.04em", lineHeight: 1.05 }}
          >
            <span className={styles.line}>
              <span className={styles.lineInner}>Wenn deine Website</span>
            </span>
            <span className={styles.line}>
              <span className={styles.lineInner}>dich bremst</span>
            </span>
          </Heading>
          <Text
            className={styles.lead}
            variant="body-default-l"
            onBackground="neutral-medium"
            wrap="balance"
          >
            Baukasten-Optik, keine Anfragen, niemand verantwortlich. Kommt dir bekannt vor?
          </Text>
        </Column>

        <Column fillWidth className={styles.board} gap="-1">
          <Grid columns="2" m={{ columns: "1" }} className={styles.colHead} gap="32">
            <Text className={styles.headLabel} variant="label-strong-s" onBackground="neutral-weak">
              Heute
            </Text>
            <Text
              className={`${styles.nextLabel} ${styles.headLabel}`}
              variant="label-strong-s"
              onBackground="neutral-strong"
            >
              Mit EvgLab
            </Text>
          </Grid>

          {pairs.map((p, i) => (
            <Grid
              key={p.today}
              columns="2"
              m={{ columns: "1" }}
              className={styles.pair}
              gap="32"
              style={{ "--i": i } as CSSProperties}
            >
              <Column className={styles.today} gap="8">
                <Text className={styles.kicker} variant="label-default-xs" onBackground="neutral-weak">
                  Heute
                </Text>
                <Text variant="heading-strong-m" onBackground="neutral-medium">
                  {p.today}
                </Text>
                <Text variant="body-default-s" onBackground="neutral-weak">
                  {p.todayBody}
                </Text>
              </Column>
              <Column className={styles.next} gap="8">
                <span className={styles.wipe} aria-hidden="true" />
                <Text className={styles.kicker} variant="label-default-xs" onBackground="neutral-strong">
                  Mit EvgLab
                </Text>
                <Text variant="heading-strong-m" onBackground="neutral-strong">
                  {p.next}
                </Text>
                <Text variant="body-default-s" onBackground="neutral-medium">
                  {p.nextBody}
                </Text>
              </Column>
            </Grid>
          ))}
        </Column>
      </Column>
    </Section>
  );
}
