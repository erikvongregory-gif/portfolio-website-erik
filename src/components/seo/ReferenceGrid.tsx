import Image from "next/image";
import { Column, Grid, Heading, Row, SmartLink, Text } from "@once-ui-system/core/components";
import type { SeoReference } from "@/lib/seoPages";
import styles from "./Landing.module.scss";

/** Real website projects as a calm grid: screenshot, name, category, live link. */
export function ReferenceGrid({ items }: { items: SeoReference[] }) {
  return (
    <Grid as="ul" columns="3" m={{ columns: "2" }} s={{ columns: "1" }} gap="32" fillWidth className={styles.pills}>
      {items.map((ref) => (
        <Column as="li" key={ref.title} gap="16">
          <Column className={styles.refFrame}>
            <Image
              src={ref.image}
              alt={`${ref.title}: Website-Projekt von EvGlab`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 420px"
              style={{ objectFit: "cover", objectPosition: "top" }}
            />
          </Column>
          <Row horizontal="between" vertical="start" gap="12">
            <Column gap="4">
              <Heading as="h3" className={styles.itemTitle}>
                {ref.title}
              </Heading>
              <Text className={styles.refMeta}>{ref.category}</Text>
            </Column>
            {ref.url && (
              <SmartLink
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                unstyled
                className={styles.textLink}
                aria-label={`${ref.title} live ansehen`}
              >
                Live <span aria-hidden="true">↗</span>
              </SmartLink>
            )}
          </Row>
          {ref.quote && (
            <Text as="p" className={styles.itemBody}>
              „{ref.quote}“
            </Text>
          )}
        </Column>
      ))}
    </Grid>
  );
}
