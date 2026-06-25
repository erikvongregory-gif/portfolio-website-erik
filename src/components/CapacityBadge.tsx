"use client";

import { Column, Row, Text } from "@once-ui-system/core";
import { useEffect, useState } from "react";
import styles from "./CapacityBadge.module.scss";

type CapacityBadgeProps = {
  taken?: number;
  total?: number;
  label?: string;
};

export function CapacityBadge({ taken = 3, total = 4, label }: CapacityBadgeProps) {
  const pct = Math.max(0, Math.min(100, Math.round((taken / total) * 100)));
  const displayLabel = label ?? `${taken}/${total} Projekten diesen Monat belegt`;
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setWidth(pct);
      return;
    }
    const t = setTimeout(() => setWidth(pct), 300);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <Column
      gap="10"
      paddingX="16"
      paddingY="12"
      radius="l"
      background="surface"
      border="neutral-alpha-medium"
      shadow="s"
      maxWidth={20}
      role="status"
      aria-label={`${taken} von ${total} Projekten diesen Monat belegt. Kapazität ${pct} Prozent ausgelastet.`}
    >
      <Row gap="8" vertical="center">
        <span className={styles.dot} aria-hidden="true" />
        <Text variant="label-default-s" onBackground="neutral-strong" wrap="balance">
          {displayLabel}
        </Text>
      </Row>
      <div className={styles.track} aria-hidden="true">
        <div className={styles.fill} style={{ width: `${width}%` }} />
      </div>
    </Column>
  );
}
