"use client";

import {
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
} from "react";
import styles from "./motion.module.scss";

type RevealProps = {
  children: ReactElement;
  delay?: number;
  y?: number;
  x?: number;
  scale?: number;
  /**
   * How deep into the viewport before reveal.
   * `late` (default) = Blink-style: wait until you're at the block.
   * `early` = as soon as it peeks in (legacy).
   */
  when?: "late" | "early";
};

/** Blink-like: bottom 36% of the viewport doesn't count — reveal when you're there. */
const IO_LATE: IntersectionObserverInit = {
  threshold: [0, 0.12, 0.25],
  rootMargin: "0px 0px -36% 0px",
};

const IO_EARLY: IntersectionObserverInit = {
  threshold: 0.12,
  rootMargin: "0px 0px -8% 0px",
};

export function Reveal({
  children,
  delay = 0,
  y = 28,
  x = 0,
  scale = 1,
  when = "late",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      setShown(true);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        // Require a real hit inside the tightened root (not a 1px peek).
        if (e.isIntersecting && e.intersectionRatio > 0) {
          setShown(true);
          io.disconnect();
          break;
        }
      }
    }, when === "early" ? IO_EARLY : IO_LATE);

    io.observe(el);
    return () => io.disconnect();
  }, [when]);

  if (!isValidElement(children)) return children;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const child = children as ReactElement<any>;
  const prevClass = child.props.className ? `${child.props.className} ` : "";

  return cloneElement(child, {
    ref,
    className: `${prevClass}${styles.reveal}${shown ? ` ${styles.revealIn}` : ""}`,
    style: {
      ...(child.props.style || {}),
      transitionDelay: shown ? `${delay}s` : "0s",
      ["--reveal-y" as string]: `${y}px`,
      ["--reveal-x" as string]: `${x}px`,
      ["--reveal-scale" as string]: `${scale}`,
    } as CSSProperties,
  });
}
