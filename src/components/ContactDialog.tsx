"use client";

import { useEffect, useState } from "react";
import { Button, Column, Dialog, Icon, Input, Row, Text, Textarea } from "@once-ui-system/core";
import { startLenis, stopLenis } from "@/components/motion/SmoothScroll";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  WHATSAPP_URL,
} from "@/lib/contact";
import { SITE_HOST } from "@/lib/config";
import {
  OPEN_CONTACT_EVENT,
  QUOTE_MESSAGE_STORAGE_KEY,
  registerContactOpenHandler,
} from "@/lib/quoteContact";
import styles from "./FormSuccess.module.scss";

type ContactDialogProps = {
  label?: string;
  variant?: "primary" | "secondary" | "tertiary";
  size?: "s" | "m" | "l";
  arrowIcon?: boolean;
  fillWidth?: boolean;
  /** Nur Dialog rendern (z. B. Sticky-Bar), ohne eigenen Trigger-Button. */
  dialogOnly?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  idPrefix?: string;
  /** Hero-Dialog übernimmt globalen Opener (sichtbar auf Mobile). */
  replaceGlobalHandler?: boolean;
};

type Status = "idle" | "sending" | "success" | "error";

const NEXT_STEPS = [
  "Ich lese deine Nachricht persönlich.",
  "Antwort innerhalb von 24 Stunden – oft schon früher.",
  "Im kurzen Gespräch klären wir, ob und wie wir starten.",
] as const;

// Web3Forms access keys are public by design (they live in the client form).
// Falls back to the hardcoded key if the env var isn't set.
const WEB3FORMS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "1b75a706-3ef0-418c-99dc-87ff0b272e99";

export function ContactDialog({
  label = "Kostenlos anfragen",
  variant = "primary",
  size = "m",
  arrowIcon = true,
  fillWidth = false,
  dialogOnly = false,
  open: openProp,
  onOpenChange,
  idPrefix = "",
  replaceGlobalHandler = false,
}: ContactDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;

  const setOpen = (next: boolean) => {
    if (isControlled) onOpenChange?.(next);
    else setInternalOpen(next);
  };
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  // Pause Lenis smooth scrolling while the modal is open (the dialog already
  // locks body overflow, but Lenis hijacks the wheel and would keep scrolling).
  useEffect(() => {
    if (!open) return;
    setStatus("idle");
    setError("");
    stopLenis();
    return () => startLenis();
  }, [open]);

  useEffect(() => {
    if (dialogOnly) return;

    const openDialog = (message?: string) => {
      if (message) setMessage(message);
      setOpen(true);
    };

    const unregister = registerContactOpenHandler(openDialog, replaceGlobalHandler);
    if (!unregister) return;

    const onOpenContact = (event: Event) => {
      const detail = (event as CustomEvent<{ message?: string }>).detail;
      const stored = sessionStorage.getItem(QUOTE_MESSAGE_STORAGE_KEY);
      const nextMessage = detail?.message ?? stored ?? undefined;
      if (stored) sessionStorage.removeItem(QUOTE_MESSAGE_STORAGE_KEY);
      openDialog(nextMessage);
    };

    window.addEventListener(OPEN_CONTACT_EVENT, onOpenContact);
    return () => {
      unregister();
      window.removeEventListener(OPEN_CONTACT_EVENT, onOpenContact);
    };
  }, [dialogOnly, replaceGlobalHandler]);

  const mailtoFallback = () => {
    const subject = "Anfrage Erstgespräch";
    const body = `E-Mail: ${email}\n\n${message}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  };

  const send = async () => {
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!validEmail) {
      setError("Bitte gib eine gültige E-Mail-Adresse an.");
      return;
    }
    if (message.trim().length < 3) {
      setError("Schreib kurz, worum es geht – ein Satz reicht.");
      return;
    }
    setError("");

    // No mail service configured yet → open the visitor's mail client instead.
    if (!WEB3FORMS_KEY) {
      mailtoFallback();
      setOpen(false);
      return;
    }

    try {
      setStatus("sending");
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Neue Anfrage über ${SITE_HOST}`,
          from_name: email.split("@")[0] || "Website-Anfrage",
          email,
          message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      {!dialogOnly && (
        <Button
          variant={variant}
          size={size}
          arrowIcon={arrowIcon}
          fillWidth={fillWidth}
          data-open-contact=""
          onClick={() => setOpen(true)}
        >
          {label}
        </Button>
      )}

      <Dialog
        isOpen={open}
        onClose={() => setOpen(false)}
        title={status === "success" ? "Geschafft" : "Kostenloses Erstgespräch"}
        description={
          status === "success"
            ? undefined
            : "Zwei Felder reichen. Antwort innerhalb von 24 Stunden."
        }
        footer={
          status === "success" ? (
            <Button variant="primary" size="m" onClick={() => setOpen(false)}>
              Alles klar
            </Button>
          ) : (
            <>
              <Button variant="tertiary" size="m" onClick={() => setOpen(false)}>
                Abbrechen
              </Button>
              <Button
                variant="primary"
                size="m"
                arrowIcon={status !== "sending"}
                loading={status === "sending"}
                disabled={status === "sending"}
                onClick={send}
              >
                {status === "sending" ? "Wird gesendet…" : "Absenden"}
              </Button>
            </>
          )
        }
      >
        {status === "success" ? (
          <Column gap="24" fillWidth paddingY="8" className={styles.success}>
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
                <Text
                  variant="heading-strong-s"
                  onBackground="neutral-strong"
                  align="center"
                  wrap="balance"
                >
                  Deine Anfrage ist bei mir.
                </Text>
                <Text
                  variant="body-default-m"
                  onBackground="neutral-weak"
                  align="center"
                  wrap="balance"
                >
                  Danke – ich melde mich persönlich bei dir.
                </Text>
              </Column>
            </Column>

            <Column gap="12" fillWidth className={styles.stagger}>
              <Text variant="label-strong-s" onBackground="neutral-strong">
                Was als Nächstes passiert
              </Text>
              {NEXT_STEPS.map((step) => (
                <Row key={step} gap="12" vertical="start" fillWidth>
                  <Icon
                    name="check"
                    size="s"
                    onBackground="brand-strong"
                    style={{ flexShrink: 0, marginTop: "0.15rem" }}
                  />
                  <Text variant="body-default-m" onBackground="neutral-medium" wrap="balance">
                    {step}
                  </Text>
                </Row>
              ))}
            </Column>

            <Column gap="8" fillWidth paddingTop="4">
              <Text variant="label-default-s" onBackground="neutral-weak">
                Noch schneller? Schreib oder ruf kurz durch.
              </Text>
              <Row gap="8" wrap>
                <Button
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                  size="s"
                  prefixIcon="whatsapp"
                >
                  WhatsApp
                </Button>
                <Button href={CONTACT_PHONE_TEL} variant="secondary" size="s">
                  {CONTACT_PHONE_DISPLAY}
                </Button>
              </Row>
            </Column>
          </Column>
        ) : (
          <Column gap="16" fillWidth>
            <Row gap="8" wrap>
              <Button
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                size="m"
                prefixIcon="whatsapp"
              >
                WhatsApp
              </Button>
              <Button href={CONTACT_PHONE_TEL} variant="secondary" size="m">
                Anrufen
              </Button>
            </Row>

            <Text variant="label-default-s" onBackground="neutral-weak">
              Oder kurz schreiben – Antwort in 24 h
            </Text>

            <Input
              id={`${idPrefix}contact-email`}
              type="email"
              label="E-Mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Textarea
              id={`${idPrefix}contact-message`}
              label="Worum geht’s?"
              placeholder="z. B. neue Website / Landingpage für …"
              lines={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            {error && (
              <Text variant="body-default-s" onBackground="danger-weak">
                {error}
              </Text>
            )}
            {status === "error" && (
              <Text variant="body-default-s" onBackground="danger-weak">
                Senden hat nicht geklappt. Versuch es erneut, nutze WhatsApp oder schreib an{" "}
                {CONTACT_EMAIL}.
              </Text>
            )}
          </Column>
        )}
      </Dialog>
    </>
  );
}
