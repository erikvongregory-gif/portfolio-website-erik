"use client";

import { Column, Heading, Row, SmartLink, Text } from "@once-ui-system/core";
import type { ReactNode } from "react";
import { ContactDialog } from "@/components/ContactDialog";
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL } from "@/lib/contact";
import { LightStream } from "./LightStream";
import styles from "./CtaBand.module.scss";

type Props = {
  title?: ReactNode;
  text?: ReactNode;
  ctaLabel?: string;
};

/** Closing call to action on the dark stage, with a quieter light stream behind. */
export function CtaBand({
  title = (
    <>
      Lass uns deinen <span className={styles.glow}>Hingucker</span> bauen.
    </>
  ),
  text = "Erzähl kurz, was du vorhast. Du bekommst einen kostenlosen Entwurf und eine ehrliche Einschätzung, persönlich von Erik.",
  ctaLabel = "Kostenloser Entwurf",
}: Props) {
  return (
    <Column as="section" data-theme="dark" className={styles.band} fillWidth horizontal="center">
      <LightStream className={styles.canvas} variant="band" />
      <span className={styles.shade} aria-hidden="true" />
      <Column className={styles.inner} fillWidth maxWidth="xl" gap="32">
        <Heading as="h2" className={styles.title}>
          {title}
        </Heading>
        <Text as="p" className={styles.text}>
          {text}
        </Text>
        <Row gap="24" vertical="center" wrap>
          <ContactDialog label={ctaLabel} size="l" funnel />
          <Row gap="20" vertical="center" wrap>
            <SmartLink href={`mailto:${CONTACT_EMAIL}`} unstyled className={styles.link}>
              {CONTACT_EMAIL}
            </SmartLink>
            <SmartLink href={CONTACT_PHONE_TEL} unstyled className={styles.link}>
              {CONTACT_PHONE_DISPLAY}
            </SmartLink>
          </Row>
        </Row>
      </Column>
    </Column>
  );
}
