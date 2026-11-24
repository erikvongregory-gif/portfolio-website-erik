import { Column, Heading, Row, Text } from "@once-ui-system/core/components";
import Image from "next/image";
import { ContactDialog } from "@/components/ContactDialog";
import { Doodle } from "./Doodle";
import { Pickup, type Spot } from "./Pickup";
import { PixelName } from "./PixelName";
import styles from "./AboutHero.module.scss";

type Photo = {
  kind: "photo";
  src: string;
  alt: string;
  caption: string;
  tilt: number;
  desk: Spot;
  mid: Spot;
  pile: Spot;
  position?: string;
  /** Image ratio; wide shots (websites, 16:9 films) get a landscape polaroid. */
  ratio?: string;
};

type Note = {
  kind: "note";
  text: string;
  sign?: string;
  tilt: number;
  desk: Spot;
  mid: Spot;
  pile: Spot;
};

type Label = {
  kind: "label";
  text: string;
  tilt: number;
  desk: Spot;
  mid: Spot;
  pile: Spot;
};

const DESK: (Photo | Note | Label)[] = [
  {
    kind: "photo",
    src: "/images/about/erik-faq.png",
    alt: "Erik von Gregory lacht, im blauen Sakko vor heller Wand",
    caption: "Das bin ich.",
    tilt: -6,
    desk: { x: 4, y: 17 },
    mid: { x: 1, y: 2 },
    pile: { x: 2, y: 1 },
    position: "center 30%",
  },
  {
    kind: "photo",
    src: "/videos/osmo-pocket.webp",
    alt: "Standbild aus dem 3D-Produktfilm Osmo Pocket 4P (Spec-Ad): der Kamerakopf in Weiß vor Schwarz",
    caption: "Osmo Pocket 4P, 3D-Spec-Ad",
    ratio: "16 / 9",
    tilt: 5,
    desk: { x: 4, y: 60 },
    mid: { x: 26, y: 6 },
    pile: { x: 52, y: 3.5 },
  },
  {
    kind: "note",
    text: "Du sprichst immer mit mir. Nicht mit einem Junior.",
    sign: "E.",
    tilt: -3,
    desk: { x: 1.5, y: 44 },
    mid: { x: 10, y: 57 },
    pile: { x: 54, y: 29 },
  },
  {
    kind: "photo",
    src: "/images/projects/lunebraeu/hero-card.webp",
    alt: "Startseite der Website für die Brauerei Lünebräu",
    caption: "Lünebräu, Website",
    ratio: "10 / 7",
    tilt: 4,
    desk: { x: 75, y: 14 },
    mid: { x: 52, y: 1 },
    pile: { x: 3, y: 41 },
  },
  {
    kind: "photo",
    src: "/videos/ibjungen.webp",
    alt: "Standbild aus dem Imagefilm für das Ingenieurbüro Jungen",
    caption: "Ingenieurbüro Jungen, Imagefilm",
    ratio: "16 / 9",
    tilt: -5,
    desk: { x: 75, y: 60 },
    mid: { x: 77, y: 5 },
    pile: { x: 50, y: 58 },
  },
  {
    kind: "note",
    text: "In der Regel in 7 Tagen live. Entwurf vorab kostenlos.",
    tilt: 3,
    desk: { x: 84, y: 40 },
    mid: { x: 58, y: 59 },
    pile: { x: 4, y: 69 },
  },
  {
    kind: "label",
    text: "Landsberg am Lech",
    tilt: -2,
    desk: { x: 81, y: 90 },
    mid: { x: 36, y: 88 },
    pile: { x: 45, y: 91 },
  },
];

const TAGS = [
  { text: "Webdesign", tilt: -3 },
  { text: "3D-Produktfilme", tilt: 2 },
  { text: "Reels", tilt: -1.5 },
];

/**
 * About hero: a page from Erik's workbook. The name sits in a selection frame
 * that can be stretched, photos and notes lie around and can be picked up.
 */
export function AboutHero() {
  return (
    <Column
      as="section"
      data-theme="light"
      className={styles.hero}
      fillWidth
      horizontal="center"
      aria-labelledby="ueber-uns-titel"
    >
      <span className={styles.margin} aria-hidden="true" />
      <span className={styles.holes} aria-hidden="true">
        <span />
        <span />
        <span />
      </span>

      <Column className={styles.center} fillWidth horizontal="center" align="center">
        <Row className={styles.tags} gap="12" wrap horizontal="center" aria-label="Was ich mache">
          {TAGS.map((t) => (
            <Text key={t.text} className={styles.tag} style={{ transform: `rotate(${t.tilt}deg)` }}>
              {t.text}
            </Text>
          ))}
        </Row>

        <Column className={styles.nameArea} fillWidth horizontal="center">
          <PixelName />
          <Row className={styles.pullHint} gap="8" vertical="center" aria-hidden="true">
            <Doodle kind="left" className={styles.pullArrow} delay={1.1} />
            <Text className={styles.pullText}>zieh mal am Rahmen</Text>
          </Row>
        </Column>

        <Heading as="h1" id="ueber-uns-titel" className={styles.h1}>
          Ich bin Erik. Ich baue Werbematerial, das{" "}
          <span className={styles.under}>
            hängen bleibt.
            <Doodle kind="underline" className={styles.underline} delay={0.9} weight={2} />
          </span>
        </Heading>

        <Text as="p" className={styles.intro}>
          Hinter EvGlab steht eine Person: ich. Websites, 3D-Produktfilme und Reels, gestaltet,
          gebaut und geschnitten von mir. Direkt, ehrlich und ohne Umwege, aus Fuchstal bei
          Landsberg am Lech.
        </Text>

        <Row className={styles.ctaRow} gap="20" vertical="center" horizontal="center" wrap>
          <ContactDialog label="Kostenloser Entwurf" funnel idPrefix="about-hero-" />
          <Text className={styles.aside}>Antwort innerhalb von 24 Stunden.</Text>
        </Row>
      </Column>

      <Column className={styles.pile} fillWidth role="group" aria-label="Fotos und Notizen auf dem Tisch">
        {DESK.map((item, i) => {
          if (item.kind === "photo") {
            return (
              <Pickup
                key={item.src}
                label={`Foto: ${item.caption}`}
                tilt={item.tilt}
                desk={item.desk}
                mid={item.mid}
                pile={item.pile}
                className={item.ratio ? `${styles.polaroid} ${styles.polaroidWide}` : styles.polaroid}
              >
                <span className={styles.tape} aria-hidden="true" />
                <span className={styles.photo} style={item.ratio ? { aspectRatio: item.ratio } : undefined}>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    draggable={false}
                    priority={i < 4}
                    sizes="(min-width: 1200px) 16vw, (min-width: 640px) 22vw, 46vw"
                    style={{ objectFit: "cover", objectPosition: item.position ?? "center" }}
                  />
                </span>
                <Text as="span" className={styles.caption}>
                  {item.caption}
                </Text>
              </Pickup>
            );
          }
          if (item.kind === "note") {
            return (
              <Pickup
                key={item.text}
                label={`Notiz: ${item.text}`}
                tilt={item.tilt}
                desk={item.desk}
                mid={item.mid}
                pile={item.pile}
                className={styles.note}
              >
                <Text as="span" className={styles.noteText}>
                  {item.text}
                </Text>
                {item.sign && (
                  <Text as="span" className={styles.noteSign}>
                    {item.sign}
                  </Text>
                )}
              </Pickup>
            );
          }
          return (
            <Pickup
              key={item.text}
              label={`Etikett: ${item.text}`}
              tilt={item.tilt}
              desk={item.desk}
              mid={item.mid}
              pile={item.pile}
              className={styles.label}
            >
              <Row className={styles.labelInner} gap="8" vertical="center">
                <Doodle kind="pin" className={styles.labelPin} weight={1.4} />
                <Text as="span">{item.text}</Text>
              </Row>
            </Pickup>
          );
        })}
      </Column>
    </Column>
  );
}
