"use client";

import { Column, Heading, Row, SmartLink, Text } from "@once-ui-system/core/components";
import { useCallback, useRef } from "react";
import { ContactDialog } from "@/components/ContactDialog";
import { LightStream } from "./LightStream";
import styles from "./HaloHero.module.scss";

/**
 * Start hero: a dark stage, a river of light cut from EvGlab's own films,
 * and one giant word that the light pulses ignite on arrival.
 */
export function HaloHero() {
  const glowRef = useRef<HTMLSpanElement>(null);

  const ignite = useCallback(() => {
    glowRef.current?.animate(
      [{ opacity: 0.18 }, { opacity: 1, offset: 0.14 }, { opacity: 0.18 }],
      { duration: 2000, easing: "cubic-bezier(.2,.7,.2,1)" },
    );
  }, []);

  return (
    <Column as="section" data-theme="dark" className={styles.stage} fillWidth>
      <LightStream className={styles.canvas} onPulseArrive={ignite} />
      <span className={styles.vignette} aria-hidden="true" />

      <Text as="p" className={styles.tagline}>
        Werbematerial, das hängen bleibt.
      </Text>

      <Row className={styles.bottom} fillWidth vertical="end" horizontal="between" gap="40">
        <Heading as="h1" className={styles.word}>
          <span className={styles.srOnly}>EvGlab: Websites, 3D-Filme und Reels als </span>
          <span className={styles.wordFill}>Hingucker</span>
          <span ref={glowRef} className={styles.wordGlow} aria-hidden="true">
            Hingucker
          </span>
        </Heading>

        <Column className={styles.aside} gap="16">
          <Row gap="8" vertical="center">
            <span className={styles.dot} aria-hidden="true" />
            <Text className={styles.status}>Landsberg am Lech · für ganz Deutschland</Text>
          </Row>
          <Text as="p" className={styles.lead}>
            EvGlab baut Websites, 3D-Produktfilme und Reels für Unternehmen, die gesehen werden
            wollen. Alles, was hier fließt, sind echte Arbeiten.
          </Text>
          <Row gap="16" vertical="center" wrap>
            <ContactDialog label="Kostenloser Entwurf" size="m" funnel />
            <SmartLink href="/videos" unstyled className={styles.secondary}>
              Filme ansehen
            </SmartLink>
          </Row>
        </Column>
      </Row>
    </Column>
  );
}
