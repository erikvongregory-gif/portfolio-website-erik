import type { Metadata } from "next";
import Link from "next/link";
import { CookieSettingsButton } from "@/components/CookieSettingsButton";
import FensterForm from "./FensterForm";
import styles from "./fenster.module.scss";

const title = "Das Playbook hinter meinen Videos";
const description =
  "9 Secrets aus einem Jahr täglicher KI-Arbeit: Regeln, Mix-Werte und Befehle zum Kopieren. Kostenlos als PDF.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/fenster" },
  robots: { index: false, follow: false },
};

const POINTS = [
  "9 Secrets mit echten Zahlen statt Tool-Listen",
  "Meine Mix-Werte: Stimme immer vorne",
  "Befehle zum Kopieren und meine Regel-Datei als Vorlage",
];

const STATUS = {
  bestaetigt: {
    title: "Ist unterwegs!",
    text: "Das Playbook liegt jetzt in deinem Postfach. Schau auch im Spam-Ordner nach, falls es nicht gleich da ist.",
  },
  abgelaufen: {
    title: "Link ungültig",
    text: "Der Bestätigungslink ist abgelaufen oder unvollständig. Trag deine Adresse einfach nochmal ein.",
  },
  fehler: {
    title: "Da ging was schief",
    text: "Das PDF konnte gerade nicht verschickt werden. Versuch es gleich nochmal oder schreib mir an info@evglab.com.",
  },
} as const;

export default async function Fenster({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const notice = status && status in STATUS ? STATUS[status as keyof typeof STATUS] : null;
  const showForm = !notice || status !== "bestaetigt";

  return (
    <section className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.bar} />
        <p className={styles.eyebrow}>Du hast „Fenster“ kommentiert</p>
        <h1 className={styles.title}>Das Playbook hinter meinen Videos.</h1>

        {notice && (
          <div className={styles.notice}>
            <strong>{notice.title}</strong>
            <span>{notice.text}</span>
          </div>
        )}

        {showForm && (
          <>
            <ul className={styles.points}>
              {POINTS.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <FensterForm />
          </>
        )}
      </div>

      <nav className={styles.legal} aria-label="Rechtliches">
        <Link href="/impressum">Impressum</Link>
        <Link href="/datenschutz">Datenschutz</Link>
        <CookieSettingsButton />
      </nav>
    </section>
  );
}
