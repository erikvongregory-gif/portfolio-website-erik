import { type ReactNode } from "react";
import { Column, type ColumnProps } from "@once-ui-system/core";
import classNames from "classnames";
import styles from "./HeroEntrance.module.scss";

type HeroEntranceProps = ColumnProps & {
  children: ReactNode;
};

/**
 * Hero load choreography via CSS keyframes (runs on first paint):
 * soft veil lift, masked headline rise, blur-to-sharp copy, visual settle.
 */
export function HeroEntrance({ children, className, ...flex }: HeroEntranceProps) {
  return (
    <Column {...flex} className={classNames(styles.root, className)}>
      <Column className={styles.veil} aria-hidden="true" />
      {children}
    </Column>
  );
}

/** Soft clip-rise line for hero headlines. */
export function HeroLine({ children }: { children: ReactNode }) {
  return (
    <span className={styles.line}>
      <span className={styles.lineInner}>{children}</span>
    </span>
  );
}

export const heroEnter = {
  badge: styles.badge,
  lead: styles.lead,
  actions: styles.actions,
  proof: styles.proof,
  about: styles.about,
  mobileProof: styles.mobileProof,
  visual: styles.visual,
  marquee: styles.marquee,
};
