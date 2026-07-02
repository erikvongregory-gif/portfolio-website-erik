import { Column, Grid, Row, Text } from "@once-ui-system/core";
import { Reveal, SpotlightCard } from "@/components/motion";
import { Section, SectionHeader } from "./Section";

// WICHTIG: Platzhalter-Zitate! Vor dem Livegang unbedingt durch echte,
// vom Kunden freigegebene Stimmen ersetzen.
const testimonials = [
  {
    quote:
      "Erik hat unseren Auftritt komplett neu gedacht. Die Zusammenarbeit war direkt und unkompliziert – und das Ergebnis wirkt endlich so professionell wie unsere Arbeit.",
    name: "Ingenieurbüro Jungen",
    meta: "Industrie · Automation · ib-jungen.de",
  },
  {
    quote:
      "Vom ersten Entwurf an hat man gemerkt, dass Erik unsere Marke verstanden hat. Die Seite hat Kante, genau wie unser Bier – und Bestellungen kommen jetzt direkt über die Website.",
    name: "Lünebräu",
    meta: "Craft-Bier-Brauerei · Lüneburg",
  },
];

export function Testimonials() {
  return (
    <Section id="stimmen">
      <SectionHeader
        eyebrow="Stimmen"
        title={
          <>
            Was Kunden{" "}
            <Text as="span" onBackground="neutral-weak">
              sagen.
            </Text>
          </>
        }
        description="Keine gekauften Bewertungen – Stimmen aus echten Projekten."
      />

      <Grid columns="2" m={{ columns: "1" }} gap="16">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.1} y={24}>
            <Column fillHeight>
              <SpotlightCard
                background="surface"
                border="neutral-alpha-weak"
                radius="l"
                padding="32"
                gap="20"
                fillHeight
                glow={false}
              >
                <Text
                  aria-hidden="true"
                  variant="display-strong-m"
                  onBackground="brand-weak"
                  style={{ lineHeight: 0.6, letterSpacing: "-0.04em", userSelect: "none" }}
                >
                  „
                </Text>
                <Text
                  as="blockquote"
                  variant="body-default-l"
                  onBackground="neutral-medium"
                  style={{ lineHeight: 1.6, margin: 0 }}
                >
                  {t.quote}
                </Text>
                <Row gap="12" vertical="center" paddingTop="4">
                  <Column gap="2">
                    <Text variant="label-strong-s" onBackground="neutral-strong">
                      {t.name}
                    </Text>
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      {t.meta}
                    </Text>
                  </Column>
                </Row>
              </SpotlightCard>
            </Column>
          </Reveal>
        ))}
      </Grid>
    </Section>
  );
}
