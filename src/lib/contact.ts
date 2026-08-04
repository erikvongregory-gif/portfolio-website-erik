/** Shared contact channels – keep in sync with Impressum / structured data. */
export const CONTACT_EMAIL = "info@evglab.com";
export const CONTACT_PHONE_E164 = "+4915565602176";
export const CONTACT_PHONE_DISPLAY = "01556 5602176";
export const CONTACT_PHONE_TEL = `tel:${CONTACT_PHONE_E164}`;

/** WhatsApp chat – digits only, country code without +. */
export const WHATSAPP_URL =
  "https://wa.me/4915565602176?text=" +
  encodeURIComponent("Hallo Erik, ich interessiere mich für ein Erstgespräch.");

/** WhatsApp for partner / referral leads. */
export const WHATSAPP_PARTNER_URL =
  "https://wa.me/4915565602176?text=" +
  encodeURIComponent("Hallo Erik, ich habe jemanden, der eine Website braucht.");

/** Compact social proof used next to primary CTAs. */
export const CTA_PROOF = {
  quote: "Innerhalb von nur drei Tagen waren wir mit einer komplett neuen Website online.",
  attribution: "Da Peppe · Google",
} as const;
