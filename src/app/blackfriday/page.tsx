import type { Metadata } from "next";
import { cloneElement, type CSSProperties, type ReactElement } from "react";
import { Column, Grid, Heading, Icon, type IconName, Row, Text } from "@once-ui-system/core";
import classNames from "classnames";
import { Instrument_Serif } from "next/font/google";
import { Projects, Reveal, SiteFooter, StickyMobileCta } from "@/components";
import { Faq } from "@/components/sections/Faq";
import { JsonLd } from "@/components/JsonLd";
import { BLACK_FRIDAY, BLACK_FRIDAY_PACKAGES, BLACK_FRIDAY_WHATSAPP_URL } from "@/lib/blackFriday";
import { CTA_PROOF } from "@/lib/contact";
import { baseURL, createPageOpenGraph, createPageTwitter } from "@/resources";
import {
  BlackFridayScene,
  Countdown,
  LeadForm,
  ScrollToFormButton,
  SelectPackageButton,
  Snowfall,
  StringLights,
} from "./_components";
import styles from "./_components/blackfriday.module.scss";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--bf-serif",
  display: "swap",
});

const PAGE_PATH = "/blackfriday";
const PAGE_TITLE = "Black Friday: Website für 500 €, Landingpage für 300 €";
const PAGE_DESCRIPTION =
  "Black Friday bei EvGlab: komplette Website für 500 € statt ab 2.500 €, Landingpage für 300 € statt ab 1.500 €. Individuelles Design, kostenloser Entwurf, in ca. 7 Tagen online. Nur bis Cyber Monday.";

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

const included: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "eye",
    title: "Kostenloser Entwurf zuerst",
    body: "Du siehst dein Design, bevor du irgendetwas beauftragst. Gefällt es dir nicht, zahlst du nichts.",
  },
  {
    icon: "grid",
    title: "Individuell statt Baukasten",
    body: "Kein Wix-Template, das 10.000 andere auch haben. Dein Auftritt wird für deinen Betrieb gestaltet.",
  },
  {
    icon: "phone",
    title: "Perfekt auf dem Handy",
    body: "Die meisten deiner Kunden suchen übers Handy. Deshalb wird jede Seite zuerst fürs Smartphone gebaut.",
  },
  {
    icon: "search",
    title: "Bei Google sauber aufgestellt",
    body: "Saubere Struktur, Seitentitel, Beschreibungen und schnelle Ladezeit als Basis fürs Ranking.",
  },
  {
    icon: "rocket",
    title: "In ca. 7 Tagen online",
    body: "Kein monatelanges Hin und Her. Klarer Ablauf, feste Termine, schnell live.",
  },
  {
    icon: "person",
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

const HEADLINE_GOLD = Array.from("Black Friday");

const tickerItems = [
  "Black Friday",
  "Website 500 €",
  BLACK_FRIDAY.discountLabel,
  "Landingpage 300 €",
  "Kostenloser Entwurf",
  "Nur bis Cyber Monday",
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

/** CSS-Einblendung ohne JS, damit der Hero sofort sichtbar ist (LCP). */
function HeroIn({
  children,
  delay,
}: { children: ReactElement<{ className?: string; style?: CSSProperties }>; delay: number }) {
  return cloneElement(children, {
    className: classNames(children.props.className, styles.enter),
    style: { ...children.props.style, animationDelay: `${delay}s` },
  });
}

function Bow() {
  return (
    <svg className={styles.bow} viewBox="0 0 56 36" aria-hidden="true">
      <path d="M28 18 C 18 2, 2 4, 6 16 C 9 25, 20 22, 28 18 Z" fill="var(--bf-red-glow)" />
      <path d="M28 18 C 38 2, 54 4, 50 16 C 47 25, 36 22, 28 18 Z" fill="var(--bf-red-glow)" />
      <path d="M28 18 L 20 34 L 25 31 L 28 34 Z" fill="var(--bf-red-strong)" />
      <path d="M28 18 L 36 34 L 31 31 L 28 34 Z" fill="var(--bf-red-strong)" />
      <circle cx="28" cy="18" r="4.5" fill="var(--bf-gold)" />
    </svg>
  );
}

export default function BlackFridayPage() {
  const slotsTaken = BLACK_FRIDAY.slotsTotal - BLACK_FRIDAY.slotsLeft;
  const slotsPct = Math.max(8, Math.round((slotsTaken / BLACK_FRIDAY.slotsTotal) * 100));

  return (
    <BlackFridayScene className={serif.variable}>
      <JsonLd data={structuredData} />

      {/* ---------- Hero ---------- */}
      <Column
        as="section"
        className={styles.hero}
        data-sticky-cta-hero=""
        data-bf-hero=""
        fillWidth
        horizontal="center"
        vertical="center"
        paddingX="l"
        paddingTop="160"
        paddingBottom="64"
        s={{ style: { paddingTop: "8rem" } }}
      >
        <span
          className={classNames(styles.glow, styles.glowRed)}
          data-bf-glow=""
          aria-hidden="true"
        />
        <span
          className={classNames(styles.glow, styles.glowGold)}
          data-bf-glow=""
          aria-hidden="true"
        />
        <span
          className={classNames(styles.glow, styles.glowGreen)}
          data-bf-glow=""
          aria-hidden="true"
        />
        <span className={styles.grain} aria-hidden="true" />
        <StringLights />
        <Snowfall />

        <Column
          fillWidth
          maxWidth={64}
          gap="40"
          horizontal="center"
          align="center"
          data-bf-hero-content=""
          s={{ gap: "32" }}
        >
          <HeroIn delay={0}>
            <Row className={styles.meta} gap="12" vertical="center" horizontal="center">
              <span className={styles.pulseDot} />
              <span className={styles.metaWide}>Black Week 2026</span>
              <span className={classNames(styles.metaRule, styles.metaWide)} aria-hidden="true" />
              <span>Nur bis {BLACK_FRIDAY.endsShortLabel}</span>
            </Row>
          </HeroIn>

          <HeroIn delay={0.06}>
            <Heading as="h1" className={styles.headline}>
              <span className={styles.serifLine} aria-label="Black Friday">
                {HEADLINE_GOLD.map((ch, i) => (
                  <span
                    // biome-ignore lint/suspicious/noArrayIndexKey: feste Buchstabenfolge
                    key={i}
                    className={styles.goldLetter}
                    data-bf-letter=""
                    aria-hidden="true"
                  >
                    {ch === " " ? " " : ch}
                  </span>
                ))}
              </span>
              <span className={styles.sansLine}>Website für 500&nbsp;€</span>
            </Heading>
          </HeroIn>

          <HeroIn delay={0.12}>
            <Text
              variant="body-default-xl"
              onBackground="neutral-medium"
              wrap="balance"
              style={{ maxWidth: "36rem", lineHeight: 1.55 }}
            >
              Individuell gestaltet statt Baukasten, in ca. 7 Tagen online. Der niedrigste Preis,
              den es bei EvGlab je gab.
            </Text>
          </HeroIn>

          <HeroIn delay={0.18}>
            <Row gap="12" wrap horizontal="center" vertical="center">
              <ScrollToFormButton label="Jetzt Platz sichern" />
              <a
                data-bf-magnetic=""
                className={styles.whatsapp}
                href={BLACK_FRIDAY_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="whatsapp" size="s" />
                Per WhatsApp
              </a>
            </Row>
          </HeroIn>

          <HeroIn delay={0.26}>
            <Grid className={styles.dealBar} columns="3" m={{ columns: "1" }} fillWidth radius="xl">
              {BLACK_FRIDAY_PACKAGES.map((pkg) => (
                <Column
                  key={pkg.id}
                  className={styles.dealCell}
                  gap="8"
                  horizontal="start"
                  align="left"
                >
                  <Text variant="label-default-s" onBackground="neutral-weak">
                    {pkg.name}
                  </Text>
                  <Row gap="12" vertical="end">
                    <Text className={styles.dealPrice}>{pkg.priceLabel}</Text>
                    <Text className={styles.strike} style={{ marginBottom: "0.3rem" }}>
                      {pkg.regularLabel.replace("regulär ", "")}
                    </Text>
                  </Row>
                </Column>
              ))}
              <Column className={styles.dealCell} gap="8" horizontal="start" align="left">
                <Text variant="label-default-s" onBackground="neutral-weak">
                  Angebot endet in
                </Text>
                <Countdown size="m" />
              </Column>
            </Grid>
          </HeroIn>

          <HeroIn delay={0.32}>
            <Row gap="24" wrap horizontal="center" vertical="center" className={styles.heroFoot}>
              <Row gap="12" vertical="center">
                <Row className={styles.slotsTrack} style={{ width: "6rem" }}>
                  <span className={styles.slotsFill} style={{ width: `${slotsPct}%` }} />
                </Row>
                <Text variant="label-default-s" onBackground="neutral-weak">
                  Noch {BLACK_FRIDAY.slotsLeft} von {BLACK_FRIDAY.slotsTotal} Plätzen frei
                </Text>
              </Row>
              <Text variant="label-default-s" onBackground="neutral-weak">
                <span className={styles.stars}>★★★★★</span> „{CTA_PROOF.quote}“
              </Text>
            </Row>
          </HeroIn>
        </Column>
      </Column>

      {/* ---------- Ticker ---------- */}
      <Row className={styles.ticker} fillWidth aria-hidden="true">
        <Row className={styles.tickerTrack} data-bf-ticker="">
          {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: dekorative Laufschrift
            <span key={i} className={styles.tickerItem}>
              {item}
              <span className={styles.tickerStar}>✦</span>
            </span>
          ))}
        </Row>
      </Row>

      {/* ---------- Angebote ---------- */}
      <Column
        as="section"
        id="angebot"
        fillWidth
        horizontal="center"
        paddingX="l"
        paddingY="104"
        m={{ paddingY: "64" }}
        style={{ scrollMarginTop: "calc(96 * var(--px))" }}
      >
        <Column fillWidth maxWidth={68} gap="48" m={{ gap: "32" }}>
          <Column gap="16" horizontal="center" align="center">
            <Text variant="label-strong-s" className={styles.kicker}>
              Deine Black-Friday-Geschenke
            </Text>
            <Heading
              as="h2"
              variant="display-strong-m"
              wrap="balance"
              style={{ letterSpacing: "-0.035em" }}
            >
              Zwei Geschenke. <span className={styles.serif}>Minus 80 %.</span>
            </Heading>
            <Text
              variant="body-default-l"
              onBackground="neutral-weak"
              wrap="balance"
              style={{ maxWidth: "36rem" }}
            >
              Gleiche Qualität wie zum regulären Preis. Nur schneller entschieden.
            </Text>
          </Column>

          <Grid columns="2" m={{ columns: "1" }} gap="24">
            {BLACK_FRIDAY_PACKAGES.map((pkg, index) => {
              const featured = Boolean(pkg.badge);
              return (
                <Column key={pkg.id} fillHeight data-bf-card="">
                  <Column
                    className={classNames(styles.gift, featured && styles.giftFeatured)}
                    radius="xl"
                    padding="40"
                    s={{ padding: "24" }}
                    gap="24"
                    fillHeight
                  >
                    <span className={styles.ribbon} data-bf-ribbon="" aria-hidden="true" />
                    <Bow />

                    <Row gap="8" wrap>
                      {pkg.badge && (
                        <span className={styles.badge} data-bf-pop="">
                          {pkg.badge}
                        </span>
                      )}
                      <span className={styles.discount} data-bf-pop="">
                        {BLACK_FRIDAY.discountLabel}
                      </span>
                    </Row>

                    <Column gap="8">
                      <Heading as="h3" variant="heading-strong-xl">
                        {pkg.name}
                      </Heading>
                      <Text variant="body-default-m" onBackground="neutral-weak">
                        {pkg.tagline}
                      </Text>
                    </Column>

                    <Row gap="12" vertical="end" wrap>
                      <Text
                        className={styles.bigPrice}
                        onBackground="neutral-strong"
                        data-bf-price=""
                        data-from={pkg.regularPrice}
                        data-to={pkg.price}
                      >
                        {pkg.priceLabel}
                      </Text>
                      <Text
                        className={styles.strike}
                        style={{ marginBottom: "0.6rem" }}
                        data-bf-strike=""
                      >
                        {pkg.regularLabel}
                      </Text>
                    </Row>

                    <Column as="ul" gap="12" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {pkg.features.map((feature) => (
                        <Row as="li" key={feature} gap="12" vertical="start" data-bf-feature="">
                          <span className={styles.check}>
                            <Icon name="check" size="xs" />
                          </span>
                          <Text variant="body-default-m" onBackground="neutral-medium">
                            {feature}
                          </Text>
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
                </Column>
              );
            })}
          </Grid>

          <Row gap="12" horizontal="center" vertical="center" wrap>
            <Text variant="label-default-s" onBackground="neutral-weak">
              Angebot endet in
            </Text>
            <Countdown size="m" />
          </Row>
        </Column>
      </Column>

      {/* ---------- Leistungen ---------- */}
      <Column
        as="section"
        fillWidth
        horizontal="center"
        paddingX="l"
        paddingY="104"
        m={{ paddingY: "64" }}
        background="surface"
      >
        <Column fillWidth maxWidth={68} gap="48" m={{ gap: "32" }}>
          <Column gap="16" maxWidth={42}>
            <Text variant="label-strong-s" className={styles.kicker}>
              Immer dabei
            </Text>
            <Heading as="h2" variant="display-strong-s" wrap="balance">
              Günstig im Preis.{" "}
              <span className={classNames(styles.serif, styles.muted)}>Nicht in der Qualität.</span>
            </Heading>
          </Column>

          <Grid columns="3" m={{ columns: "2" }} s={{ columns: "1" }} gap="16">
            {included.map((item, index) => (
              <Column key={item.title} fillHeight data-bf-included="">
                <Column className={styles.step} radius="l" padding="24" gap="12" fillHeight>
                  <Row className={styles.iconBadge} center radius="m" data-bf-icon="">
                    <Icon name={item.icon} size="m" onBackground="neutral-strong" />
                  </Row>
                  <Text variant="heading-strong-s" onBackground="neutral-strong">
                    {item.title}
                  </Text>
                  <Text variant="body-default-m" onBackground="neutral-weak">
                    {item.body}
                  </Text>
                </Column>
              </Column>
            ))}
          </Grid>
        </Column>
      </Column>

      {/* ---------- Referenzen ---------- */}
      <Projects />

      {/* ---------- Ablauf + Garantie ---------- */}
      <Column
        as="section"
        fillWidth
        horizontal="center"
        paddingX="l"
        paddingY="104"
        m={{ paddingY: "64" }}
      >
        <Column fillWidth maxWidth={68} gap="48" m={{ gap: "32" }}>
          <Column gap="16" horizontal="center" align="center">
            <Text variant="label-strong-s" className={styles.kicker}>
              So einfach geht’s
            </Text>
            <Heading as="h2" variant="display-strong-s" wrap="balance">
              In drei Schritten <span className={styles.serif}>online.</span>
            </Heading>
          </Column>

          <Column fillWidth gap="0" data-bf-steps="">
            <Row className={styles.stepTrack} fillWidth aria-hidden="true">
              <span className={styles.stepLine} data-bf-stepline="" />
            </Row>
            <Grid columns="3" m={{ columns: "1" }} gap="16">
              {steps.map((step, index) => (
                <Column key={step.title} fillHeight data-bf-step="">
                  <Column className={styles.step} radius="l" padding="32" gap="16" fillHeight>
                    <Text className={classNames(styles.stepNumber, styles.gold)} data-bf-stepnum="">
                      {String(index + 1).padStart(2, "0")}
                    </Text>
                    <Text variant="heading-strong-m" onBackground="neutral-strong">
                      {step.title}
                    </Text>
                    <Text variant="body-default-m" onBackground="neutral-weak">
                      {step.body}
                    </Text>
                  </Column>
                </Column>
              ))}
            </Grid>
          </Column>

          <Reveal>
            <Row
              className={styles.guarantee}
              radius="xl"
              padding="40"
              s={{ direction: "column", padding: "24" }}
              gap="32"
              vertical="center"
            >
              <span className={styles.seal} data-bf-seal="">
                0 €
                <br />
                Risiko
              </span>
              <Column gap="12" flex={1}>
                <Heading as="h3" variant="heading-strong-xl" wrap="balance">
                  Erst der Entwurf. Dann entscheidest du.
                </Heading>
                <Text variant="body-default-l" onBackground="neutral-weak">
                  Du bekommst deinen Entwurf kostenlos. Gefällt er dir nicht, gehst du einfach. Ohne
                  Kosten, ohne Diskussion. Gefällt er dir, bauen wir ihn zum Black-Friday-Preis
                  fertig.
                </Text>
              </Column>
            </Row>
          </Reveal>
        </Column>
      </Column>

      {/* ---------- Formular ---------- */}
      <Column
        as="section"
        id="kontakt"
        className={styles.formSection}
        fillWidth
        horizontal="center"
        paddingX="l"
        paddingY="104"
        m={{ paddingY: "64" }}
        background="surface"
        style={{ scrollMarginTop: "calc(80 * var(--px))" }}
      >
        <Grid
          fillWidth
          maxWidth={68}
          columns="2"
          m={{ columns: "1" }}
          gap="48"
          style={{ alignItems: "center" }}
          data-bf-form=""
        >
          <Column gap="24">
            <Text variant="label-strong-s" className={styles.kicker}>
              Letzte Chance
            </Text>
            <Heading
              as="h2"
              variant="display-strong-m"
              wrap="balance"
              style={{ letterSpacing: "-0.035em" }}
            >
              Sichere dir deinen{" "}
              <span className={classNames(styles.serif, styles.gold)}>Platz.</span>
            </Heading>
            <Text variant="body-default-l" onBackground="neutral-weak">
              60 Sekunden ausfüllen, kein Risiko. Ich melde mich innerhalb von 24 Stunden persönlich
              und wir planen deinen kostenlosen Entwurf.
            </Text>
            <Column gap="12">
              <Text variant="label-default-s" onBackground="neutral-weak">
                Angebot endet in
              </Text>
              <Countdown size="m" />
            </Column>
            <Column className={styles.quote} gap="8" paddingLeft="16">
              <Text variant="body-default-m" onBackground="neutral-strong">
                „{CTA_PROOF.quote}“
              </Text>
              <Text variant="label-default-s" onBackground="neutral-weak">
                ★★★★★ {CTA_PROOF.attribution}
              </Text>
            </Column>
          </Column>

          <LeadForm />
        </Grid>
      </Column>

      {/* ---------- FAQ ---------- */}
      <Faq
        items={faqs}
        ctaTitle="Noch Fragen zur Aktion?"
        ctaDescription="Schreib mir kurz, ich antworte innerhalb von 24 Stunden."
        ctaButtonLabel="Frage stellen"
      />

      <SiteFooter />

      <StickyMobileCta
        label={`Black Friday · Website ${BLACK_FRIDAY_PACKAGES[0].priceLabel}`}
        buttonLabel="Platz sichern"
        href="#kontakt"
        whatsappHref={BLACK_FRIDAY_WHATSAPP_URL}
      />
    </BlackFridayScene>
  );
}
