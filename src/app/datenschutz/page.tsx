import type { Metadata } from "next";
import { SmartLink } from "@once-ui-system/core";
import { LegalBlock, LegalLayout, LegalSubheading, LegalText } from "@/components";
import { createPageOpenGraph, createPageTwitter } from "@/resources";

const title = "Datenschutzerklärung";
const description =
  "Informationen zur Verarbeitung personenbezogener Daten auf der Website von Erik EvgLab gemäß DSGVO.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/datenschutz" },
  openGraph: createPageOpenGraph({ title, description, path: "/datenschutz" }),
  twitter: createPageTwitter(title, description),
};

export default function Datenschutz() {
  return (
    <LegalLayout
      eyebrow="Rechtliches"
      title="Datenschutzerklärung"
      intro="Der Schutz deiner persönlichen Daten ist mir wichtig. Hier erfährst du, welche Daten beim Besuch dieser Website verarbeitet werden und welche Rechte dir zustehen."
    >
      <LegalBlock title="1. Verantwortlicher">
        <LegalText>
          Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:
        </LegalText>
        <LegalText>
          Erik Freiherr von Gregory
          <br />
          Hauptstraße 18
          <br />
          86925 Fuchstal
          <br />
          E-Mail: <SmartLink href="mailto:info@evglab.com">info@evglab.com</SmartLink>
          <br />
          Telefon: <SmartLink href="tel:+491731706012">0173 170 6012</SmartLink>
        </LegalText>
        <LegalText>
          Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder
          gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen
          Daten entscheidet.
        </LegalText>
      </LegalBlock>

      <LegalBlock title="2. Hosting">
        <LegalText>
          Diese Website wird bei einem externen Dienstleister gehostet (Hoster). Die
          personenbezogenen Daten, die auf dieser Website erfasst werden, werden auf den Servern des
          Hosters gespeichert. Hierbei kann es sich v. a. um IP-Adressen, Kontaktanfragen, Meta- und
          Kommunikationsdaten sowie sonstige Daten handeln, die über eine Website generiert werden.
        </LegalText>
        <LegalText>
          Der Einsatz des Hosters erfolgt zum Zwecke der Vertragserfüllung gegenüber unseren
          potenziellen und bestehenden Kunden (Art. 6 Abs. 1 lit. b DSGVO) und im Interesse einer
          sicheren, schnellen und effizienten Bereitstellung unseres Online-Angebots durch einen
          professionellen Anbieter (Art. 6 Abs. 1 lit. f DSGVO).
        </LegalText>
        <LegalText>
          Mit dem Hoster wurde, soweit erforderlich, ein Vertrag über Auftragsverarbeitung gemäß
          Art. 28 DSGVO geschlossen. Dieser stellt sicher, dass personenbezogene Daten der
          Websitebesucher nur entsprechend unseren Weisungen und unter Einhaltung der DSGVO
          verarbeitet werden.
        </LegalText>
      </LegalBlock>

      <LegalBlock title="3. Allgemeine Hinweise und Pflichtinformationen">
        <LegalSubheading>Datenschutz</LegalSubheading>
        <LegalText>
          Die Betreiber dieser Seiten nehmen den Schutz deiner persönlichen Daten sehr ernst. Wir
          behandeln deine personenbezogenen Daten vertraulich und entsprechend den gesetzlichen
          Datenschutzvorschriften sowie dieser Datenschutzerklärung. Wenn du diese Website benutzt,
          werden verschiedene personenbezogene Daten erhoben. Personenbezogene Daten sind Daten, mit
          denen du persönlich identifiziert werden kannst.
        </LegalText>

        <LegalSubheading>Speicherdauer</LegalSubheading>
        <LegalText>
          Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt
          wurde, verbleiben deine personenbezogenen Daten bei uns, bis der Zweck für die
          Datenverarbeitung entfällt. Wenn du ein berechtigtes Löschersuchen geltend machst oder
          eine Einwilligung zur Datenverarbeitung widerrufst, werden deine Daten gelöscht, sofern
          keine anderen rechtlich zulässigen Gründe für die Speicherung (z. B. steuer- oder
          handelsrechtliche Aufbewahrungsfristen) vorliegen; im letztgenannten Fall erfolgt die
          Löschung nach Fortfall dieser Gründe.
        </LegalText>

        <LegalSubheading>Widerruf deiner Einwilligung zur Datenverarbeitung</LegalSubheading>
        <LegalText>
          Viele Datenverarbeitungsvorgänge sind nur mit deiner ausdrücklichen Einwilligung möglich.
          Du kannst eine bereits erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit der
          bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.
        </LegalText>

        <LegalSubheading>
          Widerspruchsrecht gegen die Datenerhebung (Art. 21 DSGVO)
        </LegalSubheading>
        <LegalText>
          Werden Daten auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO verarbeitet, hast du jederzeit
          das Recht, aus Gründen, die sich aus deiner besonderen Situation ergeben, gegen die
          Verarbeitung deiner personenbezogenen Daten Widerspruch einzulegen. Wir verarbeiten die
          betreffenden Daten dann nicht mehr, es sei denn, wir können zwingende schutzwürdige Gründe
          für die Verarbeitung nachweisen, die deine Interessen, Rechte und Freiheiten überwiegen,
          oder die Verarbeitung dient der Geltendmachung, Ausübung oder Verteidigung von
          Rechtsansprüchen.
        </LegalText>

        <LegalSubheading>Beschwerderecht bei der zuständigen Aufsichtsbehörde</LegalSubheading>
        <LegalText>
          Im Falle von Verstößen gegen die DSGVO steht den Betroffenen ein Beschwerderecht bei einer
          Aufsichtsbehörde zu, insbesondere in dem Mitgliedstaat ihres gewöhnlichen Aufenthalts,
          ihres Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes. Das Beschwerderecht besteht
          unbeschadet anderweitiger verwaltungsrechtlicher oder gerichtlicher Rechtsbehelfe.
        </LegalText>

        <LegalSubheading>Recht auf Datenübertragbarkeit</LegalSubheading>
        <LegalText>
          Du hast das Recht, Daten, die wir auf Grundlage deiner Einwilligung oder in Erfüllung
          eines Vertrags automatisiert verarbeiten, an dich oder an einen Dritten in einem gängigen,
          maschinenlesbaren Format aushändigen zu lassen. Sofern du die direkte Übertragung der
          Daten an einen anderen Verantwortlichen verlangst, erfolgt dies nur, soweit es technisch
          machbar ist.
        </LegalText>

        <LegalSubheading>Auskunft, Berichtigung und Löschung</LegalSubheading>
        <LegalText>
          Du hast im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf
          unentgeltliche Auskunft über deine gespeicherten personenbezogenen Daten, deren Herkunft
          und Empfänger und den Zweck der Datenverarbeitung sowie ggf. ein Recht auf Berichtigung
          oder Löschung dieser Daten. Hierzu sowie zu weiteren Fragen zum Thema personenbezogene
          Daten kannst du dich jederzeit an uns wenden.
        </LegalText>

        <LegalSubheading>Recht auf Einschränkung der Verarbeitung</LegalSubheading>
        <LegalText>
          Du hast das Recht, die Einschränkung der Verarbeitung deiner personenbezogenen Daten zu
          verlangen. Hierzu kannst du dich jederzeit an uns wenden. Das Recht auf Einschränkung der
          Verarbeitung besteht in den in Art. 18 DSGVO genannten Fällen.
        </LegalText>

        <LegalSubheading>SSL- bzw. TLS-Verschlüsselung</LegalSubheading>
        <LegalText>
          Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher
          Inhalte eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennst du
          daran, dass die Adresszeile des Browsers von „http://“ auf „https://“ wechselt und am
          Schloss-Symbol in deiner Browserzeile. Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert
          ist, können die Daten, die du an uns übermittelst, nicht von Dritten mitgelesen werden.
        </LegalText>
      </LegalBlock>

      <LegalBlock title="4. Datenerfassung auf dieser Website">
        <LegalSubheading>Server-Log-Dateien</LegalSubheading>
        <LegalText>
          Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten
          Server-Log-Dateien, die dein Browser automatisch an uns übermittelt. Dies sind:
          Browsertyp und Browserversion, verwendetes Betriebssystem, Referrer-URL, Hostname des
          zugreifenden Rechners, Uhrzeit der Serveranfrage sowie die IP-Adresse.
        </LegalText>
        <LegalText>
          Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Die
          Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Der
          Websitebetreiber hat ein berechtigtes Interesse an der technisch fehlerfreien Darstellung
          und der Optimierung seiner Website – hierzu müssen die Server-Log-Dateien erfasst werden.
        </LegalText>

        <LegalSubheading>Kontaktaufnahme per E-Mail oder Telefon</LegalSubheading>
        <LegalText>
          Wenn du uns per E-Mail oder Telefon kontaktierst, wird deine Anfrage inklusive aller
          daraus hervorgehenden personenbezogenen Daten (Name, Anfrage, Kontaktdaten) zum Zwecke der
          Bearbeitung deines Anliegens bei uns gespeichert und verarbeitet. Diese Daten geben wir
          nicht ohne deine Einwilligung weiter.
        </LegalText>
        <LegalText>
          Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern
          deine Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung
          vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die
          Verarbeitung auf unserem berechtigten Interesse an der effektiven Bearbeitung der an uns
          gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO) oder auf deiner Einwilligung (Art. 6
          Abs. 1 lit. a DSGVO), sofern diese abgefragt wurde.
        </LegalText>
        <LegalText>
          Die von dir an uns per Kontaktanfrage übersandten Daten verbleiben bei uns, bis du uns zur
          Löschung aufforderst, deine Einwilligung zur Speicherung widerrufst oder der Zweck für die
          Datenspeicherung entfällt (z. B. nach abgeschlossener Bearbeitung deines Anliegens).
          Zwingende gesetzliche Bestimmungen – insbesondere Aufbewahrungsfristen – bleiben unberührt.
        </LegalText>
      </LegalBlock>

      <LegalBlock title="5. Schriftarten (Fonts)">
        <LegalText>
          Zur einheitlichen Darstellung von Schriftarten verwendet diese Website lokal eingebundene
          Schriftarten. Die Schriftdateien werden direkt von unserem Server geladen. Eine Verbindung
          zu Servern Dritter (z. B. Google) findet dabei nicht statt, und es werden hierfür keine
          personenbezogenen Daten an Dritte übermittelt.
        </LegalText>
      </LegalBlock>

      <LegalBlock title="6. Cookies und Analyse-Tools">
        <LegalSubheading>Cookie-Einwilligung</LegalSubheading>
        <LegalText>
          Beim ersten Besuch kannst du über den Cookie-Hinweis festlegen, welche Kategorien du
          erlaubst. Deine Auswahl wird lokal im Browser gespeichert (localStorage), damit sie bei
          künftigen Besuchen berücksichtigt wird. Du kannst deine Entscheidung jederzeit über den
          Link „Cookie-Einstellungen“ im Footer ändern.
        </LegalText>

        <LegalSubheading>Statistik-Tools (nur mit Einwilligung)</LegalSubheading>
        <LegalText>
          Wenn du der Kategorie „Statistik“ zustimmst, nutzen wir die unten genannten
          Analyse-Dienste parallel. Ohne deine Zustimmung werden sie nicht geladen. Du kannst
          deine Einwilligung jederzeit über „Cookie-Einstellungen“ im Footer widerrufen; danach
          werden keine weiteren Statistik-Events mehr gesendet.
        </LegalText>

        <LegalSubheading>Vercel Web Analytics</LegalSubheading>
        <LegalText>
          Vercel Web Analytics dient der anonymen Reichweitenmessung. Dabei werden u. a. besuchte
          Seiten, Referrer, Gerätetyp und ungefährer Standort (Land/Region) verarbeitet. Vercel
          Analytics ist darauf ausgelegt, keine personenbezogenen Profile zu erstellen und setzt
          keine Werbe-Cookies.
        </LegalText>
        <LegalText>
          Rechtsgrundlage ist deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Anbieter ist Vercel
          Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA. Weitere Informationen findest du in
          der{" "}
          <SmartLink href="https://vercel.com/legal/privacy-policy" target="_blank">
            Datenschutzerklärung von Vercel
          </SmartLink>
          .
        </LegalText>

        <LegalSubheading>Google Analytics 4</LegalSubheading>
        <LegalText>
          Google Analytics 4 (GA4) hilft uns, die Nutzung der Website detaillierter zu verstehen
          (z. B. Seitenaufrufe, Verweildauer, Geräte- und Browserinformationen, ungefährer Standort
          sowie technische Ereignisdaten). Die IP-Adresse wird verkürzt verarbeitet
          (IP-Anonymisierung). Werbe- und Personalisierungssignale von Google sind bei uns
          deaktiviert; Marketing-Tracking ist nicht Bestandteil der Statistik-Einwilligung.
        </LegalText>
        <LegalText>
          Rechtsgrundlage ist deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Anbieter ist Google
          Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Dabei kann eine
          Übermittlung von Daten an Google LLC in die USA erfolgen. Google beruft sich hierfür u. a.
          auf Standardvertragsklauseln bzw. das EU-U.S. Data Privacy Framework. Weitere
          Informationen:{" "}
          <SmartLink href="https://policies.google.com/privacy" target="_blank">
            Datenschutzerklärung von Google
          </SmartLink>{" "}
          und{" "}
          <SmartLink href="https://support.google.com/analytics/answer/6004245" target="_blank">
            Hinweise zu Google Analytics und Datenschutz
          </SmartLink>
          .
        </LegalText>
        <LegalText>
          Du kannst der Erfassung durch Google Analytics außerdem über Browser-Einstellungen bzw.
          das{" "}
          <SmartLink href="https://tools.google.com/dlpage/gaoptout" target="_blank">
            Google-Analytics-Opt-out-Browser-Add-on
          </SmartLink>{" "}
          widersprechen. Unabhängig davon gilt: Ohne Statistik-Zustimmung im Cookie-Banner wird GA4
          auf dieser Website nicht geladen.
        </LegalText>

        <LegalSubheading>Marketing</LegalSubheading>
        <LegalText>
          Marketing-Cookies und Werbe-Tracking sind aktuell nicht im Einsatz. Die entsprechende
          Kategorie im Cookie-Banner ist nur für mögliche zukünftige Erweiterungen vorbereitet.
        </LegalText>
      </LegalBlock>
    </LegalLayout>
  );
}
