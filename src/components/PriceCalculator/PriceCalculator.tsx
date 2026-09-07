"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import {
  Button,
  Column,
  Grid,
  Icon,
  IconButton,
  Row,
  Text,
} from "@once-ui-system/core";
import classNames from "classnames";
import { ShiftCta } from "@/components/ShiftCta";
import {
  ADDON_OPTIONS,
  BASE_OPTIONS,
  DEFAULT_QUOTE_STATE,
  INCLUDED_PAGES,
  type AddonId,
  type QuoteBase,
  type QuoteState,
  type PriceRange,
  buildQuoteMessage,
  calculateQuote,
  formatPriceRange,
  formatPriceRangeCompact,
} from "@/lib/calculateQuote";
import { requestQuoteConsultation } from "@/lib/quoteContact";
import { WHATSAPP_PARTNER_URL } from "@/lib/contact";
import styles from "./PriceCalculator.module.scss";

const MAX_PAGES = 20;
const PARTNER_COMMISSION = 0.3;
const MOBILE_MQ = "(max-width: 1023px)";

type PriceCalculatorProps = {
  variant?: "default" | "partner";
  /** Controlled basis, e.g. when a package card sets Landingpage / Website. */
  base?: QuoteBase;
  onBaseChange?: (base: QuoteBase) => void;
};

type OptionRowProps = {
  selected: boolean;
  onSelect: () => void;
  title: string;
  subtitle: string;
  price: string;
  role: "radio" | "checkbox";
  index?: number;
};

function useAnimatedRange(range: PriceRange): PriceRange {
  const [shown, setShown] = useState(range);
  const shownRef = useRef(range);

  useEffect(() => {
    shownRef.current = shown;
  }, [shown]);

  useEffect(() => {
    const from = shownRef.current;
    if (from.min === range.min && from.max === range.max) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(range);
      return;
    }

    const t0 = performance.now();
    const dur = 640;
    let raf = 0;
    const ease = (t: number) => 1 - (1 - t) ** 3;

    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const e = ease(p);
      setShown({
        min: Math.round(from.min + (range.min - from.min) * e),
        max: Math.round(from.max + (range.max - from.max) * e),
      });
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [range.min, range.max]);

  return shown;
}

function OptionRow({ selected, onSelect, title, subtitle, price, role, index = 0 }: OptionRowProps) {
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    <Row
      fillWidth
      gap="16"
      vertical="center"
      paddingX="16"
      paddingY="16"
      radius="l"
      className={classNames(styles.item, selected && styles.itemOn)}
      role={role}
      tabIndex={0}
      aria-checked={selected}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      style={{ "--i": index } as CSSProperties}
    >
      <span className={styles.check} aria-hidden="true">
        <span className={styles.checkMark}>
          <Icon name="check" size="xs" />
        </span>
      </span>
      <Column gap="4" flex={1} minWidth={0} className={styles.itemBody}>
        <Text variant="label-strong-s" onBackground="neutral-strong">
          {title}
        </Text>
        <Text variant="body-default-s" onBackground="neutral-weak">
          {subtitle}
        </Text>
      </Column>
      <Text
        variant="label-strong-s"
        onBackground="neutral-strong"
        className={styles.itemBody}
        style={{ flexShrink: 0 }}
      >
        {price}
      </Text>
    </Row>
  );
}

export function PriceCalculator({
  variant = "default",
  base: baseProp,
  onBaseChange,
}: PriceCalculatorProps = {}) {
  const isPartner = variant === "partner";
  const rootRef = useRef<HTMLDivElement>(null);
  const [local, setLocal] = useState<QuoteState>(DEFAULT_QUOTE_STATE);
  const [inView, setInView] = useState(false);
  const [docked, setDocked] = useState(false);
  const [priceBump, setPriceBump] = useState(false);
  const enteredRef = useRef(false);

  const base = baseProp ?? local.base;
  const state: QuoteState = { ...local, base };

  const range = useMemo(() => calculateQuote(state), [state]);
  const shown = useAnimatedRange(range);
  const commission = useMemo(
    () => ({
      min: Math.round(shown.min * PARTNER_COMMISSION),
      max: Math.round(shown.max * PARTNER_COMMISSION),
    }),
    [shown],
  );

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) setInView(true);

    const mobile = window.matchMedia(MOBILE_MQ);

    const enter = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio > 0) {
            setInView(true);
            enter.disconnect();
            break;
          }
        }
      },
      { threshold: [0, 0.12, 0.25], rootMargin: "0px 0px -28% 0px" },
    );

    const dock = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          setDocked(mobile.matches && e.isIntersecting);
        }
      },
      { threshold: [0, 0.04, 0.12] },
    );

    if (!reduce.matches) enter.observe(el);
    dock.observe(el);

    const onMq = () => {
      if (!mobile.matches) setDocked(false);
    };
    mobile.addEventListener("change", onMq);

    return () => {
      enter.disconnect();
      dock.disconnect();
      mobile.removeEventListener("change", onMq);
    };
  }, []);

  useEffect(() => {
    if (!inView) return;
    if (!enteredRef.current) {
      enteredRef.current = true;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPriceBump(true);
    const t = window.setTimeout(() => setPriceBump(false), 560);
    return () => window.clearTimeout(t);
  }, [inView, range.min, range.max]);

  const setBase = (next: QuoteBase) => {
    onBaseChange?.(next);
    setLocal((prev) => ({
      ...prev,
      base: next,
      pages: next === "website" ? Math.max(prev.pages, INCLUDED_PAGES) : INCLUDED_PAGES,
    }));
  };

  const setPages = (pages: number) => {
    setLocal((prev) => ({
      ...prev,
      pages: Math.min(MAX_PAGES, Math.max(INCLUDED_PAGES, pages)),
    }));
  };

  const toggleAddon = (id: AddonId) => {
    setLocal((prev) => ({
      ...prev,
      addons: { ...prev.addons, [id]: !prev.addons[id] },
    }));
  };

  const toggleExpress = () => {
    setLocal((prev) => ({ ...prev, express: !prev.express }));
  };

  const handleConsultation = () => {
    requestQuoteConsultation(buildQuoteMessage(state, range));
  };

  const cta = isPartner ? (
    <Button
      href={WHATSAPP_PARTNER_URL}
      target="_blank"
      rel="noopener noreferrer"
      variant="primary"
      size="m"
      fillWidth={!docked}
      prefixIcon="whatsapp"
      className={styles.cta}
    >
      Lead per WhatsApp
    </Button>
  ) : (
    <ShiftCta fillWidth={!docked} className={styles.cta} onClick={handleConsultation}>
      Kostenloser Entwurf
    </ShiftCta>
  );

  return (
    <Column
      ref={rootRef}
      id={isPartner ? undefined : "rechner"}
      fillWidth
      gap="24"
      className={classNames(styles.scene, inView && styles.in)}
      style={{ scrollMarginTop: "96px" }}
    >
      <Row
        fillWidth
        gap="40"
        vertical="start"
        className={styles.layout}
        m={{ direction: "column", gap: "20" }}
      >
        <Column flex={7} fillWidth className={styles.options}>
          <Column fillWidth className={styles.board}>
            <Column
              fillWidth
              className={classNames(styles.switch, state.base === "website" && styles.switchEnd)}
            >
              <span className={styles.thumb} aria-hidden="true" />
              <Grid columns="2" gap="4" fillWidth role="radiogroup" aria-label="Projektbasis">
                {BASE_OPTIONS.map((option) => {
                  const on = state.base === option.id;
                  return (
                    <Column
                      key={option.id}
                      fillWidth
                      gap="8"
                      paddingX="16"
                      paddingY="16"
                      className={classNames(styles.baseBtn, on && styles.baseOn)}
                      role="radio"
                      tabIndex={0}
                      aria-checked={on}
                      onClick={() => setBase(option.id)}
                      onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setBase(option.id);
                        }
                      }}
                    >
                      <Text variant="label-strong-s" onBackground="neutral-strong">
                        {option.title}
                      </Text>
                      <Text variant="body-default-s" onBackground="neutral-weak">
                        {option.subtitle}
                      </Text>
                      <Text variant="label-strong-s" onBackground="neutral-strong">
                        ab {option.from.toLocaleString("de-DE")} €
                      </Text>
                    </Column>
                  );
                })}
              </Grid>
            </Column>

            <Column
              fillWidth
              className={classNames(styles.pages, state.base === "website" && styles.pagesOpen)}
            >
              <Column fillWidth className={styles.pagesInner}>
                <Row
                  fillWidth
                  gap="16"
                  vertical="center"
                  className={styles.stepper}
                >
                  <Column gap="4" flex={1} minWidth={0}>
                    <Text variant="label-strong-s" onBackground="neutral-strong">
                      Unterseiten
                    </Text>
                    <Text variant="body-default-s" onBackground="neutral-weak">
                      {INCLUDED_PAGES} inklusive, jede weitere +150–200 €
                    </Text>
                  </Column>
                  <Row gap="8" vertical="center" style={{ flexShrink: 0 }}>
                    <IconButton
                      icon="minus"
                      variant="secondary"
                      size="m"
                      aria-label="Eine Seite weniger"
                      disabled={state.pages <= INCLUDED_PAGES}
                      onClick={() => setPages(state.pages - 1)}
                    />
                    <Text
                      variant="heading-strong-m"
                      onBackground="neutral-strong"
                      className={styles.tick}
                      aria-live="polite"
                      style={{ minWidth: "2rem", textAlign: "center" }}
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
                </Row>
              </Column>
            </Column>

            <Column fillWidth className={styles.list} role="group" aria-label="Zusatzoptionen">
              {ADDON_OPTIONS.map((addon, i) => (
                <OptionRow
                  key={addon.id}
                  role="checkbox"
                  index={i}
                  selected={state.addons[addon.id]}
                  onSelect={() => toggleAddon(addon.id)}
                  title={addon.title}
                  subtitle={addon.description}
                  price={`+${addon.min.toLocaleString("de-DE")}–${addon.max.toLocaleString("de-DE")} €`}
                />
              ))}
              <OptionRow
                role="checkbox"
                index={ADDON_OPTIONS.length}
                selected={state.express}
                onSelect={toggleExpress}
                title="Express"
                subtitle="Schneller als 7 Tage"
                price="+20 %"
              />
            </Column>
          </Column>
        </Column>

        <Column
          flex={5}
          fillWidth
          className={styles.summaryWrap}
          style={docked ? { minHeight: "5.75rem" } : undefined}
        >
          <Column
            fillWidth
            background="surface"
            border="neutral-alpha-medium"
            radius="l"
            padding={docked ? "16" : "24"}
            gap={docked ? "12" : "16"}
            className={classNames(
              styles.summary,
              docked && styles.summaryDocked,
              priceBump && styles.priceBump,
            )}
            role="status"
            aria-label={isPartner ? "Preis- und Provisionsrechner" : "Richtpreis"}
            m={
              docked
                ? { direction: "row", vertical: "center", gap: "12" }
                : undefined
            }
          >
            <Column gap="4" flex={1} minWidth={0} horizontal={docked ? "start" : "center"} align={docked ? "left" : "center"}>
              <Text variant="label-default-s" onBackground="neutral-weak">
                {isPartner ? "Projektpreis" : "Dein Richtpreis"}
              </Text>
              <Text
                as="p"
                variant={docked ? "heading-strong-l" : "display-strong-s"}
                onBackground="neutral-strong"
                className={classNames(styles.price, styles.tick)}
                aria-live="polite"
                style={{ letterSpacing: "-0.03em" }}
              >
                <span className={styles.priceInner}>
                  {docked ? formatPriceRangeCompact(shown) : formatPriceRange(shown)}
                </span>
              </Text>
              {isPartner && (
                <Text variant="label-strong-s" onBackground="brand-strong">
                  Provision {formatPriceRange(commission)}
                </Text>
              )}
              {!docked && (
                <Text variant="body-default-s" onBackground="neutral-weak" wrap="balance">
                  {isPartner
                    ? "Richtwerte zum Weitergeben. Der Festpreis kommt von mir, schriftlich."
                    : "Unverbindlich. Den Festpreis klären wir im Gespräch."}
                </Text>
              )}
            </Column>
            {cta}
          </Column>
        </Column>
      </Row>
    </Column>
  );
}
