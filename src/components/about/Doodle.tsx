import classNames from "classnames";
import type { CSSProperties } from "react";
import styles from "./Doodle.module.scss";

/** Hand-drawn strokes, all thin, all drawn in with the pen when visible. */
const PATHS = {
  // Curly arrow pointing right/down.
  curl: {
    box: "0 0 120 80",
    d: [
      "M6 14 C 30 4, 58 6, 66 24 C 74 42, 50 52, 44 40 C 38 28, 62 22, 80 34 C 96 45, 104 58, 108 70",
      "M96 66 L 108 71 L 111 58",
    ],
  },
  // Long loose arrow pointing left.
  left: {
    box: "0 0 140 60",
    d: ["M134 40 C 104 52, 70 50, 46 36 C 32 28, 22 22, 10 18", "M22 8 L 9 18 L 23 27"],
  },
  // Arrow pointing up-right.
  up: {
    box: "0 0 90 90",
    d: ["M8 84 C 14 60, 30 40, 52 28 C 62 22, 72 16, 80 10", "M64 8 L 81 9 L 76 25"],
  },
  underline: {
    box: "0 0 300 24",
    d: ["M4 15 C 60 8, 120 6, 180 9 C 220 11, 260 14, 296 10", "M30 20 C 90 15, 170 15, 250 18"],
  },
  circle: {
    // Drawn in the card's own proportions (about 3.4 : 1) so it barely stretches.
    box: "0 0 340 100",
    d: ["M196 9 C 104 3, 14 18, 9 49 C 5 80, 104 96, 204 91 C 294 86, 335 68, 331 44 C 327 18, 262 5, 150 13"],
  },
  check: {
    box: "0 0 32 32",
    d: ["M5 17 C 8 19, 11 23, 13 27 C 17 18, 22 10, 29 4"],
  },
  strike: {
    box: "0 0 200 20",
    d: ["M3 12 C 50 7, 110 13, 150 9 C 170 7, 186 10, 197 8"],
  },
  star: {
    box: "0 0 40 40",
    d: ["M20 3 L 24 15 L 37 16 L 27 24 L 31 37 L 20 29 L 9 37 L 13 24 L 3 16 L 16 15 Z"],
  },
  bolt: {
    box: "0 0 40 40",
    d: ["M24 3 L 8 23 L 20 22 L 15 37 L 33 15 L 21 16 Z"],
  },
  person: {
    box: "0 0 40 40",
    d: ["M20 6 C 26 6, 27 16, 20 17 C 13 17, 14 6, 20 6", "M7 36 C 8 26, 14 21, 20 21 C 27 21, 32 26, 33 36"],
  },
  pin: {
    box: "0 0 40 40",
    d: ["M20 37 C 12 26, 8 20, 8 15 C 8 8, 14 3, 20 3 C 27 3, 32 8, 32 15 C 32 20, 28 26, 20 37", "M20 11 C 23 11, 24 16, 20 17 C 16 17, 17 11, 20 11"],
  },
} as const;

export type DoodleKind = keyof typeof PATHS;

type Props = {
  kind: DoodleKind;
  className?: string;
  style?: CSSProperties;
  /** Stroke width in px. */
  weight?: number;
  /** Delay before the pen starts, in seconds. */
  delay?: number;
};

export function Doodle({ kind, className, style, weight = 1.6, delay = 0 }: Props) {
  const p = PATHS[kind];
  return (
    <svg
      className={classNames(styles.doodle, className)}
      viewBox={p.box}
      // The ring wraps elements of any width: stretch it to its box
      // (the stroke stays even thanks to non-scaling-stroke).
      preserveAspectRatio={kind === "circle" ? "none" : undefined}
      fill="none"
      aria-hidden="true"
      focusable="false"
      style={{ ...style, "--delay": `${delay}s` } as CSSProperties}
    >
      {p.d.map((d, i) => (
        <path
          key={d}
          d={d}
          pathLength={1}
          stroke="currentColor"
          strokeWidth={weight}
          strokeLinecap="round"
          strokeLinejoin="round"
          // Stretched rings must scale their stroke too, otherwise Chrome measures
          // the dash in screen pixels and the pen stops before the end.
          vectorEffect={kind === "circle" ? undefined : "non-scaling-stroke"}
          className={styles.path}
          style={{ animationDelay: `calc(var(--delay) + ${i * 0.35}s)` }}
        />
      ))}
    </svg>
  );
}
