"use client";

import { Column, Grid, Heading, Icon, Row, SmartLink, Text } from "@once-ui-system/core/components";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { Glow, StudioSection } from "@/components/studio";
import { DISCIPLINES } from "./data";
import { LoopVideo } from "./LoopVideo";
import styles from "./HomeServices.module.scss";

/**
 * The three disciplines side by side. On pointer devices only one panel is
 * "on air" at a time: its film runs, the other two wait dimmed.
 */
export function HomeServices() {
  const [active, setActive] = useState(0);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (min-width: 1024px)");
    const sync = () => setCanHover(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <StudioSection
      id="leistungen"
      kicker="Leistungen"
      title={
        <>
          Alles aus <Glow>einer Hand</Glow>.
        </>
      }
      intro="Website, Produktfilm und Reels im selben Look: dieselben Farben, Schriften und Texte, vom Hero deiner Website bis in den Social Feed."
    >
      <Grid
        as="ul"
        columns="3"
        gap="24"
        m={{ columns: "1", gap: "64" }}
        fillWidth
        className={classNames(styles.grid, canHover && styles.focusMode)}
      >
        {DISCIPLINES.map((d, i) => {
          const on = !canHover || active === i;
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
              <Column gap="16" fillWidth>
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
    </StudioSection>
  );
}
