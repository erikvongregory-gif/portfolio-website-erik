"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Column,
  Flex,
  Icon,
  IconButton,
  Line,
  Row,
  SmartLink,
  Switch,
  Text,
} from "@once-ui-system/core";
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
      "Anonyme Reichweitenmessung über Vercel Analytics – nur mit deiner Einwilligung. Hilft mir zu verstehen, welche Inhalte ankommen.",
  },
  {
    key: "marketing",
    title: "Marketing",
    description:
      "Würde Inhalte und Anzeigen personalisieren. Aktuell nicht im Einsatz – nur für später vorbereitet.",
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
      position="fixed"
      bottom="16"
      left="16"
      zIndex={4}
      pointerEvents="none"
      style={{ maxWidth: "min(27rem, calc(100vw - 2rem))" }}
    >
      <Column
        fillWidth
        background="surface"
        border="neutral-alpha-medium"
        radius="l"
        padding="20"
        gap="16"
        pointerEvents="auto"
        style={{
          backdropFilter: "blur(14px) saturate(160%)",
          WebkitBackdropFilter: "blur(14px) saturate(160%)",
          transform: shown ? "translateY(0)" : "translateY(16px)",
          opacity: shown ? 1 : 0,
          transition: "transform 0.32s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.32s ease",
          boxShadow: "0 28px 60px -28px rgba(0,0,0,0.5)",
          maxHeight: "calc(100vh - 2rem)",
          overflowY: "auto",
        }}
      >
        <Row fillWidth gap="12" vertical="center" horizontal="between">
          <Row gap="12" vertical="center">
            <Flex
              horizontal="center"
              vertical="center"
              radius="m"
              background="brand-alpha-weak"
              style={{ width: "2.25rem", height: "2.25rem", flexShrink: 0 }}
            >
              <Icon name="cookie" size="m" onBackground="brand-strong" />
            </Flex>
            <Text
              variant="heading-strong-s"
              onBackground="neutral-strong"
              style={{ letterSpacing: "-0.01em" }}
            >
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
            <Text
              variant="body-default-s"
              onBackground="neutral-weak"
              style={{ lineHeight: 1.6 }}
            >
              Technisch notwendige Cookies sind immer dabei. Statistik-Tools laden wir nur, wenn du
              zustimmst – keine Werbung, kein schlechtes Gewissen. Du entscheidest selbst, was auf
              den Teller kommt. Mehr im{" "}
              <SmartLink href="/datenschutz">Datenschutz</SmartLink>.
            </Text>

            <Column fillWidth gap="8">
              <Button variant="primary" size="s" fillWidth onClick={acceptAll}>
                Alle akzeptieren
              </Button>
              <Row fillWidth gap="8">
                <Button
                  variant="secondary"
                  size="s"
                  fillWidth
                  onClick={() => setView("settings")}
                >
                  Einstellungen
                </Button>
                <Button variant="tertiary" size="s" fillWidth onClick={rejectAll}>
                  Nur Notwendige
                </Button>
              </Row>
            </Column>
          </>
        ) : (
          <>
            <Text
              variant="body-default-s"
              onBackground="neutral-weak"
              style={{ lineHeight: 1.6 }}
            >
              Stell dir deinen Keksteller selbst zusammen. Notwendige Cookies bleiben drin, der Rest
              ist deine Wahl.
            </Text>

            <Column fillWidth gap="4" radius="m" border="neutral-alpha-weak" padding="4">
              {categories.map((cat, i) => (
                <Column key={cat.key} fillWidth>
                  {i > 0 && <Line background="neutral-alpha-weak" />}
                  <Row
                    fillWidth
                    gap="16"
                    vertical="center"
                    horizontal="between"
                    paddingX="12"
                    paddingY="12"
                  >
                    <Column gap="2" style={{ flex: 1, minWidth: 0 }}>
                      <Text variant="label-strong-s" onBackground="neutral-strong">
                        {cat.title}
                      </Text>
                      <Text variant="body-default-xs" onBackground="neutral-weak">
                        {cat.description}
                      </Text>
                    </Column>
                    <Switch
                      isChecked={cat.locked ? true : consent[cat.key]}
                      disabled={cat.locked}
                      onToggle={() =>
                        !cat.locked && toggle(cat.key as "statistics" | "marketing")
                      }
                      ariaLabel={`${cat.title} ${cat.locked ? "(immer aktiv)" : "umschalten"}`}
                    />
                  </Row>
                </Column>
              ))}
            </Column>

            <Row fillWidth gap="8">
              <Button variant="tertiary" size="s" fillWidth onClick={() => setView("intro")}>
                Zurück
              </Button>
              <Button variant="primary" size="s" fillWidth onClick={saveSelection}>
                Auswahl speichern
              </Button>
            </Row>
          </>
        )}
      </Column>
    </Row>
  );
}
