import { createHmac, timingSafeEqual } from "node:crypto";
import { CONTACT_EMAIL } from "@/lib/contact";
import { SITE_URL } from "@/lib/config";
import { greetingNameFromEmail } from "@/lib/websiteCheckEmail";

/** Double-opt-in link stays valid for 72 hours. */
const TOKEN_TTL_MS = 72 * 60 * 60 * 1000;

export const FENSTER_PDF_NAME = "Das-Playbook-hinter-meinen-Videos_EvGlab.pdf";

function secret() {
  const base = process.env.FENSTER_SECRET || process.env.RESEND_API_KEY;
  if (!base) throw new Error("FENSTER_SECRET / RESEND_API_KEY fehlt");
  return createHmac("sha256", base).update("fenster-doi").digest();
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

/** Stateless confirm token: base64url(email|expires).signature */
export function createConfirmToken(email: string) {
  const payload = Buffer.from(`${email}|${Date.now() + TOKEN_TTL_MS}`).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifyConfirmToken(token: string): string | null {
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  const [email, expires] = Buffer.from(payload, "base64url").toString("utf8").split("|");
  if (!email || Number(expires) < Date.now()) return null;
  return email;
}

function shell(subject: string, inner: string, footer: string) {
  const logoUrl = `${SITE_URL}/evglab-logo-email.png`;
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;">
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <img src="${logoUrl}" alt="EvGlab" width="120" height="auto" style="display:block;max-width:120px;height:auto;border:0;" />
            </td>
          </tr>
          <tr>
            <td style="background:#141414;border:1px solid #2a2a2a;border-radius:20px;overflow:hidden;">
              <div style="height:3px;background:linear-gradient(90deg,#4a7c59,#c49a48);line-height:3px;font-size:0;">&nbsp;</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:32px;">
                    ${inner}
                  </td>
                </tr>
                <tr>
                  <td style="border-top:1px solid #2a2a2a;padding:24px 32px 28px 32px;">
                    <div style="color:#f5f5f5;font-size:15px;line-height:1.5;">
                      Viel Spaß damit<br />
                      <strong>Erik</strong>
                    </div>
                    <div style="color:#525252;font-size:12px;line-height:1.5;padding-top:10px;">
                      Erik von Gregory · EvGlab<br />
                      <a href="mailto:${CONTACT_EMAIL}" style="color:#737373;text-decoration:none;">${CONTACT_EMAIL}</a>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:24px 8px 0 8px;color:#404040;font-size:11px;line-height:1.5;">
              ${footer}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildFensterConfirmEmail(email: string, confirmUrl: string) {
  const name = greetingNameFromEmail(email);
  const hello = name ? `Servus ${name},` : "Servus,";
  const subject = "Bitte bestätigen: dein Playbook wartet";

  const text = `${hello}

ein Klick noch, dann schicke ich dir „Das Playbook hinter meinen Videos“ als PDF:

${confirmUrl}

Der Link gilt 72 Stunden. Wenn du das nicht angefordert hast, ignorier diese Mail einfach – dann passiert nichts.

Erik
`;

  const html = shell(
    subject,
    `<div style="color:#f5f5f5;font-size:22px;font-weight:600;letter-spacing:-0.03em;line-height:1.3;padding-bottom:16px;">
                      Ein Klick noch.
                    </div>
                    <div style="color:#a3a3a3;font-size:16px;line-height:1.6;padding-bottom:24px;">
                      ${hello}<br /><br />
                      bestätige kurz deine E-Mail-Adresse, dann landet
                      <strong style="color:#f5f5f5;">„Das Playbook hinter meinen Videos“</strong>
                      direkt als PDF in deinem Postfach.
                    </div>
                    <a href="${confirmUrl}" style="display:inline-block;background:#f5f5f5;color:#0a0a0a;font-size:15px;font-weight:600;text-decoration:none;padding:14px 22px;border-radius:10px;">
                      Ja, PDF schicken
                    </a>
                    <div style="color:#525252;font-size:12px;line-height:1.5;padding-top:16px;">
                      Der Link gilt 72 Stunden. Nicht angefordert? Dann ignorier diese Mail einfach.
                    </div>`,
    "Du bekommst diese Mail, weil jemand auf evglab.com/fenster das Playbook mit dieser Adresse angefordert hat.",
  );

  return { subject, text, html };
}

export function buildFensterDeliveryEmail(email: string) {
  const name = greetingNameFromEmail(email);
  const hello = name ? `Servus ${name},` : "Servus,";
  const subject = "Dein Playbook: die 9 Secrets hinter meinen Videos";

  const text = `${hello}

danke fürs Bestätigen! Im Anhang findest du „Das Playbook hinter meinen Videos“ als PDF.

Mein Tipp: Fang mit Secret 01 an, der Regel-Datei. Die bringt am meisten.

Fragen oder Feedback? Antworte einfach auf diese Mail.

Erik
`;

  const html = shell(
    subject,
    `<div style="color:#f5f5f5;font-size:22px;font-weight:600;letter-spacing:-0.03em;line-height:1.3;padding-bottom:16px;">
                      Hier ist dein Playbook.
                    </div>
                    <div style="color:#a3a3a3;font-size:16px;line-height:1.6;padding-bottom:20px;">
                      ${hello}<br /><br />
                      danke fürs Bestätigen! Das PDF
                      <strong style="color:#f5f5f5;">„Das Playbook hinter meinen Videos“</strong>
                      hängt an dieser Mail.
                    </div>
                    <div style="background:#0a0a0a;border:1px solid #2a2a2a;border-radius:12px;padding:14px 16px;">
                      <div style="color:#737373;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;padding-bottom:6px;">Mein Tipp</div>
                      <div style="color:#d4d4d4;font-size:15px;line-height:1.5;">Fang mit Secret 01 an, der Regel-Datei. Die bringt am meisten.</div>
                    </div>
                    <div style="color:#737373;font-size:14px;line-height:1.55;padding-top:20px;">
                      Fragen oder Feedback? Antworte einfach auf diese Mail.
                    </div>`,
    "Du bekommst diese Mail, weil du das Playbook auf evglab.com/fenster angefordert und bestätigt hast.",
  );

  return { subject, text, html };
}
