"use client";

import { useState, type ReactNode } from "react";
import { Button, Column, Grid, Icon, Line, Row, Tag, Text } from "@once-ui-system/core";
import { Reveal, SpotlightCard } from "@/components/motion";
import styles from "./Services.module.scss";

const COMPACT_FEATURES = 3;

export type ServicePackage = {
  title: string;
  price: string;
  body: string;
  features: string[];
  featured: boolean;
};

type ServicePackagesGridProps = {
  packages: ServicePackage[];
};

function Expandable({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <Column className={`${styles.collapse} ${open ? styles.collapseOpen : ""}`} fillWidth>
      <Column className={styles.collapseInner} fillWidth>
        {children}
      </Column>
    </Column>
  );
}

export function ServicePackagesGrid({ packages }: ServicePackagesGridProps) {
  const [detailed, setDetailed] = useState(false);

  return (
    <Column fillWidth gap="24">
      <Row fillWidth horizontal="center">
        <Row
          gap="4"
          padding="4"
          background="surface"
          border="neutral-alpha-medium"
          radius="full"
          vertical="center"
          role="group"
          aria-label="Ansicht der Leistungspakete"
        >
          <Button
            variant={detailed ? "tertiary" : "secondary"}
            size="s"
            onClick={() => setDetailed(false)}
            aria-pressed={!detailed}
          >
            Kurzübersicht
          </Button>
          <Button
            variant={detailed ? "secondary" : "tertiary"}
            size="s"
            onClick={() => setDetailed(true)}
            aria-pressed={detailed}
          >
            Alle Details
          </Button>
        </Row>
      </Row>

      <Grid columns="2" m={{ columns: "1" }} gap="16">
        {packages.map((s, i) => {
          const isCustom = i === packages.length - 1 && s.title === "Individuell auf Anfrage";
          const showAll = detailed || isCustom;
          const primaryFeatures = s.features.slice(0, COMPACT_FEATURES);
          const extraFeatures = s.features.slice(COMPACT_FEATURES);

          return (
            <Reveal key={s.title} delay={i * 0.1} scale={0.95}>
              <Column fillHeight>
                <SpotlightCard
                  tiltStrength={4}
                  background={s.featured ? "neutral-alpha-weak" : "surface"}
                  border={s.featured ? "neutral-alpha-medium" : "neutral-alpha-weak"}
                  radius="l"
                  padding={showAll ? "32" : "24"}
                  gap={showAll ? "20" : "16"}
                  fillHeight
                >
                  <Row vertical="center" horizontal="between" fillWidth>
                    <Text variant="heading-strong-s" onBackground="neutral-strong">
                      {s.title}
                    </Text>
                    {s.featured && (
                      <Tag size="s" variant="neutral">
                        Beliebt
                      </Tag>
                    )}
                  </Row>

                  <Text variant="display-strong-xs" onBackground="neutral-strong">
                    {s.price}
                  </Text>

                  <Expandable open={showAll}>
                    <Text variant="body-default-m" onBackground="neutral-weak">
                      {s.body}
                    </Text>
                  </Expandable>

                  <Line background="neutral-alpha-weak" />

                  <Column gap="12" fillWidth>
                    {primaryFeatures.map((f) => (
                      <Row key={f} gap="8" vertical="center">
                        <Icon name="check" size="s" onBackground="neutral-strong" />
                        <Text variant="body-default-s" onBackground="neutral-medium">
                          {f}
                        </Text>
                      </Row>
                    ))}

                    {extraFeatures.length > 0 && (
                      <Expandable open={showAll}>
                        <Column gap="12" fillWidth>
                          {extraFeatures.map((f) => (
                            <Row key={f} gap="8" vertical="center">
                              <Icon name="check" size="s" onBackground="neutral-strong" />
                              <Text variant="body-default-s" onBackground="neutral-medium">
                                {f}
                              </Text>
                            </Row>
                          ))}
                        </Column>
                      </Expandable>
                    )}
                  </Column>

                  <Row fillWidth style={{ marginTop: "auto" }} paddingTop="4">
                    <Button
                      href="#kontakt"
                      variant={s.featured ? "primary" : "secondary"}
                      size="m"
                      fillWidth
                      arrowIcon
                    >
                      Anfragen
                    </Button>
                  </Row>
                </SpotlightCard>
              </Column>
            </Reveal>
          );
        })}
      </Grid>
    </Column>
  );
}
