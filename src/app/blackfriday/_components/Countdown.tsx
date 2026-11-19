"use client";

import { useEffect, useState } from "react";
import { Column, Row, Text } from "@once-ui-system/core";
import classNames from "classnames";
import { BLACK_FRIDAY } from "@/lib/blackFriday";
import styles from "./blackfriday.module.scss";

type Parts = { d: number; h: number; m: number; s: number };

function partsUntil(target: number, now: number): Parts | null {
  const diff = target - now;
  if (diff <= 0) return null;
  const sec = Math.floor(diff / 1000);
  return {
    d: Math.floor(sec / 86400),
    h: Math.floor((sec % 86400) / 3600),
    m: Math.floor((sec % 3600) / 60),
    s: sec % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

type CountdownProps = {
  size?: "m" | "l";
};

export function Countdown({ size = "l" }: CountdownProps) {
  const target = new Date(BLACK_FRIDAY.endsAt).getTime();
  const [parts, setParts] = useState<Parts | null | undefined>(undefined);

  useEffect(() => {
    const tick = () => setParts(partsUntil(target, Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  if (parts === null) {
    return (
      <Text variant="label-strong-m" onBackground="neutral-strong">
        Die Black-Friday-Aktion ist beendet.
      </Text>
    );
  }

  const units: { label: string; value: string }[] = [
    { label: "Tage", value: parts ? pad(parts.d) : "--" },
    { label: "Std", value: parts ? pad(parts.h) : "--" },
    { label: "Min", value: parts ? pad(parts.m) : "--" },
    { label: "Sek", value: parts ? pad(parts.s) : "--" },
  ];

  return (
    <Row
      gap="8"
      vertical="center"
      role="timer"
      aria-live="off"
      aria-label={`Angebot endet am ${BLACK_FRIDAY.endsLabel}`}
    >
      {units.map((unit, i) => (
        <Row key={unit.label} gap="8" vertical="center">
          <Column
            className={classNames(styles.clockCell, size === "m" && styles.clockCellM)}
            horizontal="center"
            vertical="center"
            radius="m"
          >
            <Text className={styles.clockValue} onBackground="neutral-strong">
              {unit.value}
            </Text>
            <Text variant="label-default-xs" onBackground="neutral-weak">
              {unit.label}
            </Text>
          </Column>
          {i < units.length - 1 && (
            <Text className={styles.clockSep} onBackground="neutral-weak" aria-hidden="true">
              :
            </Text>
          )}
        </Row>
      ))}
    </Row>
  );
}
