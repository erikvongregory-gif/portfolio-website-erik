import { Column, Row, Tag, Text } from "@once-ui-system/core";
import { Reveal } from "@/components/motion";
import { Section, SectionHeader } from "./Section";
import styles from "./Process.module.scss";

const steps = [
  {
    no: "01",
    title: "Erstgespräch",
    body: "Kostenlos und unverbindlich. Ich höre zu, stelle Fragen und verstehe dein Business.",
    meta: "30 Min · kostenlos",
  },
  {
    no: "02",
    title: "Konzept & Angebot",
    body: "Klare Strategie und ein transparentes Angebot. Du weißt von Anfang an, was gebaut wird und was es kostet.",
    meta: "2–3 Tage",
  },
  {
    no: "03",
    title: "Design & Texte",
    body: "Ich gestalte und schreibe die Texte, du gibst Feedback. Sauber von Anfang an, maximal zwei Runden.",
    meta: "Feedback in 2 Runden",
  },
  {
    no: "04",
    title: "Umsetzung",
    body: "Ich baue alles selbst: schnell, mobil und suchmaschinenfreundlich. Kein Outsourcing, kein Overhead.",
    meta: "ca. 7 Tage",
  },
  {
    no: "05",
    title: "Launch & Betreuung",
    body: "Deine Website geht online, ich erkläre dir alles und bleibe dein Ansprechpartner.",
    meta: "Go-Live + Support",
  },
];

export function Process() {
  return (
    <Section id="ablauf" maxWidth={68} gap="48">
      <Row fillWidth gap="64" vertical="start" m={{ direction: "column", gap: "40" }}>
        <Column flex={5} className={styles.stickyHeader} maxWidth={28}>
          <SectionHeader
            eyebrow="Ablauf"
            title={
              <>
                In 5 Schritten{" "}
                <Text as="span" onBackground="neutral-weak">
                  zur Website.
                </Text>
              </>
            }
            description="Du brauchst kein Technik-Wissen. Ich führe dich durch alles."
          />
        </Column>

        <Column flex={7} fillWidth>
          {steps.map((s, i) => (
            <Reveal key={s.no} delay={i * 0.06} y={16}>
              <Row
                fillWidth
                gap="24"
                paddingTop={i === 0 ? "0" : "24"}
                paddingBottom="24"
                borderTop={i === 0 ? undefined : "neutral-alpha-weak"}
                vertical="start"
              >
                <Text
                  variant="display-strong-xs"
                  onBackground="neutral-weak"
                  style={{ minWidth: "2.5rem", letterSpacing: "-0.02em" }}
                >
                  {s.no}
                </Text>
                <Column gap="8" flex={1}>
                  <Row fillWidth horizontal="between" vertical="center" gap="12" wrap>
                    <Text variant="heading-strong-s" onBackground="neutral-strong">
                      {s.title}
                    </Text>
                    <Tag size="s" variant="neutral">
                      {s.meta}
                    </Tag>
                  </Row>
                  <Text variant="body-default-m" onBackground="neutral-weak">
                    {s.body}
                  </Text>
                </Column>
              </Row>
            </Reveal>
          ))}
        </Column>
      </Row>
    </Section>
  );
}
