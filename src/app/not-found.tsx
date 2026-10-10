import type { Metadata } from "next";
import { Button, Column, Heading, Row, Tag, Text } from "@once-ui-system/core";
import { NotFoundSearch } from "@/components";

export const metadata: Metadata = {
  title: "Seite nicht gefunden",
  robots: { index: false, follow: true },
};

const audit: { label: string; value: string; verdict: string }[] = [
  { label: "Ladezeit", value: "0,00 s", verdict: "Bestwert. Ist ja nichts da." },
  { label: "Anfragen diesen Monat", value: "0", verdict: "Wie bei vielen Websites. Leider." },
  { label: "Mobil-optimiert", value: "Ja", verdict: "Nichts sieht auf jedem Gerät gleich gut aus." },
  { label: "Charakter", value: "Keiner", verdict: "Deshalb ist sie weg." },
];

export default function NotFound() {
  return (
    <Column
      as="section"
      fillWidth
      horizontal="center"
      paddingX="l"
      paddingTop="160"
      paddingBottom="104"
      s={{ paddingTop: "104" }}
    >
      <Column maxWidth={44} gap="48" horizontal="center">
        <Column gap="20" horizontal="center" align="center">
          <Tag size="m" variant="neutral">
            Fehler 404 · Seite nicht gefunden
          </Tag>
          <Heading as="h1" variant="display-default-l" wrap="balance">
            Diese Seite hatte keinen Charakter. Also ist sie weg.
          </Heading>
          <Text variant="body-default-l" onBackground="neutral-weak" wrap="balance">
            Vermutlich hatte sie Template-Look. Oder sie geht gerade am Lech spazieren. Hier gibt es
            jedenfalls nichts mehr zu sehen, außer diesem ehrlichen Website-Check.
          </Text>
        </Column>

        <Column
          fillWidth
          background="surface"
          border="neutral-alpha-weak"
          radius="l"
          padding="24"
          gap="4"
          s={{ padding: "16" }}
        >
          <Row fillWidth horizontal="between" vertical="center" paddingBottom="12">
            <Text variant="label-strong-m" onBackground="neutral-strong">
              Website-Check dieser Seite
            </Text>
            <Text variant="label-default-s" onBackground="neutral-weak">
              evglab.com/???
            </Text>
          </Row>
          {audit.map((row) => (
            <Row
              key={row.label}
              fillWidth
              gap="16"
              paddingY="12"
              borderTop="neutral-alpha-weak"
              vertical="start"
            >
              <Text variant="body-default-m" onBackground="neutral-weak" align="left" style={{ flex: 1 }}>
                {row.label}
              </Text>
              <Column gap="2" horizontal="end" align="right" style={{ maxWidth: "60%" }}>
                <Text variant="body-strong-m" onBackground="neutral-strong">
                  {row.value}
                </Text>
                <Text variant="body-default-s" onBackground="neutral-weak">
                  {row.verdict}
                </Text>
              </Column>
            </Row>
          ))}
          <Row fillWidth paddingTop="16" borderTop="neutral-alpha-weak">
            <Text variant="body-default-m" onBackground="neutral-strong">
              Fazit: Note 6, setzen. Zum Glück ist das die einzige Seite von EvGlab, die so aussieht.
            </Text>
          </Row>
        </Column>

        <Column gap="24" horizontal="center">
          <Row gap="12" wrap horizontal="center">
            <Button href="/" variant="primary" size="m" arrowIcon>
              Zur Startseite
            </Button>
            <Button href="/#projekte" variant="secondary" size="m">
              Seiten mit Charakter ansehen
            </Button>
          </Row>
          <NotFoundSearch />
        </Column>
      </Column>
    </Column>
  );
}
