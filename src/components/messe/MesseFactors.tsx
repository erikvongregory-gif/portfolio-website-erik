import { Column, Grid, Heading, Row, Text } from "@once-ui-system/core";
import styles from "./MesseFactors.module.scss";

const FACTORS = [
  {
    art: "/3d-produktanimation/images/line-lens-dark.svg",
    title: "Der Stopp-Moment",
    text: "Besucher laufen vorbei. Sie haben drei Sekunden, um einen Blick zu fangen. Das gelingt mit einem klaren Motiv statt einer langen Einleitung.",
    meta: ["Aufmerksamkeit", "Die ersten 3 Sekunden"],
  },
  {
    art: "/3d-produktanimation/images/line-slabs-dark.svg",
    title: "Das Unsichtbare zeigen",
    text: "Schnitte, Explosionsansichten, Schicht für Schicht: 3D zeigt, was im Inneren Ihres Produkts passiert. Auch ohne Ton verständlich.",
    meta: ["Verständnis", "Ohne Ton erklärt"],
  },
  {
    art: "/3d-produktanimation/images/line-cubes-dark.svg",
    title: "Die Brücke zum Gespräch",
    text: "Der Film ersetzt nicht Ihren Vertrieb, er öffnet ihm die Tür. Er liefert den Anlass, damit am Stand das richtige Gespräch beginnt.",
    meta: ["Verbindung", "Vom Blick zum Lead"],
  },
];

/** The three things a trade-show film has to do, each with its line drawing. */
export function MesseFactors() {
  return (
    <Grid as="ol" columns="3" m={{ columns: "1" }} gap="24" fillWidth className={styles.list}>
      {FACTORS.map((f, i) => (
        <Column as="li" key={f.title} className={styles.card} fillWidth>
          <Column className={styles.media} fillWidth>
            {/* biome-ignore lint/performance/noImgElement: static SVG line drawing */}
            <img src={f.art} alt="" width={1200} height={1200} loading="lazy" className={styles.art} />
            <span className={styles.num} aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
          </Column>
          <Column gap="12" padding="24" flex={1}>
            <Heading as="h3" className={styles.title}>
              {f.title}
            </Heading>
            <Text as="p" className={styles.text}>
              {f.text}
            </Text>
            <Row className={styles.meta} horizontal="between" gap="12" wrap>
              <Text>{f.meta[0]}</Text>
              <Text>{f.meta[1]}</Text>
            </Row>
          </Column>
        </Column>
      ))}
    </Grid>
  );
}
