export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID || "919588920489707";

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & {
      callMethod?: (...args: unknown[]) => void;
      queue?: unknown[];
      loaded?: boolean;
      version?: string;
      push?: (...args: unknown[]) => void;
    };
    _fbq?: Window["fbq"];
  }
}

/** Standard-Event an Meta senden (nur wenn Pixel geladen ist). */
export function trackMetaEvent(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  if (params) window.fbq("track", event, params);
  else window.fbq("track", event);
}

export function trackMetaLead() {
  trackMetaEvent("Lead");
}
