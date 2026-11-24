"use client";

import { Column, Grid, Heading, Icon, Row, SmartLink, Text } from "@once-ui-system/core/components";
import classNames from "classnames";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { Glow, StudioSection } from "@/components/studio";
import { DISCIPLINES } from "./data";
import { LoopVideo } from "./LoopVideo";
import styles from "./HomeServices.module.scss";

/** Below this width the card rows become swipeable carousels (see .carousel in the SCSS). */
export const CAROUSEL_QUERY = "(max-width: 1023px)";

/**
 * Tracks which child of a horizontal scroll-snap row is snapped to the start
 * and scrolls to a given child.
 */
export function useSnapIndex(ref: RefObject<HTMLElement | null>) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const measure = () => {
      const items = Array.from(el.children) as HTMLElement[];
      if (!items.length) return;
      const start = el.scrollLeft + (parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0);
      let best = 0;
      let dist = Infinity;
      items.forEach((it, i) => {
        const d = Math.abs(it.offsetLeft - start);
        if (d < dist) {
          dist = d;
          best = i;
        }
      });
      if (el.scrollLeft > 0 && el.scrollLeft + el.clientWidth >= el.scrollWidth - 2) best = items.length - 1;
      setIndex(best);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
    };
  }, [ref]);

  const go = useCallback(
    (i: number) => {
      const el = ref.current;
      const it = el?.children[i] as HTMLElement | undefined;
      if (!el || !it) return;
      const pad = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollTo({ left: it.offsetLeft - pad, behavior: reduced ? "auto" : "smooth" });
    },
    [ref],
  );

  return { index, go };
}

/** Position dots under a carousel. Each dot is a 44px tap target. Hidden on desktop. */
export function SnapDots({
  labels,
  index,
  onSelect,
  name,
}: {
  labels: string[];
  index: number;
  onSelect: (i: number) => void;
  name: string;
}) {
  return (
    <Row className={styles.dots} horizontal="center" fillWidth role="group" aria-label={name}>
      {labels.map((label, i) => (
        <button
          key={label}
          type="button"
          className={classNames(styles.dot, i === index && styles.dotOn)}
          onClick={() => onSelect(i)}
          aria-label={`${i + 1} von ${labels.length}: ${label}`}
          aria-current={i === index ? "true" : undefined}
        >
          <span aria-hidden="true" />
        </button>
      ))}
    </Row>
  );
}

type Mode = "hover" | "carousel" | "static";

/**
 * The three disciplines side by side. On pointer devices only one panel is
 * "on air" at a time: its film runs, the other two wait dimmed. On phones and
 * small tablets the panels become a swipeable row; the snapped panel is on air.
 */
export function HomeServices() {
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState<Mode>("static");
  const rowRef = useRef<HTMLDivElement>(null);
  const { index, go } = useSnapIndex(rowRef);

  useEffect(() => {
    const hover = window.matchMedia("(hover: hover) and (min-width: 1024px)");
    const narrow = window.matchMedia(CAROUSEL_QUERY);
    const sync = () => setMode(hover.matches ? "hover" : narrow.matches ? "carousel" : "static");
    sync();
    hover.addEventListener("change", sync);
    narrow.addEventListener("change", sync);
    return () => {
      hover.removeEventListener("change", sync);
      narrow.removeEventListener("change", sync);
    };
  }, []);

  const onAir = mode === "hover" ? active : mode === "carousel" ? index : -1;

  return (
    <StudioSection
      id="leistungen"
      className={styles.section}
      kicker="Leistungen"
      title={
        <>
          Alles aus <Glow>einer Hand</Glow>.
        </>
      }
      intro="Website, Produktfilm und Reels im selben Look: dieselben Farben, Schriften und Texte, vom Hero deiner Website bis in den Social Feed."
    >
      <Column fillWidth gap="8">
        <Grid
          as="ul"
          ref={rowRef}
          columns="3"
          gap="24"
          fillWidth
          className={classNames(styles.grid, styles.carousel, mode !== "static" && styles.focusMode)}
          aria-label="Leistungen, seitlich wischen"
        >
          {DISCIPLINES.map((d, i) => {
            const on = onAir === -1 || onAir === i;
            return (
              <Column
                as="li"
                key={d.id}
                fillWidth
                gap="24"
                className={classNames(styles.panel, on && styles.on)}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                <figure className={styles.frame} aria-label={d.filmLabel}>
                  <LoopVideo id={d.film} active={on} />
                  <span className={styles.onAir} aria-hidden="true" />
                  {d.credit && <figcaption className={styles.credit}>{d.credit}</figcaption>}
                </figure>
                <Column gap="16" fillWidth className={styles.text}>
                  <Row horizontal="between" vertical="end" gap="12" wrap>
                    <Heading as="h3" className={styles.name}>
                      {d.name}
                    </Heading>
                    <Text className={styles.price}>{d.price}</Text>
                  </Row>
                  <Text as="p" className={styles.body}>
                    {d.body}
                  </Text>
                  <Row as="ul" className={styles.points} gap="8" wrap>
                    {d.points.map((p) => (
                      <Text as="li" key={p} className={styles.point}>
                        {p}
                      </Text>
                    ))}
                  </Row>
                  <SmartLink href={d.href} unstyled className={styles.link}>
                    <Row gap="8" vertical="center">
                      <Text className={styles.linkLabel}>{d.linkLabel}</Text>
                      <Icon name="arrowRight" size="xs" />
                    </Row>
                  </SmartLink>
                </Column>
              </Column>
            );
          })}
        </Grid>
        <SnapDots
          name="Leistung wählen"
          labels={DISCIPLINES.map((d) => d.name)}
          index={index}
          onSelect={go}
        />
      </Column>
    </StudioSection>
  );
}
