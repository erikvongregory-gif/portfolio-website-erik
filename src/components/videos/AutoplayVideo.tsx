"use client";

import { useEffect, useRef, type CSSProperties } from "react";

type AutoplayVideoProps = {
  src: string;
  poster: string;
  className?: string;
  style?: CSSProperties;
};

/**
 * Muted loop that only loads and plays while it is on screen.
 * With reduced motion it stays on the poster.
 */
export function AutoplayVideo({ src, poster, className, style }: AutoplayVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!video.src) video.src = src;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      className={className}
      style={style}
    />
  );
}
