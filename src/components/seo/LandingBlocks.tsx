import { Column, Grid, Heading, Row, SmartLink, Text } from "@once-ui-system/core";
import classNames from "classnames";
import type { ComponentProps } from "react";
import styles from "./Landing.module.scss";

type GridProps = ComponentProps<typeof Grid>;

/** Quiet editorial grid: hairline on top, title, body. No cards. */
export function ItemGrid({
  items,
  columns = "3",
  tone = "stage",
  ...rest
}: Omit<GridProps, "columns"> & {
  items: { title: string; body: string }[];
  columns?: "2" | "3" | "4";
  tone?: "stage" | "paper";
}) {
  return (
    <Grid
      as="ul"
      columns={columns}
      m={{ columns: columns === "4" ? "2" : columns }}
      s={{ columns: "1" }}
      gap="40"
      fillWidth
      className={classNames(tone === "paper" && styles.paperTone)}
      style={{ listStyle: "none", margin: 0, padding: 0 }}
      {...rest}
    >
      {items.map((item) => (
        <Column as="li" key={item.title} className={styles.item} gap="12">
          <Heading as="h3" className={styles.itemTitle}>
            {item.title}
          </Heading>
          <Text as="p" className={styles.itemBody}>
            {item.body}
          </Text>
        </Column>
      ))}
    </Grid>
  );
}

/** Services with guide prices as calm rows. */
export function PriceList({
  items,
}: {
  items: { title: string; price: string; body: string; href?: string }[];
}) {
  return (
    <Column as="ul" fillWidth className={styles.priceList}>
      {items.map((item) => {
        const content = (
          <>
            <Heading as="h3" className={styles.priceTitle}>
              {item.title}
            </Heading>
            <Text as="p" className={styles.priceBody}>
              {item.body}
            </Text>
            <Text className={styles.priceValue}>{item.price}</Text>
          </>
        );
        return (
          <li key={item.title}>
            {item.href ? (
              <SmartLink href={item.href} unstyled className={styles.priceRow}>
                {content}
              </SmartLink>
            ) : (
              <Row className={styles.priceRow}>{content}</Row>
            )}
          </li>
        );
      })}
    </Column>
  );
}

/** Wrapped list of quiet glass pills, optionally linked. */
export function PillList({
  items,
  label,
  tone = "stage",
}: {
  items: { label: string; href?: string }[];
  label?: string;
  tone?: "stage" | "paper";
}) {
  return (
    <Row
      as="ul"
      aria-label={label}
      gap="8"
      wrap
      className={classNames(styles.pills, tone === "paper" && styles.paperTone)}
    >
      {items.map((item) => (
        <li key={item.label}>
          {item.href ? (
            <SmartLink href={item.href} unstyled className={styles.pill}>
              {item.label}
              <span aria-hidden="true">→</span>
            </SmartLink>
          ) : (
            <span className={styles.pill}>{item.label}</span>
          )}
        </li>
      ))}
    </Row>
  );
}

/**
 * FAQ as native disclosure widgets: accessible without JS, and the answers
 * stay in the HTML for search engines.
 */
export function FaqList({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <Column fillWidth className={styles.faqList}>
      {items.map((faq) => (
        <details key={faq.question} className={styles.faq}>
          <summary className={styles.faqSummary}>
            <Heading as="h3" className={styles.faqQuestion}>
              {faq.question}
            </Heading>
            <span className={styles.faqIcon} aria-hidden="true">
              +
            </span>
          </summary>
          <Text as="p" className={styles.faqAnswer}>
            {faq.answer}
          </Text>
        </details>
      ))}
    </Column>
  );
}

export const PROCESS_STEPS = [
  {
    n: "1",
    title: "Erstgespräch",
    body: "Kostenlos und unverbindlich. Ich höre zu, stelle Fragen und verstehe dein Business.",
    meta: "30 Min, kostenlos",
  },
  {
    n: "2",
    title: "Konzept und Angebot",
    body: "Klare Strategie und ein transparentes Angebot. Du weißt von Anfang an, was gebaut wird und was es kostet.",
    meta: "2 bis 3 Tage",
  },
  {
    n: "3",
    title: "Design und Texte",
    body: "Ich gestalte und schreibe die Texte, du gibst Feedback. Sauber von Anfang an, maximal zwei Runden.",
    meta: "Feedback in 2 Runden",
  },
  {
    n: "4",
    title: "Umsetzung",
    body: "Ich baue alles selbst: schnell, mobil und suchmaschinenfreundlich. Kein Outsourcing, kein Overhead.",
    meta: "ca. 7 Tage",
  },
  {
    n: "5",
    title: "Launch und Betreuung",
    body: "Deine Website geht online, ich erkläre dir alles und bleibe dein Ansprechpartner.",
    meta: "Go-Live und Support",
  },
];

/** The five steps from first call to launch, same copy as the former Process section. */
export function ProcessSteps() {
  return (
    <Grid
      as="ol"
      columns="5"
      m={{ columns: "2" }}
      s={{ columns: "1" }}
      gap="32"
      fillWidth
      className={styles.steps}
    >
      {PROCESS_STEPS.map((step) => (
        <Column as="li" key={step.n} className={styles.step} gap="12">
          <span className={styles.stepNum} aria-hidden="true">
            {step.n}
          </span>
          <Heading as="h3" className={styles.itemTitle}>
            {step.title}
          </Heading>
          <Text as="p" className={styles.itemBody}>
            {step.body}
          </Text>
          <Text className={styles.stepMeta}>{step.meta}</Text>
        </Column>
      ))}
    </Grid>
  );
}
