"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ProjectPreview.module.scss";

type ProjectPreviewProps = {
  image: string;
  /** Scroll-Video der Live-Seite: spielt beim Hover über die Karte ab. */
  video?: string;
  alt: string;
  blur?: boolean;
};

export function ProjectPreview({ image, video, alt, blur }: ProjectPreviewProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!video) return;
    // Hover-Ziel ist die ganze Projektkarte, nicht nur der Bildbereich.
    const card = wrapRef.current?.closest("[data-project-card]") ?? wrapRef.current;
    if (!card) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const enter = () => {
      if (reducedMotion.matches) return;
      setActive(true);
      const v = videoRef.current;
      if (v) {
        v.currentTime = 0;
        v.play().catch(() => {});
      }
    };
    const leave = () => {
      setActive(false);
      videoRef.current?.pause();
    };

    card.addEventListener("mouseenter", enter);
    card.addEventListener("mouseleave", leave);
    return () => {
      card.removeEventListener("mouseenter", enter);
      card.removeEventListener("mouseleave", leave);
    };
  }, [video]);

  return (
    <div ref={wrapRef} className={styles.wrap}>
      <img
        className={[styles.image, blur ? styles.blur : ""].filter(Boolean).join(" ")}
        src={image}
        alt={alt}
        loading="lazy"
      />
      {video && (
        <video
          ref={videoRef}
          className={[styles.video, active ? styles.videoActive : ""].filter(Boolean).join(" ")}
          src={video}
          muted
          playsInline
          loop
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
        />
      )}
    </div>
  );
}
