"use client";

import { useState, type KeyboardEvent } from "react";
import { Button, Column, Icon, Input, Row, Text } from "@once-ui-system/core";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
} from "@/lib/contact";
import { SITE_HOST } from "@/lib/config";
import { trackMetaLead } from "@/lib/metaPixel";
import styles from "./FormSuccess.module.scss";

type Status = "idle" | "sending" | "success" | "error";

const WEB3FORMS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "1b75a706-3ef0-418c-99dc-87ff0b272e99";

const WHATSAPP_CHECK_URL =
  "https://wa.me/4915565602176?text=" +
  encodeURIComponent("Hallo Erik, ich möchte den kostenlosen Website-Check.");

const DELIVERABLES = [
  "Was dich Kunden kostet",
  "Was sofort besser geht",
  "Klare nächste Schritte",
] as const;

type WebsiteCheckFormProps = {
  idPrefix?: string;
};

function normalizeUrl(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function WebsiteCheckForm({ idPrefix = "" }: WebsiteCheckFormProps) {
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [confirmationSent, setConfirmationSent] = useState(false);

  const send = async () => {
    const url = normalizeUrl(website);
    let hostOk = false;
    try {
      const parsed = new URL(url);
      hostOk = Boolean(parsed.hostname.includes("."));
    } catch {
      hostOk = false;
    }

    if (!hostOk) {
      setError("Bitte gib deine Website-Adresse ein (z. B. www.firma.de).");
      return;
    }

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!validEmail) {
      setError("Bitte gib eine gültige E-Mail-Adresse an.");
      return;
    }

    setError("");
    setStatus("sending");

    try {
      // 1) Anfrage an Erik (clientseitig – Web3Forms blockiert Server-IPs via Cloudflare)
      const notify = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Website-Check über ${SITE_HOST}`,
          from_name: email.split("@")[0] || "Website-Check",
          email,
          website: url,
          message: `Kostenloser Website-Check angefordert.\n\nWebsite: ${url}\nE-Mail: ${email}`,
        }),
      });
      const notifyData = await notify.json();
      if (!notifyData.success) {
        setStatus("error");
        setError("Anfrage konnte nicht gesendet werden.");
        return;
      }

      // 2) Personalisierte Bestätigung (Resend) – Fehler hier blockieren die Anfrage nicht
      let confirmed = false;
      try {
        const confirm = await fetch("/api/website-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ website: url, email }),
        });
        const confirmData = await confirm.json();
        confirmed = Boolean(confirmData.confirmationSent);
      } catch {
        confirmed = false;
      }

      setConfirmationSent(confirmed);
      setStatus("success");
      setWebsite("");
      setEmail("");
      trackMetaLead();
    } catch {
      setStatus("error");
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      void send();
    }
  };

  if (status === "success") {
    return (
      <Column
        id={`${idPrefix}check-form`}
        fillWidth
        gap="24"
        padding="32"
        background="surface"
        border="neutral-alpha-medium"
        radius="xl"
        className={styles.success}
        style={{ boxShadow: "inset 0 1px 0 var(--evg-cta-inset)" }}
      >
        <Column gap="12" fillWidth horizontal="center" align="center">
          <Row
            className={styles.iconWrap}
            horizontal="center"
            vertical="center"
            aria-hidden="true"
          >
            <Icon name="check" size="l" onBackground="brand-strong" />
          </Row>
          <Column gap="4" fillWidth horizontal="center" align="center">
            <Text variant="heading-strong-m" onBackground="neutral-strong" align="center">
              Geschafft. Dein Check ist drin.
            </Text>
            <Text
              variant="body-default-m"
              onBackground="neutral-weak"
              align="center"
              wrap="balance"
            >
              {confirmationSent
                ? "Bestätigung ist unterwegs. Ich melde mich innerhalb von 24 Stunden persönlich bei dir."
                : "Ich melde mich innerhalb von 24 Stunden persönlich – mit klaren Punkten, was dich Kunden kostet und was sich lohnt."}
            </Text>
          </Column>
        </Column>
        <Column gap="8" fillWidth className={styles.stagger}>
          <Text variant="label-default-s" onBackground="neutral-weak" align="center">
            Noch schneller per WhatsApp?
          </Text>
          <Row gap="8" wrap horizontal="center">
            <Button
              href={WHATSAPP_CHECK_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              size="m"
              prefixIcon="whatsapp"
            >
              WhatsApp schreiben
            </Button>
            <Button href={CONTACT_PHONE_TEL} variant="secondary" size="m">
              {CONTACT_PHONE_DISPLAY}
            </Button>
          </Row>
        </Column>
      </Column>
    );
  }

  return (
    <Column
      id={`${idPrefix}check-form`}
      fillWidth
      gap="16"
      padding="32"
      background="surface"
      border="neutral-alpha-medium"
      radius="xl"
      style={{ boxShadow: "inset 0 1px 0 var(--evg-cta-inset)" }}
    >
      <Column gap="8">
        <Text variant="heading-strong-s" onBackground="neutral-strong">
          Jetzt kostenlos prüfen lassen
        </Text>
        <Text variant="body-default-s" onBackground="neutral-weak">
          2 Felder. Unter 60 Sekunden. Feedback in 24h.
        </Text>
      </Column>

      <Column gap="4" fillWidth>
        {DELIVERABLES.map((item) => (
          <Row key={item} gap="8" vertical="center">
            <Icon name="check" size="xs" onBackground="brand-strong" />
            <Text variant="label-default-s" onBackground="neutral-medium">
              {item}
            </Text>
          </Row>
        ))}
      </Column>

      <Input
        id={`${idPrefix}check-website`}
        type="url"
        label="Website-URL"
        placeholder="www.deine-firma.de"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <Input
        id={`${idPrefix}check-email`}
        type="email"
        label="Deine E-Mail"
        placeholder="name@firma.de"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={onKeyDown}
      />

      {error && (
        <Text variant="body-default-s" onBackground="danger-weak">
          {error}
        </Text>
      )}
      {status === "error" && !error && (
        <Text variant="body-default-s" onBackground="danger-weak">
          Senden hat nicht geklappt. Versuch es erneut oder schreib an {CONTACT_EMAIL}.
        </Text>
      )}

      <Button
        variant="primary"
        size="l"
        arrowIcon={status !== "sending"}
        fillWidth
        loading={status === "sending"}
        disabled={status === "sending"}
        onClick={() => void send()}
      >
        {status === "sending" ? "Wird gesendet…" : "Kostenlosen Check sichern"}
      </Button>

      <Column gap="4" fillWidth horizontal="center">
        <Text variant="label-default-s" onBackground="neutral-weak" align="center">
          0 € · Kein Abo · Kein Verkaufsdruck · Kein Spam
        </Text>
        <Text variant="label-default-xs" onBackground="neutral-weak" align="center">
          Bestätigung per Mail · Erik meldet sich in 24h
        </Text>
      </Column>
    </Column>
  );
}
