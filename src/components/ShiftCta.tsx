"use client";

import type { MouseEventHandler, ReactNode } from "react";
import classNames from "classnames";
import styles from "./ShiftCta.module.scss";

type ShiftCtaProps = {
  children: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  fillWidth?: boolean;
  /** Compact header size (same motion, smaller chrome). */
  compact?: boolean;
  /** Flat single fill instead of the hero gradient. */
  tone?: "gradient" | "solid";
  /** Optional mark after the label (e.g. brand icon). Stays outside the text swap. */
  suffix?: ReactNode;
  className?: string;
  "aria-label"?: string;
};

export function ShiftCta({
  children,
  onClick,
  fillWidth,
  compact = false,
  tone = "gradient",
  suffix,
  className,
  "aria-label": ariaLabel,
}: ShiftCtaProps) {
  return (
    <button
      type="button"
      className={classNames(
        styles.root,
        fillWidth && styles.fill,
        compact && styles.compact,
        tone === "solid" && styles.solid,
        className,
      )}
      data-open-contact=""
      aria-label={ariaLabel}
      onClick={onClick}
    >
      <span className={styles.bg} aria-hidden="true" />
      <span className={styles.content}>
        <span className={styles.arrowClip} aria-hidden="true">
          <span className={styles.arrowWell}>
            <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <g
                stroke="currentColor"
                strokeLinecap="square"
                strokeLinejoin="round"
                strokeWidth="1.7"
              >
                <path d="M5.2 14h16M15.4 20.2 21.9 14l-6.5-6.2" />
              </g>
            </svg>
          </span>
        </span>
        <span className={styles.text}>
          <span className={styles.idle}>{children}</span>
          <span className={styles.swap} aria-hidden="true">
            {children}
          </span>
        </span>
        {suffix ? (
          <span className={styles.suffix} aria-hidden>
            {suffix}
          </span>
        ) : null}
      </span>
    </button>
  );
}
