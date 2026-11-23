"use client";

import { Column, Text } from "@once-ui-system/core";
import { useState } from "react";
import styles from "./NotFound.module.scss";

const SPOTS = [
  "Unterm Sofa nachgesehen: zwei Gummibärchen, keine Seite.",
  "Am Lech gesucht: drei Enten, ein Stand-Up-Paddler, keine Seite.",
  "Im Template-Ordner gesucht: 4.000 Vorlagen, alle gleich, keine davon sie.",
  "Den Praktikanten gefragt: Es gibt keinen Praktikanten.",
  "Strg + Z gedrückt. Mehrfach. Mit Nachdruck.",
  "Im Papierkorb gesucht: nur alte Logos mit Verlauf und Schlagschatten.",
  "Google gefragt. Google hat zurückgefragt.",
  "Ok, letzter Versuch: Sie ist wirklich weg. Aber die Startseite ist super.",
];

/** The playful "keep searching" button of the 404 page, in the studio look. */
export function StudioNotFoundSearch() {
  const [tries, setTries] = useState(0);
  const done = tries >= SPOTS.length;

  return (
    <Column gap="12" horizontal="center">
      <button
        type="button"
        className={styles.search}
        disabled={done}
        onClick={() => setTries((n) => n + 1)}
      >
        {tries === 0 ? "Trotzdem suchen" : done ? "Suche eingestellt" : "Weitersuchen"}
      </button>
      <Text as="p" className={styles.spot} aria-live="polite">
        {tries > 0 ? SPOTS[tries - 1] : " "}
      </Text>
    </Column>
  );
}
