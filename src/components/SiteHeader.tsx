"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Column,
  Flex,
  Icon,
  IconButton,
  RevealFx,
  Row,
  SmartLink,
  Text,
} from "@once-ui-system/core";
import styles from "./SiteHeader.module.scss";
import { ContactDialog } from "./ContactDialog";
import { BrandMark } from "@/components/BrandLogo";

const navLinks = [
  { label: "Projekte", href: "/#projekte" },
  { label: "Leistungen", href: "/#leistungen" },
  { label: "Ablauf", href: "/#ablauf" },
  { label: "Über mich", href: "/ueber-uns" },
];

function Logo() {
  return (
    <SmartLink href="/" unstyled style={{ textDecoration: "none" }}>
      <Row vertical="center" gap="8">
        <BrandMark size={26} />
        <Text
          variant="label-strong-m"
          onBackground="neutral-strong"
          style={{ letterSpacing: "-0.01em" }}
        >
          Erik EvgLab
        </Text>
      </Row>
    </SmartLink>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth > 1024) setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <>
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
          <Logo />

          <Row as="nav" aria-label="Hauptnavigation" vertical="center" gap="4">
            <Flex m={{ hide: true }} gap="2" vertical="center">
              {navLinks.map((link) => (
                <Button key={link.href} href={link.href} variant="tertiary" size="s">
                  {link.label}
                </Button>
              ))}
              <ContactDialog label="Kostenlos anfragen" size="s" />
            </Flex>
            <Flex hide m={{ hide: false }}>
              <IconButton
                icon="menu"
                variant="tertiary"
                size="m"
                aria-label="Menü öffnen"
                aria-expanded={open}
                onClick={() => setOpen(true)}
              />
            </Flex>
          </Row>
        </Row>
      </Flex>

      {open && (
        <Column
          className={styles.backdrop}
          fillWidth
          background="page"
          position="fixed"
          top="0"
          left="0"
          style={{ height: "100dvh" }}
        >
          <Column className={styles.panel} fillWidth fillHeight padding="16">
            <Row fillWidth horizontal="between" vertical="center">
              <Logo />
              <IconButton
                icon="close"
                variant="tertiary"
                size="l"
                aria-label="Menü schließen"
                onClick={() => setOpen(false)}
              />
            </Row>

            <Column
              fillWidth
              flex={1}
              vertical="center"
              gap="0"
              paddingX="8"
              paddingY="32"
            >
              {navLinks.map((link, i) => (
                <RevealFx key={link.href} fillWidth translateY="8" delay={0.05 + i * 0.06}>
                  <SmartLink
                    href={link.href}
                    unstyled
                    fillWidth
                    className={styles.link}
                    onClick={() => setOpen(false)}
                  >
                    <Row
                      fillWidth
                      horizontal="between"
                      vertical="center"
                      paddingY="20"
                      borderBottom="neutral-alpha-weak"
                    >
                      <Text
                        variant="display-strong-xs"
                        onBackground="neutral-strong"
                        style={{ letterSpacing: "-0.02em" }}
                      >
                        {link.label}
                      </Text>
                      <Icon name="arrowUpRight" size="m" onBackground="neutral-weak" />
                    </Row>
                  </SmartLink>
                </RevealFx>
              ))}
            </Column>

            <Column fillWidth gap="16" paddingX="8" paddingBottom="8">
              <Button
                href="/#kontakt"
                variant="primary"
                size="l"
                fillWidth
                arrowIcon
                onClick={() => setOpen(false)}
              >
                Kostenloses Erstgespräch
              </Button>
              <Text variant="label-default-s" onBackground="neutral-weak" align="center">
                Antwort innerhalb 24h · Landsberg am Lech
              </Text>
            </Column>
          </Column>
        </Column>
      )}
    </>
  );
}
