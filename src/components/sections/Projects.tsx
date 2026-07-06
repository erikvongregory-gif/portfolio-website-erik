import { Column, Grid, Icon, Row, SmartLink, Tag, Text } from "@once-ui-system/core";
import { Reveal, SpotlightCard } from "@/components/motion";
import { ProjectPreview } from "./ProjectPreview";
import { Section, SectionHeader } from "./Section";
import styles from "./sections.module.scss";

type Project = {
  title: string;
  chrome: string;
  category: string;
  image: string;
  /** Scroll-Video der Live-Seite: spielt beim Hover mit allen Original-Effekten ab. */
  video?: string;
  body: string;
  url?: string;
  comingSoon?: boolean;
  obscured?: boolean;
};

const projects: Project[] = [
  {
    title: "EvGlab",
    chrome: "evglab.com",
    category: "Eigene Marke · KI-Marketing",
    image: "/images/projects/evglab/hero.png",
    video: "/videos/projects/evglab.mp4",
    body: "KI-Marketing-Plattform für Brauereien: Produktmotive und Kampagnen per Knopfdruck statt teurem Fotoshooting.",
    url: "https://evglab.com",
  },
  {
    title: "Kapitalanlagen Deutschland",
    chrome: "Entwurf",
    category: "Entwurf · Immobilien",
    image: "/images/projects/kapitalanlagen/hero.png",
    body: "Konzept-Entwurf für eine Immobilienfirma: ruhig, hochwertig und auf Vertrauen ausgelegt.",
    obscured: true,
  },
  {
    title: "Ingenieurbüro Jungen",
    chrome: "ib-jungen.de",
    category: "Industrie · Automation",
    image: "/images/projects/ib-jungen/hero.png",
    video: "/videos/projects/ib-jungen.mp4",
    body: "Auftritt für Automation und Retrofit: technisch präzise, klar strukturiert und seriös.",
    url: "https://ib-jungen-web.vercel.app",
  },
  {
    title: "Lünebräu",
    chrome: "luenebraeu.vercel.app",
    category: "Craft-Bier · Brauerei",
    image: "/images/projects/lunebraeu/hero.png",
    video: "/videos/projects/lunebraeu.mp4",
    body: "Markenauftritt für eine Craft-Bier-Brauerei aus Lüneburg: kantig, handwerklich und mit Haltung – vom Sortiment bis zur Bestellung.",
    url: "https://luenebraeu.vercel.app",
  },
  {
    title: "Da Peppe",
    chrome: "da-peppe",
    category: "Gastronomie · Restaurant",
    image: "/images/projects/da-peppe/hero.png",
    body: "Website für eine italienische Osteria & Pizzeria: appetitlich, warm und einladend, mit klarer Speisekarte.",
    comingSoon: true,
  },
];

export function Projects() {
  return (
    <Section id="projekte">
      <SectionHeader
        eyebrow="Projekte"
        title={
          <>
            Ausgewählte{" "}
            <Text as="span" onBackground="neutral-weak">
              Arbeiten.
            </Text>
          </>
        }
        description="Fünf Auszüge aus meinen bisher umgesetzten Projekten."
      />

      <Grid columns="2" m={{ columns: "1" }} gap="32">
        {projects.map((p, i) => {
          const blurTitle = p.comingSoon || p.obscured;
          const blurImage = p.comingSoon;
          const card = (
            <SpotlightCard
              className={styles.card}
              gap="20"
              glow={false}
              tiltStrength={5}
              data-project-card
            >
              <div className={styles.shot}>
                <div className={styles.chrome}>
                  <div className={styles.dots}>
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                  </div>
                  <Text
                    variant="label-default-s"
                    onBackground="neutral-weak"
                    style={{ marginLeft: "0.375rem" }}
                    className={p.comingSoon ? styles.blurText : undefined}
                  >
                    {p.chrome}
                  </Text>
                </div>
                <div className={styles.imageWrap}>
                  <ProjectPreview
                    image={p.image}
                    video={blurImage ? undefined : p.video}
                    alt={
                      p.comingSoon
                        ? "Projekt – bald verfügbar"
                        : p.obscured
                          ? "Projektentwurf"
                          : `${p.title} – Website`
                    }
                    blur={blurImage}
                  />
                  {p.comingSoon && (
                    <div className={styles.teaser}>
                      <span className={styles.teaserBadge}>
                        <span className={styles.teaserDot} />
                        Eventuell bald verfügbar
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <Column gap="8" paddingX="4">
                <Tag size="s" variant="neutral">
                  {p.category}
                </Tag>
                <Text
                  variant="heading-strong-s"
                  onBackground="neutral-strong"
                  className={blurTitle ? styles.blurText : undefined}
                >
                  {p.title}
                </Text>
                <Text variant="body-default-m" onBackground="neutral-weak">
                  {p.body}
                </Text>
                {p.url && (
                  <Row gap="4" vertical="center" paddingTop="4">
                    <Text variant="label-strong-s" onBackground="neutral-strong">
                      Live ansehen
                    </Text>
                    <Icon name="arrowUpRight" size="xs" onBackground="neutral-strong" />
                  </Row>
                )}
              </Column>
            </SpotlightCard>
          );

          return (
            <Reveal key={p.title} delay={i * 0.1} y={32} scale={0.94}>
              {p.url ? (
                <SmartLink
                  href={p.url}
                  unstyled
                  fillWidth
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                  aria-label={`${p.title} – Website live in neuem Tab ansehen`}
                >
                  {card}
                </SmartLink>
              ) : (
                <Column fillWidth>{card}</Column>
              )}
            </Reveal>
          );
        })}
      </Grid>
    </Section>
  );
}
