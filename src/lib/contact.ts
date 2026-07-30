/** Shared contact channels – keep in sync with Impressum / structured data. */
export const CONTACT_EMAIL = "info@evglab.com";
export const CONTACT_PHONE_E164 = "+491731706012";
export const CONTACT_PHONE_DISPLAY = "0173 170 6012";
export const CONTACT_PHONE_TEL = `tel:${CONTACT_PHONE_E164}`;

/** WhatsApp chat – digits only, country code without +. */
export const WHATSAPP_URL =
  "https://wa.me/491731706012?text=" +
  encodeURIComponent("Hallo Erik, ich interessiere mich für ein Erstgespräch.");

/** Compact social proof used next to primary CTAs. */
export const CTA_PROOF = {
  quote: "Innerhalb von nur drei Tagen waren wir mit einer komplett neuen Website online.",
  attribution: "Da Peppe · Google",
} as const;
