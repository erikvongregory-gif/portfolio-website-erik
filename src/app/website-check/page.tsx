import type { Metadata } from "next";
import { Column, Heading, Icon, Row, Tag, Text } from "@once-ui-system/core";
import {
  CapacityBadge,
  CtaProof,
  HeroProof,
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
} from "@/resources";

const PAGE_PATH = "/website-check";
const PAGE_TITLE = "Kostenloser Website-Check";
const PAGE_DESCRIPTION =
  "Kostenloser Website-Check: In 24h erfährst du, was deine Website an Kunden kostet - und was sofort besser geht. Unverbindlich.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    "Website-Check kostenlos",
    "Website prüfen lassen",
    "Website Analyse",
    "Webdesign Check",
    "Website Conversion Check",
  ],
  alternates: { canonical: PAGE_PATH },
  openGraph: createPageOpenGraph({
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    path: PAGE_PATH,
  }),
  twitter: createPageTwitter(PAGE_TITLE, PAGE_DESCRIPTION),
};

const objections: { q: string; a: string }[] = [
  {
    q: "Kostet mich das etwas?",
    a: "Nein. Der Check ist 0 € - ohne Abo, ohne Verpflichtung.",
  },
  {
    q: "Muss ich danach etwas kaufen?",
    a: "Nein. Du bekommst Feedback. Ob du danach etwas änderst, entscheidest du allein.",
  },
  {
    q: "Wie lange dauert das?",
    a: "Eintragen: unter 1 Minute. Feedback: innerhalb von 24 Stunden.",
  },
];

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
      name: "Kostenloser Website-Check",
      description: PAGE_DESCRIPTION,
      provider: { "@id": `${baseURL}/#business` },
      areaServed: "DE",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${baseURL}${PAGE_PATH}#faq`,
      mainEntity: objections.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    },
  ],
};

export default function WebsiteCheckPage() {
  return (
    <Column fillWidth horizontal="center">
      <JsonLd data={structuredData} />

      <Column
        as="section"
        data-sticky-cta-hero
        fillWidth
        horizontal="center"
        paddingX="l"
        paddingTop="104"
        paddingBottom="48"
        m={{ paddingTop: "88", paddingBottom: "40" }}
        style={{ minHeight: "100svh" }}
      >
        <Row
          fillWidth
          maxWidth={68}
          gap="40"
          vertical="center"
          s={{ direction: "column", gap: "32" }}
        >
          <Column flex={5} gap="0" horizontal="start" align="left" maxWidth={30}>
            <Reveal y={12}>
              <Column paddingBottom="16">
                <CapacityBadge
                  compact
                  taken={3}
                  total={4}
                  label="Nur noch wenige Check-Slots diese Woche"
                />
              </Column>
            </Reveal>

            <Reveal delay={0.04}>
              <Tag size="s" variant="neutral">
                100 % kostenlos
              </Tag>
            </Reveal>

            <Reveal delay={0.08}>
              <Heading
                as="h1"
                variant="display-strong-l"
                onBackground="neutral-strong"
                wrap="balance"
                style={{ letterSpacing: "-0.04em", lineHeight: 1.02, marginTop: "0.85rem" }}
              >
                Finde heraus, warum deine Website{" "}
                <Text as="span" onBackground="neutral-weak">
                  keine Anfragen bringt.
                </Text>
              </Heading>
            </Reveal>

            <Reveal delay={0.12}>
              <Text
                variant="body-default-l"
                onBackground="neutral-weak"
                wrap="balance"
                style={{ maxWidth: "30rem", lineHeight: 1.5, marginTop: "1rem" }}
              >
                Schick mir deine URL. In 24h bekommst du eine ehrliche Einschätzung: was dich
                Kunden kostet und was sofort besser geht.
              </Text>
            </Reveal>

            <Reveal delay={0.16}>
              <Column gap="12" paddingTop="24" m={{ hide: true }}>
                <CtaProof />
                <HeroProof />
              </Column>
            </Reveal>
          </Column>

          <Column
            flex={5}
            fillWidth
            id="check"
            s={{ style: { order: -1 } }}
            style={{ scrollMarginTop: "88px" }}
          >
            <Reveal delay={0.06}>
              <WebsiteCheckForm />
            </Reveal>
          </Column>
        </Row>

        <Reveal delay={0.18}>
          <Column fillWidth maxWidth={68} paddingTop="32" hide m={{ hide: false }} gap="16">
            <CtaProof />
            <HeroProof />
          </Column>
        </Reveal>
      </Column>

      <Section id="warum" background="surface" paddingY="64" gap="32">
        <Reveal>
          <Heading
            as="h2"
            variant="display-strong-s"
            onBackground="neutral-strong"
            wrap="balance"
            style={{ letterSpacing: "-0.03em", lineHeight: 1.05, maxWidth: "22ch" }}
          >
            Was du nach dem Check weißt
          </Heading>
        </Reveal>

        <Column fillWidth gap="0">
          {[
            {
              title: "Wo Besucher abspringen",
              body: "Erster Eindruck, Vertrauen, Mobile - die Stellen, an denen Kunden dich verlassen.",
            },
            {
              title: "Ob deine Botschaft sitzt",
              body: "Versteht jemand in 5 Sekunden, was du anbietest und warum er dich anfragen soll?",
            },
            {
              title: "Was sich zuerst lohnt",
              body: "Keine 20er-To-do-Liste. Die 2-3 Hebel, die den größten Unterschied machen.",
            },
          ].map((item, index) => (
            <Reveal key={item.title} delay={index * 0.05}>
              <Row
                fillWidth
                gap="20"
                paddingY="20"
                vertical="start"
                borderTop="neutral-alpha-weak"
                s={{ direction: "column", gap: "8" }}
              >
                <Row gap="12" vertical="center" style={{ minWidth: "14rem" }}>
                  <Icon name="check" size="s" onBackground="brand-strong" />
                  <Text variant="heading-strong-s" onBackground="neutral-strong">
                    {item.title}
                  </Text>
                </Row>
                <Text variant="body-default-m" onBackground="neutral-weak" style={{ maxWidth: "34rem" }}>
                  {item.body}
                </Text>
              </Row>
            </Reveal>
          ))}
        </Column>
      </Section>

      <Section id="faq" paddingY="64" gap="24" maxWidth={48}>
        <Reveal>
          <Heading
            as="h2"
            variant="heading-strong-l"
            onBackground="neutral-strong"
            wrap="balance"
            style={{ letterSpacing: "-0.02em" }}
          >
            Noch unsicher?
          </Heading>
        </Reveal>

        <Column fillWidth gap="8">
          {objections.map((item, index) => (
            <Reveal key={item.q} delay={index * 0.04}>
              <Column
                fillWidth
                gap="4"
                padding="20"
                background="surface"
                border="neutral-alpha-weak"
                radius="l"
              >
                <Text variant="label-strong-m" onBackground="neutral-strong">
                  {item.q}
                </Text>
                <Text variant="body-default-m" onBackground="neutral-weak">
                  {item.a}
                </Text>
              </Column>
            </Reveal>
          ))}
        </Column>
      </Section>

      <Section id="kontakt" paddingY="64" gap="24">
        <Column fillWidth horizontal="center" align="center" gap="12" maxWidth={36}>
          <Reveal>
            <Heading
              as="h2"
              variant="display-strong-s"
              onBackground="neutral-strong"
              wrap="balance"
              align="center"
              style={{ letterSpacing: "-0.03em", lineHeight: 1.05 }}
            >
              Bereit? Dauert unter einer Minute.
            </Heading>
          </Reveal>
          <Reveal delay={0.06}>
            <Text
              variant="body-default-m"
              onBackground="neutral-weak"
              align="center"
              wrap="balance"
            >
              URL + E-Mail. Fertig. Du bekommst persönliches Feedback - kostenlos.
            </Text>
          </Reveal>
        </Column>

        <Reveal delay={0.1}>
          <Column fillWidth maxWidth={28} style={{ marginInline: "auto" }}>
            <WebsiteCheckForm idPrefix="bottom-" />
          </Column>
        </Reveal>
      </Section>

      <StickyMobileCta
        label="Kostenlos prüfen lassen"
        buttonLabel="Jetzt starten"
        href="#check"
      />
      <SiteFooter minimal />
    </Column>
  );
}
