"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./RotatingWord.module.scss";

type RotatingWordProps = {
  words: string[];
  /** Millisekunden pro Wort */
  intervalMs?: number;
};

/**
 * Wechselt ein Wort in einer Headline mit sanftem Slide/Blur-Übergang.
 * Die Container-Breite folgt dem aktuellen Wort per Transition, damit
 * „bringen“ sichtbar mitrutscht statt zu springen.
 */
export function RotatingWord({ words, intervalMs = 2600 }: RotatingWordProps) {
  const [index, setIndex] = useState(0);
  const [width, setWidth] = useState<number | null>(null);
  const [reduced, setReduced] = useState(false);
  const wordRef = useRef<HTMLSpanElement>(null);
  const sizerRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useLayoutEffect(() => {
    const el = sizerRefs.current[index] ?? wordRef.current;
    if (!el) return;
    setWidth(el.getBoundingClientRect().width);
  }, [index, words]);

  useEffect(() => {
    const measure = () => {
      const el = sizerRefs.current[index] ?? wordRef.current;
      if (el) setWidth(el.getBoundingClientRect().width);
    };
    document.fonts?.ready.then(measure).catch(() => {});
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [index]);

  useEffect(() => {
    if (reduced || words.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), intervalMs);
    return () => clearInterval(id);
  }, [reduced, words.length, intervalMs]);

  return (
    <span
      className={`${styles.root}${reduced ? "" : ` ${styles.animateWidth}`}`}
      style={width != null ? { width: `${width}px` } : undefined}
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
      <span key={index} ref={wordRef} className={reduced ? undefined : styles.word}>
        {words[index]}
      </span>
    </span>
  );
}
