"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Column, Heading, Icon, Row, SmartLink, Text } from "@once-ui-system/core";
import classNames from "classnames";
import Image from "next/image";
import { gsap, useGsapScene } from "@/components/motion/gsap";
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
  image: "/images/projects/da-peppe/hero-card.webp",
  url: "https://da-peppe.com",
};

const more = [
  {
    name: "Ingenieurbüro Jungen",
    meta: "Industrie, Automation",
    quote: "Direkt und unkompliziert. Das Ergebnis wirkt endlich so professionell wie unsere Arbeit.",
    image: "/images/projects/ib-jungen/hero-card.webp",
  },
  {
    name: "Lünebräu",
    meta: "Craft-Bier, Lüneburg",
    quote: "Vom ersten Entwurf an hat man gemerkt, dass Erik unsere Marke verstanden hat.",
    image: "/images/projects/lunebraeu/hero-card.webp",
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

  useGsapScene(rootRef, ({ motion, desktop }, scope) => {
    if (!motion) return;
    const q = gsap.utils.selector(scope);

    // Zitat liest sich Wort für Wort mit.
    gsap.fromTo(
      q("[data-qword]"),
      { opacity: 0.22 },
      {
        opacity: 1,
        ease: "none",
        stagger: 0.1,
        scrollTrigger: { trigger: q("[data-quote]")[0], start: "top 75%", end: "bottom 40%", scrub: 0.6 },
      },
    );

    // Großes Anführungszeichen wandert und dreht leicht.
    gsap.fromTo(
      q("[data-qmark]"),
      { yPercent: 30, rotate: -12, opacity: 0 },
      {
        yPercent: -20,
        rotate: 4,
        opacity: 1,
        ease: "none",
        scrollTrigger: { trigger: scope, start: "top 80%", end: "bottom 30%", scrub: true },
      },
    );

    // Sterne ploppen nacheinander auf.
    gsap.from(q("[data-star]"), {
      scale: 0,
      rotate: -90,
      opacity: 0,
      duration: 0.5,
      ease: "back.out(3)",
      stagger: 0.08,
      scrollTrigger: { trigger: q("[data-stars]")[0], start: "top 80%", once: true },
    });

    // Screenshot-Parallaxe.
    gsap.fromTo(
      q("[data-parallax]"),
      { yPercent: -6 },
      {
        yPercent: 6,
        ease: "none",
        scrollTrigger: { trigger: q("[data-parallax]")[0], start: "top bottom", end: "bottom top", scrub: true },
      },
    );

    // Weitere Stimmen gleiten von den Seiten ein.
    if (desktop) {
      gsap.fromTo(
        q("[data-side]"),
        { x: (i: number) => (i === 0 ? -60 : 60) },
        {
          x: 0,
          ease: "power2.out",
          scrollTrigger: { trigger: q("[data-side]")[0], start: "top 95%", end: "top 60%", scrub: 0.6 },
        },
      );
    }
  });

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
          <Column flex={6} gap="20" minWidth={0} className={styles.leadCol}>
            <span className={styles.qmark} data-qmark aria-hidden="true">
              “
            </span>
            <Row gap="4" className={styles.stars} data-stars aria-label="5 von 5 Sternen">
              {[0, 1, 2, 3, 4].map((s) => (
                <span key={s} className={styles.star} data-star aria-hidden="true">
                  ★
                </span>
              ))}
            </Row>
            <Text className={styles.leadName} variant="display-strong-s" onBackground="neutral-strong">
              <span className={styles.leadNameInner}>{lead.name}</span>
            </Text>
            <Text as="blockquote" className={styles.quote} data-quote>
              {lead.quoteLines.map((line, i) => {
                const last = i === lead.quoteLines.length - 1;
                const text = `${i === 0 ? "„" : ""}${line}${last ? "“" : ""}`;
                return (
                  <span key={line} className={styles.qLine} style={{ "--q": i } as CSSProperties}>
                    <span className={styles.qInner}>
                      {text.split(" ").map((w, j, arr) => (
                        <span key={j} className={styles.qWord} data-qword>
                          {w}
                          {j < arr.length - 1 ? " " : ""}
                        </span>
                      ))}
                    </span>
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
                <span className={styles.parallax} data-parallax>
                  <Image
                    className={styles.shotImg}
                    src={lead.image}
                    alt={`Website von ${lead.name}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, (min-width: 1921px) 31vw, 600px"
                  />
                </span>
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
              data-side
            >
              <Column className={styles.thumb}>
                <Image
                  className={styles.thumbImg}
                  src={t.image}
                  alt=""
                  fill
                  sizes="(min-width: 1921px) 3.75vw, 72px"
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
