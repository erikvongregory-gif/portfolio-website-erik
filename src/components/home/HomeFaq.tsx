import { Column, Heading, Icon, Row, SmartLink, Text } from "@once-ui-system/core";
import Image from "next/image";
import { ContactDialog } from "@/components/ContactDialog";
import { JsonLd } from "@/components/JsonLd";
import { Glow, StudioSection } from "@/components/studio";
import { CONTACT_EMAIL } from "@/lib/contact";
import { buildHomeFaqStructuredData, homepageFaqs } from "@/lib/homepageFaqs";
import { baseURL } from "@/resources";
import styles from "./HomeFaq.module.scss";

/** FAQ as native disclosure rows (works without JS), plus the FAQPage JSON-LD. */
export function HomeFaq() {
  return (
    <StudioSection id="faq">
      <JsonLd data={buildHomeFaqStructuredData(baseURL)} />
      <Row fillWidth gap="80" vertical="start" m={{ direction: "column", gap: "48" }}>
        <Column flex={4} gap="32" fillWidth className={styles.aside}>
          <Column gap="20">
            <Text className={styles.kicker}>FAQ</Text>
            <Heading as="h2" className={styles.title}>
              Häufige <Glow>Fragen</Glow>.
            </Heading>
          </Column>
          <Column className={styles.card} gap="20" fillWidth>
            <Row gap="16" vertical="center">
              <span className={styles.avatar}>
                <Image src="/images/about/erik-avatar.webp" alt="" width={48} height={48} sizes="48px" />
              </span>
              <Heading as="h3" className={styles.cardTitle}>
                Kostenloses Erstgespräch buchen
              </Heading>
            </Row>
            <Text as="p" className={styles.cardText}>
              Im unverbindlichen Gespräch klären wir dein Anliegen, den Umfang und den nächsten
              Schritt – inklusive kostenlosem Entwurf, wenn es passt.
            </Text>
            <ContactDialog label="Kostenloser Entwurf" size="l" fillWidth funnel />
            <Text className={styles.mail}>
              Lieber per E-Mail? <SmartLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</SmartLink>
            </Text>
          </Column>
        </Column>

        <Column as="ul" flex={7} fillWidth className={styles.list}>
          {homepageFaqs.map((f, i) => (
            <li key={f.question} className={styles.item}>
              <details className={styles.details} open={i === 0}>
                <summary className={styles.summary}>
                  <Heading as="h3" className={styles.question}>
                    {f.question}
                  </Heading>
                  <span className={styles.icon} aria-hidden="true">
                    <Icon name="plus" size="s" />
                  </span>
                </summary>
                <Text as="p" className={styles.answer}>
                  {f.answer}
                </Text>
              </details>
            </li>
          ))}
        </Column>
      </Row>
    </StudioSection>
  );
}
