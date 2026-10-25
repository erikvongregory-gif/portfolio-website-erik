"use client";

import { useState, type FormEvent } from "react";
import styles from "./fenster.module.scss";

type Status = "idle" | "sending" | "sent" | "error";

export default function FensterForm() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/fenster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent, company }),
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
      <div className={styles.notice}>
        <strong>Fast geschafft – check dein Postfach.</strong>
        <span>
          Ich habe dir eine Mail an <b>{email}</b> geschickt. Klick dort auf „Ja, PDF schicken“, dann
          kommt das Playbook sofort.
        </span>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <input
        className={styles.input}
        type="email"
        required
        autoComplete="email"
        inputMode="email"
        placeholder="deine@email.de"
        aria-label="E-Mail-Adresse"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
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
      <label className={styles.consent}>
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
        />
        <span>
          Schick mir das PDF und gelegentlich Tipps zu KI-Videos per E-Mail. Abmelden geht jederzeit.
          Mehr in der <a href="/datenschutz">Datenschutzerklärung</a>.
        </span>
      </label>
      <button className={styles.button} type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Wird gesendet …" : "PDF kostenlos anfordern"}
      </button>
      {status === "error" && <p className={styles.error}>{error}</p>}
    </form>
  );
}
