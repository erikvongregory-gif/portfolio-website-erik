"use client";

import { useState } from "react";
import { Button, Column, Text } from "@once-ui-system/core";

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

export function NotFoundSearch() {
  const [tries, setTries] = useState(0);
  const done = tries >= SPOTS.length;

  return (
    <Column gap="12" horizontal="center">
      <Button
        variant="tertiary"
        size="m"
        prefixIcon="search"
        disabled={done}
        onClick={() => setTries((n) => n + 1)}
      >
        {tries === 0 ? "Trotzdem suchen" : done ? "Suche eingestellt" : "Weitersuchen"}
      </Button>
      <Text
        variant="body-default-s"
        onBackground="neutral-weak"
        align="center"
        aria-live="polite"
        style={{ minHeight: "1.5em" }}
      >
        {tries > 0 ? SPOTS[tries - 1] : " "}
      </Text>
    </Column>
  );
}
