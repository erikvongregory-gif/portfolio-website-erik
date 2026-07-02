import { Button, Column, Heading, Row, Text } from "@once-ui-system/core";
import { Magnetic, Reveal, SpotlightCard } from "@/components/motion";
import { Section } from "./Section";

export function FinalCta() {
  return (
    <Section id="kontakt">
      <Reveal>
      <Column fillWidth>
      <SpotlightCard
        tilt={false}
        fillWidth
        background="neutral-alpha-weak"
        border="neutral-alpha-medium"
        radius="xl"
        paddingX="l"
        paddingY="80"
        gap="24"
        horizontal="center"
        align="center"
        style={{
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
        }}
      >
        <Heading
          as="h2"
          variant="display-strong-m"
          onBackground="neutral-strong"
          wrap="balance"
          align="center"
          style={{ letterSpacing: "-0.035em", lineHeight: 1.02, maxWidth: "20ch" }}
        >
          Bereit für eine Website, die auffällt{" "}
          <Text as="span" onBackground="neutral-weak">
            und Kunden bringt?
          </Text>
        </Heading>

        <Text
          variant="body-default-l"
          onBackground="neutral-weak"
          align="center"
          wrap="balance"
          style={{ maxWidth: "46ch" }}
        >
          Das Erstgespräch ist kostenlos und unverbindlich. Schreib mir kurz, ich melde mich
          innerhalb von 24 Stunden.
        </Text>

        <Row gap="12" wrap horizontal="center" vertical="center" paddingTop="8">
          <Magnetic>
            <Button href="mailto:info@evglab.com" variant="primary" size="l" arrowIcon>
              Kostenloses Erstgespräch
            </Button>
          </Magnetic>
          <Button href="tel:+491731706012" variant="secondary" size="l">
            0173 170 6012
          </Button>
        </Row>

        <Text variant="label-default-s" onBackground="neutral-weak" align="center" paddingTop="4">
          Kostenlos · Unverbindlich · Antwort innerhalb 24h · Landsberg am Lech
        </Text>
      </SpotlightCard>
      </Column>
      </Reveal>
    </Section>
  );
}
