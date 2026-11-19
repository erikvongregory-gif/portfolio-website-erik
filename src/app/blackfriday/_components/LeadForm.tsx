"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Button, Column, Icon, Input, Row, Text, Textarea } from "@once-ui-system/core";
import classNames from "classnames";
import {
  BF_SELECT_EVENT,
  BLACK_FRIDAY,
  BLACK_FRIDAY_PACKAGES,
  BLACK_FRIDAY_WHATSAPP_URL,
  type BlackFridayPackageId,
} from "@/lib/blackFriday";
import { CONTACT_EMAIL } from "@/lib/contact";
import { trackMetaEvent } from "@/lib/metaPixel";
import styles from "./blackfriday.module.scss";

type Status = "idle" | "sending" | "success" | "error";

const WEB3FORMS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "1b75a706-3ef0-418c-99dc-87ff0b272e99";

const CHOICES: { id: BlackFridayPackageId | "beides"; label: string; price: string }[] = [
  ...BLACK_FRIDAY_PACKAGES.map((p) => ({ id: p.id, label: p.name, price: p.priceLabel })),
  { id: "beides", label: "Noch unsicher", price: "Beratung" },
];

type GtagWindow = Window & { gtag?: (...args: unknown[]) => void };

export function LeadForm() {
  const [choice, setChoice] = useState<BlackFridayPackageId | "beides">("website");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const onSelect = (event: Event) => {
      const id = (event as CustomEvent<{ id?: BlackFridayPackageId }>).detail?.id;
      if (id) setChoice(id);
    };
    window.addEventListener(BF_SELECT_EVENT, onSelect);
    return () => window.removeEventListener(BF_SELECT_EVENT, onSelect);
  }, []);

  const selected = CHOICES.find((c) => c.id === choice) ?? CHOICES[0];

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (name.trim().length < 2) {
      setError("Bitte gib deinen Namen an.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Bitte gib eine gültige E-Mail-Adresse an.");
      return;
    }
    setError("");
    setStatus("sending");

    const message = [
      `Black-Friday-Paket: ${selected.label} (${selected.price})`,
      `Name: ${name}`,
      `E-Mail: ${email}`,
      phone ? `Telefon: ${phone}` : null,
      note ? `\nProjekt:\n${note}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Black Friday: ${selected.label} ${selected.price}`,
          from_name: name,
          email,
          phone,
          message,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error("web3forms");
      setStatus("success");
      try {
        trackMetaEvent("Lead", { content_name: `Black Friday ${selected.label}` });
        (window as GtagWindow).gtag?.("event", "generate_lead", {
          event_label: `bf_${selected.id}`,
        });
      } catch {
        /* Tracking ist optional */
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <Column className={styles.formCard} gap="20" padding="32" radius="xl" fillWidth>
        <Row className={styles.successIcon} center radius="full">
          <Icon name="check" size="m" />
        </Row>
        <Text variant="heading-strong-l" onBackground="neutral-strong">
          Dein Platz ist reserviert.
        </Text>
        <Text variant="body-default-l" onBackground="neutral-weak">
          Danke, {name.split(" ")[0]}! Ich melde mich innerhalb von 24 Stunden persönlich bei dir
          und wir besprechen deinen kostenlosen Entwurf für „{selected.label}“.
        </Text>
        <Button
          href={BLACK_FRIDAY_WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          variant="secondary"
          prefixIcon="whatsapp"
          size="m"
        >
          Schneller per WhatsApp
        </Button>
      </Column>
    );
  }

  return (
    <form onSubmit={submit} noValidate style={{ width: "100%" }}>
      <Column
        className={styles.formCard}
        gap="20"
        padding="32"
        s={{ padding: "20" }}
        radius="xl"
        fillWidth
      >
        <Column gap="8">
          <Text variant="label-strong-s" onBackground="neutral-weak">
            1. Paket wählen
          </Text>
          <Row gap="8" wrap role="radiogroup" aria-label="Paket">
            {CHOICES.map((c) => (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={choice === c.id}
                className={classNames(styles.choice, choice === c.id && styles.choiceActive)}
                onClick={() => setChoice(c.id)}
              >
                <span className={styles.choiceLabel}>{c.label}</span>
                <span className={styles.choicePrice}>{c.price}</span>
              </button>
            ))}
          </Row>
        </Column>

        <Column gap="12">
          <Text variant="label-strong-s" onBackground="neutral-weak">
            2. Kontakt
          </Text>
          <Input
            id="bf-name"
            label="Dein Name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            id="bf-email"
            type="email"
            label="E-Mail"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            id="bf-phone"
            type="tel"
            label="Telefon (optional, für einen schnellen Rückruf)"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Textarea
            id="bf-note"
            label="Was machst du? (optional)"
            placeholder="z. B. Friseursalon in Landsberg, bisher keine Website"
            lines={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Column>

        {error && (
          <Text variant="body-default-s" onBackground="danger-weak" role="alert">
            {error}
          </Text>
        )}
        {status === "error" && (
          <Text variant="body-default-s" onBackground="danger-weak" role="alert">
            Das hat nicht geklappt. Schreib mir bitte direkt an {CONTACT_EMAIL} oder per WhatsApp.
          </Text>
        )}

        <button type="submit" className={styles.ctaButton} disabled={status === "sending"}>
          <span>
            {status === "sending"
              ? "Wird gesendet …"
              : `Platz sichern: ${selected.label} ${selected.id === "beides" ? "" : selected.price}`}
          </span>
          <Icon name="arrowRight" size="s" />
        </button>

        <Column gap="8" horizontal="center" align="center">
          <Text variant="label-default-s" onBackground="neutral-weak">
            Unverbindlich · Keine Zahlung jetzt · Antwort innerhalb 24 h
          </Text>
          <Text variant="label-default-xs" onBackground="neutral-weak">
            Aktion bis {BLACK_FRIDAY.endsLabel}, Projektstart bis {BLACK_FRIDAY.startUntilLabel}{" "}
            möglich.
          </Text>
        </Column>
      </Column>
    </form>
  );
}

type SelectPackageButtonProps = {
  id: BlackFridayPackageId;
  label: string;
  highlight?: boolean;
};

/** Wählt das Paket im Formular vor und scrollt dorthin. */
export function SelectPackageButton({ id, label, highlight = false }: SelectPackageButtonProps) {
  return (
    <button
      type="button"
      className={classNames(styles.ctaButton, !highlight && styles.ctaButtonGhost)}
      onClick={() => {
        window.dispatchEvent(new CustomEvent(BF_SELECT_EVENT, { detail: { id } }));
        document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
    >
      <span>{label}</span>
      <Icon name="arrowRight" size="s" />
    </button>
  );
}

/** Scroll-Link zum Formular (Hero, Zwischen-CTAs). */
export function ScrollToFormButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className={styles.ctaButton}
      onClick={() =>
        document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    >
      <span>{label}</span>
      <Icon name="arrowRight" size="s" />
    </button>
  );
}
