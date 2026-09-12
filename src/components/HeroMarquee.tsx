"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { StarBadge } from "@/components/StarBadge";
import styles from "./HeroMarquee.module.scss";

type CardContent = {
  title: string;
  image: string;
  /** Short category chip on the card, Blink-style. */
  tag: string;
  comingSoon?: boolean;
  obscured?: boolean;
};

const projects: CardContent[] = [
  { title: "Salon Liora", image: "/images/projects/salon-liora/hero.png", tag: "Webdesign" },
  { title: "EvGlab", image: "/images/projects/evglab/hero-ki.png", tag: "KI · Brand" },
  {
    title: "Kapitalanlagen Deutschland (Entwurf)",
    image: "/images/projects/kapitalanlagen/hero.png",
    tag: "Entwurf",
    obscured: true,
  },
  { title: "Ingenieurbüro Jungen", image: "/images/projects/ib-jungen/hero.png", tag: "Industrie" },
  { title: "Lünebräu", image: "/images/projects/lunebraeu/hero.png", tag: "Brand" },
  { title: "Da Peppe", image: "/images/projects/da-peppe/hero-live.png", tag: "Gastronomie" },
];

function marqueeAlt(card: CardContent): string {
  if (card.comingSoon) return "Projekt – bald verfügbar";
  if (card.obscured) return "Website-Entwurf für einen Kunden von EvGlab";
  return `${card.title} – Website-Projekt von EvGlab`;
}

/** Mirrors `.card { width: 107vw }`. Must stay a static string (no window/media JS) or SSR/client hydrate will diverge. */
const MARQUEE_IMAGE_SIZES = "107vw";

function MarqueeCard({ card }: { card: CardContent }) {
  const blurImage = card.comingSoon;
  return (
    <figure className={styles.card}>
      <div className={styles.inner} data-sheen>
        <Image
          className={`${styles.image}${blurImage ? ` ${styles.imageBlur}` : ""}`}
          src={card.image}
          alt={marqueeAlt(card)}
          fill
          sizes={MARQUEE_IMAGE_SIZES}
        />
        <span className={styles.tag}>
          <StarBadge lightWidth={70} duration={3.2}>
            {card.tag}
          </StarBadge>
        </span>
      </div>
    </figure>
  );
}

/**
 * Mobile hero strip: landscape project shots in original card size,
 * continuous scroll, pauses on hover/touch.
 */
export function HeroMarquee() {
  const [paused, setPaused] = useState(false);
  const onEnter = useCallback(() => setPaused(true), []);
  const onLeave = useCallback(() => setPaused(false), []);

  return (
    <div
      className={`${styles.root}${paused ? ` ${styles.paused}` : ""}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onTouchStart={onEnter}
      onTouchEnd={onLeave}
      role="region"
      aria-label="Projektbeispiele"
      aria-roledescription="carousel"
    >
      <div className={styles.viewport}>
        <div className={styles.track}>
          {[...projects, ...projects].map((card, j) => (
            <MarqueeCard key={j} card={card} />
          ))}
        </div>
      </div>
    </div>
  );
}
