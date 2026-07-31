import { NextResponse } from "next/server";
import { Resend } from "resend";
import { CONTACT_EMAIL } from "@/lib/contact";
import { buildCheckConfirmationEmail } from "@/lib/websiteCheckEmail";

const EMAIL_FROM =
  process.env.EMAIL_FROM || `Erik von Gregory <${CONTACT_EMAIL}>`;

function normalizeUrl(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

/** Sends personalized confirmation to the lead (+ optional notify to Erik). */
export async function POST(request: Request) {
  let body: { website?: string; email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const website = normalizeUrl(body.website ?? "");

  let hostOk = false;
  try {
    hostOk = Boolean(new URL(website).hostname.includes("."));
  } catch {
    hostOk = false;
  }

  if (!hostOk) {
    return NextResponse.json({ error: "Bitte eine gültige Website-Adresse angeben." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Bitte eine gültige E-Mail-Adresse angeben." }, { status: 400 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.warn("[website-check] RESEND_API_KEY fehlt");
    return NextResponse.json({ success: true, confirmationSent: false });
  }

  const resend = new Resend(resendKey);
  const mail = buildCheckConfirmationEmail(website, email);
  let confirmationSent = false;

  try {
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      replyTo: CONTACT_EMAIL,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    });
    confirmationSent = !error;
    if (error) {
      console.error("[website-check] confirmation error:", error);
    }
  } catch (err) {
    console.error("[website-check] confirmation failed:", err);
  }

  // Backup-Notify an Erik (falls Web3Forms ausfällt)
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: `Neuer Website-Check: ${website}`,
      text: `Neue Anfrage für den kostenlosen Website-Check.\n\nWebsite: ${website}\nE-Mail: ${email}\n`,
    });
  } catch (err) {
    console.error("[website-check] notify Erik failed:", err);
  }

  return NextResponse.json({ success: true, confirmationSent });
}
