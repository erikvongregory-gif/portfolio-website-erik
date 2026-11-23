"use client";

import { Button, Column, Grid, Heading, Icon, Row, SmartLink, Text } from "@once-ui-system/core/components";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { ContactDialog } from "@/components/ContactDialog";
import { PriceCalculator } from "@/components/PriceCalculator";
import { Glow, StudioSection } from "@/components/studio";
import { BLACK_FRIDAY, BLACK_FRIDAY_PACKAGES, isBlackFridayActive } from "@/lib/blackFriday";
import type { QuoteBase } from "@/lib/calculateQuote";
import { START_OFFER, isStartOfferActive } from "@/lib/startOffer";
import { FILM_PRICES, OUTCOMES, WEB_PACKAGES } from "./data";
import styles from "./HomePricing.module.scss";

/** Black Friday or start offer, decided after mount so an expired offer never flashes. */
function OfferStrip() {
  const [mode, setMode] = useState<"bf" | "start" | null>(null);

  useEffect(() => {
    setMode(isBlackFridayActive() ? "bf" : isStartOfferActive() ? "start" : null);
  }, []);

  if (mode === "bf") {
    const slots = `Noch ${BLACK_FRIDAY.slotsLeft} von ${BLACK_FRIDAY.slotsTotal} Plätzen`;
    return (
      <Row className={styles.offer} fillWidth gap="24" vertical="center" horizontal="between" m={{ direction: "column", vertical: "start" }}>
        <Column gap="8">
          <Text className={styles.offerKicker}>
            Black Friday · bis {BLACK_FRIDAY.endsLabel} · {slots}
          </Text>
          <Text as="p" className={styles.offerText}>
            {BLACK_FRIDAY_PACKAGES.map((p, i) => (
              <span key={p.id}>
                {i > 0 && " · "}
                {p.name} <strong>{p.priceLabel}</strong> <span className={styles.offerRegular}>{p.regularLabel}</span>
              </span>
            ))}
          </Text>
        </Column>
        <Button href="/blackfriday" variant="secondary" size="l" arrowIcon>
          Zur Aktion
        </Button>
      </Row>
    );
  }

  if (mode === "start") {
    const slots = START_OFFER.slotsLeft === 1 ? "Noch 1 Platz" : `Noch ${START_OFFER.slotsLeft} Plätze`;
    return (
      <Row className={styles.offer} fillWidth gap="24" vertical="center" horizontal="between" m={{ direction: "column", vertical: "start" }}>
        <Column gap="8">
          <Text className={styles.offerKicker}>
            {slots} · nur bis {START_OFFER.validUntilLabel}
          </Text>
          <Text as="p" className={styles.offerText}>
            {START_OFFER.title} <strong>{START_OFFER.priceLabel}</strong>{" "}
            <span className={styles.offerRegular}>{START_OFFER.regularPriceLabel}</span>
          </Text>
          <Text as="p" className={styles.offerNote}>
            {START_OFFER.features.join(" · ")}. {START_OFFER.condition}
          </Text>
        </Column>
        <ContactDialog label="Startpaket anfragen" size="l" variant="secondary" funnel />
      </Row>
    );
  }

  return null;
}

/**
 * Prices as frames on the stage. The main package is the lit frame: a ring of
 * light runs once around its edge when it comes into view.
 */
export function HomePricing() {
  const [base, setBase] = useState<QuoteBase>("website");
  const [calcOpen, setCalcOpen] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const calcRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        grid.classList.add(styles.lit);
        io.disconnect();
      },
      { threshold: 0.35 },
    );
    io.observe(grid);
    return () => io.disconnect();
  }, []);

  const openCalculator = (b?: QuoteBase) => {
    if (b) setBase(b);
    setCalcOpen(true);
    // Jump instead of native smooth scroll, which fights the global Lenis scroll.
    requestAnimationFrame(() => {
      const el = calcRef.current;
      if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 96);
    });
  };

  return (
    <StudioSection
      id="preise"
      kicker="Preise"
      title={
        <>
          Keine Ausgabe. <Glow>Eine Investition.</Glow>
        </>
      }
      intro="Transparente Richtpreise. Für individuelle Lösungen ein persönliches Gespräch. Den genauen Festpreis klären wir im Erstgespräch, transparent und schriftlich."
    >
      <Column fillWidth gap="48">
        <OfferStrip />

        <Grid
          as="ul"
          ref={gridRef}
          columns="2"
          gap="20"
          m={{ columns: "1", gap: "16" }}
          fillWidth
          className={styles.grid}
        >
          {WEB_PACKAGES.map((p) => (
            <Column
              as="li"
              key={p.title}
              fillWidth
              gap="20"
              className={classNames(styles.card, p.featured && styles.featured)}
            >
              <Row horizontal="between" vertical="center" gap="12">
                <Heading as="h3" className={styles.cardTitle}>
                  {p.title}
                </Heading>
                {p.featured && <Text className={styles.tag}>Beliebt</Text>}
              </Row>
              <Text className={styles.price}>{p.price}</Text>
              <Text as="p" className={styles.body}>
                {p.body}
              </Text>
              <Column as="ul" className={styles.features} gap="12" fillWidth>
                {p.features.map((f) => (
                  <Text as="li" key={f} className={styles.feature}>
                    {f}
                  </Text>
                ))}
              </Column>
              <Row fillWidth paddingTop="8" style={{ marginTop: "auto" }}>
                {p.base ? (
                  <Button
                    variant={p.featured ? "primary" : "secondary"}
                    size="l"
                    fillWidth
                    arrowIcon
                    onClick={() => openCalculator(p.base)}
                  >
                    Zusammenstellen
                  </Button>
                ) : (
                  <ContactDialog label="Anfragen" variant="secondary" size="l" fillWidth funnel />
                )}
              </Row>
            </Column>
          ))}
        </Grid>

        <Column fillWidth gap="24">
          <Row horizontal="between" vertical="end" gap="24" wrap>
            <Heading as="h3" className={styles.subhead}>
              Filme und Reels
            </Heading>
            <SmartLink href="/videos" unstyled className={styles.link}>
              <Row gap="8" vertical="center">
                <Text className={styles.linkLabel}>Mehr zu Filmen</Text>
                <Icon name="arrowRight" size="xs" />
              </Row>
            </SmartLink>
          </Row>
          <Grid as="ul" columns="4" m={{ columns: "2" }} s={{ columns: "1" }} fillWidth className={styles.filmRow}>
            {FILM_PRICES.map((f) => (
              <Column as="li" key={f.title} gap="8" className={styles.filmItem}>
                <Text className={styles.filmTitle}>{f.title}</Text>
                <Text className={styles.filmPrice}>{f.price}</Text>
                <Text className={styles.filmNote}>{f.note}</Text>
              </Column>
            ))}
          </Grid>
        </Column>

        <Row fillWidth gap="48" vertical="start" m={{ direction: "column", gap: "24" }}>
          <Column flex={1} gap="12" fillWidth>
            <Text className={styles.outcomesLabel}>Was eine gute Website bringt</Text>
            <Row as="ul" className={styles.outcomes} gap="8" wrap>
              {OUTCOMES.map((o) => (
                <Text as="li" key={o} className={styles.outcome}>
                  {o}
                </Text>
              ))}
            </Row>
          </Column>
          <Column flex={1} gap="8" fillWidth>
            <Text as="p" className={styles.note}>
              Alle Preise sind Endpreise. Umsatzsteuer wird gemäß § 19 UStG nicht ausgewiesen.
            </Text>
            <Text as="p" className={styles.note}>
              Für Unternehmen oft steuerlich als Betriebsausgabe berücksichtigungsfähig. Im Einzelfall
              berät dich dein Steuerberater.
            </Text>
          </Column>
        </Row>

        <Column ref={calcRef} fillWidth gap="24" className={styles.calcWrap}>
          <Button
            variant="tertiary"
            size="l"
            prefixIcon={calcOpen ? undefined : "plus"}
            onClick={() => (calcOpen ? setCalcOpen(false) : openCalculator())}
            aria-expanded={calcOpen}
            aria-controls={calcOpen ? "rechner" : undefined}
          >
            {calcOpen ? "Preisrechner schließen" : "Preis grob berechnen"}
          </Button>
          {calcOpen && <PriceCalculator base={base} onBaseChange={setBase} />}
        </Column>
      </Column>
    </StudioSection>
  );
}
