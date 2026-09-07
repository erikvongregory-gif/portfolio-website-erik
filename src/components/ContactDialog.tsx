"use client";

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { Button, Column, Dialog, Icon, Input, Row, Text, Textarea } from "@once-ui-system/core";
import classNames from "classnames";
import { startLenis, stopLenis } from "@/components/motion/SmoothScroll";
import { WebsiteCheckForm } from "@/components/WebsiteCheckForm";
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
import { ShiftCta } from "@/components/ShiftCta";
import styles from "./ContactDialog.module.scss";

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
  /** Multi-step Entwurf-Funnel (wie /festpreis) statt Kurzformular. */
  funnel?: boolean;
};

type Status = "idle" | "sending" | "success" | "error";
type PanelState = "closed" | "opening" | "open" | "closing";

const CLOSE_MS = 480;

const NEXT_STEPS = [
  "Ich lese deine Nachricht persönlich.",
  "Antwort innerhalb von 24 Stunden – oft schon früher.",
  "Im kurzen Gespräch klären wir, ob und wie wir starten.",
] as const;

const WEB3FORMS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "1b75a706-3ef0-418c-99dc-87ff0b272e99";

function originFromElement(el: Element | null): { x: string; y: string } {
  if (!(el instanceof HTMLElement)) {
    const marked = document.querySelector<HTMLElement>("[data-funnel-origin]");
    if (marked) {
      marked.removeAttribute("data-funnel-origin");
      const r = marked.getBoundingClientRect();
      return { x: `${r.left + r.width / 2}px`, y: `${r.top + r.height / 2}px` };
    }
    return { x: "50%", y: "72%" };
  }
  const r = el.getBoundingClientRect();
  return { x: `${r.left + r.width / 2}px`, y: `${r.top + r.height / 2}px` };
}

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
  funnel = false,
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
  const [funnelKey, setFunnelKey] = useState(0);
  const [panel, setPanel] = useState<PanelState>("closed");
  const [origin, setOrigin] = useState({ x: "50%", y: "72%" });
  const [mounted, setMounted] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const ignoreCloseSync = useRef(false);

  const panelExpanded = panel === "open";
  const panelVisible = panel !== "closed";

  useEffect(() => {
    setMounted(true);
  }, []);

  const finishClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      setPanel("closed");
      ignoreCloseSync.current = true;
      setOpen(false);
      closeTimer.current = null;
      requestAnimationFrame(() => {
        ignoreCloseSync.current = false;
      });
    }, CLOSE_MS);
  };

  const beginOpen = (from?: Element | null) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOrigin(originFromElement(from ?? triggerRef.current));
    setFunnelKey((k) => k + 1);
    setStatus("idle");
    setError("");
    setPanel("opening");
    setOpen(true);
  };

  const beginClose = () => {
    setPanel((current) => {
      if (current !== "open" && current !== "opening") return current;
      finishClose();
      return "closing";
    });
  };

  // Controlled open/close (Sticky CTA / parent) drives the Blink panel.
  useEffect(() => {
    if (!funnel || ignoreCloseSync.current) return;
    if (open && (panel === "closed" || panel === "closing")) {
      if (closeTimer.current) {
        clearTimeout(closeTimer.current);
        closeTimer.current = null;
      }
      setOrigin(originFromElement(triggerRef.current));
      setFunnelKey((k) => k + 1);
      setPanel("opening");
    } else if (!open && (panel === "open" || panel === "opening")) {
      setPanel("closing");
      finishClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync only on open changes
  }, [open, funnel]);

  useEffect(() => {
    if (panel !== "opening") return;
    let cancelled = false;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!cancelled) setPanel("open");
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, [panel]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  useEffect(() => {
    if (funnel) {
      if (panel !== "open" && panel !== "opening") return;
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      stopLenis();
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") beginClose();
      };
      window.addEventListener("keydown", onKeyDown);
      return () => {
        document.body.style.overflow = previousOverflow;
        window.removeEventListener("keydown", onKeyDown);
        startLenis();
      };
    }

    if (!open) return;
    setStatus("idle");
    setError("");
    stopLenis();
    return () => startLenis();
  }, [funnel, panel, open]);

  useEffect(() => {
    if (dialogOnly) return;

    const openDialog = (nextMessage?: string) => {
      if (nextMessage) setMessage(nextMessage);
      if (funnel) beginOpen();
      else setOpen(true);
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
  }, [dialogOnly, replaceGlobalHandler, funnel]);

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

  const onTriggerClick = (e: MouseEvent<HTMLElement>) => {
    triggerRef.current = e.currentTarget;
    if (funnel) beginOpen(e.currentTarget);
    else setOpen(true);
  };

  const funnelOverlay =
    funnel && mounted && panelVisible
      ? createPortal(
          <div
            id={`${idPrefix}entwurf-funnel`}
            className={classNames(
              styles.overlay,
              panelExpanded && styles.overlayOpen,
              panel === "closing" && styles.overlayClosing,
            )}
            style={{ "--ox": origin.x, "--oy": origin.y } as CSSProperties}
            role="dialog"
            aria-modal="true"
            aria-label="Kostenloser Entwurf"
          >
            <Column className={styles.panel} fillWidth>
              <Row
                className={styles.topBar}
                fillWidth
                horizontal="between"
                vertical="center"
                gap="12"
              >
                <Column gap="4" style={{ minWidth: 0 }}>
                  <Text
                    className={styles.title}
                    variant="heading-strong-m"
                    onBackground="neutral-strong"
                  >
                    Kostenloser Entwurf
                  </Text>
                  <Text variant="body-default-s" onBackground="neutral-medium">
                    Ein paar kurze Fragen – dann weiß ich schon, was du brauchst.
                  </Text>
                </Column>
                <button
                  type="button"
                  className={styles.ende}
                  aria-label="Funnel schließen"
                  onClick={beginClose}
                >
                  Ende
                </button>
              </Row>

              <div className={styles.body}>
                <WebsiteCheckForm
                  key={funnelKey}
                  variant="entwurf"
                  embedded
                  idPrefix={`${idPrefix}entwurf-`}
                />
              </div>
            </Column>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      {!dialogOnly &&
        (size === "l" ? (
          <ShiftCta fillWidth={fillWidth} onClick={onTriggerClick}>
            {label}
          </ShiftCta>
        ) : (
          <Button
            variant={variant}
            size={size}
            arrowIcon={arrowIcon}
            fillWidth={fillWidth}
            data-open-contact=""
            onClick={onTriggerClick}
          >
            {label}
          </Button>
        ))}

      {funnel ? (
        funnelOverlay
      ) : (
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
            <Column gap="24" fillWidth paddingY="8" className={successStyles.success}>
              <Column gap="12" fillWidth horizontal="center" align="center">
                <Row
                  className={successStyles.iconWrap}
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

              <Column gap="12" fillWidth className={successStyles.stagger}>
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
      )}
    </>
  );
}
