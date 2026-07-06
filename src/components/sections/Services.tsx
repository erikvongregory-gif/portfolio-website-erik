import { PriceCalculator } from "@/components/PriceCalculator";
import { Section, SectionHeader } from "./Section";
import { ServicePackagesGrid } from "./ServicePackagesGrid";
import { Text } from "@once-ui-system/core";

const services = [
  {
    title: "Komplette Website",
    price: "ab 2.500 €",
    body: "Mehrseitiger Auftritt mit Design, Texten und Technik. Für Marken, die rundum überzeugen wollen.",
    features: ["Individuelles Design", "Bis ca. 5 Unterseiten", "Texte & SEO-Grundlagen", "Mobil & schnell"],
    featured: true,
  },
  {
    title: "Landingpage",
    price: "ab 1.500 €",
    body: "Eine Seite, ein Ziel. Conversion-fokussiert für Kampagnen, Angebote und Produkt-Launches.",
    features: ["Eine Seite, ein Ziel", "Conversion-optimiert", "Ideal für Werbung", "In 7 Tagen live"],
    featured: false,
  },
  {
    title: "Betreuung & Support",
    price: "99 € / Monat",
    body: "Updates, kleine Änderungen und Sicherheit. Deine Website bleibt aktuell, schnell und gepflegt.",
    features: ["Updates & Sicherheit", "Kleine Änderungen", "Fester Ansprechpartner", "Monatlich kündbar"],
    featured: false,
  },
  {
    title: "Individuell auf Anfrage",
    price: "Preis auf Anfrage",
    body: "CMS-Anbindung, Reservierungstool oder andere Sonderwünsche – Umfang und Budget klären wir persönlich im Gespräch.",
    features: ["CMS-System", "Reservierungstool", "Individuelle Funktionen", "Persönliche Beratung"],
    featured: false,
  },
];

export function Services() {
  return (
    <Section id="leistungen">
      <SectionHeader
        eyebrow="Leistungen"
        title={
          <>
            Was ich für dich{" "}
            <Text as="span" onBackground="neutral-weak">
              baue.
            </Text>
          </>
        }
        description="Transparente Richtpreise – und für individuelle Lösungen ein persönliches Gespräch."
      />

      <ServicePackagesGrid packages={services} />

      <PriceCalculator />
    </Section>
  );
}
