/** Canonical production URL – override via NEXT_PUBLIC_SITE_URL in Vercel/local env. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://evglab.com";

/** Hostname only (e.g. "evglab.com") for display in UI and email subjects. */
export const SITE_HOST = new URL(SITE_URL).host;

/**
 * Freie Projekt-Slots diesen Monat (Verknappungs-Badge im Hero).
 * Auf 0 setzen, um das Badge komplett auszublenden – nie dauerhaft „frei“ behaupten.
 */
export const FREIE_SLOTS = 1;

/** Gesamtkapazität pro Monat – für die Fortschrittsanzeige im CapacityBadge. */
export const KAPAZITAET_SLOTS = 4;
