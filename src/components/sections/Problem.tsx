"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
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

function Face({
  kicker,
  title,
  body,
  tone,
}: {
  kicker: string;
  title: string;
  body: string;
  tone: "today" | "next";
}) {
  return (
    <Column
      className={classNames(styles.faceInner, tone === "next" && styles.faceNext)}
      gap="8"
      fillWidth
    >
      <Text
        className={styles.kicker}
        variant="label-default-xs"
        onBackground={tone === "next" ? "neutral-strong" : "neutral-weak"}
      >
        {kicker}
      </Text>
      <Text
        variant="heading-strong-m"
        onBackground={tone === "next" ? "neutral-strong" : "neutral-medium"}
      >
        {title}
      </Text>
      <Text
        variant="body-default-s"
        onBackground={tone === "next" ? "neutral-medium" : "neutral-weak"}
      >
        {body}
      </Text>
    </Column>
  );
}

function FlipCard({
  pair,
  flipped,
  delay,
  reduced,
  onToggle,
  onPause,
}: {
  pair: (typeof pairs)[number];
  flipped: boolean;
  delay: number;
  reduced: boolean;
  onToggle: () => void;
  onPause: (paused: boolean) => void;
}) {
  return (
    <button
      type="button"
      className={classNames(styles.trigger, reduced && styles.static)}
      style={{ "--i": delay } as CSSProperties}
      aria-pressed={flipped}
      aria-label={`Heute: ${pair.today}. Mit EvgLab: ${pair.next}`}
      onClick={onToggle}
      onMouseEnter={() => onPause(true)}
      onMouseLeave={() => onPause(false)}
      onFocus={() => onPause(true)}
      onBlur={() => onPause(false)}
    >
      <Column className={styles.sizer} aria-hidden="true">
        <Face kicker="Heute" title={pair.today} body={pair.todayBody} tone="today" />
        <Face kicker="Mit EvgLab" title={pair.next} body={pair.nextBody} tone="next" />
      </Column>
      <Column className={styles.lift} aria-hidden="true">
        <Column className={classNames(styles.card, flipped && styles.flipped)}>
          <Column className={`${styles.face} ${styles.front}`}>
            <Face kicker="Heute" title={pair.today} body={pair.todayBody} tone="today" />
          </Column>
          <Column className={`${styles.face} ${styles.back}`}>
            <Face kicker="Mit EvgLab" title={pair.next} body={pair.nextBody} tone="next" />
          </Column>
        </Column>
      </Column>
    </button>
  );
}

export function Problem() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef<Set<number>>(new Set());
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [flipped, setFlipped] = useState(() => pairs.map(() => false));

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (reduced) {
      setInView(true);
      setFlipped(pairs.map(() => true));
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
      { threshold: [0, 0.12, 0.25], rootMargin: "0px 0px -28% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  useEffect(() => {
    if (!inView || reduced) return;

    const introTimers = pairs.map((_, i) =>
      window.setTimeout(() => {
        setFlipped((prev) => prev.map((v, j) => (j === i ? true : v)));
      }, 720 + i * 220),
    );

    let last = -1;
    let loop: number | undefined;
    const startLoop = window.setTimeout(() => {
      loop = window.setInterval(() => {
        setFlipped((prev) => {
          const open = prev.map((_, i) => i).filter((i) => !pausedRef.current.has(i));
          if (open.length === 0) return prev;
          let idx = open[Math.floor(Math.random() * open.length)];
          if (open.length > 1) {
            let guard = 0;
            while (idx === last && guard++ < 8) {
              idx = open[Math.floor(Math.random() * open.length)];
            }
          }
          last = idx;
          return prev.map((v, i) => (i === idx ? !v : v));
        });
      }, 1800);
    }, 720 + pairs.length * 220 + 1100);

    return () => {
      introTimers.forEach(clearTimeout);
      clearTimeout(startLoop);
      if (loop) clearInterval(loop);
    };
  }, [inView, reduced]);

  const toggle = useCallback((i: number) => {
    setFlipped((prev) => prev.map((v, j) => (j === i ? !v : v)));
  }, []);

  const pause = useCallback((i: number, on: boolean) => {
    if (on) pausedRef.current.add(i);
    else pausedRef.current.delete(i);
  }, []);

  return (
    <Section id="problem" className={styles.band} paddingY="128" maxWidth={72} gap="48">
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

        <Grid columns="2" m={{ columns: "1" }} gap="8" className={styles.board}>
          {pairs.map((pair, i) => (
            <FlipCard
              key={pair.today}
              pair={pair}
              flipped={flipped[i]}
              delay={i}
              reduced={reduced}
              onToggle={() => toggle(i)}
              onPause={(on) => pause(i, on)}
            />
          ))}
        </Grid>
      </Column>
    </Section>
  );
}
