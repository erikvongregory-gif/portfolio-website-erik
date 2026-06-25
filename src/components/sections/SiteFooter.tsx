import { Column, Flex, Line, Row, SmartLink, Text } from "@once-ui-system/core";

const navLinks = [
  { label: "Projekte", href: "/#projekte" },
  { label: "Leistungen", href: "/#leistungen" },
  { label: "Ablauf", href: "/#ablauf" },
  { label: "Über mich", href: "/ueber-uns" },
];

const contactLinks = [
  { label: "info@evglab.com", href: "mailto:info@evglab.com" },
  { label: "0173 170 6012", href: "tel:+491731706012" },
  { label: "Landsberg am Lech", href: "/" },
];

const legalLinks = [
  { label: "Impressum", href: "#" },
  { label: "Datenschutz", href: "#" },
];

export function SiteFooter() {
  return (
    <Flex as="footer" fillWidth horizontal="center" paddingX="l" paddingTop="64" paddingBottom="40">
      <Column fillWidth maxWidth={68} gap="40">
        <Row fillWidth gap="40" horizontal="between" wrap s={{ direction: "column", gap: "32" }}>
          <Column gap="12" maxWidth={22}>
            <Text variant="heading-strong-s" onBackground="neutral-strong" style={{ letterSpacing: "-0.01em" }}>
              Erik EvgLab
            </Text>
            <Text variant="body-default-s" onBackground="neutral-weak">
              Webentwicklung und Design aus Landsberg am Lech. Auftritte mit Persönlichkeit, die
              Anfragen bringen.
            </Text>
          </Column>

          <Row gap="64" wrap s={{ gap: "32" }}>
            <Column gap="12">
              <Text variant="label-default-s" onBackground="neutral-weak">
                Navigation
              </Text>
              {navLinks.map((l) => (
                <SmartLink key={l.label} href={l.href}>
                  <Text variant="body-default-s" onBackground="neutral-medium">
                    {l.label}
                  </Text>
                </SmartLink>
              ))}
            </Column>

            <Column gap="12">
              <Text variant="label-default-s" onBackground="neutral-weak">
                Kontakt
              </Text>
              {contactLinks.map((l) => (
                <SmartLink key={l.label} href={l.href}>
                  <Text variant="body-default-s" onBackground="neutral-medium">
                    {l.label}
                  </Text>
                </SmartLink>
              ))}
            </Column>
          </Row>
        </Row>

        <Line background="neutral-alpha-weak" />

        <Row fillWidth horizontal="between" vertical="center" gap="16" wrap s={{ direction: "column", gap: "12" }}>
          <Text variant="body-default-xs" onBackground="neutral-weak">
            © 2026 Erik EvgLab · Landsberg am Lech
          </Text>
          <Row gap="20">
            {legalLinks.map((l) => (
              <SmartLink key={l.label} href={l.href}>
                <Text variant="body-default-xs" onBackground="neutral-weak">
                  {l.label}
                </Text>
              </SmartLink>
            ))}
          </Row>
        </Row>
      </Column>
    </Flex>
  );
}
