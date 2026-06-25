import styles from "./Marquee.module.scss";

const defaultItems = [
  "Webdesign",
  "Webentwicklung",
  "Landingpages",
  "Branding",
  "SEO-Grundlagen",
  "Mobile-first",
  "Performance",
  "Animationen",
];

type MarqueeProps = {
  items?: string[];
};

export function Marquee({ items = defaultItems }: MarqueeProps) {
  const loop = [...items, ...items];
  return (
    <div className={styles.marquee} aria-hidden="true">
      <div className={styles.track}>
        {loop.map((item, i) => (
          <span className={styles.item} key={`${item}-${i}`}>
            {item}
            <span className={styles.dot} />
          </span>
        ))}
      </div>
    </div>
  );
}
