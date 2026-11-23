import { Column, Grid, Icon, Row, SmartLink, Text } from "@once-ui-system/core";
import Image from "next/image";
import { Glow, StudioSection } from "@/components/studio";
import { LEAD_VOICE, MORE_VOICES } from "./data";
import styles from "./HomeVoices.module.scss";

/** Customer voices: one quote large, two quieter ones below. */
export function HomeVoices() {
  return (
    <StudioSection
      id="stimmen"
      kicker="Stimmen"
      title={
        <>
          Was Kunden <Glow>sagen</Glow>.
        </>
      }
    >
      <Column fillWidth gap="80" s={{ gap: "56" }}>
        <Row fillWidth gap="64" vertical="center" m={{ direction: "column", gap: "32", vertical: "start" }}>
          <Column as="figure" flex={7} gap="32" fillWidth className={styles.figure}>
            <Text as="blockquote" className={styles.lead}>
              „{LEAD_VOICE.quote}“
            </Text>
            <Row as="figcaption" gap="16" vertical="center" wrap>
              <span className={styles.stars} role="img" aria-label="5 von 5 Sternen">
                {"★★★★★"}
              </span>
              <Column gap="2">
                <Text className={styles.name}>{LEAD_VOICE.name}</Text>
                <Text className={styles.meta}>
                  {LEAD_VOICE.role} · {LEAD_VOICE.source}
                </Text>
              </Column>
            </Row>
          </Column>
          <Column flex={5} fillWidth>
            <SmartLink
              href={LEAD_VOICE.url}
              unstyled
              fillWidth
              target="_blank"
              rel="noopener noreferrer"
              className={styles.shotLink}
              aria-label={`${LEAD_VOICE.name}: Website live in neuem Tab ansehen`}
            >
              <figure className={styles.shot}>
                <Image
                  src={LEAD_VOICE.image}
                  alt={`Website von ${LEAD_VOICE.name}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 520px"
                />
                <span className={styles.result}>{LEAD_VOICE.result}</span>
              </figure>
              <Row gap="4" vertical="center" paddingTop="12" className={styles.live}>
                <Text className={styles.liveLabel}>Live ansehen</Text>
                <Icon name="arrowUpRight" size="xs" />
              </Row>
            </SmartLink>
          </Column>
        </Row>

        <Grid as="ul" columns="2" gap="40" m={{ columns: "1", gap: "32" }} fillWidth className={styles.list}>
          {MORE_VOICES.map((v) => (
            <Row as="li" key={v.name} gap="20" vertical="start" className={styles.item}>
              <span className={styles.thumb}>
                <Image src={v.image} alt="" fill sizes="64px" />
              </span>
              <Column as="figure" gap="12" className={styles.small}>
                <Text as="blockquote" className={styles.quote}>
                  „{v.quote}“
                </Text>
                <Column as="figcaption" gap="2">
                  <Text className={styles.name}>{v.name}</Text>
                  <Text className={styles.meta}>{v.meta}</Text>
                </Column>
              </Column>
            </Row>
          ))}
        </Grid>
      </Column>
    </StudioSection>
  );
}
