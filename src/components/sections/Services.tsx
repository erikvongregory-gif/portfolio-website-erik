"use client";

import { useRef, useState } from "react";
import { Column, Heading, Tag, Text } from "@once-ui-system/core";
import { PriceCalculator } from "@/components/PriceCalculator";
import { gsap, useGsapScene } from "@/components/motion/gsap";
import { Section } from "./Section";
import { ServicePackagesGrid } from "./ServicePackagesGrid";
import type { QuoteBase } from "@/lib/calculateQuote";
import styles from "./Services.module.scss";

const services = [
  {
    title: "Komplette Website",
    price: "ab 2.500 €",
    body: "Mehrseitiger Auftritt mit Design, Texten und Technik. Für Marken, die rundum überzeugen wollen.",
    features: ["Individuelles Design", "Bis ca. 5 Unterseiten", "Texte & SEO-Grundlagen", "Mobil & schnell"],
    featured: true,
  },
  {
    title: "Landingpage",
    price: "ab 1.500 €",
    body: "Eine Seite, ein Ziel. Conversion-fokussiert für Kampagnen, Angebote und Produkt-Launches.",
    features: ["Eine Seite, ein Ziel", "Conversion-optimiert", "Ideal für Werbung", "In 7 Tagen live"],
    featured: false,
  },
  {
    title: "Betreuung & Support",
    price: "99 € / Monat",
    body: "Updates, kleine Änderungen und Sicherheit. Deine Website bleibt aktuell, schnell und gepflegt.",
    features: ["Updates & Sicherheit", "Kleine Änderungen", "Fester Ansprechpartner", "Monatlich kündbar"],
    featured: false,
  },
  {
    title: "Individuell auf Anfrage",
    price: "Preis auf Anfrage",
    body: "CMS-Anbindung, Reservierungstool oder andere Sonderwünsche – Umfang und Budget klären wir persönlich im Gespräch.",
    features: ["CMS-System", "Reservierungstool", "Individuelle Funktionen", "Persönliche Beratung"],
    featured: false,
  },
];

const BUILD_WORD = "baue.";

const formatPrice = (n: number) => Math.round(n).toLocaleString("de-DE");

export function Services() {
  const [base, setBase] = useState<QuoteBase>("website");
  const rootRef = useRef<HTMLDivElement>(null);

  useGsapScene(rootRef, ({ motion, desktop }, scope) => {
    if (!motion) return;
    const q = gsap.utils.selector(scope);

    // ——— Kopf: Zeile steigt, „baue.“ wird Stein für Stein gebaut ———
    gsap.set(q("[data-line]"), { yPercent: 115 });
    gsap.set(q("[data-block]"), {
      yPercent: -160,
      opacity: 0,
      rotate: (i: number) => [-18, 12, -9, 15, -6][i % 5],
    });
    gsap
      .timeline({ scrollTrigger: { trigger: scope, start: "top 72%", once: true } })
      .from(q("[data-eyebrow]"), { y: 14, opacity: 0, duration: 0.6, ease: "expo.out" })
      .to(q("[data-line]"), { yPercent: 0, duration: 1, ease: "expo.out" }, 0.08)
      .to(
        q("[data-block]"),
        { yPercent: 0, opacity: 1, rotate: 0, duration: 0.9, ease: "bounce.out", stagger: 0.09 },
        0.35,
      )
      .from(q("[data-desc]"), { y: 16, opacity: 0, filter: "blur(8px)", duration: 0.9, ease: "expo.out" }, 0.45);

    // ——— Pakete: Fächer aus dem Stapel ———
    const packs = q("[data-pack]") as HTMLElement[];
    const grid = packs[0]?.parentElement;
    if (!grid || !packs.length) return;

    const tilt = [-7, -2.5, 2.5, 7];
    if (desktop) {
      gsap.fromTo(
        packs,
        {
          x: (i: number) => grid.offsetWidth / 2 - (packs[i].offsetLeft + packs[i].offsetWidth / 2),
          y: (i: number) => packs[0].offsetHeight / 2 - (packs[i].offsetTop + packs[i].offsetHeight / 2),
          rotate: (i: number) => tilt[i % tilt.length],
          scale: 0.82,
        },
        {
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          ease: "power3.inOut",
          stagger: 0.04,
          scrollTrigger: {
            trigger: grid,
            start: "top 80%",
            end: "top 15%",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        },
      );
      // Hintere Karten erst einblenden, wenn sie den Stapel weitgehend verlassen haben.
      gsap.fromTo(
        packs.slice(1),
        { opacity: 0, filter: "blur(6px)" },
        {
          opacity: 1,
          filter: "blur(0px)",
          ease: "none",
          stagger: 0.04,
          scrollTrigger: { trigger: grid, start: "top 55%", end: "top 25%", scrub: 0.8 },
        },
      );
    } else {
      packs.forEach((pack) => {
        gsap.from(pack, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: { trigger: pack, start: "top 85%", once: true },
        });
      });
    }

    // ——— Preise zählen hoch ———
    const priceEls = q("[data-price]") as HTMLElement[];
    priceEls.forEach((el) => {
      el.dataset.original ??= el.textContent ?? "";
      const original = el.dataset.original;
      const match = original.match(/\d[\d.]*/);
      if (!match) return;
      const target = Number(match[0].replace(/\./g, ""));
      const counter = { v: 0 };
      el.textContent = original.replace(match[0], "0");
      gsap.to(counter, {
        v: target,
        duration: 1.4,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 75%", once: true },
        onUpdate: () => {
          el.textContent = original.replace(match[0], formatPrice(counter.v));
        },
      });
    });

    return () => {
      for (const el of priceEls) el.textContent = el.dataset.original ?? el.textContent;
    };
  });

  return (
    <Section id="leistungen">
      <Column ref={rootRef} fillWidth gap="48" m={{ gap: "32" }}>
        <Column gap="16" fillWidth maxWidth={42}>
          <Tag size="s" variant="neutral" data-eyebrow>
            Webdesign & Webentwicklung
          </Tag>
          <Heading
            as="h2"
            variant="display-strong-s"
            onBackground="neutral-strong"
            wrap="balance"
            style={{ letterSpacing: "-0.03em", lineHeight: 1.05 }}
          >
            <span className={styles.line}>
              <span className={styles.lineInner} data-line>
                Was ich für dich{" "}
                <Text as="span" onBackground="neutral-weak" className={styles.build} aria-label={BUILD_WORD}>
                  {BUILD_WORD.split("").map((ch, i) => (
                    <span key={i} className={styles.block} data-block aria-hidden="true">
                      {ch}
                    </span>
                  ))}
                </Text>
              </span>
            </span>
          </Heading>
          <Text variant="body-default-l" onBackground="neutral-weak" wrap="balance" data-desc>
            Transparente Richtpreise. Für individuelle Lösungen ein persönliches Gespräch.
          </Text>
        </Column>

        <ServicePackagesGrid packages={services} activeBase={base} onPickBase={setBase} />

        <PriceCalculator base={base} onBaseChange={setBase} />
      </Column>
    </Section>
  );
}
