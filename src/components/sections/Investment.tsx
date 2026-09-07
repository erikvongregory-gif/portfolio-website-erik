import { Column, Icon, Row, Text } from "@once-ui-system/core";
import { Reveal } from "@/components/motion";
import { Section, SectionHeader } from "./Section";

const outcomes = [
  "Mehr Anfragen und Umsatz",
  "Professioneller erster Eindruck",
  "Bessere Google-Sichtbarkeit",
  "Keine Pflege und Updates auf deiner Seite",
];

export function Investment() {
  return (
    <Section id="investition" background="surface" gap="48">
      <Row fillWidth gap="64" vertical="start" m={{ direction: "column", gap: "40" }}>
        <Column flex={1}>
          <SectionHeader
            eyebrow="Die Investition"
            title={
              <>
                Keine Ausgabe.{" "}
                <Text as="span" onBackground="neutral-weak">
                  Eine Investition.
                </Text>
              </>
            }
            description="Eine gute Website gewinnt Kunden, schafft Vertrauen und spart Zeit. Oft schneller, als man denkt."
          />
        </Column>

        <Column flex={1} paddingTop="8">
          <Reveal delay={0.12}>
            <Column gap="16" fillWidth>
              {outcomes.map((item, i) => (
                <Row
                  key={item}
                  gap="16"
                  vertical="center"
                  paddingTop={i === 0 ? undefined : "16"}
                  borderTop={i === 0 ? undefined : "neutral-alpha-weak"}
                >
                  <Icon name="check" size="s" onBackground="neutral-strong" />
                  <Text variant="body-default-l" onBackground="neutral-medium">
                    {item}
                  </Text>
                </Row>
              ))}
            </Column>
          </Reveal>
        </Column>
      </Row>

      <Reveal delay={0.1}>
        <Text
          variant="body-default-s"
          onBackground="neutral-weak"
          wrap="balance"
          style={{ maxWidth: "40rem" }}
        >
          Für Unternehmen oft steuerlich als Betriebsausgabe berücksichtigungsfähig. Im Einzelfall
          berät dich dein Steuerberater.
        </Text>
      </Reveal>
    </Section>
  );
}
