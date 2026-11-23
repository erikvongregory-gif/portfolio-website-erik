"use client";

import { useEffect, useState } from "react";
import { Column, IconButton, Row, SmartLink, Switch, Text } from "@once-ui-system/core/components";
import classNames from "classnames";
import styles from "./CookieBanner.module.scss";
import {
  COOKIE_CONSENT_UPDATED_EVENT,
  COOKIE_STORAGE_KEY,
} from "@/lib/cookieConsent";

export { COOKIE_STORAGE_KEY } from "@/lib/cookieConsent";
export const COOKIE_SETTINGS_EVENT = "evglab:open-cookie-settings";

type Consent = {
  necessary: true;
  statistics: boolean;
  marketing: boolean;
};

const DEFAULT_CONSENT: Consent = { necessary: true, statistics: false, marketing: false };

type Category = {
  key: "necessary" | "statistics" | "marketing";
  title: string;
  description: string;
  locked?: boolean;
};

const categories: Category[] = [
  {
    key: "necessary",
    title: "Notwendig",
    description:
      "Technisch erforderlich, damit die Seite funktioniert und sich deine Auswahl merkt. Immer aktiv.",
    locked: true,
  },
  {
    key: "statistics",
    title: "Statistik",
    description:
      "Reichweitenmessung über Vercel Analytics und Google Analytics 4 – nur mit deiner Einwilligung. Hilft mir zu verstehen, welche Inhalte ankommen.",
  },
  {
    key: "marketing",
    title: "Marketing",
    description:
      "Meta Pixel für Anzeigenmessung und Conversion-Tracking – nur mit deiner Einwilligung.",
  },
];

export function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const [view, setView] = useState<"intro" | "settings">("intro");
  const [consent, setConsent] = useState<Consent>(DEFAULT_CONSENT);
  const [hasStored, setHasStored] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(COOKIE_STORAGE_KEY)) {
        const t = setTimeout(() => setOpen(true), 900);
        return () => clearTimeout(t);
      }
    } catch {
      /* localStorage nicht verfügbar – Banner einfach nicht zeigen */
    }
  }, []);

  useEffect(() => {
    const reopen = () => {
      try {
        const stored = localStorage.getItem(COOKIE_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as Partial<Consent>;
          setConsent({
            necessary: true,
            statistics: Boolean(parsed.statistics),
            marketing: Boolean(parsed.marketing),
          });
          setHasStored(true);
        }
      } catch {
        /* ignorieren */
      }
      setView("settings");
      setOpen(true);
    };
    window.addEventListener(COOKIE_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, reopen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(true);
      return;
    }
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, [open]);

  const persist = (value: Consent) => {
    try {
      localStorage.setItem(
        COOKIE_STORAGE_KEY,
        JSON.stringify({ ...value, updatedAt: new Date().toISOString() }),
      );
    } catch {
      /* ignorieren */
    }
    setHasStored(true);
    window.dispatchEvent(new Event(COOKIE_CONSENT_UPDATED_EVENT));
    animateOut();
  };

  const animateOut = () => {
    setShown(false);
    setTimeout(() => {
      setOpen(false);
      setView("intro");
    }, 320);
  };

  const acceptAll = () => persist({ necessary: true, statistics: true, marketing: true });
  const rejectAll = () => persist({ necessary: true, statistics: false, marketing: false });
  const saveSelection = () => persist(consent);

  // X: schon entschieden -> nur schließen; Erstbesuch -> als Ablehnung werten.
  const handleClose = () => (hasStored ? animateOut() : rejectAll());

  const toggle = (key: "statistics" | "marketing") =>
    setConsent((prev) => ({ ...prev, [key]: !prev[key] }));

  if (!open) return null;

  return (
    <Row
      data-theme="dark"
      position="fixed"
      bottom="16"
      left="16"
      zIndex={4}
      pointerEvents="none"
      className={styles.wrap}
    >
      <Column
        fillWidth
        padding="20"
        gap="16"
        pointerEvents="auto"
        role="dialog"
        aria-labelledby="cookie-title"
        className={classNames(styles.panel, shown && styles.shown)}
      >
        <Row fillWidth gap="12" vertical="center" horizontal="between">
          <Row gap="12" vertical="center">
            <span className={styles.dot} aria-hidden="true" />
            <Text as="h2" id="cookie-title" className={styles.title}>
              {view === "intro" ? "Kalorienfreie Kekse" : "Cookie-Einstellungen"}
            </Text>
          </Row>
          <IconButton
            icon="close"
            variant="tertiary"
            size="s"
            onClick={handleClose}
            tooltip="Schließen"
            aria-label="Cookie-Hinweis schließen"
          />
        </Row>

        {view === "intro" ? (
          <>
            <Text as="p" className={styles.text}>
              Technisch notwendige Cookies sind immer dabei. Statistik und Marketing laden wir nur,
              wenn du zustimmst. Du entscheidest selbst, was auf den Teller kommt. Mehr im{" "}
              <SmartLink href="/datenschutz" unstyled className={styles.inline}>
                Datenschutz
              </SmartLink>
              .
            </Text>

            {/* Accept and reject carry the same weight on purpose (TTDSG/DSGVO). */}
            <Row fillWidth gap="8">
              <button type="button" className={styles.choice} onClick={rejectAll}>
                Nur Notwendige
              </button>
              <button type="button" className={styles.choice} onClick={acceptAll}>
                Alle akzeptieren
              </button>
            </Row>
            <button type="button" className={styles.settings} onClick={() => setView("settings")}>
              Einstellungen anpassen
            </button>
          </>
        ) : (
          <>
            <Text as="p" className={styles.text}>
              Stell dir deinen Keksteller selbst zusammen. Notwendige Cookies bleiben drin, der Rest
              ist deine Wahl.
            </Text>

            <Column fillWidth className={styles.list}>
              {categories.map((cat) => (
                <Row
                  key={cat.key}
                  fillWidth
                  gap="16"
                  vertical="center"
                  horizontal="between"
                  className={styles.item}
                >
                  <Column gap="2" style={{ flex: 1, minWidth: 0 }}>
                    <Text className={styles.itemTitle}>{cat.title}</Text>
                    <Text className={styles.itemText}>{cat.description}</Text>
                  </Column>
                  <Switch
                    isChecked={cat.locked ? true : consent[cat.key]}
                    disabled={cat.locked}
                    onToggle={() => !cat.locked && toggle(cat.key as "statistics" | "marketing")}
                    ariaLabel={`${cat.title} ${cat.locked ? "(immer aktiv)" : "umschalten"}`}
                  />
                </Row>
              ))}
            </Column>

            <Row fillWidth gap="8">
              <button type="button" className={styles.choice} onClick={() => setView("intro")}>
                Zurück
              </button>
              <button type="button" className={styles.choice} onClick={saveSelection}>
                Auswahl speichern
              </button>
            </Row>
          </>
        )}
      </Column>
    </Row>
  );
}
