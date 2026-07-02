export const COOKIE_STORAGE_KEY = "evglab-cookie-consent";
export const COOKIE_CONSENT_UPDATED_EVENT = "evglab:cookie-consent-updated";

export type CookieConsent = {
  necessary: true;
  statistics: boolean;
  marketing: boolean;
  updatedAt?: string;
};

export function getStoredConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(COOKIE_STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as Partial<CookieConsent>;
    return {
      necessary: true,
      statistics: Boolean(parsed.statistics),
      marketing: Boolean(parsed.marketing),
      updatedAt: parsed.updatedAt,
    };
  } catch {
    return null;
  }
}

export function hasStatisticsConsent(): boolean {
  return getStoredConsent()?.statistics === true;
}
