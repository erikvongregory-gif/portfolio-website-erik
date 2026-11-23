"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Icon, Row, Text } from "@once-ui-system/core/components";
import { BLACK_FRIDAY, isBlackFridayActive } from "@/lib/blackFriday";
import classNames from "classnames";
import "./legal/banner-offset.css";
import styles from "./BlackFridayBanner.module.scss";

const HIDDEN_ON = ["/blackfriday", "/neueseite"];

/** Restzeit als kurzer Text, z. B. „11 T 04:23:10“. `null` = vorbei, `""` = noch nicht gemessen. */
export function useBlackFridayCountdown(): string | null {
  const [text, setText] = useState<string | null>("");

  useEffect(() => {
    const target = new Date(BLACK_FRIDAY.endsAt).getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setText(null);
        return;
      }
      const s = Math.floor(diff / 1000);
      const d = Math.floor(s / 86400);
      const pad = (n: number) => String(n).padStart(2, "0");
      const hms = `${pad(Math.floor((s % 86400) / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
      setText(d > 0 ? `${d} T ${hms}` : hms);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return text;
}

/** Schmale Aktionsleiste über dem Header auf allen Seiten außer /blackfriday. */
export function BlackFridayBanner() {
  const pathname = usePathname();
  const countdown = useBlackFridayCountdown();
  const [active, setActive] = useState(() => isBlackFridayActive());

  useEffect(() => {
    setActive(isBlackFridayActive());
  }, []);

  if (!active || countdown === null || HIDDEN_ON.includes(pathname)) return null;

  return (
    <Link
      href="/blackfriday"
      data-bf-banner=""
      className={styles.banner}
      aria-label="Black Friday: Website für 500 €, Landingpage für 300 €. Zum Angebot"
    >
      <Row className={styles.inner} fillWidth maxWidth="xl" horizontal="center" vertical="center" gap="12" paddingX="16">
        <span className={styles.dot} aria-hidden="true" />
        <Text as="span" className={styles.tag}>
          Black Friday
        </Text>
        <Text as="span" className={styles.copy}>
          Website <strong>500 €</strong>
          <span className={styles.desktopOnly}>
            {" "}
            · Landingpage <strong>300 €</strong>
          </span>
        </Text>
        {countdown && (
          <>
            <span className={classNames(styles.sep, styles.desktopOnly)} aria-hidden="true" />
            <Text as="span" className={styles.timer}>
              <span className={styles.desktopOnly}>endet in </span>
              {countdown}
            </Text>
          </>
        )}
        <Row as="span" className={styles.more} vertical="center" gap="4">
          <span className={styles.desktopOnly}>Angebot ansehen</span>
          <Icon name="arrowRight" size="xs" />
        </Row>
      </Row>
    </Link>
  );
}
