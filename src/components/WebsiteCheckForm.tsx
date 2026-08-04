"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Button, Column, Icon, Input, Row, Text } from "@once-ui-system/core";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
} from "@/lib/contact";
import { SITE_HOST } from "@/lib/config";
import { trackMetaLead } from "@/lib/metaPixel";
import styles from "./FormSuccess.module.scss";
import funnelStyles from "./WebsiteCheckForm.module.scss";

type Status = "idle" | "sending" | "success" | "error";
type Dir = "fwd" | "back";

const WEB3FORMS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "1b75a706-3ef0-418c-99dc-87ff0b272e99";

const WHATSAPP_URL =
  "https://wa.me/4915565602176?text=" +
  encodeURIComponent("Hallo Erik, ich möchte mein Festpreis-Angebot besprechen.");

const TOTAL_STEPS = 5;
const ADVANCE_MS = 240;

const GOALS = [
  { id: "new-website", label: "Neue Webseite" },
  { id: "landingpage", label: "Landingpage" },
  { id: "redesign", label: "Überarbeitung einer Webseite" },
  { id: "shop", label: "Online-Shop" },
  { id: "other", label: "Anderes" },
] as const;

const INDUSTRIES = [
  "Handwerk & Bau",
  "Ärzte & Gesundheit",
  "Kanzlei & Beratung",
  "Software & SaaS",
  "Gastro & Event",
  "E-Commerce",
  "Etwas anderes…",
] as const;

const BUDGETS = [
  { id: "over-5k", label: "Über 5.000 €" },
  { id: "3-5k", label: "3.000 € – 5.000 €" },
  { id: "1.5-3k", label: "1.500 € – 3.000 €" },
  { id: "under-1.5k", label: "Weniger als 1.500 €" },
] as const;

const FEATURES = [
  "WhatsApp-Button",
  "Blog / News",
  "Terminbuchung",
  "CMS (Texte selbst ändern)",
  "Mehrsprachigkeit",
  "Online-Shop",
] as const;

type GoalId = (typeof GOALS)[number]["id"];
type BudgetId = (typeof BUDGETS)[number]["id"];

type WebsiteCheckFormProps = {
  idPrefix?: string;
};

function ChoiceButton({
  selected,
  label,
  onSelect,
}: {
  selected: boolean;
  label: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={funnelStyles.choice}
      aria-pressed={selected}
      onClick={onSelect}
    >
      <Text variant="label-strong-m" onBackground="neutral-strong">
        {label}
      </Text>
      <span className={funnelStyles.choiceCheck} data-on={selected || undefined} aria-hidden="true">
        <Icon name="check" size="s" onBackground="brand-strong" />
      </span>
    </button>
  );
}

function ChipButton({
  selected,
  label,
  onToggle,
}: {
  selected: boolean;
  label: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className={funnelStyles.chip}
      aria-pressed={selected}
      onClick={onToggle}
      data-selected={selected || undefined}
    >
      <Text variant="label-default-s" onBackground="neutral-strong">
        {label}
      </Text>
    </button>
  );
}

export function WebsiteCheckForm({ idPrefix = "" }: WebsiteCheckFormProps) {
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState<Dir>("fwd");
  const [goal, setGoal] = useState<GoalId | "">("");
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [budget, setBudget] = useState<BudgetId | "">("");
  const [features, setFeatures] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goalLabel = GOALS.find((g) => g.id === goal)?.label ?? "";
  const budgetLabel = BUDGETS.find((b) => b.id === budget)?.label ?? "";

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);

  useEffect(() => {
    const id =
      step === 2 ? `${idPrefix}company` : step === 5 ? `${idPrefix}name` : null;
    if (!id) return;
    const t = window.setTimeout(() => {
      document.getElementById(id)?.focus();
    }, 280);
    return () => window.clearTimeout(t);
  }, [step, idPrefix]);

  const goTo = (next: number, direction: Dir) => {
    setError("");
    setDir(direction);
    setStep(next);
    setAdvancing(false);
  };

  const softAdvance = (next: number) => {
    if (advancing) return;
    setAdvancing(true);
    setError("");
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => goTo(next, "fwd"), ADVANCE_MS);
  };

  const toggleFeature = (feature: string) => {
    setFeatures((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature],
    );
  };

  const goNext = () => {
    if (advancing) return;
    setError("");
    if (step === 1 && !goal) {
      setError("Bitte wähle dein Ziel.");
      return;
    }
    if (step === 2 && company.trim().length < 2) {
      setError("Bitte gib Firmenname oder Projekt an.");
      return;
    }
    if (step === 3 && !budget) {
      setError("Bitte wähle einen Rahmen.");
      return;
    }
    goTo(Math.min(TOTAL_STEPS, step + 1), "fwd");
  };

  const goBack = () => {
    if (advancing) return;
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    setAdvancing(false);
    goTo(Math.max(1, step - 1), "back");
  };

  const selectGoal = (id: GoalId) => {
    setGoal(id);
    softAdvance(2);
  };

  const selectBudget = (id: BudgetId) => {
    setBudget(id);
    softAdvance(4);
  };

  const send = async () => {
    if (name.trim().length < 2) {
      setError("Bitte gib deinen Namen an.");
      return;
    }
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!validEmail) {
      setError("Bitte gib eine gültige E-Mail-Adresse an.");
      return;
    }
    if (!goal || !budget || company.trim().length < 2) {
      setError("Bitte vervollständige die vorherigen Schritte.");
      return;
    }

    setError("");
    setStatus("sending");

    const featureList = features.length > 0 ? features.join(", ") : "keine";
    const message = [
      "Festpreis-Anfrage über den Kosten-Funnel.",
      "",
      `Ziel: ${goalLabel}`,
      `Firma / Projekt: ${company.trim()}`,
      `Branche: ${industry || "—"}`,
      `Budget-Rahmen: ${budgetLabel}`,
      `Features: ${featureList}`,
      `Name: ${name.trim()}`,
      `E-Mail: ${email.trim()}`,
      `Telefon: ${phone.trim() || "—"}`,
      `Website: ${website.trim() || "—"}`,
    ].join("\n");

    try {
      const notify = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Festpreis-Anfrage: ${company.trim()} (${SITE_HOST})`,
          from_name: name.trim(),
          email: email.trim(),
          message,
          goal: goalLabel,
          company: company.trim(),
          industry: industry || "",
          budget: budgetLabel,
          features: featureList,
          phone: phone.trim(),
          website: website.trim(),
        }),
      });
      const notifyData = await notify.json();
      if (!notifyData.success) {
        setStatus("error");
        setError("Anfrage konnte nicht gesendet werden.");
        return;
      }

      let confirmed = false;
      try {
        const confirm = await fetch("/api/website-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            name: name.trim(),
            company: company.trim(),
            goal: goalLabel,
            budget: budgetLabel,
            industry: industry || undefined,
            features: features.length > 0 ? features : undefined,
            phone: phone.trim() || undefined,
            website: website.trim() || undefined,
          }),
        });
        const confirmData = await confirm.json();
        confirmed = Boolean(confirmData.confirmationSent);
      } catch {
        confirmed = false;
      }

      setConfirmationSent(confirmed);
      setStatus("success");
      trackMetaLead();
    } catch {
      setStatus("error");
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (step < TOTAL_STEPS) goNext();
    else void send();
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
              Danke! Dein Angebot kommt.
            </Text>
            <Text
              variant="body-default-m"
              onBackground="neutral-medium"
              align="center"
              wrap="balance"
            >
              {confirmationSent
                ? "Bestätigung ist unterwegs. Schriftliches Festpreis-Angebot innerhalb von 24 Stunden."
                : "Schriftliches Festpreis-Angebot innerhalb von 24 Stunden – persönlich von mir."}
            </Text>
          </Column>
        </Column>
        <Column gap="8" fillWidth className={styles.stagger}>
          <Text variant="label-default-s" onBackground="neutral-medium" align="center">
            Noch schneller per WhatsApp?
          </Text>
          <Row gap="8" wrap horizontal="center">
            <Button
              href={WHATSAPP_URL}
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
      className={funnelStyles.shell}
      fillWidth
      gap="20"
      padding="32"
      background="surface"
      border="neutral-alpha-medium"
      radius="xl"
      style={{ boxShadow: "inset 0 1px 0 var(--evg-cta-inset)" }}
    >
      <Row fillWidth horizontal="between" vertical="center" gap="12">
        <Text variant="label-default-s" onBackground="neutral-medium">
          Schritt {step} / {TOTAL_STEPS}
        </Text>
        <div className={funnelStyles.progressTrack} aria-hidden="true">
          <div
            className={funnelStyles.progressFill}
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </Row>

      <div
        key={step}
        className={funnelStyles.panel}
        data-dir={dir}
      >
        {step === 1 && (
          <Column gap="16" fillWidth>
            <Column gap="8">
              <Text variant="heading-strong-s" onBackground="neutral-strong">
                Was hast du vor?
              </Text>
              <Text variant="body-default-s" onBackground="neutral-medium">
                Wähle dein Ziel — dann zeige ich dir, was möglich ist.
              </Text>
            </Column>
            <Column gap="8" fillWidth role="radiogroup" aria-label="Ziel">
              {GOALS.map((item, index) => (
                <div
                  key={item.id}
                  className={funnelStyles.staggerItem}
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <ChoiceButton
                    selected={goal === item.id}
                    label={item.label}
                    onSelect={() => selectGoal(item.id)}
                  />
                </div>
              ))}
            </Column>
          </Column>
        )}

        {step === 2 && (
          <Column gap="16" fillWidth>
            <Column gap="8">
              <Text variant="heading-strong-s" onBackground="neutral-strong">
                Erzähl kurz von eurem Betrieb.
              </Text>
              <Text variant="body-default-s" onBackground="neutral-medium">
                So passe ich das Konzept exakt auf die Nische an.
              </Text>
            </Column>
            <Input
              id={`${idPrefix}company`}
              label="Firmenname / Projekt"
              placeholder="z. B. Müller Dachtechnik"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              onKeyDown={onKeyDown}
            />
            <Column gap="8" fillWidth>
              <Text variant="label-default-s" onBackground="neutral-medium">
                Branche (optional)
              </Text>
              <Row gap="8" wrap>
                {INDUSTRIES.map((item) => (
                  <ChipButton
                    key={item}
                    selected={industry === item}
                    label={item}
                    onToggle={() => setIndustry(industry === item ? "" : item)}
                  />
                ))}
              </Row>
            </Column>
          </Column>
        )}

        {step === 3 && (
          <Column gap="16" fillWidth>
            <Column gap="8">
              <Text variant="heading-strong-s" onBackground="neutral-strong">
                Welchen Rahmen hast du im Kopf?
              </Text>
              <Text variant="body-default-s" onBackground="neutral-medium">
                Kein Preisschild — hilft mir, die passende Lösung vorzuschlagen.
              </Text>
            </Column>
            <Column gap="8" fillWidth role="radiogroup" aria-label="Budget">
              {BUDGETS.map((item, index) => (
                <div
                  key={item.id}
                  className={funnelStyles.staggerItem}
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <ChoiceButton
                    selected={budget === item.id}
                    label={item.label}
                    onSelect={() => selectBudget(item.id)}
                  />
                </div>
              ))}
            </Column>
          </Column>
        )}

        {step === 4 && (
          <Column gap="16" fillWidth>
            <Column gap="8">
              <Text variant="heading-strong-s" onBackground="neutral-strong">
                Wichtige Features
              </Text>
              <Text variant="body-default-s" onBackground="neutral-medium">
                Was braucht die Seite unbedingt? Optional — einfach antippen.
              </Text>
            </Column>
            <Row gap="8" wrap>
              {FEATURES.map((item) => (
                <ChipButton
                  key={item}
                  selected={features.includes(item)}
                  label={item}
                  onToggle={() => toggleFeature(item)}
                />
              ))}
            </Row>
          </Column>
        )}

        {step === 5 && (
          <Column gap="16" fillWidth>
            <Column gap="8">
              <Text variant="heading-strong-s" onBackground="neutral-strong">
                Wohin schicken wir das Angebot?
              </Text>
              <Text variant="body-default-s" onBackground="neutral-medium">
                Schriftlicher Festpreis innerhalb von 24 Stunden.
              </Text>
            </Column>
            <Input
              id={`${idPrefix}name`}
              label="Name *"
              placeholder="Max Mustermann"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={onKeyDown}
            />
            <Input
              id={`${idPrefix}email`}
              type="email"
              label="E-Mail *"
              placeholder="name@firma.de"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={onKeyDown}
            />
            <Input
              id={`${idPrefix}phone`}
              type="tel"
              label="Telefon"
              placeholder="0156 …"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={onKeyDown}
            />
            <Input
              id={`${idPrefix}website`}
              type="url"
              label="Aktuelle Website (falls vorhanden)"
              placeholder="www.firma.de"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              onKeyDown={onKeyDown}
            />
          </Column>
        )}
      </div>

      {error && (
        <Text className={funnelStyles.error} variant="body-default-s" onBackground="danger-weak">
          {error}
        </Text>
      )}
      {status === "error" && !error && (
        <Text variant="body-default-s" onBackground="danger-weak">
          Senden hat nicht geklappt. Versuch es erneut oder schreib an {CONTACT_EMAIL}.
        </Text>
      )}

      {step > 1 && (
        <Row fillWidth gap="8" horizontal="between" className={funnelStyles.nav}>
          <Button variant="tertiary" size="m" onClick={goBack} disabled={advancing}>
            Zurück
          </Button>
          {step < TOTAL_STEPS ? (
            <Button
              variant="primary"
              size="m"
              arrowIcon
              onClick={goNext}
              disabled={advancing}
            >
              Weiter
            </Button>
          ) : (
            <Button
              variant="primary"
              size="m"
              arrowIcon={status !== "sending"}
              loading={status === "sending"}
              disabled={status === "sending"}
              onClick={() => void send()}
            >
              {status === "sending" ? "Wird gesendet…" : "Festpreis-Angebot anfordern"}
            </Button>
          )}
        </Row>
      )}

      <Text variant="label-default-xs" onBackground="neutral-medium" align="center">
        Unverbindlich · Antwort in 24h · Kein Abo
      </Text>
    </Column>
  );
}
