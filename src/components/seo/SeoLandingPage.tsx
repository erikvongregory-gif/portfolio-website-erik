import { Column, Text } from "@once-ui-system/core/components";
import { StickyMobileCta } from "@/components";
import { JsonLd } from "@/components/JsonLd";
import { StartOffer } from "@/components/StartOffer";
import { CtaBand, Glow, StudioFooter, StudioSection } from "@/components/studio";
import { startOfferFaqSentence } from "@/lib/startOffer";
import {
  getSeoPageLabel,
  type SeoPage,
  seoReferences,
  seoServices,
} from "@/lib/seoPages";
import { baseURL } from "@/resources";
import { FaqList, ItemGrid, PillList, PriceList, ProcessSteps } from "./LandingBlocks";
import { LandingHero } from "./LandingHero";
import { WorkShowcase } from "./WorkShowcase";
import styles from "./Landing.module.scss";

const priceFaq = {
  question: "Was kostet eine Website bei EvGlab?",
  answer:
    "Richtpreise: komplette Website ab 2.500 €, Landingpage ab 1.500 €, Betreuung ab 99 € monatlich. Den genauen Festpreis klären wir im Erstgespräch. Den Entwurf siehst du vor der Beauftragung kostenlos." +
    startOfferFaqSentence(),
};

/** Films shown next to each website reference (ids from src/lib/showreel.ts). */
const filmsByReference: Record<SeoPage["reference"], string[]> = {
  jungen: ["ibjungen", "osmo-pocket", "tidely"],
  luenebraeu: ["osmo-pocket", "ibjungen", "kontext"],
  daPeppe: ["airpods-pro", "ibjungen", "tidely"],
  salonLiora: ["airpods-pro", "tidely", "ibjungen"],
  kapitalanlagen: ["ibjungen", "veyra", "osmo-pocket"],
};

function buildStructuredData(page: SeoPage, faqs: SeoPage["faqs"]) {
  const url = `${baseURL}/${page.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: page.metaTitle,
        description: page.metaDescription,
        inLanguage: "de-DE",
        isPartOf: { "@id": `${baseURL}/#website` },
        about: { "@id": `${url}#service` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Start", item: baseURL },
          { "@type": "ListItem", position: 2, name: page.name, item: url },
        ],
      },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: page.name,
        description: page.metaDescription,
        provider: { "@type": "ProfessionalService", "@id": `${baseURL}/#business`, name: "EvGlab", url: baseURL },
        ...(page.places
          ? { areaServed: page.places.map((name) => ({ "@type": "City", name })) }
          : { areaServed: { "@type": "Country", name: "Deutschland" } }),
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };
}

export function SeoLandingPage({ page }: { page: SeoPage }) {
  const reference = seoReferences[page.reference];
  const faqs = [...page.faqs, priceFaq];

  return (
    <Column fillWidth horizontal="center" data-theme="dark">
      <JsonLd data={buildStructuredData(page, faqs)} />

      <LandingHero
        crumb={page.name}
        kicker={page.tag}
        title={
          <>
            {page.h1} <Glow>{page.h1Weak}</Glow>
          </>
        }
        lead={page.lead}
        ctaLabel="Kostenloser Entwurf"
        funnel
        secondary={{ label: "Projekte ansehen", href: "/#arbeiten" }}
        trust="Antwort innerhalb 24h · Direkt mit Erik · Entwurf vor der Beauftragung"
      />

      <StudioSection
        id="fokus"
        kicker="Worauf es ankommt"
        title={
          <>
            {page.focusTitle} <Glow>{page.focusTitleWeak}</Glow>
          </>
        }
        intro={page.focusIntro}
      >
        <ItemGrid items={page.focus} columns="3" />
      </StudioSection>

      <StudioSection id="details" tone="paper" title={page.deepTitle}>
        <Column className={`${styles.prose} ${styles.paperTone}`} gap="24">
          {page.deepParagraphs.map((paragraph) => (
            <Text as="p" key={paragraph.slice(0, 32)} className={styles.paragraph}>
              {paragraph}
            </Text>
          ))}
        </Column>
        {page.places && (
          <PillList
            tone="paper"
            label="Einzugsgebiet"
            items={page.places.map((place) => ({ label: place }))}
          />
        )}
      </StudioSection>

      <StudioSection id="referenz" kicker="Aus meiner Arbeit" title={reference.title}>
        <WorkShowcase
          reference={reference}
          filmIds={filmsByReference[page.reference]}
          filmsTitle="Und Filme, die für Aufmerksamkeit sorgen"
          hideRefTitle
        />
      </StudioSection>

      <StudioSection
        id="leistungen"
        kicker="Leistungen & Preise"
        title={
          <>
            Klare Richtpreise, <Glow>fester Preis nach dem Gespräch.</Glow>
          </>
        }
      >
        <StartOffer />
        <PriceList items={seoServices} />
      </StudioSection>

      <StudioSection
        id="ablauf"
        kicker="Ablauf"
        title={
          <>
            Fünf Schritte, dann bist du <Glow>live.</Glow>
          </>
        }
        intro="Du brauchst kein Technik-Wissen. Ich führe dich durch alles."
      >
        <ProcessSteps />
      </StudioSection>

      <StudioSection id="faq" kicker="FAQ" title={`Häufige Fragen: ${page.name}`}>
        <FaqList items={faqs} />
        <Column as="nav" aria-label="Passende Seiten" gap="16">
          <Text className={styles.refMeta}>Das könnte auch passen</Text>
          <PillList
            items={page.related.map((slug) => ({ label: getSeoPageLabel(slug), href: `/${slug}` }))}
          />
        </Column>
      </StudioSection>

      <Column id="kontakt" fillWidth>
        <CtaBand />
      </Column>
      <StickyMobileCta label="Kostenloser Entwurf" buttonLabel="Starten" funnel />
      <StudioFooter />
    </Column>
  );
}
