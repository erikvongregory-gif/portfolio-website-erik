import { NextResponse } from "next/server";
import { Resend } from "resend";
import { CONTACT_EMAIL } from "@/lib/contact";
import { buildFensterConfirmEmail, createConfirmToken } from "@/lib/fensterLead";

const EMAIL_FROM =
  process.env.EMAIL_FROM || `Erik von Gregory <${CONTACT_EMAIL}>`;

type Body = { email?: string; consent?: boolean; company?: string };

/** Step 1 of the double opt-in: send the confirm link. */
export async function POST(request: Request) {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  // Honeypot: bots fill the hidden field, humans never see it.
  if (body.company) return NextResponse.json({ success: true });

  const email = (body.email ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
    return NextResponse.json({ error: "Bitte eine gültige E-Mail-Adresse angeben." }, { status: 400 });
  }
  if (body.consent !== true) {
    return NextResponse.json({ error: "Bitte bestätige die Einwilligung." }, { status: 400 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.error("[fenster] RESEND_API_KEY fehlt");
    return NextResponse.json({ error: "Versand gerade nicht möglich." }, { status: 500 });
  }

  const origin = new URL(request.url).origin;
  const confirmUrl = `${origin}/api/fenster/bestaetigen?t=${createConfirmToken(email)}`;
  const mail = buildFensterConfirmEmail(email, confirmUrl);

  const { error } = await new Resend(resendKey).emails.send({
    from: EMAIL_FROM,
    to: email,
    replyTo: CONTACT_EMAIL,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
  });
  if (error) {
    console.error("[fenster] confirm mail error:", error);
    return NextResponse.json({ error: "Mail konnte nicht gesendet werden." }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
