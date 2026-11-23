"use client";

import { Column, Row, SmartLink } from "@once-ui-system/core";
import classNames from "classnames";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ContactDialog } from "@/components/ContactDialog";
import { getScrollY, subscribeScroll } from "@/components/motion/SmoothScroll";
import { STUDIO_NAV } from "./nav";
import styles from "./StudioHeader.module.scss";

const HIDDEN_ON = ["/neueseite", "/motion-prototype"];

/**
 * Floating glass navigation for the whole site. Hides while scrolling down,
 * comes back on scroll up. On phones a full-screen sheet with large links.
 */
export function StudioHeader() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = getScrollY();
    const onScroll = () => {
      const y = getScrollY();
      const delta = y - lastY.current;
      if (y < 80) setHidden(false);
      else if (delta > 6) setHidden(true);
      else if (delta < -6) setHidden(false);
      lastY.current = y;
    };
    const unsubscribe = subscribeScroll(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      unsubscribe();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (HIDDEN_ON.includes(pathname)) return null;

  return (
    <header
      data-theme="dark"
      className={classNames(styles.header, hidden && !open && styles.hidden)}
    >
      <Row as="nav" aria-label="Hauptnavigation" className={styles.bar} vertical="center">
        <Row className={styles.links} gap="24" vertical="center">
          {STUDIO_NAV.map((item) => (
            <SmartLink key={item.href} href={item.href} unstyled className={styles.link}>
              {item.label}
            </SmartLink>
          ))}
        </Row>
        <SmartLink href="/" unstyled className={styles.wordmark} aria-label="EvGlab Startseite">
          EvGlab
        </SmartLink>
        <Row className={styles.end} horizontal="end" vertical="center" gap="8">
          <span className={styles.cta}>
            <ContactDialog label="Projekt starten" size="s" />
          </span>
          <button
            type="button"
            className={styles.menuButton}
            aria-label={open ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={open}
            aria-controls="studio-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className={classNames(styles.burger, open && styles.burgerOpen)} />
          </button>
        </Row>
      </Row>

      <Column
        id="studio-menu"
        className={classNames(styles.sheet, open && styles.sheetOpen)}
        aria-hidden={!open}
        gap="8"
      >
        {STUDIO_NAV.map((item, i) => (
          <SmartLink
            key={item.href}
            href={item.href}
            unstyled
            className={styles.sheetLink}
            style={{ transitionDelay: open ? `${80 + i * 50}ms` : "0ms" }}
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
          >
            {item.label}
          </SmartLink>
        ))}
        <Column className={styles.sheetCta} paddingTop="24">
          <ContactDialog label="Kostenloser Entwurf" size="l" funnel />
        </Column>
      </Column>
    </header>
  );
}
