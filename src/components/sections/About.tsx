"use client";

import { useRef } from "react";
import Image from "next/image";
import { Column, Grid, Heading, Icon, Row, Tag, Text } from "@once-ui-system/core";
import { Counter, Reveal } from "@/components/motion";
import { gsap, useGsapScene } from "@/components/motion/gsap";
import { Section } from "./Section";
import styles from "./About.module.scss";

/** Typische Agentur-Rollen, die sich auflösen (Position in % der Bühne). */
const roles = [
  { label: "Projektmanager", x: 18, y: 14 },
  { label: "Account Manager", x: 66, y: 8 },
  { label: "Junior-Designer", x: 82, y: 34 },
  { label: "Texter", x: 9, y: 50 },
  { label: "Entwickler", x: 84, y: 76 },
  { label: "SEO-Agentur", x: 16, y: 86 },
  { label: "Support-Ticket", x: 56, y: 96 },
];
const CENTER = { x: 50, y: 52 };

const reasons = [
  "Direkter Kontakt, immer ich persönlich",
  "Klare Prozesse, keine Überraschungen",
  "Schnelle Umsetzung statt monatelanger Schleifen",
  "Ehrliche Beratung, auch wenn sie weniger Umsatz bedeutet",
];

const stats = [
  { num: 10, suffix: "+", label: "Projekte umgesetzt" },
  { num: 7, suffix: " Tage", label: "Ø Lieferzeit" },
  { num: 1, suffix: "", label: "fester Ansprechpartner" },
];

export function About() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGsapScene(rootRef, ({ motion }, scope) => {
    const q = gsap.utils.selector(scope);
    const only = q("[data-only]");
    if (!motion) {
      only.forEach((el) => el.classList.add(styles.lit));
      return;
    }

    const chips = q("[data-role]") as HTMLElement[];
    const lines = q("[data-link]");
    const me = q("[data-me]");

    gsap
      .timeline({
        scrollTrigger: {
          trigger: q("[data-stage]")[0],
          start: "top 80%",
          end: "bottom 15%",
          scrub: 0.8,
          onUpdate: (self) => {
            const on = self.progress > 0.62;
            only.forEach((el) => el.classList.toggle(styles.lit, on));
          },
        },
      })
      // Organigramm baut sich auf …
      .fromTo(
        chips,
        { opacity: 0, scale: 0.7 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)", stagger: 0.05 },
        0,
      )
      .fromTo(lines, { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.05 }, 0.1)
      // … und löst sich auf.
      .to(lines, { opacity: 0, duration: 0.25, stagger: 0.03 }, 0.9)
      .to(
        chips,
        {
          x: (i: number) => (roles[i].x - CENTER.x) * 3.2,
          y: (i: number) => (roles[i].y - CENTER.y) * 2.4,
          rotate: (i: number) => (i % 2 ? 14 : -14),
          opacity: 0,
          filter: "blur(8px)",
          duration: 0.6,
          ease: "power2.in",
          stagger: 0.04,
        },
        1,
      )
      .fromTo(
        me,
        { opacity: 0, scale: 0.6, filter: "blur(10px)" },
        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.6, ease: "back.out(1.6)" },
        1.35,
      );
  });

  return (
    <Section id="warum">
      <Row ref={rootRef} fillWidth gap="64" vertical="start" m={{ direction: "column", gap: "48" }}>
        <Reveal>
        <Column flex={1} gap="24">
          <Tag size="s" variant="neutral">
            Warum EvGlab
          </Tag>
          <Heading
            as="h2"
            variant="display-strong-s"
            onBackground="neutral-strong"
            wrap="balance"
            style={{ letterSpacing: "-0.03em", lineHeight: 1.05 }}
          >
            Kein Team, kein Overhead.{" "}
            <Text as="span" onBackground="neutral-weak" className={styles.only} data-only>
              Nur ich.
            </Text>
          </Heading>
          <Text variant="body-default-l" onBackground="neutral-weak">
            Hinter EvGlab steckt eine Person: ich, Erik. Du sprichst direkt mit mir, von der ersten
            Idee bis nach dem Launch – aus Landsberg am Lech, für Kunden in Bayern und
            deutschlandweit. Ich kenne jedes Detail deines Projekts und bin dafür verantwortlich.
          </Text>
          <Column gap="12" paddingTop="4">
            {reasons.map((r) => (
              <Row key={r} gap="12" vertical="center">
                <Icon name="check" size="s" onBackground="neutral-strong" />
                <Text variant="body-default-m" onBackground="neutral-medium">
                  {r}
                </Text>
              </Row>
            ))}
          </Column>
        </Column>
        </Reveal>

        <Column flex={1} fillWidth gap="24">
          <Column className={styles.stage} fillWidth data-stage aria-hidden="true">
            <svg className={styles.links} viewBox="0 0 100 100" preserveAspectRatio="none">
              {roles.map((r) => (
                <line key={r.label} x1={CENTER.x} y1={CENTER.y} x2={r.x} y2={r.y} data-link />
              ))}
            </svg>
            {roles.map((r) => (
              <span
                key={r.label}
                className={styles.role}
                style={{ left: `${r.x}%`, top: `${r.y}%` }}
                data-role
              >
                {r.label}
              </span>
            ))}
            <Row className={styles.me} gap="12" vertical="center" data-me>
              <span className={styles.meAvatar}>
                <Image src="/images/about/erik-avatar.webp" alt="" width={48} height={48} />
              </span>
              <Column gap="2">
                <Text variant="label-strong-m" onBackground="neutral-strong">
                  Erik
                </Text>
                <Text variant="label-default-s" onBackground="neutral-weak">
                  Design · Code · Texte · Support
                </Text>
              </Column>
            </Row>
          </Column>

          <Row className={styles.statsRow} fillWidth>
            {stats.map((s, i) => (
              <Column key={s.label} className={styles.statItem} horizontal="center">
                {i > 0 && <span className={styles.statDivider} aria-hidden="true" />}
                <Text
                  variant="display-strong-s"
                  onBackground="neutral-strong"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  <Counter value={s.num} suffix={s.suffix} />
                </Text>
                <Text variant="body-default-xs" onBackground="neutral-weak" align="center">
                  {s.label}
                </Text>
              </Column>
            ))}
          </Row>

          <Grid className={styles.statsGrid} columns="1" gap="12" fillWidth m={{ columns: "3" }} s={{ columns: "1" }}>
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.12}>
                <Column
                  background="surface"
                  border="neutral-alpha-weak"
                  radius="l"
                  padding="24"
                  gap="4"
                >
                  <Text
                    variant="display-strong-m"
                    onBackground="neutral-strong"
                    style={{ letterSpacing: "-0.03em" }}
                  >
                    <Counter value={s.num} suffix={s.suffix} />
                  </Text>
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    {s.label}
                  </Text>
                </Column>
              </Reveal>
            ))}
          </Grid>
        </Column>
      </Row>
    </Section>
  );
}
