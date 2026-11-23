import type { CSSProperties } from "react";
import styles from "./Blueprint.module.scss";

const col = (left: string): CSSProperties => ({ left });
const row = (top: string): CSSProperties => ({ top });
const cross = (left: string, top: string): CSSProperties => ({ left, top });

/**
 * Technical-drawing layer behind the page sections: guide lines, register
 * crosses, a construction circle (r 300 → "Ø 600"), a wireframe cube, a
 * dimension chain whose segments keep the ratio 420 : 756, an exploded view
 * and a small circle. Purely decorative.
 */
export function Blueprint() {
  const L = "calc(50% - 36.75rem)";
  const R = "calc(50% + 36.75rem)";
  return (
    <span className={styles.bp} aria-hidden="true">
      <span className={styles.v} style={col(L)} />
      <span className={styles.v} style={col("50%")} />
      <span className={styles.v} style={col(R)} />
      <span className={styles.h} style={row("15%")} />
      <span className={styles.h} style={row("42%")} />
      <span className={styles.h} style={row("64%")} />
      <span className={styles.h} style={row("87%")} />
      <span className={styles.x} style={cross(L, "15%")} />
      <span className={styles.x} style={cross(R, "42%")} />
      <span className={styles.x} style={cross("50%", "64%")} />
      <span className={styles.x} style={cross(L, "87%")} />

      {/* Construction circle: radius 300, so the diameter label reads Ø 600. */}
      <svg
        className={`${styles.el} ${styles.spin}`}
        style={{ top: "4%", right: "-17.5rem", width: "47.5rem" }}
        viewBox="0 0 760 760"
      >
        <g fill="none" stroke="currentColor">
          <circle cx="380" cy="380" r="300" />
          <circle cx="380" cy="380" r="200" strokeDasharray="2 6" />
          <circle cx="380" cy="380" r="330" strokeWidth="10" strokeDasharray="1 27.8" opacity=".6" />
          <path d="M40 380 H720 M380 40 V720" strokeDasharray="6 6" />
          <path d="M168 168 L592 592 M592 168 L168 592" strokeDasharray="1 7" opacity=".7" />
          <circle cx="380" cy="380" r="4" fill="currentColor" />
          <circle cx="580" cy="380" r="3" />
        </g>
        <text x="392" y="370" fill="currentColor" fontSize="13" className={styles.label}>
          Ø 600
        </text>
      </svg>

      {/* Wireframe cube */}
      <svg className={styles.el} style={{ top: "24%", left: "-12.5rem", width: "35rem" }} viewBox="0 0 560 560">
        <g fill="none" stroke="currentColor" strokeLinejoin="round">
          <path d="M280 60 L480 175 L480 405 L280 520 L80 405 L80 175 Z" />
          <path d="M80 175 L280 290 L480 175 M280 290 V520" />
          <path d="M280 60 V290 M80 405 L280 290 L480 405" strokeDasharray="4 6" opacity=".6" />
          <circle cx="280" cy="290" r="3" fill="currentColor" />
        </g>
      </svg>

      {/* Dimension chain across a section boundary: segments in the ratio 420 : 756. */}
      <span className={styles.dim} style={{ top: "46%" }}>
        <span style={{ flex: 420 }}>
          <em>420</em>
        </span>
        <span style={{ flex: 756 }}>
          <em>756</em>
        </span>
      </span>

      {/* Exploded view */}
      <svg className={styles.el} style={{ top: "66%", right: "-10rem", width: "33.75rem" }} viewBox="0 0 540 540">
        <g fill="none" stroke="currentColor" strokeLinejoin="round">
          <path d="M270 70 L470 185 L270 300 L70 185 Z" />
          <path d="M270 150 L470 265 L270 380 L70 265 Z" />
          <path d="M270 230 L470 345 L270 460 L70 345 Z" />
          <path d="M70 185 V196 L270 311 L470 196 V185 M70 345 V356 L270 471 L470 356 V345" opacity=".6" />
          <path d="M270 20 V520" strokeDasharray="1 7" />
          <circle cx="270" cy="70" r="3" fill="currentColor" />
        </g>
      </svg>

      {/* Small circle */}
      <svg
        className={`${styles.el} ${styles.spinBack}`}
        style={{ top: "88%", left: "-9.375rem", width: "27.5rem" }}
        viewBox="0 0 440 440"
      >
        <g fill="none" stroke="currentColor">
          <circle cx="220" cy="220" r="170" />
          <circle cx="220" cy="220" r="190" strokeWidth="8" strokeDasharray="1 18.9" opacity=".6" />
          <path d="M20 220 H420 M220 20 V420" strokeDasharray="6 6" />
          <circle cx="220" cy="220" r="60" strokeDasharray="2 5" />
        </g>
      </svg>
    </span>
  );
}
