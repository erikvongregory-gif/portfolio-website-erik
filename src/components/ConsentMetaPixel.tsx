"use client";

import { useEffect } from "react";
import Script from "next/script";
import { META_PIXEL_ID } from "@/lib/metaPixel";
import { useMarketingConsent } from "@/lib/useMarketingConsent";

/**
 * Lädt den Meta Pixel erst nach Marketing-Einwilligung.
 * Ohne NEXT_PUBLIC_META_PIXEL_ID greift die Projekt-Default-ID.
 * Ein bereits geladener Pixel wird beim Widerruf per fbq('consent', 'revoke') gestoppt
 * und bei erneuter Zustimmung wieder freigegeben.
 */
export function ConsentMetaPixel() {
  const enabled = useMarketingConsent();

  useEffect(() => {
    if (typeof window.fbq !== "function") return;
    window.fbq("consent", enabled ? "grant" : "revoke");
  }, [enabled]);

  if (!enabled || !META_PIXEL_ID) return null;

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${META_PIXEL_ID}');
        fbq('track', 'PageView');
      `}
    </Script>
  );
}
