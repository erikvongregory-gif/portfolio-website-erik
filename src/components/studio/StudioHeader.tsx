"use client";

import { Column, Row, SmartLink } from "@once-ui-system/core/components";
import classNames from "classnames";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ContactDialog } from "@/components/ContactDialog";
import { getScrollY, startLenis, stopLenis, subscribeScroll } from "@/components/motion/SmoothScroll";
import { STUDIO_NAV } from "./nav";
import styles from "./StudioHeader.module.scss";

const HIDDEN_ON = ["/neueseite", "/motion-prototype"];
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Floating glass navigation for the whole site. Hides while scrolling down,
 * comes back on scroll up. On phones a full-screen sheet with large links.
 */
export function StudioHeader() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

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

  // Close the phone sheet when the viewport grows into the desktop layout.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 861px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Open sheet: lock page scroll (also on iOS), trap focus, close on Escape,
  // and hand focus back to the burger when it closes.
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    stopLenis();

    const sheet = sheetRef.current;
    const focusables = () => {
      const inSheet = sheet ? Array.from(sheet.querySelectorAll<HTMLElement>(FOCUSABLE)) : [];
      return [buttonRef.current, ...inSheet].filter((el): el is HTMLElement => !!el);
    };
    const focusTimer = window.setTimeout(() => focusables()[1]?.focus({ preventScroll: true }), 60);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      const inside = active ? items.includes(active) : false;
      if (e.shiftKey && (active === first || !inside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !inside)) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(focusTimer);
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
      startLenis();
      window.removeEventListener("keydown", onKey);
      if (sheet?.contains(document.activeElement)) buttonRef.current?.focus({ preventScroll: true });
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
            ref={buttonRef}
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
        ref={sheetRef}
        as="nav"
        id="studio-menu"
        aria-label="Menü"
        className={classNames(styles.sheet, open && styles.sheetOpen)}
        aria-hidden={!open}
        inert={!open}
        gap="4"
        // Close on any link tap. (Once UI's SmartLink drops its own onClick for
        // internal links, so the handler sits here and catches the bubble.)
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) setOpen(false);
        }}
      >
        {STUDIO_NAV.map((item, i) => (
          <SmartLink
            key={item.href}
            href={item.href}
            unstyled
            className={styles.sheetLink}
            style={{ transitionDelay: open ? `${80 + i * 50}ms` : "0ms" }}
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
