import type { Metadata } from "next";
import { Column, SmartLink, Text } from "@once-ui-system/core/components";
import { FILM_SERVICES } from "@/lib/filmServices";
import { JsonLd } from "@/components/JsonLd";
import {
  FilmCombo,
  FilmFaq,
  type FilmFaqItem,
  FilmGallery,
  FilmProcess,
  type FilmService,
  FilmServiceList,
  type FilmStep,
  OrbHero,
} from "@/components/films";
import { CtaBand, Glow, StudioFooter, StudioSection } from "@/components/studio";
import { showreel } from "@/lib/showreel";
import { baseURL, createPageOpenGraph, createPageTwitter, filmsOgImage } from "@/resources";

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
    image: filmsOgImage,
  }),
  twitter: createPageTwitter(PAGE_TITLE, PAGE_DESCRIPTION, filmsOgImage),
};

const services: FilmService[] = FILM_SERVICES;

const steps: FilmStep[] = [
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

const faqs: FilmFaqItem[] = [
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
    <Column fillWidth>
      <JsonLd data={structuredData} />

      <OrbHero />

      <StudioSection
        id="showreel"
        kicker="Showreel"
        title={
          <>
            Was bisher <Glow>gebaut wurde.</Glow>
          </>
        }
        intro="Logo-Filme, Produktfilme, Spots und Reels. Zum Abspielen mit Ton einfach antippen."
      >
        <FilmGallery />
      </StudioSection>

      <StudioSection
        id="leistungen"
        kicker="Leistungen"
        title={
          <>
            Vom Logo-Ident <Glow>bis zum Monatsplan für Reels.</Glow>
          </>
        }
        intro="Richtpreise als Orientierung. Den genauen Umfang klären wir im kostenlosen Erstgespräch."
      >
        <FilmServiceList services={services} />
        <FilmCombo
          title="Zum Launch nicht nur online, sondern sichtbar."
          text="Neue Website plus Launchfilm im Hero plus drei Reels für deine Kanäle – alles im selben Look, aus einer Hand. So hast du am ersten Tag etwas zu zeigen."
          items={[
            "Website mit kostenlosem Entwurf",
            "Launchfilm 16:9 für den Hero",
            "3 Reels in 9:16 zum Go-live",
            "Ein Ansprechpartner für alles",
          ]}
        />
      </StudioSection>

      <StudioSection
        id="ablauf"
        kicker="Ablauf"
        title={
          <>
            In vier Schritten <Glow>zum fertigen Film.</Glow>
          </>
        }
        intro="Du siehst jede Einstellung, bevor gerendert wird. Freigaben statt Überraschungen."
      >
        <FilmProcess steps={steps} />
      </StudioSection>

      <StudioSection
        id="faq"
        kicker="FAQ"
        title={
          <>
            Häufige Fragen <Glow>zu Videos und 3D.</Glow>
          </>
        }
      >
        <FilmFaq faqs={faqs} />
        <Text as="p" variant="body-default-m" style={{ color: "var(--studio-ink-2)" }}>
          Du brauchst zuerst eine Website?{" "}
          <SmartLink href="/#leistungen">Zu den Webdesign-Leistungen</SmartLink>.
        </Text>
      </StudioSection>

      <CtaBand
        title={
          <>
            Lass uns deinen <Glow>Film</Glow> bauen.
          </>
        }
        text="Erzähl kurz, was du zeigen willst. Du bekommst eine erste Idee und eine ehrliche Einschätzung zu Aufwand und Preis, persönlich von Erik."
        ctaLabel="Film anfragen"
        topic="film"
      />
      <StudioFooter />
    </Column>
  );
}
