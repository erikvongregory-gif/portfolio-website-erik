"use client";

import { useEffect, useState } from "react";
import { Button, Column, Dialog, Icon, Input, Row, Text, Textarea } from "@once-ui-system/core";
import { startLenis, stopLenis } from "@/components/motion/SmoothScroll";
import {
  OPEN_CONTACT_EVENT,
  QUOTE_MESSAGE_STORAGE_KEY,
  registerContactOpenHandler,
} from "@/lib/quoteContact";

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
  const [name, setName] = useState("");
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
    const subject = `Anfrage Erstgespräch${name ? ` – ${name}` : ""}`;
    const body = `Name: ${name}\nE-Mail: ${email}\n\n${message}`;
    window.location.href = `mailto:info@evglab.com?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  };

  const send = async () => {
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!validEmail) {
      setError("Bitte gib eine gültige E-Mail-Adresse an.");
      return;
    }
    if (message.trim().length < 5) {
      setError("Bitte schreib kurz, worum es geht.");
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
          subject: `Neue Anfrage über webdesign.evglab.com${name ? ` – ${name}` : ""}`,
          from_name: name || "Website-Anfrage",
          name,
          email,
          message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setName("");
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
        title={status === "success" ? "Anfrage gesendet" : "Kostenloses Erstgespräch"}
        description={
          status === "success"
            ? undefined
            : "Kostenlos & unverbindlich · Antwort innerhalb von 24 Stunden."
        }
        footer={
          status === "success" ? (
            <Button variant="primary" size="m" onClick={() => setOpen(false)}>
              Schließen
            </Button>
          ) : (
            <>
              <Button variant="tertiary" size="m" onClick={() => setOpen(false)}>
                Abbrechen
              </Button>
              <Button
                variant="primary"
                size="m"
                arrowIcon
                loading={status === "sending"}
                disabled={status === "sending"}
                onClick={send}
              >
                Anfrage senden
              </Button>
            </>
          )
        }
      >
        {status === "success" ? (
          <Column gap="16" fillWidth horizontal="center" align="center" paddingY="16">
            <Icon name="email" size="l" onBackground="brand-strong" />
            <Text variant="body-default-l" onBackground="neutral-strong" align="center" wrap="balance">
              Danke! Deine Anfrage ist angekommen.
            </Text>
            <Text variant="body-default-m" onBackground="neutral-weak" align="center" wrap="balance">
              Ich melde mich innerhalb von 24 Stunden bei dir – meist deutlich schneller.
            </Text>
          </Column>
        ) : (
          <Column gap="16" fillWidth>
            <Input
              id={`${idPrefix}contact-name`}
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              id={`${idPrefix}contact-email`}
              type="email"
              label="E-Mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Textarea
              id={`${idPrefix}contact-message`}
              label="Worum geht's? (Projekt, Branche, Ziel)"
              lines={4}
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
                Senden hat nicht geklappt. Versuch es bitte erneut oder schreib direkt an
                info@evglab.com.
              </Text>
            )}

            <Column gap="8" fillWidth paddingTop="4">
              <Text variant="label-default-s" onBackground="neutral-weak">
                Lieber direkt?
              </Text>
              <Row gap="8" wrap>
                <Button
                  href="mailto:info@evglab.com"
                  variant="secondary"
                  size="s"
                  prefixIcon="email"
                >
                  info@evglab.com
                </Button>
                <Button href="tel:+491731706012" variant="secondary" size="s">
                  0173 170 6012
                </Button>
              </Row>
            </Column>
          </Column>
        )}
      </Dialog>
    </>
  );
}
