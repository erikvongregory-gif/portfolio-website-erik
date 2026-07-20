"use client";

import { useEffect, useState } from "react";
import { Button, Column, Grid, Icon, Row, SmartLink, Tag, Text } from "@once-ui-system/core";
import { Reveal, SpotlightCard } from "@/components/motion";
import { ProjectPreview } from "./ProjectPreview";
import { Section, SectionHeader } from "./Section";
import styles from "./sections.module.scss";

const MOBILE_INITIAL = 3;
const MOBILE_MQ = "(max-width: 1024px)";

type Project = {
  title: string;
  chrome: string;
  category: string;
  image: string;
  video?: string;
  body: string;
  url?: string;
  comingSoon?: boolean;
  obscured?: boolean;
  latest?: boolean;
};

const projects: Project[] = [
  {
    title: "Da Peppe",
    chrome: "da-peppe.com",
    category: "Gastronomie · Restaurant",
    image: "/images/projects/da-peppe/hero-live.png",
    body: "Website für eine italienische Osteria & Pizzeria: appetitlich, warm und einladend, mit klarer Speisekarte und Reservierung.",
    url: "https://da-peppe.com",
    latest: true,
  },
  {
    title: "EvGlab",
    chrome: "ki.evglab.com",
    category: "Eigene Marke · KI-Marketing",
    image: "/images/projects/evglab/hero-ki.png",
    video: "/videos/projects/evglab.mp4",
    body: "KI-Marketing für Brauereien: Produktfotos, Kampagnenmotive und Social-Content im eigenen Markenstil – ohne Studio.",
    url: "https://ki.evglab.com",
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
];

export function Projects() {
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const sync = () => {
      const mobile = mq.matches;
      setIsMobile(mobile);
      if (!mobile) setShowAll(false);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const visibleProjects =
    isMobile && !showAll ? projects.slice(0, MOBILE_INITIAL) : projects;
  const canExpand = isMobile && !showAll && projects.length > MOBILE_INITIAL;

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

      <Column fillWidth gap="24">
        <Grid columns="2" m={{ columns: "1" }} gap="32">
          {visibleProjects.map((p, i) => {
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
                    {p.latest && (
                      <div className={styles.latest}>
                        <span className={styles.latestBadge}>Neuestes Projekt</span>
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

        {canExpand && (
          <Button variant="secondary" size="m" fillWidth onClick={() => setShowAll(true)}>
            Alle {projects.length} Projekte anzeigen
          </Button>
        )}
      </Column>
    </Section>
  );
}
