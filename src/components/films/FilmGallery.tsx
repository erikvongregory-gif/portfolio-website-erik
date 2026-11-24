"use client";

import { Column, Row, Text } from "@once-ui-system/core/components";
import classNames from "classnames";
import { useCallback, useRef, useState } from "react";
import { FilmCard } from "@/components/studio";
import {
  showreel,
  showreelCategories,
  type ShowreelCategory,
  type ShowreelItem,
} from "@/lib/showreel";
import { FilmLightbox } from "./FilmLightbox";
import styles from "./FilmGallery.module.scss";

type Filter = ShowreelCategory | "alle";

/** All films with a category filter; a click opens the full film with sound. */
export function FilmGallery() {
  const [filter, setFilter] = useState<Filter>("alle");
  const [active, setActive] = useState<ShowreelItem | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const items = filter === "alle" ? showreel : showreel.filter((item) => item.category === filter);

  const open = useCallback((film: ShowreelItem) => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setActive(film);
  }, []);

  const close = useCallback(() => {
    setActive(null);
    requestAnimationFrame(() => returnFocus.current?.focus());
  }, []);

  return (
    <Column fillWidth gap="32">
      <Row
        role="group"
        aria-label="Filme nach Kategorie filtern"
        className={styles.filters}
        gap="8"
        wrap
      >
        {showreelCategories.map((c) => {
          const count =
            c.value === "alle"
              ? showreel.length
              : showreel.filter((item) => item.category === c.value).length;
          return (
            <button
              key={c.value}
              type="button"
              className={classNames(styles.filter, filter === c.value && styles.filterOn)}
              aria-pressed={filter === c.value}
              onClick={() => setFilter(c.value)}
            >
              {c.label}
              <span className={styles.count}>{count}</span>
            </button>
          );
        })}
      </Row>

      <Text as="p" className={styles.status} aria-live="polite">
        {items.length} {items.length === 1 ? "Film" : "Filme"}
      </Text>

      <Column fillWidth className={styles.masonry}>
        {items.map((film) => (
          <FilmCard key={film.id} film={film} className={styles.cell} onOpen={open} />
        ))}
      </Column>

      <FilmLightbox film={active} onClose={close} films={items} onNavigate={setActive} />
    </Column>
  );
}
