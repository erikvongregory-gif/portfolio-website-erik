"use client";

import { useState } from "react";
import { Column, Dialog, Icon, Row, SegmentedControl, Text } from "@once-ui-system/core";
import {
  showreel,
  showreelCategories,
  type ShowreelCategory,
  type ShowreelItem,
} from "@/lib/showreel";
import { AutoplayVideo } from "./AutoplayVideo";
import styles from "./VideoGallery.module.scss";

type Filter = ShowreelCategory | "alle";

export function VideoGallery() {
  const [filter, setFilter] = useState<Filter>("alle");
  const [active, setActive] = useState<ShowreelItem | null>(null);

  const items = filter === "alle" ? showreel : showreel.filter((item) => item.category === filter);

  return (
    <Column fillWidth gap="32">
      <Row fillWidth horizontal="start">
        <SegmentedControl
          buttons={showreelCategories.map((c) => ({ value: c.value, label: c.label }))}
          selected={filter}
          onToggle={(value) => setFilter(value as Filter)}
          style={{ maxWidth: "100%" }}
        />
      </Row>

      <Column fillWidth className={styles.masonry}>
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={styles.card}
            style={{ aspectRatio: item.ratio }}
            onClick={() => setActive(item)}
            aria-label={`${item.title} – ${item.kind} abspielen`}
          >
            <AutoplayVideo
              src={`/videos/${item.id}-preview.mp4`}
              poster={`/videos/${item.id}.webp`}
              className={styles.media}
            />
            <span className={styles.play} aria-hidden="true">
              <Icon name="play" size="s" />
            </span>
            <span className={styles.caption}>
              <Text variant="label-strong-s">{item.title}</Text>
              <Text variant="label-default-xs" className={styles.kind}>
                {item.kind}
              </Text>
            </span>
          </button>
        ))}
      </Column>

      <Dialog
        isOpen={active !== null}
        onClose={() => setActive(null)}
        title={active ? active.title : ""}
        description={active?.kind}
        maxWidth={active?.ratio === "9 / 16" ? 26 : 56}
      >
        {active && (
          <video
            key={active.id}
            src={`/videos/${active.id}.mp4`}
            poster={`/videos/${active.id}.webp`}
            controls
            autoPlay
            playsInline
            className={styles.player}
            style={{ aspectRatio: active.ratio }}
          />
        )}
      </Dialog>
    </Column>
  );
}
