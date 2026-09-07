"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Column, Heading, Icon, Row, SmartLink, Text } from "@once-ui-system/core";
import classNames from "classnames";
import Image from "next/image";
import { Section } from "./Section";
import styles from "./Testimonials.module.scss";

const lead = {
  name: "Da Peppe",
  role: "Osteria & Pizzeria, Landsberg",
  quoteLines: [
    "Innerhalb von nur drei Tagen",
    "waren wir mit einer komplett",
    "neuen Website online.",
  ],
  tags: ["Gastronomie"],
  result: "3 Tage live",
  source: "Google, 5 von 5",
  image: "/images/projects/da-peppe/hero-live.png",
  url: "https://da-peppe.com",
};

const more = [
  {
    name: "Ingenieurbüro Jungen",
    meta: "Industrie, Automation",
    quote: "Direkt und unkompliziert. Das Ergebnis wirkt endlich so professionell wie unsere Arbeit.",
    image: "/images/projects/ib-jungen/hero.png",
  },
  {
    name: "Lünebräu",
    meta: "Craft-Bier, Lüneburg",
    quote: "Vom ersten Entwurf an hat man gemerkt, dass Erik unsere Marke verstanden hat.",
    image: "/images/projects/lunebraeu/hero.png",
  },
];

function ClipSwap({ text }: { text: string }) {
  return (
    <span className={styles.clip}>
      <span className={styles.idle}>{text}</span>
      <span className={styles.swap} aria-hidden="true">
        {text}
      </span>
    </span>
  );
}

export function Testimonials() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }

    const scene = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio > 0) {
            setInView(true);
            scene.disconnect();
            break;
          }
        }
      },
      { threshold: [0, 0.12], rootMargin: "0px 0px -28% 0px" },
    );
    scene.observe(el);
    return () => scene.disconnect();
  }, []);

  return (
    <Section id="stimmen" background="surface" paddingY="128" maxWidth={72} gap="48">
      <Column
        ref={rootRef}
        fillWidth
        gap="48"
        className={classNames(styles.scene, inView && styles.in)}
      >
        <Heading
          as="h2"
          className={styles.headline}
          variant="display-strong-m"
          onBackground="neutral-strong"
          style={{ letterSpacing: "-0.04em", lineHeight: 1.05 }}
        >
          <span className={styles.line}>
            {["Was", "Kunden"].map((w, i) => (
              <span key={w} className={styles.word} style={{ "--w": i } as CSSProperties}>
                <span className={styles.wordInner}>{w}</span>
              </span>
            ))}
          </span>
          <span className={styles.line}>
            <span className={styles.word} style={{ "--w": 2 } as CSSProperties}>
              <span className={styles.wordInner}>sagen.</span>
            </span>
          </span>
        </Heading>

        <Row fillWidth gap="48" vertical="center" m={{ direction: "column", gap: "28" }}>
          <Column flex={6} gap="20" minWidth={0}>
            <Text className={styles.leadName} variant="display-strong-s" onBackground="neutral-strong">
              <span className={styles.leadNameInner}>{lead.name}</span>
            </Text>
            <Text as="blockquote" className={styles.quote}>
              {lead.quoteLines.map((line, i) => {
                const last = i === lead.quoteLines.length - 1;
                const text = `${i === 0 ? "„" : ""}${line}${last ? "“" : ""}`;
                return (
                  <span key={line} className={styles.qLine} style={{ "--q": i } as CSSProperties}>
                    <span className={styles.qInner}>{text}</span>
                  </span>
                );
              })}
            </Text>
            <Column className={styles.meta} gap="12">
              <Text variant="label-strong-s" onBackground="neutral-strong">
                {lead.role}
              </Text>
              <Row gap="8" wrap vertical="center">
                <span className={styles.pill}>{lead.source}</span>
                <span className={styles.pill}>{lead.result}</span>
                {lead.tags.map((tag) => (
                  <span key={tag} className={styles.pill}>
                    {tag}
                  </span>
                ))}
              </Row>
            </Column>
          </Column>

          <Column flex={6} minWidth={0} fillWidth>
            <SmartLink
              href={lead.url}
              unstyled
              fillWidth
              target="_blank"
              rel="noopener noreferrer"
              className={styles.shotLink}
              aria-label={`${lead.name}: Website live in neuem Tab ansehen`}
            >
              <Column className={styles.shot}>
                <Image
                  className={styles.shotImg}
                  src={lead.image}
                  alt={`Website von ${lead.name}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 520px"
                />
              </Column>
              <Row gap="4" vertical="center" paddingTop="12">
                <Text variant="label-strong-s" onBackground="neutral-strong">
                  Live ansehen
                </Text>
                <Icon name="arrowUpRight" size="xs" onBackground="neutral-strong" />
              </Row>
            </SmartLink>
          </Column>
        </Row>

        <Row fillWidth gap="24" m={{ direction: "column", gap: "8" }}>
          {more.map((t, i) => (
            <Row
              key={t.name}
              flex={1}
              minWidth={0}
              gap="16"
              vertical="center"
              className={styles.side}
              style={{ "--i": i } as CSSProperties}
            >
              <Column className={styles.thumb}>
                <Image
                  className={styles.thumbImg}
                  src={t.image}
                  alt=""
                  fill
                  sizes="72px"
                />
              </Column>
              <Column gap="8" flex={1} minWidth={0}>
                <Text
                  as="blockquote"
                  className={styles.sideBody}
                  variant="body-default-m"
                  onBackground="neutral-strong"
                  style={{ margin: 0 }}
                >
                  „{t.quote}“
                </Text>
                <Column gap="2">
                  <Text className={styles.sideName} variant="label-strong-s">
                    <ClipSwap text={t.name} />
                  </Text>
                  <Text variant="label-default-s" onBackground="neutral-weak">
                    {t.meta}
                  </Text>
                </Column>
              </Column>
            </Row>
          ))}
        </Row>
      </Column>
    </Section>
  );
}
