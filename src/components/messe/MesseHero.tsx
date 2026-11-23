import { Column, Heading, Row, SmartLink, Text } from "@once-ui-system/core";
import { RequestTrigger } from "./MesseRequest";
import styles from "./MesseHero.module.scss";

const STATUE = "/3d-produktanimation/images/discus-statue.png";

/**
 * Hero of the trade-show page: two mirrored glass discus throwers frame the
 * headline on the dark stage, lit by a soft cyan glow from above.
 */
export function MesseHero() {
  return (
    <Column
      as="section"
      id="hero"
      data-theme="dark"
      className={styles.stage}
      fillWidth
      horizontal="center"
      aria-labelledby="messe-hero-title"
    >
      <span className={styles.glow} aria-hidden="true" />
      {/* biome-ignore lint/performance/noImgElement: decorative transparent render, sized by CSS */}
      <img
        className={`${styles.statue} ${styles.left}`}
        src={STATUE}
        alt=""
        aria-hidden="true"
        draggable={false}
        fetchPriority="high"
      />
      {/* biome-ignore lint/performance/noImgElement: decorative transparent render, sized by CSS */}
      <img
        className={`${styles.statue} ${styles.right}`}
        src={STATUE}
        alt=""
        aria-hidden="true"
        draggable={false}
      />
      <span className={styles.floor} aria-hidden="true" />

      <Column className={styles.inner} horizontal="center" gap="32">
        <Row gap="8" vertical="center" className={styles.kicker}>
          <span className={styles.dot} aria-hidden="true" />
          <Text>3D-Produktfilme für Messen</Text>
        </Row>
        <Heading as="h1" id="messe-hero-title" className={styles.title}>
          3D-Produktfilme, die aus Messe-Laufkundschaft{" "}
          <span className={styles.glowText}>echte Gespräche</span> für Ihren Vertrieb machen.
        </Heading>
        <Text as="p" className={styles.sub}>
          <span className={styles.long}>
            Wir zeigen auf Ihrem Standscreen, was in Ihrem Produkt steckt, stumm verständlich und in
            Sekunden erfasst. Besucher bleiben stehen, verstehen den Nutzen und fragen nach. Ihr
            Vertrieb steigt dann mitten im Gespräch ein. Sie kennen Ihr Produkt, wir beherrschen
            3D-Animation. Gemeinsam machen wir sichtbar, was es kann, egal in welcher Branche.
          </span>
          <span className={styles.short}>
            Stumm verständlich, in Sekunden erfasst. Sie kennen Ihr Produkt, wir beherrschen
            3D-Animation.
          </span>
        </Text>
        <Text as="p" className={styles.teaser}>
          Erfahren Sie, warum die meisten Messevideos in der Halle untergehen und was wir{" "}
          <u>grundlegend anders</u> machen.
        </Text>
        <Row gap="24" vertical="center" horizontal="center" wrap>
          <RequestTrigger topic="analyse">Potenzialanalyse</RequestTrigger>
          <SmartLink href="#film" unstyled className={styles.secondary}>
            Beispiele
          </SmartLink>
        </Row>
      </Column>
    </Column>
  );
}
