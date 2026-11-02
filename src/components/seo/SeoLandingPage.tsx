import Image from "next/image";
import {
  Column,
  Grid,
  Heading,
  Icon,
  Row,
  SmartLink,
  Tag,
  Text,
} from "@once-ui-system/core";
import {
  FinalCta,
  Process,
  Reveal,
  Section,
  SectionHeader,
  SiteFooter,
  SpotlightCard,
  StickyMobileCta,
} from "@/components";
import { ContactDialog } from "@/components/ContactDialog";
import { JsonLd } from "@/components/JsonLd";
import { StartOffer } from "@/components/StartOffer";
import { startOfferFaqSentence } from "@/lib/startOffer";
import {
  getSeoPageLabel,
  type SeoPage,
  seoReferences,
  seoServices,
} from "@/lib/seoPages";
import { baseURL } from "@/resources";

const priceFaq = {
  question: "Was kostet eine Website bei EvGlab?",
  answer:
    "Richtpreise: komplette Website ab 2.500 €, Landingpage ab 1.500 €, Betreuung ab 99 € monatlich. Den genauen Festpreis klären wir im Erstgespräch. Den Entwurf siehst du vor der Beauftragung kostenlos." +
    startOfferFaqSentence(),
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
    <Column fillWidth horizontal="center">
      <JsonLd data={buildStructuredData(page, faqs)} />

      <Column
        as="section"
        data-sticky-cta-hero
        fillWidth
        horizontal="center"
        paddingX="l"
        paddingTop="160"
        paddingBottom="64"
        m={{ paddingTop: "104" }}
      >
        <Column fillWidth maxWidth={68} gap="24" horizontal="start" align="left">
          <Reveal y={16}>
            <Row as="nav" aria-label="Breadcrumb" gap="8" vertical="center" wrap>
              <SmartLink href="/">
                <Text variant="label-default-s" onBackground="neutral-weak">
                  Start
                </Text>
              </SmartLink>
              <Text variant="label-default-s" onBackground="neutral-weak" aria-hidden="true">
                /
              </Text>
              <Text variant="label-default-s" onBackground="neutral-medium">
                {page.name}
              </Text>
            </Row>
          </Reveal>

          <Reveal delay={0.06}>
            <Tag size="s" variant="neutral">
              {page.tag}
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
              {page.h1}{" "}
              <Text as="span" onBackground="neutral-weak">
                {page.h1Weak}
              </Text>
            </Heading>
          </Reveal>

          <Reveal delay={0.16}>
            <Text
              variant="body-default-xl"
              onBackground="neutral-weak"
              style={{ maxWidth: "44rem", lineHeight: 1.5 }}
            >
              {page.lead}
            </Text>
          </Reveal>

          <Reveal delay={0.2}>
            <Row gap="16" wrap vertical="center" paddingTop="8">
              <ContactDialog label="Kostenloser Entwurf" size="l" funnel />
              <SmartLink href="/#projekte" unstyled>
                <Text variant="label-strong-s" onBackground="neutral-strong">
                  Projekte ansehen
                </Text>
              </SmartLink>
            </Row>
          </Reveal>

          <Reveal delay={0.24}>
            <Text variant="label-default-s" onBackground="neutral-weak">
              Antwort innerhalb 24h · Direkt mit Erik · Entwurf vor der Beauftragung
            </Text>
          </Reveal>
        </Column>
      </Column>

      <Section id="fokus" background="surface">
        <SectionHeader
          eyebrow="Worauf es ankommt"
          title={
            <>
              {page.focusTitle}{" "}
              <Text as="span" onBackground="neutral-weak">
                {page.focusTitleWeak}
              </Text>
            </>
          }
          description={page.focusIntro}
        />
        <Grid columns="3" m={{ columns: "1" }} gap="16">
          {page.focus.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06}>
              <Column fillHeight>
                <SpotlightCard
                  background="page"
                  border="neutral-alpha-weak"
                  radius="l"
                  padding="32"
                  gap="12"
                  fillHeight
                >
                  <Heading as="h3" variant="heading-strong-s" onBackground="neutral-strong">
                    {item.title}
                  </Heading>
                  <Text variant="body-default-m" onBackground="neutral-weak">
                    {item.body}
                  </Text>
                </SpotlightCard>
              </Column>
            </Reveal>
          ))}
        </Grid>
      </Section>

      <Section id="details" gap="32">
        <Column fillWidth maxWidth={46} gap="24">
          <Reveal>
            <Heading
              as="h2"
              variant="display-strong-s"
              onBackground="neutral-strong"
              wrap="balance"
              style={{ letterSpacing: "-0.03em", lineHeight: 1.05 }}
            >
              {page.deepTitle}
            </Heading>
          </Reveal>
          {page.deepParagraphs.map((paragraph) => (
            <Reveal key={paragraph.slice(0, 32)} delay={0.06}>
              <Text as="p" variant="body-default-l" onBackground="neutral-weak">
                {paragraph}
              </Text>
            </Reveal>
          ))}
          {page.places && (
            <Reveal delay={0.1}>
              <Row gap="8" wrap paddingTop="8" aria-label="Einzugsgebiet">
                {page.places.map((place) => (
                  <Tag key={place} size="m" variant="neutral">
                    {place}
                  </Tag>
                ))}
              </Row>
            </Reveal>
          )}
        </Column>
      </Section>

      <Section id="referenz" background="surface">
        <SectionHeader eyebrow="Aus meiner Arbeit" title={reference.title} />
        <Row fillWidth gap="40" vertical="center" m={{ direction: "column", gap: "24" }}>
          <Column flex={5} fillWidth gap="16">
            <Tag size="s" variant="neutral">
              {reference.category}
            </Tag>
            <Text variant="body-default-l" onBackground="neutral-weak">
              {reference.body}
            </Text>
            {reference.quote && (
              <Text as="blockquote" variant="heading-default-m" onBackground="neutral-strong" style={{ margin: 0 }}>
                „{reference.quote}“
              </Text>
            )}
            {reference.url && (
              <SmartLink href={reference.url} target="_blank" rel="noopener noreferrer" unstyled>
                <Row gap="4" vertical="center">
                  <Text variant="label-strong-s" onBackground="neutral-strong">
                    Live ansehen
                  </Text>
                  <Icon name="arrowUpRight" size="xs" onBackground="neutral-strong" />
                </Row>
              </SmartLink>
            )}
          </Column>
          <Column flex={7} fillWidth radius="l" border="neutral-alpha-weak" overflow="hidden" aspectRatio="16 / 10">
            <Image
              src={reference.image}
              alt={`${reference.title}: Website-Projekt von EvGlab`}
              fill
              sizes="(max-width: 1024px) 100vw, (min-width: 1921px) 31vw, 600px"
              style={{ objectFit: "cover", objectPosition: "top" }}
            />
          </Column>
        </Row>
      </Section>

      <Section id="leistungen">
        <SectionHeader
          eyebrow="Leistungen & Preise"
          title={
            <>
              Klare Richtpreise,{" "}
              <Text as="span" onBackground="neutral-weak">
                fester Preis nach dem Gespräch.
              </Text>
            </>
          }
        />
        <StartOffer />
        <Grid columns="3" m={{ columns: "1" }} gap="16">
          {seoServices.map((service) => (
            <SmartLink key={service.title} href={service.href} unstyled fillWidth>
              <Column
                fill
                gap="8"
                padding="24"
                background="surface"
                border="neutral-alpha-weak"
                radius="l"
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
              </Column>
            </SmartLink>
          ))}
        </Grid>
      </Section>

      <Process />

      <Section id="faq">
        <SectionHeader eyebrow="FAQ" title={`Häufige Fragen: ${page.name}`} />
        <Column fillWidth gap="16" maxWidth={48}>
          {faqs.map((faq) => (
            <Column
              key={faq.question}
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
          ))}
        </Column>

        <Column as="nav" aria-label="Passende Seiten" gap="12" paddingTop="16">
          <Text variant="label-strong-s" onBackground="neutral-strong">
            Das könnte auch passen
          </Text>
          <Row gap="8" wrap>
            {page.related.map((slug) => (
              <SmartLink key={slug} href={`/${slug}`} unstyled>
                <Tag size="m" variant="neutral">
                  {getSeoPageLabel(slug)}
                </Tag>
              </SmartLink>
            ))}
          </Row>
        </Column>
      </Section>

      <FinalCta />
      <StickyMobileCta label="Kostenloser Entwurf" buttonLabel="Starten" funnel />
      <SiteFooter />
    </Column>
  );
}
