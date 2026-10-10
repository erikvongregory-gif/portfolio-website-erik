"use client";

import { useRef } from "react";
import { Column, Heading, Row, Text } from "@once-ui-system/core";
import { gsap, useGsapScene } from "@/components/motion/gsap";
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

const BRAKE_WORD = "bremst";

export function Problem() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGsapScene(rootRef, ({ motion, desktop }, scope) => {
    const q = gsap.utils.selector(scope);
    const rows = q("[data-row]");
    const count = q("[data-count]")[0] as HTMLElement | undefined;
    const fill = q("[data-fill]");
    const total = rows.length;

    const setCount = (resolved: number) => {
      if (count) count.textContent = `${String(Math.max(1, resolved)).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
    };

    if (!motion) {
      gsap.set(fill, { scaleX: 1 });
      setCount(total);
      return;
    }

    scope.classList.add(styles.live);

    // ——— Auftritt: Zeilen steigen, „bremst“ fährt mit Bremsweg ein ———
    gsap.set(q("[data-line]"), { yPercent: 115 });
    gsap.set(q("[data-char]"), { x: 140, skewX: -32, opacity: 0 });
    gsap.set(q("[data-fade]"), { y: 18, opacity: 0, filter: "blur(8px)" });
    gsap.set(rows, { y: 28, opacity: 0 });

    gsap
      .timeline({ scrollTrigger: { trigger: scope, start: "top 72%", once: true } })
      .to(q("[data-line]"), { yPercent: 0, duration: 1.05, ease: "expo.out", stagger: 0.14 })
      .to(
        q("[data-char]"),
        { x: 0, skewX: 0, opacity: 1, duration: 1.5, ease: "expo.out", stagger: 0.035 },
        0.2,
      )
      .to(q("[data-fade]"), { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.9, ease: "expo.out", stagger: 0.1 }, 0.35)
      .to(rows, { y: 0, opacity: 1, duration: 0.8, ease: "expo.out", stagger: 0.08 }, 0.45);

    // ——— Pro Zeile: durchstreichen, wegkippen, Lösung rollt rein ———
    const resolveRow = (tl: gsap.core.Timeline, row: Element, at: number) => {
      const r = gsap.utils.selector(row);
      tl.fromTo(r("[data-strike]"), { scaleX: 0 }, { scaleX: 1, duration: 0.35, ease: "power2.inOut" }, at)
        .to(r("[data-today]"), { opacity: 0.35, duration: 0.2, ease: "none" }, at + 0.1)
        .to(r("[data-today]"), { yPercent: -110, opacity: 0, duration: 0.4, ease: "power3.in" }, at + 0.45)
        .fromTo(
          r("[data-next]"),
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.45, ease: "power3.out" },
          at + 0.65,
        )
        .fromTo(r("[data-bar]"), { scaleY: 0 }, { scaleY: 1, duration: 0.4, ease: "power2.out" }, at + 0.7)
        .to(r("[data-index]"), { color: "#9aa6ff", duration: 0.2 }, at + 0.7);
    };

    setCount(1);

    if (desktop) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scope,
          start: () => {
            // --px ist 1px bis 1920px Breite und wächst darüber mit (Header wird größer).
            const px = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--px")) || 1;
            return scope.offsetHeight < window.innerHeight - 140 * px ? "center center" : `top ${96 * px}px`;
          },
          end: () => `+=${total * window.innerHeight * 0.7}`,
          pin: true,
          // Eltern-Container ist flex – dort schaltet ScrollTrigger das Spacing sonst ab.
          pinSpacing: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => setCount(Math.ceil(self.progress * total)),
        },
      });
      rows.forEach((row, i) => resolveRow(tl, row, i * 1.2));
      tl.fromTo(fill, { scaleX: 1 / total }, { scaleX: 1, duration: (total - 1) * 1.2 + 1.1, ease: "none" }, 0);
      tl.to({}, { duration: 0.4 });
    } else {
      rows.forEach((row) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: row, start: "top 78%", end: "top 38%", scrub: 0.6 },
        });
        resolveRow(tl, row, 0);
      });
      gsap.fromTo(
        fill,
        { scaleX: 1 / total },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: q("[data-rows]")[0],
            start: "top 78%",
            end: "bottom 60%",
            scrub: true,
            onUpdate: (self) => setCount(Math.ceil(self.progress * total)),
          },
        },
      );
    }

    return () => scope.classList.remove(styles.live);
  });

  return (
    <Section id="problem" className={styles.band} paddingY="128" maxWidth={72} gap="48">
      <Row
        ref={rootRef}
        fillWidth
        gap="64"
        vertical="center"
        className={styles.scene}
        m={{ direction: "column", gap: "40" }}
      >
        <Column flex={5} gap="24" fillWidth className={styles.aside}>
          <Heading
            as="h2"
            className={styles.title}
            variant="display-strong-m"
            onBackground="neutral-strong"
            style={{ letterSpacing: "-0.04em", lineHeight: 1.05 }}
          >
            <span className={styles.line}>
              <span className={styles.lineInner} data-line>
                Wenn deine Website
              </span>
            </span>
            <span className={styles.line}>
              <span className={styles.lineInner} data-line>
                dich{" "}
                <span className={styles.brake} aria-label={BRAKE_WORD}>
                  {BRAKE_WORD.split("").map((ch, i) => (
                    <span key={i} className={styles.char} data-char aria-hidden="true">
                      {ch}
                    </span>
                  ))}
                </span>
              </span>
            </span>
          </Heading>
          <Text
            className={styles.lead}
            variant="body-default-l"
            onBackground="neutral-medium"
            wrap="balance"
            data-fade
          >
            Baukasten-Optik, keine Anfragen, niemand verantwortlich. Kommt dir bekannt vor?
          </Text>
          <Column gap="12" className={styles.meter} data-fade aria-hidden="true">
            <Row horizontal="between" vertical="center">
              <Text variant="label-default-xs" className={styles.kicker}>
                Bremsen lösen
              </Text>
              <Text variant="label-default-xs" className={styles.count} data-count>
                01 / 04
              </Text>
            </Row>
            <span className={styles.track}>
              <span className={styles.fill} data-fill />
            </span>
          </Column>
        </Column>

        <Column flex={7} fillWidth className={styles.rows} data-rows>
          {pairs.map((pair, i) => (
            <Row key={pair.today} className={styles.row} gap="24" fillWidth data-row>
              <span className={styles.bar} data-bar aria-hidden="true" />
              <Text variant="label-default-s" className={styles.index} data-index aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </Text>
              <span className={styles.stage}>
                <Column gap="8" className={styles.today} data-today>
                  <Text variant="label-default-xs" className={styles.kicker}>
                    Heute
                  </Text>
                  <Text variant="heading-strong-m" className={styles.todayTitle}>
                    <span className={styles.strikeWrap}>
                      {pair.today}
                      <span className={styles.strike} data-strike aria-hidden="true" />
                    </span>
                  </Text>
                  <Text variant="body-default-s" className={styles.body}>
                    {pair.todayBody}
                  </Text>
                </Column>
                <Column gap="8" className={styles.next} data-next>
                  <Text variant="label-default-xs" className={styles.nextKicker}>
                    Mit EvGlab
                  </Text>
                  <Text variant="heading-strong-m" className={styles.nextTitle}>
                    {pair.next}
                  </Text>
                  <Text variant="body-default-s" className={styles.body}>
                    {pair.nextBody}
                  </Text>
                </Column>
              </span>
            </Row>
          ))}
        </Column>
      </Row>
    </Section>
  );
}
