"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";
import { hasStatisticsConsent } from "@/lib/cookieConsent";
import { useStatisticsConsent } from "@/lib/useStatisticsConsent";

export function ConsentAnalytics() {
  const enabled = useStatisticsConsent();

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
