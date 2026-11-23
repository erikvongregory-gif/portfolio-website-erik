"use client";

import { Column, Row, Text } from "@once-ui-system/core";
import { useEffect, useRef } from "react";
import type { ShowreelItem } from "@/lib/showreel";
import styles from "./FilmLightbox.module.scss";

type Props = {
  film: ShowreelItem | null;
  onClose: () => void;
};

/**
 * Full film with sound in a native modal <dialog>: Esc closes, focus stays
 * inside while open and goes back to the card afterwards (handled by the caller).
 */
export function FilmLightbox({ film, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (film && !dialog.open) {
      dialog.showModal();
      closeRef.current?.focus();
      document.documentElement.style.overflow = "hidden";
    } else if (!film && dialog.open) {
      dialog.close();
    }
    if (!film) document.documentElement.style.overflow = "";
  }, [film]);

  useEffect(
    () => () => {
      document.documentElement.style.overflow = "";
    },
    [],
  );

  const portrait = film?.ratio === "9 / 16" || film?.ratio === "4 / 5";

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      data-theme="dark"
      aria-labelledby="film-lightbox-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        // Click on the backdrop (the dialog itself, outside the panel) closes.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {film && (
        <Column className={styles.panel} data-portrait={portrait || undefined} gap="16">
          <Row horizontal="between" vertical="center" gap="16">
            <Column gap="2" style={{ minWidth: 0 }}>
              <Text as="h2" id="film-lightbox-title" className={styles.title}>
                {film.title}
              </Text>
              <Text className={styles.kind}>{film.kind}</Text>
            </Column>
            <button
              ref={closeRef}
              type="button"
              className={styles.close}
              onClick={onClose}
              aria-label="Film schließen"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </Row>
          <video
            key={film.id}
            className={styles.video}
            src={`/videos/${film.id}.mp4`}
            poster={`/videos/${film.id}.webp`}
            style={{ aspectRatio: film.ratio }}
            controls
            autoPlay
            playsInline
          />

        </Column>
      )}
    </dialog>
  );
}
