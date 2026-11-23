import { Column, Heading, Text } from "@once-ui-system/core";
import classNames from "classnames";
import type { ComponentProps, ReactNode } from "react";
import styles from "./StudioSection.module.scss";

type ColumnProps = ComponentProps<typeof Column>;

type Props = Omit<ColumnProps, "title"> & {
  /** "stage" = dark (default), "paper" = warm light paper. */
  tone?: "stage" | "paper";
  kicker?: ReactNode;
  title?: ReactNode;
  intro?: ReactNode;
  /** Heading level for the title. */
  as?: "section" | "div";
  headingAs?: "h1" | "h2" | "h3";
  children?: ReactNode;
};

/**
 * Page section in the studio system. Sets the theme for its subtree so Once UI
 * tokens resolve correctly (dark stage or light paper), plus consistent padding
 * and an optional head (kicker, big light title, intro).
 */
export function StudioSection({
  tone = "stage",
  kicker,
  title,
  intro,
  as = "section",
  headingAs = "h2",
  className,
  children,
  ...rest
}: Props) {
  return (
    <Column
      as={as}
      data-theme={tone === "stage" ? "dark" : "light"}
      className={classNames(styles.section, styles[tone], className)}
      fillWidth
      horizontal="center"
      {...rest}
    >
      <Column className={styles.inner} fillWidth maxWidth="xl" gap="48">
        {(kicker || title || intro) && (
          <Column className={styles.head} gap="20">
            {kicker && <Text className={styles.kicker}>{kicker}</Text>}
            {title && (
              <Heading as={headingAs} className={styles.title}>
                {title}
              </Heading>
            )}
            {intro && (
              <Text as="p" className={styles.intro}>
                {intro}
              </Text>
            )}
          </Column>
        )}
        {children}
      </Column>
    </Column>
  );
}

/** Wrap words inside a StudioSection title to give them the white-to-cyan glow. */
export function Glow({ children }: { children: ReactNode }) {
  return <span className={styles.glow}>{children}</span>;
}
