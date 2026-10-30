import type { FaqItem } from "@/lib/homepageFaqs";

export type SeoPageKind = "region" | "branche" | "leistung";

export type SeoReferenceKey = "daPeppe" | "jungen" | "luenebraeu" | "salonLiora" | "kapitalanlagen";

export type SeoFocusItem = { title: string; body: string };

export type SeoPage = {
  /** URL-Segment ohne führenden Slash. */
  slug: string;
  kind: SeoPageKind;
  /** Kurzname für Breadcrumb und Service-Schema. */
  name: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  tag: string;
  h1: string;
  h1Weak: string;
  lead: string;
  focusTitle: string;
  focusTitleWeak: string;
  focusIntro: string;
  focus: SeoFocusItem[];
  deepTitle: string;
  deepParagraphs: string[];
  reference: SeoReferenceKey;
  faqs: FaqItem[];
  /** Nur Regionen: Orte im Umkreis. */
  places?: string[];
  /** Slugs passender Unterseiten. */
  related: string[];
};
