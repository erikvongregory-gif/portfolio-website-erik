"use client";

import { useEffect, useState } from "react";
import { Button, IconButton, Row, Text } from "@once-ui-system/core";
import classNames from "classnames";
import { ContactDialog } from "@/components/ContactDialog";
import { subscribeScroll } from "@/components/motion/SmoothScroll";
import { WHATSAPP_URL } from "@/lib/contact";
import styles from "./StickyMobileCta.module.scss";

const MOBILE_MQ = "(max-width: 1024px)";

function shouldShowBar(hero: Element, kontakt: Element) {
  const heroRect = hero.getBoundingClientRect();
  const kontaktRect = kontakt.getBoundingClientRect();
  const heroVisible = heroRect.bottom > 0 && heroRect.top < window.innerHeight;
  const kontaktVisible =
    kontaktRect.top < window.innerHeight * 0.88 && kontaktRect.bottom > 0;
  return !heroVisible && !kontaktVisible;
}

type StickyMobileCtaProps = {
  label?: string;
  buttonLabel?: string;
  /** If set, primary button scrolls/links here instead of opening the contact dialog. */
  href?: string;
};

export function StickyMobileCta({
  label = "Kostenloses Erstgespräch",
  buttonLabel = "Anfragen",
  href,
}: StickyMobileCtaProps = {}) {
  const [visible, setVisible] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    const hero = document.querySelector("[data-sticky-cta-hero]");
    const kontakt = document.getElementById("kontakt") ?? document.getElementById("check");
    if (!hero || !kontakt) return;

    const mq = window.matchMedia(MOBILE_MQ);

    const sync = () => {
      if (!mq.matches) {
        setVisible(false);
        return;
      }
      setVisible(shouldShowBar(hero, kontakt));
    };

    sync();
    const unsubScroll = subscribeScroll(sync);
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync, { passive: true });
    mq.addEventListener("change", sync);

    return () => {
      unsubScroll();
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      mq.removeEventListener("change", sync);
    };
  }, []);

  return (
    <>
      <Row
        className={classNames(styles.root, styles.bar, visible && styles.visible)}
        aria-hidden={!visible}
        position="fixed"
        bottom="0"
        left="0"
        fillWidth
        horizontal="center"
        zIndex={2}
        background="surface"
        paddingX="16"
        paddingY="12"
        vertical="center"
        style={{ maxHeight: "4.375rem" }}
      >
        <Row fillWidth maxWidth={68} gap="12" vertical="center" horizontal="between">
          <Text
            variant="label-strong-s"
            onBackground="neutral-strong"
            style={{ letterSpacing: "-0.01em", lineHeight: 1.2, flex: 1, minWidth: 0 }}
          >
            {label}
          </Text>
          <Row gap="8" vertical="center" style={{ flexShrink: 0 }}>
            <IconButton
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              icon="whatsapp"
              variant="secondary"
              size="m"
              tooltip="WhatsApp"
              aria-label="Per WhatsApp schreiben"
            />
            {href ? (
              <Button href={href} variant="primary" size="m" arrowIcon>
                {buttonLabel}
              </Button>
            ) : (
              <Button variant="primary" size="m" arrowIcon onClick={() => setFormOpen(true)}>
                {buttonLabel}
              </Button>
            )}
          </Row>
        </Row>
      </Row>

      {!href && (
        <ContactDialog
          dialogOnly
          open={formOpen}
          onOpenChange={setFormOpen}
          idPrefix="sticky-cta-"
        />
      )}
    </>
  );
}
