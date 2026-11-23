import { Column, Heading, Row, SmartLink, Text } from "@once-ui-system/core/components";
import { RequestTrigger } from "./MesseRequest";
import styles from "./MesseAnalyse.module.scss";

const LEARN = [
  {
    strong: "Wie Ihr Stand mit 3D-Film wirkt:",
    rest: " im Vorher-Nachher-Showvideo, gebaut auf Basis Ihres eigenen Messestands.",
  },
  {
    strong: "Welche Funktion Ihres Produkts heute unsichtbar bleibt",
    rest: " und wie Schnitt, Explosion oder Ablauf sie verständlich machen.",
  },
  {
    strong: "Was ein Messebesucher in 3 Sekunden verstehen muss",
    rest: ", damit er stehen bleibt, statt weiterzugehen.",
  },
  {
    strong: "Wo derselbe Film nach der Messe weiterarbeitet",
    rest: ": im Vertrieb, auf der Website, in Präsentationen und Schulungen.",
  },
  {
    strong: "Welcher Zeitplan zu Ihrer nächsten Messe passt",
    rest: " und welche Unterlagen wir dafür von Ihnen brauchen.",
  },
];

/** The free Potenzialanalyse offer, with the glass discus thrower behind it. */
export function MesseAnalyse() {
  return (
    <Column
      as="section"
      id="analyse"
      data-theme="dark"
      className={styles.section}
      fillWidth
      horizontal="center"
      aria-labelledby="analyse-title"
    >
      {/* biome-ignore lint/performance/noImgElement: decorative transparent render */}
      <img
        className={styles.statue}
        src="/3d-produktanimation/images/discus-statue.webp"
        alt=""
        aria-hidden="true"
        loading="lazy"
      />
      <Column className={styles.inner} fillWidth maxWidth="xl" gap="48">
        <Column className={styles.copy} gap="24">
          <Row gap="8" vertical="center" className={styles.kicker}>
            <span className={styles.dot} aria-hidden="true" />
            <Text>Ihr nächster Schritt</Text>
          </Row>
          <Heading as="h2" id="analyse-title" className={styles.title}>
            Die kostenlose <span className={styles.glow}>Potenzialanalyse</span> für Ihr Produkt.
          </Heading>
          <Text as="p" className={styles.intro}>
            Wer täglich mit einem Produkt arbeitet, sieht nicht mehr, was Außenstehende nicht verstehen.
            Oft steckt der eigentliche Wert im Inneren: in Abläufen und Details, die man weder am Exponat
            noch auf einem Foto erkennt. Wir sind keine Fachleute für Ihre Branche, sondern für
            3D-Animation. Genau deshalb schauen wir mit dem Blick Ihrer Besucher auf Ihr Produkt und sagen
            Ihnen konkret, was sich in 3D zeigen lässt. Für die Messe und darüber hinaus.
          </Text>
          <Text as="p" className={styles.intro}>
            So läuft es ab: Sie schicken uns ein kurzes Video Ihres Messestands. Daraus erstellen wir ein
            Vorher-Nachher-Showvideo, das zeigt, wie ein 3D-Film auf Ihrem Stand platziert ist und wirkt.
            Im Potenzialgespräch gehen wir es gemeinsam durch.
          </Text>

          <Text as="p" className={styles.learn}>
            Hier erfahren Sie:
          </Text>
          <Column as="ol" className={styles.list}>
            {LEARN.map((item, i) => (
              <Row as="li" key={item.strong} gap="20" className={styles.item}>
                <span className={styles.n} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <strong>{item.strong}</strong>
                  {item.rest}
                </span>
              </Row>
            ))}
          </Column>

          <Row gap="24" vertical="center" wrap className={styles.actions}>
            <RequestTrigger topic="analyse">Jetzt kostenlose Potenzialanalyse sichern</RequestTrigger>
            <Row gap="8" vertical="center">
              <span className={styles.dot} aria-hidden="true" />
              <Text className={styles.trust}>Kostenlos und unverbindlich</Text>
            </Row>
          </Row>
        </Column>

        <Row className={styles.sign} fillWidth horizontal="between" vertical="end" gap="32" wrap>
          <Text as="p" className={styles.claim}>
            3D-Produktfilme für Messen. <em>Gemacht, damit Besucher stehen bleiben.</em>
          </Text>
          <Column gap="4" className={styles.person}>
            <Text className={styles.personLabel}>Vertrieb</Text>
            <Text className={styles.personName}>Baris Basöz</Text>
            <Text className={styles.personRole}>Vertrieb 3D-Produktfilme</Text>
            <Row gap="16" wrap>
              <SmartLink href="tel:+4917672791512" unstyled className={styles.link}>
                +49 176 72791512
              </SmartLink>
              <SmartLink href="mailto:kontakt@evglab.com" unstyled className={styles.link}>
                kontakt@evglab.com
              </SmartLink>
            </Row>
          </Column>
        </Row>
      </Column>
    </Column>
  );
}
