"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import styles from "./fenster.module.scss";

type Status = "idle" | "sending" | "sent" | "error";
type FieldErrors = { email?: string; consent?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function FensterForm() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const emailRef = useRef<HTMLInputElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);
  const noticeRef = useRef<HTMLDivElement>(null);

  // Success replaces the form: bring the confirmation into view and announce it.
  useEffect(() => {
    if (status !== "sent") return;
    const el = noticeRef.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [status]);

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (!email.trim()) next.email = "Bitte gib deine E-Mail-Adresse ein.";
    else if (!EMAIL_RE.test(email.trim())) next.email = "Bitte prüf die E-Mail-Adresse.";
    if (!consent) next.consent = "Bitte bestätige kurz, dass ich dir das PDF schicken darf.";
    return next;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    if (errors.email || errors.consent) {
      const first = errors.email ? emailRef.current : consentRef.current;
      first?.focus({ preventScroll: true });
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/fenster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), consent, company }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Das hat nicht geklappt.");
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Das hat nicht geklappt.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div
        ref={noticeRef}
        className={`${styles.notice} ${styles.noticeSuccess}`}
        role="status"
        aria-live="polite"
        tabIndex={-1}
      >
        <strong>Fast geschafft – check dein Postfach.</strong>
        <span>
          Ich habe dir eine Mail an <b className={styles.breakable}>{email}</b> geschickt. Klick
          dort auf „Ja, PDF schicken“, dann kommt das Playbook sofort.
        </span>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="fenster-email">
          E-Mail-Adresse
        </label>
        <input
          ref={emailRef}
          id="fenster-email"
          name="email"
          className={styles.input}
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          enterKeyHint="send"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="deine@email.de"
          aria-invalid={fieldErrors.email ? true : undefined}
          aria-describedby={fieldErrors.email ? "fenster-email-error" : undefined}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldErrors.email) setFieldErrors((f) => ({ ...f, email: undefined }));
          }}
        />
        {fieldErrors.email && (
          <p id="fenster-email-error" className={styles.fieldError} role="alert">
            {fieldErrors.email}
          </p>
        )}
      </div>
      <input
        className={styles.hp}
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />
      <div className={styles.field}>
        <label className={styles.consent} data-invalid={fieldErrors.consent ? "" : undefined}>
          <input
            ref={consentRef}
            type="checkbox"
            name="consent"
            required
            checked={consent}
            aria-invalid={fieldErrors.consent ? true : undefined}
            aria-describedby={fieldErrors.consent ? "fenster-consent-error" : undefined}
            onChange={(e) => {
              setConsent(e.target.checked);
              if (fieldErrors.consent) setFieldErrors((f) => ({ ...f, consent: undefined }));
            }}
          />
          <span>
            Schick mir das PDF und gelegentlich Tipps zu KI-Videos per E-Mail. Abmelden geht
            jederzeit. Mehr in der <a href="/datenschutz">Datenschutzerklärung</a>.
          </span>
        </label>
        {fieldErrors.consent && (
          <p id="fenster-consent-error" className={styles.fieldError} role="alert">
            {fieldErrors.consent}
          </p>
        )}
      </div>
      <button className={styles.button} type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Wird gesendet …" : "PDF kostenlos anfordern"}
      </button>
      {status === "error" && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
