import { Row, Text } from "@once-ui-system/core";
import { CTA_PROOF } from "@/lib/contact";

type CtaProofProps = {
  align?: "left" | "center";
};

/** One concrete customer result – sits next to Hero / Final CTAs. */
export function CtaProof({ align = "left" }: CtaProofProps) {
  return (
    <Row
      gap="4"
      wrap
      vertical="center"
      horizontal={align === "center" ? "center" : "start"}
      style={{ maxWidth: "36rem" }}
    >
      <Text
        variant="body-default-s"
        onBackground="neutral-medium"
        align={align}
        wrap="balance"
        style={{ lineHeight: 1.45 }}
      >
        „{CTA_PROOF.quote}“{" "}
        <Text as="span" onBackground="neutral-weak">
          — {CTA_PROOF.attribution}
        </Text>
      </Text>
    </Row>
  );
}
