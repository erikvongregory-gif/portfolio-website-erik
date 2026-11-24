import { Column, Grid, Heading, Row, SmartLink, Text } from "@once-ui-system/core/components";
import Image from "next/image";
import { StudioSection } from "@/components/studio";
import { Doodle, type DoodleKind } from "./Doodle";
import { InView } from "./InView";
import { type StripFilm, WorkStrip } from "./WorkStrip";
import styles from "./AboutSections.module.scss";

/* ---------------------------------------------------------------- Story */

export function AboutStory() {
  return (
    <StudioSection
      tone="paper"
      className={styles.paper}
      kicker="Wer dahinter steckt"
      title="Kein Team, kein Overhead. Nur ich."
    >
      <InView fillWidth>
        <Row fillWidth gap="64" vertical="start" m={{ direction: "column", gap: "48" }}>
          <Column className={styles.storyPhotoCol} fillWidth>
            <Column className={styles.storyPhoto} fillWidth>
              <span className={styles.storyTapeL} aria-hidden="true" />
              <span className={styles.storyTapeR} aria-hidden="true" />
              <span className={styles.storyImg}>
                <Image
                  src="/images/about/erik.png"
                  alt="Porträt von Erik von Gregory, Gründer von EvGlab"
                  fill
                  sizes="(max-width: 1024px) 92vw, 44vw"
                  style={{ objectFit: "cover", objectPosition: "center 30%" }}
                />
              </span>
              <Text as="span" className={styles.storyCaption}>
                Erik von Gregory, Gründer von EvGlab
              </Text>
            </Column>
          </Column>

          <Column className={styles.storyText} fillWidth gap="20">
            <Text as="p" className={styles.body}>
              Hinter EvGlab steckt eine Person: ich, Erik. Du sprichst direkt mit mir, von der ersten
              Idee bis nach dem Launch, aus Landsberg am Lech, für Kunden in Bayern und
              deutschlandweit. Ich kenne jedes Detail deines Projekts und bin dafür verantwortlich.
            </Text>
            <Text as="p" className={styles.body}>
              Ich gestalte und entwickle Websites, die auffallen und Anfragen bringen. Dazu kommen
              3D-Produktfilme aus Blender und Reels für Instagram, TikTok und LinkedIn, im Look
              deiner Marke und passend zu deiner Website. Werbematerial aus einer Hand, statt drei
              Dienstleister abzustimmen.
            </Text>
            <Text as="p" className={styles.body}>
              Für die Brauerei Lünebräu habe ich die Website gestaltet, mit BrewAI ein eigenes
              KI-Marketing-Projekt gegründet. Beides liegt oben auf dem Tisch.
            </Text>

            <Column className={styles.marginNote} gap="8">
              <Doodle kind="pin" className={styles.marginPin} weight={1.4} />
              <Text as="p" className={styles.marginText}>
                Sitz in Fuchstal, Landkreis Landsberg am Lech, rund eine Autostunde westlich von
                München. Treffen vor Ort nach Absprache, sonst per Telefon oder Video.
              </Text>
            </Column>
          </Column>
        </Row>
      </InView>
    </StudioSection>
  );
}

/* ------------------------------------------------------------- Workflow */

const ROLES = [
  "Projektmanager",
  "Account Manager",
  "Junior-Designer",
  "Texter",
  "Entwickler",
  "SEO-Agentur",
  "Support-Ticket",
];

const REASONS = [
  "Direkter Kontakt, immer ich persönlich",
  "Klare Prozesse, keine Überraschungen",
  "Schnelle Umsetzung statt monatelanger Schleifen",
  "Ehrliche Beratung, auch wenn sie weniger Umsatz bedeutet",
];

const FACTS = [
  { big: "10+", small: "Projekte umgesetzt", tilt: -2.5 },
  { big: "7 Tage", small: "Lieferzeit im Schnitt", tilt: 1.5 },
  { big: "24 h", small: "bis zur Antwort, oft schneller", tilt: -1 },
];

export function AboutWorkflow() {
  return (
    <StudioSection
      tone="paper"
      className={styles.paperAlt}
      kicker="So arbeite ich"
      title="Sieben Ansprechpartner? Bei mir ist es einer."
    >
      <InView fillWidth>
        <Grid fillWidth columns="2" gap="64" m={{ columns: "1", gap: "48" }}>
          <Column gap="20">
            <Text as="p" className={styles.listLabel}>
              Was bei einer Agentur oft dazwischen sitzt:
            </Text>
            <Column as="ul" className={styles.roles} gap="4">
              {ROLES.map((r, i) => (
                <li key={r} className={styles.role}>
                  <span className={styles.roleText}>{r}</span>
                  <Doodle
                    kind="strike"
                    className={styles.strike}
                    weight={2}
                    delay={0.25 + i * 0.16}
                  />
                </li>
              ))}
            </Column>
            <Row className={styles.me} gap="16" vertical="center">
              <Doodle kind="circle" className={styles.meCircle} weight={1.8} delay={1.6} />
              <span className={styles.meAvatar}>
                <Image src="/images/about/erik-avatar.webp" alt="" width={48} height={48} />
              </span>
              <Column gap="2">
                <Text className={styles.meName}>Erik</Text>
                <Text className={styles.meRole}>Design · Code · Texte · Support</Text>
              </Column>
            </Row>
          </Column>

          <Column gap="40">
            <Column as="ul" gap="16" className={styles.reasons}>
              {REASONS.map((r, i) => (
                <Row as="li" key={r} gap="12" vertical="start">
                  <Doodle kind="check" className={styles.check} weight={2} delay={0.4 + i * 0.2} />
                  <Text className={styles.reason}>{r}</Text>
                </Row>
              ))}
            </Column>
            <Row as="ul" className={styles.facts} gap="16" wrap>
              {FACTS.map((f) => (
                <Column
                  as="li"
                  key={f.small}
                  className={styles.fact}
                  gap="4"
                  style={{ transform: `rotate(${f.tilt}deg)` }}
                >
                  <Text className={styles.factBig}>{f.big}</Text>
                  <Text className={styles.factSmall}>{f.small}</Text>
                </Column>
              ))}
            </Row>
          </Column>
        </Grid>
      </InView>
    </StudioSection>
  );
}

/* ---------------------------------------------------------------- Craft */

const CRAFT: { title: string; body: string; href: string; link: string; doodle: DoodleKind }[] = [
  {
    title: "Websites",
    body: "Individuell gestaltet, kein Baukasten, kein Template. Mobil, schnell und so gebaut, dass sie Anfragen bringen. In der Regel in 7 Tagen live.",
    href: "/webdesign-landsberg",
    link: "Webdesign ansehen",
    doodle: "star",
  },
  {
    title: "3D-Produktfilme",
    body: "Dein Produkt im Studio-Look, ohne Fotoshooting. In Blender gebaut und gerendert: Makros, Kamerafahrten und Licht, die es in echt kaum gibt.",
    href: "/videos",
    link: "Filme ansehen",
    doodle: "bolt",
  },
  {
    title: "Reels",
    body: "Regelmäßig neue Reels für Instagram, TikTok und LinkedIn, im Look deiner Marke und fertig zum Posten.",
    href: "/videos",
    link: "Reels ansehen",
    doodle: "up",
  },
];

const FILMS: StripFilm[] = [
  { id: "airpods-pro", title: "AirPods Pro 3", kind: "Spec-Ad · Konzept", tilt: -1.5 },
  { id: "evglab-scalez", title: "EvGlab", kind: "Logo-Ident", tilt: 1.2 },
  { id: "herzblut-ki", title: "Herzblut Business Training", kind: "Werbespot", tilt: -0.8 },
  { id: "evglab-landsberg", title: "EvGlab", kind: "Feed-Spot", tilt: 1.8 },
];

export function AboutCraft() {
  return (
    <StudioSection
      tone="paper"
      className={styles.paper}
      kicker="Was EvGlab macht"
      title="Drei Dinge, alle aus einer Hand."
    >
      <InView fillWidth gap="80">
        <Grid as="ul" fillWidth columns="3" gap="24" m={{ columns: "1" }} className={styles.cards}>
          {CRAFT.map((c, i) => (
            <InView
              as="li"
              key={c.title}
              className={styles.card}
              gap="16"
              style={{ transform: `rotate(${[-0.8, 0.6, -0.4][i]}deg)` }}
            >
              <Row gap="12" vertical="center">
                <Doodle kind={c.doodle} className={styles.cardDoodle} weight={1.6} delay={0.2 + i * 0.2} />
                <Heading as="h3" className={styles.cardTitle}>
                  {c.title}
                </Heading>
              </Row>
              <Text as="p" className={styles.cardBody}>
                {c.body}
              </Text>
              <SmartLink href={c.href} unstyled className={styles.cardLink}>
                {c.link} →
              </SmartLink>
            </InView>
          ))}
        </Grid>

        <Column gap="24" fillWidth>
          <Row horizontal="between" vertical="end" gap="16" wrap>
            <Heading as="h3" className={styles.stripTitle}>
              Frisch von der Werkbank
            </Heading>
            <SmartLink href="/videos" unstyled className={styles.cardLink}>
              Alle Filme ansehen →
            </SmartLink>
          </Row>
          <WorkStrip films={FILMS} />
        </Column>
      </InView>
    </StudioSection>
  );
}

/* --------------------------------------------------------------- Values */

const VALUES: { title: string; body: string; doodle: DoodleKind }[] = [
  {
    title: "Handwerk vor Vorlage",
    body: "Jede Seite wird individuell gestaltet. Kein Baukasten, kein Template – ein Auftritt, der wirklich nach deiner Marke aussieht.",
    doodle: "star",
  },
  {
    title: "Direkt und ehrlich",
    body: "Du sprichst immer mit mir, nicht mit einem Junior. Klare Kommunikation und ehrliche Beratung, auch wenn sie weniger Umsatz bedeutet.",
    doodle: "person",
  },
  {
    title: "Schnell und verbindlich",
    body: "In der Regel in 7 Tagen live. Verlässliche Termine, sauberer Code, mobil und schnell – ohne monatelange Agentur-Schleifen.",
    doodle: "bolt",
  },
  {
    title: "Aus der Region",
    body: "Zuhause in Landsberg am Lech und persönlich erreichbar. Zusammenarbeit auf Augenhöhe, vor Ort oder remote.",
    doodle: "pin",
  },
];

export function AboutValues() {
  return (
    <StudioSection
      tone="paper"
      className={styles.paperAlt}
      kicker="Wofür ich stehe"
      title="Vier Regeln, nach denen ich jedes Projekt baue."
    >
      <Grid as="ul" fillWidth columns="2" gap="0" m={{ columns: "1" }} className={styles.values}>
        {VALUES.map((v, i) => (
          // Each rule draws its own doodle when it scrolls in (stacked on phones).
          <InView as="li" key={v.title} className={styles.value} gap="12">
            <Doodle kind={v.doodle} className={styles.valueDoodle} weight={1.6} delay={0.2 + (i % 2) * 0.18} />
            <Heading as="h3" className={styles.valueTitle}>
              {v.title}
            </Heading>
            <Text as="p" className={styles.valueBody}>
              {v.body}
            </Text>
          </InView>
        ))}
      </Grid>
    </StudioSection>
  );
}
