import { Column, Heading, Icon, Row, SmartLink, Text } from "@once-ui-system/core";
import Image from "next/image";
import styles from "./page.module.scss";
import {
  About,
  Approach,
  CapacityBadge,
  FinalCta,
  HeroDesktopStrip,
  HeroEntrance,
  HeroLine,
  HeroMarquee,
  HeroProof,
  Investment,
  Marquee,
  Problem,
  Process,
  Projects,
  ScrollRevealText,
  Services,
  SiteFooter,
  Testimonials,
  StickyMobileCta,
  heroEnter,
} from "@/components";
import { ContactDialog } from "@/components/ContactDialog";
import { CtaProof } from "@/components/CtaProof";
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
  telephone: "+4915565602176",
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
      <JsonLd data={structuredData} />
      <HeroEntrance
        as="section"
        className={styles.hero}
        data-sticky-cta-hero
        fillWidth
        horizontal="center"
        paddingX="l"
        paddingTop="128"
        paddingBottom="80"
        m={{ paddingTop: "88", paddingBottom: "48" }}
        vertical="center"
        style={{ minHeight: "100svh", position: "relative" }}
      >
        {/* ——— Mobile: unverändert ——— */}
        <Column className={styles.heroMobile} fillWidth maxWidth={68} gap="0">
          <Column
            className={styles.heroCopy}
            fillWidth
            gap="0"
            horizontal="start"
            align="left"
          >
            <Column className={heroEnter.badge} paddingBottom="24" m={{ paddingBottom: "32" }}>
              <CapacityBadge />
            </Column>

            <Heading
              as="h1"
              className={styles.heroHeadline}
              variant="display-strong-xl"
              onBackground="neutral-strong"
              style={{ paddingBottom: "1.5rem" }}
            >
              <HeroLine>Websites mit Charakter,</HeroLine>
              <HeroLine>die Kunden bringen – inklusive kostenlosem Entwurf.</HeroLine>
            </Heading>

            <Column className={`${styles.heroLead} ${heroEnter.lead}`} paddingBottom="32">
              <Text
                wrap="balance"
                onBackground="neutral-medium"
                variant="body-default-m"
                className={styles.heroLeadText}
              >
                Für Unternehmen, die genug davon haben, dass ihre Website wie von der Stange wirkt
                und keine Anfragen bringt.
              </Text>
            </Column>

            <Row
              className={`${styles.heroActions} ${heroEnter.actions}`}
              gap="20"
              wrap
              vertical="center"
              paddingBottom="8"
            >
              <ContactDialog label="Kostenloser Entwurf" size="l" funnel />
              <SmartLink href="#projekte" unstyled className={styles.heroSecondaryCta}>
                <Text variant="label-strong-s" onBackground="neutral-strong">
                  Projekte ansehen
                </Text>
              </SmartLink>
            </Row>
          </Column>

          <Column className={heroEnter.marquee} fillWidth>
            <HeroMarquee />
          </Column>

          <Column
            className={`${styles.heroBelow} ${heroEnter.mobileProof}`}
            fillWidth
            gap="20"
            paddingTop="40"
          >
            <CtaProof />
            <HeroProof />
            <SmartLink href="/ueber-uns" unstyled className={styles.heroAboutLink}>
              <Row gap="8" vertical="center">
                <span className={styles.heroAboutAvatar} aria-hidden="true">
                  <Image
                    src="/images/about/erik-avatar.webp"
                    alt="Erik von Gregory, Gründer von EvgLab"
                    width={32}
                    height={32}
                  />
                </span>
                <Text variant="label-strong-s" onBackground="neutral-strong">
                  Erik · Wer dahintersteckt
                </Text>
                <Icon name="arrowRight" size="xs" onBackground="neutral-strong" />
              </Row>
            </SmartLink>
          </Column>
        </Column>

        {/* ——— Desktop: Blink-Anordnung ——— */}
        <Column className={styles.heroDesktop} fillWidth gap="0">
          <Column className={heroEnter.badge} paddingBottom="20">
            <CapacityBadge />
          </Column>

          <Row
            className={styles.blinkRow}
            fillWidth
            gap="40"
            vertical="end"
            horizontal="between"
            style={{ position: "relative", zIndex: 1 }}
          >
            <Heading
              as="h1"
              className={styles.blinkHeadline}
              variant="display-strong-xl"
              onBackground="neutral-strong"
            >
              <HeroLine>Websites mit Charakter,</HeroLine>
              <HeroLine>die Kunden bringen.</HeroLine>
            </Heading>

            <Column className={styles.blinkAside} gap="20">
              <Column className={heroEnter.lead} fillWidth>
                <Text
                  wrap="balance"
                  onBackground="neutral-medium"
                  variant="body-default-l"
                  className={styles.blinkLead}
                >
                  Für Unternehmen, die genug davon haben, dass ihre Website wie von der Stange wirkt
                  und keine Anfragen bringt.
                </Text>
              </Column>
              <Row className={`${styles.blinkActions} ${heroEnter.actions}`} gap="16" vertical="center">
                <ContactDialog label="Kostenloser Entwurf" size="l" replaceGlobalHandler funnel />
              </Row>
            </Column>
          </Row>

          <Column className={heroEnter.visual} fillWidth>
            <HeroDesktopStrip />
          </Column>
        </Column>
      </HeroEntrance>

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
      <Investment />
      <Services />
      <Process />
      <About />
      <Testimonials />
      <FinalCta />
      <StickyMobileCta label="Kostenloser Entwurf" buttonLabel="Starten" funnel />
      <SiteFooter />
    </Column>
  );
}
