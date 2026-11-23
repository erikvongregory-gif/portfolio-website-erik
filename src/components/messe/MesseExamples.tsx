import { Column, Grid, Heading, Text } from "@once-ui-system/core";
import { MesseFilm } from "./MesseFilm";
import styles from "./MessePage.module.scss";

export const IMAGEFILM_HLS = "https://1rna9soq8do1awe3.public.blob.vercel-storage.com/imagefilm/v1/master.m3u8";

/** The image film (adaptive stream) plus the Osmo Pocket 4P spec ad. */
export function MesseExamples() {
  return (
    <Column gap="48" fillWidth>
      <MesseFilm
        hls={IMAGEFILM_HLS}
        poster="/3d-produktanimation/images/film-poster.webp"
        label="Imagefilm von EvGlab, 60 Sekunden"
        caption="Imagefilm · 60 Sekunden · bis 4K mit 50 fps"
      />
      <Grid columns="2" m={{ columns: "1" }} gap="32" fillWidth className={styles.films}>
        <Column gap="12" className={styles.specCopy}>
          <Heading as="h3" className={styles.specTitle}>
            DJI Osmo Pocket 4P
          </Heading>
          <Text as="p" className={styles.spec}>
            3D-Produktfilm · Spec-Ad, eigenes Konzept, nicht im Auftrag von DJI
          </Text>
        </Column>
        <MesseFilm
          src="/videos/osmo-pocket.mp4"
          poster="/videos/osmo-pocket.webp"
          label="DJI Osmo Pocket 4P, 3D-Produktfilm, Spec-Ad, eigenes Konzept, nicht im Auftrag von DJI"
        />
      </Grid>
    </Column>
  );
}
