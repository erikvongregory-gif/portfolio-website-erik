import "@once-ui-system/core/css/styles.css";
import "@once-ui-system/core/css/tokens.css";
import "lenis/dist/lenis.css";
import "@/resources/custom.css";

import type { Metadata } from "next";
import classNames from "classnames";

import { Column, Flex } from "@once-ui-system/core";
import { Aurora, Providers, ScrollProgress, SiteHeader, SmoothScroll } from "@/components";
import { fonts, style, dataStyle } from "@/resources";

export const metadata: Metadata = {
  title: "Erik EvgLab",
  description: "",
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
                    if (!themeValue || themeValue === 'system') {
                      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    }
                    return themeValue;
                  };
                  const defaultTheme = '${style.theme}';
                  const resolved = resolveTheme(defaultTheme);
                  root.setAttribute('data-theme', resolved);
                  localStorage.setItem('data-theme', resolved);
                  Object.keys(config).forEach(key => {
                    const value = localStorage.getItem('data-' + key);
                    if (value) {
                      root.setAttribute('data-' + key, value);
                    }
                  });
                } catch (e) {
                  document.documentElement.setAttribute('data-theme', 'dark');
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
            style={{
              pointerEvents: "none",
              opacity: 0.04,
              mixBlendMode: "multiply",
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              backgroundSize: "200px 200px",
            }}
          />
          <SmoothScroll />
          <ScrollProgress />
          <SiteHeader />
          <Flex id="top" fillWidth fillHeight horizontal="center" zIndex={1} flex={1}>
            {children}
          </Flex>
        </Column>
      </Providers>
    </Flex>
  );
}
