import styles from "./LandingMotif.module.scss";

/** Tiny flat-vector accents — always soft / rounded, never sharp corners. */

export function MotifHills({ className }: { className?: string }) {
  return (
    <svg
      className={`${styles.motif} ${styles.hills} ${className ?? ""}`}
      viewBox="0 0 240 40"
      aria-hidden="true"
    >
      <path
        className={styles.hillsFar}
        fill="#C9D4E8"
        d="M18 34
           C28 22 42 14 58 18
           C74 10 92 12 108 18
           C126 8 148 10 166 18
           C184 12 204 16 222 26
           C226 30 224 34 216 35
           C170 38 70 38 24 35
           C18 34 16 34 18 34 Z"
      />
      <path
        className={styles.hillsNear}
        fill="#7A9B78"
        opacity="0.9"
        d="M14 35
           C20 28 48 24 84 26
           C120 22 160 28 196 26
           C220 28 226 32 224 35
           C190 39 50 39 16 36
           C14 35.5 13 35.2 14 35 Z"
      />
      <path
        className={styles.hillsLake}
        fill="#A8D4E6"
        d="M48 31
           C48 28 70 26 120 26
           C170 26 192 28 192 31
           C192 34 170 36 120 36
           C70 36 48 34 48 31 Z"
      />
    </svg>
  );
}

/** Animated flock — flapping wings + soft drift. */
export function MotifBirds({ className }: { className?: string }) {
  return (
    <span className={`${styles.flock} ${className ?? ""}`} aria-hidden="true">
      <svg className={`${styles.bird} ${styles.birdA}`} viewBox="0 0 28 16" fill="none" stroke="#16150F" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round">
        <path className={styles.wingL} d="M14 10 Q7 3 2 10" />
        <path className={styles.wingR} d="M14 10 Q21 3 26 10" />
      </svg>
      <svg className={`${styles.bird} ${styles.birdB}`} viewBox="0 0 28 16" fill="none" stroke="#16150F" strokeOpacity="0.32" strokeWidth="1.7" strokeLinecap="round">
        <path className={styles.wingL} d="M14 10 Q7 3 2 10" />
        <path className={styles.wingR} d="M14 10 Q21 3 26 10" />
      </svg>
      <svg className={`${styles.bird} ${styles.birdC}`} viewBox="0 0 28 16" fill="none" stroke="#16150F" strokeOpacity="0.26" strokeWidth="1.5" strokeLinecap="round">
        <path className={styles.wingL} d="M14 10 Q7 3 2 10" />
        <path className={styles.wingR} d="M14 10 Q21 3 26 10" />
      </svg>
    </span>
  );
}

export function MotifCheck({ className }: { className?: string }) {
  return (
    <span className={`${styles.check} ${className ?? ""}`} aria-hidden="true">
      <svg viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="10" fill="#4A7C59" />
        <path
          d="M5.5 10.2 L8.4 13 L14.5 7"
          stroke="#FDFBF6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function MotifStep({ n }: { n: string }) {
  return (
    <span className={styles.stepBadge} aria-hidden="true">
      {n}
    </span>
  );
}

export function MotifDivider() {
  return (
    <div className={styles.divider} aria-hidden="true">
      <MotifHills />
    </div>
  );
}
