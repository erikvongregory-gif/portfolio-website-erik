"use client";

import { Column, Row, Text } from "@once-ui-system/core";
import { Counter } from "@/components/motion";
import styles from "./HeroProof.module.scss";

// Gemessen mit Lighthouse 13 gegen die Live-Domain – SEO steht auf Mobil und
// Desktop bei 100. Performance liegt aktuell bei 98 (Desktop) / 72 (Mobil).
const SCORE = 100;
const PROJECTS = 6;
const RESPONSE_HOURS = 24;

/** Animated Lighthouse ring – the stroke fills in sync with the counter. */
function ScoreRing() {
  return (
    <svg className={styles.ring} viewBox="0 0 44 44" aria-hidden="true">
      <circle className={styles.ringTrack} cx="22" cy="22" r="19" />
      <circle className={styles.ringValue} cx="22" cy="22" r="19" />
    </svg>
  );
}

export function HeroProof() {
  return (
    <Row gap="20" vertical="center" wrap className={styles.root}>
      <Row gap="12" vertical="center">
        <ScoreRing />
        <Column gap="2">
          <Text variant="label-strong-s" onBackground="neutral-strong">
            <Counter value={SCORE} />
            /100
          </Text>
          <Text variant="label-default-xs" onBackground="neutral-weak">
            Lighthouse SEO
          </Text>
        </Column>
      </Row>

      <span className={styles.divider} aria-hidden="true" />

      <Column gap="2">
        <Text variant="label-strong-s" onBackground="neutral-strong">
          <Counter value={PROJECTS} />
        </Text>
        <Text variant="label-default-xs" onBackground="neutral-weak">
          Projekte im Portfolio
        </Text>
      </Column>

      <span className={styles.divider} aria-hidden="true" />

      <Column gap="2">
        <Text variant="label-strong-s" onBackground="neutral-strong">
          &lt; <Counter value={RESPONSE_HOURS} /> h
        </Text>
        <Text variant="label-default-xs" onBackground="neutral-weak">
          Antwortzeit
        </Text>
      </Column>
    </Row>
  );
}
