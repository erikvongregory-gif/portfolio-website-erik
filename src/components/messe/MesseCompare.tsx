import { Column, Grid, Text } from "@once-ui-system/core";
import styles from "./MesseCompare.module.scss";

const WITH = [
  "Gemacht für die Messehalle",
  "Ein fester Ansprechpartner",
  "Storyboard mit Stopp-Effekt",
  "Jedes Format für Ihren Stand",
  "Festpreis ohne Überraschungen",
];

const WITHOUT = [
  "Erklärfilme fürs Datenblatt",
  "Wechselnde Zuständigkeiten",
  "Lange Intros, die keiner sieht",
  "Ein Format für alles",
  "Kosten, die nachträglich steigen",
];

/** EvGlab versus a classic 3D studio, two columns with a quiet "VS" between. */
export function MesseCompare() {
  return (
    <Grid columns="2" s={{ columns: "1" }} gap="16" fillWidth className={styles.table}>
      <Column className={`${styles.col} ${styles.with}`} gap="24">
        {/* biome-ignore lint/performance/noImgElement: decorative halftone texture */}
        <img className={styles.bg} src="/3d-produktanimation/images/compare-bg.png" alt="" loading="lazy" />
        <Text as="h3" className={styles.label}>
          Mit EvGlab
        </Text>
        <Column as="ul" gap="16" className={styles.list}>
          {WITH.map((item) => (
            <li key={item}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M8.5 12.2l2.3 2.3 4.7-4.9" />
              </svg>
              {item}
            </li>
          ))}
        </Column>
      </Column>

      <Column className={`${styles.col} ${styles.without}`} gap="24">
        <Text as="h3" className={styles.label}>
          Klassisches 3D-Studio
        </Text>
        <Column as="ul" gap="16" className={styles.list}>
          {WITHOUT.map((item) => (
            <li key={item}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M9.3 9.3l5.4 5.4M14.7 9.3l-5.4 5.4" />
              </svg>
              {item}
            </li>
          ))}
        </Column>
      </Column>
      <span className={styles.vs} aria-hidden="true">
        VS
      </span>
    </Grid>
  );
}
