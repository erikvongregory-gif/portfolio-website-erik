import { Button, Column, Flex, Heading, RevealFx, Row, Text } from "@once-ui-system/core";
import styles from "./page.module.scss";
import {
  About,
  Approach,
  CapacityBadge,
  FinalCta,
  HeroMarquee,
  HeroShowcase,
  Marquee,
  Problem,
  Process,
  Projects,
  RotatingWord,
  ScrollRevealText,
  Services,
  SiteFooter,
  Testimonials,
} from "@/components";
import { ContactDialog } from "@/components/ContactDialog";
import { JsonLd } from "@/components/JsonLd";
import { baseURL } from "@/resources";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${baseURL}/#business`,
  name: "EvgLab",
  alternateName: "Erik EvgLab",
  description:
    "Webentwicklung und Design aus einer Hand. Individuelle Websites und Landingpages mit Persönlichkeit, die Anfragen bringen.",
  url: baseURL,
  image: `${baseURL}/opengraph-image`,
  email: "info@evglab.com",
  telephone: "+491731706012",
  priceRange: "€€",
  founder: {
    "@type": "Person",
    name: "Erik von Gregory",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Hauptstraße 18",
    postalCode: "86925",
    addressLocality: "Fuchstal",
    addressRegion: "Bayern",
    addressCountry: "DE",
  },
  areaServed: ["Landsberg am Lech", "Bayern", "Deutschland"],
  knowsLanguage: ["de"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Leistungen",
    itemListElement: [
      {
        "@type": "Offer",
        priceCurrency: "EUR",
        price: "2500",
        itemOffered: { "@type": "Service", name: "Komplette Website" },
      },
      {
        "@type": "Offer",
        priceCurrency: "EUR",
        price: "1500",
        itemOffered: { "@type": "Service", name: "Landingpage" },
      },
      {
        "@type": "Offer",
        priceCurrency: "EUR",
        price: "99",
        itemOffered: { "@type": "Service", name: "Website-Betreuung (monatlich)" },
      },
    ],
  },
};

export default function Home() {
  return (
    <Column fillWidth horizontal="center">
      <link
        rel="preload"
        as="image"
        href="/images/projects/evglab/hero.png"
        fetchPriority="high"
      />
      <JsonLd data={structuredData} />
      <Column
        as="section"
        className={styles.hero}
        fillWidth
        horizontal="center"
        paddingX="l"
        paddingTop="128"
        paddingBottom="80"
        vertical="center"
        style={{ minHeight: "100svh" }}
      >
        <HeroMarquee />

        <Row
          fillWidth
          maxWidth={68}
          vertical="center"
          gap="xl"
          s={{ direction: "column", gap: "56" }}
          style={{ position: "relative", zIndex: 1 }}
        >
          <Column
            className={styles.heroCopy}
            flex={5}
            maxWidth={30}
            gap="0"
            horizontal="start"
            align="left"
          >
            <RevealFx horizontal="start" paddingBottom="24">
              <CapacityBadge taken={3} total={4} />
            </RevealFx>

            <RevealFx translateY="4" delay={0.1} horizontal="start" paddingBottom="20">
              <Heading
                as="h1"
                wrap="balance"
                variant="display-strong-xl"
                onBackground="neutral-strong"
                style={{ letterSpacing: "-0.04em", lineHeight: 0.98 }}
              >
                <Text as="span" onBackground="neutral-medium">
                  Websites mit Charakter,
                </Text>{" "}
                die <RotatingWord words={["Kunden", "Anfragen", "Aufträge", "Umsätze"]} />{" "}
                bringen.
              </Heading>
            </RevealFx>

            <RevealFx translateY="8" delay={0.2} horizontal="start" paddingBottom="32">
              <Text
                wrap="balance"
                onBackground="neutral-medium"
                variant="body-default-l"
                style={{ lineHeight: 1.55, maxWidth: "32rem" }}
              >
                Webentwicklung und Design aus einer Hand. Kein Vorlagen-Look, sondern ein Auftritt
                mit Persönlichkeit, der Anfragen bringt.
              </Text>
            </RevealFx>

            <RevealFx translateY="12" delay={0.3} horizontal="start" paddingBottom="20">
              <Row gap="8" wrap vertical="center">
                <ContactDialog label="Kostenlos anfragen" size="l" />
                <Button href="#projekte" variant="tertiary" size="l">
                  Projekte ansehen
                </Button>
              </Row>
            </RevealFx>

            <RevealFx translateY="12" delay={0.4} horizontal="start">
              <Text variant="label-default-s" onBackground="neutral-weak">
                Kostenlos · Antwort innerhalb 24h · Landsberg am Lech
              </Text>
            </RevealFx>
          </Column>

          <Flex flex={6} fillWidth m={{ hide: true }}>
            <RevealFx fillWidth delay={0.3}>
              <HeroShowcase />
            </RevealFx>
          </Flex>
        </Row>
      </Column>

      <Problem />
      <Projects />

      <Column as="section" fillWidth horizontal="center" paddingY="160" gap="64">
        <Marquee />
        <Column maxWidth={48} fillWidth horizontal="center" paddingX="l">
          <ScrollRevealText text="Deine Website ist der erste Eindruck deiner Marke. Ich sorge dafür, dass er auffällt, Vertrauen schafft und Kunden bringt." />
        </Column>
      </Column>

      <Approach />
      <Services />
      <Process />
      <About />
      <Testimonials />
      <FinalCta />
      <SiteFooter />
    </Column>
  );
}
