"use client";

import { Button, Column, Heading, Row, Text } from "@once-ui-system/core";
import { CtaProof } from "@/components/CtaProof";
import { Magnetic, Reveal, SpotlightCard } from "@/components/motion";
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  WHATSAPP_URL,
} from "@/lib/contact";
import { openContactForm } from "@/lib/quoteContact";
import { Section } from "./Section";

export function FinalCta() {
  return (
    <Section id="kontakt">
      <Reveal>
        <Column fillWidth>
          <SpotlightCard
            tilt={false}
            fillWidth
            background="neutral-alpha-weak"
            border="neutral-alpha-medium"
            radius="xl"
            paddingX="l"
            paddingY="80"
            gap="24"
            horizontal="center"
            align="center"
            style={{
              boxShadow: "inset 0 1px 0 var(--evg-cta-inset)",
            }}
          >
            <Heading
              as="h2"
              variant="display-strong-m"
              onBackground="neutral-strong"
              wrap="balance"
              align="center"
              style={{ letterSpacing: "-0.035em", lineHeight: 1.02, maxWidth: "20ch" }}
            >
              Bereit für eine Website, die auffällt{" "}
              <Text as="span" onBackground="neutral-weak">
                und Kunden bringt?
              </Text>
            </Heading>

            <Text
              variant="body-default-l"
              onBackground="neutral-weak"
              align="center"
              wrap="balance"
              style={{ maxWidth: "46ch" }}
            >
              Das Erstgespräch ist kostenlos und unverbindlich. Schreib mir kurz – Antwort
              innerhalb von 24 Stunden.
            </Text>

            <Row gap="12" wrap horizontal="center" vertical="center" paddingTop="8">
              <Magnetic>
                <Button
                  variant="primary"
                  size="l"
                  arrowIcon
                  onClick={() => openContactForm()}
                >
                  Kostenloses Erstgespräch
                </Button>
              </Magnetic>
              <Button
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                size="l"
                prefixIcon="whatsapp"
              >
                WhatsApp
              </Button>
              <Button href={CONTACT_PHONE_TEL} variant="tertiary" size="l">
                {CONTACT_PHONE_DISPLAY}
              </Button>
            </Row>

            <Column gap="12" fillWidth horizontal="center" paddingTop="4">
              <CtaProof align="center" />
              <Text variant="label-default-s" onBackground="neutral-weak" align="center">
                Kostenlos · Unverbindlich · Antwort innerhalb 24h · Landsberg am Lech
              </Text>
            </Column>
          </SpotlightCard>
        </Column>
      </Reveal>
    </Section>
  );
}
