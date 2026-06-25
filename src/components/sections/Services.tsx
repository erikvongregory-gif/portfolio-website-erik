import { Button, Column, Grid, Icon, Line, Row, Tag, Text } from "@once-ui-system/core";
import { Reveal, SpotlightCard } from "@/components/motion";
import { Section, SectionHeader } from "./Section";

const services = [
  {
    title: "Komplette Website",
    price: "ab 2.500 €",
    body: "Mehrseitiger Auftritt mit Design, Texten und Technik. Für Marken, die rundum überzeugen wollen.",
    features: ["Individuelles Design", "Bis ca. 5 Unterseiten", "Texte & SEO-Grundlagen", "Mobil & schnell"],
    featured: true,
  },
  {
    title: "Landingpage",
    price: "ab 1.500 €",
    body: "Eine Seite, ein Ziel. Conversion-fokussiert für Kampagnen, Angebote und Produkt-Launches.",
    features: ["Eine Seite, ein Ziel", "Conversion-optimiert", "Ideal für Werbung", "In 7 Tagen live"],
    featured: false,
  },
  {
    title: "Betreuung & Support",
    price: "99 € / Monat",
    body: "Updates, kleine Änderungen und Sicherheit. Deine Website bleibt aktuell, schnell und gepflegt.",
    features: ["Updates & Sicherheit", "Kleine Änderungen", "Fester Ansprechpartner", "Monatlich kündbar"],
    featured: false,
  },
];

export function Services() {
  return (
    <Section id="leistungen">
      <SectionHeader
        eyebrow="Leistungen"
        title={
          <>
            Was ich für dich{" "}
            <Text as="span" onBackground="neutral-weak">
              baue.
            </Text>
          </>
        }
        description="Transparente Richtpreise. Was du bekommst, weißt du vorher."
      />

      <Grid columns="3" m={{ columns: "1" }} gap="16">
        {services.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.1}>
          <Column fillHeight>
          <SpotlightCard
            tiltStrength={4}
            background={s.featured ? "neutral-alpha-weak" : "surface"}
            border={s.featured ? "neutral-alpha-medium" : "neutral-alpha-weak"}
            radius="l"
            padding="32"
            gap="20"
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

            <Text variant="body-default-m" onBackground="neutral-weak">
              {s.body}
            </Text>

            <Line background="neutral-alpha-weak" />

            <Column gap="12" fillWidth>
              {s.features.map((f) => (
                <Row key={f} gap="8" vertical="center">
                  <Icon name="check" size="s" onBackground="neutral-strong" />
                  <Text variant="body-default-s" onBackground="neutral-medium">
                    {f}
                  </Text>
                </Row>
              ))}
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
        ))}
      </Grid>
    </Section>
  );
}
