import type { Metadata } from "next";
import { Column, SmartLink, Text } from "@once-ui-system/core/components";
import { FaqList, ItemGrid, LandingHero, PillList, PriceList, WorkShowcase } from "@/components/seo";
import { CtaBand, Glow, StudioFooter, StudioSection } from "@/components/studio";
import { seoReferences } from "@/lib/seoPages";
import { JsonLd } from "@/components/JsonLd";
import { StartOffer } from "@/components/StartOffer";
import { startOfferFaqSentence } from "@/lib/startOffer";
import {
  baseURL,
  createPageOpenGraph,
  createPageTwitter,
} from "@/resources";

const PAGE_PATH = "/webdesign-landsberg";
const PAGE_TITLE = "Webdesign Landsberg am Lech";
const PAGE_DESCRIPTION =
  "Webdesign Landsberg am Lech: individuelle Websites & Landingpages von Erik EvGlab. Lokal erreichbar, ohne Template-Look – Anfragen, die wirklich kommen.";

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

const benefits: { title: string; body: string }[] = [
  {
    title: "Kein Baukasten-Look",
    body: "Jede Website wird individuell gestaltet – damit du in Landsberg und online nicht wie die Konkurrenz aussiehst.",
  },
  {
    title: "Direkt mit mir",
    body: "Kein Account-Manager, kein Junior. Du sprichst durchgehend mit Erik – von der Idee bis nach dem Launch.",
  },
  {
    title: "Klarer Ablauf",
    body: "Konzept, Design, Entwicklung, Launch. Transparente Richtpreise und in der Regel in wenigen Tagen live.",
  },
  {
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
      "Ja. EvGlab steht für Webdesign und Webentwicklung für Unternehmen in Landsberg am Lech und der Region. Ich gestalte individuelle Websites und Landingpages – ohne Template-Look, mit Fokus auf Anfragen.",
  },
  {
    question: "Kann man sich vor Ort in Landsberg treffen?",
    answer:
      "Gerne. Für Kunden aus Landsberg am Lech und Umgebung sind persönliche Treffen möglich. Viele Projekte laufen aber auch komplett remote – je nachdem, was für dich praktischer ist.",
  },
  {
    question: "Was kostet eine Website bei dir?",
    answer:
      "Richtpreise: komplette Website ab 2.500 €, Landingpage ab 1.500 €, Betreuung ab 99 € monatlich. Den genauen Umfang klären wir im kostenlosen Erstgespräch." +
      startOfferFaqSentence(),
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
      name: "Erik EvGlab",
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
      name: "EvGlab",
      alternateName: "Erik EvGlab",
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
    <Column fillWidth horizontal="center" data-theme="dark">
      <JsonLd data={structuredData} />

      <LandingHero
        crumb="Webdesign Landsberg am Lech"
        kicker="Lokal · Landsberg am Lech & Umgebung"
        title={
          <>
            Webdesign Landsberg am Lech – <Glow>Websites mit Charakter, die Anfragen bringen.</Glow>
          </>
        }
        lead="Du suchst einen Webdesigner in Landsberg am Lech? Ich gestalte und entwickle individuelle Websites und Landingpages für Unternehmen aus der Region – ohne Vorlagen-Look, mit klarer Botschaft und dem Ziel, dass Interessenten dich kontaktieren."
        ctaLabel="Kostenloses Erstgespräch"
        funnel={false}
        secondary={{ label: "Projekte ansehen", href: "/#arbeiten" }}
        trust="Antwort innerhalb 24h · Vor Ort oder remote · Aus der Region Landsberg"
      />

      <StudioSection
        id="warum"
        kicker="Warum EvGlab"
        title={
          <>
            Webdesign aus der Region – <Glow>ohne Agentur-Overhead.</Glow>
          </>
        }
        intro="Für Betriebe, Praxen, Gastronomie und Marken in Landsberg am Lech, die online professionell wirken und gefunden werden wollen."
      >
        <ItemGrid items={benefits} columns="4" />
      </StudioSection>

      <StudioSection
        id="arbeiten"
        kicker="Aus meiner Arbeit"
        title={
          <>
            Echte Projekte, <Glow>kein Template.</Glow>
          </>
        }
      >
        <WorkShowcase
          reference={seoReferences.daPeppe}
          filmIds={["evglab-landsberg", "herzblut-ki", "brewai-glass"]}
          filmRatio="4 / 5"
        />
      </StudioSection>

      <StudioSection
        id="leistungen"
        kicker="Leistungen"
        title={
          <>
            Was ich als Webdesigner in Landsberg <Glow>für dich baue.</Glow>
          </>
        }
        intro="Transparente Richtpreise. Den konkreten Umfang klären wir im Gespräch – ehrlich und ohne Druck."
      >
        <StartOffer />
        <PriceList items={services} />
        <Text as="p" style={{ color: "var(--studio-ink-2)", margin: 0 }}>
          Mehr Details und Beispiele findest du auf der{" "}
          <SmartLink href="/" style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>
            Startseite
          </SmartLink>{" "}
          und unter{" "}
          <SmartLink href="/#leistungen" style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>
            Leistungen
          </SmartLink>
          .
        </Text>
      </StudioSection>

      <StudioSection
        id="region"
        tone="paper"
        kicker="Einzugsgebiet"
        title={
          <>
            Webdesign für Landsberg am Lech <Glow>und Umgebung.</Glow>
          </>
        }
        intro="Ich betreue Projekte in Landsberg am Lech und den umliegenden Orten – persönlich erreichbar, wenn du jemanden vor Ort schätzt."
      >
        <PillList tone="paper" label="Einzugsgebiet" items={regions.map((region) => ({ label: region }))} />
        <Text as="p" style={{ color: "var(--studio-paper-ink-2)", maxWidth: "42rem", margin: 0, lineHeight: 1.6 }}>
          Rechtlicher Sitz: Fuchstal. Servicegebiet und Fokus: Landsberg am Lech sowie die Region –
          damit Name, Ort und Angebot für Google und Kunden klar zusammenpassen.
        </Text>
      </StudioSection>

      <StudioSection
        id="faq"
        kicker="FAQ"
        title={
          <>
            Häufige Fragen zu Webdesign in <Glow>Landsberg am Lech.</Glow>
          </>
        }
      >
        <FaqList items={faqs} />
        <Text as="p" style={{ color: "var(--studio-ink-2)", margin: 0 }}>
          Mehr über die Person hinter EvGlab:{" "}
          <SmartLink href="/ueber-uns" style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>
            Über mich
          </SmartLink>
          .
        </Text>
      </StudioSection>

      <CtaBand />
      <StudioFooter />
    </Column>
  );
}
