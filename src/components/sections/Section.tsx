import type { ReactNode } from "react";
import { Column, Heading, Tag, Text } from "@once-ui-system/core";
import { Reveal } from "@/components/motion";

type SectionProps = {
  id?: string;
  children: ReactNode;
  maxWidth?: number;
  gap?: "16" | "24" | "32" | "40" | "48" | "56" | "64";
  paddingY?: "56" | "64" | "80" | "104" | "128";
  /** Full-bleed band background – breaks up the page rhythm between sections. */
  background?: "page" | "surface";
};

export function Section({
  id,
  children,
  maxWidth = 68,
  gap = "48",
  paddingY = "104",
  background,
}: SectionProps) {
  return (
    <Column
      as="section"
      id={id}
      fillWidth
      horizontal="center"
      paddingX="l"
      paddingY={paddingY}
      m={{ paddingY: "64" }}
      background={background}
      style={{ scrollMarginTop: "96px" }}
    >
      <Column fillWidth maxWidth={maxWidth} gap={gap} m={{ gap: "32" }}>
        {children}
      </Column>
    </Column>
  );
}

type SectionHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "start" | "center";
};

export function SectionHeader({ eyebrow, title, description, align = "start" }: SectionHeaderProps) {
  return (
    <Column
      gap="16"
      fillWidth
      maxWidth={42}
      horizontal={align === "center" ? "center" : "start"}
      align={align === "center" ? "center" : "left"}
      style={align === "center" ? { marginInline: "auto" } : undefined}
    >
      <Reveal y={16}>
        <Tag size="s" variant="neutral">
          {eyebrow}
        </Tag>
      </Reveal>
      <Reveal delay={0.08}>
        <Heading
          as="h2"
          variant="display-strong-s"
          onBackground="neutral-strong"
          wrap="balance"
          style={{ letterSpacing: "-0.03em", lineHeight: 1.05 }}
        >
          {title}
        </Heading>
      </Reveal>
      {description && (
        <Reveal delay={0.16}>
          <Text variant="body-default-l" onBackground="neutral-weak" wrap="balance">
            {description}
          </Text>
        </Reveal>
      )}
    </Column>
  );
}
