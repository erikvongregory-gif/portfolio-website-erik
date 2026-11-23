"use client";

import { Column, Heading, Icon, Row, SmartLink, Text } from "@once-ui-system/core/components";
import classNames from "classnames";
import Image from "next/image";
import { useRef } from "react";
import { gsap, useGsapScene } from "@/components/motion/gsap";
import { StudioSection } from "@/components/studio";
import { ABOUT, STATEMENT } from "./data";
import styles from "./HomeStatement.module.scss";

const clean = (w: string) => w.replace(/[.,!?;:–]/g, "");

/**
 * One sentence that is read with the scroll: words light up one after another,
 * the three key words take the glow. Below, the person behind it.
 */
export function HomeStatement() {
  const rootRef = useRef<HTMLDivElement>(null);
  const words = STATEMENT.text.split(" ");

  useGsapScene(rootRef, ({ motion }, scope) => {
    if (!motion) return;
    const els = gsap.utils.toArray<HTMLElement>(scope.querySelectorAll("[data-word]"));
    gsap.set(els, { opacity: 0.16 });
    gsap.to(els, {
      opacity: 1,
      ease: "none",
      stagger: 0.1,
      scrollTrigger: { trigger: scope, start: "top 78%", end: "bottom 62%", scrub: 0.6 },
    });
  });

  return (
    <StudioSection id="warum" aria-label="Warum EvGlab">
      <Column fillWidth gap="104" s={{ gap: "64" }}>
        <Column ref={rootRef} fillWidth maxWidth={64}>
          <Text as="p" className={styles.statement}>
            {words.map((w, i) => {
              const marked = STATEMENT.highlights.includes(clean(w));
              return (
                <span key={`${w}-${i}`} data-word className={classNames(styles.word, marked && styles.marked)}>
                  {w}
                  {i < words.length - 1 ? " " : ""}
                </span>
              );
            })}
          </Text>
        </Column>

        <Row fillWidth gap="64" vertical="start" m={{ direction: "column", gap: "40" }}>
          <Column flex={5} gap="24" fillWidth>
            <Row gap="16" vertical="center">
              <span className={styles.avatar}>
                <Image
                  src="/images/about/erik-avatar.webp"
                  alt="Erik von Gregory, Gründer von EvGlab"
                  width={56}
                  height={56}
                  sizes="56px"
                />
              </span>
              <Column gap="2">
                <Text className={styles.name}>Erik von Gregory</Text>
                <Text className={styles.role}>Design · Code · Texte · Support</Text>
              </Column>
            </Row>
            <Heading as="h2" className={styles.title}>
              {ABOUT.title} <span className={styles.accent}>{ABOUT.accent}</span>
            </Heading>
          </Column>

          <Column flex={6} gap="32" fillWidth>
            <Text as="p" className={styles.body}>
              {ABOUT.body}
            </Text>
            <Column as="ul" className={styles.reasons} fillWidth>
              {ABOUT.reasons.map((r) => (
                <Text as="li" key={r} className={styles.reason}>
                  {r}
                </Text>
              ))}
            </Column>
            <Row as="dl" className={styles.stats} gap="40" wrap>
              {ABOUT.stats.map((s) => (
                <Column key={s.label} gap="4" className={styles.stat}>
                  <Text as="dt" className={styles.statLabel}>
                    {s.label}
                  </Text>
                  <Text as="dd" className={styles.statValue}>
                    {s.value}
                  </Text>
                </Column>
              ))}
            </Row>
            <SmartLink href="/ueber-uns" unstyled className={styles.link}>
              <Row gap="8" vertical="center">
                <Text className={styles.linkLabel}>Wer dahintersteckt</Text>
                <Icon name="arrowRight" size="xs" />
              </Row>
            </SmartLink>
          </Column>
        </Row>
      </Column>
    </StudioSection>
  );
}
