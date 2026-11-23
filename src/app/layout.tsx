import "@once-ui-system/core/css/styles.css";
import "@once-ui-system/core/css/tokens.css";
import "lenis/dist/lenis.css";
import "@/resources/custom.css";

import type { Metadata, Viewport } from "next";
import classNames from "classnames";

import { Column, Flex } from "@once-ui-system/core/components";
import { BlackFridayBanner } from "@/components/BlackFridayBanner";
import {
  ConsentAnalytics,
  ConsentGoogleAnalytics,
  ConsentMetaPixel,
  CookieBanner,
  Providers,
  SmoothScroll,
} from "@/components";
import { StudioHeader } from "@/components/studio";
import { fonts, style, dataStyle, baseURL, createPageOpenGraph, createPageTwitter } from "@/resources";

const title = "Webdesign, 3D-Produktfilme & Reels · EvGlab Landsberg";
const description =
  "EvGlab ist die Agentur für Werbematerial aus Landsberg am Lech: Websites, 3D-Produktanimationen und Reels aus einer Hand, persönlich mit Erik umgesetzt.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Fixed page on phones: no pinch-zoom, no sideways panning.
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#050909",
};

export const metadata: Metadata = {
  metadataBase: new URL(baseURL),
  title: {
    default: title,
    template: "%s · Erik EvGlab",
  },
  description,
  applicationName: "Erik EvGlab",
  authors: [{ name: "Erik von Gregory", url: baseURL }],
  creator: "Erik von Gregory",
  publisher: "Erik EvGlab",
  keywords: [
    "Werbeagentur Landsberg am Lech",
    "Webdesign",
    "3D-Produktanimation",
    "3D-Produktfilm",
    "Reels",
    "Social-Media-Videos",
    "Webentwicklung",
    "Landingpage",
    "Website erstellen",
    "Webdesigner Landsberg am Lech",
    "Webdesign Bayern",
    "Freelancer Webentwicklung",
    "Branding",
    "Next.js Entwickler",
    "Erik EvGlab",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    ...createPageOpenGraph({ title: "Startseite", description, path: "/" }),
    title,
  },
  twitter: {
    ...createPageTwitter("Startseite", description),
    title,
    description,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Flex
      suppressHydrationWarning
      as="html"
      lang="de"
      fillWidth
      className={classNames(
        fonts.heading.variable,
        fonts.body.variable,
        fonts.label.variable,
        fonts.code.variable,
      )}
    >
      <head>
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const root = document.documentElement;
                  const config = ${JSON.stringify({
                    brand: style.brand,
                    accent: style.accent,
                    neutral: style.neutral,
                    solid: style.solid,
                    "solid-style": style.solidStyle,
                    border: style.border,
                    surface: style.surface,
                    transition: style.transition,
                    scaling: style.scaling,
                    "viz-style": dataStyle.variant,
                  })};
                  Object.entries(config).forEach(([key, value]) => {
                    root.setAttribute('data-' + key, value);
                  });
                  const resolveTheme = (themeValue) => {
                    if (themeValue === 'dark' || themeValue === 'light') {
                      return themeValue;
                    }
                    return window.matchMedia('(prefers-color-scheme: dark)').matches
                      ? 'dark'
                      : 'light';
                  };
                  // Redesign 2026: the site is dark-first; paper sections set
                  // data-theme="light" locally.
                  const resolved = resolveTheme('dark');
                  root.setAttribute('data-theme', resolved);
                  Object.keys(config).forEach(key => {
                    const value = localStorage.getItem('data-' + key);
                    if (value) {
                      root.setAttribute('data-' + key, value);
                    }
                  });
                } catch (e) {
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              })();
            `,
          }}
        />
      </head>
      <Providers>
        <Column
          as="body"
          background="page"
          fillWidth
          style={{ minHeight: "100vh" }}
          margin="0"
          padding="0"
          horizontal="center"
        >
          <SmoothScroll />
          <BlackFridayBanner />
          <StudioHeader />
          <Flex
            as="main"
            id="top"
            fillWidth
            fillHeight
            horizontal="center"
            zIndex={1}
            flex={1}
          >
            {children}
          </Flex>
          <CookieBanner />
          <ConsentAnalytics />
          <ConsentGoogleAnalytics />
          <ConsentMetaPixel />
        </Column>
      </Providers>
    </Flex>
  );
}
