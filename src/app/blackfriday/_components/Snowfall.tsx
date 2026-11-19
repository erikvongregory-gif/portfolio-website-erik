import type { CSSProperties } from "react";
import styles from "./blackfriday.module.scss";

/** Deterministische Pseudo-Zufallszahl, damit Server und Client gleich rendern. */
function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

const FLAKES = Array.from({ length: 46 }, (_, i) => ({
  left: rand(i + 1) * 100,
  size: 2 + rand(i + 101) * 5,
  duration: 9 + rand(i + 201) * 12,
  delay: -rand(i + 301) * 20,
  drift: (rand(i + 401) - 0.5) * 80,
  opacity: 0.35 + rand(i + 501) * 0.55,
}));

/** Reiner CSS-Schneefall. Wird bei reduzierter Bewegung ausgeblendet. */
export function Snowfall() {
  return (
    <span className={styles.snow} aria-hidden="true">
      {FLAKES.map((f, i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: statische Liste
          key={i}
          className={styles.flake}
          style={
            {
              left: `${f.left.toFixed(3)}%`,
              width: `${f.size.toFixed(2)}px`,
              height: `${f.size.toFixed(2)}px`,
              opacity: f.opacity.toFixed(2),
              animationDuration: `${f.duration.toFixed(2)}s`,
              animationDelay: `${f.delay.toFixed(2)}s`,
              "--drift": `${f.drift.toFixed(1)}px`,
            } as CSSProperties
          }
        />
      ))}
    </span>
  );
}

const BULBS = 22;

/** Lichterkette als SVG: Kabel plus blinkende Birnen in Rot, Gold, Grün. */
export function StringLights() {
  const tones = [styles.bulbRed, styles.bulbGold, styles.bulbGreen];
  return (
    <svg
      className={styles.lights}
      viewBox="0 0 1000 60"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        className={styles.wire}
        d="M0 8 Q 25 30 50 12 T 100 12 T 150 12 T 200 12 T 250 12 T 300 12 T 350 12 T 400 12 T 450 12 T 500 12 T 550 12 T 600 12 T 650 12 T 700 12 T 750 12 T 800 12 T 850 12 T 900 12 T 950 12 T 1000 8"
        fill="none"
      />
      {Array.from({ length: BULBS }, (_, i) => {
        const x = 22 + i * (956 / (BULBS - 1));
        const y = 22 + Math.sin(i * 1.7) * 4;
        return (
          <g
            // biome-ignore lint/suspicious/noArrayIndexKey: statische Liste
            key={i}
            className={tones[i % 3]}
            style={{ animationDelay: `${(i % 5) * 0.37}s` } as CSSProperties}
          >
            <rect x={x - 2.5} y={y - 6} width="5" height="5" rx="1" className={styles.socket} />
            <ellipse cx={x} cy={y + 6} rx="5" ry="8" className={styles.bulb} />
          </g>
        );
      })}
    </svg>
  );
}
