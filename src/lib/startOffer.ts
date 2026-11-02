/**
 * Begrenztes Einstiegsangebot. Nur hier pflegen:
 * `slotsLeft` nach jedem Abschluss runterzählen, bei 0 verschwindet die Box überall.
 */
export const START_OFFER = {
  title: "Startpaket Onepager",
  price: 990,
  priceLabel: "990 €",
  regularPriceLabel: "regulär ab 1.500 €",
  slotsTotal: 3,
  slotsLeft: 3 as number,
  /** Letzter Tag, an dem das Angebot gilt (Ende des Tages, lokale Zeit). */
  validUntil: "2026-11-30",
  validUntilLabel: "30. November",
  features: [
    "Eine Seite mit bis zu 5 Abschnitten",
    "Individuelles Design, kein Baukasten",
    "Mobil, schnell, Google-Grundlagen",
    "Kontakt per Formular, Telefon & WhatsApp",
    "Kostenloser Entwurf vor der Beauftragung",
    "In ca. 7 Tagen online",
  ],
  condition: "Einzige Bedingung: Ich darf dein Projekt als Referenz zeigen.",
} as const;

export const START_OFFER_WHATSAPP_URL =
  "https://wa.me/4915565602176?text=" +
  encodeURIComponent("Hallo Erik, ich interessiere mich für das Startpaket für 990 €.");

export function isStartOfferActive(now: Date = new Date()): boolean {
  if (START_OFFER.slotsLeft <= 0) return false;
  return now <= new Date(`${START_OFFER.validUntil}T23:59:59`);
}

/** Satz für Preis-FAQs, leer wenn das Angebot vorbei ist. */
export function startOfferFaqSentence(): string {
  if (!isStartOfferActive()) return "";
  return ` Bis ${START_OFFER.validUntilLabel} gibt es für ${START_OFFER.slotsTotal} Projekte ein Startpaket: Onepager für ${START_OFFER.priceLabel}.`;
}
