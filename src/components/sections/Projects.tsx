import { Column, Grid, Tag, Text } from "@once-ui-system/core";
import { Reveal, SpotlightCard } from "@/components/motion";
import { Section, SectionHeader } from "./Section";
import styles from "./sections.module.scss";

type Project = {
  title: string;
  chrome: string;
  category: string;
  image: string;
  body: string;
  comingSoon?: boolean;
};

const projects: Project[] = [
  {
    title: "EvGlab",
    chrome: "evglab.com",
    category: "Eigene Marke · KI-Marketing",
    image: "/images/projects/evglab/hero.png",
    body: "KI-Marketing-Plattform für Brauereien: Produktmotive und Kampagnen per Knopfdruck statt teurem Fotoshooting.",
  },
  {
    title: "Kapitalanlagen Deutschland",
    chrome: "Entwurf",
    category: "Entwurf · Immobilien",
    image: "/images/projects/kapitalanlagen/hero.png",
    body: "Konzept-Entwurf für eine Immobilienfirma: ruhig, hochwertig und auf Vertrauen ausgelegt.",
  },
  {
    title: "Ingenieurbüro Jungen",
    chrome: "ib-jungen.de",
    category: "Industrie · Automation",
    image: "/images/projects/ib-jungen/hero.png",
    body: "Auftritt für Automation und Retrofit: technisch präzise, klar strukturiert und seriös.",
  },
  {
    title: "Lünebräu",
    chrome: "luenebraeu.vercel.app",
    category: "Craft-Bier · Brauerei",
    image: "/images/projects/lunebraeu/hero.png",
    body: "Markenauftritt für eine Craft-Bier-Brauerei aus Lüneburg: kantig, handwerklich und mit Haltung – vom Sortiment bis zur Bestellung.",
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
        {projects.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.1} y={32} scale={0.94}>
            <Column fillWidth>
            <SpotlightCard className={styles.card} gap="20" glow={false} tiltStrength={5}>
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
                <img
                  className={`${styles.image}${p.comingSoon ? ` ${styles.imageBlur}` : ""}`}
                  src={p.image}
                  alt={p.comingSoon ? "Projekt – bald verfügbar" : `${p.title} – Website`}
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
                  className={p.comingSoon ? styles.blurText : undefined}
                >
                  {p.title}
                </Text>
                <Text variant="body-default-m" onBackground="neutral-weak">
                  {p.body}
                </Text>
              </Column>
            </SpotlightCard>
            </Column>
          </Reveal>
        ))}
      </Grid>
    </Section>
  );
}
