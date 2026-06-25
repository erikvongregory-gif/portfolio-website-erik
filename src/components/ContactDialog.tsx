"use client";

import { useEffect, useState } from "react";
import { Button, Column, Dialog, Input, Row, Text, Textarea } from "@once-ui-system/core";
import { startLenis, stopLenis } from "@/components/motion/SmoothScroll";

type ContactDialogProps = {
  label?: string;
  variant?: "primary" | "secondary" | "tertiary";
  size?: "s" | "m" | "l";
  arrowIcon?: boolean;
  fillWidth?: boolean;
};

export function ContactDialog({
  label = "Kostenlos anfragen",
  variant = "primary",
  size = "m",
  arrowIcon = true,
  fillWidth = false,
}: ContactDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Pause Lenis smooth scrolling while the modal is open (the dialog already
  // locks body overflow, but Lenis hijacks the wheel and would keep scrolling).
  useEffect(() => {
    if (!open) return;
    stopLenis();
    return () => startLenis();
  }, [open]);

  const send = () => {
    const subject = `Anfrage Erstgespräch${name ? ` – ${name}` : ""}`;
    const body = `Name: ${name}\nE-Mail: ${email}\n\n${message}`;
    window.location.href = `mailto:info@evglab.com?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    setOpen(false);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        arrowIcon={arrowIcon}
        fillWidth={fillWidth}
        onClick={() => setOpen(true)}
      >
        {label}
      </Button>

      <Dialog
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Kostenloses Erstgespräch"
        description="Kostenlos & unverbindlich · Antwort innerhalb von 24 Stunden."
        footer={
          <>
            <Button variant="tertiary" size="m" onClick={() => setOpen(false)}>
              Abbrechen
            </Button>
            <Button variant="primary" size="m" arrowIcon onClick={send}>
              Anfrage senden
            </Button>
          </>
        }
      >
        <Column gap="16" fillWidth>
          <Input
            id="contact-name"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            id="contact-email"
            type="email"
            label="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Textarea
            id="contact-message"
            label="Worum geht's? (Projekt, Branche, Ziel)"
            lines={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

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
      </Dialog>
    </>
  );
}
