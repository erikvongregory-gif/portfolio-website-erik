"use client";

import { useEffect, useState } from "react";
import {
  COOKIE_CONSENT_UPDATED_EVENT,
  hasMarketingConsent,
} from "@/lib/cookieConsent";

/** Reagiert auf Cookie-Banner und Storage-Änderungen (andere Tabs). */
export function useMarketingConsent() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const sync = () => setEnabled(hasMarketingConsent());
    sync();

    window.addEventListener(COOKIE_CONSENT_UPDATED_EVENT, sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener(COOKIE_CONSENT_UPDATED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return enabled;
}
