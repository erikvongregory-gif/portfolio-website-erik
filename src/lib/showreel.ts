export type ShowreelCategory = "3d" | "produkt" | "spot" | "social";

export type ShowreelItem = {
  /** File stem in /public/videos: `<id>.mp4`, `<id>-preview.mp4`, `<id>.webp`. */
  id: string;
  title: string;
  kind: string;
  category: ShowreelCategory;
  /** Width / height, used for the card ratio. */
  ratio: "9 / 16" | "16 / 9" | "5 / 4";
};

export const showreelCategories: { value: ShowreelCategory | "alle"; label: string }[] = [
  { value: "alle", label: "Alle" },
  { value: "3d", label: "3D & Logo" },
  { value: "produkt", label: "Produktfilm" },
  { value: "spot", label: "Werbespot" },
  { value: "social", label: "Social Reels" },
];

export const showreel: ShowreelItem[] = [
  { id: "risebeyond-3d", title: "Rise Beyond", kind: "3D-Logo & Launchfilm", category: "3d", ratio: "16 / 9" },
  { id: "evglab-reel", title: "EvGlab", kind: "Social Reel", category: "social", ratio: "9 / 16" },
  { id: "brewai-glass", title: "BrewAI", kind: "Produktfilm", category: "produkt", ratio: "9 / 16" },
  { id: "radebeul", title: "Radebeuler Versicherungsmakler", kind: "Werbespot", category: "spot", ratio: "16 / 9" },
  { id: "evglab-scalez", title: "EvGlab", kind: "Logo-Ident", category: "3d", ratio: "9 / 16" },
  { id: "tidely", title: "Tidely", kind: "App-Launch · Konzept", category: "produkt", ratio: "16 / 9" },
  { id: "holzbau-ried", title: "Holzbau Ried", kind: "Imagefilm", category: "spot", ratio: "16 / 9" },
  { id: "brewai-logo", title: "BrewAI", kind: "Logo-Film", category: "3d", ratio: "9 / 16" },
  { id: "evglab-cut", title: "EvGlab", kind: "Brand-Reel", category: "social", ratio: "9 / 16" },
  { id: "vm-zierer", title: "VM Zierer", kind: "Werbespot", category: "spot", ratio: "16 / 9" },
  { id: "dn-impact", title: "DN Impact", kind: "Fintech-Reel", category: "produkt", ratio: "9 / 16" },
  { id: "veyra", title: "Veyra", kind: "SaaS-Teaser · Konzept", category: "produkt", ratio: "16 / 9" },
  { id: "evglab-pendel", title: "EvGlab", kind: "3D-Loop", category: "3d", ratio: "9 / 16" },
  { id: "gold-noir", title: "Gold Noir", kind: "Kinetic Type · Demo", category: "spot", ratio: "16 / 9" },
  { id: "brewai-film", title: "BrewAI", kind: "Teaser-Reel", category: "social", ratio: "9 / 16" },
  { id: "evglab-flyover", title: "EvGlab", kind: "Website-Flyover", category: "social", ratio: "5 / 4" },
];

/** Three vertical loops for the hero stack. */
export const showreelHero = ["brewai-glass", "evglab-reel", "evglab-scalez"];
