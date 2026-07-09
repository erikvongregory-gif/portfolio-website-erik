import "@once-ui-system/core/css/styles.css";
import "@once-ui-system/core/css/tokens.css";
import "lenis/dist/lenis.css";
import "@/resources/custom.css";

import type { Metadata } from "next";
import classNames from "classnames";

import { Column, Flex } from "@once-ui-system/core";
import {
  Aurora,
  ConsentAnalytics,
  CookieBanner,
  MobileJumpNav,
  Providers,
  ScrollProgress,
  SiteHeader,
  SmoothScroll,
} from "@/components";
import { fonts, style, dataStyle, baseURL, createPageOpenGraph, createPageTwitter } from "@/resources";

const title = "Erik EvgLab – Websites mit Charakter, die Kunden bringen.";
const description =
  "Webdesign und Entwicklung aus Landsberg. Individuelle Auftritte mit Charakter, die Anfragen bringen.";

export const metadata: Metadata = {
  metadataBase: new URL(baseURL),
  title: {
    default: title,
    template: "%s · Erik EvgLab",
  },
  description,
  applicationName: "Erik EvgLab",
  authors: [{ name: "Erik von Gregory", url: baseURL }],
  creator: "Erik von Gregory",
  publisher: "Erik EvgLab",
  keywords: [
    "Webdesign",
    "Webentwicklung",
    "Landingpage",
    "Website erstellen",
    "Webdesigner Landsberg am Lech",
    "Webdesign Bayern",
    "Freelancer Webentwicklung",
    "Branding",
    "Next.js Entwickler",
    "Erik EvgLab",
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
                    return 'light';
                  };
                  const stored = localStorage.getItem('data-theme');
                  const resolved = resolveTheme(stored);
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
          <Aurora />
          <Flex
            position="fixed"
            top="0"
            left="0"
            fill
            zIndex={0}
            className="pageNoise"
          />
          <SmoothScroll />
          <ScrollProgress />
          <SiteHeader />
          <MobileJumpNav />
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
        </Column>
      </Providers>
    </Flex>
  );
}
