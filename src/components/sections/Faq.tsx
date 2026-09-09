"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import { Column, Heading, Row, SmartLink, Text } from "@once-ui-system/core";
import classNames from "classnames";
import { ContactDialog } from "@/components/ContactDialog";
import { CONTACT_EMAIL } from "@/lib/contact";
import type { FaqItem } from "@/lib/homepageFaqs";
import styles from "./Faq.module.scss";

type FaqProps = {
  items: FaqItem[];
  ctaTitle?: ReactNode;
  ctaDescription?: string;
  ctaButtonLabel?: string;
};

function FaqKicker() {
  return (
    <Row className={styles.kicker} gap="12" vertical="center">
      <svg className={styles.kickerIcon} viewBox="0 0 15 16" aria-hidden="true">
        <path
          fill="currentColor"
          d="M0 4.25 3.75.5 7.5 4.25 3.75 8zM7.5 4.25 11.25.5 15 4.25 11.25 8zM0 11.75 3.75 8l3.75 3.75-3.75 3.75z"
        />
        <path fill="currentColor" d="M7.5 11.75 11.25 8 15 11.75l-3.75 3.75z" />
      </svg>
      <span>FAQ</span>
    </Row>
  );
}

function AnswerText({ text }: { text: string }) {
  const words = text.split(" ");

  return (
    <Text className={styles.answer} variant="body-default-m" onBackground="neutral-weak">
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className={styles.answerWord}
          style={{ "--i": index } as CSSProperties}
        >
          {word}
        </span>
      ))}
    </Text>
  );
}

function FaqAccordionItem({
  item,
  open,
  onToggle,
}: {
  item: FaqItem;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <Column className={classNames(styles.item, open && styles.itemOpen)} fillWidth>
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        onClick={onToggle}
      >
        <span className={styles.question}>{item.question}</span>
        <span className={classNames(styles.icon, open && styles.iconOpen)} aria-hidden="true">
          <span className={styles.iconRing} />
          <span className={styles.iconBar} />
          <span className={styles.iconBar} />
        </span>
      </button>
      <Column className={classNames(styles.panel, open && styles.panelOpen)} fillWidth>
        <Column className={styles.panelInner} fillWidth>
          <AnswerText text={item.answer} />
        </Column>
      </Column>
    </Column>
  );
}

export function Faq({
  items,
  ctaTitle = "Kostenloses Erstgespräch buchen",
  ctaDescription = "Im unverbindlichen Gespräch klären wir dein Anliegen, den Umfang und den nächsten Schritt – inklusive kostenlosem Entwurf, wenn es passt.",
  ctaButtonLabel = "Kostenloser Entwurf",
}: FaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className={styles.section}>
      <Column className={styles.container} fillWidth horizontal="center" paddingX="l">
        <Row
          className={styles.layout}
          fillWidth
          gap="48"
          vertical="stretch"
          horizontal="center"
          m={{ direction: "column", gap: "48" }}
        >
          <Column className={styles.ctaCard} fillWidth>
            <Column gap="40" fillWidth>
              <span className={styles.ctaImage}>
                <Image
                  src="/images/about/erik-faq.png"
                  alt="Erik von Gregory, Gründer von EvgLab"
                  width={1024}
                  height={1024}
                  quality={100}
                  unoptimized
                  sizes="(min-width: 1024px) 12rem, 7.25rem"
                />
              </span>
              <Column gap="24" fillWidth>
                <Heading
                  as="h3"
                  className={styles.ctaTitle}
                  variant="display-strong-s"
                  onBackground="neutral-strong"
                  wrap="balance"
                >
                  {ctaTitle}
                </Heading>
                <Text className={styles.ctaDescription} variant="body-default-l" wrap="balance">
                  {ctaDescription}
                </Text>
              </Column>
            </Column>

            <Column gap="24" fillWidth className={styles.ctaActions}>
              <div className={styles.ctaBtnWrap}>
                <ContactDialog label={ctaButtonLabel} size="l" fillWidth funnel />
              </div>
              <Text className={styles.ctaMail} variant="body-default-s" onBackground="neutral-weak">
                Lieber per Mail?{" "}
                <SmartLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</SmartLink>
              </Text>
            </Column>
          </Column>

          <Column className={styles.faqCol} fillWidth gap="48" flex={1}>
            <Column gap="24" fillWidth className={styles.faqIntro}>
              <FaqKicker />
              <Heading
                as="h2"
                className={styles.faqTitle}
                variant="display-strong-xl"
                onBackground="neutral-strong"
                wrap="balance"
              >
                Häufig gestellte Fragen:
              </Heading>
            </Column>

            <Column className={styles.accordion} fillWidth>
              {items.map((item, index) => (
                <FaqAccordionItem
                  key={item.question}
                  item={item}
                  open={openIndex === index}
                  onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                />
              ))}
            </Column>
          </Column>
        </Row>
      </Column>
    </section>
  );
}
