/**
 * Black-Friday-Aktion. Nur hier pflegen:
 * - `slotsLeft` nach jedem Abschluss runterzählen (ehrlich halten).
 * - `endsAt` bestimmt Countdown und Ablauf überall auf /blackfriday.
 */
export const BLACK_FRIDAY = {
  /** Ende der Aktion (Cyber Monday, 23:59 Uhr deutscher Zeit). */
  endsAt: "2026-11-30T23:59:59+01:00",
  endsLabel: "Cyber Monday, 30. November",
  endsShortLabel: "30. November",
  /** Spätester Projektstart für gebuchte Aktionsplätze. */
  startUntilLabel: "31. Januar 2027",
  slotsTotal: 10,
  slotsLeft: 4 as number,
  discountLabel: "−80 %",
} as const;

export type BlackFridayPackageId = "website" | "landingpage";

export type BlackFridayPackage = {
  id: BlackFridayPackageId;
  name: string;
  price: number;
  /** Regulärer Einstiegspreis, von dem die Karte herunterzählt. */
  regularPrice: number;
  priceLabel: string;
  regularLabel: string;
  tagline: string;
  badge?: string;
  features: string[];
};

export const BLACK_FRIDAY_PACKAGES: BlackFridayPackage[] = [
  {
    id: "website",
    name: "Komplette Website",
    price: 500,
    regularPrice: 2500,
    priceLabel: "500 €",
    regularLabel: "regulär ab 2.500 €",
    tagline: "Dein kompletter Auftritt: mehrere Seiten, eigenes Design, bereit für Anfragen.",
    badge: "Bestseller",
    features: [
      "Bis zu 5 Seiten (z. B. Start, Leistungen, Über uns, Kontakt)",
      "Individuelles Design, kein Baukasten",
      "Optimiert für Handy, Tablet und Desktop",
      "Google-Grundlagen: Struktur, Titel, Ladezeit",
      "Kontaktformular, Telefon und WhatsApp",
      "Impressum- und Datenschutz-Seite",
      "Kostenloser Entwurf vor der Beauftragung",
      "In ca. 7–10 Tagen online",
    ],
  },
  {
    id: "landingpage",
    name: "Landingpage",
    price: 300,
    regularPrice: 1500,
    priceLabel: "300 €",
    regularLabel: "regulär ab 1.500 €",
    tagline: "Eine Seite, ein Ziel: perfekt für ein Angebot, eine Kampagne oder deinen Start.",
    features: [
      "Eine Seite mit bis zu 6 Abschnitten",
      "Individuelles Design, kein Baukasten",
      "Optimiert für Handy, Tablet und Desktop",
      "Klarer Aufbau auf Anfragen und Verkäufe",
      "Kontaktformular, Telefon und WhatsApp",
      "Kostenloser Entwurf vor der Beauftragung",
      "In ca. 7 Tagen online",
    ],
  },
];

export const BLACK_FRIDAY_WHATSAPP_URL =
  "https://wa.me/4915565602176?text=" +
  encodeURIComponent(
    "Hallo Erik, ich möchte mir einen Black-Friday-Platz sichern (Website 500 € / Landingpage 300 €).",
  );

export function isBlackFridayActive(now: Date = new Date()): boolean {
  if (BLACK_FRIDAY.slotsLeft <= 0) return false;
  return now.getTime() <= new Date(BLACK_FRIDAY.endsAt).getTime();
}

/** Event, mit dem Angebotskarten ein Paket im Formular vorauswählen. */
export const BF_SELECT_EVENT = "evglab:bf-select";
