"use client";

import { useEffect, useState } from "react";
import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";
import {
  COOKIE_CONSENT_UPDATED_EVENT,
  hasStatisticsConsent,
} from "@/lib/cookieConsent";

export function ConsentAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const sync = () => setEnabled(hasStatisticsConsent());
    sync();

    window.addEventListener(COOKIE_CONSENT_UPDATED_EVENT, sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener(COOKIE_CONSENT_UPDATED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (!enabled) return null;

  return (
    <Analytics
      beforeSend={(event: BeforeSendEvent) => {
        if (!hasStatisticsConsent()) return null;
        return event;
      }}
    />
  );
}
