"use client";

import { useEffect, useState } from "react";
import { Button, Column, Grid, Heading, Icon, Row, Tag, Text } from "@once-ui-system/core";
import { ContactDialog } from "@/components/ContactDialog";
import { START_OFFER, START_OFFER_WHATSAPP_URL, isStartOfferActive } from "@/lib/startOffer";
import styles from "./StartOffer.module.scss";

type StartOfferProps = React.ComponentProps<typeof Column>;

/** Begrenztes Startpaket. Blendet sich nach Ablauf oder ohne freie Plätze selbst aus. */
export function StartOffer(props: StartOfferProps) {
  // Startwert ohne Datum, damit Server- und Client-Render gleich sind; das Datum prüft der Effekt.
  const [active, setActive] = useState(START_OFFER.slotsLeft > 0);

  useEffect(() => {
    setActive(isStartOfferActive());
  }, []);

  if (!active) return null;

  const slots =
    START_OFFER.slotsLeft === 1 ? "Noch 1 Platz" : `Noch ${START_OFFER.slotsLeft} Plätze`;

  return (
    <Column
      fillWidth
      padding="32"
      gap="24"
      radius="l"
      background="surface"
      border="brand-alpha-medium"
      m={{ padding: "24" }}
      aria-labelledby="start-offer-title"
      {...props}
    >
      <Row fillWidth gap="24" vertical="start" horizontal="between" m={{ direction: "column" }}>
        <Column gap="12" fillWidth maxWidth={34}>
          <Row gap="8" wrap>
            <Tag size="s" variant="brand">
              {slots}
            </Tag>
            <Tag size="s" variant="neutral">
              Nur bis {START_OFFER.validUntilLabel}
            </Tag>
          </Row>
          <Heading as="h3" id="start-offer-title" variant="heading-strong-l" onBackground="neutral-strong">
            {START_OFFER.title}
          </Heading>
          <Text variant="body-default-m" onBackground="neutral-weak" wrap="balance">
            Für Betriebe, die schnell und günstig professionell online sein wollen. Eine Seite, die zeigt,
            wer du bist, und Anfragen bringt. Später jederzeit zur kompletten Website erweiterbar.
          </Text>
        </Column>
        <Column gap="4" horizontal="end" align="right" className={styles.price}>
          <Text variant="display-strong-s" onBackground="neutral-strong" style={{ letterSpacing: "-0.03em" }}>
            {START_OFFER.priceLabel}
          </Text>
          <Text variant="label-default-s" onBackground="neutral-weak">
            Festpreis, {START_OFFER.regularPriceLabel}
          </Text>
        </Column>
      </Row>

      <Grid as="ul" columns="3" m={{ columns: "1" }} gap="12" style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {START_OFFER.features.map((feature) => (
          <Row as="li" key={feature} gap="8" vertical="center">
            <Icon name="check" size="s" onBackground="brand-medium" />
            <Text variant="body-default-s" onBackground="neutral-medium">
              {feature}
            </Text>
          </Row>
        ))}
      </Grid>

      <Row fillWidth gap="16" vertical="center" horizontal="between" m={{ direction: "column", vertical: "start" }}>
        <Text variant="body-default-s" onBackground="neutral-weak">
          {START_OFFER.condition}
        </Text>
        <Row gap="8" wrap>
          <ContactDialog label="Startpaket anfragen" />
          <Button
            href={START_OFFER_WHATSAPP_URL}
            variant="secondary"
            size="m"
            prefixIcon="whatsapp"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </Button>
        </Row>
      </Row>
    </Column>
  );
}
