"use client";

import Image from "next/image";
import { Column, Grid, Heading, Row, SmartLink, Text } from "@once-ui-system/core";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { FilmCard } from "@/components/studio";
import type { SeoReference } from "@/lib/seoPages";
import { showreel, type ShowreelItem } from "@/lib/showreel";
import styles from "./Landing.module.scss";

type Props = {
  reference?: SeoReference;
  /** Film ids from src/lib/showreel.ts. */
  filmIds?: string[];
  /** Force one ratio for all film tiles so the row stays even. */
  filmRatio?: string;
  filmsTitle?: string;
  /** Hide the project name when the surrounding section already shows it. */
  hideRefTitle?: boolean;
};

/** Plays the full film in a native modal dialog. */
function FilmLightbox({ film, onClose }: { film: ShowreelItem | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (film && !dialog.open) dialog.showModal();
    if (!film && dialog.open) dialog.close();
  }, [film]);

  const portrait = film?.ratio === "9 / 16" || film?.ratio === "4 / 5";

  return (
    <dialog
      ref={ref}
      className={classNames(styles.lightbox, portrait && styles.lightboxPortrait)}
      aria-label={film ? `${film.title}, ${film.kind}` : "Film"}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {film && (
        <>
          <button type="button" className={styles.lightboxClose} onClick={onClose} aria-label="Film schließen">
            ×
          </button>
          <video
            key={film.id}
            className={styles.lightboxVideo}
            src={`/videos/${film.id}.mp4`}
            poster={`/videos/${film.id}.webp`}
            controls
            autoPlay
            playsInline
            style={{ aspectRatio: film.ratio }}
          />
        </>
      )}
    </dialog>
  );
}

/**
 * Real work for local and SEO pages: one website reference with image and
 * quote, plus a row of EvGlab films that play on hover and open full size.
 */
export function WorkShowcase({ reference, filmIds = [], filmRatio, filmsTitle = "Filme aus dem Studio", hideRefTitle = false }: Props) {
  const [open, setOpen] = useState<ShowreelItem | null>(null);
  const films = filmIds
    .map((id) => showreel.find((f) => f.id === id))
    .filter((f): f is ShowreelItem => Boolean(f));

  return (
    <Column fillWidth gap="80" s={{ gap: "56" }}>
      {reference && (
        <Row fillWidth gap="56" vertical="center" m={{ direction: "column", gap: "32" }}>
          <Column flex={5} fillWidth gap="20">
            <Text className={styles.refMeta}>{reference.category}</Text>
            {!hideRefTitle && (
              <Heading as="h3" className={styles.refTitle}>
                {reference.title}
              </Heading>
            )}
            <Text as="p" className={styles.itemBody}>
              {reference.body}
            </Text>
            {reference.quote && (
              <Text as="blockquote" className={styles.quote}>
                „{reference.quote}“
              </Text>
            )}
            {reference.url && (
              <Row>
                <SmartLink
                  href={reference.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  unstyled
                  className={styles.textLink}
                >
                  Live ansehen
                  <span aria-hidden="true">↗</span>
                </SmartLink>
              </Row>
            )}
          </Column>
          <Column flex={7} fillWidth>
            <Column className={styles.refFrame}>
              <Image
                src={reference.image}
                alt={`${reference.title}: Website-Projekt von EvGlab`}
                fill
                sizes="(max-width: 1024px) 100vw, 720px"
                style={{ objectFit: "cover", objectPosition: "top" }}
              />
            </Column>
          </Column>
        </Row>
      )}

      {films.length > 0 && (
        <Column fillWidth gap="24">
          <Row fillWidth horizontal="between" vertical="end" gap="16" wrap>
            <Heading as="h3" className={styles.filmsHead}>
              {filmsTitle}
            </Heading>
            <SmartLink href="/videos" unstyled className={styles.textLink}>
              Alle Filme
              <span aria-hidden="true">→</span>
            </SmartLink>
          </Row>
          <Grid columns={String(Math.min(films.length, 3)) as "1" | "2" | "3"} s={{ columns: "1" }} gap="24" fillWidth>
            {films.map((film) => (
              <FilmCard key={film.id} film={film} ratio={filmRatio} onOpen={setOpen} />
            ))}
          </Grid>
        </Column>
      )}

      <FilmLightbox film={open} onClose={() => setOpen(null)} />
    </Column>
  );
}
