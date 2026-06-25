"use client";

import { useEffect, useRef } from "react";
import styles from "./ScrollRevealText.module.scss";

type ScrollRevealTextProps = {
  text: string;
};

export function ScrollRevealText({ text }: ScrollRevealTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const words = text.split(" ");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      wordRefs.current.forEach((el) => el && (el.style.opacity = "1"));
      return;
    }
    let raf = 0;
    const apply = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85;
      const end = vh * 0.2;
      const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
      const lit = progress * words.length;
      wordRefs.current.forEach((word, i) => {
        if (!word) return;
        const amt = Math.min(1, Math.max(0, lit - i));
        word.style.opacity = String(0.14 + 0.86 * amt);
      });
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
  }, [words.length]);

  return (
    <p ref={ref} className={styles.text}>
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          ref={(el) => {
            wordRefs.current[i] = el;
          }}
          className={styles.word}
        >
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
