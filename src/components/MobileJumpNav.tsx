"use client";

import { Button, Row } from "@once-ui-system/core";
import styles from "./MobileJumpNav.module.scss";

const links = [
  { label: "Projekte", href: "/#projekte" },
  { label: "Leistungen", href: "/#leistungen" },
  { label: "Ablauf", href: "/#ablauf" },
  { label: "Kontakt", href: "/#kontakt" },
];

export function MobileJumpNav() {
  return (
    <nav aria-label="Schnellnavigation" className={styles.root}>
      <div className={styles.bar}>
        <Row className={styles.track} gap="4" vertical="center" horizontal="center">
          {links.map((link) => (
            <Button
              key={link.href}
              href={link.href}
              variant="tertiary"
              size="s"
              className={styles.chip}
            >
              {link.label}
            </Button>
          ))}
        </Row>
      </div>
    </nav>
  );
}
