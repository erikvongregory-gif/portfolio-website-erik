"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import styles from "./motion.module.scss";

type MagneticProps = {
  children: ReactNode;
  strength?: number;
};

export function Magnetic({ children, strength = 0.35 }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);

  const onMove = (e: MouseEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate(0px, 0px)";
  };

  return (
    <span ref={ref} className={styles.magnetic} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </span>
  );
}
