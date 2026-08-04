import { NextResponse } from "next/server";
import { Resend } from "resend";
import { CONTACT_EMAIL } from "@/lib/contact";
import { buildCheckConfirmationEmail } from "@/lib/websiteCheckEmail";

const EMAIL_FROM =
  process.env.EMAIL_FROM || `Erik von Gregory <${CONTACT_EMAIL}>`;

type FunnelBody = {
  email?: string;
  name?: string;
  company?: string;
  goal?: string;
  budget?: string;
  industry?: string;
  features?: string[];
  phone?: string;
  website?: string;
};

/** Sends personalized confirmation to the lead (+ optional notify to Erik). */
export async function POST(request: Request) {
  let body: FunnelBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const name = (body.name ?? "").trim();
  const company = (body.company ?? "").trim();
  const goal = (body.goal ?? "").trim();
  const budget = (body.budget ?? "").trim();
  const industry = (body.industry ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const website = (body.website ?? "").trim();
  const features = Array.isArray(body.features) ? body.features : [];

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Bitte eine gültige E-Mail-Adresse angeben." }, { status: 400 });
  }
  if (name.length < 2 || company.length < 2) {
    return NextResponse.json({ error: "Name und Firma/Projekt fehlen." }, { status: 400 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.warn("[website-check] RESEND_API_KEY fehlt");
    return NextResponse.json({ success: true, confirmationSent: false });
  }

  const resend = new Resend(resendKey);
  const mail = buildCheckConfirmationEmail({
    email,
    name,
    company,
    goal,
    budget,
  });
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

  const featureList = features.length > 0 ? features.join(", ") : "—";
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: `Neue Festpreis-Anfrage: ${company}`,
      text: [
        "Neue Anfrage über den Kosten-Funnel.",
        "",
        `Name: ${name}`,
        `E-Mail: ${email}`,
        `Firma / Projekt: ${company}`,
        `Ziel: ${goal || "—"}`,
        `Budget: ${budget || "—"}`,
        `Branche: ${industry || "—"}`,
        `Features: ${featureList}`,
        `Telefon: ${phone || "—"}`,
        `Website: ${website || "—"}`,
      ].join("\n"),
    });
  } catch (err) {
    console.error("[website-check] notify Erik failed:", err);
  }

  return NextResponse.json({ success: true, confirmationSent });
}
