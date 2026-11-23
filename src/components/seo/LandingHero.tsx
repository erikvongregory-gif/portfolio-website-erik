import { Column, Heading, Row, SmartLink, Text } from "@once-ui-system/core/components";
import classNames from "classnames";
import type { CSSProperties, ReactNode } from "react";
import { ContactDialog } from "@/components/ContactDialog";
import styles from "./Landing.module.scss";

type Props = {
  /** Last breadcrumb item (current page). */
  crumb: string;
  kicker: ReactNode;
  title: ReactNode;
  lead: ReactNode;
  ctaLabel?: string;
  funnel?: boolean;
  secondary?: { label: string; href: string };
  trust?: ReactNode;
};

const delay = (s: number) => ({ animationDelay: `${s}s` }) as CSSProperties;

/**
 * Calm page hero for local and SEO landing pages: breadcrumb, quiet kicker,
 * big light headline, short lead and one clear call to action.
 * Entrance is CSS only so the headline is painted immediately (LCP).
 */
export function LandingHero({
  crumb,
  kicker,
  title,
  lead,
  ctaLabel = "Kostenloser Entwurf",
  funnel = true,
  secondary,
  trust,
}: Props) {
  return (
    <Column
      as="section"
      data-theme="dark"
      data-sticky-cta-hero=""
      className={styles.hero}
      fillWidth
      horizontal="center"
    >
      <span className={styles.halo} aria-hidden="true" />
      <span className={styles.beam} aria-hidden="true" />
      <Column className={styles.heroInner} fillWidth maxWidth="xl" gap="32" s={{ gap: "24" }}>
        <Row
          as="nav"
          aria-label="Breadcrumb"
          className={classNames(styles.crumbs, styles.enter)}
          gap="8"
          vertical="center"
          wrap
        >
          <SmartLink href="/" unstyled>
            Start
          </SmartLink>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{crumb}</span>
        </Row>

        <Column gap="24">
          <Text className={classNames(styles.kicker, styles.enter)} style={delay(0.05)}>
            {kicker}
          </Text>
          <Heading as="h1" className={classNames(styles.h1, styles.enter)} style={delay(0.1)}>
            {title}
          </Heading>
        </Column>

        <Text as="p" className={classNames(styles.lead, styles.enter)} style={delay(0.18)}>
          {lead}
        </Text>

        <Column gap="20" className={styles.enter} style={delay(0.26)}>
          <Row gap="24" vertical="center" wrap>
            <ContactDialog label={ctaLabel} size="l" funnel={funnel} />
            {secondary && (
              <SmartLink href={secondary.href} unstyled className={styles.textLink}>
                {secondary.label}
                <span aria-hidden="true">→</span>
              </SmartLink>
            )}
          </Row>
          {trust && <Text className={styles.trust}>{trust}</Text>}
        </Column>
      </Column>
    </Column>
  );
}
