"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import { Column, Heading, Row, SmartLink, Text } from "@once-ui-system/core";
import classNames from "classnames";
import { ContactDialog } from "@/components/ContactDialog";
import { gsap, useGsapScene } from "@/components/motion/gsap";
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
      <svg className={styles.kickerIcon} viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="2.35"
          strokeLinecap="round"
          strokeLinejoin="round"
          data-kicker-path
          d="M8.15 8.2c.4-2.35 2.35-3.85 4.35-3.85 2.35 0 4.2 1.5 4.2 3.55 0 1.85-1.15 2.75-2.7 3.55-1.2.65-1.85 1.3-1.85 2.7"
        />
        <circle cx="12.15" cy="18.55" r="1.45" fill="currentColor" data-kicker-dot />
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
    <Column className={classNames(styles.item, open && styles.itemOpen)} fillWidth data-faq-item>
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
  const rootRef = useRef<HTMLElement>(null);

  useGsapScene(rootRef, ({ motion }, scope) => {
    if (!motion) return;
    const q = gsap.utils.selector(scope);
    const path = scope.querySelector<SVGPathElement>("[data-kicker-path]");
    const len = path?.getTotalLength() ?? 0;

    // Rechte Spalte: Fragezeichen zeichnet sich, Titel steigt, Fragen gleiten rein.
    const tl = gsap.timeline({ scrollTrigger: { trigger: scope, start: "top 70%", once: true } });
    if (path) {
      tl.fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" }, 0);
    }
    tl.from(q("[data-kicker-dot]"), { y: -14, opacity: 0, duration: 0.6, ease: "bounce.out", transformOrigin: "50% 50%" }, 0.55)
      .from(q("[data-faq-word]"), { yPercent: 110, duration: 0.9, ease: "expo.out", stagger: 0.06 }, 0.15)
      .from(q("[data-faq-item]"), { y: 24, opacity: 0, duration: 0.7, ease: "expo.out", stagger: 0.06 }, 0.35);

    // CTA-Karte: steigt, Foto dreht ein, Lichtreflex über den Button.
    gsap
      .timeline({ scrollTrigger: { trigger: q("[data-cta-card]")[0], start: "top 75%", once: true } })
      .from(q("[data-cta-card]"), { y: 40, opacity: 0, duration: 0.9, ease: "expo.out", clearProps: "transform" }, 0)
      .from(q("[data-cta-image]"), { scale: 0.6, rotate: -12, opacity: 0, duration: 0.9, ease: "back.out(1.8)" }, 0.15)
      .fromTo(q("[data-cta-shine]"), { xPercent: -120 }, { xPercent: 120, duration: 1.1, ease: "power2.inOut" }, 0.8);
  });

  return (
    <section id="faq" className={styles.section} ref={rootRef}>
      <Column className={styles.container} fillWidth horizontal="center" paddingX="l">
        <Row
          className={styles.layout}
          fillWidth
          gap="48"
          vertical="stretch"
          horizontal="center"
          m={{ direction: "column", gap: "48" }}
        >
          <Column className={styles.ctaCard} fillWidth data-cta-card>
            <Column gap="40" fillWidth>
              <span className={styles.ctaImage} data-cta-image>
                <Image
                  src="/images/about/erik-faq.png"
                  alt="Erik von Gregory, Gründer von EvGlab"
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
                <span className={styles.ctaShine} data-cta-shine aria-hidden="true" />
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
                {"Häufig gestellte Fragen:".split(" ").map((w) => (
                  <span key={w} className={styles.titleMask}>
                    <span className={styles.titleWord} data-faq-word>
                      {w}
                    </span>
                  </span>
                ))}
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
