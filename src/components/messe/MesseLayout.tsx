import { Column } from "@once-ui-system/core/components";
import classNames from "classnames";
import type { ComponentProps, ReactNode } from "react";
import { StudioSection } from "@/components/studio";
import { Blueprint } from "./Blueprint";
import styles from "./MessePage.module.scss";

/** One dark stage for the page body with the blueprint layer behind all sections. */
export function MesseCanvas({ children }: { children: ReactNode }) {
  return (
    <Column className={styles.canvas} data-theme="dark" fillWidth>
      <Blueprint />
      {children}
    </Column>
  );
}

/** StudioSection with a transparent stage, so the blueprint shows through. */
export function MesseSection({ className, ...rest }: ComponentProps<typeof StudioSection>) {
  return <StudioSection className={classNames(styles.clear, className)} {...rest} />;
}

/** Text only for screen readers (e.g. a heading the design shows visually otherwise). */
export function SrOnly({ as = "span", children, id }: { as?: "span" | "h2"; children: ReactNode; id?: string }) {
  const Tag = as;
  return (
    <Tag id={id} className={styles.srOnly}>
      {children}
    </Tag>
  );
}
