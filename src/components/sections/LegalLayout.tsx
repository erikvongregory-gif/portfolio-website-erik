import type { ReactNode } from "react";
import { Column, Heading, Tag, Text } from "@once-ui-system/core";
import { Reveal } from "@/components/motion";
import { SiteFooter } from "./SiteFooter";

type LegalLayoutProps = {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  updated?: string;
  children: ReactNode;
};

export function LegalLayout({ eyebrow, title, intro, updated, children }: LegalLayoutProps) {
  return (
    <Column fillWidth horizontal="center">
      <Column
        as="section"
        fillWidth
        horizontal="center"
        paddingX="l"
        paddingTop="160"
        paddingBottom="48"
      >
        <Column fillWidth maxWidth={48} gap="20" horizontal="start" align="left">
          <Reveal y={16}>
            <Tag size="s" variant="neutral">
              {eyebrow}
            </Tag>
          </Reveal>
          <Reveal delay={0.08}>
            <Heading
              as="h1"
              variant="display-strong-l"
              onBackground="neutral-strong"
              wrap="balance"
              style={{ letterSpacing: "-0.035em", lineHeight: 1.02 }}
            >
              {title}
            </Heading>
          </Reveal>
          {intro && (
            <Reveal delay={0.16}>
              <Text
                variant="body-default-xl"
                onBackground="neutral-weak"
                wrap="balance"
                style={{ maxWidth: "40rem", lineHeight: 1.5 }}
              >
                {intro}
              </Text>
            </Reveal>
          )}
          {updated && (
            <Reveal delay={0.2}>
              <Text variant="label-default-s" onBackground="neutral-weak">
                Stand: {updated}
              </Text>
            </Reveal>
          )}
        </Column>
      </Column>

      <Column as="section" fillWidth horizontal="center" paddingX="l" paddingBottom="128">
        <Column fillWidth maxWidth={48} gap="48">
          {children}
        </Column>
      </Column>

      <SiteFooter />
    </Column>
  );
}

type LegalBlockProps = {
  title: string;
  children: ReactNode;
};

export function LegalBlock({ title, children }: LegalBlockProps) {
  return (
    <Reveal y={16}>
      <Column gap="16" fillWidth>
        <Heading
          as="h2"
          variant="heading-strong-l"
          onBackground="neutral-strong"
          style={{ letterSpacing: "-0.02em" }}
        >
          {title}
        </Heading>
        <Column gap="12" fillWidth>
          {children}
        </Column>
      </Column>
    </Reveal>
  );
}

type LegalSubheadingProps = {
  children: ReactNode;
};

export function LegalSubheading({ children }: LegalSubheadingProps) {
  return (
    <Heading
      as="h3"
      variant="heading-strong-s"
      onBackground="neutral-strong"
      paddingTop="8"
    >
      {children}
    </Heading>
  );
}

type LegalTextProps = {
  children: ReactNode;
};

export function LegalText({ children }: LegalTextProps) {
  return (
    <Text variant="body-default-m" onBackground="neutral-weak" style={{ lineHeight: 1.65 }}>
      {children}
    </Text>
  );
}
