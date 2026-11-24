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

type Player = (on: boolean) => void;

/*
 * Touch screens have no hover, so previews play on their own while in view.
 * Only ONE preview plays at a time: the card closest to the middle of the
 * screen. That keeps decoding and mobile data low (one 70–330 KB loop at a
 * time instead of every card in view).
 */
const inView = new Set<HTMLElement>();
const players = new Map<HTMLElement, Player>();
let current: HTMLElement | null = null;
let frame = 0;
let settle = 0;

function pick() {
  frame = 0;
  const mid = window.innerHeight / 2;
  let best: HTMLElement | null = null;
  let bestDist = Number.POSITIVE_INFINITY;
  for (const el of inView) {
    const r = el.getBoundingClientRect();
    const dist = Math.abs(r.top + r.height / 2 - mid);
    if (dist < bestDist) {
      bestDist = dist;
      best = el;
    }
  }
  if (best === current) return;
  if (current) players.get(current)?.(false);
  current = best;
  // Start only once the card has settled in the middle: a quick fling through
  // the gallery loads no previews at all.
  window.clearTimeout(settle);
  if (best) {
    const el = best;
    settle = window.setTimeout(() => {
      if (current === el) players.get(el)?.(true);
    }, 280);
  }
}

function schedulePick() {
  if (!frame) frame = requestAnimationFrame(pick);
}

function onScroll() {
  if (inView.size) schedulePick();
}

let io: IntersectionObserver | null = null;
function observer() {
  if (!io) {
    io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) inView.add(el);
          else {
            inView.delete(el);
            if (el === current) {
              players.get(el)?.(false);
              current = null;
            }
          }
        }
        schedulePick();
      },
      // Only cards that reach the central band of the screen are candidates.
      { rootMargin: "-20% 0px -20% 0px" },
    );
    window.addEventListener("scroll", onScroll, { passive: true });
  }
  return io;
}

function release(el: HTMLElement) {
  io?.unobserve(el);
  inView.delete(el);
  players.delete(el);
  if (current === el) current = null;
  if (io && players.size === 0) {
    io.disconnect();
    io = null;
    window.removeEventListener("scroll", onScroll);
  }
}

/** Data saver or a slow connection: posters only, no autoplaying previews. */
function saveData() {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
    .connection;
  return !!c && (c.saveData === true || /(^|-)2g$/.test(c.effectiveType ?? ""));
}

/**
 * A film tile: poster first, the silent preview plays on hover (desktop) or
 * while it is the card in the middle of the screen (touch). Title and kind
 * sit quietly below.
 */
export function FilmCard({ film, ratio, className, onOpen }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLButtonElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    const touch = window.matchMedia("(hover: none)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!touch || reduced || !el || saveData()) return;
    players.set(el, (on) => {
      const v = videoRef.current;
      if (!v) return;
      if (on) v.play().catch(() => {});
      else v.pause();
      setPlaying(on);
    });
    observer().observe(el);
    return () => release(el);
  }, []);

  const canHover = () =>
    window.matchMedia("(hover: hover)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const start = () => {
    if (!canHover()) return;
    videoRef.current?.play().catch(() => {});
    setPlaying(true);
  };
  const stop = () => {
    if (!canHover()) return;
    videoRef.current?.pause();
    setPlaying(false);
  };

  const open = () => {
    // The full film plays in the lightbox now: stop the silent loop behind it.
    const el = cardRef.current;
    videoRef.current?.pause();
    setPlaying(false);
    if (el && current === el) current = null;
    onOpen?.(film);
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
        onFocus={() => (canHover() ? start() : schedulePick())}
        onBlur={stop}
        onClick={open}
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
          disableRemotePlayback
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
        />
        {/* Touch only: a quiet cue that a tap plays the full film with sound. */}
        <span className={styles.play} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="14" height="14">
            <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
          </svg>
        </span>
      </button>
      <Row className={styles.caption} horizontal="between" vertical="center" gap="12">
        <Text className={styles.title}>{film.title}</Text>
        <Text className={styles.kind}>{film.kind}</Text>
      </Row>
    </Column>
  );
}
