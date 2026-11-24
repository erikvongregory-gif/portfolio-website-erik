import { Column, Heading, Row, SmartLink, Text } from "@once-ui-system/core/components";
import type { ReactNode } from "react";
import { StudioFooter } from "@/components/studio";
import styles from "./StudioLegal.module.scss";

type StudioLegalLayoutProps = {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  updated?: string;
  /** Optional table of contents: section titles exactly as passed to LegalBlock. */
  toc?: string[];
  children: ReactNode;
};

/** Stable anchor id for a section title ("3. Allgemeine Hinweise" -> "allgemeine-hinweise"). */
export function legalAnchor(title: string) {
  return title
    .toLowerCase()
    .replace(/^\d+\.\s*/, "")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Legal pages (Impressum, Datenschutz) on the dark stage. Pure reading layout:
 * one column, about 68 characters per line, clear heading hierarchy.
 */
export function StudioLegalLayout({
  eyebrow,
  title,
  intro,
  updated,
  toc,
  children,
}: StudioLegalLayoutProps) {
  return (
    <Column fillWidth horizontal="center" data-theme="dark" className={styles.page}>
      <Column as="section" className={styles.hero} fillWidth horizontal="center">
        <Column className={styles.measure} gap="20">
          <Text className={styles.kicker}>{eyebrow}</Text>
          <Heading as="h1" className={styles.title}>
            {title}
          </Heading>
          {intro && (
            <Text as="p" className={styles.intro}>
              {intro}
            </Text>
          )}
          {updated && <Text className={styles.updated}>Stand: {updated}</Text>}
          {toc && toc.length > 0 && (
            <Column as="nav" aria-label="Inhalt" className={styles.toc} gap="8">
              <Text className={styles.tocLabel}>Inhalt</Text>
              <Row as="ol" wrap gap="8" className={styles.tocList}>
                {toc.map((item) => (
                  <li key={item}>
                    <SmartLink href={`#${legalAnchor(item)}`} unstyled className={styles.tocLink}>
                      {item}
                    </SmartLink>
                  </li>
                ))}
              </Row>
            </Column>
          )}
        </Column>
      </Column>

      <Column as="article" className={styles.body} fillWidth horizontal="center">
        <Column className={styles.measure} gap="40">
          {children}
        </Column>
      </Column>

      <StudioFooter />
    </Column>
  );
}

export function LegalBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Column as="section" id={legalAnchor(title)} className={styles.block} gap="16" fillWidth>
      <Heading as="h2" className={styles.h2}>
        {title}
      </Heading>
      <Column gap="16" fillWidth>
        {children}
      </Column>
    </Column>
  );
}

export function LegalSubheading({ children }: { children: ReactNode }) {
  return (
    <Heading as="h3" className={styles.h3}>
      {children}
    </Heading>
  );
}

export function LegalText({ children }: { children: ReactNode }) {
  return (
    <Text as="p" className={styles.text}>
      {children}
    </Text>
  );
}
