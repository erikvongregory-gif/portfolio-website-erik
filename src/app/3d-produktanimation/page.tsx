import type { Metadata } from "next";
import { Column } from "@once-ui-system/core";
import { JsonLd } from "@/components/JsonLd";
import {
  IMAGEFILM_HLS,
  MesseAnalyse,
  MesseBento,
  MesseCanvas,
  MesseCompare,
  MesseCta,
  MesseExamples,
  MesseFactors,
  MesseHero,
  MesseRequestProvider,
  MesseSection,
  SrOnly,
} from "@/components/messe";
import { Glow, StudioFooter, StudioSection } from "@/components/studio";
import { baseURL } from "@/resources";

const PAGE_PATH = "/3d-produktanimation";
const PAGE_URL = `${baseURL}${PAGE_PATH}`;
const PAGE_TITLE = "EvGlab | 3D-Produktfilme für Messen";
const PAGE_DESCRIPTION =
  "3D-Produktfilme für Ihren Messeauftritt, in jeder Branche. Gemacht, damit Besucher stehen bleiben.";
const OG_IMAGE = {
  url: "/3d-produktanimation/images/og.png",
  width: 1200,
  height: 630,
  type: "image/png",
  alt: "EvGlab: 3D-Produktfilme für Messen. Gemacht, damit Besucher stehen bleiben.",
};

export const metadata: Metadata = {
  // Absolute: this landing page keeps its own title without the site suffix.
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_PATH,
    type: "website",
    locale: "de_DE",
    siteName: "EvGlab",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: "3D-Produktfilme für Messen",
      description: PAGE_DESCRIPTION,
      inLanguage: "de-DE",
      isPartOf: { "@type": "WebSite", name: "EvGlab", url: baseURL },
      about: { "@id": `${PAGE_URL}#service` },
      primaryImageOfPage: `${baseURL}${OG_IMAGE.url}`,
    },
    {
      "@type": "Service",
      "@id": `${PAGE_URL}#service`,
      name: "3D-Produktfilme für Messen",
      serviceType: "3D-Produktanimation",
      description:
        "3D-Produktfilme, die aus Messe-Laufkundschaft echte Gespräche für den Vertrieb machen: Storyboard mit Stopp-Effekt, Freigabe durch Ihre Fachleute vor dem Rendern, jedes Format für Messestand, LED-Wand und Social Media, Lieferung pünktlich zum ersten Messetag.",
      provider: { "@type": "ProfessionalService", "@id": `${baseURL}/#business`, name: "EvGlab", url: baseURL },
      areaServed: [
        { "@type": "Country", name: "Deutschland" },
        { "@type": "Country", name: "Österreich" },
        { "@type": "Country", name: "Schweiz" },
      ],
      audience: { "@type": "BusinessAudience", audienceType: "Unternehmen mit Messeauftritt" },
      offers: { "@type": "Offer", name: "Kostenlose Potenzialanalyse", price: "0", priceCurrency: "EUR" },
    },
    {
      "@type": "VideoObject",
      name: "Imagefilm von EvGlab",
      description: "Beispiel-Imagefilm von EvGlab: 60 Sekunden, bis 4K mit 50 fps.",
      thumbnailUrl: `${baseURL}/3d-produktanimation/images/film-poster.webp`,
      contentUrl: IMAGEFILM_HLS,
      uploadDate: "2026-11-06T11:36:31+01:00",
      duration: "PT60S",
      inLanguage: "de-DE",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Start", item: `${baseURL}/` },
        { "@type": "ListItem", position: 2, name: "3D-Produktfilme für Messen", item: PAGE_URL },
      ],
    },
  ],
};

export default function MessePage() {
  return (
    <MesseRequestProvider>
      <Column fillWidth>
        <JsonLd data={structuredData} />

        <MesseHero />

        <MesseCanvas>
          <MesseSection
            id="film"
            kicker="Beispiel"
            title={
              <>
                Komplexe Produkte, <Glow>in Sekunden verstanden</Glow>.
              </>
            }
          >
            <MesseExamples />
          </MesseSection>

          <MesseSection
            id="faktoren"
            title={
              <>
                Drei Dinge, die ein Messevideo <Glow>leisten muss</Glow>.
              </>
            }
            intro="Am Stand gelten andere Regeln als auf der Website: kein Ton, wenig Zeit, viel Ablenkung. Diese drei Punkte entscheiden, ob jemand stehen bleibt."
          >
            <MesseFactors />
          </MesseSection>

          <MesseSection id="ablauf" aria-labelledby="ablauf-title">
            <SrOnly as="h2" id="ablauf-title">
              Ablauf
            </SrOnly>
            <MesseBento />
          </MesseSection>

          <StudioSection
            id="vergleich"
            tone="paper"
            kicker="Warum wir"
            title={
              <>
                Das unterscheidet uns von <Glow>klassischen 3D-Studios</Glow>.
              </>
            }
          >
            <MesseCompare />
          </StudioSection>

          <MesseSection
            id="kontakt"
            kicker="Nächster Schritt"
            title={
              <>
                Ihre nächste Messe beginnt <Glow>mit einem Gespräch</Glow>.
              </>
            }
          >
            <MesseCta />
          </MesseSection>

          <MesseAnalyse />
        </MesseCanvas>

        <StudioFooter />
      </Column>
    </MesseRequestProvider>
  );
}
