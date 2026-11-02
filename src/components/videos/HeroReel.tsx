import { Row } from "@once-ui-system/core";
import { showreelHero } from "@/lib/showreel";
import { AutoplayVideo } from "./AutoplayVideo";
import styles from "./HeroReel.module.scss";

/** Three vertical loops as a fanned stack, middle one in front. */
export function HeroReel() {
  return (
    <Row fillWidth horizontal="center" vertical="center" className={styles.stage} aria-hidden="true">
      {showreelHero.map((id, i) => (
        <span key={id} className={styles.frame} data-pos={i}>
          <AutoplayVideo
            src={`/videos/${id}-preview.mp4`}
            poster={`/videos/${id}.webp`}
            className={styles.media}
          />
        </span>
      ))}
    </Row>
  );
}
