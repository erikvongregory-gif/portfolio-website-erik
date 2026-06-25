"use client";

import { useEffect, useState } from "react";
import { Button, Column, Flex, Icon, IconButton, Row, SmartLink, Text } from "@once-ui-system/core";

const STORAGE_KEY = "evglab-cookie-consent";

export function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        const t = setTimeout(() => setOpen(true), 900);
        return () => clearTimeout(t);
      }
    } catch {
      /* localStorage nicht verfügbar – Banner einfach nicht zeigen */
    }
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

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    } catch {
      /* ignorieren */
    }
    setShown(false);
    setTimeout(() => setOpen(false), 320);
  };

  if (!open) return null;

  return (
    <Row
      position="fixed"
      bottom="16"
      left="16"
      zIndex={4}
      pointerEvents="none"
      style={{ maxWidth: "min(25rem, calc(100vw - 2rem))" }}
    >
      <Column
        fillWidth
        background="surface"
        border="neutral-alpha-medium"
        radius="l"
        shadow="xl"
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
        }}
      >
        <Row fillWidth gap="12" vertical="start" horizontal="between">
          <Row gap="12" vertical="center">
            <Flex
              horizontal="center"
              vertical="center"
              radius="m"
              style={{
                width: "2.25rem",
                height: "2.25rem",
                flexShrink: 0,
                background: "var(--brand-alpha-weak)",
                color: "var(--brand-on-background-strong)",
              }}
            >
              <Icon name="cookie" size="m" />
            </Flex>
            <Text
              variant="heading-strong-s"
              onBackground="neutral-strong"
              style={{ letterSpacing: "-0.01em" }}
            >
              Kalorienfreie Kekse
            </Text>
          </Row>
          <IconButton
            icon="close"
            variant="tertiary"
            size="s"
            onClick={dismiss}
            tooltip="Schließen"
            aria-label="Cookie-Hinweis schließen"
          />
        </Row>

        <Text variant="body-default-s" onBackground="neutral-weak" style={{ lineHeight: 1.6 }}>
          Wir backen ohne Tracking. Diese Seite nutzt nur technisch notwendige Cookies – keine
          Analyse, keine Werbung, kein schlechtes Gewissen. Details gibt&rsquo;s im{" "}
          <SmartLink href="/datenschutz">Datenschutz</SmartLink>.
        </Text>

        <Row fillWidth horizontal="end" vertical="center" gap="8">
          <Button variant="primary" size="s" onClick={dismiss}>
            Schmeckt mir
          </Button>
        </Row>
      </Column>
    </Row>
  );
}
