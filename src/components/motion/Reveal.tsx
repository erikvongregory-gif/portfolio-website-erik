"use client";

import { cloneElement, isValidElement, useEffect, useRef, useState, type ReactElement } from "react";
import styles from "./motion.module.scss";

type RevealProps = {
  children: ReactElement;
  delay?: number;
  y?: number;
  x?: number;
  scale?: number;
};

export function Reveal({ children, delay = 0, y = 24, x = 0, scale = 1 }: RevealProps) {
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
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!isValidElement(children)) return children;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const child = children as ReactElement<any>;
  const prevClass = child.props.className ? `${child.props.className} ` : "";

  return cloneElement(child, {
    ref,
    className: `${prevClass}${styles.reveal}${shown ? ` ${styles.revealIn}` : ""}`,
    style: {
      ...(child.props.style || {}),
      transitionDelay: `${delay}s`,
      ["--reveal-y" as string]: `${y}px`,
      ["--reveal-x" as string]: `${x}px`,
      ["--reveal-scale" as string]: `${scale}`,
    } as React.CSSProperties,
  });
}
