"use client";

import { useEffect, useState } from "react";
import { subscribeScroll } from "@/components/motion/SmoothScroll";
import styles from "./FollowBirds.module.scss";

const MOBILE_MQ = "(max-width: 1024px)";
const MARKER_ID = "warum-follow-start";

function Bird({ size, opacity }: { size: number; opacity: number }) {
  return (
    <svg
      className={styles.bird}
      width={size}
      height={size * (16 / 28)}
      viewBox="0 0 28 16"
      fill="none"
      stroke="#16150F"
      strokeOpacity={opacity}
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path className={styles.wingL} d="M14 10 Q7 3 2 10" />
      <path className={styles.wingR} d="M14 10 Q21 3 26 10" />
    </svg>
  );
}

/**
 * Mobile flock that follows after scrolling past #warum.
 * Uses a dedicated DOM marker so it does not depend on Once UI id forwarding.
 */
export function FollowBirds() {
  const [mobile, setMobile] = useState(false);
  const [visible, setVisible] = useState(false);
  const [drift, setDrift] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);

    const syncMobile = () => setMobile(mq.matches);
    syncMobile();
    mq.addEventListener("change", syncMobile);

    const sync = () => {
      if (!mq.matches) {
        setVisible(false);
        return;
      }

      const marker =
        document.getElementById(MARKER_ID) ?? document.getElementById("warum");
      if (!marker) return;

      const top = marker.getBoundingClientRect().top;
      // Marker (end of “Warum”) has scrolled above the viewport
      const past = top < 24;
      setVisible(past);

      if (!past) {
        setDrift(0);
        return;
      }
      setDrift(Math.sin((-top) / 220) * 26);
    };

    sync();
    const unsub = subscribeScroll(sync);
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync, { passive: true });
    // Capture scroll on document too (Lenis / nested cases)
    document.addEventListener("scroll", sync, true);

    return () => {
      unsub();
      mq.removeEventListener("change", syncMobile);
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      document.removeEventListener("scroll", sync, true);
    };
  }, []);

  if (!mobile) return null;

  return (
    <div
      className={`${styles.root} ${visible ? styles.visible : ""}`}
      style={{ ["--follow-x" as string]: `${drift}px` }}
      aria-hidden="true"
    >
      <Bird size={30} opacity={0.55} />
      <Bird size={23} opacity={0.42} />
      <Bird size={18} opacity={0.34} />
    </div>
  );
}

export const FOLLOW_BIRDS_MARKER_ID = MARKER_ID;
