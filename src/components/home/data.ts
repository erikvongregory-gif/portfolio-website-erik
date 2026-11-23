import { FILM_SERVICES, getFilmService } from "@/lib/filmServices";
/**
 * Home page content. Carried over 1:1 from the previous sections
 * (src/components/sections/*) and the film offer on /videos. Do not invent facts here.
 */

export type HomeProject = {
  title: string;
  category: string;
  image: string;
  body: string;
  url?: string;
  /** Live client project vs. concept/demo. Undefined = not confirmed yet. */
  status?: "live" | "entwurf";
  /** Client asked not to be named: title is blurred. */
  obscured?: boolean;
  latest?: boolean;
};

export const PROJECTS: HomeProject[] = [
  {
    title: "Nonna Benedetta",
    category: "Entwurf · Pizzeria",
    image: "/images/projects/nonna-benedetta/hero-card.webp",
    body: "Entwurf für eine neapolitanische Pizzeria am See: warm, verspielt und appetitlich – mit Storia, Speisekarte, Colazione und Tischreservierung.",
    url: "https://nonna-benedetta.vercel.app",
    status: "entwurf",
    latest: true,
  },
  {
    title: "Da Peppe",
    category: "Gastronomie · Restaurant",
    image: "/images/projects/da-peppe/hero-card.webp",
    body: "Website für eine italienische Osteria & Pizzeria: appetitlich, warm und einladend, mit klarer Speisekarte und Reservierung.",
    url: "https://da-peppe.com",
    status: "live",
  },
  {
    title: "BrewAI",
    category: "Eigene Marke · KI-Marketing",
    image: "/images/projects/evglab/hero-ki-card.webp",
    body: "KI-Marketing für Brauereien: Produktfotos, Kampagnenmotive und Social-Content im eigenen Markenstil – ohne Studio.",
    url: "https://brewai.de",
    status: "live",
  },
  {
    title: "Lünebräu",
    category: "Craft-Bier · Brauerei",
    image: "/images/projects/lunebraeu/hero-card.webp",
    body: "Markenauftritt für eine Craft-Bier-Brauerei aus Lüneburg: kantig, handwerklich und mit Haltung – vom Sortiment bis zur Bestellung.",
    url: "https://luenebraeu.vercel.app",
  },
  {
    title: "Ingenieurbüro Jungen",
    category: "Industrie · Automation",
    image: "/images/projects/ib-jungen/hero-card.webp",
    body: "Auftritt für Automation und Retrofit: technisch präzise, klar strukturiert und seriös.",
    url: "https://ib-jungen-web.vercel.app",
  },
  {
    title: "Salon Liora",
    category: "Entwurf · Friseursalon",
    image: "/images/projects/salon-liora/hero.png",
    body: "Demo-Entwurf für einen fiktiven Friseursalon: warm, elegant und einladend – mit Geschichte, Leistungen und Terminbuchung.",
    url: "https://salon-liora.vercel.app",
    status: "entwurf",
  },
  {
    title: "Kapitalanlagen Deutschland",
    category: "Entwurf · Immobilien",
    image: "/images/projects/kapitalanlagen/hero.png",
    body: "Konzept-Entwurf für eine Immobilienfirma: ruhig, hochwertig und auf Vertrauen ausgelegt.",
    status: "entwurf",
    obscured: true,
  },
];

/** Showreel ids (src/lib/showreel.ts) shown under the website projects. */
export const WORK_FILMS = ["brewai-glass", "evglab-scalez", "brewai-desk", "evglab-pendel"];

export type Discipline = {
  id: string;
  name: string;
  film: string;
  filmLabel: string;
  /** Small visible note on the film, e.g. for spec ads. */
  credit?: string;
  body: string;
  points: string[];
  price: string;
  href: string;
  linkLabel: string;
};

export const DISCIPLINES: Discipline[] = [
  {
    id: "websites",
    name: "Websites",
    film: "evglab-flyover",
    filmLabel: "Website-Flyover von EvGlab",
    body: "Mehrseitiger Auftritt mit Design, Texten und Technik. Für Marken, die rundum überzeugen wollen.",
    points: ["Individuelles Design", "Texte & SEO-Grundlagen", "Mobil & schnell"],
    price: "ab 1.500 €",
    href: "#preise",
    linkLabel: "Preise ansehen",
  },
  {
    id: "3d",
    name: "3D-Produktfilme",
    film: "osmo-pocket",
    filmLabel: "3D-Produktfilm Osmo Pocket 4P, Spec-Ad (eigenes Konzept, nicht im Auftrag von DJI)",
    credit: "Spec-Ad · Osmo Pocket 4P · kein Auftrag von DJI",
    body: getFilmService("product").body,
    points: getFilmService("product").points,
    price: getFilmService("product").price,
    href: "/videos",
    linkLabel: "Filme ansehen",
  },
  {
    id: "reels",
    name: "Reels",
    film: "evglab-cut",
    filmLabel: "Brand-Reel von EvGlab",
    body: getFilmService("social").body,
    points: getFilmService("social").points,
    price: getFilmService("social").price,
    href: "/videos",
    linkLabel: "Reels ansehen",
  },
];

export const STATEMENT = {
  text: "Deine Website ist der erste Eindruck deiner Marke. Ich sorge dafür, dass er auffällt, Vertrauen schafft und Kunden bringt.",
  highlights: ["auffällt", "Vertrauen", "Kunden"],
};

export const ABOUT = {
  title: "Kein Team, kein Overhead.",
  accent: "Nur ich.",
  body: "Hinter EvGlab steckt eine Person: ich, Erik. Du sprichst direkt mit mir, von der ersten Idee bis nach dem Launch – aus Landsberg am Lech, für Kunden in Bayern und deutschlandweit. Ich kenne jedes Detail deines Projekts und bin dafür verantwortlich.",
  reasons: [
    "Direkter Kontakt, immer ich persönlich",
    "Klare Prozesse, keine Überraschungen",
    "Schnelle Umsetzung statt monatelanger Schleifen",
    "Ehrliche Beratung, auch wenn sie weniger Umsatz bedeutet",
  ],
  stats: [
    { value: "10+", label: "Projekte umgesetzt" },
    { value: "7 Tage", label: "Ø Lieferzeit" },
    { value: "1", label: "fester Ansprechpartner" },
  ],
};

export type WebPackage = {
  title: string;
  price: string;
  body: string;
  features: string[];
  featured?: boolean;
  /** Basis for the price calculator, if it applies. */
  base?: "website" | "landingpage";
};

export const WEB_PACKAGES: WebPackage[] = [
  {
    title: "Komplette Website",
    price: "ab 2.500 €",
    body: "Mehrseitiger Auftritt mit Design, Texten und Technik. Für Marken, die rundum überzeugen wollen.",
    features: ["Individuelles Design", "Bis ca. 5 Unterseiten", "Texte & SEO-Grundlagen", "Mobil & schnell"],
    featured: true,
    base: "website",
  },
  {
    title: "Landingpage",
    price: "ab 1.500 €",
    body: "Eine Seite, ein Ziel. Conversion-fokussiert für Kampagnen, Angebote und Produkt-Launches.",
    features: ["Eine Seite, ein Ziel", "Conversion-optimiert", "Ideal für Werbung", "In 7 Tagen live"],
    base: "landingpage",
  },
  {
    title: "Betreuung & Support",
    price: "99 € / Monat",
    body: "Updates, kleine Änderungen und Sicherheit. Deine Website bleibt aktuell, schnell und gepflegt.",
    features: ["Updates & Sicherheit", "Kleine Änderungen", "Fester Ansprechpartner", "Monatlich kündbar"],
  },
  {
    title: "Individuell auf Anfrage",
    price: "Preis auf Anfrage",
    body: "CMS-Anbindung, Reservierungstool oder andere Sonderwünsche – Umfang und Budget klären wir persönlich im Gespräch.",
    features: ["CMS-System", "Reservierungstool", "Individuelle Funktionen", "Persönliche Beratung"],
  },
];

/** Film offer, as listed on /videos. */
export const FILM_PRICES = FILM_SERVICES.map(({ title, price, note }) => ({ title, price, note }));

export const OUTCOMES = [
  "Mehr Anfragen und Umsatz",
  "Professioneller erster Eindruck",
  "Bessere Google-Sichtbarkeit",
  "Keine Pflege und Updates auf deiner Seite",
];

export const STEPS = [
  {
    title: "Erstgespräch",
    body: "Kostenlos und unverbindlich. Ich höre zu, stelle Fragen und verstehe dein Business.",
    meta: "30 Min, kostenlos",
  },
  {
    title: "Konzept und Angebot",
    body: "Klare Strategie und ein transparentes Angebot. Du weißt von Anfang an, was gebaut wird und was es kostet.",
    meta: "2 bis 3 Tage",
  },
  {
    title: "Design und Texte",
    body: "Ich gestalte und schreibe die Texte, du gibst Feedback. Sauber von Anfang an, maximal zwei Runden.",
    meta: "Feedback in 2 Runden",
  },
  {
    title: "Umsetzung",
    body: "Ich baue alles selbst: schnell, mobil und suchmaschinenfreundlich. Kein Outsourcing, kein Overhead.",
    meta: "ca. 7 Tage",
  },
  {
    title: "Launch und Betreuung",
    body: "Deine Website geht online, ich erkläre dir alles und bleibe dein Ansprechpartner.",
    meta: "Go-Live und Support",
  },
];

export const LEAD_VOICE = {
  name: "Da Peppe",
  role: "Osteria & Pizzeria, Landsberg",
  quote: "Innerhalb von nur drei Tagen waren wir mit einer komplett neuen Website online.",
  result: "3 Tage live",
  source: "Google, 5 von 5",
  image: "/images/projects/da-peppe/hero-card.webp",
  url: "https://da-peppe.com",
};

export const MORE_VOICES = [
  {
    name: "Ingenieurbüro Jungen",
    meta: "Industrie, Automation",
    quote: "Direkt und unkompliziert. Das Ergebnis wirkt endlich so professionell wie unsere Arbeit.",
    image: "/images/projects/ib-jungen/hero-card.webp",
  },
  {
    name: "Lünebräu",
    meta: "Craft-Bier, Lüneburg",
    quote: "Vom ersten Entwurf an hat man gemerkt, dass Erik unsere Marke verstanden hat.",
    image: "/images/projects/lunebraeu/hero-card.webp",
  },
];
