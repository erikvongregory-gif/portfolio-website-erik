"use client";

import { Column, Heading, Row, Tag, Text } from "@once-ui-system/core";
import { useEffect, useRef, useState } from "react";
import { Section } from "./Section";
import styles from "./Problem.module.scss";

const problems = [
  {
    no: "01",
    title: "Sieht aus wie eine Vorlage",
    body: "Baukasten-Optik ohne Charakter. Deine Marke geht in der Masse unter, statt aufzufallen.",
    lead: "Wie alle auszusehen kostet dich Vertrauen.",
    quote: "„Sieht aus wie ein Baukasten.“ – genau das denkt dein Besucher in den ersten Sekunden.",
  },
  {
    no: "02",
    title: "Bringt keine Anfragen",
    body: "Besucher kommen und gehen. Ohne klare Führung wird aus Interesse keine Anfrage.",
    lead: "Besuche, die zu nichts führen, sind verlorenes Geld.",
    quote: "Ohne klare Führung klicken die Leute weg, statt dich anzufragen.",
  },
  {
    no: "03",
    title: "Langsam und nicht mobil",
    body: "Lange Ladezeiten und eine schwache Mobil-Ansicht kosten dich täglich Kunden.",
    lead: "Jede Sekunde Ladezeit kostet dich Kunden.",
    quote: "Die meisten surfen mobil. Wer da warten muss, ist sofort wieder weg.",
  },
  {
    no: "04",
    title: "Kein direkter Ansprechpartner",
    body: "Agentur-Pingpong und wechselnde Juniors. Niemand fühlt sich wirklich verantwortlich.",
    lead: "Du willst Ergebnisse, kein Agentur-Pingpong.",
    quote: "Wechselnde Juniors, niemand verantwortlich – das frustriert und kostet Zeit.",
  },
];

/** Ignore near-ties so active index doesn't flicker at boundaries. */
const MOBILE_HYSTERESIS_PX = 56;

export function Problem() {
  const trackRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const mobileActiveRef = useRef(0);
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(0);
  const [mobileActive, setMobileActive] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(mq.matches && !rm.matches);
    update();
    mq.addEventListener("change", update);
    rm.addEventListener("change", update);
    return () => {
      mq.removeEventListener("change", update);
      rm.removeEventListener("change", update);
    };
  }, []);

  // Mobile: light up whichever problem is closest to the centre of the screen
  // as you scroll – the touch-friendly counterpart to the desktop stepper.
  useEffect(() => {
    if (enabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const list = listRef.current;
    if (!list) return;
    let raf = 0;
    const apply = () => {
      raf = 0;
      const items = Array.from(list.children) as HTMLElement[];
      if (!items.length) return;
      const focus = window.innerHeight * 0.5;
      let best = 0;
      let bestDist = Infinity;
      items.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2;
        const dist = Math.abs(center - focus);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });

      const prev = mobileActiveRef.current;
      if (best !== prev) {
        const prevEl = items[prev];
        if (prevEl) {
          const r = prevEl.getBoundingClientRect();
          const prevDist = Math.abs(r.top + r.height / 2 - focus);
          // Stay on the current item until the new one is clearly closer.
          if (prevDist - bestDist < MOBILE_HYSTERESIS_PX) return;
        }
        mobileActiveRef.current = best;
        setMobileActive(best);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const apply = () => {
      raf = 0;
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const distance = rect.height - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(distance, 1));
      const p = distance > 0 ? scrolled / distance : 0;
      const idx = Math.min(problems.length - 1, Math.max(0, Math.floor(p * problems.length)));
      setActive(idx);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled]);

  const step = enabled ? active : mobileActive;
  const current = problems[step];

  const content = (
    <Section id="problem" paddingY="56">
      <Row fillWidth gap="64" vertical="center" m={{ direction: "column", gap: "40" }}>
        <Column flex={4} maxWidth={26} gap="24">
          <Tag size="s" variant="neutral">
            Das Problem
          </Tag>

          <Column
            key={enabled ? active : "mobile-lead"}
            className={enabled ? styles.lead : styles.leadStatic}
            gap="16"
          >
            <Heading
              as="h2"
              variant="display-strong-xs"
              onBackground="neutral-strong"
              wrap="balance"
              style={{ letterSpacing: "-0.03em", lineHeight: 1.08 }}
            >
              {current.lead}
            </Heading>
            <Text
              className={styles.quote}
              variant="body-default-l"
              onBackground="neutral-weak"
              wrap="balance"
            >
              {current.quote}
            </Text>
          </Column>

          <Text variant="label-default-s" onBackground="neutral-weak">
            {String(step + 1).padStart(2, "0")} / {String(problems.length).padStart(2, "0")}
          </Text>
        </Column>

        <Column
          ref={listRef}
          flex={6}
          fillWidth
          gap="8"
          className={enabled ? styles.stepper : styles.mobileStepper}
        >
          {problems.map((p, i) => {
            const isActive = step === i;
            return (
              <Row
                key={p.no}
                className={`${styles.item} ${isActive ? styles.active : ""}`}
                gap="24"
                padding="20"
                radius="l"
                vertical="start"
                background={isActive ? "surface" : undefined}
                border={isActive ? "neutral-alpha-medium" : "transparent"}
              >
                <Text className={styles.num} variant="heading-strong-l" onBackground="neutral-weak">
                  {p.no}
                </Text>
                <Column gap="8">
                  <Text variant="heading-strong-s" onBackground="neutral-strong">
                    {p.title}
                  </Text>
                  <Text variant="body-default-m" onBackground="neutral-weak">
                    {p.body}
                  </Text>
                </Column>
              </Row>
            );
          })}
        </Column>
      </Row>
    </Section>
  );

  if (!enabled) return content;

  return (
    <div
      ref={trackRef}
      style={{ position: "relative", width: "100%", height: `${problems.length * 100}vh` }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {content}
      </div>
    </div>
  );
}
