"use client";

import Image from "next/image";
import styles from "./HeroMarquee.module.scss";

type CardContent = {
  title: string;
  image: string;
  comingSoon?: boolean;
  /** Blur the project name only (e.g. client opted out of being named). */
  obscured?: boolean;
};

const projects: CardContent[] = [
  { title: "Salon Liora", image: "/images/projects/salon-liora/hero.png" },
  { title: "EvGlab", image: "/images/projects/evglab/hero-ki.png" },
  {
    title: "Kapitalanlagen Deutschland (Entwurf)",
    image: "/images/projects/kapitalanlagen/hero.png",
    obscured: true,
  },
  { title: "Ingenieurbüro Jungen", image: "/images/projects/ib-jungen/hero.png" },
  { title: "Lünebräu", image: "/images/projects/lunebraeu/hero.png" },
  { title: "Da Peppe", image: "/images/projects/da-peppe/hero-live.png" },
];

function MarqueeCard({ card }: { card: CardContent }) {
  const blurImage = card.comingSoon;
  return (
    <figure className={styles.card} aria-hidden="true">
      <div className={styles.inner} data-sheen>
        <Image
          className={`${styles.image}${blurImage ? ` ${styles.imageBlur}` : ""}`}
          src={card.image}
          alt=""
          fill
          sizes="240px"
        />
      </div>
    </figure>
  );
}

// Two rows keep the band quiet; third row made the strip feel template-heavy.
const rows: { items: CardContent[]; reverse: boolean; duration: number }[] = [
  { items: projects, reverse: false, duration: 46 },
  {
    items: [projects[2], projects[4], projects[0], projects[3], projects[1]],
    reverse: true,
    duration: 38,
  },
];

export function HeroMarquee() {
  return (
    <div className={styles.root} aria-hidden="true">
      <div className={styles.rows}>
        {rows.map((row, i) => (
          <div
            key={i}
            className={`${styles.track} ${row.reverse ? styles.reverse : ""}`}
            style={{ ["--dur" as string]: `${row.duration}s` }}
          >
            {/* Duplicated set keeps the loop seamless at translateX(-50%). */}
            {[...row.items, ...row.items].map((card, j) => (
              <MarqueeCard key={j} card={card} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
