import { Column, Flex, Heading, Icon, RevealFx, Row, SmartLink, Text } from "@once-ui-system/core";
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
  StickyMobileCta,
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
    "Webdesign und Webentwicklung aus Landsberg am Lech. Individuelle Websites und Landingpages mit Persönlichkeit, die Anfragen bringen.",
  serviceType: ["Webdesign", "Webentwicklung", "Landingpage-Design", "Website-Betreuung"],
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
        href="/images/projects/evglab/hero-ki.png"
        fetchPriority="high"
      />
      <JsonLd data={structuredData} />
      <Column
        as="section"
        className={styles.hero}
        data-sticky-cta-hero
        fillWidth
        horizontal="center"
        paddingX="l"
        paddingTop="128"
        paddingBottom="80"
        m={{ paddingTop: "104", paddingBottom: "64" }}
        vertical="center"
        style={{ minHeight: "100svh" }}
      >
        <Row
          fillWidth
          maxWidth={68}
          vertical="center"
          gap="xl"
          s={{ direction: "column", gap: "40" }}
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
            <Column m={{ hide: true }} paddingBottom="24">
              <RevealFx speed={400} horizontal="start">
                <CapacityBadge taken={3} total={4} />
              </RevealFx>
            </Column>

            <RevealFx speed={400} translateY="4" delay={0.05} horizontal="start" paddingBottom="20">
              <Heading
                as="h1"
                className={styles.heroHeadline}
                variant="display-strong-xl"
                onBackground="neutral-strong"
                style={{ letterSpacing: "-0.04em", lineHeight: 0.98 }}
              >
                <Text as="span" className={styles.heroHeadlineLead} onBackground="neutral-medium">
                  Websites mit Charakter,
                </Text>{" "}
                <span className={styles.heroHeadlineTail}>
                  die <RotatingWord words={["Kunden", "Anfragen", "Aufträge", "Umsätze"]} />{" "}
                  bringen.
                </span>
              </Heading>
            </RevealFx>

            <RevealFx speed={400} translateY="8" delay={0.12} horizontal="start" paddingBottom="32">
              <Text
                wrap="balance"
                onBackground="neutral-medium"
                variant="body-default-l"
                style={{ lineHeight: 1.55, maxWidth: "32rem" }}
              >
                Webdesign und Webentwicklung aus Landsberg am Lech – kein Vorlagen-Look, sondern
                ein Auftritt mit Persönlichkeit, der Anfragen bringt.
              </Text>
            </RevealFx>

            <RevealFx speed={400} translateY="8" delay={0.18} horizontal="start" paddingBottom="16">
              <Row
                className={styles.heroActions}
                gap="20"
                wrap
                vertical="center"
              >
                <ContactDialog label="Kostenlos anfragen" size="l" replaceGlobalHandler />
                <SmartLink href="#projekte" unstyled>
                  <Text variant="label-strong-s" onBackground="neutral-strong">
                    Projekte ansehen
                  </Text>
                </SmartLink>
              </Row>
            </RevealFx>

            <RevealFx speed={400} translateY="8" delay={0.24} horizontal="start">
              <Column gap="12">
                <Text variant="label-default-s" onBackground="neutral-weak">
                  Antwort innerhalb 24h
                </Text>
                <SmartLink href="/ueber-uns" unstyled className={styles.heroAboutLink}>
                  <Row gap="8" vertical="center">
                    <span className={styles.heroAboutAvatar} aria-hidden="true">
                      <img src="/images/about/erik.png" alt="" width={32} height={32} />
                    </span>
                    <Text variant="label-strong-s" onBackground="neutral-strong">
                      Erik · Wer dahintersteckt
                    </Text>
                    <Icon name="arrowRight" size="xs" onBackground="neutral-strong" />
                  </Row>
                </SmartLink>
              </Column>
            </RevealFx>
          </Column>

          <Flex flex={6} fillWidth m={{ hide: true }}>
            <RevealFx fillWidth speed={400} delay={0.2}>
              <HeroShowcase />
            </RevealFx>
          </Flex>
        </Row>

        <HeroMarquee />
      </Column>

      <Problem />
      <Projects />

      <Column
        as="section"
        fillWidth
        horizontal="center"
        paddingY="160"
        gap="64"
        m={{ paddingY: "80", gap: "40" }}
      >
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
      <StickyMobileCta />
      <SiteFooter />
    </Column>
  );
}
