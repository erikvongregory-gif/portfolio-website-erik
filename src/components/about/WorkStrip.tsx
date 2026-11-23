"use client";

import { Column, Text } from "@once-ui-system/core";
import { useEffect, useRef } from "react";
import styles from "./AboutSections.module.scss";

export type StripFilm = { id: string; title: string; kind: string; tilt: number };

/** One taped film still. The silent preview plays on hover, or in view on touch. */
function Still({ film }: { film: StripFilm }) {
  const ref = useRef<HTMLVideoElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const touch = window.matchMedia("(hover: none)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const box = boxRef.current;
    if (!touch || reduced || !box) return;
    const io = new IntersectionObserver(
      ([e]) => {
        const v = ref.current;
        if (!v) return;
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.7 },
    );
    io.observe(box);
    return () => io.disconnect();
  }, []);

  const play = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    ref.current?.play().catch(() => {});
  };
  const stop = () => ref.current?.pause();

  return (
    <Column
      as="figure"
      ref={boxRef}
      className={styles.still}
      style={{ transform: `rotate(${film.tilt}deg)` }}
      onMouseEnter={play}
      onMouseLeave={stop}
    >
      <span className={styles.stillTape} aria-hidden="true" />
      <span className={styles.stillFrame}>
        <video
          ref={ref}
          className={styles.stillVideo}
          src={`/videos/${film.id}-preview.mp4`}
          poster={`/videos/${film.id}.webp`}
          muted
          loop
          playsInline
          preload="none"
          aria-label={`Ausschnitt aus dem Film für ${film.title}`}
        />
      </span>
      <Text as="figcaption" className={styles.stillCaption}>
        <strong>{film.title}</strong> {film.kind}
      </Text>
    </Column>
  );
}

export function WorkStrip({ films }: { films: StripFilm[] }) {
  return (
    <Column as="ul" className={styles.strip} aria-label="Filme aus der Werkbank">
      {films.map((f) => (
        <li key={f.id} className={styles.stripItem}>
          <Still film={f} />
        </li>
      ))}
    </Column>
  );
}
