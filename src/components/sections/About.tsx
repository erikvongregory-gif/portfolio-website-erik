import { Column, Grid, Heading, Icon, Row, Tag, Text } from "@once-ui-system/core";
import { Counter, Reveal } from "@/components/motion";
import { Section } from "./Section";

const reasons = [
  "Direkter Kontakt, immer ich persönlich",
  "Klare Prozesse, keine Überraschungen",
  "Schnelle Umsetzung statt monatelanger Schleifen",
  "Ehrliche Beratung, auch wenn sie weniger Umsatz bedeutet",
];

const stats = [
  { num: 5, suffix: "", label: "Projekte umgesetzt" },
  { num: 7, suffix: " Tage", label: "Ø Lieferzeit" },
  { num: 1, suffix: "", label: "fester Ansprechpartner" },
];

export function About() {
  return (
    <Section id="warum">
      <Row fillWidth gap="64" vertical="start" m={{ direction: "column", gap: "48" }}>
        <Reveal>
        <Column flex={1} gap="24">
          <Tag size="s" variant="neutral">
            Warum EvgLab
          </Tag>
          <Heading
            as="h2"
            variant="display-strong-s"
            onBackground="neutral-strong"
            wrap="balance"
            style={{ letterSpacing: "-0.03em", lineHeight: 1.05 }}
          >
            Kein Team, kein Overhead.{" "}
            <Text as="span" onBackground="neutral-weak">
              Nur ich.
            </Text>
          </Heading>
          <Text variant="body-default-l" onBackground="neutral-weak">
            Hinter EvgLab steckt eine Person: ich, Erik. Du sprichst direkt mit mir, von der ersten
            Idee bis nach dem Launch. Ich kenne jedes Detail deines Projekts und bin dafür
            verantwortlich.
          </Text>
          <Column gap="12" paddingTop="4">
            {reasons.map((r) => (
              <Row key={r} gap="12" vertical="center">
                <Icon name="check" size="s" onBackground="neutral-strong" />
                <Text variant="body-default-m" onBackground="neutral-medium">
                  {r}
                </Text>
              </Row>
            ))}
          </Column>
        </Column>
        </Reveal>

        <Column flex={1} fillWidth>
          <Grid columns="1" gap="12" fillWidth m={{ columns: "3" }} s={{ columns: "1" }}>
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.12}>
                <Column
                  background="surface"
                  border="neutral-alpha-weak"
                  radius="l"
                  padding="24"
                  gap="4"
                >
                  <Text
                    variant="display-strong-m"
                    onBackground="neutral-strong"
                    style={{ letterSpacing: "-0.03em" }}
                  >
                    <Counter value={s.num} suffix={s.suffix} />
                  </Text>
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    {s.label}
                  </Text>
                </Column>
              </Reveal>
            ))}
          </Grid>
        </Column>
      </Row>
    </Section>
  );
}
