import { branchePages } from "./branchen";
import { leistungPages } from "./leistungen";
import { regionPages } from "./regionen";
import type { SeoPage, SeoReferenceKey } from "./types";

export * from "./nav";
export type { SeoPage } from "./types";

export const seoPages: SeoPage[] = [...regionPages, ...branchePages, ...leistungPages];

export function getSeoPage(slug: string): SeoPage | undefined {
  return seoPages.find((page) => page.slug === slug);
}

/** Linktext für verwandte Seiten; Landsberg hat eine eigene statische Route. */
export function getSeoPageLabel(slug: string): string {
  if (slug === "webdesign-landsberg") return "Webdesign Landsberg am Lech";
  return getSeoPage(slug)?.name ?? slug;
}

export type SeoReference = {
  title: string;
  category: string;
  image: string;
  body: string;
  url?: string;
  quote?: string;
};

/** Nur echte Projekte von der Startseite; Entwürfe bleiben als Entwurf gekennzeichnet. */
export const seoReferences: Record<SeoReferenceKey, SeoReference> = {
  daPeppe: {
    title: "Da Peppe",
    category: "Gastronomie · Landsberg",
    image: "/images/projects/da-peppe/hero-card.webp",
    body: "Website für eine italienische Osteria & Pizzeria: appetitlich, warm und einladend, mit klarer Speisekarte und Reservierung.",
    url: "https://da-peppe.com",
    quote: "Innerhalb von nur drei Tagen waren wir mit einer komplett neuen Website online.",
  },
  jungen: {
    title: "Ingenieurbüro Jungen",
    category: "Industrie · Automation",
    image: "/images/projects/ib-jungen/hero-card.webp",
    body: "Auftritt für Automation und Retrofit: technisch präzise, klar strukturiert und seriös.",
    url: "https://ib-jungen-web.vercel.app",
    quote: "Direkt und unkompliziert. Das Ergebnis wirkt endlich so professionell wie unsere Arbeit.",
  },
  luenebraeu: {
    title: "Lünebräu",
    category: "Craft-Bier · Lüneburg",
    image: "/images/projects/lunebraeu/hero-card.webp",
    body: "Markenauftritt für eine Craft-Bier-Brauerei: kantig, handwerklich und mit Haltung – vom Sortiment bis zur Bestellung.",
    url: "https://luenebraeu.vercel.app",
    quote: "Vom ersten Entwurf an hat man gemerkt, dass Erik unsere Marke verstanden hat.",
  },
  salonLiora: {
    title: "Salon Liora",
    category: "Entwurf · Friseursalon",
    image: "/images/projects/salon-liora/hero.png",
    body: "Demo-Entwurf für einen fiktiven Friseursalon: warm, elegant und einladend – mit Geschichte, Leistungen und Terminbuchung.",
    url: "https://salon-liora.vercel.app",
  },
  kapitalanlagen: {
    title: "Immobilien-Konzept",
    category: "Entwurf · Immobilien",
    image: "/images/projects/kapitalanlagen/hero.png",
    body: "Konzept-Entwurf für eine Immobilienfirma: ruhig, hochwertig und auf Vertrauen ausgelegt.",
  },
};

export const seoServices = [
  {
    title: "Komplette Website",
    price: "ab 2.500 €",
    body: "Mehrseitiger Auftritt mit Design, Texten und Technik.",
    href: "/#leistungen",
  },
  {
    title: "Landingpage",
    price: "ab 1.500 €",
    body: "Eine Seite, ein Ziel. Ideal für Angebote und Kampagnen.",
    href: "/landingpage-erstellen-lassen",
  },
  {
    title: "Betreuung",
    price: "ab 99 € / Monat",
    body: "Updates, kleine Änderungen und technische Sicherheit.",
    href: "/website-betreuung",
  },
];
