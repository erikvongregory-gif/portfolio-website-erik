/**
 * Film services with prices — the single source for /videos, the home pricing
 * list and the home "Leistungen" panels. Change prices only here.
 */
export type FilmServiceId = "logo" | "product" | "spot" | "social";

export type FilmServiceItem = {
  id: FilmServiceId;
  title: string;
  price: string;
  body: string;
  points: string[];
  /** Short line for compact price lists. */
  note: string;
};

export const FILM_SERVICES: FilmServiceItem[] = [
  {
    id: "logo",
    title: "3D-Logo-Animation",
    price: "ab 490 €",
    body: "Dein Logo als Metall, Glas oder Licht – in Blender gebaut und gerendert. Ideal als Intro, Outro und Profil-Video.",
    points: ["5–10 Sekunden", "16:9 und 9:16", "mit Sounddesign"],
    note: "5–10 Sekunden, 16:9 und 9:16",
  },
  {
    id: "product",
    title: "Produktfilm & CGI",
    price: "ab 1.490 €",
    body: "Dein Produkt im Studio-Look, ohne Fotoshooting. Makros, Kamerafahrten und Licht, die es in echt kaum gibt.",
    points: ["15–45 Sekunden", "3D-Modell inklusive", "Musik und Texttafeln"],
    note: "15–45 Sekunden, 3D-Modell inklusive",
  },
  {
    id: "spot",
    title: "Werbespot & Erklärfilm",
    price: "ab 990 €",
    body: "Motion Design mit kinetischer Typo, UI-Animation und Sprecher. Für Website-Hero, Ads und Messen.",
    points: ["20–60 Sekunden", "Skript und Storyboard", "optional Voiceover"],
    note: "20–60 Sekunden, Skript und Storyboard",
  },
  {
    id: "social",
    title: "Social-Media-Paket",
    price: "ab 690 € / Monat",
    body: "Regelmäßig neue Reels für Instagram, TikTok und LinkedIn – im Look deiner Marke, fertig zum Posten.",
    points: ["4 Reels pro Monat", "Hooks und Captions", "monatlich kündbar"],
    note: "4 Reels pro Monat, monatlich kündbar",
  },
];

export function getFilmService(id: FilmServiceId): FilmServiceItem {
  const service = FILM_SERVICES.find((s) => s.id === id);
  if (!service) throw new Error(`Unknown film service: ${id}`);
  return service;
}
