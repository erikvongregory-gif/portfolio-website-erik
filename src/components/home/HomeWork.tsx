"use client";

import { Column, Grid, Heading, Icon, Row, SmartLink, Text } from "@once-ui-system/core/components";
import classNames from "classnames";
import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { FilmCard, Glow, StudioSection } from "@/components/studio";
import { showreel, type ShowreelItem } from "@/lib/showreel";
import { PROJECTS, WORK_FILMS, type HomeProject } from "./data";
import { FilmLightbox } from "./FilmLightbox";
import { SnapDots, useSnapIndex } from "./HomeServices";
import servicesStyles from "./HomeServices.module.scss";
import styles from "./HomeWork.module.scss";

function categoryLabel(p: HomeProject) {
  return p.status === "entwurf" && !p.category.toLowerCase().includes("entwurf")
    ? `Entwurf · ${p.category}`
    : p.category;
}

function ProjectLink({ project: p, children }: { project: HomeProject; children: ReactNode }) {
  if (!p.url) return <>{children}</>;
  return (
    <SmartLink
      href={p.url}
      unstyled
      fillWidth
      target="_blank"
      rel="noopener noreferrer"
      className={styles.link}
      aria-label={`${p.title}: Website live in neuem Tab ansehen`}
    >
      {children}
    </SmartLink>
  );
}

function ProjectFrame({ project: p, featured }: { project: HomeProject; featured?: boolean }) {
  return (
    <figure className={classNames(styles.frame, featured && styles.frameFeatured)} data-frame>
      <Image
        className={styles.image}
        src={p.image}
        alt={p.obscured ? "Website-Entwurf für einen Kunden von EvGlab" : `${p.title}: Website-Projekt von EvGlab`}
        fill
        sizes={featured ? "(max-width: 1024px) 100vw, 1280px" : "(max-width: 1024px) 100vw, 640px"}
      />
      {p.latest && <span className={styles.badge}>Neuestes Projekt</span>}
    </figure>
  );
}

function ProjectMeta({ project: p, featured }: { project: HomeProject; featured?: boolean }) {
  return (
    <Column gap="8" fillWidth>
      <Row horizontal="between" vertical="end" gap="16" wrap>
        <Heading
          as="h3"
          className={classNames(styles.projectTitle, featured && styles.projectTitleFeatured, p.obscured && styles.blur)}
        >
          {p.title}
        </Heading>
        <Text className={styles.category}>{categoryLabel(p)}</Text>
      </Row>
      <Text as="p" className={styles.body}>
        {p.body}
      </Text>
      {p.url && (
        <Row gap="4" vertical="center" className={styles.live}>
          <Text className={styles.liveLabel}>Live ansehen</Text>
          <Icon name="arrowUpRight" size="xs" />
        </Row>
      )}
    </Column>
  );
}

/**
 * Selected work. Website frames start dimmed and ignite while they cross the
 * middle of the viewport, like a frame passing through the projector light.
 */
export function HomeWork() {
  const rootRef = useRef<HTMLDivElement>(null);
  const restRef = useRef<HTMLDivElement>(null);
  const { index, go } = useSnapIndex(restRef);
  const [film, setFilm] = useState<ShowreelItem | null>(null);
  const films = WORK_FILMS.map((id) => showreel.find((f) => f.id === id)).filter(
    (f): f is ShowreelItem => Boolean(f),
  );
  const [featured, ...rest] = PROJECTS;

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const frames = Array.from(root.querySelectorAll<HTMLElement>("[data-frame]"));
    root.classList.add(styles.armed);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) e.target.classList.add(styles.lit);
      },
      { rootMargin: "-28% 0px -28% 0px" },
    );
    frames.forEach((f) => io.observe(f));
    return () => {
      io.disconnect();
      root.classList.remove(styles.armed);
    };
  }, []);

  return (
    <StudioSection
      id="arbeiten"
      className={styles.section}
      kicker="Ausgewählte Arbeiten"
      title={
        <>
          Arbeiten, die man <Glow>merkt</Glow>.
        </>
      }
      intro="Websites, die Anfragen bringen, und Filme, die man zweimal ansieht. Live-Projekte und Entwürfe, alle selbst gestaltet und gebaut."
    >
      <Column ref={rootRef} fillWidth gap="80" s={{ gap: "48" }}>
        <Column as="ul" className={styles.list} fillWidth gap="64" s={{ gap: "48" }}>
          <Column as="li" fillWidth>
            <ProjectLink project={featured}>
              <Column fillWidth gap="24">
                <ProjectFrame project={featured} featured />
                <ProjectMeta project={featured} featured />
              </Column>
            </ProjectLink>
          </Column>
          <Column as="li" fillWidth gap="8">
            <Grid
              ref={restRef}
              columns="2"
              gap="40"
              fillWidth
              className={classNames(servicesStyles.grid, servicesStyles.carousel, styles.rest)}
              aria-label="Weitere Projekte, seitlich wischen"
            >
            {rest.map((p) => (
              <Column key={p.title} as="article" fillWidth gap="20" className={styles.card}>
                <ProjectLink project={p}>
                  <Column fillWidth gap="20">
                    <ProjectFrame project={p} />
                    <ProjectMeta project={p} />
                  </Column>
                </ProjectLink>
              </Column>
            ))}
            </Grid>
            <SnapDots
              name="Projekt wählen"
              labels={rest.map((p) => (p.obscured ? "Entwurf Immobilien" : p.title))}
              index={index}
              onSelect={go}
            />
          </Column>
        </Column>

        <Column fillWidth gap="32">
          <Row horizontal="between" vertical="end" gap="24" wrap>
            <Column gap="8">
              <Heading as="h3" className={styles.subhead}>
                Filme und Reels
              </Heading>
              <Text as="p" className={styles.body}>
                Echte Projekte aus Blender und Motion Design. Ein Klick spielt den ganzen Film mit Ton.
              </Text>
            </Column>
            <SmartLink href="/videos" unstyled className={styles.more}>
              <Row gap="8" vertical="center">
                <Text className={styles.liveLabel}>Alle Filme</Text>
                <Icon name="arrowRight" size="xs" />
              </Row>
            </SmartLink>
          </Row>
          <Grid columns="4" gap="20" m={{ columns: "2", gap: "16" }} fillWidth>
            {films.map((f) => (
              <FilmCard key={f.id} film={f} onOpen={setFilm} />
            ))}
          </Grid>
        </Column>
      </Column>
      <FilmLightbox film={film} onClose={() => setFilm(null)} />
    </StudioSection>
  );
}
