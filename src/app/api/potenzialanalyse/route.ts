import { NextResponse } from "next/server";
import { Resend } from "resend";
import { CONTACT_EMAIL } from "@/lib/contact";

/** Anfragen von evglab.com/3d-produktanimation (Potenzialanalyse, Erstgespräch …). */

const EMAIL_FROM = process.env.EMAIL_FROM || `EvGlab <${CONTACT_EMAIL}>`;
/** Vertrieb 3D-Produktfilme (Baris Basöz) bekommt jede Anfrage mit. */
const SALES_EMAIL = "kontakt@evglab.com";

const TOPICS = {
  analyse: "Potenzialanalyse",
  gespraech: "Erstgespräch",
  projekt: "Projektanfrage",
  zeitplan: "Zeitplan für die Messe",
} as const;
type Topic = keyof typeof TOPICS;

type Body = {
  topic?: string;
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  fair?: string;
  message?: string;
  website?: string; // Honeypot
  elapsed?: number; // ms seit Öffnen des Formulars
};

const clip = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(request: Request) {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  // Bots: Honeypot gefüllt oder in unter 2 s abgeschickt → still annehmen, nichts senden
  if (clip(body.website, 200) || (typeof body.elapsed === "number" && body.elapsed < 2000)) {
    return NextResponse.json({ success: true });
  }

  const topic: Topic = body.topic && body.topic in TOPICS ? (body.topic as Topic) : "analyse";
  const name = clip(body.name, 120);
  const company = clip(body.company, 160);
  const email = clip(body.email, 200).toLowerCase();
  const phone = clip(body.phone, 60);
  const fair = clip(body.fair, 160);
  const message = clip(body.message, 3000);

  if (name.length < 2) {
    return NextResponse.json({ error: "Bitte geben Sie Ihren Namen an." }, { status: 400 });
  }
  if (company.length < 2) {
    return NextResponse.json({ error: "Bitte geben Sie Ihr Unternehmen an." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Bitte geben Sie eine gültige E-Mail-Adresse an." }, { status: 400 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.error("[potenzialanalyse] RESEND_API_KEY fehlt");
    return NextResponse.json(
      { error: "Die Anfrage konnte gerade nicht gesendet werden. Bitte schreiben Sie uns an kontakt@evglab.com." },
      { status: 503 },
    );
  }
  const resend = new Resend(resendKey);
  const label = TOPICS[topic];

  // 1) Interne Benachrichtigung – muss klappen, sonst Fehler an den Besucher
  const rows: [string, string][] = [
    ["Anliegen", label],
    ["Name", name],
    ["Unternehmen", company],
    ["E-Mail", email],
    ["Telefon", phone || "—"],
    ["Nächste Messe", fair || "—"],
    ["Nachricht", message || "—"],
  ];
  const { error: notifyError } = await resend.emails.send({
    from: EMAIL_FROM,
    to: [SALES_EMAIL, CONTACT_EMAIL],
    replyTo: email,
    subject: `${label}: ${company} (3D-Produktanimation)`,
    text: [`Neue Anfrage über evglab.com/3d-produktanimation`, "", ...rows.map(([k, v]) => `${k}: ${v}`)].join("\n"),
    html: `<p>Neue Anfrage über <a href="https://evglab.com/3d-produktanimation">evglab.com/3d-produktanimation</a></p>
<table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
${rows.map(([k, v]) => `<tr><td style="color:#666;vertical-align:top">${k}</td><td style="white-space:pre-wrap">${esc(v)}</td></tr>`).join("\n")}
</table>`,
  });
  if (notifyError) {
    console.error("[potenzialanalyse] notify error:", notifyError);
    return NextResponse.json(
      { error: "Die Anfrage konnte gerade nicht gesendet werden. Bitte schreiben Sie uns an kontakt@evglab.com." },
      { status: 502 },
    );
  }

  // 2) Bestätigung an den Interessenten – Fehler hier blockieren nicht
  const first = name.split(/\s+/)[0];
  const isAnalyse = topic === "analyse";
  const next = isAnalyse
    ? "Für das Vorher-Nachher-Showvideo brauchen wir ein kurzes Video Ihres Messestands. Am einfachsten antworten Sie direkt auf diese E-Mail und hängen es an oder schicken einen Download-Link."
    : "Wir melden uns persönlich bei Ihnen, um alles Weitere abzustimmen.";
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      replyTo: SALES_EMAIL,
      subject: `Ihre Anfrage bei EvGlab: ${label}`,
      text: [
        `Hallo ${first},`,
        "",
        `danke für Ihre Anfrage (${label}). Sie ist bei uns angekommen.`,
        "",
        next,
        "",
        "Viele Grüße",
        "Baris Basöz",
        "Vertrieb 3D-Produktfilme · EvGlab",
        "+49 176 72791512 · kontakt@evglab.com",
      ].join("\n"),
      html: `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.55;color:#111">
<p>Hallo ${esc(first)},</p>
<p>danke für Ihre Anfrage (${label}). Sie ist bei uns angekommen.</p>
<p>${next}</p>
<p>Viele Grüße<br>Baris Basöz<br><span style="color:#666">Vertrieb 3D-Produktfilme · EvGlab<br>+49 176 72791512 · <a href="mailto:kontakt@evglab.com">kontakt@evglab.com</a></span></p>
</div>`,
    });
  } catch (err) {
    console.error("[potenzialanalyse] confirmation failed:", err);
  }

  return NextResponse.json({ success: true });
}
