"use client";

import Link from "next/link";
import { Column, Icon, Row, Text } from "@once-ui-system/core/components";
import { BLACK_FRIDAY, BLACK_FRIDAY_PACKAGES } from "@/lib/blackFriday";
import { useBlackFridayCountdown } from "@/components/BlackFridayBanner";
import styles from "./BlackFridayPromo.module.scss";

type BlackFridayPromoProps = React.ComponentProps<typeof Column>;

/** Aktionskachel, die während Black Friday an Stelle des Startpakets steht. */
export function BlackFridayPromo(props: BlackFridayPromoProps) {
  const countdown = useBlackFridayCountdown();
  if (countdown === null) return null;

  return (
    <Column
      data-theme="dark"
      className={styles.promo}
      fillWidth
      radius="xl"
      padding="40"
      s={{ padding: "24" }}
      gap="24"
      {...props}
    >
      <Row gap="8" vertical="center" wrap>
        <span className={styles.tag}>Black Friday</span>
        <span className={styles.discount}>{BLACK_FRIDAY.discountLabel}</span>
        <Text variant="label-default-s" className={styles.ends}>
          nur bis {BLACK_FRIDAY.endsLabel}
          {countdown ? ` · noch ${countdown}` : ""}
        </Text>
      </Row>

      <Row
        gap="32"
        vertical="end"
        horizontal="between"
        s={{ direction: "column", vertical: "start" }}
      >
        <Column gap="12">
          <Text as="h3" className={styles.headline}>
            Deine Website für <span className={styles.gold}>500 €</span>.
          </Text>
          <Row gap="24" wrap>
            {BLACK_FRIDAY_PACKAGES.map((pkg) => (
              <Row key={pkg.id} gap="8" vertical="center" wrap>
                <Text variant="label-default-m" onBackground="neutral-medium">
                  {pkg.name}
                </Text>
                <Text variant="heading-strong-m" onBackground="neutral-strong">
                  {pkg.priceLabel}
                </Text>
                <Text variant="label-default-s" className={styles.strike}>
                  {pkg.regularLabel.replace("regulär ", "")}
                </Text>
              </Row>
            ))}
          </Row>
          <Text variant="body-default-m" onBackground="neutral-weak">
            Individuelles Design, kostenloser Entwurf vorab, in ca. 7 Tagen online. Nur{" "}
            {BLACK_FRIDAY.slotsTotal} Plätze.
          </Text>
        </Column>

        <Link href="/blackfriday" className={styles.cta}>
          Zum Black-Friday-Angebot
          <Icon name="arrowRight" size="s" />
        </Link>
      </Row>
    </Column>
  );
}
