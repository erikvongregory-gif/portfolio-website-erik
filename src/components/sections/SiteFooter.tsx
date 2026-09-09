"use client";

import { useEffect, useRef, useState } from "react";
import { Column, Flex, Line, Row, SmartLink, Text } from "@once-ui-system/core";
import classNames from "classnames";
import { CookieSettingsButton } from "@/components/CookieSettingsButton";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
} from "@/lib/contact";
import styles from "./SiteFooter.module.scss";

const WORDMARK = "EvgLab";

const navLinks = [
  { label: "Projekte", href: "/#projekte" },
  { label: "Leistungen", href: "/#leistungen" },
  { label: "Ablauf", href: "/#ablauf" },
  { label: "Über mich", href: "/ueber-uns" },
  { label: "Webdesign Landsberg", href: "/webdesign-landsberg" },
];

const contactLinks = [
  { label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  { label: CONTACT_PHONE_DISPLAY, href: CONTACT_PHONE_TEL },
  { label: "Landsberg am Lech", href: "/webdesign-landsberg" },
];

const legalLinks = [
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
];

type SiteFooterProps = {
  /** Legal-only footer for conversion landing pages (no nav leak). */
  minimal?: boolean;
};

function FooterWordmark() {
  const ref = useRef<HTMLParagraphElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setInView(entry.isIntersecting);
      },
      { threshold: 0.15, rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <p
      ref={ref}
      className={classNames(styles.wordmark, inView && styles.wordmarkIn)}
      aria-label="EvgLab"
    >
      {WORDMARK.split("").map((letter, index) => (
        <span key={`${letter}-${index}`} className={styles.letterClip}>
          <span className={styles.letter} style={{ animationDelay: `${index * 0.07}s` }}>
            {letter}
          </span>
        </span>
      ))}
    </p>
  );
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function SiteFooter({ minimal = false }: SiteFooterProps) {
  if (minimal) {
    return (
      <Flex
        as="footer"
        className={styles.minimal}
        fillWidth
        horizontal="center"
        paddingX="l"
        paddingTop="40"
        paddingBottom="40"
      >
        <Column fillWidth maxWidth={68} gap="20">
          <Line background="neutral-alpha-weak" />
          <Row
            fillWidth
            horizontal="between"
            vertical="center"
            gap="16"
            wrap
            s={{ direction: "column", gap: "12" }}
          >
            <Text variant="body-default-xs" onBackground="neutral-weak">
              © 2026 Erik EvgLab · Landsberg am Lech
            </Text>
            <Row gap="20" vertical="center" wrap>
              {legalLinks.map((l) => (
                <SmartLink key={l.label} href={l.href}>
                  <Text variant="body-default-xs" onBackground="neutral-weak">
                    {l.label}
                  </Text>
                </SmartLink>
              ))}
              <CookieSettingsButton />
            </Row>
          </Row>
        </Column>
      </Flex>
    );
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <Row
          className={styles.top}
          fillWidth
          horizontal="between"
          gap="48"
          s={{ direction: "column", gap: "40" }}
        >
          <Column className={styles.intro} gap="12" maxWidth={28}>
            <Text className={styles.kicker}>Erik EvgLab</Text>
            <Text className={styles.lead}>
              Webentwicklung und Design aus Landsberg am Lech. Auftritte mit Persönlichkeit, die
              Anfragen bringen.
            </Text>
          </Column>

          <Row className={styles.cols} gap="48" wrap s={{ gap: "32" }}>
            <Column gap="12">
              <Text className={styles.colTitle}>Navigation</Text>
              {navLinks.map((l) => (
                <a key={l.label} href={l.href} className={styles.link}>
                  {l.label}
                </a>
              ))}
            </Column>
            <Column gap="12">
              <Text className={styles.colTitle}>Kontakt</Text>
              {contactLinks.map((l) => (
                <a key={l.label} href={l.href} className={styles.link}>
                  {l.label}
                </a>
              ))}
            </Column>
            <Column gap="12">
              <Text className={styles.colTitle}>Legal</Text>
              {legalLinks.map((l) => (
                <a key={l.label} href={l.href} className={styles.link}>
                  {l.label}
                </a>
              ))}
              <CookieSettingsButton className={styles.cookie} />
            </Column>
          </Row>

          <button type="button" className={styles.toTop} onClick={scrollToTop} aria-label="Nach oben">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 19V6M6.5 11.5 12 6l5.5 5.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </Row>

        <FooterWordmark />

        <Text className={styles.copy}>© 2026 Erik EvgLab · Landsberg am Lech</Text>
      </div>
    </footer>
  );
}
