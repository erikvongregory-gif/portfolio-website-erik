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

type NetworkInfo = { saveData?: boolean; effectiveType?: string };

/** Data saver on, or a 2G-class connection: show the poster only. */
function isLowData() {
  const c = (navigator as Navigator & { connection?: NetworkInfo }).connection;
  return Boolean(c?.saveData) || /(^|-)2g$/.test(c?.effectiveType ?? "");
}

/**
 * Silent preview loop that only runs while it is on screen. The video source
 * is attached the first time it should play, so films that are never seen
 * cost no bytes (only the small poster). Shows the poster alone for
 * prefers-reduced-motion and for data saver / 2G connections.
 */
export function LoopVideo({ id, active, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [posterOnly, setPosterOnly] = useState(false);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    setPosterOnly(window.matchMedia("(prefers-reduced-motion: reduce)").matches || isLowData());
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const shouldPlay = !posterOnly && inView && active !== false;

  useEffect(() => {
    if (shouldPlay) setArmed(true);
  }, [shouldPlay]);

  useEffect(() => {
    const v = ref.current;
    if (!v || !armed) return;
    if (shouldPlay) v.play().catch(() => {});
    else v.pause();
  }, [shouldPlay, armed]);

  return (
    <video
      ref={ref}
      className={classNames(styles.video, className)}
      src={armed ? `/videos/${id}-preview.mp4` : undefined}
      poster={`/videos/${id}.webp`}
      muted
      loop
      playsInline
      disablePictureInPicture
      preload="none"
      aria-hidden="true"
    />
  );
}
