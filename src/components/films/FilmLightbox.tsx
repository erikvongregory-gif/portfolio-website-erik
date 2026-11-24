"use client";

import { Column, Row, Text } from "@once-ui-system/core/components";
import { type CSSProperties, useEffect, useRef } from "react";
import type { ShowreelItem } from "@/lib/showreel";
import styles from "./FilmLightbox.module.scss";

type Props = {
  film: ShowreelItem | null;
  onClose: () => void;
  /** The list the film belongs to: enables previous / next (buttons, arrow keys, swipe). */
  films?: ShowreelItem[];
  onNavigate?: (film: ShowreelItem) => void;
};

/** Swipe thresholds in px: sideways to change film, down to close. */
const SWIPE_X = 60;
const SWIPE_Y = 90;
/** Touches starting this close to the video's bottom edge belong to its controls (scrubbing). */
const CONTROLS_ZONE = 64;

/**
 * Full film with sound in a native modal <dialog>: Esc closes, focus stays
 * inside while open and goes back to the card afterwards (handled by the caller).
 * On phones the bar with close / previous / next sits at the bottom, in thumb
 * reach; swipe sideways for the next film, swipe down to close.
 */
export function FilmLightbox({ film, onClose, films, onNavigate }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
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

  const index = film && films ? films.findIndex((f) => f.id === film.id) : -1;
  const canNavigate = !!onNavigate && !!films && films.length > 1 && index >= 0;
  const go = (step: number) => {
    if (!canNavigate || !films || !onNavigate) return;
    onNavigate(films[(index + step + films.length) % films.length]);
  };

  // Swipe gestures (touch only), applied straight to the panel for 60 fps.
  const touch = useRef<{ x: number; y: number; t: number; axis: "x" | "y" | null } | null>(null);

  const setPanel = (transform: string, opacity: number, animate: boolean) => {
    const p = panelRef.current;
    if (!p) return;
    p.style.transition = animate ? "transform 0.28s var(--studio-ease), opacity 0.28s ease" : "none";
    p.style.transform = transform;
    p.style.opacity = String(opacity);
  };

  // A new film starts centred, even after a swipe moved the panel.
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset on film change only
  useEffect(() => {
    const p = panelRef.current;
    if (!p) return;
    p.style.transition = "none";
    p.style.transform = "";
    p.style.opacity = "";
  }, [film?.id]);

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) {
      touch.current = null;
      return;
    }
    const t = e.touches[0];
    const video = panelRef.current?.querySelector("video");
    if (video) {
      const r = video.getBoundingClientRect();
      const onControls =
        t.clientX >= r.left && t.clientX <= r.right && t.clientY >= r.bottom - CONTROLS_ZONE && t.clientY <= r.bottom;
      if (onControls) {
        touch.current = null;
        return;
      }
    }
    touch.current = { x: t.clientX, y: t.clientY, t: performance.now(), axis: null };
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const s = touch.current;
    if (!s) return;
    const t = e.touches[0];
    const dx = t.clientX - s.x;
    const dy = t.clientY - s.y;
    if (!s.axis) {
      if (Math.hypot(dx, dy) < 10) return;
      s.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    }
    if (s.axis === "y") {
      const d = Math.max(0, dy);
      setPanel(`translate3d(0, ${d.toFixed(1)}px, 0)`, Math.max(0.35, 1 - d / 500), false);
    } else if (canNavigate) {
      setPanel(`translate3d(${(dx * 0.6).toFixed(1)}px, 0, 0)`, Math.max(0.5, 1 - Math.abs(dx) / 600), false);
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const s = touch.current;
    touch.current = null;
    if (!s || !s.axis) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - s.x;
    const dy = t.clientY - s.y;
    const v = (s.axis === "y" ? dy : Math.abs(dx)) / Math.max(1, performance.now() - s.t);
    if (s.axis === "y" && (dy > SWIPE_Y || (dy > 30 && v > 0.5))) {
      setPanel("translate3d(0, 40vh, 0)", 0, true);
      window.setTimeout(onClose, 200);
      return;
    }
    if (s.axis === "x" && canNavigate && (Math.abs(dx) > SWIPE_X || (Math.abs(dx) > 25 && v > 0.5))) {
      go(dx < 0 ? 1 : -1);
      return;
    }
    setPanel("", 1, true);
  };

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
      onKeyDown={(e) => {
        // Arrow keys change the film, except while the video itself has focus (seeking).
        if (!canNavigate || (e.target as HTMLElement).tagName === "VIDEO") return;
        if (e.key === "ArrowRight") go(1);
        else if (e.key === "ArrowLeft") go(-1);
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={() => {
        touch.current = null;
        setPanel("", 1, true);
      }}
    >
      {film && (
        <Column
          ref={panelRef}
          className={styles.panel}
          data-portrait={portrait || undefined}
          gap="16"
          style={{ "--ar": film.ratio } as CSSProperties}
        >
          <Row className={styles.bar} horizontal="between" vertical="center" gap="16">
            <Column className={styles.meta} gap="2">
              <Text as="h2" id="film-lightbox-title" className={styles.title}>
                {film.title}
              </Text>
              <Text className={styles.kind}>
                {film.kind}
                {canNavigate && films && (
                  <span className={styles.count}>
                    {" · "}
                    {index + 1} / {films.length}
                  </span>
                )}
              </Text>
            </Column>
            <Row className={styles.actions} gap="8" vertical="center">
              {canNavigate && (
                <>
                  <button type="button" className={styles.close} onClick={() => go(-1)} aria-label="Vorheriger Film">
                    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                      <path d="M14.5 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button type="button" className={styles.close} onClick={() => go(1)} aria-label="Nächster Film">
                    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                      <path d="M9.5 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </>
              )}
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
            preload="auto"
          />
        </Column>
      )}
    </dialog>
  );
}
