import { Column, Grid, Icon, type IconName, Text } from "@once-ui-system/core";
import { Reveal } from "@/components/motion";
import { Section, SectionHeader } from "./Section";

const points: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "sparkle",
    title: "Design mit Persönlichkeit",
    body: "Individuell gestaltet statt Vorlage. Dein Auftritt sieht aus wie deine Marke, nicht wie ein Template von der Stange.",
  },
  {
    icon: "person",
    title: "Direkt mit mir",
    body: "Du sprichst von der Idee bis zum Launch direkt mit mir. Kein Junior, keine Warteschleife, klare Verantwortung.",
  },
  {
    icon: "security",
    title: "Sauber und schnell",
    body: "Mobil, schnell und suchmaschinenfreundlich gebaut. In der Regel in 7 Tagen live, ohne monatelange Schleifen.",
  },
];

export function Approach() {
  return (
    <Section id="anders">
      <SectionHeader
        eyebrow="Was ich anders mache"
        title={
          <>
            Kein Baukasten.{" "}
            <Text as="span" onBackground="neutral-weak">
              Echte Handarbeit.
            </Text>
          </>
        }
        description="Klarer Fokus, direkte Zusammenarbeit und ein Ergebnis, das verkauft."
      />

      <Grid columns="3" m={{ columns: "1" }} gap="32">
        {points.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.1}>
            <Column gap="16" paddingTop="24" borderTop="neutral-alpha-medium">
              <Icon name={p.icon} size="m" onBackground="neutral-strong" />
              <Text variant="heading-strong-s" onBackground="neutral-strong">
                {p.title}
              </Text>
              <Text variant="body-default-m" onBackground="neutral-weak">
                {p.body}
              </Text>
            </Column>
          </Reveal>
        ))}
      </Grid>
    </Section>
  );
}
