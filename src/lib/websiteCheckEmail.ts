import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_E164,
} from "@/lib/contact";
import { SITE_URL } from "@/lib/config";

const WHATSAPP_HREF =
  "https://wa.me/4915565602176?text=" +
  encodeURIComponent("Hallo Erik, ich möchte mein Festpreis-Angebot besprechen.");

const DELIVERABLES = [
  "Schriftliches Festpreis-Angebot",
  "Passende Lösung statt Bauchgefühl",
  "Antwort innerhalb von 24 Stunden",
] as const;

export type OfferEmailInput = {
  email: string;
  name: string;
  company: string;
  goal?: string;
  budget?: string;
};

/** First token from email local-part, e.g. max.mueller@… → Max */
export function greetingNameFromEmail(email: string) {
  const local = email.split("@")[0] ?? "";
  const token = local.split(/[._+-]/)[0] ?? "";
  if (!token || token.length < 2) return null;
  if (/^(info|mail|office|kontakt|contact|hello|hallo|admin|team)$/i.test(token)) {
    return null;
  }
  return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
}

export function buildCheckConfirmationEmail(input: OfferEmailInput) {
  const displayName =
    input.name.trim().split(/\s+/)[0] || greetingNameFromEmail(input.email);
  const hello = displayName ? `Servus ${displayName},` : "Servus,";
  const logoUrl = `${SITE_URL}/evglab-logo-email.png`;
  const avatarUrl = `${SITE_URL}/images/about/erik-email.png`;
  const company = input.company.trim();

  const subject = displayName
    ? `${displayName}, dein Festpreis-Angebot zu ${company} ist unterwegs`
    : `Dein Festpreis-Angebot zu ${company} ist unterwegs`;

  const text = `${hello}

schön, dass du da bist – deine Anfrage für ein Festpreis-Angebot ist gerade bei mir eingegangen.

Firma / Projekt: ${company}
${input.goal ? `Ziel: ${input.goal}\n` : ""}${input.budget ? `Rahmen: ${input.budget}\n` : ""}
Ich schaue mir alles in Ruhe an. Innerhalb von 24 Stunden bekommst du von mir persönlich:

• ${DELIVERABLES[0]}
• ${DELIVERABLES[1]}
• ${DELIVERABLES[2]}

Du musst nichts weiter tun. Wenn etwas eilt: einfach antworten, anrufen (${CONTACT_PHONE_DISPLAY}) oder per WhatsApp schreiben:
${WHATSAPP_HREF}

Bis gleich
Erik

—
Erik von Gregory · EvgLab
Websites mit Charakter aus Landsberg am Lech
${CONTACT_EMAIL}
${CONTACT_PHONE_DISPLAY}
`;

  const deliverableRows = DELIVERABLES.map(
    (item) => `
              <tr>
                <td style="padding:0 0 10px 0;vertical-align:top;width:22px;">
                  <span style="display:inline-block;width:18px;height:18px;border-radius:999px;background:#1a3a5c;color:#7eb6ff;font-size:11px;line-height:18px;text-align:center;">✓</span>
                </td>
                <td style="padding:0 0 10px 0;color:#d4d4d4;font-size:15px;line-height:1.45;">
                  ${item}
                </td>
              </tr>`,
  ).join("");

  const metaBits = [
    input.goal ? `Ziel: ${input.goal}` : null,
    input.budget ? `Rahmen: ${input.budget}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const html = `<!DOCTYPE html>
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
              <img src="${logoUrl}" alt="EvgLab" width="120" height="auto" style="display:block;max-width:120px;height:auto;border:0;" />
            </td>
          </tr>
          <tr>
            <td style="background:#141414;border:1px solid #2a2a2a;border-radius:20px;overflow:hidden;">
              <div style="height:3px;background:linear-gradient(90deg,#4a7c59,#c49a48);line-height:3px;font-size:0;">&nbsp;</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:32px 32px 8px 32px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                      <tr>
                        <td style="vertical-align:middle;padding-right:14px;">
                          <img src="${avatarUrl}" alt="Erik von Gregory" width="48" height="48" style="display:block;width:48px;height:48px;border-radius:999px;border:2px solid #2a2a2a;object-fit:cover;" />
                        </td>
                        <td style="vertical-align:middle;">
                          <div style="color:#f5f5f5;font-size:15px;font-weight:600;line-height:1.3;">Erik von Gregory</div>
                          <div style="color:#737373;font-size:13px;line-height:1.3;padding-top:2px;">Aus Landsberg am Lech</div>
                        </td>
                      </tr>
                    </table>
                    <div style="color:#f5f5f5;font-size:22px;font-weight:600;letter-spacing:-0.03em;line-height:1.3;padding-bottom:16px;">
                      Dein Festpreis-Angebot ist unterwegs.
                    </div>
                    <div style="color:#a3a3a3;font-size:16px;line-height:1.6;padding-bottom:20px;">
                      ${hello}<br /><br />
                      schön, dass du da bist – deine Anfrage zu
                      <strong style="color:#f5f5f5;">${company}</strong>
                      ist gerade bei mir eingegangen. Ich melde mich
                      <strong style="color:#f5f5f5;">innerhalb von 24 Stunden</strong>
                      persönlich mit einem schriftlichen Festpreis.
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 32px 24px 32px;">
                    <div style="background:#0a0a0a;border:1px solid #2a2a2a;border-radius:12px;padding:14px 16px;">
                      <div style="color:#737373;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;padding-bottom:6px;">Projekt</div>
                      <div style="color:#f5f5f5;font-size:15px;">${company}</div>
                      ${metaBits ? `<div style="color:#737373;font-size:13px;padding-top:6px;">${metaBits}</div>` : ""}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 32px 8px 32px;">
                    <div style="color:#f5f5f5;font-size:14px;font-weight:600;padding-bottom:12px;">Das bekommst du von mir</div>
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                      ${deliverableRows}
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 32px 28px 32px;">
                    <div style="color:#737373;font-size:14px;line-height:1.55;">
                      Du musst nichts weiter tun. Wenn etwas eilt – antworte einfach auf diese Mail oder schreib mir kurz.
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 32px 32px 32px;" align="left">
                    <a href="${WHATSAPP_HREF}" style="display:inline-block;background:#25D366;color:#0a0a0a;font-size:14px;font-weight:600;text-decoration:none;padding:12px 20px;border-radius:10px;">
                      Per WhatsApp schreiben
                    </a>
                    <div style="color:#525252;font-size:12px;padding-top:12px;">
                      oder anrufen: <a href="tel:${CONTACT_PHONE_E164}" style="color:#a3a3a3;text-decoration:none;">${CONTACT_PHONE_DISPLAY}</a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="border-top:1px solid #2a2a2a;padding:24px 32px 28px 32px;">
                    <div style="color:#f5f5f5;font-size:15px;line-height:1.5;">
                      Bis gleich<br />
                      <strong>Erik</strong>
                    </div>
                    <div style="color:#525252;font-size:12px;line-height:1.5;padding-top:10px;">
                      Erik von Gregory · EvgLab<br />
                      Websites mit Charakter aus Landsberg am Lech<br />
                      <a href="mailto:${CONTACT_EMAIL}" style="color:#737373;text-decoration:none;">${CONTACT_EMAIL}</a>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:24px 8px 0 8px;color:#404040;font-size:11px;line-height:1.5;">
              Du bekommst diese Mail, weil du auf
              <a href="${SITE_URL}/festpreis" style="color:#525252;text-decoration:underline;">evglab.com</a>
              ein Festpreis-Angebot angefragt hast.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, text, html };
}
