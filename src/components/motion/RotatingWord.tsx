"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./RotatingWord.module.scss";

type RotatingWordProps = {
  words: string[];
  /** Millisekunden pro Wort */
  intervalMs?: number;
};

/**
 * Wechselt ein Wort in einer Headline mit sanftem Slide/Blur-Übergang.
 * Das erste Wort wird serverseitig gerendert (SEO). Es wird dauerhaft die
 * Breite des längsten Wortes reserviert, damit die Headline beim
 * Wortwechsel nie neu umbricht oder springt.
 */
export function RotatingWord({ words, intervalMs = 2600 }: RotatingWordProps) {
  const [index, setIndex] = useState(0);
  const [maxWidth, setMaxWidth] = useState<number | null>(null);
  const [reduced, setReduced] = useState(false);
  const sizerRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const measure = () =>
      setMaxWidth(
        Math.max(...sizerRefs.current.map((el) => (el ? el.offsetWidth : 0))),
      );
    measure();
    // Nach dem Font-Load erneut messen, sonst stimmen die Breiten nicht.
    document.fonts?.ready.then(measure).catch(() => {});
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (reduced || words.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), intervalMs);
    return () => clearInterval(id);
  }, [reduced, words.length, intervalMs]);

  return (
    <span
      className={styles.root}
      style={maxWidth ? { width: `${maxWidth}px` } : undefined}
    >
      <span className={styles.sizer} aria-hidden="true">
        {words.map((w, i) => (
          <span
            key={w}
            ref={(el) => {
              sizerRefs.current[i] = el;
            }}
          >
            {w}
          </span>
        ))}
      </span>
      <span key={index} className={reduced ? undefined : styles.word}>
        {words[index]}
      </span>
    </span>
  );
}
