import { Column, Grid, Tag, Text } from "@once-ui-system/core";
import { Reveal, SpotlightCard } from "@/components/motion";
import { Section, SectionHeader } from "./Section";
import styles from "./sections.module.scss";

const projects = [
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
    title: "Da Peppe",
    chrome: "da-peppe",
    category: "Gastronomie · Restaurant",
    image: "/images/projects/da-peppe/hero.png",
    body: "Website für eine italienische Osteria & Pizzeria: appetitlich, warm und einladend, mit klarer Speisekarte.",
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
        description="Vier Auszüge aus bisher fünf umgesetzten Projekten."
      />

      <Grid columns="2" m={{ columns: "1" }} gap="32">
        {projects.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.1}>
            <Column fillWidth>
            <SpotlightCard className={styles.card} gap="20" glow={false} tiltStrength={5}>
              <div className={styles.shot}>
              <div className={styles.chrome}>
                <div className={styles.dots}>
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                </div>
                <Text variant="label-default-s" onBackground="neutral-weak" style={{ marginLeft: 6 }}>
                  {p.chrome}
                </Text>
              </div>
              <div className={styles.imageWrap}>
                <img className={styles.image} src={p.image} alt={`${p.title} – Website`} />
              </div>
            </div>

              <Column gap="10" paddingX="4">
                <Tag size="s" variant="neutral">
                  {p.category}
                </Tag>
                <Text variant="heading-strong-s" onBackground="neutral-strong">
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
