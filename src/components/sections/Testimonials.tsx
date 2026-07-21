import { Column, Row, Text } from "@once-ui-system/core";
import { Reveal } from "@/components/motion";
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
  const [lead, ...rest] = testimonials;

  return (
    <Section id="stimmen" background="surface" gap="56">
      <SectionHeader
        align="center"
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

      <Reveal y={24}>
        <Column
          fillWidth
          maxWidth={44}
          gap="24"
          horizontal="center"
          align="center"
          style={{ marginInline: "auto" }}
        >
          <Text
            as="blockquote"
            variant="heading-strong-l"
            onBackground="neutral-strong"
            wrap="balance"
            align="center"
            style={{ lineHeight: 1.35, margin: 0, letterSpacing: "-0.02em" }}
          >
            „{lead.quote}“
          </Text>
          <Column gap="4" horizontal="center" align="center">
            <Text variant="label-strong-s" onBackground="neutral-strong">
              {lead.name}
            </Text>
            <Text variant="body-default-xs" onBackground="neutral-weak">
              {lead.meta}
            </Text>
          </Column>
        </Column>
      </Reveal>

      {rest.length > 0 && (
        <Column fillWidth maxWidth={40} gap="0" style={{ marginInline: "auto" }}>
          {rest.map((t, i) => (
            <Reveal key={t.name} delay={0.08 + i * 0.08}>
              <Column
                gap="16"
                paddingTop="32"
                borderTop="neutral-alpha-medium"
                horizontal="center"
                align="center"
              >
                <Text
                  as="blockquote"
                  variant="body-default-l"
                  onBackground="neutral-medium"
                  wrap="balance"
                  align="center"
                  style={{ lineHeight: 1.6, margin: 0 }}
                >
                  „{t.quote}“
                </Text>
                <Row gap="8" vertical="center" wrap horizontal="center">
                  <Text variant="label-strong-s" onBackground="neutral-strong">
                    {t.name}
                  </Text>
                  <Text variant="body-default-xs" onBackground="neutral-weak">
                    · {t.meta}
                  </Text>
                </Row>
              </Column>
            </Reveal>
          ))}
        </Column>
      )}
    </Section>
  );
}
