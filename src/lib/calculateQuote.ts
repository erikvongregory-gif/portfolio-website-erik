export type QuoteBase = "landingpage" | "website";

export type AddonId =
  | "cms"
  | "reservation"
  | "shop"
  | "multilingual"
  | "copywriting";

export type QuoteState = {
  base: QuoteBase;
  pages: number;
  addons: Record<AddonId, boolean>;
  express: boolean;
};

export type PriceRange = {
  min: number;
  max: number;
};

export const INCLUDED_PAGES = 5;

export const BASE_OPTIONS: {
  id: QuoteBase;
  title: string;
  subtitle: string;
  from: number;
}[] = [
  { id: "landingpage", title: "Landingpage", subtitle: "Eine Seite, ein Ziel", from: 1500 },
  { id: "website", title: "Komplette Website", subtitle: "Mehrseitiger Auftritt", from: 2500 },
];

export const ADDON_OPTIONS: {
  id: AddonId;
  title: string;
  description: string;
  min: number;
  max: number;
}[] = [
  {
    id: "cms",
    title: "CMS-System",
    description: "Texte und Bilder selbst pflegen",
    min: 450,
    max: 650,
  },
  {
    id: "reservation",
    title: "Reservierungssystem",
    description: "Online-Reservierung mit E-Mail/SMS-Bestätigung",
    min: 690,
    max: 990,
  },
  {
    id: "shop",
    title: "Online-Shop / Zahlungsanbindung",
    description: "Produkte verkaufen und Zahlungen anbinden",
    min: 900,
    max: 1500,
  },
  {
    id: "multilingual",
    title: "Mehrsprachigkeit",
    description: "Website in mehreren Sprachen",
    min: 300,
    max: 450,
  },
  {
    id: "copywriting",
    title: "Copywriting & KI-Bildmaterial",
    description: "Statt Standardtexte individuelle Inhalte",
    min: 250,
    max: 500,
  },
];

export const DEFAULT_QUOTE_STATE: QuoteState = {
  base: "website",
  pages: INCLUDED_PAGES,
  addons: {
    cms: false,
    reservation: false,
    shop: false,
    multilingual: false,
    copywriting: false,
  },
  express: false,
};

const BASE_PRICE: Record<QuoteBase, PriceRange> = {
  landingpage: { min: 1500, max: 1500 },
  website: { min: 2500, max: 2500 },
};

const EXTRA_PAGE: PriceRange = { min: 150, max: 200 };

export function calculateQuote(state: QuoteState): PriceRange {
  let min = BASE_PRICE[state.base].min;
  let max = BASE_PRICE[state.base].max;

  if (state.base === "website" && state.pages > INCLUDED_PAGES) {
    const extra = state.pages - INCLUDED_PAGES;
    min += extra * EXTRA_PAGE.min;
    max += extra * EXTRA_PAGE.max;
  }

  for (const addon of ADDON_OPTIONS) {
    if (state.addons[addon.id]) {
      min += addon.min;
      max += addon.max;
    }
  }

  if (state.express) {
    min = Math.round(min * 1.2);
    max = Math.round(max * 1.2);
  }

  return { min, max };
}

export function formatEuro(value: number): string {
  return `${value.toLocaleString("de-DE")} €`;
}

export function formatPriceRange(range: PriceRange): string {
  if (range.min === range.max) {
    return formatEuro(range.min);
  }
  return `${formatEuro(range.min)} – ${formatEuro(range.max)}`;
}

export function buildQuoteMessage(state: QuoteState, range: PriceRange): string {
  const baseLabel = BASE_OPTIONS.find((b) => b.id === state.base)?.title ?? state.base;
  const lines = [
    "Individuelle Preisanfrage aus dem Rechner:",
    "",
    `Basis: ${baseLabel}`,
  ];

  if (state.base === "website") {
    const extra = Math.max(0, state.pages - INCLUDED_PAGES);
    lines.push(
      `Unterseiten: ${state.pages} (${INCLUDED_PAGES} inkl.${extra > 0 ? `, ${extra} zusätzlich` : ""})`,
    );
  }

  const selectedAddons = ADDON_OPTIONS.filter((a) => state.addons[a.id]);
  if (selectedAddons.length > 0 || state.express) {
    lines.push("Zusatzoptionen:");
    for (const addon of selectedAddons) {
      lines.push(`- ${addon.title}`);
    }
    if (state.express) {
      lines.push("- Express-Umsetzung (+20 %)");
    }
  } else {
    lines.push("Zusatzoptionen: keine");
  }

  lines.push("", `Geschätzte Preisspanne: ${formatPriceRange(range)}`);
  return lines.join("\n");
}
