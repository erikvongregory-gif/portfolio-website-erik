"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Column, Grid, Heading, Icon, Row, SmartLink, Tag, Text } from "@once-ui-system/core";
import classNames from "classnames";
import { ProjectPreview } from "./ProjectPreview";
import { Section } from "./Section";
import scene from "./Projects.module.scss";
import styles from "./sections.module.scss";

type Project = {
  title: string;
  /** Browser-Chrome-Label – muss zur realen URL passen (Hostname von `url`), sonst leer. */
  chrome: string;
  category: string;
  image: string;
  video?: string;
  body: string;
  url?: string;
  /** Live-Kundenprojekt vs. Konzept/Demo – steuert Entwurf-Badge. Offen = noch nicht bestätigt. */
  status?: "live" | "entwurf";
  comingSoon?: boolean;
  obscured?: boolean;
  latest?: boolean;
};

/** Hostname aus URL für Chrome-Anzeige; leer wenn keine URL. */
function chromeFromUrl(url?: string): string {
  if (!url) return "";
  try {
    return new URL(url).host;
  } catch {
    return "";
  }
}

const projects: Project[] = [
  {
    title: "Salon Liora",
    chrome: chromeFromUrl("https://salon-liora.vercel.app"),
    category: "Entwurf · Friseursalon",
    image: "/images/projects/salon-liora/hero.png",
    body: "Demo-Entwurf für einen fiktiven Friseursalon: warm, elegant und einladend – mit Geschichte, Leistungen und Terminbuchung.",
    url: "https://salon-liora.vercel.app",
    status: "entwurf",
    latest: true,
  },
  {
    title: "Da Peppe",
    chrome: chromeFromUrl("https://da-peppe.com"),
    category: "Gastronomie · Restaurant",
    image: "/images/projects/da-peppe/hero-live.png",
    body: "Website für eine italienische Osteria & Pizzeria: appetitlich, warm und einladend, mit klarer Speisekarte und Reservierung.",
    url: "https://da-peppe.com",
    status: "live",
  },
  {
    title: "EvGlab",
    chrome: chromeFromUrl("https://brewai.de"),
    category: "Eigene Marke · KI-Marketing",
    image: "/images/projects/evglab/hero-ki.png",
    video: "/videos/projects/evglab.mp4",
    body: "KI-Marketing für Brauereien: Produktfotos, Kampagnenmotive und Social-Content im eigenen Markenstil – ohne Studio.",
    url: "https://brewai.de",
    status: "live",
  },
  {
    title: "Kapitalanlagen Deutschland",
    chrome: "Entwurf",
    category: "Entwurf · Immobilien",
    image: "/images/projects/kapitalanlagen/hero.png",
    body: "Konzept-Entwurf für eine Immobilienfirma: ruhig, hochwertig und auf Vertrauen ausgelegt.",
    status: "entwurf",
    obscured: true,
  },
  {
    title: "Ingenieurbüro Jungen",
    chrome: chromeFromUrl("https://ib-jungen-web.vercel.app"),
    category: "Industrie · Automation",
    image: "/images/projects/ib-jungen/hero.png",
    video: "/videos/projects/ib-jungen.mp4",
    body: "Auftritt für Automation und Retrofit: technisch präzise, klar strukturiert und seriös.",
    url: "https://ib-jungen-web.vercel.app",
    // status: noch offen – bitte bestätigen
  },
  {
    title: "Lünebräu",
    chrome: chromeFromUrl("https://luenebraeu.vercel.app"),
    category: "Craft-Bier · Brauerei",
    image: "/images/projects/lunebraeu/hero.png",
    video: "/videos/projects/lunebraeu.mp4",
    body: "Markenauftritt für eine Craft-Bier-Brauerei aus Lüneburg: kantig, handwerklich und mit Haltung – vom Sortiment bis zur Bestellung.",
    url: "https://luenebraeu.vercel.app",
    // status: noch offen – bitte bestätigen
  },
];

function ProjectShot({ project: p, featured }: { project: Project; featured?: boolean }) {
  const blurImage = p.comingSoon;
  const chromeLabel =
    p.status === "entwurf" && !p.url ? "Entwurf" : p.chrome || chromeFromUrl(p.url);
  return (
    <div className={styles.shot}>
      <div className={styles.chrome}>
        <div className={styles.dots}>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </div>
        {chromeLabel ? (
          <Text
            variant="label-default-s"
            onBackground="neutral-weak"
            style={{ marginLeft: "0.375rem" }}
            className={p.comingSoon ? styles.blurText : undefined}
          >
            {chromeLabel}
          </Text>
        ) : null}
      </div>
      <div className={classNames(styles.imageWrap, featured && scene.featuredMedia)}>
        <ProjectPreview
          image={p.image}
          video={blurImage ? undefined : p.video}
          alt={
            p.comingSoon
              ? "Projekt, bald verfügbar"
              : p.obscured
                ? "Website-Entwurf für einen Kunden von EvgLab"
                : `${p.title}: Website-Projekt von EvgLab`
          }
          blur={blurImage}
          sizes={
            featured
              ? "(max-width: 1024px) 100vw, 900px"
              : "(max-width: 1024px) 100vw, 480px"
          }
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
  );
}

function ProjectMeta({ project: p, featured }: { project: Project; featured?: boolean }) {
  const blurTitle = p.comingSoon || p.obscured;
  const categoryLabel =
    p.status === "entwurf" && !p.category.toLowerCase().includes("entwurf")
      ? `Entwurf · ${p.category}`
      : p.category;
  return (
    <Column gap={featured ? "12" : "8"} paddingX="4">
      <Tag size="s" variant="neutral">
        {categoryLabel}
      </Tag>
      <Text
        variant={featured ? "display-strong-xs" : "heading-strong-s"}
        onBackground="neutral-strong"
        className={blurTitle ? styles.blurText : undefined}
        style={featured ? { letterSpacing: "-0.02em" } : undefined}
      >
        {p.title}
      </Text>
      <Text variant={featured ? "body-default-l" : "body-default-m"} onBackground="neutral-weak">
        {p.body}
      </Text>
      {p.url && (
        <Row gap="4" vertical="center" paddingTop="4" className={styles.live}>
          <Text variant="label-strong-s" onBackground="neutral-strong">
            Live ansehen
          </Text>
          <Icon name="arrowUpRight" size="xs" onBackground="neutral-strong" />
        </Row>
      )}
    </Column>
  );
}

function ProjectCard({
  project: p,
  featured,
  className,
  style,
}: {
  project: Project;
  featured?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  if (featured) {
    return (
      <Column
        className={classNames(styles.card, className)}
        data-project-card
        fillWidth
        style={style}
      >
        <Row fillWidth gap="40" vertical="center" m={{ direction: "column", gap: "20" }}>
          <Column flex={7} fillWidth>
            <ProjectShot project={p} featured />
          </Column>
          <Column flex={5} fillWidth paddingY="12" className={scene.featuredMeta}>
            <ProjectMeta project={p} featured />
          </Column>
        </Row>
      </Column>
    );
  }
  return (
    <Column
      className={classNames(styles.card, className)}
      gap="20"
      data-project-card
      fillWidth
      style={style}
    >
      <ProjectShot project={p} />
      <ProjectMeta project={p} />
    </Column>
  );
}

function ProjectLink({ project: p, children }: { project: Project; children: ReactNode }) {
  if (!p.url) return <Column fillWidth>{children}</Column>;
  return (
    <SmartLink
      href={p.url}
      unstyled
      fillWidth
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: "none" }}
      aria-label={`${p.title}: Website live in neuem Tab ansehen`}
    >
      {children}
    </SmartLink>
  );
}

export function Projects() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio > 0) {
            setInView(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: [0, 0.12, 0.25], rootMargin: "0px 0px -36% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const featured = projects.find((p) => p.latest) ?? projects[0];
  const rest = projects.filter((p) => p !== featured);

  return (
    <Section id="projekte" paddingY="128" maxWidth={72} gap="48">
      <Column
        ref={rootRef}
        fillWidth
        gap="48"
        className={classNames(scene.scene, inView && scene.in)}
      >
        <Heading
          as="h2"
          variant="display-strong-m"
          onBackground="neutral-strong"
          style={{ letterSpacing: "-0.04em", lineHeight: 1.05 }}
        >
          <span className={scene.line}>
            <span className={scene.lineInner}>Arbeiten,</span>
          </span>
          <span className={scene.line}>
            <span className={scene.lineInner}>die man merkt.</span>
          </span>
        </Heading>

        <Column fillWidth gap="32">
          <ProjectLink project={featured}>
            <ProjectCard project={featured} featured />
          </ProjectLink>

          <Grid columns="2" m={{ columns: "1" }} gap="32">
            {rest.map((p, i) => (
              <ProjectLink key={p.title} project={p}>
                <ProjectCard
                  project={p}
                  className={scene.gridCard}
                  style={{ "--i": i } as CSSProperties}
                />
              </ProjectLink>
            ))}
          </Grid>
        </Column>
      </Column>
    </Section>
  );
}
