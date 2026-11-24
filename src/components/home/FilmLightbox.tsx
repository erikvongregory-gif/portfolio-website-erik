"use client";

import { IconButton, Row, Text } from "@once-ui-system/core/components";
import { useEffect, useRef, type CSSProperties, type TouchEvent } from "react";
import { startLenis, stopLenis } from "@/components/motion/SmoothScroll";
import type { ShowreelItem } from "@/lib/showreel";
import styles from "./FilmLightbox.module.scss";

type Props = {
  film: ShowreelItem | null;
  onClose: () => void;
};

/** Pull distance (px) after which a downward swipe closes the film. */
const SWIPE_CLOSE = 110;

/**
 * Full film with sound in a native modal dialog (Esc, backdrop and the close
 * button close it). On phones it fills the screen inside the safe area, locks
 * the page behind it and closes with a downward swipe.
 */
export function FilmLightbox({ film, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const figureRef = useRef<HTMLElement>(null);
  const drag = useRef<{ x: number; y: number; dy: number; state: "idle" | "pull" | "off" } | null>(null);
  const open = Boolean(film);

  useEffect(() => {
    const d = ref.current;
    if (!d || !open) return;
    if (!d.open) d.showModal();
    stopLenis();
    // Lenis is off for reduced motion, so lock the page ourselves as well.
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
      if (d.open) d.close();
      startLenis();
    };
  }, [open]);

  const setPull = (dy: number, animate: boolean) => {
    const f = figureRef.current;
    if (!f) return;
    f.style.transition = animate ? "transform 0.3s ease, opacity 0.3s ease" : "none";
    f.style.transform = dy ? `translate3d(0, ${dy}px, 0)` : "";
    f.style.opacity = dy ? String(Math.max(0.35, 1 - dy / 500)) : "";
  };

  const onTouchStart = (e: TouchEvent) => {
    if (e.touches.length !== 1) return;
    drag.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, dy: 0, state: "idle" };
  };

  const onTouchMove = (e: TouchEvent) => {
    const g = drag.current;
    if (!g || g.state === "off") return;
    const dx = e.touches[0].clientX - g.x;
    const dy = e.touches[0].clientY - g.y;
    if (g.state === "idle") {
      // Horizontal moves belong to the video scrubber; only a clear pull down closes.
      if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) g.state = "off";
      else if (dy > 12 && dy > Math.abs(dx) * 1.4) g.state = "pull";
      if (g.state !== "pull") return;
    }
    g.dy = Math.max(0, dy);
    setPull(g.dy, false);
  };

  const onTouchEnd = () => {
    const g = drag.current;
    drag.current = null;
    if (!g || g.state !== "pull") return;
    if (g.dy > SWIPE_CLOSE) {
      setPull(0, false);
      onClose();
    } else setPull(0, true);
  };

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-label={film ? `${film.title}, ${film.kind}` : "Film"}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
    >
      {film && (
        <figure
          ref={figureRef}
          className={styles.figure}
          onClick={(e) => {
            // On phones the figure fills the screen: a tap on its empty area acts as the backdrop.
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <video
            className={styles.video}
            style={{ aspectRatio: film.ratio, "--ratio": film.ratio } as CSSProperties}
            src={`/videos/${film.id}.mp4`}
            poster={`/videos/${film.id}.webp`}
            controls
            autoPlay
            playsInline
            preload="metadata"
          />
          <Row
            as="figcaption"
            horizontal="between"
            vertical="center"
            gap="16"
            paddingTop="12"
            className={styles.bar}
          >
            <Text className={styles.caption}>
              {film.title} <span className={styles.kind}>{film.kind}</span>
            </Text>
            <IconButton
              icon="close"
              variant="tertiary"
              size="l"
              onClick={onClose}
              aria-label="Film schließen"
              className={styles.close}
            />
          </Row>
          <span className={styles.hint} aria-hidden="true" />
        </figure>
      )}
    </dialog>
  );
}
