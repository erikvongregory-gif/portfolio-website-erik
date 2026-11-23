"use client";

import { Column, Row, Text } from "@once-ui-system/core/components";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import type { ShowreelItem } from "@/lib/showreel";
import styles from "./FilmCard.module.scss";

type Props = {
  film: ShowreelItem;
  /** Override the card ratio (defaults to the film's own ratio). */
  ratio?: string;
  className?: string;
  /** Called on click, e.g. to open a lightbox with the full film. */
  onOpen?: (film: ShowreelItem) => void;
};

/**
 * A film tile: poster first, the silent preview plays on hover (desktop) or
 * while in view (touch). Title and kind sit quietly below.
 */
export function FilmCard({ film, ratio, className, onOpen }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLButtonElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const touch = window.matchMedia("(hover: none)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!touch || reduced || !cardRef.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        const v = videoRef.current;
        if (!v) return;
        if (e.isIntersecting) {
          v.play().catch(() => {});
          setPlaying(true);
        } else {
          v.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.6 },
    );
    io.observe(cardRef.current);
    return () => io.disconnect();
  }, []);

  const start = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    videoRef.current?.play().catch(() => {});
    setPlaying(true);
  };
  const stop = () => {
    videoRef.current?.pause();
    setPlaying(false);
  };

  return (
    <Column className={classNames(styles.card, className)} gap="12" fillWidth>
      <button
        ref={cardRef}
        type="button"
        className={classNames(styles.frame, playing && styles.playing)}
        style={{ aspectRatio: ratio ?? film.ratio }}
        onMouseEnter={start}
        onMouseLeave={stop}
        onFocus={start}
        onBlur={stop}
        onClick={() => onOpen?.(film)}
        aria-label={`${film.title}, ${film.kind} ansehen`}
      >
        <video
          ref={videoRef}
          className={styles.video}
          src={`/videos/${film.id}-preview.mp4`}
          poster={`/videos/${film.id}.webp`}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
        />
      </button>
      <Row horizontal="between" vertical="center" gap="12">
        <Text className={styles.title}>{film.title}</Text>
        <Text className={styles.kind}>{film.kind}</Text>
      </Row>
    </Column>
  );
}
