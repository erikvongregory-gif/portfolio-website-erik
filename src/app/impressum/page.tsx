import type { Metadata } from "next";
import { SmartLink } from "@once-ui-system/core";
import { LegalBlock, LegalLayout, LegalSubheading, LegalText } from "@/components";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum und Anbieterkennzeichnung gemäß § 5 DDG für die Website von Erik EvgLab.",
  alternates: { canonical: "/impressum" },
};

export default function Impressum() {
  return (
    <LegalLayout eyebrow="Rechtliches" title="Impressum">
      <LegalBlock title="Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz)">
        <LegalText>
          Erik Freiherr von Gregory
          <br />
          Hauptstraße 18
          <br />
          86925 Fuchstal
          <br />
          Einzelunternehmen
        </LegalText>
      </LegalBlock>

      <LegalBlock title="Kontakt">
        <LegalText>
          E-Mail:{" "}
          <SmartLink href="mailto:info@evglab.com">info@evglab.com</SmartLink>
          <br />
          Telefon:{" "}
          <SmartLink href="tel:+491731706012">0173 170 6012</SmartLink>
        </LegalText>
      </LegalBlock>

      <LegalBlock title="Umsatzsteuer-Identifikationsnummer">
        <LegalText>Kleinunternehmer gemäß § 19 UStG</LegalText>
      </LegalBlock>

      <LegalBlock title="Verantwortlich für den Inhalt nach § 5 Abs. 2 DDG">
        <LegalText>
          Erik Freiherr von Gregory
          <br />
          Hauptstraße 18
          <br />
          86925 Fuchstal
        </LegalText>
      </LegalBlock>

      <LegalBlock title="EU-Streitschlichtung">
        <LegalText>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
          <SmartLink href="https://ec.europa.eu/consumers/odr/">
            https://ec.europa.eu/consumers/odr/
          </SmartLink>{" "}
          Unsere E-Mail-Adresse finden Sie oben im Impressum.
        </LegalText>
        <LegalText>
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </LegalText>
      </LegalBlock>

      <LegalBlock title="Haftungsausschluss">
        <LegalSubheading>Haftung für Inhalte</LegalSubheading>
        <LegalText>
          Als Diensteanbieter sind wir gemäß § 6 Abs. 1 DDG für eigene Inhalte auf diesen Seiten
          nach den allgemeinen Gesetzen verantwortlich. Nach §§ 6 bis 10 DDG sind wir als
          Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
          Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
          Tätigkeit hinweisen.
        </LegalText>
        <LegalText>
          Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den
          allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch
          erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei
          Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend
          entfernen.
        </LegalText>

        <LegalSubheading>Haftung für Links</LegalSubheading>
        <LegalText>
          Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
          Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
          Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der
          Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf
          mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der
          Verlinkung nicht erkennbar.
        </LegalText>
        <LegalText>
          Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete
          Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von
          Rechtsverletzungen werden wir derartige Links umgehend entfernen.
        </LegalText>

        <LegalSubheading>Urheberrecht</LegalSubheading>
        <LegalText>
          Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
          dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
          der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen
          Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind
          nur für den privaten, nicht kommerziellen Gebrauch gestattet.
        </LegalText>
        <LegalText>
          Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die
          Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche
          gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden,
          bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen
          werden wir derartige Inhalte umgehend entfernen.
        </LegalText>
      </LegalBlock>
    </LegalLayout>
  );
}
