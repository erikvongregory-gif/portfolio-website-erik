"use client";

import { Column, Heading, Row, Text } from "@once-ui-system/core/components";
import classNames from "classnames";
import {
  createContext,
  type FormEvent,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { startLenis, stopLenis } from "@/components/motion/SmoothScroll";
import { ShiftCta } from "@/components/ShiftCta";
import styles from "./MesseRequest.module.scss";

/** Topics the API /api/potenzialanalyse accepts. */
export type MesseTopic = "analyse" | "gespraech" | "projekt" | "zeitplan";

type TopicCopy = {
  eyebrow: string;
  title: ReactNode;
  lead: string;
  submit: string;
};

const TOPICS: Record<MesseTopic, TopicCopy> = {
  analyse: {
    eyebrow: "Kostenlos und unverbindlich",
    title: (
      <>
        <strong>Potenzialanalyse</strong> anfragen
      </>
    ),
    lead: "Wir melden uns persönlich bei Ihnen. Das kurze Video Ihres Messestands schicken Sie uns danach einfach per E-Mail.",
    submit: "Potenzialanalyse anfragen",
  },
  gespraech: {
    eyebrow: "30 Minuten · kostenlos",
    title: (
      <>
        <strong>Erstgespräch</strong> vereinbaren
      </>
    ),
    lead: "Wir melden uns mit Terminvorschlägen und klären gemeinsam, welche Geschichte Ihr Produkt am Stand erzählen soll.",
    submit: "Erstgespräch anfragen",
  },
  projekt: {
    eyebrow: "Projekt anfragen",
    title: (
      <>
        Erzählen Sie uns von <strong>Ihrem Produkt</strong>
      </>
    ),
    lead: "Ein paar Eckdaten reichen. Wir melden uns persönlich und besprechen mit Ihnen den nächsten Schritt.",
    submit: "Anfrage senden",
  },
  zeitplan: {
    eyebrow: "Messe-Countdown",
    title: (
      <>
        Zeitplan für <strong>Ihre Messe</strong>
      </>
    ),
    lead: "Nennen Sie uns Ihre Messe. Wir planen rückwärts ab dem ersten Messetag und schicken Ihnen einen Zeitplan.",
    submit: "Zeitplan anfragen",
  },
};

const CLOSE_MS = 250;

type Ctx = { open: (topic: MesseTopic) => void };
const RequestContext = createContext<Ctx>({ open: () => {} });

type Trackers = {
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
};

/**
 * Request dialog for the trade-show page. Every trigger opens the same form
 * with topic-specific copy; it posts to /api/potenzialanalyse (Resend).
 * A direct link to /3d-produktanimation#anfrage opens the Potenzialanalyse.
 */
export function MesseRequestProvider({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const openedAt = useRef(0);
  const [topic, setTopic] = useState<MesseTopic>("analyse");
  const [visible, setVisible] = useState(false);
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [invalid, setInvalid] = useState<Record<string, boolean>>({});

  const open = useCallback((t: MesseTopic) => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    setTopic(TOPICS[t] ? t : "analyse");
    setDone(false);
    setError("");
    setInvalid({});
    openedAt.current = Date.now();
    if (!dlg.open) dlg.showModal();
    document.documentElement.classList.add(styles.lock);
    stopLenis();
    // Timer, not rAF: the fade must also start in a background tab.
    window.setTimeout(() => setVisible(true), 16);
    // On phones do not pop the keyboard right away.
    if (window.matchMedia("(min-width: 810px)").matches) {
      window.setTimeout(() => {
        (formRef.current?.elements.namedItem("name") as HTMLInputElement | null)?.focus();
      }, 30);
    }
  }, []);

  const unlock = useCallback(() => {
    document.documentElement.classList.remove(styles.lock);
    startLenis();
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    window.setTimeout(() => {
      if (dialogRef.current?.open) dialogRef.current.close();
      unlock();
    }, CLOSE_MS);
  }, [unlock]);

  // Safety net: never leave the page locked when the dialog goes away.
  useEffect(() => unlock, [unlock]);

  // Direct link: evglab.com/3d-produktanimation#anfrage
  useEffect(() => {
    if (window.location.hash !== "#anfrage") return;
    const id = window.setTimeout(() => open("analyse"), 600);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (done) doneRef.current?.focus();
  }, [done]);

  const validate = (form: HTMLFormElement) => {
    const next: Record<string, boolean> = {};
    let first: HTMLInputElement | null = null;
    for (const el of Array.from(form.querySelectorAll<HTMLInputElement>("[required]"))) {
      const bad = !el.checkValidity();
      next[el.name] = bad;
      if (bad && !first) first = el;
    }
    setInvalid(next);
    if (first) {
      setError(
        first.name === "email"
          ? "Bitte geben Sie eine gültige E-Mail-Adresse an."
          : "Bitte füllen Sie Name, Unternehmen und E-Mail aus.",
      );
      first.focus();
      return false;
    }
    return true;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    const form = e.currentTarget;
    setError("");
    if (!validate(form)) return;

    const data: Record<string, unknown> = Object.fromEntries(new FormData(form));
    data.topic = topic;
    data.elapsed = Date.now() - openedAt.current;

    setSending(true);
    try {
      const res = await fetch("/api/potenzialanalyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { success?: boolean; error?: string };
      if (!res.ok || !json.success) throw new Error(json.error || "Senden fehlgeschlagen.");
      setDone(true);
      form.reset();
      // Only present when the visitor consented.
      try {
        const w = window as unknown as Trackers;
        w.gtag?.("event", "generate_lead", { form: "potenzialanalyse", topic });
        w.fbq?.("track", "Lead", { content_name: topic });
      } catch {
        /* tracking must never interfere */
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      setError(
        msg && msg !== "Failed to fetch"
          ? msg
          : "Keine Verbindung. Bitte versuchen Sie es noch einmal oder schreiben Sie an kontakt@evglab.com.",
      );
    } finally {
      setSending(false);
    }
  };

  const onInput = (e: FormEvent<HTMLFormElement>) => {
    const el = e.target as HTMLInputElement;
    if (invalid[el.name] && el.checkValidity()) setInvalid((s) => ({ ...s, [el.name]: false }));
  };

  const copy = TOPICS[topic];

  return (
    <RequestContext.Provider value={{ open }}>
      {children}
      <dialog
        ref={dialogRef}
        className={classNames(styles.dialog, visible && styles.in)}
        aria-labelledby={done ? "rq-done-title" : "rq-title"}
        data-lenis-prevent=""
        data-theme="dark"
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
        onCancel={(e) => {
          // Esc: close with the fade instead of instantly.
          e.preventDefault();
          close();
        }}
        onClose={unlock}
      >
        <Column className={styles.panel} gap="24">
          <button type="button" className={styles.close} onClick={close} aria-label="Schließen">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {!done ? (
            <Column gap="24">
              <Column gap="12">
                <Text className={styles.eyebrow}>{copy.eyebrow}</Text>
                <Heading as="h2" id="rq-title" className={styles.title}>
                  {copy.title}
                </Heading>
                <Text as="p" className={styles.lead}>
                  {copy.lead}
                </Text>
              </Column>

              <form
                ref={formRef}
                className={styles.form}
                noValidate
                onSubmit={onSubmit}
                onInput={onInput}
              >
                <label className={styles.field}>
                  <span className={styles.label}>Name</span>
                  <input
                    className={styles.input}
                    name="name"
                    autoComplete="name"
                    required
                    minLength={2}
                    maxLength={120}
                    aria-invalid={invalid.name || undefined}
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>Unternehmen</span>
                  <input
                    className={styles.input}
                    name="company"
                    autoComplete="organization"
                    required
                    minLength={2}
                    maxLength={160}
                    aria-invalid={invalid.company || undefined}
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>E-Mail</span>
                  <input
                    className={styles.input}
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    required
                    maxLength={200}
                    aria-invalid={invalid.email || undefined}
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>
                    Telefon <em>(optional)</em>
                  </span>
                  <input
                    className={styles.input}
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    maxLength={60}
                  />
                </label>
                <label className={classNames(styles.field, styles.wide)}>
                  <span className={styles.label}>
                    Nächste Messe <em>(optional)</em>
                  </span>
                  <input
                    className={styles.input}
                    name="fair"
                    maxLength={160}
                    placeholder="z. B. Hannover Messe, April 2027"
                  />
                </label>
                <label className={classNames(styles.field, styles.wide)}>
                  <span className={styles.label}>
                    Ihr Produkt in ein, zwei Sätzen <em>(optional)</em>
                  </span>
                  <textarea className={styles.input} name="message" rows={3} maxLength={3000} />
                </label>
                <label className={styles.hp} aria-hidden="true">
                  Website <input name="website" tabIndex={-1} autoComplete="off" />
                </label>

                <p className={styles.error} role="alert" aria-live="polite">
                  {error}
                </p>
                <button type="submit" className={styles.submit} disabled={sending}>
                  {sending && <span className={styles.spin} aria-hidden="true" />}
                  <span>{copy.submit}</span>
                </button>
                <p className={styles.note}>
                  Wir nutzen Ihre Angaben nur, um Ihre Anfrage zu beantworten. Der Versand läuft über
                  Resend (USA). Mehr in der{" "}
                  <a href="/datenschutz" target="_blank" rel="noopener">
                    Datenschutzerklärung
                  </a>
                  .
                </p>
              </form>
            </Column>
          ) : (
            <Column ref={doneRef} gap="16" tabIndex={-1} className={styles.done}>
              <span className={styles.check} aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M5 12.5l4.5 4.5L19 7.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <Text className={styles.eyebrow}>Anfrage gesendet</Text>
              <Heading as="h2" id="rq-done-title" className={styles.title}>
                Danke, <strong>wir melden uns</strong>.
              </Heading>
              <Text as="p" className={styles.lead}>
                {topic === "analyse"
                  ? "Sie bekommen gleich eine Bestätigung per E-Mail. Antworten Sie darauf einfach mit dem Video Ihres Messestands."
                  : "Sie bekommen gleich eine Bestätigung per E-Mail. Wir melden uns persönlich bei Ihnen."}
              </Text>
              <Text as="p" className={styles.contact}>
                <strong>Baris Basöz</strong>
                <br />
                Vertrieb 3D-Produktfilme
                <br />
                <a href="tel:+4917672791512">+49 176 72791512</a> ·{" "}
                <a href="mailto:kontakt@evglab.com">kontakt@evglab.com</a>
              </Text>
              <Row>
                <button type="button" className={styles.submit} onClick={close}>
                  Schließen
                </button>
              </Row>
            </Column>
          )}
        </Column>
      </dialog>
    </RequestContext.Provider>
  );
}

type TriggerProps = {
  topic: MesseTopic;
  children: string;
  /** "primary" = the site's Shift button, "pill" = quiet glass pill, "link" = underlined text. */
  variant?: "primary" | "pill" | "link";
  className?: string;
};

/** Opens the request dialog for a topic. */
export function RequestTrigger({ topic, children, variant = "primary", className }: TriggerProps) {
  const { open } = useContext(RequestContext);
  if (variant === "primary") {
    return (
      <ShiftCta className={className} onClick={() => open(topic)}>
        {children}
      </ShiftCta>
    );
  }
  return (
    <button
      type="button"
      className={classNames(variant === "pill" ? styles.pill : styles.link, className)}
      onClick={() => open(topic)}
      aria-haspopup="dialog"
    >
      {children}
    </button>
  );
}
