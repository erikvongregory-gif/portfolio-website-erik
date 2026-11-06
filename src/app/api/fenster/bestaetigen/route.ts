import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { CONTACT_EMAIL } from "@/lib/contact";
import {
  FENSTER_PDF_NAME,
  buildFensterDeliveryEmail,
  verifyConfirmToken,
} from "@/lib/fensterLead";

const EMAIL_FROM =
  process.env.EMAIL_FROM || `Erik von Gregory <${CONTACT_EMAIL}>`;

/** Step 2 of the double opt-in: link clicked → send the PDF, save the lead. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const done = (state: string) => NextResponse.redirect(new URL(`/fenster?status=${state}`, url.origin));

  const email = verifyConfirmToken(url.searchParams.get("t") ?? "");
  if (!email) return done("abgelaufen");

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.error("[fenster] RESEND_API_KEY fehlt");
    return done("fehler");
  }
  const resend = new Resend(resendKey);

  const pdf = await readFile(path.join(process.cwd(), "private", "fenster-playbook.pdf"));
  const mail = buildFensterDeliveryEmail(email);
  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    replyTo: CONTACT_EMAIL,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
    attachments: [{ filename: FENSTER_PDF_NAME, content: pdf }],
  });
  if (error) {
    console.error("[fenster] delivery error:", error);
    return done("fehler");
  }

  // Lead list: Resend contacts (optionally inside a segment), plus a heads-up to Erik.
  try {
    const segmentId = process.env.RESEND_FENSTER_SEGMENT_ID;
    await resend.contacts.create({
      email,
      unsubscribed: false,
      ...(segmentId ? { segments: [{ id: segmentId }] } : {}),
    });
  } catch (err) {
    console.error("[fenster] contact save failed:", err);
  }
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: `Neuer Fenster-Lead: ${email}`,
      text: `${email} hat die Adresse bestätigt und das Playbook bekommen.\nZeit: ${new Date().toISOString()}`,
    });
  } catch (err) {
    console.error("[fenster] notify Erik failed:", err);
  }

  return done("bestaetigt");
}
