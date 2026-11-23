import { Column, Heading, Row, SmartLink, Text } from "@once-ui-system/core";
import { StudioFooter } from "@/components/studio";
import { StudioNotFoundSearch } from "./StudioNotFoundSearch";
import styles from "./NotFound.module.scss";

const audit: { label: string; value: string; verdict: string }[] = [
  { label: "Ladezeit", value: "0,00 s", verdict: "Bestwert. Ist ja nichts da." },
  { label: "Anfragen diesen Monat", value: "0", verdict: "Wie bei vielen Websites. Leider." },
  { label: "Mobil-optimiert", value: "Ja", verdict: "Nichts sieht auf jedem Gerät gleich gut aus." },
  { label: "Charakter", value: "Keiner", verdict: "Deshalb ist sie weg." },
];

/** 404 page body in the studio look (copy unchanged from the former page). */
export function StudioNotFound() {
  return (
    <Column fillWidth horizontal="center" data-theme="dark">
      <Column as="section" className={styles.page} fillWidth horizontal="center">
        <span className={styles.halo} aria-hidden="true" />
        <Column fillWidth maxWidth={44} gap="48" horizontal="center">
          <Column gap="24" horizontal="center" align="center">
            <span className={styles.code} aria-hidden="true">
              404
            </span>
            <Text className={styles.kicker}>Fehler 404 · Seite nicht gefunden</Text>
            <Heading as="h1" className={styles.title}>
              Diese Seite hatte keinen Charakter. <span className={styles.glow}>Also ist sie weg.</span>
            </Heading>
            <Text as="p" className={styles.lead}>
              Vermutlich hatte sie Template-Look. Oder sie geht gerade am Lech spazieren. Hier gibt es
              jedenfalls nichts mehr zu sehen, außer diesem ehrlichen Website-Check.
            </Text>
          </Column>

          <Column className={styles.audit} gap="4">
            <Row className={styles.auditHead} fillWidth horizontal="between" vertical="center" gap="12" wrap>
              <Text className={styles.auditTitle}>Website-Check dieser Seite</Text>
              <Text className={styles.auditUrl}>evglab.com/???</Text>
            </Row>
            {audit.map((row) => (
              <Row key={row.label} className={styles.row} fillWidth gap="16" vertical="start">
                <Text className={styles.label}>{row.label}</Text>
                <Column gap="2" horizontal="end" align="right" style={{ maxWidth: "60%" }}>
                  <Text className={styles.value}>{row.value}</Text>
                  <Text className={styles.verdict}>{row.verdict}</Text>
                </Column>
              </Row>
            ))}
            <Text as="p" className={styles.summary} style={{ margin: 0 }}>
              Fazit: Note 6, setzen. Zum Glück ist das die einzige Seite von EvGlab, die so aussieht.
            </Text>
          </Column>

          <Column gap="24" horizontal="center">
            <Row gap="12" wrap horizontal="center">
              <SmartLink href="/" unstyled className={styles.primary}>
                Zur Startseite <span aria-hidden="true">→</span>
              </SmartLink>
              <SmartLink href="/#arbeiten" unstyled className={styles.secondary}>
                Seiten mit Charakter ansehen
              </SmartLink>
            </Row>
            <StudioNotFoundSearch />
          </Column>
        </Column>
      </Column>
      <StudioFooter minimal />
    </Column>
  );
}
