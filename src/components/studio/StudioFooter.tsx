import { Column, Grid, Row, SmartLink, Text } from "@once-ui-system/core";
import { CookieSettingsButton } from "@/components/CookieSettingsButton";
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL } from "@/lib/contact";
import { brancheLinks, leistungLinks, regionLinks } from "@/lib/seoPages/nav";
import { STUDIO_NAV } from "./nav";
import styles from "./StudioFooter.module.scss";

const legal = [
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
];

type Props = {
  /** Legal-only footer for focused landing pages. */
  minimal?: boolean;
};

function LinkGroup({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <Column gap="12">
      <Text className={styles.groupTitle}>{title}</Text>
      <Column as="ul" gap="8" className={styles.list}>
        {links.map((l) => (
          <li key={l.href}>
            <SmartLink href={l.href} unstyled className={styles.link}>
              {l.label}
            </SmartLink>
          </li>
        ))}
      </Column>
    </Column>
  );
}

/** Site footer on the dark stage with the giant glowing wordmark. */
export function StudioFooter({ minimal = false }: Props) {
  const year = new Date().getFullYear();

  return (
    <Column as="footer" data-theme="dark" className={styles.footer} fillWidth>
      {!minimal && (
        <Grid className={styles.grid} columns="5" s={{ columns: "2" }} gap="40" fillWidth>
          <Column gap="12" className={styles.contact}>
            <Text className={styles.groupTitle}>Kontakt</Text>
            <SmartLink href={`mailto:${CONTACT_EMAIL}`} unstyled className={styles.big}>
              {CONTACT_EMAIL}
            </SmartLink>
            <SmartLink href={CONTACT_PHONE_TEL} unstyled className={styles.link}>
              {CONTACT_PHONE_DISPLAY}
            </SmartLink>
            <Text className={styles.muted}>Hauptstraße 18 · 86925 Fuchstal</Text>
          </Column>
          <LinkGroup title="Navigation" links={STUDIO_NAV} />
          <LinkGroup title="Leistungen" links={leistungLinks} />
          <LinkGroup title="Branchen" links={brancheLinks} />
          <LinkGroup title="Regionen" links={regionLinks} />
        </Grid>
      )}

      <p className={styles.wordmark} aria-hidden="true">
        EvGlab
      </p>

      <Row className={styles.base} fillWidth horizontal="between" vertical="center" gap="16" wrap>
        <Text className={styles.muted}>© {year} EvGlab · Erik von Gregory</Text>
        <Row gap="20" vertical="center" wrap>
          {legal.map((l) => (
            <SmartLink key={l.href} href={l.href} unstyled className={styles.link}>
              {l.label}
            </SmartLink>
          ))}
          <CookieSettingsButton />
        </Row>
      </Row>
    </Column>
  );
}
