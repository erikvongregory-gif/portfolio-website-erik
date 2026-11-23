import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_E164,
} from "@/lib/contact";
import { SITE_URL } from "@/lib/config";

export type OfferEmailInput = {
  email: string;
  name: string;
  company: string;
  goal?: string;
  budget?: string;
  kind?: "festpreis" | "entwurf" | "film";
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
  const isFilm = input.kind === "film";
  const isDraft = input.kind === "entwurf";
  const product = isFilm ? "Film" : isDraft ? "kostenlosen Entwurf" : "Festpreis-Angebot";
  const productShort = isFilm ? "Film-Anfrage" : isDraft ? "Entwurf" : "Festpreis-Angebot";
  const whatsappHref =
    "https://wa.me/4915565602176?text=" +
    encodeURIComponent(
      isFilm
        ? "Hallo Erik, ich interessiere mich für einen Film."
        : isDraft
        ? "Hallo Erik, ich möchte den kostenlosen Entwurf besprechen."
        : "Hallo Erik, ich möchte mein Festpreis-Angebot besprechen.",
    );
  const deliverables = isFilm
    ? ([
        "Eine erste Idee für deinen Film",
        "Ehrliche Einschätzung zu Aufwand und Preis",
        "Antwort innerhalb von 24 Stunden",
      ] as const)
    : isDraft
    ? ([
        "Kostenloser Entwurf für deine Website",
        "Passende Richtung statt Bauchgefühl",
        "Antwort innerhalb von 24 Stunden",
      ] as const)
    : ([
        "Schriftliches Festpreis-Angebot",
        "Passende Lösung statt Bauchgefühl",
        "Antwort innerhalb von 24 Stunden",
      ] as const);

  const displayName =
    input.name.trim().split(/\s+/)[0] || greetingNameFromEmail(input.email);
  const hello = displayName ? `Servus ${displayName},` : "Servus,";
  const logoUrl = `${SITE_URL}/evglab-logo-email.png`;
  const avatarUrl = `${SITE_URL}/images/about/erik-email.png`;
  const company = input.company.trim();

  const subject = displayName
    ? isFilm
      ? `${displayName}, deine Film-Anfrage zu ${company} ist angekommen`
      : `${displayName}, dein ${productShort} zu ${company} ist unterwegs`
    : isFilm
      ? `Deine Film-Anfrage zu ${company} ist angekommen`
      : `Dein ${productShort} zu ${company} ist unterwegs`;

  const text = `${hello}

schön, dass du da bist – deine Anfrage für einen ${product} ist gerade bei mir eingegangen.

Firma / Projekt: ${company}
${input.goal ? `Ziel: ${input.goal}\n` : ""}${input.budget ? `Rahmen: ${input.budget}\n` : ""}
Ich schaue mir alles in Ruhe an. Innerhalb von 24 Stunden bekommst du von mir persönlich:

• ${deliverables[0]}
• ${deliverables[1]}
• ${deliverables[2]}

Du musst nichts weiter tun. Wenn etwas eilt: einfach antworten, anrufen (${CONTACT_PHONE_DISPLAY}) oder per WhatsApp schreiben:
${whatsappHref}

Bis gleich
Erik

—
Erik von Gregory · EvGlab
Websites, 3D-Filme und Reels aus Landsberg am Lech
${CONTACT_EMAIL}
${CONTACT_PHONE_DISPLAY}
`;

  const deliverableRows = deliverables
    .map(
      (item) => `
              <tr>
                <td style="padding:0 0 10px 0;vertical-align:top;width:22px;">
                  <span style="display:inline-block;width:18px;height:18px;border-radius:999px;background:#12302f;color:#8fd6e0;font-size:11px;line-height:18px;text-align:center;">✓</span>
                </td>
                <td style="padding:0 0 10px 0;color:#d6dedd;font-size:15px;line-height:1.45;">
                  ${item}
                </td>
              </tr>`,
    )
    .join("");

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
<body style="margin:0;padding:0;background:#050909;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#050909;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;">
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <img src="${logoUrl}" alt="EvGlab" width="165" height="56" style="display:block;width:165px;max-width:165px;height:auto;border:0;" />
            </td>
          </tr>
          <tr>
            <td style="background:#0a1313;border:1px solid #1c2a2a;border-radius:20px;overflow:hidden;">
              <div style="height:3px;background:linear-gradient(90deg,#ffffff,#cdeef0 55%,#8fd6e0);line-height:3px;font-size:0;">&nbsp;</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:32px 32px 8px 32px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                      <tr>
                        <td style="vertical-align:middle;padding-right:14px;">
                          <img src="${avatarUrl}" alt="Erik von Gregory" width="48" height="48" style="display:block;width:48px;height:48px;border-radius:999px;border:2px solid #1c2a2a;object-fit:cover;" />
                        </td>
                        <td style="vertical-align:middle;">
                          <div style="color:#f2f5f4;font-size:15px;font-weight:600;line-height:1.3;">Erik von Gregory</div>
                          <div style="color:#7b8786;font-size:13px;line-height:1.3;padding-top:2px;">Aus Landsberg am Lech</div>
                        </td>
                      </tr>
                    </table>
                    <div style="color:#f2f5f4;font-size:22px;font-weight:600;letter-spacing:-0.03em;line-height:1.3;padding-bottom:16px;">
                      ${isFilm ? "Deine Film-Anfrage ist angekommen." : `Dein ${productShort} ist unterwegs.`}
                    </div>
                    <div style="color:#a9b5b4;font-size:16px;line-height:1.6;padding-bottom:20px;">
                      ${hello}<br /><br />
                      schön, dass du da bist – deine Anfrage zu
                      <strong style="color:#f2f5f4;">${company}</strong>
                      ist gerade bei mir eingegangen. Ich melde mich
                      <strong style="color:#f2f5f4;">innerhalb von 24 Stunden</strong>
                      persönlich${isFilm ? " mit einer ersten Idee und einer ehrlichen Einschätzung" : ` mit einem ${product}`}.
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 32px 24px 32px;">
                    <div style="background:#050909;border:1px solid #1c2a2a;border-radius:12px;padding:14px 16px;">
                      <div style="color:#7b8786;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;padding-bottom:6px;">Projekt</div>
                      <div style="color:#f2f5f4;font-size:15px;">${company}</div>
                      ${metaBits ? `<div style="color:#7b8786;font-size:13px;padding-top:6px;">${metaBits}</div>` : ""}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 32px 8px 32px;">
                    <div style="color:#f2f5f4;font-size:14px;font-weight:600;padding-bottom:12px;">Das bekommst du von mir</div>
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                      ${deliverableRows}
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 32px 28px 32px;">
                    <div style="color:#7b8786;font-size:14px;line-height:1.55;">
                      Du musst nichts weiter tun. Wenn etwas eilt – antworte einfach auf diese Mail oder schreib mir kurz.
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 32px 32px 32px;" align="left">
                    <a href="${whatsappHref}" style="display:inline-block;background:#25D366;color:#050909;font-size:14px;font-weight:600;text-decoration:none;padding:12px 20px;border-radius:10px;">
                      Per WhatsApp schreiben
                    </a>
                    <div style="color:#5b6766;font-size:12px;padding-top:12px;">
                      oder anrufen: <a href="tel:${CONTACT_PHONE_E164}" style="color:#a9b5b4;text-decoration:none;">${CONTACT_PHONE_DISPLAY}</a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="border-top:1px solid #1c2a2a;padding:24px 32px 28px 32px;">
                    <div style="color:#f2f5f4;font-size:15px;line-height:1.5;">
                      Bis gleich<br />
                      <strong>Erik</strong>
                    </div>
                    <div style="color:#5b6766;font-size:12px;line-height:1.5;padding-top:10px;">
                      Erik von Gregory · EvGlab<br />
                      Websites, 3D-Filme und Reels aus Landsberg am Lech<br />
                      <a href="mailto:${CONTACT_EMAIL}" style="color:#7b8786;text-decoration:none;">${CONTACT_EMAIL}</a>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:24px 8px 0 8px;color:#46504f;font-size:11px;line-height:1.5;">
              Du bekommst diese Mail, weil du auf
              <a href="${SITE_URL}/" style="color:#5b6766;text-decoration:underline;">evglab.com</a>
              ${isFilm ? "einen Film" : isDraft ? "einen kostenlosen Entwurf" : "ein Festpreis-Angebot"} angefragt hast.
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
