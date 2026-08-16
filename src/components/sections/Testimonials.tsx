import { Column, Row, Text } from "@once-ui-system/core";
import { Reveal } from "@/components/motion";
import { Section, SectionHeader } from "./Section";

type Testimonial = {
  quote: string;
  name: string;
  meta: string;
  /** Star rating from a public review (e.g. Google). */
  rating?: number;
  source?: "google" | "direkt";
  /** Datum der öffentlichen Freigabe / letzten Verifikation (ISO YYYY-MM-DD). */
  verifiedAt?: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "Als Unternehmer habe ich schon immer großen Wert auf eine professionelle Internetseite gelegt. Allerdings war es für mich immer schwierig, einen Webdesigner zu finden, der meine Vorstellungen und Anforderungen wirklich versteht und umsetzt. Dann kam Erik: jung, dynamisch, kompetent und mit klaren Ideen! Innerhalb von nur drei Tagen waren wir mit einer komplett neuen Website online – mit einem modernen Erscheinungsbild, konkreten Lösungen und Bildern, die wirklich zeigen, wer wir sind und was wir machen. Vielen Dank, Erik!!",
    name: "Da Peppe",
    meta: "peppedelmar · Osteria & Pizzeria · Landsberg · da-peppe.com",
    rating: 5,
    source: "google",
  },
  // Freigabe offen – bitte bestätigen, sonst entfernen wir die Zitate.
  {
    quote:
      "Erik hat unseren Auftritt komplett neu gedacht. Die Zusammenarbeit war direkt und unkompliziert – und das Ergebnis wirkt endlich so professionell wie unsere Arbeit.",
    name: "Ingenieurbüro Jungen",
    meta: "Industrie · Automation · ib-jungen.de",
  },
  {
    quote:
      "Vom ersten Entwurf an hat man gemerkt, dass Erik unsere Marke verstanden hat. Die Seite hat Kante, genau wie unser Bier – und Bestellungen kommen jetzt direkt über die Website.",
    name: "Lünebräu",
    meta: "Craft-Bier-Brauerei · Lüneburg",
  },
];

function ReviewStars({ rating, source }: { rating: number; source?: "google" | "direkt" }) {
  const filled = Math.round(rating);
  return (
    <Column gap="4" horizontal="center" align="center">
      <Text
        variant="label-strong-s"
        onBackground="brand-strong"
        aria-label={`${rating} von 5 Sternen`}
        style={{ letterSpacing: "0.12em" }}
      >
        {"★".repeat(filled)}
        <Text as="span" onBackground="neutral-weak">
          {"★".repeat(Math.max(0, 5 - filled))}
        </Text>
      </Text>
      {source === "google" && (
        <Text variant="label-default-xs" onBackground="neutral-weak" align="center">
          Google-Bewertung
        </Text>
      )}
    </Column>
  );
}

export function Testimonials() {
  const [lead, ...rest] = testimonials;

  return (
    <Section id="stimmen" background="surface" gap="56">
      <SectionHeader
        align="center"
        eyebrow="Stimmen"
        title={
          <>
            Was Kunden{" "}
            <Text as="span" onBackground="neutral-weak">
              sagen.
            </Text>
          </>
        }
        description="Echte Stimmen aus Projekten – inklusive öffentlicher Google-Bewertung."
      />

      <Reveal y={24}>
        <Column
          fillWidth
          maxWidth={44}
          gap="24"
          horizontal="center"
          align="center"
          style={{ marginInline: "auto" }}
        >
          {lead.rating != null && <ReviewStars rating={lead.rating} source={lead.source} />}
          <Text
            as="blockquote"
            variant="body-default-l"
            onBackground="neutral-strong"
            wrap="balance"
            align="center"
            style={{ lineHeight: 1.55, margin: 0, letterSpacing: "-0.01em" }}
          >
            „{lead.quote}“
          </Text>
          <Column gap="4" horizontal="center" align="center">
            <Text variant="label-strong-s" onBackground="neutral-strong">
              {lead.name}
            </Text>
            <Text variant="body-default-xs" onBackground="neutral-weak">
              {lead.meta}
            </Text>
          </Column>
        </Column>
      </Reveal>

      {rest.length > 0 && (
        <Column fillWidth maxWidth={40} gap="0" style={{ marginInline: "auto" }}>
          {rest.map((t, i) => (
            <Reveal key={t.name} delay={0.08 + i * 0.08}>
              <Column
                gap="16"
                paddingTop="32"
                borderTop="neutral-alpha-medium"
                horizontal="center"
                align="center"
              >
                {t.rating != null && <ReviewStars rating={t.rating} source={t.source} />}
                <Text
                  as="blockquote"
                  variant="body-default-l"
                  onBackground="neutral-medium"
                  wrap="balance"
                  align="center"
                  style={{ lineHeight: 1.6, margin: 0 }}
                >
                  „{t.quote}“
                </Text>
                <Row gap="8" vertical="center" wrap horizontal="center">
                  <Text variant="label-strong-s" onBackground="neutral-strong">
                    {t.name}
                  </Text>
                  <Text variant="body-default-xs" onBackground="neutral-weak">
                    · {t.meta}
                  </Text>
                </Row>
              </Column>
            </Reveal>
          ))}
        </Column>
      )}
    </Section>
  );
}
