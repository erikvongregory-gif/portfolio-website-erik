import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY } from "@/lib/contact";

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
  return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
}

export function buildCheckConfirmationEmail(websiteUrl: string, email: string) {
  const host = websiteHostname(websiteUrl);
  const name = greetingNameFromEmail(email);
  const hello = name ? `Hallo ${name},` : "Hallo,";

  const subject = `Dein Website-Check zu ${host} ist angekommen`;

  const text = `${hello}

deine Anfrage für den kostenlosen Website-Check ist bei mir eingegangen.

Website: ${websiteUrl}

Ich schaue mir deine Seite in Ruhe an und melde mich innerhalb von 24 Stunden persönlich bei dir - mit einer ehrlichen Einschätzung, was dich Kunden kostet und was sofort besser geht.

Du musst nichts weiter tun. Wenn es eilt, erreichst du mich auch unter ${CONTACT_PHONE_DISPLAY} oder per WhatsApp.

Viele Grüße
Erik

Erik EvgLab
Webdesign & Webentwicklung
${CONTACT_EMAIL}
`;

  const html = `<!DOCTYPE html>
<html lang="de">
<body style="margin:0;padding:0;background:#0c0c0c;font-family:Geist,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0c0c0c;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#161616;border:1px solid #2a2a2a;border-radius:16px;padding:32px;">
          <tr>
            <td style="color:#f5f5f5;font-size:22px;font-weight:600;letter-spacing:-0.02em;padding-bottom:16px;">
              Dein Website-Check ist angekommen
            </td>
          </tr>
          <tr>
            <td style="color:#a3a3a3;font-size:16px;line-height:1.55;padding-bottom:20px;">
              ${hello}<br /><br />
              deine Anfrage für den kostenlosen Website-Check ist bei mir eingegangen.
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:24px;">
              <div style="background:#0c0c0c;border:1px solid #2a2a2a;border-radius:12px;padding:14px 16px;color:#e5e5e5;font-size:14px;">
                Website: <a href="${websiteUrl}" style="color:#f5f5f5;text-decoration:underline;">${host}</a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="color:#a3a3a3;font-size:16px;line-height:1.55;padding-bottom:24px;">
              Ich schaue mir deine Seite in Ruhe an und melde mich
              <strong style="color:#f5f5f5;">innerhalb von 24 Stunden</strong>
              persönlich bei dir - mit einer ehrlichen Einschätzung, was dich Kunden kostet und was sofort besser geht.
            </td>
          </tr>
          <tr>
            <td style="color:#737373;font-size:13px;line-height:1.5;padding-bottom:24px;">
              Du musst nichts weiter tun. Wenn es eilt: ${CONTACT_PHONE_DISPLAY}
            </td>
          </tr>
          <tr>
            <td style="color:#f5f5f5;font-size:15px;line-height:1.5;">
              Viele Grüße<br />
              <strong>Erik</strong><br />
              <span style="color:#737373;font-size:13px;">Erik EvgLab · Webdesign &amp; Webentwicklung</span>
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
