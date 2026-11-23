import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Column, Grid, Heading, Icon, Row, Text } from "@once-ui-system/core/components";
import classNames from "classnames";
import { StickyMobileCta } from "@/components";
import { ContactDialog } from "@/components/ContactDialog";
import { JsonLd } from "@/components/JsonLd";
import { FaqList, ItemGrid, ReferenceGrid } from "@/components/seo";
import { Glow, StudioFooter, StudioSection } from "@/components/studio";
import { BLACK_FRIDAY, BLACK_FRIDAY_PACKAGES, BLACK_FRIDAY_WHATSAPP_URL } from "@/lib/blackFriday";
import { CTA_PROOF } from "@/lib/contact";
import { seoReferences } from "@/lib/seoPages";
import { baseURL, createPageOpenGraph, createPageTwitter } from "@/resources";
import {
  BlackFridayScene,
  Countdown,
  LeadForm,
  ScrollToFormButton,
  SelectPackageButton,
} from "./_components";
import styles from "./_components/blackfriday.module.scss";

const PAGE_PATH = "/blackfriday";
const PAGE_TITLE = "Black Friday: Website 500 €, Landingpage 300 €";
const PAGE_DESCRIPTION =
  "Black Friday bei EvGlab: komplette Website für 500 € statt ab 2.500 €, Landingpage für 300 € statt ab 1.500 €. Kostenloser Entwurf, nur bis Cyber Monday.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    "Black Friday Website",
    "Black Friday Webdesign",
    "Website erstellen lassen günstig",
    "Website 500 Euro",
    "Landingpage 300 Euro",
    "Webdesign Angebot",
    "Webdesign Landsberg am Lech",
    "Cyber Monday Webdesign",
  ],
  alternates: { canonical: PAGE_PATH },
  openGraph: createPageOpenGraph({
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    path: PAGE_PATH,
  }),
  twitter: createPageTwitter(PAGE_TITLE, PAGE_DESCRIPTION),
};

const included: { title: string; body: string }[] = [
  {
    title: "Kostenloser Entwurf zuerst",
    body: "Du siehst dein Design, bevor du irgendetwas beauftragst. Gefällt es dir nicht, zahlst du nichts.",
  },
  {
    title: "Individuell statt Baukasten",
    body: "Kein Wix-Template, das 10.000 andere auch haben. Dein Auftritt wird für deinen Betrieb gestaltet.",
  },
  {
    title: "Perfekt auf dem Handy",
    body: "Die meisten deiner Kunden suchen übers Handy. Deshalb wird jede Seite zuerst fürs Smartphone gebaut.",
  },
  {
    title: "Bei Google sauber aufgestellt",
    body: "Saubere Struktur, Seitentitel, Beschreibungen und schnelle Ladezeit als Basis fürs Ranking.",
  },
  {
    title: "In ca. 7 Tagen online",
    body: "Kein monatelanges Hin und Her. Klarer Ablauf, feste Termine, schnell live.",
  },
  {
    title: "Direkt mit Erik",
    body: "Kein Callcenter, kein Junior. Du sprichst von Anfang bis Ende mit der Person, die baut.",
  },
];

const steps: { title: string; body: string }[] = [
  {
    title: "Platz sichern",
    body: `Formular ausfüllen oder per WhatsApp schreiben. Dauert 60 Sekunden, kostet nichts. Aktion gilt bis ${BLACK_FRIDAY.endsLabel}.`,
  },
  {
    title: "Kostenloser Entwurf",
    body: "Kurzes Gespräch, dann bekommst du deinen Entwurf. Erst wenn er dir gefällt, beauftragst du zum Aktionspreis.",
  },
  {
    title: "Online gehen",
    body: `In ca. 7 Tagen ist deine Seite live. Wenn dir das jetzt zu früh ist: Start bis ${BLACK_FRIDAY.startUntilLabel} möglich.`,
  },
];

const faqs: { question: string; answer: string }[] = [
  {
    question: "Wo ist der Haken bei 500 € für eine komplette Website?",
    answer:
      "Es gibt keinen versteckten Haken. Black Friday ist eine bewusst begrenzte Aktion, um zum Jahresende neue Projekte zu gewinnen. Deshalb gibt es nur eine feste Anzahl Plätze und einen klaren Umfang: bis zu 5 Seiten für die Website, eine Seite mit bis zu 6 Abschnitten für die Landingpage.",
  },
  {
    question: "Was ist der Unterschied zwischen Website und Landingpage?",
    answer:
      "Eine Website hat mehrere Unterseiten, zum Beispiel Start, Leistungen, Über uns und Kontakt. Sie ist dein kompletter Auftritt. Eine Landingpage ist eine einzige, lange Seite mit einem Ziel, etwa Anfragen für ein bestimmtes Angebot. Wenn du unsicher bist, wähle im Formular „Noch unsicher“ und ich berate dich ehrlich.",
  },
  {
    question: "Muss ich sofort bezahlen?",
    answer:
      "Nein. Du sicherst dir den Platz unverbindlich. Zuerst bekommst du einen kostenlosen Entwurf. Erst wenn er dir gefällt, beauftragst du zum Black-Friday-Preis.",
  },
  {
    question: "Ich habe gerade keine Zeit. Kann ich später starten?",
    answer: `Ja. Wer sich bis ${BLACK_FRIDAY.endsLabel} einen Platz sichert, kann das Projekt bis ${BLACK_FRIDAY.startUntilLabel} starten und behält den Aktionspreis.`,
  },
  {
    question: "Sind Domain und Hosting enthalten?",
    answer:
      "Domain und Hosting laufen auf deinen Namen, damit dir deine Website wirklich gehört. Die Kosten dafür liegen meist bei wenigen Euro im Monat. Ich helfe dir bei der Einrichtung. Optional gibt es Betreuung mit Updates und kleinen Änderungen für 99 € im Monat.",
  },
  {
    question: "Wer schreibt die Texte und liefert die Bilder?",
    answer:
      "Du lieferst die Infos zu deinem Betrieb, ich mache daraus verständliche, verkaufsstarke Texte und eine klare Struktur. Hast du keine eigenen Fotos, nutzen wir passende lizenzfreie Bilder.",
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
    ...BLACK_FRIDAY_PACKAGES.map((pkg) => ({
      "@type": "Offer",
      "@id": `${baseURL}${PAGE_PATH}#${pkg.id}`,
      name: `Black Friday: ${pkg.name}`,
      description: pkg.tagline,
      price: pkg.price,
      priceCurrency: "EUR",
      availability: "https://schema.org/LimitedAvailability",
      validThrough: BLACK_FRIDAY.endsAt,
      url: `${baseURL}${PAGE_PATH}`,
      seller: { "@id": `${baseURL}/#business` },
      itemOffered: { "@type": "Service", name: pkg.name, serviceType: "Webdesign" },
    })),
    {
      "@type": "FAQPage",
      "@id": `${baseURL}${PAGE_PATH}#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ],
};

const delay = (s: number) => ({ animationDelay: `${s}s` }) as CSSProperties;

export default function BlackFridayPage() {
  const slotsTaken = BLACK_FRIDAY.slotsTotal - BLACK_FRIDAY.slotsLeft;
  const slotsPct = Math.max(8, Math.round((slotsTaken / BLACK_FRIDAY.slotsTotal) * 100));

  return (
    <BlackFridayScene>
      <JsonLd data={structuredData} />

      {/* ---------- Hero ---------- */}
      <Column
        as="section"
        className={styles.hero}
        data-sticky-cta-hero=""
        fillWidth
        horizontal="center"
      >
        <span className={styles.halo} aria-hidden="true" />
        <Column fillWidth maxWidth={64} gap="40" horizontal="center" align="center" s={{ gap: "32" }}>
          <Row className={classNames(styles.meta, styles.enter)} gap="12" vertical="center" horizontal="center">
            <span className={styles.pulseDot} aria-hidden="true" />
            <span>Black Week 2026</span>
            <span className={styles.metaRule} aria-hidden="true" />
            <span>Nur bis {BLACK_FRIDAY.endsShortLabel}</span>
          </Row>

          <Heading as="h1" className={classNames(styles.headline, styles.enter)} style={delay(0.06)}>
            <span className={styles.line1}>Black Friday</span>
            <span className={styles.line2}>Website für 500&nbsp;€</span>
          </Heading>

          <Text as="p" className={classNames(styles.lead, styles.enter)} style={delay(0.12)}>
            Individuell gestaltet statt Baukasten, in ca. 7 Tagen online. Der niedrigste Preis, den es
            bei EvGlab je gab.
          </Text>

          <Row gap="12" wrap horizontal="center" vertical="center" className={styles.enter} style={delay(0.18)}>
            <ScrollToFormButton label="Jetzt Platz sichern" />
            <a
              className={styles.whatsapp}
              href={BLACK_FRIDAY_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="whatsapp" size="s" />
              Per WhatsApp
            </a>
          </Row>

          <Grid
            className={classNames(styles.dealBar, styles.enter)}
            style={delay(0.26)}
            columns="3"
            m={{ columns: "1" }}
            fillWidth
          >
            {BLACK_FRIDAY_PACKAGES.map((pkg) => (
              <Column key={pkg.id} className={styles.dealCell} gap="8" horizontal="start" align="left">
                <Text className={styles.dealLabel}>{pkg.name}</Text>
                <Row gap="12" vertical="end" wrap>
                  <Text className={styles.dealPrice}>{pkg.priceLabel}</Text>
                  <Text className={styles.strike} style={{ marginBottom: "0.25rem" }}>
                    {pkg.regularLabel.replace("regulär ", "")}
                  </Text>
                </Row>
              </Column>
            ))}
            <Column className={styles.dealCell} gap="8" horizontal="start" align="left">
              <Text className={styles.dealLabel}>Angebot endet in</Text>
              <Countdown size="m" />
            </Column>
          </Grid>

          <Row
            gap="24"
            wrap
            horizontal="center"
            vertical="center"
            className={classNames(styles.heroFoot, styles.enter)}
            style={delay(0.32)}
          >
            <Row gap="12" vertical="center">
              <Row className={styles.slotsTrack} style={{ width: "6rem" }} aria-hidden="true">
                <span className={styles.slotsFill} style={{ width: `${slotsPct}%` }} />
              </Row>
              <Text className={styles.footText}>
                Noch {BLACK_FRIDAY.slotsLeft} von {BLACK_FRIDAY.slotsTotal} Plätzen frei
              </Text>
            </Row>
            <Text className={styles.footText}>
              <span className={styles.stars} role="img" aria-label="5 von 5 Sternen">
                ★★★★★
              </span>{" "}
              „{CTA_PROOF.quote}“
            </Text>
          </Row>
        </Column>
      </Column>

      {/* ---------- Angebote ---------- */}
      <StudioSection
        id="angebot"
        kicker="Deine Black-Friday-Geschenke"
        title={
          <>
            Zwei Geschenke. <Glow>Minus 80 %.</Glow>
          </>
        }
        intro="Gleiche Qualität wie zum regulären Preis. Nur schneller entschieden."
        style={{ scrollMarginTop: "calc(var(--studio-banner-h, 0px) + 5rem)" }}
      >
        <Grid columns="2" m={{ columns: "1" }} gap="24" fillWidth>
          {BLACK_FRIDAY_PACKAGES.map((pkg) => {
            const featured = Boolean(pkg.badge);
            return (
              <Column
                key={pkg.id}
                className={classNames(styles.gift, featured && styles.giftFeatured)}
                gap="24"
                fillHeight
                data-bf-reveal=""
              >
                <Row gap="8" wrap>
                  {pkg.badge && <span className={styles.badge}>{pkg.badge}</span>}
                  <span className={styles.discount}>{BLACK_FRIDAY.discountLabel}</span>
                </Row>

                <Column gap="8">
                  <Heading as="h3" className={styles.giftName}>
                    {pkg.name}
                  </Heading>
                  <Text as="p" className={styles.tagline}>
                    {pkg.tagline}
                  </Text>
                </Column>

                <Row gap="16" vertical="end" wrap>
                  <Text
                    className={styles.bigPrice}
                    data-bf-price=""
                    data-from={pkg.regularPrice}
                    data-to={pkg.price}
                  >
                    {pkg.priceLabel}
                  </Text>
                  <Text className={styles.strike} style={{ marginBottom: "0.5rem" }}>
                    {pkg.regularLabel}
                  </Text>
                </Row>

                <Column as="ul" gap="12" className={styles.features}>
                  {pkg.features.map((feature) => (
                    <Row as="li" key={feature} gap="12" vertical="start">
                      <span className={styles.check} aria-hidden="true">
                        <Icon name="check" size="xs" />
                      </span>
                      <Text className={styles.featureText}>{feature}</Text>
                    </Row>
                  ))}
                </Column>

                <Column fillWidth style={{ marginTop: "auto" }}>
                  <SelectPackageButton
                    id={pkg.id}
                    label={`${pkg.name} für ${pkg.priceLabel} sichern`}
                    highlight={featured}
                  />
                </Column>
              </Column>
            );
          })}
        </Grid>

        <Row gap="12" horizontal="center" vertical="center" wrap className={styles.countRow}>
          <Text className={styles.dealLabel}>Angebot endet in</Text>
          <Countdown size="m" />
        </Row>
      </StudioSection>

      {/* ---------- Leistungen ---------- */}
      <StudioSection
        kicker="Immer dabei"
        title={
          <>
            Günstig im Preis. <Glow>Nicht in der Qualität.</Glow>
          </>
        }
      >
        <ItemGrid items={included} columns="3" data-bf-reveal="" />
      </StudioSection>

      {/* ---------- Referenzen ---------- */}
      <StudioSection
        id="referenzen"
        kicker="Referenzen"
        title={
          <>
            Echte Websites, <Glow>echte Betriebe.</Glow>
          </>
        }
      >
        <ReferenceGrid items={[seoReferences.daPeppe, seoReferences.jungen, seoReferences.luenebraeu]} />
      </StudioSection>

      {/* ---------- Ablauf + Garantie ---------- */}
      <StudioSection
        kicker="So einfach geht’s"
        title={
          <>
            In drei Schritten <Glow>online.</Glow>
          </>
        }
      >
        <Grid as="ol" columns="3" m={{ columns: "1" }} gap="32" fillWidth className={styles.steps}>
          {steps.map((step, index) => (
            <Column as="li" key={step.title} className={styles.step} gap="12" data-bf-reveal="">
              <span className={styles.stepNum} aria-hidden="true">
                {index + 1}
              </span>
              <Heading as="h3" className={styles.stepTitle}>
                {step.title}
              </Heading>
              <Text as="p" className={styles.stepBody}>
                {step.body}
              </Text>
            </Column>
          ))}
        </Grid>

        <Row
          className={styles.guarantee}
          gap="40"
          vertical="center"
          s={{ direction: "column", gap: "20" }}
          data-bf-reveal=""
        >
          <span className={styles.seal}>
            <span className={styles.sealValue}>0 €</span>
            <span className={styles.sealLabel}>Risiko</span>
          </span>
          <Column gap="12" flex={1}>
            <Heading as="h3" className={styles.guaranteeTitle}>
              Erst der Entwurf. Dann entscheidest du.
            </Heading>
            <Text as="p" className={styles.bodyText}>
              Du bekommst deinen Entwurf kostenlos. Gefällt er dir nicht, gehst du einfach. Ohne
              Kosten, ohne Diskussion. Gefällt er dir, bauen wir ihn zum Black-Friday-Preis fertig.
            </Text>
          </Column>
        </Row>
      </StudioSection>

      {/* ---------- Formular ---------- */}
      <StudioSection id="kontakt" style={{ scrollMarginTop: "calc(var(--studio-banner-h, 0px) + 4rem)" }}>
        <Grid fillWidth columns="2" m={{ columns: "1" }} gap="48" style={{ alignItems: "center" }}>
          <Column gap="24">
            <Row className={styles.meta} gap="12" vertical="center">
              <span className={styles.pulseDot} aria-hidden="true" />
              <span>Letzte Chance</span>
            </Row>
            <Heading as="h2" className={styles.formTitle}>
              Sichere dir deinen <span className={styles.glow}>Platz.</span>
            </Heading>
            <Text as="p" className={styles.bodyText}>
              60 Sekunden ausfüllen, kein Risiko. Ich melde mich innerhalb von 24 Stunden persönlich
              und wir planen deinen kostenlosen Entwurf.
            </Text>
            <Column gap="12">
              <Text className={styles.dealLabel}>Angebot endet in</Text>
              <Countdown size="m" />
            </Column>
            <Column className={styles.quote} gap="8">
              <Text className={styles.quoteText}>„{CTA_PROOF.quote}“</Text>
              <Text className={styles.footText}>★★★★★ {CTA_PROOF.attribution}</Text>
            </Column>
          </Column>

          <LeadForm />
        </Grid>
      </StudioSection>

      {/* ---------- FAQ ---------- */}
      <StudioSection id="faq" kicker="FAQ" title="Häufige Fragen zur Aktion">
        <FaqList items={faqs} />
        <Row gap="24" vertical="center" horizontal="between" wrap fillWidth style={{ maxWidth: "54rem" }}>
          <Column gap="4">
            <Heading as="h3" className={styles.stepTitle}>
              Noch Fragen zur Aktion?
            </Heading>
            <Text as="p" className={styles.stepBody}>
              Schreib mir kurz, ich antworte innerhalb von 24 Stunden.
            </Text>
          </Column>
          <ContactDialog label="Frage stellen" size="m" variant="secondary" />
        </Row>
      </StudioSection>

      <StudioFooter />

      <StickyMobileCta
        label={`Black Friday · Website ${BLACK_FRIDAY_PACKAGES[0].priceLabel}`}
        buttonLabel="Platz sichern"
        href="#kontakt"
        whatsappHref={BLACK_FRIDAY_WHATSAPP_URL}
      />
    </BlackFridayScene>
  );
}
