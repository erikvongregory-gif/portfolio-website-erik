"use client";

import { Button, Flex, Row, Text } from "@once-ui-system/core";

export function SiteHeader() {
  return (
    <Flex
      as="header"
      position="fixed"
      top="0"
      left="0"
      fillWidth
      horizontal="center"
      zIndex={3}
      padding="16"
      pointerEvents="none"
    >
      <Row
        vertical="center"
        gap="24"
        paddingLeft="16"
        paddingRight="8"
        paddingY="8"
        radius="full"
        background="surface"
        border="neutral-alpha-medium"
        shadow="l"
        pointerEvents="auto"
        style={{
          backdropFilter: "blur(14px) saturate(160%)",
          WebkitBackdropFilter: "blur(14px) saturate(160%)",
        }}
      >
        <Row as="a" href="/" vertical="center" gap="10" style={{ textDecoration: "none" }}>
          <Flex
            horizontal="center"
            vertical="center"
            radius="m"
            style={{
              width: 26,
              height: 26,
              background: "var(--brand-solid-strong)",
              color: "var(--brand-on-solid-strong)",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            E
          </Flex>
          <Text
            variant="label-strong-m"
            onBackground="neutral-strong"
            style={{ letterSpacing: "-0.01em" }}
          >
            Erik EvgLab
          </Text>
        </Row>

        <Row vertical="center" gap="4">
          <Flex m={{ hide: true }} gap="2" vertical="center">
            <Button href="/#projekte" variant="tertiary" size="s">
              Projekte
            </Button>
            <Button href="/#leistungen" variant="tertiary" size="s">
              Leistungen
            </Button>
            <Button href="/#ablauf" variant="tertiary" size="s">
              Ablauf
            </Button>
            <Button href="/ueber-uns" variant="tertiary" size="s">
              Über mich
            </Button>
          </Flex>
          <Button href="/#kontakt" variant="primary" size="s" arrowIcon>
            Kontakt
          </Button>
        </Row>
      </Row>
    </Flex>
  );
}
