import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_E164,
} from "@/lib/contact";
import { SITE_URL } from "@/lib/config";

const WHATSAPP_HREF =
  "https://wa.me/4915565602176?text=" +
  encodeURIComponent("Hallo Erik, ich habe den Website-Check angefragt.");

const DELIVERABLES = [
  "Was dich gerade Kunden kostet",
  "Was sofort besser gehen würde",
  "Klare nächste Schritte – ohne Verkaufsdruck",
] as const;

export function websiteHostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** First token from email local-part, e.g. max.mueller@… → Max */
export function greetingNameFromEmail(email: string) {
  const local = email.split("@")[0] ?? "";
  const token = local.split(/[._+-]/)[0] ?? "";
  if (!token || token.length < 2) return null;
  // Skip generic local-parts that feel impersonal as a greeting
  if (/^(info|mail|office|kontakt|contact|hello|hallo|admin|team)$/i.test(token)) {
    return null;
  }
  return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
}

export function buildCheckConfirmationEmail(websiteUrl: string, email: string) {
  const host = websiteHostname(websiteUrl);
  const name = greetingNameFromEmail(email);
  const hello = name ? `Hallo ${name},` : "Hallo,";
  const logoUrl = `${SITE_URL}/evglab-logo-email.png`;
  // Small PNG crop – email clients + bandwidth friendly
  const avatarUrl = `${SITE_URL}/images/about/erik-email.png`;

  const subject = name
    ? `${name}, dein Website-Check zu ${host} ist bei mir`
    : `Dein Website-Check zu ${host} ist bei mir`;

  const text = `${hello}

schön, dass du da bist – deine Anfrage für den kostenlosen Website-Check ist gerade bei mir eingegangen.

Website: ${websiteUrl}

Ich schaue mir ${host} in Ruhe an. Innerhalb von 24 Stunden bekommst du von mir persönlich eine ehrliche Einschätzung zu:

• ${DELIVERABLES[0]}
• ${DELIVERABLES[1]}
• ${DELIVERABLES[2]}

Du musst nichts weiter tun. Wenn du zwischendurch schon was klären willst: einfach antworten, anrufen (${CONTACT_PHONE_DISPLAY}) oder per WhatsApp schreiben:
${WHATSAPP_HREF}

Bis gleich
Erik

—
Erik von Gregory · EvgLab
Websites mit Charakter, die Anfragen bringen
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

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <img src="${logoUrl}" alt="EvgLab" width="120" height="auto" style="display:block;max-width:120px;height:auto;border:0;" />
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#141414;border:1px solid #2a2a2a;border-radius:20px;overflow:hidden;">

              <!-- Accent bar -->
              <div style="height:3px;background:linear-gradient(90deg,#3b82f6,#60a5fa);line-height:3px;font-size:0;">&nbsp;</div>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:0;">
                <tr>
                  <td style="padding:32px 32px 8px 32px;">

                    <!-- Avatar + greeting -->
                    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                      <tr>
                        <td style="vertical-align:middle;padding-right:14px;">
                          <img src="${avatarUrl}" alt="Erik von Gregory" width="48" height="48" style="display:block;width:48px;height:48px;border-radius:999px;border:2px solid #2a2a2a;object-fit:cover;" />
                        </td>
                        <td style="vertical-align:middle;">
                          <div style="color:#f5f5f5;font-size:15px;font-weight:600;line-height:1.3;">Erik von Gregory</div>
                          <div style="color:#737373;font-size:13px;line-height:1.3;padding-top:2px;">Persönlich von EvgLab</div>
                        </td>
                      </tr>
                    </table>

                    <div style="color:#f5f5f5;font-size:22px;font-weight:600;letter-spacing:-0.03em;line-height:1.3;padding-bottom:16px;">
                      Dein Website-Check ist bei mir.
                    </div>

                    <div style="color:#a3a3a3;font-size:16px;line-height:1.6;padding-bottom:20px;">
                      ${hello}<br /><br />
                      schön, dass du da bist – deine Anfrage ist gerade bei mir eingegangen. Ich schaue mir
                      <strong style="color:#f5f5f5;">${host}</strong>
                      in Ruhe an und melde mich
                      <strong style="color:#f5f5f5;">innerhalb von 24 Stunden</strong>
                      persönlich bei dir.
                    </div>
                  </td>
                </tr>

                <!-- Website pill -->
                <tr>
                  <td style="padding:0 32px 24px 32px;">
                    <div style="background:#0a0a0a;border:1px solid #2a2a2a;border-radius:12px;padding:14px 16px;">
                      <div style="color:#737373;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;padding-bottom:6px;">Deine Website</div>
                      <a href="${websiteUrl}" style="color:#93c5fd;font-size:15px;text-decoration:none;word-break:break-all;">${host}</a>
                    </div>
                  </td>
                </tr>

                <!-- What you'll get -->
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

                <!-- WhatsApp CTA -->
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

                <!-- Signature -->
                <tr>
                  <td style="border-top:1px solid #2a2a2a;padding:24px 32px 28px 32px;">
                    <div style="color:#f5f5f5;font-size:15px;line-height:1.5;">
                      Bis gleich<br />
                      <strong>Erik</strong>
                    </div>
                    <div style="color:#525252;font-size:12px;line-height:1.5;padding-top:10px;">
                      Erik von Gregory · EvgLab<br />
                      Websites mit Charakter, die Anfragen bringen<br />
                      <a href="mailto:${CONTACT_EMAIL}" style="color:#737373;text-decoration:none;">${CONTACT_EMAIL}</a>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:24px 8px 0 8px;color:#404040;font-size:11px;line-height:1.5;">
              Du bekommst diese Mail, weil du auf
              <a href="${SITE_URL}/website-check" style="color:#525252;text-decoration:underline;">evglab.com</a>
              den kostenlosen Website-Check angefragt hast.
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
