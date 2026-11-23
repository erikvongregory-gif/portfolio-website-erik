import { Column, Grid, Row, Text } from "@once-ui-system/core/components";
import { RequestTrigger } from "./MesseRequest";
import { SecondsTick } from "./SecondsTick";
import styles from "./MesseCta.module.scss";

const STATS = [
  { label: "Dauer des Gesprächs", value: "30 Min." },
  { label: "Kosten für Sie", value: "0 €" },
  { label: "Verpflichtung", value: "Keine" },
];

/** First-call offer: the handshake still with "3 Sek." and the call facts. */
export function MesseCta() {
  return (
    <Column gap="40" fillWidth>
      <Row>
        <RequestTrigger topic="gespraech">Erstgespräch vereinbaren</RequestTrigger>
      </Row>
      <Grid columns="2" m={{ columns: "1" }} gap="16" fillWidth>
        <Column className={styles.media} vertical="end" fillWidth>
          {/* biome-ignore lint/performance/noImgElement: decorative still, sized by CSS */}
          <img
            className={styles.img}
            src="/3d-produktanimation/images/cta-handshake.webp"
            alt=""
            width={1536}
            height={1024}
            loading="lazy"
          />
          <Column className={styles.mediaContent} gap="12">
            <SecondsTick className={styles.big} />
            <Column gap="4">
              <Text className={styles.mediaTitle}>So viel Zeit hat Ihr Stand</Text>
              <Text as="p" className={styles.mediaText}>
                Mehr bekommt kein Aussteller, um einen vorbeilaufenden Besucher zu stoppen. Dafür bauen
                wir jeden Film.
              </Text>
            </Column>
          </Column>
        </Column>

        <Column className={styles.card} gap="32" vertical="between">
          <Text as="p" className={styles.cardText}>
            In 30 Minuten klären wir, welche Geschichte Ihr Produkt am Stand erzählen soll und welches
            Format dafür passt. Unverbindlich und ohne Agentur-Floskeln.
          </Text>
          <Column as="dl" className={styles.stats}>
            {STATS.map((s) => (
              <Row key={s.label} className={styles.stat} horizontal="between" vertical="center" gap="16">
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </Row>
            ))}
          </Column>
        </Column>
      </Grid>
    </Column>
  );
}
