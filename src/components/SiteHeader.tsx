"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Button,
  Column,
  Flex,
  Icon,
  IconButton,
  Row,
  SmartLink,
  Text,
} from "@once-ui-system/core";
import classNames from "classnames";
import styles from "./SiteHeader.module.scss";
import { ContactDialog } from "./ContactDialog";
import { ThemeToggle } from "./ThemeToggle";
import { BrandMark } from "@/components/BrandLogo";
import { subscribeScroll } from "@/components/motion/SmoothScroll";

const navLinks = [
  { label: "Startseite", href: "/" },
  { label: "Projekte", href: "/#projekte" },
  { label: "Leistungen", href: "/#leistungen" },
  { label: "Ablauf", href: "/#ablauf" },
  { label: "Über mich", href: "/ueber-uns" },
];

function Logo({ size = 44 }: { size?: number }) {
  return (
    <SmartLink href="/" unstyled aria-label="Erik EvgLab – Startseite">
      <BrandMark size={size} />
    </SmartLink>
  );
}

const TOP_SHOW_Y = 24;
const DIRECTION_DELTA = 6;
const CLOSE_MS = 480;

type MenuState = "closed" | "opening" | "open" | "closing";

export function SiteHeader() {
  const pathname = usePathname();
  const hideHeader = pathname === "/festpreis" || pathname === "/partner";
  const [menu, setMenu] = useState<MenuState>("closed");
  const [scrolledAway, setScrolledAway] = useState(false);
  const lastY = useRef(0);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuExpanded = menu === "open";
  const menuVisible = menu !== "closed";

  const openMenu = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    // Mount closed first, then flip to open so clip-path can transition.
    setMenu("opening");
  };

  const closeMenu = () => {
    setMenu((current) => {
      if (current !== "open" && current !== "opening") return current;
      if (closeTimer.current) clearTimeout(closeTimer.current);
      closeTimer.current = setTimeout(() => {
        setMenu("closed");
        closeTimer.current = null;
      }, CLOSE_MS);
      return "closing";
    });
  };

  // After mount in "opening", promote to "open" on the next frames.
  useEffect(() => {
    if (menu !== "opening") return;
    let cancelled = false;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!cancelled) setMenu("open");
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, [menu]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  useEffect(() => {
    if (menu !== "open" && menu !== "opening") return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menu]);

  // Hide on scroll down, reveal on scroll up — Blink-style smart header.
  useEffect(() => {
    if (hideHeader) return;

    lastY.current = window.scrollY;

    const sync = () => {
      if (menuVisible) {
        setScrolledAway(false);
        return;
      }

      const y = window.scrollY;
      const delta = y - lastY.current;

      if (y <= TOP_SHOW_Y) {
        setScrolledAway(false);
      } else if (delta > DIRECTION_DELTA) {
        setScrolledAway(true);
      } else if (delta < -DIRECTION_DELTA) {
        setScrolledAway(false);
      }

      lastY.current = y;
    };

    sync();
    const unsubScroll = subscribeScroll(sync);
    window.addEventListener("scroll", sync, { passive: true });

    return () => {
      unsubScroll();
      window.removeEventListener("scroll", sync);
    };
  }, [hideHeader, menuVisible]);

  if (hideHeader) {
    return null;
  }

  return (
    <>
      <Flex
        as="header"
        className={classNames(
          styles.header,
          scrolledAway && styles.hidden,
          menuVisible && styles.headerOpen,
        )}
        position="fixed"
        top="0"
        left="0"
        fillWidth
        horizontal="center"
        zIndex={3}
        paddingX="l"
        paddingY="12"
        aria-hidden={scrolledAway}
      >
        <Row className={styles.bar} fillWidth maxWidth="xl" horizontal="between" vertical="center">
          <div className={styles.brand}>
            <Logo />
          </div>

          {/* Desktop: Blink-style centered editorial links */}
          <nav className={styles.desktopNav} aria-label="Hauptnavigation">
            <ul className={styles.desktopList}>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <SmartLink href={link.href} unstyled className={styles.desktopLink}>
                    {link.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </nav>

          <Row className={styles.desktopActions} vertical="center" gap="12">
            <ThemeToggle className={styles.iconLg} />
            {!menuVisible && <ContactDialog label="Kostenlos anfragen" size="s" />}
            {menuVisible ? (
              <IconButton
                icon="close"
                variant="tertiary"
                size="l"
                className={styles.iconLg}
                aria-label="Menü schließen"
                aria-expanded={menuExpanded}
                aria-controls="site-menu"
                onClick={closeMenu}
              />
            ) : (
              <IconButton
                icon="menu"
                variant="tertiary"
                size="l"
                className={classNames(styles.iconLg, styles.menuBtn)}
                aria-label="Menü öffnen"
                aria-expanded={false}
                aria-controls="site-menu"
                onClick={openMenu}
              />
            )}
          </Row>

          {/* Mobile: unchanged circular menu */}
          <Flex className={styles.mobileActions} gap="4" vertical="center">
            {!menuVisible && <ThemeToggle className={styles.iconLg} />}
            {menuVisible ? (
              <IconButton
                icon="close"
                variant="tertiary"
                size="l"
                className={styles.iconLg}
                aria-label="Menü schließen"
                aria-expanded={menuExpanded}
                aria-controls="site-menu"
                onClick={closeMenu}
              />
            ) : (
              <IconButton
                icon="menu"
                variant="tertiary"
                size="l"
                className={styles.iconLg}
                aria-label="Menü öffnen"
                aria-expanded={false}
                aria-controls="site-menu"
                onClick={openMenu}
              />
            )}
          </Flex>
        </Row>
      </Flex>

      {menuVisible && (
        <div
          id="site-menu"
          className={classNames(
            styles.overlay,
            menuExpanded && styles.overlayOpen,
            menu === "closing" && styles.overlayClosing,
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          <Column className={styles.panel} fillWidth fillHeight paddingX="16" paddingBottom="16">
            <Column fillWidth flex={1} vertical="center" paddingX="8">
              <ul className={styles.navList}>
                {navLinks.map((link, i) => (
                  <li key={link.href} className={styles.navItem}>
                    <SmartLink
                      href={link.href}
                      unstyled
                      fillWidth
                      className={styles.link}
                      onClick={closeMenu}
                      onClickCapture={closeMenu}
                    >
                      <Row
                        className={styles.linkRow}
                        horizontal="between"
                        vertical="center"
                        gap="16"
                      >
                        <Row vertical="center" gap="16" style={{ minWidth: 0 }}>
                          <Text
                            className={styles.index}
                            variant="label-default-s"
                            onBackground="neutral-weak"
                          >
                            ({String(i + 1).padStart(2, "0")})
                          </Text>
                          <Text
                            className={styles.label}
                            variant="display-strong-s"
                            onBackground="neutral-strong"
                          >
                            {link.label}
                          </Text>
                        </Row>
                        <Icon name="arrowUpRight" size="m" onBackground="neutral-weak" />
                      </Row>
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </Column>

            <Column className={styles.footer} fillWidth gap="16" paddingX="8" paddingBottom="8">
              <Button
                href="/#kontakt"
                variant="primary"
                size="l"
                fillWidth
                arrowIcon
                onClick={closeMenu}
                onClickCapture={closeMenu}
              >
                Kostenloses Erstgespräch
              </Button>
              <Text variant="label-default-s" onBackground="neutral-weak" align="center">
                Antwort innerhalb 24h
              </Text>
            </Column>
          </Column>
        </div>
      )}
    </>
  );
}
