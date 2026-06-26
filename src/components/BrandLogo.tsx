"use client";

import { Flex, Row, Text } from "@once-ui-system/core";
import type { ComponentProps } from "react";

type RowProps = ComponentProps<typeof Row>;

interface BrandMarkProps extends Omit<RowProps, "size"> {
  /** Edge length of the tile in pixels. */
  size?: number;
}

/**
 * The EvgLab mark: an "E" monogram built from three stacked layout blocks,
 * representing assembled website sections crafted in the "lab".
 */
export function BrandMark({ size = 26, radius = "m", ...rest }: BrandMarkProps) {
  return (
    <Flex
      horizontal="center"
      vertical="center"
      radius={radius}
      style={{
        width: size,
        height: size,
        flex: "0 0 auto",
        background: "#5B6CFF",
        color: "#FFFFFF",
      }}
      {...rest}
    >
      <svg
        width={size * 0.62}
        height={size * 0.62}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <rect x="4" y="4.5" width="16" height="3.6" rx="1.8" fill="currentColor" />
        <rect x="4" y="10.2" width="11" height="3.6" rx="1.8" fill="currentColor" />
        <rect x="4" y="15.9" width="8" height="3.6" rx="1.8" fill="currentColor" />
      </svg>
    </Flex>
  );
}

interface BrandLogoProps extends RowProps {
  /** Edge length of the mark tile in pixels. */
  markSize?: number;
  /** Render only the mark, without the wordmark. */
  iconOnly?: boolean;
  /** Wordmark text. */
  wordmark?: string;
}

export function BrandLogo({
  markSize = 26,
  iconOnly = false,
  wordmark = "Erik EvgLab",
  ...rest
}: BrandLogoProps) {
  return (
    <Row vertical="center" gap="8" {...rest}>
      <BrandMark size={markSize} />
      {!iconOnly && (
        <Text
          variant="label-strong-m"
          onBackground="neutral-strong"
          style={{ letterSpacing: "-0.01em" }}
        >
          {wordmark}
        </Text>
      )}
    </Row>
  );
}
