"use client";

import { useEffect, useState } from "react";
import styles from "./RotatingWord.module.scss";

type RotatingWordProps = {
  words: string[];
  /** Millisekunden pro Wort */
  intervalMs?: number;
};

/**
 * Wechselt ein Wort in einer Headline mit sanftem Slide/Blur-Übergang.
 * Breite = aktuelles Wort (inline), damit „bringen“ immer eng anliegt.
 */
export function RotatingWord({ words, intervalMs = 2600 }: RotatingWordProps) {
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reduced || words.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), intervalMs);
    return () => clearInterval(id);
  }, [reduced, words.length, intervalMs]);

  return (
    <span className={styles.root}>
      <span key={index} className={reduced ? undefined : styles.word}>
        {words[index]}
      </span>
    </span>
  );
}
