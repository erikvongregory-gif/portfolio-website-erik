import { Column } from "@once-ui-system/core/components";
import { JsonLd } from "@/components/JsonLd";
import {
  HomeFaq,
  HomePricing,
  HomeProcess,
  HomeServices,
  HomeStatement,
  HomeVoices,
  HomeWork,
} from "@/components/home";
import { CtaBand, HaloHero, StudioFooter } from "@/components/studio";
import { START_OFFER, isStartOfferActive } from "@/lib/startOffer";
import { baseURL } from "@/resources";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${baseURL}/#business`,
  name: "EvGlab",
  alternateName: "Erik EvGlab",
  description:
    "Agentur für Werbematerial aus Landsberg am Lech: Webdesign und Webentwicklung, 3D-Produktanimationen und 3D-Produktfilme für Messen sowie Reels und Social-Media-Videos aus einer Hand.",
  serviceType: [
    "3D-Produktanimation",
    "3D-Produktfilme für Messen",
    "Videoproduktion",
    "Reels und Social-Media-Videos",
    "Webdesign",
    "Webentwicklung",
    "Landingpage-Design",
    "Website-Betreuung",
  ],
  url: baseURL,
  image: `${baseURL}/opengraph-image`,
  email: "info@evglab.com",
  telephone: "+4915565602176",
  priceRange: "€€",
  founder: {
    "@type": "Person",
    "@id": `${baseURL}/ueber-uns#erik`,
    name: "Erik von Gregory",
    url: `${baseURL}/ueber-uns`,
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
      ...(isStartOfferActive()
        ? [
            {
              "@type": "Offer",
              priceCurrency: "EUR",
              price: String(START_OFFER.price),
              validThrough: START_OFFER.validUntil,
              itemOffered: { "@type": "Service", name: START_OFFER.title },
            },
          ]
        : []),
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
    <Column fillWidth>
      <JsonLd data={structuredData} />
      <HaloHero />
      <HomeWork />
      <HomeServices />
      <HomeStatement />
      <HomePricing />
      <HomeProcess />
      <HomeVoices />
      <HomeFaq />
      <CtaBand />
      <StudioFooter />
    </Column>
  );
}
