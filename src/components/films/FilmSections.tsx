import { Column, Heading, Row, Text } from "@once-ui-system/core/components";
import type { ReactNode } from "react";
import { ContactDialog } from "@/components/ContactDialog";
import styles from "./FilmSections.module.scss";

export type FilmService = { title: string; price: string; body: string; points: string[] };
export type FilmStep = { title: string; body: string };
export type FilmFaqItem = { question: string; answer: string };

/** Services as a calm price list: title, text and points, price on the right. */
export function FilmServiceList({ services }: { services: FilmService[] }) {
  return (
    <Column as="ul" className={styles.list} fillWidth>
      {services.map((s) => (
        <Row
          as="li"
          key={s.title}
          className={styles.service}
          fillWidth
          gap="32"
          m={{ direction: "column", gap: "12" }}
        >
          <Heading as="h3" className={styles.serviceTitle}>
            {s.title}
          </Heading>
          <Column className={styles.serviceBody} gap="12">
            <Text as="p" className={styles.text}>
              {s.body}
            </Text>
            <Text as="p" className={styles.points}>
              {s.points.join(" · ")}
            </Text>
          </Column>
          <Text className={styles.price}>{s.price}</Text>
        </Row>
      ))}
    </Column>
  );
}

/** The website + video combination as a single glass panel. */
export function FilmCombo({ title, text, items }: { title: ReactNode; text: string; items: string[] }) {
  return (
    <Row
      className={styles.combo}
      fillWidth
      gap="40"
      vertical="center"
      m={{ direction: "column", vertical: "start", gap: "24" }}
    >
      <Column flex={3} gap="16">
        <Text className={styles.comboKicker}>Website + Video</Text>
        <Heading as="h3" className={styles.comboTitle}>
          {title}
        </Heading>
        <Text as="p" className={styles.text}>
          {text}
        </Text>
      </Column>
      <Column flex={2} gap="12" fillWidth>
        <Column as="ul" gap="12" className={styles.checks}>
          {items.map((item) => (
            <Text as="li" key={item} className={styles.check}>
              {item}
            </Text>
          ))}
        </Column>
        <Row paddingTop="8">
          <ContactDialog label="Kombi anfragen" size="m" variant="secondary" />
        </Row>
      </Column>
    </Row>
  );
}

/** Four steps on one thin line with a node per step. */
export function FilmProcess({ steps }: { steps: FilmStep[] }) {
  return (
    <Column as="ol" className={styles.process} fillWidth>
      {steps.map((step) => (
        <Column as="li" key={step.title} className={styles.step} gap="12">
          <span className={styles.node} aria-hidden="true" />
          <Heading as="h3" className={styles.stepTitle}>
            {step.title}
          </Heading>
          <Text as="p" className={styles.text}>
            {step.body}
          </Text>
        </Column>
      ))}
    </Column>
  );
}

/** FAQ as native disclosure rows (keyboard and screen reader friendly). */
export function FilmFaq({ faqs }: { faqs: FilmFaqItem[] }) {
  return (
    <Column className={styles.faq} fillWidth>
      {faqs.map((faq, i) => (
        <details key={faq.question} className={styles.faqItem} open={i === 0}>
          <summary className={styles.summary}>
            <Heading as="h3" className={styles.question}>
              {faq.question}
            </Heading>
            <span className={styles.plus} aria-hidden="true" />
          </summary>
          <Text as="p" className={`${styles.text} ${styles.answer}`}>
            {faq.answer}
          </Text>
        </details>
      ))}
    </Column>
  );
}
