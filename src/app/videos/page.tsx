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
import { HeroReel, VideoGallery } from "@/components/videos";
import { showreel } from "@/lib/showreel";
import { baseURL, createPageOpenGraph, createPageTwitter } from "@/resources";

const PAGE_PATH = "/videos";
const PAGE_TITLE = "Videos, 3D-Logo-Animation & Social Media";
const PAGE_DESCRIPTION =
  "3D-Logo-Animationen, Produktfilme und Reels für Instagram, TikTok und LinkedIn – in Blender und Motion Design gebaut, passend zu deiner Website. Von Erik EvGlab.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    "Logo Animation erstellen lassen",
    "3D Logo Animation",
    "3D Produktvideo",
    "Blender Produktfilm",
    "Social Media Videos erstellen lassen",
    "Reels erstellen lassen",
    "Motion Design Agentur",
    "Werbevideo Landsberg",
  ],
  alternates: { canonical: PAGE_PATH },
  openGraph: createPageOpenGraph({
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    path: PAGE_PATH,
  }),
  twitter: createPageTwitter(PAGE_TITLE, PAGE_DESCRIPTION),
};

const services: { icon: IconName; title: string; price: string; body: string; points: string[] }[] = [
  {
    icon: "cube",
    title: "3D-Logo-Animation",
    price: "ab 490 €",
    body: "Dein Logo als Metall, Glas oder Licht – in Blender gebaut und gerendert. Ideal als Intro, Outro und Profil-Video.",
    points: ["5–10 Sekunden", "16:9 und 9:16", "mit Sounddesign"],
  },
  {
    icon: "film",
    title: "Produktfilm & CGI",
    price: "ab 1.490 €",
    body: "Dein Produkt im Studio-Look, ohne Fotoshooting. Makros, Kamerafahrten und Licht, die es in echt kaum gibt.",
    points: ["15–45 Sekunden", "3D-Modell inklusive", "Musik und Texttafeln"],
  },
  {
    icon: "rocket",
    title: "Werbespot & Erklärfilm",
    price: "ab 990 €",
    body: "Motion Design mit kinetischer Typo, UI-Animation und Sprecher. Für Website-Hero, Ads und Messen.",
    points: ["20–60 Sekunden", "Skript und Storyboard", "optional Voiceover"],
  },
  {
    icon: "phone",
    title: "Social-Media-Paket",
    price: "ab 690 € / Monat",
    body: "Regelmäßig neue Reels für Instagram, TikTok und LinkedIn – im Look deiner Marke, fertig zum Posten.",
    points: ["4 Reels pro Monat", "Hooks und Captions", "monatlich kündbar"],
  },
];

const steps: { title: string; body: string }[] = [
  {
    title: "Briefing",
    body: "Kurzes Gespräch: Ziel, Plattform, Stil. Du schickst Logo oder Produktfotos, ich schlage zwei bis drei Richtungen vor.",
  },
  {
    title: "Storyboard",
    body: "Standbilder für jede Einstellung, dazu die Musik. Du gibst frei, bevor gerendert wird – keine Überraschungen.",
  },
  {
    title: "Vorschau",
    body: "Eine schnelle Fassung mit Ton zum Ansehen auf dem Handy. Hier sind Änderungen noch günstig.",
  },
  {
    title: "Endrender",
    body: "Fertiger Film in voller Qualität, in allen Formaten, die du brauchst: 16:9, 9:16, 4:5 und 1:1.",
  },
];

const faqs: { question: string; answer: string }[] = [
  {
    question: "Womit werden die Videos gemacht?",
    answer:
      "3D-Logos und Produktfilme entstehen in Blender, Motion-Design-Spots mit eigenem Code und Animationstools. Musik und Sounddesign werden passend zum Schnitt gesetzt, damit Bild und Ton im Takt sind.",
  },
  {
    question: "Brauche ich ein 3D-Modell meines Produkts?",
    answer:
      "Nein. Aus Fotos, technischen Zeichnungen oder Maßen baue ich das Modell selbst. Gibt es bereits CAD-Daten, geht es schneller.",
  },
  {
    question: "Welche Formate bekomme ich?",
    answer:
      "Standardmäßig 16:9 für Website und YouTube sowie 9:16 für Reels, TikTok und Stories. 4:5 und 1:1 für Feed-Posts gibt es auf Wunsch dazu.",
  },
  {
    question: "Wie lange dauert ein Video?",
    answer:
      "Eine Logo-Animation ist meist in einer Woche fertig, ein Produktfilm in zwei bis drei Wochen. Der Zeitplan steht nach dem Briefing fest.",
  },
  {
    question: "Kann ich Website und Video zusammen buchen?",
    answer:
      "Ja, das ist sogar ideal: Der Film nutzt dieselben Farben, Schriften und Texte wie deine neue Website und läuft direkt im Hero. Zum Launch gibt es passende Reels für Social Media.",
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
      breadcrumb: { "@id": `${baseURL}${PAGE_PATH}#breadcrumb` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${baseURL}${PAGE_PATH}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Start", item: baseURL },
        { "@type": "ListItem", position: 2, name: "Videos", item: `${baseURL}${PAGE_PATH}` },
      ],
    },
    {
      "@type": "OfferCatalog",
      "@id": `${baseURL}${PAGE_PATH}#angebot`,
      name: "Videos & Social Media",
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.title,
          description: service.body,
          provider: { "@id": `${baseURL}/#business` },
        },
      })),
    },
    ...showreel.map((item) => ({
      "@type": "VideoObject",
      name: `${item.title} – ${item.kind}`,
      description: `${item.kind} von EvGlab`,
      thumbnailUrl: `${baseURL}/videos/${item.id}.webp`,
      contentUrl: `${baseURL}/videos/${item.id}.mp4`,
      uploadDate: "2026-11-02",
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

export default function VideosPage() {
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
        m={{ paddingTop: "128" }}
      >
        <Row
          fillWidth
          maxWidth={68}
          gap="48"
          vertical="center"
          m={{ direction: "column", gap: "40" }}
        >
          <Column flex={6} gap="24" horizontal="start" align="left">
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
                  Videos
                </Text>
              </Row>
            </Reveal>

            <Reveal delay={0.06}>
              <Tag size="s" variant="neutral">
                3D · Motion Design · Social Media
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
                Videos, bei denen man{" "}
                <Text as="span" onBackground="neutral-weak">
                  nicht weiterscrollt.
                </Text>
              </Heading>
            </Reveal>

            <Reveal delay={0.16}>
              <Text
                variant="body-default-xl"
                onBackground="neutral-weak"
                wrap="balance"
                style={{ maxWidth: "36rem", lineHeight: 1.5 }}
              >
                3D-Logo-Animationen, Produktfilme und Reels für Instagram, TikTok und LinkedIn – in
                Blender und Motion Design gebaut, im Look deiner Marke und passend zu deiner
                Website.
              </Text>
            </Reveal>

            <Reveal delay={0.2}>
              <Row gap="16" wrap vertical="center" paddingTop="8">
                <ContactDialog label="Video anfragen" size="l" />
                <SmartLink href="#showreel" unstyled>
                  <Text variant="label-strong-s" onBackground="neutral-strong">
                    Showreel ansehen
                  </Text>
                </SmartLink>
              </Row>
            </Reveal>

            <Reveal delay={0.24}>
              <Text variant="label-default-s" onBackground="neutral-weak">
                Storyboard vor dem Render · Alle Formate · Antwort innerhalb 24h
              </Text>
            </Reveal>
          </Column>

          <Column flex={5} fillWidth>
            <Reveal delay={0.12}>
              <HeroReel />
            </Reveal>
          </Column>
        </Row>
      </Column>

      <Section id="showreel" maxWidth={76}>
        <SectionHeader
          eyebrow="Showreel"
          title={
            <>
              Was ich bisher{" "}
              <Text as="span" onBackground="neutral-weak">
                gebaut habe.
              </Text>
            </>
          }
          description="Logo-Filme, Produktfilme, Spots und Reels. Zum Abspielen mit Ton einfach antippen."
        />
        <VideoGallery />
      </Section>

      <Section id="leistungen" background="surface">
        <SectionHeader
          eyebrow="Leistungen"
          title={
            <>
              Vom Logo-Ident{" "}
              <Text as="span" onBackground="neutral-weak">
                bis zum Monatsplan für Reels.
              </Text>
            </>
          }
          description="Richtpreise als Orientierung. Den genauen Umfang klären wir im kostenlosen Erstgespräch."
        />

        <Grid columns="2" m={{ columns: "1" }} gap="16">
          {services.map((service, index) => (
            <Reveal key={service.title} delay={index * 0.06}>
              <Column fillHeight>
                <SpotlightCard
                  background="page"
                  border="neutral-alpha-weak"
                  radius="l"
                  padding="32"
                  gap="16"
                  fillHeight
                >
                  <Row fillWidth horizontal="between" vertical="center" gap="16">
                    <Icon name={service.icon} size="m" onBackground="neutral-strong" />
                    <Text variant="label-strong-m" onBackground="neutral-medium">
                      {service.price}
                    </Text>
                  </Row>
                  <Text variant="heading-strong-s" onBackground="neutral-strong">
                    {service.title}
                  </Text>
                  <Text variant="body-default-m" onBackground="neutral-weak">
                    {service.body}
                  </Text>
                  <Row gap="8" wrap paddingTop="4">
                    {service.points.map((point) => (
                      <Tag key={point} size="s" variant="neutral">
                        {point}
                      </Tag>
                    ))}
                  </Row>
                </SpotlightCard>
              </Column>
            </Reveal>
          ))}
        </Grid>
      </Section>

      <Section id="kombi">
        <Reveal>
          <Row
            fillWidth
            gap="40"
            padding="48"
            radius="xl"
            border="neutral-alpha-medium"
            background="surface"
            vertical="center"
            m={{ direction: "column", padding: "32", gap: "24" }}
          >
            <Column flex={3} gap="16" horizontal="start" align="left">
              <Tag size="s" variant="brand">
                Website + Video
              </Tag>
              <Heading
                as="h2"
                variant="display-strong-xs"
                onBackground="neutral-strong"
                wrap="balance"
                style={{ letterSpacing: "-0.03em", lineHeight: 1.08 }}
              >
                Zum Launch nicht nur online,{" "}
                <Text as="span" onBackground="neutral-weak">
                  sondern sichtbar.
                </Text>
              </Heading>
              <Text variant="body-default-l" onBackground="neutral-weak" wrap="balance">
                Neue Website plus Launchfilm im Hero plus drei Reels für deine Kanäle – alles im
                selben Look, aus einer Hand. So hast du am ersten Tag etwas zu zeigen.
              </Text>
            </Column>
            <Column flex={2} gap="12" fillWidth>
              {[
                "Website mit kostenlosem Entwurf",
                "Launchfilm 16:9 für den Hero",
                "3 Reels in 9:16 zum Go-live",
                "Ein Ansprechpartner für alles",
              ].map((item) => (
                <Row key={item} gap="12" vertical="center">
                  <Icon name="check" size="s" onBackground="brand-medium" />
                  <Text variant="body-default-m" onBackground="neutral-strong">
                    {item}
                  </Text>
                </Row>
              ))}
              <Row paddingTop="12">
                <ContactDialog label="Kombi anfragen" size="m" />
              </Row>
            </Column>
          </Row>
        </Reveal>
      </Section>

      <Section id="ablauf" background="surface">
        <SectionHeader
          eyebrow="Ablauf"
          title={
            <>
              In vier Schritten{" "}
              <Text as="span" onBackground="neutral-weak">
                zum fertigen Film.
              </Text>
            </>
          }
          description="Du siehst jede Einstellung, bevor gerendert wird. Freigaben statt Überraschungen."
        />

        <Grid columns="4" l={{ columns: "2" }} s={{ columns: "1" }} gap="16">
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.06}>
              <Column
                fillHeight
                gap="12"
                padding="24"
                radius="l"
                border="neutral-alpha-weak"
                background="page"
              >
                <Text variant="label-strong-s" onBackground="neutral-weak">
                  {String(index + 1).padStart(2, "0")}
                </Text>
                <Text variant="heading-strong-s" onBackground="neutral-strong">
                  {step.title}
                </Text>
                <Text variant="body-default-s" onBackground="neutral-weak">
                  {step.body}
                </Text>
              </Column>
            </Reveal>
          ))}
        </Grid>
      </Section>

      <Section id="faq">
        <SectionHeader
          eyebrow="FAQ"
          title={
            <>
              Häufige Fragen{" "}
              <Text as="span" onBackground="neutral-weak">
                zu Videos und 3D.
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
            Du brauchst zuerst eine Website?{" "}
            <SmartLink href="/#leistungen">
              <Text as="span" variant="body-default-m">
                Zu den Webdesign-Leistungen
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
