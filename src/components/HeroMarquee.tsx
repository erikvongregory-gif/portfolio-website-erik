"use client";

import styles from "./HeroMarquee.module.scss";

type CardContent = {
  title: string;
  image: string;
  comingSoon?: boolean;
  /** Blur the project name only (e.g. client opted out of being named). */
  obscured?: boolean;
};

const projects: CardContent[] = [
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

function MarqueeCard({ card, priority = false }: { card: CardContent; priority?: boolean }) {
  const blurImage = card.comingSoon;
  return (
    <figure className={styles.card} aria-hidden="true">
      <div className={styles.inner}>
        <img
          className={`${styles.image}${blurImage ? ` ${styles.imageBlur}` : ""}`}
          src={card.image}
          alt=""
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
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
              <MarqueeCard key={j} card={card} priority={i === 0 && j === 0} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
