import type { Metadata } from "next";
import { Column } from "@once-ui-system/core/components";
import { AboutCraft, AboutHero, AboutStory, AboutValues, AboutWorkflow } from "@/components/about";
import { JsonLd } from "@/components/JsonLd";
import { CtaBand, StudioFooter } from "@/components/studio";
import { baseURL, studioOgImage, createPageOpenGraph, createPageTwitter } from "@/resources";

const DESCRIPTION =
  "Hinter EvGlab steht eine Person: Erik. Websites, 3D-Produktfilme und Reels aus Fuchstal bei Landsberg am Lech – direkt, ehrlich und ohne Umwege.";

export const metadata: Metadata = {
  title: "Über mich",
  description: DESCRIPTION,
  alternates: { canonical: "/ueber-uns" },
  openGraph: createPageOpenGraph({
    title: "Über mich",
    description: DESCRIPTION,
    path: "/ueber-uns",
    type: "profile",
    image: studioOgImage,
  }),
  twitter: createPageTwitter("Über mich", DESCRIPTION, studioOgImage),
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${baseURL}/ueber-uns#webpage`,
  url: `${baseURL}/ueber-uns`,
  name: "Über mich",
  description: DESCRIPTION,
  inLanguage: "de-DE",
  mainEntity: {
    "@type": "Person",
    "@id": `${baseURL}/ueber-uns#erik`,
    name: "Erik von Gregory",
    alternateName: ["Erik Freiherr von Gregory", "Erik EvGlab"],
    url: `${baseURL}/ueber-uns`,
    image: `${baseURL}/images/about/erik.png`,
    jobTitle: "Gründer von EvGlab, Agentur für Webdesign, 3D-Produktanimation und Reels",
    worksFor: { "@type": "ProfessionalService", "@id": `${baseURL}/#business`, name: "EvGlab" },
    knowsAbout: [
      "3D-Produktanimation",
      "Blender",
      "Motion Design",
      "Webdesign",
      "Webentwicklung",
      "Next.js",
    ],
    workLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Fuchstal",
        addressRegion: "Bayern",
        addressCountry: "DE",
      },
    },
  },
};

export default function UeberUns() {
  return (
    <Column fillWidth horizontal="center">
      <JsonLd data={structuredData} />
      <AboutHero />
      <AboutStory />
      <AboutWorkflow />
      <AboutCraft />
      <AboutValues />
      <CtaBand />
      <StudioFooter />
    </Column>
  );
}
