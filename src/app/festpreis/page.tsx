import type { Metadata } from "next";
import Image from "next/image";
import { Button, Column, Heading, Row, Tag, Text } from "@once-ui-system/core";
import {
  LandingAtmosphere,
  MotifBirds,
  MotifCheck,
  MotifDivider,
  MotifHills,
  MotifStep,
  Reveal,
  Section,
  SiteFooter,
  StickyMobileCta,
} from "@/components";
import { WebsiteCheckForm } from "@/components/WebsiteCheckForm";
import { JsonLd } from "@/components/JsonLd";
import {
  baseURL,
  createPageOpenGraph,
  createPageTwitter,
  festpreisOgImage,
} from "@/resources";
import styles from "./page.module.scss";

const PAGE_PATH = "/festpreis";
const PAGE_TITLE = "Was kostet eine Website ohne Template-Look?";
const PAGE_DESCRIPTION =
  "Festpreis-Angebot in 24h: Individuelle Websites aus Landsberg am Lech – kein Baukasten, kein Theme. Für Betriebe in Bayern.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    "Website Kosten",
    "Festpreis Website",
    "Webdesign Bayern",
    "Webdesign Landsberg",
    "Website ohne Template",
    "Individuelle Website Kosten",
  ],
  alternates: { canonical: PAGE_PATH },
  openGraph: createPageOpenGraph({
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    path: PAGE_PATH,
    image: festpreisOgImage,
  }),
  twitter: createPageTwitter(PAGE_TITLE, PAGE_DESCRIPTION, festpreisOgImage),
};

const deliverables = [
  "Einmaliges Design, direkt auf dich zugeschnitten",
  "Programmierung von Hand, kein Theme",
  "Texte und Bilder später selbst änderbar",
  "Impressum, Datenschutz und Cookie-Setup inklusive",
  "SEO- und mobil-optimiert",
  "Code und Zugänge gehören dir",
] as const;

const steps = [
  {
    n: "01",
    title: "Anfrage",
    body: "Eine Minute Funnel. Innerhalb von 24 Stunden: schriftliches Festpreis-Angebot.",
    day: "Tag 1",
  },
  {
    n: "02",
    title: "Freigabe",
    body: "Passt das Angebot, gibst du frei und zahlst die Hälfte. Der Rest erst bei Übergabe.",
    day: "Tag 2",
  },
  {
    n: "03",
    title: "Erste Version",
    body: "Nach wenigen Tagen steht deine Seite auf einer Test-URL – mobil, mit echten Inhalten.",
    day: "Tag 3–5",
  },
  {
    n: "04",
    title: "Feinschliff & Go-Live",
    body: "Änderungen umsetzen, live auf deiner Domain. Danach gehört alles dir.",
    day: "Tag 5–7",
  },
] as const;

const faqs: { q: string; a: string }[] = [
  {
    q: "Warum steht hier kein Preis?",
    a: "Weil jede Seite einzeln gebaut wird. Statt einer „ab“-Zahl bekommst du deinen tatsächlichen Festpreis – schriftlich, innerhalb von 24 Stunden.",
  },
  {
    q: "Kommen nach dem Festpreis noch Kosten dazu?",
    a: "Nein. Der Preis steht vorher fest. Laufend zahlst du nur Domain und Hosting bei deinem Anbieter – meist unter zehn Euro im Monat, nichts davon an mich.",
  },
  {
    q: "Wie läuft die Bezahlung?",
    a: "50/50. Hälfte bei Freigabe, Hälfte bei Übergabe wenn die Seite live ist. Kein Abo danach.",
  },
  {
    q: "Wie schnell ist die Seite online?",
    a: "In der Regel innerhalb einer Woche. Viele Projekte sind früher fertig – je nach Umfang.",
  },
  {
    q: "Ich habe schon Wix oder Squarespace. Geht ein Umzug?",
    a: "Ja. Ich übernehme Inhalte, baue neu von Grund auf und kümmere mich um die Domain-Umstellung.",
  },
  {
    q: "Kann ich Texte und Bilder später selbst ändern?",
    a: "Ja – mit einfachem Bearbeitungssystem und kurzer Einweisung. Der Code gehört dir für immer.",
  },
];

const testimonials = [
  {
    quote: "Innerhalb von nur drei Tagen waren wir mit einer komplett neuen Website online.",
    name: "Da Peppe",
    meta: "Osteria · Landsberg",
  },
  {
    quote: "Direkt, ehrlich und ohne Agentur-Theater. Genau so wollten wir zusammenarbeiten.",
    name: "Regionaler Betrieb",
    meta: "Bayern",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${baseURL}${PAGE_PATH}#webpage`,
      url: `${baseURL}${PAGE_PATH}`,
      name: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      inLanguage: "de-DE",
      isPartOf: { "@id": `${baseURL}/#website` },
      about: { "@id": `${baseURL}/#business` },
    },
    {
      "@type": "Service",
      name: "Festpreis-Website Angebot",
      description: PAGE_DESCRIPTION,
      provider: { "@id": `${baseURL}/#business` },
      areaServed: ["Landsberg am Lech", "Bayern", "Deutschland"],
    },
    {
      "@type": "FAQPage",
      "@id": `${baseURL}${PAGE_PATH}#faq`,
      mainEntity: faqs.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ],
};

export default function WebsiteCheckPage() {
  return (
    <Column fillWidth horizontal="center" className={styles.page}>
      <JsonLd data={structuredData} />

      <Column
        as="section"
        className={styles.hero}
        data-sticky-cta-hero
        fillWidth
        horizontal="center"
        paddingX="l"
        paddingTop="48"
        paddingBottom="64"
        m={{ paddingTop: "40", paddingBottom: "48" }}
        position="relative"
      >
        <LandingAtmosphere />

        <Column
          className={styles.heroInner}
          fillWidth
          maxWidth={68}
          gap="24"
          horizontal="center"
          vertical="center"
          position="relative"
          s={{ maxWidth: 36, gap: "24" }}
        >
          <Reveal y={12}>
            <Column
              className={styles.heroCopy}
              gap="12"
              fillWidth
              horizontal="center"
              align="center"
            >
              <Tag size="s" variant="neutral">
                Aus Landsberg am Lech · für Bayern
              </Tag>
              <span className={styles.accentRule} aria-hidden="true" />
              <Heading
                as="h1"
                className={styles.headline}
                variant="display-strong-l"
                align="center"
                wrap="balance"
                style={{ letterSpacing: "-0.04em", lineHeight: 1.05 }}
              >
                Was kostet eine Website, die{" "}
                <Text as="span" className={styles.headlineAccent}>
                  nicht nach Template aussieht?
                </Text>
              </Heading>
              <Text
                className={styles.lede}
                variant="body-default-m"
                align="center"
                wrap="balance"
                style={{ maxWidth: "28rem", lineHeight: 1.5 }}
              >
                Kein Baukasten, kein Theme. Festpreis — schriftlich in 24 Stunden.
              </Text>
            </Column>
          </Reveal>

          <Reveal delay={0.06}>
            <Column
              className={styles.funnelCol}
              fillWidth
              id="funnel"
              style={{ scrollMarginTop: "24px" }}
            >
              <WebsiteCheckForm />
            </Column>
          </Reveal>

          <Reveal delay={0.1}>
            <Text className={styles.heroFoot} variant="label-default-s" align="center">
              Für Unternehmen, die mehr wollen als Baukasten und Template.
            </Text>
          </Reveal>
        </Column>
      </Column>

      <Section id="warum" className={styles.band} gap="24" maxWidth={48} paddingY="80">
        <Reveal>
          <Column gap="12">
            <Row gap="12" vertical="center">
              <MotifBirds />
            </Row>
            <span className={styles.accentRule} aria-hidden="true" />
            <Heading
              as="h2"
              className={styles.sectionTitle}
              variant="display-strong-s"
              wrap="balance"
              style={{ letterSpacing: "-0.03em", lineHeight: 1.08, maxWidth: "18ch" }}
            >
              Warum hier keine Preisliste steht.
            </Heading>
          </Column>
        </Reveal>
        <Reveal delay={0.06}>
          <Column gap="16" maxWidth={40}>
            <Text className={styles.lede} variant="body-default-l" style={{ lineHeight: 1.6 }}>
              Weil es keine Liste gibt. Jede Seite wird von Grund auf entworfen und programmiert —
              Aufwand hängt an Seitenanzahl, Funktionen und ob schon etwas existiert.
            </Text>
            <Text className={styles.muted} variant="body-default-m" style={{ lineHeight: 1.6 }}>
              Ein Baukasten kostet Monat für Monat. Eine große Agentur oft Wartezeiten und Templates.
              Bei mir zahlst du einmal einen Festpreis, der vorher schriftlich feststeht. Danach null
              laufende Kosten an mich — nur Domain und Hosting bei deinem Anbieter.
            </Text>
            <Button href="#funnel" variant="secondary" size="m" arrowIcon>
              Mein Angebot anfordern
            </Button>
          </Column>
        </Reveal>
        <MotifDivider />
      </Section>

      <Section id="leistung" className={styles.bandAlt} gap="32" maxWidth={48} paddingY="80">
        <Reveal>
          <Column gap="12">
            <Tag size="s" variant="neutral">
              Im Festpreis
            </Tag>
            <Heading
              as="h2"
              className={styles.sectionTitle}
              variant="display-strong-s"
              wrap="balance"
              style={{ letterSpacing: "-0.03em", lineHeight: 1.08 }}
            >
              Was du bekommst
            </Heading>
          </Column>
        </Reveal>
        <Column className={styles.deliverables} gap="8" fillWidth>
          {deliverables.map((item, index) => (
            <Reveal key={item} delay={index * 0.04}>
              <Row className={styles.deliverable} gap="12" vertical="center" fillWidth>
                <MotifCheck />
                <Text className={styles.lede} variant="body-default-m">
                  {item}
                </Text>
              </Row>
            </Reveal>
          ))}
        </Column>
      </Section>

      <Section id="stimmen" className={styles.band} gap="32" maxWidth={48} paddingY="80">
        <Reveal>
          <Column gap="8">
            <Row gap="12" vertical="center">
              <MotifHills />
            </Row>
            <Heading
              as="h2"
              className={styles.sectionTitle}
              variant="display-strong-s"
              wrap="balance"
              style={{ letterSpacing: "-0.03em", lineHeight: 1.08 }}
            >
              Was Kunden sagen
            </Heading>
            <Text className={styles.muted} variant="body-default-m">
              Echte Projekte aus der Region — und darüber hinaus.
            </Text>
          </Column>
        </Reveal>
        <Column className={styles.quotes} gap="16" fillWidth>
          {testimonials.map((t, index) => (
            <Reveal key={t.name} delay={index * 0.06}>
              <Column className={styles.illustCard} fillWidth gap="12" padding="24">
                <Text className={styles.quoteMark} aria-hidden="true">
                  „
                </Text>
                <Text className={styles.lede} variant="body-default-l" style={{ lineHeight: 1.5 }}>
                  {t.quote}
                </Text>
                <Text className={styles.sectionTitle} variant="label-strong-s">
                  {t.name}
                </Text>
                <Text className={styles.muted} variant="label-default-s">
                  {t.meta}
                </Text>
              </Column>
            </Reveal>
          ))}
        </Column>
      </Section>

      <Section id="ablauf" className={styles.bandAlt} gap="32" maxWidth={48} paddingY="80">
        <Reveal>
          <Column gap="12">
            <Tag size="s" variant="neutral">
              So läuft’s
            </Tag>
            <Heading
              as="h2"
              className={styles.sectionTitle}
              variant="display-strong-s"
              wrap="balance"
              style={{ letterSpacing: "-0.03em", lineHeight: 1.08 }}
            >
              Vier Schritte zu deiner neuen Website
            </Heading>
          </Column>
        </Reveal>
        <Column className={styles.steps} gap="16" fillWidth>
          {steps.map((s, index) => (
            <Reveal key={s.n} delay={index * 0.05}>
              <Column className={styles.illustCard} fillWidth gap="12" padding="20">
                <Row fillWidth horizontal="between" vertical="center">
                  <MotifStep n={s.n} />
                  <Text className={styles.muted} variant="label-default-s">
                    {s.day}
                  </Text>
                </Row>
                <Text className={styles.sectionTitle} variant="heading-strong-s">
                  {s.title}
                </Text>
                <Text className={styles.muted} variant="body-default-s">
                  {s.body}
                </Text>
              </Column>
            </Reveal>
          ))}
        </Column>
      </Section>

      <Section id="ueber" className={styles.band} gap="32" maxWidth={48} paddingY="80">
        <Reveal>
          <Row
            className={styles.about}
            fillWidth
            gap="32"
            vertical="center"
            s={{ direction: "column", gap: "24" }}
          >
            <Column className={styles.portrait} overflow="hidden">
              <Image
                src="/images/about/erik.png"
                alt="Erik von Gregory"
                width={280}
                height={340}
                className={styles.portraitImg}
              />
              <span className={styles.portraitFrame} aria-hidden="true" />
            </Column>
            <Column gap="16" flex={1}>
              <Tag size="s" variant="neutral">
                Servus, ich bin Erik.
              </Tag>
              <span className={styles.accentRule} aria-hidden="true" />
              <Heading
                as="h2"
                className={styles.sectionTitle}
                variant="display-strong-s"
                wrap="balance"
                style={{ letterSpacing: "-0.03em", lineHeight: 1.08 }}
              >
                Aus Landsberg. Für Betriebe, die von ihrer Website leben.
              </Heading>
              <Text
                className={styles.lede}
                variant="body-default-m"
                style={{ lineHeight: 1.6, maxWidth: "36rem" }}
              >
                Design und Code aus einer Hand, ein Ansprechpartner, ein Festpreis. Kein Callcenter,
                keine Projektnummer — du sprichst mit der Person, die deine Seite wirklich baut.
                Vor Ort in Landsberg am Lech oder remote in ganz Bayern.
              </Text>
              <Row className={styles.statRow} gap="16" wrap>
                <Column className={styles.stat} gap="2">
                  <Text className={styles.sectionTitle} variant="heading-strong-m">
                    7 Tage
                  </Text>
                  <Text className={styles.muted} variant="label-default-s">
                    typisch bis live
                  </Text>
                </Column>
                <Column className={styles.stat} gap="2">
                  <Text className={styles.sectionTitle} variant="heading-strong-m">
                    50/50
                  </Text>
                  <Text className={styles.muted} variant="label-default-s">
                    faire Bezahlung
                  </Text>
                </Column>
                <Column className={styles.stat} gap="2">
                  <Text className={styles.sectionTitle} variant="heading-strong-m">
                    0 € Abo
                  </Text>
                  <Text className={styles.muted} variant="label-default-s">
                    nach Übergabe
                  </Text>
                </Column>
              </Row>
            </Column>
          </Row>
        </Reveal>
      </Section>

      <Section id="faq" className={styles.bandAlt} gap="24" maxWidth={48} paddingY="80">
        <Reveal>
          <Column gap="12">
            <Row gap="12" vertical="center">
              <MotifBirds />
            </Row>
            <Heading
              as="h2"
              className={styles.sectionTitle}
              variant="heading-strong-l"
              wrap="balance"
              style={{ letterSpacing: "-0.02em" }}
            >
              Kurz beantwortet
            </Heading>
          </Column>
        </Reveal>
        <Column className={styles.faqs} fillWidth gap="12">
          {faqs.map((item, index) => (
            <Reveal key={item.q} delay={index * 0.03}>
              <Column className={styles.illustCard} fillWidth gap="8" padding="20">
                <Text className={styles.sectionTitle} variant="label-strong-m">
                  {item.q}
                </Text>
                <Text className={styles.muted} variant="body-default-m">
                  {item.a}
                </Text>
              </Column>
            </Reveal>
          ))}
        </Column>
      </Section>

      <Section id="abschluss" className={styles.bandCta} gap="24" maxWidth={36} paddingY="80">
        <Column fillWidth horizontal="center" align="center" gap="16">
          <Reveal>
            <MotifBirds />
          </Reveal>
          <Reveal delay={0.04}>
            <Heading
              as="h2"
              className={styles.sectionTitle}
              variant="display-strong-s"
              wrap="balance"
              align="center"
              style={{ letterSpacing: "-0.03em", lineHeight: 1.08 }}
            >
              Bereit für deinen Festpreis?
            </Heading>
          </Reveal>
          <Reveal delay={0.08}>
            <Text className={styles.muted} variant="body-default-m" align="center" wrap="balance">
              Eine Minute klicken. Angebot in 24 Stunden. Unverbindlich.
            </Text>
          </Reveal>
          <Reveal delay={0.12}>
            <Button href="#funnel" variant="primary" size="m" arrowIcon>
              Jetzt starten
            </Button>
          </Reveal>
          <MotifDivider />
        </Column>
      </Section>

      <StickyMobileCta
        label="Festpreis in 24h"
        buttonLabel="Angebot anfordern"
        href="#funnel"
      />
      <SiteFooter minimal />
    </Column>
  );
}
