/** Canonical production URL – override via NEXT_PUBLIC_SITE_URL in Vercel/local env. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://evglab.com";

/** Hostname only (e.g. "evglab.com") for display in UI and email subjects. */
export const SITE_HOST = new URL(SITE_URL).host;
