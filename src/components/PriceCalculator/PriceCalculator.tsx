"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  Button,
  Column,
  Grid,
  Icon,
  IconButton,
  Line,
  Row,
  Tag,
  Text,
} from "@once-ui-system/core";
import { Reveal, SpotlightCard } from "@/components/motion";
import {
  ADDON_OPTIONS,
  BASE_OPTIONS,
  DEFAULT_QUOTE_STATE,
  INCLUDED_PAGES,
  type AddonId,
  type QuoteBase,
  type QuoteState,
  buildQuoteMessage,
  calculateQuote,
  formatPriceRange,
} from "@/lib/calculateQuote";
import { requestQuoteConsultation } from "@/lib/quoteContact";
import styles from "./PriceCalculator.module.scss";

const MAX_PAGES = 20;

type SelectCardProps = {
  selected: boolean;
  onSelect: () => void;
  title: string;
  subtitle: string;
  price: string;
  role: "radio" | "checkbox";
};

function SelectCard({ selected, onSelect, title, subtitle, price, role }: SelectCardProps) {
  return (
    <SpotlightCard
      tilt={false}
      glow={false}
      role={role}
      tabIndex={0}
      aria-checked={selected}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      background={selected ? "neutral-alpha-weak" : "surface"}
      border={selected ? "neutral-alpha-medium" : "neutral-alpha-weak"}
      radius="l"
      padding="20"
      gap="8"
      fillWidth
      horizontal="start"
      className={styles.selectCard}
    >
      <Row fillWidth horizontal="between" vertical="start" gap="12">
        <Column gap="8" horizontal="start" flex={1}>
          <Text variant="heading-strong-s" onBackground="neutral-strong">
            {title}
          </Text>
          <Text variant="body-default-s" onBackground="neutral-weak">
            {subtitle}
          </Text>
          <Text variant="label-strong-s" onBackground="neutral-strong">
            {price}
          </Text>
        </Column>
        {selected && <Icon name="check" size="s" onBackground="neutral-strong" />}
      </Row>
    </SpotlightCard>
  );
}

function StepBlock({ step, title, hint, children }: {
  step: string;
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <Column gap="16" fillWidth>
      <Column gap="8" fillWidth>
        <Tag size="s" variant="neutral">
          {step}
        </Tag>
        <Text variant="heading-strong-s" onBackground="neutral-strong">
          {title}
        </Text>
        {hint && (
          <Text variant="body-default-s" onBackground="neutral-weak">
            {hint}
          </Text>
        )}
      </Column>
      {children}
    </Column>
  );
}

export function PriceCalculator() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<QuoteState>(DEFAULT_QUOTE_STATE);

  const range = useMemo(() => calculateQuote(state), [state]);
  const addonStep = state.base === "website" ? "Schritt 3" : "Schritt 2";

  const setBase = (base: QuoteBase) => {
    setState((prev) => ({
      ...prev,
      base,
      pages: base === "website" ? Math.max(prev.pages, INCLUDED_PAGES) : INCLUDED_PAGES,
    }));
  };

  const setPages = (pages: number) => {
    setState((prev) => ({
      ...prev,
      pages: Math.min(MAX_PAGES, Math.max(INCLUDED_PAGES, pages)),
    }));
  };

  const toggleAddon = (id: AddonId) => {
    setState((prev) => ({
      ...prev,
      addons: { ...prev.addons, [id]: !prev.addons[id] },
    }));
  };

  const toggleExpress = () => {
    setState((prev) => ({ ...prev, express: !prev.express }));
  };

  const handleConsultation = () => {
    requestQuoteConsultation(buildQuoteMessage(state, range));
    setOpen(false);
  };

  return (
    <Column fillWidth gap="16" paddingTop="8">
      <Reveal>
        <Button
          variant="secondary"
          size="m"
          fillWidth
          arrowIcon
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
        >
          {open ? "Rechner schließen" : "Individuell berechnen"}
        </Button>
      </Reveal>

      <Column
        fillWidth
        className={`${styles.collapse} ${open ? styles.collapseOpen : ""}`}
        aria-hidden={!open}
      >
        <Column className={styles.collapseInner} fillWidth>
          <SpotlightCard
            tilt={false}
            glow={false}
            fillWidth
            background="surface"
            border="neutral-alpha-medium"
            radius="l"
            padding="32"
            gap="32"
            role="region"
            aria-label="Individueller Preisrechner"
            className={styles.panel}
          >
            <StepBlock step="Schritt 1" title="Basis wählen">
              <Grid
                columns="2"
                m={{ columns: "1" }}
                gap="12"
                fillWidth
                role="radiogroup"
                aria-label="Projektbasis"
              >
                {BASE_OPTIONS.map((option) => (
                  <SelectCard
                    key={option.id}
                    role="radio"
                    selected={state.base === option.id}
                    onSelect={() => setBase(option.id)}
                    title={option.title}
                    subtitle={option.subtitle}
                    price={`ab ${option.from.toLocaleString("de-DE")} €`}
                  />
                ))}
              </Grid>
            </StepBlock>

            {state.base === "website" && (
              <>
                <Line background="neutral-alpha-weak" />
                <StepBlock
                  step="Schritt 2"
                  title="Anzahl Unterseiten"
                  hint={`${INCLUDED_PAGES} Seiten inklusive · jede weitere +150–200 €`}
                >
                  <Row gap="16" vertical="center">
                    <IconButton
                      icon="minus"
                      variant="secondary"
                      size="m"
                      aria-label="Eine Seite weniger"
                      disabled={state.pages <= INCLUDED_PAGES}
                      onClick={() => setPages(state.pages - 1)}
                    />
                    <Text
                      variant="display-strong-xs"
                      onBackground="neutral-strong"
                      aria-live="polite"
                      style={{ minWidth: "2.5rem", textAlign: "center" }}
                    >
                      {state.pages}
                    </Text>
                    <IconButton
                      icon="plus"
                      variant="secondary"
                      size="m"
                      aria-label="Eine Seite mehr"
                      disabled={state.pages >= MAX_PAGES}
                      onClick={() => setPages(state.pages + 1)}
                    />
                  </Row>
                </StepBlock>
              </>
            )}

            <Line background="neutral-alpha-weak" />

            <StepBlock step={addonStep} title="Zusatzoptionen">
              <Grid columns="2" m={{ columns: "1" }} gap="12" fillWidth>
                {ADDON_OPTIONS.map((addon) => (
                  <SelectCard
                    key={addon.id}
                    role="checkbox"
                    selected={state.addons[addon.id]}
                    onSelect={() => toggleAddon(addon.id)}
                    title={addon.title}
                    subtitle={addon.description}
                    price={`+${addon.min.toLocaleString("de-DE")}–${addon.max.toLocaleString("de-DE")} €`}
                  />
                ))}
                <SelectCard
                  role="checkbox"
                  selected={state.express}
                  onSelect={toggleExpress}
                  title="Express-Umsetzung"
                  subtitle="Schneller als Standard 7 Tage"
                  price="+20 % auf Gesamtsumme"
                />
              </Grid>
            </StepBlock>

            <Line background="neutral-alpha-weak" />

            <Column gap="20" fillWidth>
              <Column
                background="neutral-alpha-weak"
                border="neutral-alpha-medium"
                radius="l"
                padding="24"
                gap="8"
                fillWidth
                horizontal="center"
                align="center"
              >
                <Text variant="label-default-s" onBackground="neutral-weak">
                  Geschätzt
                </Text>
                <Text
                  variant="display-strong-s"
                  onBackground="neutral-strong"
                  align="center"
                  aria-live="polite"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  {formatPriceRange(range)}
                </Text>
                <Text
                  variant="body-default-s"
                  onBackground="neutral-weak"
                  align="center"
                  wrap="balance"
                >
                  Unverbindliche Richtpreise. Im Erstgespräch klären wir den genauen Umfang.
                </Text>
              </Column>

              <Button variant="primary" size="m" fillWidth arrowIcon onClick={handleConsultation}>
                Kostenloses Erstgespräch anfragen
              </Button>
            </Column>
          </SpotlightCard>
        </Column>
      </Column>
    </Column>
  );
}
