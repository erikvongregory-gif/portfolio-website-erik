import type { Metadata } from "next";
import { Button, Column, Heading, Row, Tag, Text } from "@once-ui-system/core";
import {
  FollowBirds,
  LandingAtmosphere,
  LandingSun,
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
import { PriceCalculator } from "@/components/PriceCalculator";
import { JsonLd } from "@/components/JsonLd";
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  WHATSAPP_PARTNER_URL,
} from "@/lib/contact";
import {
  baseURL,
  createPageOpenGraph,
  createPageTwitter,
} from "@/resources";
import styles from "./page.module.scss";

const PAGE_PATH = "/partner";
const PAGE_TITLE = "Partnerprogramm – 30 % Provision";
const PAGE_DESCRIPTION =
  "Empfiehl EvgLab weiter und verdiene 30 % vom Auftragsvolumen. So verkaufst du Websites, Landingpages und Betreuung – klar, ehrlich, ohne Agentur-Theater.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    "Partnerprogramm Webdesign",
    "Provision Website Empfehlung",
    "EvgLab Partner",
    "Website vermitteln",
  ],
  alternates: { canonical: PAGE_PATH },
  openGraph: createPageOpenGraph({
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    path: PAGE_PATH,
  }),
  twitter: createPageTwitter(PAGE_TITLE, PAGE_DESCRIPTION),
};

const heroExamples = [
  { label: "Landingpage", price: "ab 1.500 €", provision: "~450 €" },
  { label: "Website", price: "ab 2.500 €", provision: "~750 €" },
  { label: "Mit CMS", price: "ab ~3.000 €", provision: "~900 €" },
] as const;

const earnSteps = [
  {
    n: "01",
    title: "Ansprechen",
    body: "Du kennst jemanden mit schwacher oder fehlender Website – Restaurant, Handwerk, Praxis, lokaler Betrieb.",
  },
  {
    n: "02",
    title: "Weitergeben",
    body: "Schick mir Name, Branche und Kontakt per WhatsApp. Oder leite die Festpreis-Seite weiter.",
  },
  {
    n: "03",
    title: "Verdienen",
    body: "Wird daraus ein Auftrag, bekommst du 30 % vom Auftragsvolumen – nach Zahlungseingang.",
  },
] as const;

const products = [
  {
    title: "Landingpage",
    price: "ab 1.500 €",
    provision: "~450 €",
    body: "Eine Seite, ein Ziel. Ideal für Betriebe, die Anfragen oder Termine wollen – und für Werbekampagnen.",
    points: ["Conversion-fokussiert", "Oft in ca. einer Woche live", "Perfekt als Einstieg"],
  },
  {
    title: "Komplette Website",
    price: "ab 2.500 €",
    provision: "~750 €",
    body: "Mehrseitiger Auftritt mit Design, Texten und Technik. Für Marken, die rundum überzeugen wollen.",
    points: ["Individuelles Design", "Bis ca. 5 Unterseiten", "SEO-Grundlagen inklusive"],
  },
  {
    title: "Betreuung & Support",
    price: "99 € / Monat",
    provision: "Folgegeschäft",
    body: "Updates, kleine Änderungen, Sicherheit. Kein Fokus der Erstprovision – aber oft der nächste Schritt nach dem Launch.",
    points: ["Monatlich kündbar", "Fester Ansprechpartner", "Seite bleibt gepflegt"],
  },
  {
    title: "Individuell",
    price: "Auf Anfrage",
    provision: "30 % vom Auftrag",
    body: "CMS, Reservierung, Sonderwünsche. Umfang und Budget klärt Erik im Gespräch – du vermittelst nur den Kontakt.",
    points: ["CMS & Tools", "Sonderfunktionen", "Persönliche Beratung"],
  },
] as const;

const sellTips = [
  {
    title: "Wen ansprechen?",
    body: "Lokale Betriebe mit veralteter, generischer oder fehlender Website. Besonders Gastronomie, Handwerk, Praxen, Studios – Leute, die von Anfragen leben.",
  },
  {
    title: "Was wirklich verkauft",
    body: "Kein Baukasten, kein Theme. Schriftlicher Festpreis in 24 Stunden. Code und Zugänge gehören dem Kunden. Ein Ansprechpartner – kein Callcenter.",
  },
  {
    title: "Sätze, die funktionieren",
    body: "„Er baut individuelle Seiten zum Festpreis – Angebot in 24h.“ / „Sieht nicht nach Template aus.“ / „Ich kann dich direkt verbinden.“",
  },
  {
    title: "Seite zum Weiterleiten",
    body: "Schick evglab.com/festpreis. Dort steht das Angebot klar – und der Interessent kann selbst starten.",
  },
] as const;

const dos = [
  "Richtpreise nennen („ab …“), nie einen finalen Preis versprechen",
  "Immer an Erik übergeben – Closing und Angebot macht er",
  "Ehrlich bleiben: Aufwand hängt am Projekt",
  "WhatsApp mit Name, Branche und Kontakt schicken",
] as const;

const donts = [
  "Keine festen Liefertermine erfinden",
  "Keine Rabatte oder Sonderkonditionen zusagen",
  "Nicht als Agentur auftreten – du empfiehlst, Erik baut",
  "Keine technischen Details erfinden, die du nicht kennst",
] as const;

const afterLead = [
  {
    n: "01",
    title: "Lead schicken",
    body: "WhatsApp: Name, Branche, Telefon oder Mail, optional kurze Notiz was gebraucht wird.",
  },
  {
    n: "02",
    title: "Erik übernimmt",
    body: "Angebot, Gespräch, Closing. Du musst nichts verkaufen, was du nicht erklären kannst.",
  },
  {
    n: "03",
    title: "Provision",
    body: "30 % vom Auftragsvolumen, sobald die Projektzahlung eingegangen ist.",
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
  ],
};

export default function PartnerPage() {
  return (
    <Column fillWidth horizontal="center" className={styles.page}>
      <JsonLd data={structuredData} />

      <Column
        as="section"
        className={styles.hero}
        data-sticky-cta-hero
        fillWidth
        horizontal="center"
        position="relative"
      >
        <LandingSun className={styles.heroSun} idPrefix="evg-partner-hero" />

        <div className={styles.heroInner}>
          <Reveal y={16}>
            <Column className={styles.rateCard} fillWidth>
              <Row fillWidth horizontal="between" vertical="start">
                <MotifHills />
                <Tag size="s" variant="neutral">
                  Partner
                </Tag>
              </Row>
              <Text as="p" className={styles.ratePercent} aria-label="30 Prozent">
                30%
              </Text>
              <Text className={styles.rateLabel} variant="body-default-s" wrap="balance">
                vom Auftragsvolumen – wenn daraus ein Projekt wird.
              </Text>
            </Column>
          </Reveal>

          <Reveal delay={0.06} y={12}>
            <Column className={styles.heroCopy} fillWidth gap="12" horizontal="start">
              <Tag size="s" variant="neutral">
                EvgLab · Empfehlungsprogramm
              </Tag>
              <span className={styles.accentRule} aria-hidden="true" />
              <Heading
                as="h1"
                className={styles.headline}
                variant="display-strong-l"
                wrap="balance"
                style={{ letterSpacing: "-0.04em", lineHeight: 1.05 }}
              >
                Du empfiehlst.{" "}
                <Text as="span" className={styles.headlineAccent}>
                  Ich baue.
                </Text>{" "}
                Du verdienst mit.
              </Heading>
              <Text
                className={styles.lede}
                variant="body-default-m"
                wrap="balance"
                style={{ maxWidth: "32rem", lineHeight: 1.55 }}
              >
                Playbook, Produkte und Preisrechner – damit du weißt, was du verkaufst und was
                bei dir ankommt.
              </Text>

              <Row className={styles.heroCtas} gap="12" wrap vertical="center">
                <Button
                  href={WHATSAPP_PARTNER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  size="m"
                  prefixIcon="whatsapp"
                >
                  Lead per WhatsApp
                </Button>
                <Button href="#rechner" variant="secondary" size="m" arrowIcon>
                  Preis & Provision
                </Button>
              </Row>

              <Column className={styles.heroExamples} fillWidth>
                {heroExamples.map((ex) => (
                  <Column key={ex.label} className={styles.heroExample} gap="2">
                    <Text className={styles.sectionTitle} variant="label-strong-s">
                      {ex.label}
                    </Text>
                    <Text className={styles.muted} variant="label-default-s">
                      {ex.price} → Provision {ex.provision}
                    </Text>
                  </Column>
                ))}
              </Column>
            </Column>
          </Reveal>
        </div>

        <div className={styles.heroBand} aria-hidden="true">
          <LandingAtmosphere />
        </div>
      </Column>

      <Section id="verdienst" className={styles.band} gap="32" maxWidth={48} paddingY="80">
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
              So verdienst du
            </Heading>
            <Text className={styles.muted} variant="body-default-m" style={{ lineHeight: 1.6 }}>
              Provision nur, wenn daraus ein Auftrag entsteht – 30 % vom Auftragsvolumen.
            </Text>
          </Column>
        </Reveal>
        <Column className={styles.steps} gap="16" fillWidth>
          {earnSteps.map((s, index) => (
            <Reveal key={s.n} delay={index * 0.05}>
              <Column className={styles.illustCard} fillWidth gap="12" padding="20">
                <MotifStep n={s.n} />
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
        <MotifDivider />
      </Section>
      <div id="warum-follow-start" aria-hidden="true" className={styles.followMarker} />

      <Section id="produkte" className={styles.bandAlt} gap="32" maxWidth={48} paddingY="80">
        <Reveal>
          <Column gap="12">
            <Tag size="s" variant="neutral">
              Was du verkaufst
            </Tag>
            <Heading
              as="h2"
              className={styles.sectionTitle}
              variant="display-strong-s"
              wrap="balance"
              style={{ letterSpacing: "-0.03em", lineHeight: 1.08 }}
            >
              Die Produkte – kurz und klar
            </Heading>
            <Text className={styles.muted} variant="body-default-m">
              Richtpreise. Die Provision-Beispiele sind grob (30 % vom Einstiegspreis).
            </Text>
          </Column>
        </Reveal>
        <Column className={styles.products} gap="16" fillWidth>
          {products.map((p, index) => (
            <Reveal key={p.title} delay={index * 0.04}>
              <Column className={styles.illustCard} fillWidth gap="12" padding="20">
                <Row fillWidth horizontal="between" vertical="start" gap="12" wrap>
                  <Text className={styles.sectionTitle} variant="heading-strong-s">
                    {p.title}
                  </Text>
                  <Column horizontal="end" gap="2">
                    <Text className={styles.productPrice} variant="label-strong-s">
                      {p.price}
                    </Text>
                    <Text className={styles.muted} variant="label-default-s">
                      Provision {p.provision}
                    </Text>
                  </Column>
                </Row>
                <Text className={styles.lede} variant="body-default-s" style={{ lineHeight: 1.55 }}>
                  {p.body}
                </Text>
                <Column gap="8" fillWidth>
                  {p.points.map((point) => (
                    <Row key={point} gap="8" vertical="center">
                      <MotifCheck />
                      <Text className={styles.muted} variant="label-default-s">
                        {point}
                      </Text>
                    </Row>
                  ))}
                </Column>
              </Column>
            </Reveal>
          ))}
        </Column>
      </Section>

      <Section id="rechner" className={styles.band} gap="24" maxWidth={48} paddingY="80">
        <Reveal>
          <Column gap="12">
            <Row gap="12" vertical="center">
              <MotifHills />
            </Row>
            <span className={styles.accentRule} aria-hidden="true" />
            <Heading
              as="h2"
              className={styles.sectionTitle}
              variant="display-strong-s"
              wrap="balance"
              style={{ letterSpacing: "-0.03em", lineHeight: 1.08 }}
            >
              Preis & Provision rechnen
            </Heading>
            <Text
              className={styles.muted}
              variant="body-default-m"
              style={{ lineHeight: 1.6, maxWidth: "36rem" }}
            >
              Stell ein typisches Projekt zusammen – siehst du den Richtpreis für den Kunden und
              deine 30 % Provision. Zum Weitergeben, nicht als finales Angebot.
            </Text>
          </Column>
        </Reveal>
        <Reveal delay={0.06}>
          <Column className={styles.calcWrap} fillWidth>
            <PriceCalculator variant="partner" defaultOpen />
          </Column>
        </Reveal>
      </Section>

      <Section id="verkauf" className={styles.bandAlt} gap="32" maxWidth={48} paddingY="80">
        <Reveal>
          <Column gap="12">
            <Tag size="s" variant="neutral">
              Playbook
            </Tag>
            <Heading
              as="h2"
              className={styles.sectionTitle}
              variant="display-strong-s"
              wrap="balance"
              style={{ letterSpacing: "-0.03em", lineHeight: 1.08 }}
            >
              So verkaufst du
            </Heading>
            <Text className={styles.muted} variant="body-default-m">
              Kurzes Playbook – genug, um sicher zu wirken, ohne Verkäufer zu spielen.
            </Text>
          </Column>
        </Reveal>
        <Column gap="16" fillWidth>
          {sellTips.map((tip, index) => (
            <Reveal key={tip.title} delay={index * 0.04}>
              <Column className={styles.illustCard} fillWidth gap="8" padding="20">
                <Text className={styles.sectionTitle} variant="label-strong-m">
                  {tip.title}
                </Text>
                <Text className={styles.lede} variant="body-default-m" style={{ lineHeight: 1.55 }}>
                  {tip.body}
                </Text>
              </Column>
            </Reveal>
          ))}
        </Column>
        <Reveal delay={0.08}>
          <Button href="/festpreis" variant="secondary" size="m" arrowIcon>
            Kunden-Seite öffnen (/festpreis)
          </Button>
        </Reveal>
      </Section>

      <Section id="regeln" className={styles.band} gap="32" maxWidth={48} paddingY="80">
        <Reveal>
          <Column gap="12">
            <Tag size="s" variant="neutral">
              Wichtig
            </Tag>
            <Heading
              as="h2"
              className={styles.sectionTitle}
              variant="display-strong-s"
              wrap="balance"
              style={{ letterSpacing: "-0.03em", lineHeight: 1.08 }}
            >
              Do’s und Don’ts
            </Heading>
          </Column>
        </Reveal>
        <Column className={styles.rules} gap="16" fillWidth>
          <Reveal>
            <Column className={styles.illustCard} fillWidth gap="12" padding="20">
              <Text className={styles.sectionTitle} variant="heading-strong-s">
                So ja
              </Text>
              <Column className={styles.checklist} gap="8" fillWidth>
                {dos.map((item) => (
                  <Row key={item} className={styles.checkItem} gap="12" vertical="center" fillWidth>
                    <MotifCheck />
                    <Text className={styles.lede} variant="body-default-s">
                      {item}
                    </Text>
                  </Row>
                ))}
              </Column>
            </Column>
          </Reveal>
          <Reveal delay={0.06}>
            <Column className={styles.illustCard} fillWidth gap="12" padding="20">
              <Text className={styles.sectionTitle} variant="heading-strong-s">
                Bitte nicht
              </Text>
              <Column gap="8" fillWidth>
                {donts.map((item) => (
                  <Row key={item} className={styles.dontItem} gap="12" vertical="center" fillWidth>
                    <Text className={styles.muted} variant="label-strong-s" aria-hidden="true">
                      –
                    </Text>
                    <Text className={styles.lede} variant="body-default-s">
                      {item}
                    </Text>
                  </Row>
                ))}
              </Column>
            </Column>
          </Reveal>
        </Column>
      </Section>

      <Section id="ablauf" className={styles.bandAlt} gap="32" maxWidth={48} paddingY="80">
        <Reveal>
          <Column gap="12">
            <Row gap="12" vertical="center">
              <MotifBirds />
            </Row>
            <Heading
              as="h2"
              className={styles.sectionTitle}
              variant="display-strong-s"
              wrap="balance"
              style={{ letterSpacing: "-0.03em", lineHeight: 1.08 }}
            >
              Nach dem Lead
            </Heading>
            <Text className={styles.muted} variant="body-default-m">
              Du bringst den Kontakt. Den Rest mache ich.
            </Text>
          </Column>
        </Reveal>
        <Column className={styles.flow} gap="16" fillWidth>
          {afterLead.map((s, index) => (
            <Reveal key={s.n} delay={index * 0.05}>
              <Column className={styles.illustCard} fillWidth gap="12" padding="20">
                <MotifStep n={s.n} />
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

      <Section id="kontakt" className={styles.bandCta} gap="24" maxWidth={36} paddingY="80">
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
              Lead da? Schreib mir.
            </Heading>
          </Reveal>
          <Reveal delay={0.08}>
            <Text className={styles.muted} variant="body-default-m" align="center" wrap="balance">
              WhatsApp reicht. Name, Branche, Kontakt – ich melde mich.
            </Text>
          </Reveal>
          <Reveal delay={0.12}>
            <Row gap="12" wrap horizontal="center">
              <Button
                href={WHATSAPP_PARTNER_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                size="m"
                prefixIcon="whatsapp"
              >
                WhatsApp
              </Button>
              <Button href={CONTACT_PHONE_TEL} variant="secondary" size="m">
                {CONTACT_PHONE_DISPLAY}
              </Button>
            </Row>
          </Reveal>
          <MotifDivider />
        </Column>
      </Section>

      <FollowBirds />
      <StickyMobileCta
        label="30 % bei Auftrag"
        buttonLabel="WhatsApp"
        href={WHATSAPP_PARTNER_URL}
        whatsappHref={WHATSAPP_PARTNER_URL}
      />
      <SiteFooter minimal />
    </Column>
  );
}
