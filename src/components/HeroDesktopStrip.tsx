"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { StarBadge } from "@/components/StarBadge";
import styles from "./HeroDesktopStrip.module.scss";

type CardContent = {
  title: string;
  image: string;
  tag: string;
  url?: string;
  obscured?: boolean;
};

const projects: CardContent[] = [
  {
    title: "Salon Liora",
    image: "/images/projects/salon-liora/hero.png",
    tag: "Webdesign",
    url: "https://salon-liora.vercel.app",
  },
  {
    title: "EvGlab",
    image: "/images/projects/evglab/hero-ki.png",
    tag: "KI · Brand",
    url: "https://brewai.de",
  },
  {
    title: "Da Peppe",
    image: "/images/projects/da-peppe/hero-live.png",
    tag: "Gastronomie",
    url: "https://da-peppe.com",
  },
  {
    title: "Ingenieurbüro Jungen",
    image: "/images/projects/ib-jungen/hero.png",
    tag: "Industrie",
    url: "https://ib-jungen-web.vercel.app",
  },
  {
    title: "Lünebräu",
    image: "/images/projects/lunebraeu/hero.png",
    tag: "Brand",
    url: "https://luenebraeu.vercel.app",
  },
  {
    title: "Kapitalanlagen Deutschland",
    image: "/images/projects/kapitalanlagen/hero.png",
    tag: "Entwurf",
    obscured: true,
  },
];

const DESKTOP_IMAGE_SIZES = "(min-width: 1024px) 1024px, 100vw";

function StripCard({ card }: { card: CardContent }) {
  const content = (
    <div className={styles.inner}>
      <Image
        className={styles.image}
        src={card.image}
        alt={
          card.obscured
            ? "Website-Entwurf für einen Kunden von EvgLab"
            : `${card.title} – Website-Projekt von EvgLab`
        }
        fill
        sizes={DESKTOP_IMAGE_SIZES}
        quality={100}
        /* Screenshots stay crisp — Image optimizer softens UI text */
        unoptimized
        draggable={false}
        priority={card.title === "Salon Liora"}
      />
      <span className={styles.tag}>
        <StarBadge lightWidth={70} duration={3.2}>
          {card.tag}
        </StarBadge>
      </span>
    </div>
  );

  if (!card.url) {
    return <figure className={styles.card}>{content}</figure>;
  }

  return (
    <figure className={styles.card}>
      <a
        href={card.url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
        aria-label={`${card.title} – Website live ansehen`}
      >
        {content}
      </a>
    </figure>
  );
}

/**
 * Desktop hero strip: website-sized previews, continuous scroll (pause on hover).
 */
export function HeroDesktopStrip() {
  const [paused, setPaused] = useState(false);
  const onEnter = useCallback(() => setPaused(true), []);
  const onLeave = useCallback(() => setPaused(false), []);

  return (
    <div
      className={`${styles.root}${paused ? ` ${styles.paused}` : ""}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      role="region"
      aria-label="Projektbeispiele"
      aria-roledescription="carousel"
    >
      <div className={styles.viewport}>
        <div className={styles.track}>
          {[...projects, ...projects].map((card, j) => (
            <StripCard key={`${card.title}-${j}`} card={card} />
          ))}
        </div>
      </div>
    </div>
  );
}
