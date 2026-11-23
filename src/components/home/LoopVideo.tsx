"use client";

import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import styles from "./LoopVideo.module.scss";

type Props = {
  /** Showreel id: plays /videos/<id>-preview.mp4 with the .webp poster. */
  id: string;
  /** Plays only while true (and in view). Leave undefined to play whenever in view. */
  active?: boolean;
  className?: string;
};

/**
 * Silent preview loop that only runs while it is on screen. Shows the poster
 * alone for prefers-reduced-motion.
 */
export function LoopVideo({ id, active, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const shouldPlay = !reduced && inView && active !== false;

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (shouldPlay) v.play().catch(() => {});
    else v.pause();
  }, [shouldPlay]);

  return (
    <video
      ref={ref}
      className={classNames(styles.video, className)}
      src={`/videos/${id}-preview.mp4`}
      poster={`/videos/${id}.webp`}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
    />
  );
}
