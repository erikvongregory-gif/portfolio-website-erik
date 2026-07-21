import { Column, Icon, Row, Text } from "@once-ui-system/core";
import { Reveal } from "@/components/motion";
import { Section, SectionHeader } from "./Section";
import styles from "./Investment.module.scss";

const outcomes = [
  "Mehr Anfragen und Umsatz",
  "Professioneller erster Eindruck",
  "Bessere Google-Sichtbarkeit",
  "Keine Pflege und Updates auf deiner Seite",
];

const comparison = [
  { builder: "Standard-Template", custom: "Individuelles Design" },
  { builder: "Begrenzte Möglichkeiten", custom: "Beliebig erweiterbar" },
  { builder: "Oft langsam", custom: "Optimierte Performance" },
  { builder: "Weniger SEO-Potenzial", custom: "Auf SEO ausgelegt" },
  { builder: "Wenig persönliche Betreuung", custom: "Direkter Ansprechpartner" },
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
            description="Eine gute Website gewinnt Kunden, schafft Vertrauen und spart Zeit – oft schneller, als man denkt."
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

      <Column fillWidth gap="8">
        <Reveal>
          <Row
            fillWidth
            gap="24"
            paddingBottom="12"
            borderBottom="neutral-alpha-medium"
            m={{ hide: true }}
          >
            <Text variant="label-default-s" onBackground="neutral-weak" style={{ flex: 1 }}>
              Baukasten
            </Text>
            <Text variant="label-strong-s" onBackground="neutral-strong" style={{ flex: 1 }}>
              Individuell
            </Text>
          </Row>
        </Reveal>

        <Column fillWidth>
          {comparison.map((row, i) => (
            <Reveal key={row.custom} delay={i * 0.05}>
              <Row
                fillWidth
                className={styles.compareRow}
                gap="24"
                paddingY="20"
                borderTop={i === 0 ? undefined : "neutral-alpha-weak"}
                vertical="center"
                m={{ direction: "column", gap: "8", paddingY: "20" }}
              >
                <Column flex={1} gap="4" className={styles.builderCol}>
                  <Text
                    className={styles.mobileLabel}
                    variant="label-default-xs"
                    onBackground="neutral-weak"
                  >
                    Baukasten
                  </Text>
                  <Text variant="body-default-m" onBackground="neutral-weak">
                    {row.builder}
                  </Text>
                </Column>

                <Column flex={1} gap="4">
                  <Text
                    className={styles.mobileLabel}
                    variant="label-default-xs"
                    onBackground="neutral-weak"
                  >
                    Individuell
                  </Text>
                  <Row gap="12" vertical="center">
                    <Icon name="check" size="s" onBackground="neutral-strong" />
                    <Text variant="body-default-m" onBackground="neutral-strong">
                      {row.custom}
                    </Text>
                  </Row>
                </Column>
              </Row>
            </Reveal>
          ))}
        </Column>
      </Column>

      <Reveal delay={0.1}>
        <Text
          variant="body-default-s"
          onBackground="neutral-weak"
          wrap="balance"
          style={{ maxWidth: "40rem" }}
        >
          Für Unternehmen oft steuerlich als Betriebsausgabe berücksichtigungsfähig – im Einzelfall
          berät dich dein Steuerberater.
        </Text>
      </Reveal>
    </Section>
  );
}
