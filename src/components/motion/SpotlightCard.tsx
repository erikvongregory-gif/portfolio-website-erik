"use client";

import { Column } from "@once-ui-system/core";
import { forwardRef, useRef, type ComponentProps, type MouseEvent } from "react";
import styles from "./motion.module.scss";

type SpotlightCardProps = ComponentProps<typeof Column> & {
  tilt?: boolean;
  glow?: boolean;
  tiltStrength?: number;
};

export const SpotlightCard = forwardRef<HTMLDivElement, SpotlightCardProps>(function SpotlightCard(
  { tilt = true, glow = true, tiltStrength = 6, className, children, ...rest },
  forwardedRef,
) {
  const innerRef = useRef<HTMLDivElement | null>(null);

  const setRefs = (node: HTMLDivElement | null) => {
    innerRef.current = node;
    if (typeof forwardedRef === "function") forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  };

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = innerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    if (tilt) {
      el.style.setProperty("--rx", `${(0.5 - py) * tiltStrength}deg`);
      el.style.setProperty("--ry", `${(px - 0.5) * tiltStrength}deg`);
    }
  };

  const onLeave = () => {
    const el = innerRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  const cls = [styles.spotlight, glow ? styles.spotlightGlow : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <Column ref={setRefs} className={cls} onMouseMove={onMove} onMouseLeave={onLeave} {...rest}>
      {children}
    </Column>
  );
});
