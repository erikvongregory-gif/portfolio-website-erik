import type { Metadata } from "next";
import { Column, Grid, Heading, Icon, type IconName, Row, Tag, Text } from "@once-ui-system/core";
import {
  About,
  FinalCta,
  Marquee,
  Parallax,
  Reveal,
  ScrollRevealText,
  Section,
  SectionHeader,
  SiteFooter,
  SpotlightCard,
} from "@/components";

import {
  aboutOgImage,
  createPageOpenGraph,
  createPageTwitter,
} from "@/resources";

export const metadata: Metadata = {
  title: "Über mich",
  description:
    "Hinter EvgLab steht eine Person: Erik. Webentwicklung und Design aus Landsberg am Lech – direkt, ehrlich und ohne Umwege.",
  alternates: { canonical: "/ueber-uns" },
  openGraph: createPageOpenGraph({
    title: "Über mich",
    description:
      "Hinter EvgLab steht eine Person: Erik. Webentwicklung und Design aus Landsberg am Lech – direkt, ehrlich und ohne Umwege.",
    path: "/ueber-uns",
    type: "profile",
    image: aboutOgImage,
  }),
  twitter: createPageTwitter(
    "Über mich",
    "Hinter EvgLab steht eine Person: Erik. Webentwicklung und Design aus Landsberg am Lech – direkt, ehrlich und ohne Umwege.",
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
        <Row
          fillWidth
          maxWidth={64}
          gap="64"
          vertical="center"
          m={{ direction: "column-reverse", gap: "48" }}
        >
          <Column flex={6} gap="24" horizontal="start" align="left">
            <Reveal y={16}>
              <Tag size="s" variant="neutral">
                Über mich
              </Tag>
            </Reveal>
            <Reveal delay={0.08}>
              <Heading
                as="h1"
                variant="display-strong-l"
                onBackground="neutral-strong"
                wrap="balance"
                style={{ letterSpacing: "-0.035em", lineHeight: 1.02 }}
              >
                Eine Person.{" "}
                <Text as="span" onBackground="neutral-weak">
                  Voller Einsatz für deinen Auftritt.
                </Text>
              </Heading>
            </Reveal>
            <Reveal delay={0.16}>
              <Text
                variant="body-default-xl"
                onBackground="neutral-weak"
                wrap="balance"
                style={{ maxWidth: "40rem", lineHeight: 1.5 }}
              >
                Hinter EvgLab steht eine Person: Erik. Ich gestalte und entwickle Websites, die
                auffallen und Anfragen bringen – direkt, ehrlich und ohne Umwege, aus Landsberg am
                Lech.
              </Text>
            </Reveal>
          </Column>

          <Column flex={5} fillWidth horizontal="center" gap="12" style={{ maxWidth: "26rem" }}>
            <Reveal delay={0.12}>
              <Column
                fillWidth
                radius="l"
                border="neutral-alpha-medium"
                position="relative"
                style={{
                  overflow: "hidden",
                  aspectRatio: "4 / 5",
                  background: "var(--neutral-background-medium)",
                  boxShadow: "0 44px 90px -44px rgba(0,0,0,0.4)",
                }}
              >
                <Parallax
                  speed={0.05}
                  style={{ position: "absolute", top: "-10%", left: 0, width: "100%", height: "120%" }}
                >
                  <img
                    src="/images/about/erik.png"
                    alt="Erik, Gründer von EvgLab"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center 28%",
                      display: "block",
                    }}
                  />
                </Parallax>
              </Column>
            </Reveal>
            <Reveal delay={0.2}>
              <Text variant="label-default-s" onBackground="neutral-weak" align="center">
                Erik · Gründer von EvgLab · Landsberg am Lech
              </Text>
            </Reveal>
          </Column>
        </Row>
      </Column>

      <Section id="werte">
        <SectionHeader
          eyebrow="Werte"
          title={
            <>
              Wofür EvgLab{" "}
              <Text as="span" onBackground="neutral-weak">
                steht.
              </Text>
            </>
          }
          description="Vier Prinzipien, nach denen ich arbeite – bei jedem Projekt."
        />

        <Grid columns="2" m={{ columns: "1" }} gap="16">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.08}>
              <Column fillHeight>
                <SpotlightCard
                  background="surface"
                  border="neutral-alpha-weak"
                  radius="l"
                  padding="32"
                  gap="16"
                  fillHeight
                >
                  <Icon name={v.icon} size="m" onBackground="neutral-strong" />
                  <Text variant="heading-strong-s" onBackground="neutral-strong">
                    {v.title}
                  </Text>
                  <Text variant="body-default-m" onBackground="neutral-weak">
                    {v.body}
                  </Text>
                </SpotlightCard>
              </Column>
            </Reveal>
          ))}
        </Grid>
      </Section>

      <Column as="section" fillWidth horizontal="center" paddingY="160" gap="64">
        <Marquee />
        <Column maxWidth={48} fillWidth horizontal="center" paddingX="l">
          <ScrollRevealText text="Hinter jedem Projekt steckt echte Handarbeit – kein Template, keine Warteschleife, nur ich und dein Auftritt." />
        </Column>
      </Column>

      <About />
      <FinalCta />
      <SiteFooter />
    </Column>
  );
}
