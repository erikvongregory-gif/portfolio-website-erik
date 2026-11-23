"use client";

import { IconButton, Row, Text } from "@once-ui-system/core";
import { useEffect, useRef } from "react";
import { startLenis, stopLenis } from "@/components/motion/SmoothScroll";
import type { ShowreelItem } from "@/lib/showreel";
import styles from "./FilmLightbox.module.scss";

type Props = {
  film: ShowreelItem | null;
  onClose: () => void;
};

/** Full film with sound in a native modal dialog (Esc and backdrop close it). */
export function FilmLightbox({ film, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const paused = useRef(false);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (film && !d.open) {
      d.showModal();
      stopLenis();
      paused.current = true;
    }
    if (!film) {
      if (d.open) d.close();
      if (paused.current) startLenis();
      paused.current = false;
    }
  }, [film]);

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-label={film ? `${film.title}, ${film.kind}` : "Film"}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {film && (
        <figure className={styles.figure}>
          <video
            className={styles.video}
            style={{ aspectRatio: film.ratio }}
            src={`/videos/${film.id}.mp4`}
            poster={`/videos/${film.id}.webp`}
            controls
            autoPlay
            playsInline
          />
          <Row as="figcaption" horizontal="between" vertical="center" gap="16" paddingTop="12">
            <Text className={styles.caption}>
              {film.title} <span className={styles.kind}>{film.kind}</span>
            </Text>
            <IconButton
              icon="close"
              variant="tertiary"
              size="l"
              onClick={onClose}
              aria-label="Film schließen"
            />
          </Row>
        </figure>
      )}
    </dialog>
  );
}
