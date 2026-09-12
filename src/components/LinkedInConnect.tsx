"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Icon, IconButton } from "@once-ui-system/core";
import classNames from "classnames";
import { ShiftCta } from "@/components/ShiftCta";
import { startLenis, stopLenis } from "@/components/motion/SmoothScroll";
import {
  COOKIE_CONSENT_UPDATED_EVENT,
  COOKIE_STORAGE_KEY,
} from "@/lib/cookieConsent";
import { LINKEDIN_URL } from "@/lib/contact";
import styles from "./LinkedInConnect.module.scss";

const SHOW_DELAY_MS = 3500;
const AFTER_COOKIE_DELAY_MS = 1800;
const STORAGE_KEY = "evglab:linkedin-connect-dismissed";

function wasDismissed() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function LinkedInConnect() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => setMounted(true), []);

  const dismiss = useCallback(() => {
    setShown(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    window.setTimeout(() => setOpen(false), 320);
  }, []);

  useEffect(() => {
    if (wasDismissed()) return;

    let cancelled = false;
    let showTimer: ReturnType<typeof setTimeout> | undefined;

    const scheduleShow = (delay: number) => {
      if (showTimer) clearTimeout(showTimer);
      showTimer = setTimeout(() => {
        if (!cancelled && !wasDismissed()) setOpen(true);
      }, delay);
    };

    try {
      if (localStorage.getItem(COOKIE_STORAGE_KEY)) {
        scheduleShow(SHOW_DELAY_MS);
      } else {
        const onCookie = () => scheduleShow(AFTER_COOKIE_DELAY_MS);
        window.addEventListener(COOKIE_CONSENT_UPDATED_EVENT, onCookie);
        scheduleShow(SHOW_DELAY_MS + 6000);
        return () => {
          cancelled = true;
          if (showTimer) clearTimeout(showTimer);
          window.removeEventListener(COOKIE_CONSENT_UPDATED_EVENT, onCookie);
        };
      }
    } catch {
      scheduleShow(SHOW_DELAY_MS);
    }

    return () => {
      cancelled = true;
      if (showTimer) clearTimeout(showTimer);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    stopLenis();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let raf = 0;
    if (reduce) {
      setShown(true);
    } else {
      raf = requestAnimationFrame(() => setShown(true));
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      startLenis();
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dismiss]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className={classNames(styles.layer, shown && styles.layerVisible)}
      role="dialog"
      aria-modal="true"
      aria-label="Mit mir auf LinkedIn connecten"
    >
      <button
        type="button"
        className={styles.backdrop}
        aria-label="Hinweis schließen"
        onClick={dismiss}
      />
      <div className={styles.card}>
        <IconButton
          className={styles.close}
          icon="close"
          variant="secondary"
          size="s"
          onClick={dismiss}
          tooltip="Schließen"
          aria-label="Hinweis schließen"
        />
        <ShiftCta
          className={styles.cta}
          aria-label="Connecte dich mit mir auf LinkedIn"
          onClick={() => {
            window.open(LINKEDIN_URL, "_blank", "noopener,noreferrer");
            dismiss();
          }}
          suffix={<Icon name="linkedin" size="m" />}
        >
          Connecte dich mit mir auf
        </ShiftCta>
      </div>
    </div>,
    document.body,
  );
}
