import { Fragment } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { Column, Grid, Heading, Icon, type IconName, Row, Tag, Text } from "@once-ui-system/core";
import {
  About,
  FinalCta,
  Marquee,
  Parallax,
  Section,
  SectionHeader,
  SiteFooter,
  SpotlightCard,
  Statement,
} from "@/components";
import { HeroMotion, ValuesMotion } from "./_components/UeberUnsMotion";
import styles from "./ueber-uns.module.scss";

import {
  aboutOgImage,
  createPageOpenGraph,
  createPageTwitter,
} from "@/resources";

export const metadata: Metadata = {
  title: "Über mich",
  description:
    "Hinter EvGlab steht eine Person: Erik. Webentwicklung und Design aus Landsberg am Lech – direkt, ehrlich und ohne Umwege.",
  alternates: { canonical: "/ueber-uns" },
  openGraph: createPageOpenGraph({
    title: "Über mich",
    description:
      "Hinter EvGlab steht eine Person: Erik. Webentwicklung und Design aus Landsberg am Lech – direkt, ehrlich und ohne Umwege.",
    path: "/ueber-uns",
    type: "profile",
    image: aboutOgImage,
  }),
  twitter: createPageTwitter(
    "Über mich",
    "Hinter EvGlab steht eine Person: Erik. Webentwicklung und Design aus Landsberg am Lech – direkt, ehrlich und ohne Umwege.",
    aboutOgImage,
  ),
};

const values: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "sparkle",
    title: "Handwerk vor Vorlage",
    body: "Jede Seite wird individuell gestaltet. Kein Baukasten, kein Template – ein Auftritt, der wirklich nach deiner Marke aussieht.",
  },
  {
    icon: "person",
    title: "Direkt und ehrlich",
    body: "Du sprichst immer mit mir, nicht mit einem Junior. Klare Kommunikation und ehrliche Beratung, auch wenn sie weniger Umsatz bedeutet.",
  },
  {
    icon: "security",
    title: "Schnell und verbindlich",
    body: "In der Regel in 7 Tagen live. Verlässliche Termine, sauberer Code, mobil und schnell – ohne monatelange Agentur-Schleifen.",
  },
  {
    icon: "world",
    title: "Aus der Region",
    body: "Zuhause in Landsberg am Lech und persönlich erreichbar. Zusammenarbeit auf Augenhöhe, vor Ort oder remote.",
  },
];

function Words({ text, accent }: { text: string; accent?: boolean }) {
  return text.split(" ").map((w, i, arr) => (
    <Fragment key={`${w}-${i}`}>
      <span className={styles.mask}>
        <span
          className={accent ? `${styles.word} ${styles.accent}` : styles.word}
          data-hero-word
          {...(accent ? { "data-hero-accent": true } : {})}
        >
          {w}
        </span>
      </span>
      {i < arr.length - 1 ? " " : ""}
    </Fragment>
  ));
}

export default function UeberUns() {
  return (
    <Column fillWidth horizontal="center">
      <Column
        as="section"
        fillWidth
        horizontal="center"
        paddingX="l"
        paddingTop="160"
        paddingBottom="64"
      >
        <HeroMotion>
        <Row
          fillWidth
          maxWidth={64}
          gap="64"
          vertical="center"
          m={{ direction: "column-reverse", gap: "48" }}
        >
          <Column flex={6} gap="24" horizontal="start" align="left">
            <Tag size="s" variant="neutral" data-hero-fade>
              Über mich
            </Tag>
            <Heading
              as="h1"
              variant="display-strong-l"
              onBackground="neutral-strong"
              wrap="balance"
              style={{ letterSpacing: "-0.035em", lineHeight: 1.02 }}
            >
              <Words text="Eine Person." />{" "}
              <Words text="Voller Einsatz für deinen Auftritt." accent />
            </Heading>
            <Column data-hero-fade>
              <Text
                variant="body-default-xl"
                onBackground="neutral-weak"
                wrap="balance"
                style={{ maxWidth: "40rem", lineHeight: 1.5 }}
              >
                Hinter EvGlab steht eine Person: Erik. Ich gestalte und entwickle Websites, die
                auffallen und Anfragen bringen – direkt, ehrlich und ohne Umwege, aus Landsberg am
                Lech.
              </Text>
            </Column>
          </Column>

          <Column flex={5} fillWidth horizontal="center" gap="12" style={{ maxWidth: "26rem" }}>
              <Column
                data-portrait
                fillWidth
                radius="l"
                border="neutral-alpha-medium"
                position="relative"
                style={{
                  overflow: "hidden",
                  aspectRatio: "4 / 5",
                  background: "var(--neutral-background-medium)",
                  boxShadow: "0 44px 90px -44px var(--evg-portrait-shadow)",
                }}
              >
                <Parallax
                  speed={0.05}
                  style={{ position: "absolute", top: "-10%", left: 0, width: "100%", height: "120%" }}
                >
                  <span data-portrait-img style={{ position: "absolute", inset: 0, display: "block" }}>
                  <Image
                    src="/images/about/erik.png"
                    alt="Porträt von Erik von Gregory, Gründer von EvGlab"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 416px"
                    style={{
                      objectFit: "cover",
                      objectPosition: "center 28%",
                    }}
                  />
                  </span>
                </Parallax>
              </Column>
            <Text variant="label-default-s" onBackground="neutral-weak" align="center" data-hero-fade>
              Erik · Gründer von EvGlab · Landsberg am Lech
            </Text>
          </Column>
        </Row>
        </HeroMotion>
      </Column>

      <Section id="werte">
        <SectionHeader
          eyebrow="Werte"
          title={
            <>
              Wofür EvGlab{" "}
              <Text as="span" onBackground="neutral-weak">
                steht.
              </Text>
            </>
          }
          description="Vier Prinzipien, nach denen ich arbeite – bei jedem Projekt."
        />

        <ValuesMotion>
        <Grid columns="2" m={{ columns: "1" }} gap="16">
          {values.map((v) => (
              <Column key={v.title} fillHeight data-value>
                <SpotlightCard
                  background="surface"
                  border="neutral-alpha-weak"
                  radius="l"
                  padding="32"
                  gap="16"
                  fillHeight
                >
                  <span className={styles.icon} data-value-icon>
                    <Icon name={v.icon} size="m" onBackground="neutral-strong" />
                  </span>
                  <Text variant="heading-strong-s" onBackground="neutral-strong">
                    {v.title}
                  </Text>
                  <Text variant="body-default-m" onBackground="neutral-weak">
                    {v.body}
                  </Text>
                </SpotlightCard>
              </Column>
          ))}
        </Grid>
        </ValuesMotion>
      </Section>

      <Column as="section" fillWidth horizontal="center" paddingTop="160">
        <Marquee />
      </Column>
      <Statement
        text="Hinter jedem Projekt steckt echte Handarbeit – kein Template, keine Warteschleife, nur ich und dein Auftritt."
        highlights={["Handarbeit", "Auftritt"]}
        proofs={false}
      />

      <About />
      <FinalCta />
      <SiteFooter />
    </Column>
  );
}
