import type { Metadata } from "next";
import {
  Column,
  Grid,
  Heading,
  Icon,
  type IconName,
  Row,
  SmartLink,
  Tag,
  Text,
} from "@once-ui-system/core";
import {
  FinalCta,
  Reveal,
  Section,
  SectionHeader,
  SiteFooter,
  SpotlightCard,
} from "@/components";
import { ContactDialog } from "@/components/ContactDialog";
import { JsonLd } from "@/components/JsonLd";
import {
  baseURL,
  createPageOpenGraph,
  createPageTwitter,
} from "@/resources";

const PAGE_PATH = "/webdesign-landsberg";
const PAGE_TITLE = "Webdesign Landsberg am Lech";
const PAGE_DESCRIPTION =
  "Webdesign Landsberg am Lech: individuelle Websites & Landingpages von Erik EvgLab. Lokal erreichbar, ohne Template-Look – Anfragen, die wirklich kommen.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    "Webdesign Landsberg",
    "Webdesign Landsberg am Lech",
    "Webdesigner Landsberg",
    "Website erstellen Landsberg",
    "Webentwicklung Landsberg am Lech",
    "Landingpage Landsberg",
  ],
  alternates: { canonical: PAGE_PATH },
  openGraph: createPageOpenGraph({
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    path: PAGE_PATH,
  }),
  twitter: createPageTwitter(PAGE_TITLE, PAGE_DESCRIPTION),
};

const benefits: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "sparkle",
    title: "Kein Baukasten-Look",
    body: "Jede Website wird individuell gestaltet – damit du in Landsberg und online nicht wie die Konkurrenz aussiehst.",
  },
  {
    icon: "person",
    title: "Direkt mit mir",
    body: "Kein Account-Manager, kein Junior. Du sprichst durchgehend mit Erik – von der Idee bis nach dem Launch.",
  },
  {
    icon: "document",
    title: "Klarer Ablauf",
    body: "Konzept, Design, Entwicklung, Launch. Transparente Richtpreise und in der Regel in wenigen Tagen live.",
  },
  {
    icon: "world",
    title: "Lokal & erreichbar",
    body: "Für Unternehmen in Landsberg am Lech und Umgebung: persönlich vor Ort oder remote – wie es für dich passt.",
  },
];

const services: { title: string; price: string; body: string }[] = [
  {
    title: "Komplette Website",
    price: "ab 2.500 €",
    body: "Mehrseitiger Auftritt mit Design, Texten und Technik – für Marken aus Landsberg, die rundum überzeugen wollen.",
  },
  {
    title: "Landingpage",
    price: "ab 1.500 €",
    body: "Eine Seite, ein Ziel. Ideal für Angebote, Kampagnen und lokale Sichtbarkeit mit klarer Call-to-Action.",
  },
  {
    title: "Betreuung & Support",
    price: "99 € / Monat",
    body: "Updates, kleine Änderungen und Sicherheit – damit deine Website aktuell, schnell und gepflegt bleibt.",
  },
];

const regions = [
  "Landsberg am Lech",
  "Kaufering",
  "Pürgen",
  "Dießen am Ammersee",
  "Fuchstal",
  "Schondorf",
  "Windach",
  "Region Bayerisches Schwaben",
];

const faqs: { question: string; answer: string }[] = [
  {
    question: "Bietest du Webdesign in Landsberg am Lech an?",
    answer:
      "Ja. EvgLab steht für Webdesign und Webentwicklung für Unternehmen in Landsberg am Lech und der Region. Ich gestalte individuelle Websites und Landingpages – ohne Template-Look, mit Fokus auf Anfragen.",
  },
  {
    question: "Kann man sich vor Ort in Landsberg treffen?",
    answer:
      "Gerne. Für Kundinnen und Kunden aus Landsberg am Lech und Umgebung sind persönliche Treffen möglich. Viele Projekte laufen aber auch komplett remote – je nachdem, was für dich praktischer ist.",
  },
  {
    question: "Was kostet eine Website bei dir?",
    answer:
      "Richtpreise: komplette Website ab 2.500 €, Landingpage ab 1.500 €, Betreuung ab 99 € monatlich. Den genauen Umfang klären wir im kostenlosen Erstgespräch.",
  },
  {
    question: "Wie lange dauert ein typisches Projekt?",
    answer:
      "Viele Landingpages und kompakte Auftritte sind in etwa sieben Tagen live. Größere Websites brauchen je nach Umfang etwas länger – den Zeitplan besprechen wir vorher verbindlich.",
  },
  {
    question: "Machst du auch SEO für lokale Suchanfragen?",
    answer:
      "Ja, als Grundlage: klare Struktur, sinnvolle Texte, technische Basics und lokale Relevanz. Für laufendes Ranking gehören dazu oft auch Google-Unternehmensprofil und Bewertungen – dazu berate ich dich ehrlich.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${baseURL}/#website`,
      url: baseURL,
      name: "Erik EvgLab",
      inLanguage: "de-DE",
      publisher: { "@id": `${baseURL}/#business` },
    },
    {
      "@type": "WebPage",
      "@id": `${baseURL}${PAGE_PATH}#webpage`,
      url: `${baseURL}${PAGE_PATH}`,
      name: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      inLanguage: "de-DE",
      isPartOf: { "@id": `${baseURL}/#website` },
      about: { "@id": `${baseURL}/#business` },
      breadcrumb: { "@id": `${baseURL}${PAGE_PATH}#breadcrumb` },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${baseURL}/opengraph-image`,
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${baseURL}${PAGE_PATH}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Start",
          item: baseURL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Webdesign Landsberg am Lech",
          item: `${baseURL}${PAGE_PATH}`,
        },
      ],
    },
    {
      "@type": "ProfessionalService",
      "@id": `${baseURL}/#business`,
      name: "EvgLab",
      alternateName: "Erik EvgLab",
      url: baseURL,
      image: `${baseURL}/opengraph-image`,
      email: "info@evglab.com",
      telephone: "+4915565602176",
      priceRange: "€€",
      description: PAGE_DESCRIPTION,
      serviceType: ["Webdesign", "Webentwicklung", "Landingpage-Design", "Website-Betreuung"],
      address: {
        "@type": "PostalAddress",
        streetAddress: "Hauptstraße 18",
        postalCode: "86925",
        addressLocality: "Fuchstal",
        addressRegion: "Bayern",
        addressCountry: "DE",
      },
      areaServed: [
        { "@type": "City", name: "Landsberg am Lech" },
        { "@type": "City", name: "Kaufering" },
        { "@type": "City", name: "Dießen am Ammersee" },
        { "@type": "City", name: "Fuchstal" },
        { "@type": "AdministrativeArea", name: "Bayern" },
      ],
      founder: {
        "@type": "Person",
        name: "Erik von Gregory",
      },
      knowsLanguage: ["de"],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Webdesign Landsberg am Lech",
        itemListElement: services.map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.title,
            description: service.body,
            areaServed: "Landsberg am Lech",
          },
        })),
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${baseURL}${PAGE_PATH}#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ],
};

export default function WebdesignLandsbergPage() {
  return (
    <Column fillWidth horizontal="center">
      <JsonLd data={structuredData} />

      <Column
        as="section"
        fillWidth
        horizontal="center"
        paddingX="l"
        paddingTop="160"
        paddingBottom="64"
      >
        <Column fillWidth maxWidth={52} gap="24" horizontal="start" align="left">
          <Reveal y={16}>
            <Row gap="8" vertical="center" wrap>
              <SmartLink href="/">
                <Text variant="label-default-s" onBackground="neutral-weak">
                  Start
                </Text>
              </SmartLink>
              <Text variant="label-default-s" onBackground="neutral-weak" aria-hidden="true">
                /
              </Text>
              <Text variant="label-default-s" onBackground="neutral-medium">
                Webdesign Landsberg am Lech
              </Text>
            </Row>
          </Reveal>

          <Reveal delay={0.06}>
            <Tag size="s" variant="neutral">
              Lokal · Landsberg am Lech & Umgebung
            </Tag>
          </Reveal>

          <Reveal delay={0.1}>
            <Heading
              as="h1"
              variant="display-strong-l"
              onBackground="neutral-strong"
              wrap="balance"
              style={{ letterSpacing: "-0.035em", lineHeight: 1.02 }}
            >
              Webdesign Landsberg am Lech –{" "}
              <Text as="span" onBackground="neutral-weak">
                Websites mit Charakter, die Anfragen bringen.
              </Text>
            </Heading>
          </Reveal>

          <Reveal delay={0.16}>
            <Text
              variant="body-default-xl"
              onBackground="neutral-weak"
              wrap="balance"
              style={{ maxWidth: "40rem", lineHeight: 1.5 }}
            >
              Du suchst einen Webdesigner in Landsberg am Lech? Ich gestalte und entwickle
              individuelle Websites und Landingpages für Unternehmen aus der Region – ohne
              Vorlagen-Look, mit klarer Botschaft und dem Ziel, dass Interessenten dich
              kontaktieren.
            </Text>
          </Reveal>

          <Reveal delay={0.2}>
            <Row gap="16" wrap vertical="center" paddingTop="8">
              <ContactDialog label="Kostenloses Erstgespräch" size="l" />
              <SmartLink href="/#projekte" unstyled>
                <Text variant="label-strong-s" onBackground="neutral-strong">
                  Projekte ansehen
                </Text>
              </SmartLink>
            </Row>
          </Reveal>

          <Reveal delay={0.24}>
            <Text variant="label-default-s" onBackground="neutral-weak">
              Antwort innerhalb 24h · Vor Ort oder remote · Aus der Region Landsberg
            </Text>
          </Reveal>
        </Column>
      </Column>

      <Section id="warum" background="surface">
        <SectionHeader
          eyebrow="Warum EvgLab"
          title={
            <>
              Webdesign aus der Region –{" "}
              <Text as="span" onBackground="neutral-weak">
                ohne Agentur-Overhead.
              </Text>
            </>
          }
          description="Für Betriebe, Praxen, Gastronomie und Marken in Landsberg am Lech, die online professionell wirken und gefunden werden wollen."
        />

        <Grid columns="2" m={{ columns: "1" }} gap="16">
          {benefits.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06}>
              <Column fillHeight>
                <SpotlightCard
                  background="page"
                  border="neutral-alpha-weak"
                  radius="l"
                  padding="32"
                  gap="16"
                  fillHeight
                >
                  <Icon name={item.icon} size="m" onBackground="neutral-strong" />
                  <Text variant="heading-strong-s" onBackground="neutral-strong">
                    {item.title}
                  </Text>
                  <Text variant="body-default-m" onBackground="neutral-weak">
                    {item.body}
                  </Text>
                </SpotlightCard>
              </Column>
            </Reveal>
          ))}
        </Grid>
      </Section>

      <Section id="leistungen">
        <SectionHeader
          eyebrow="Leistungen"
          title={
            <>
              Was ich als Webdesigner in Landsberg{" "}
              <Text as="span" onBackground="neutral-weak">
                für dich baue.
              </Text>
            </>
          }
          description="Transparente Richtpreise. Den konkreten Umfang klären wir im Gespräch – ehrlich und ohne Druck."
        />

        <Grid columns="3" m={{ columns: "1" }} gap="16">
          {services.map((service, index) => (
            <Reveal key={service.title} delay={index * 0.06}>
              <Column fillHeight>
                <SpotlightCard
                  background="surface"
                  border="neutral-alpha-weak"
                  radius="l"
                  padding="32"
                  gap="12"
                  fillHeight
                >
                  <Text variant="heading-strong-s" onBackground="neutral-strong">
                    {service.title}
                  </Text>
                  <Text variant="label-strong-m" onBackground="neutral-medium">
                    {service.price}
                  </Text>
                  <Text variant="body-default-m" onBackground="neutral-weak">
                    {service.body}
                  </Text>
                </SpotlightCard>
              </Column>
            </Reveal>
          ))}
        </Grid>

        <Reveal delay={0.12}>
          <Text variant="body-default-m" onBackground="neutral-weak">
            Mehr Details und Beispiele findest du auf der{" "}
            <SmartLink href="/">
              <Text as="span" variant="body-default-m">
                Startseite
              </Text>
            </SmartLink>{" "}
            und unter{" "}
            <SmartLink href="/#leistungen">
              <Text as="span" variant="body-default-m">
                Leistungen
              </Text>
            </SmartLink>
            .
          </Text>
        </Reveal>
      </Section>

      <Section id="region" background="surface">
        <SectionHeader
          eyebrow="Einzugsgebiet"
          title={
            <>
              Webdesign für Landsberg am Lech{" "}
              <Text as="span" onBackground="neutral-weak">
                und Umgebung.
              </Text>
            </>
          }
          description="Ich betreue Projekte in Landsberg am Lech und den umliegenden Orten – persönlich erreichbar, wenn du jemanden vor Ort schätzt."
        />

        <Row gap="8" wrap>
          {regions.map((region) => (
            <Tag key={region} size="m" variant="neutral">
              {region}
            </Tag>
          ))}
        </Row>

        <Text variant="body-default-m" onBackground="neutral-weak" style={{ maxWidth: "42rem" }}>
          Rechtlicher Sitz: Fuchstal. Servicegebiet und Fokus: Landsberg am Lech sowie die Region –
          damit Name, Ort und Angebot für Google und Kundinnen klar zusammenpassen.
        </Text>
      </Section>

      <Section id="faq">
        <SectionHeader
          eyebrow="FAQ"
          title={
            <>
              Häufige Fragen zu Webdesign in{" "}
              <Text as="span" onBackground="neutral-weak">
                Landsberg am Lech.
              </Text>
            </>
          }
        />

        <Column fillWidth gap="16" maxWidth={48}>
          {faqs.map((faq, index) => (
            <Reveal key={faq.question} delay={index * 0.04}>
              <Column
                fillWidth
                gap="8"
                padding="24"
                background="surface"
                border="neutral-alpha-weak"
                radius="l"
              >
                <Heading as="h3" variant="heading-strong-s" onBackground="neutral-strong">
                  {faq.question}
                </Heading>
                <Text variant="body-default-m" onBackground="neutral-weak">
                  {faq.answer}
                </Text>
              </Column>
            </Reveal>
          ))}
        </Column>

        <Reveal delay={0.1}>
          <Text variant="body-default-m" onBackground="neutral-weak">
            Mehr über die Person hinter EvgLab:{" "}
            <SmartLink href="/ueber-uns">
              <Text as="span" variant="body-default-m">
                Über mich
              </Text>
            </SmartLink>
            .
          </Text>
        </Reveal>
      </Section>

      <FinalCta />
      <SiteFooter />
    </Column>
  );
}
