import { Row, Text } from "@once-ui-system/core";
import styles from "./CapacityBadge.module.scss";

type CapacityBadgeProps = {
  label?: string;
  /** Tighter padding – same pill on mobile & desktop. */
  compact?: boolean;
};

/**
 * Quiet hero identity pill — role, not scarcity.
 */
export function CapacityBadge({
  label = "Pro Designer & Entwickler",
  compact,
}: CapacityBadgeProps) {
  return (
    <Row
      gap="8"
      paddingX={compact ? "12" : "16"}
      paddingY={compact ? "8" : "12"}
      radius="full"
      vertical="center"
      style={{ width: "fit-content" }}
    >
      <span className={styles.dot} aria-hidden="true" />
      <Text variant="label-default-s" onBackground="neutral-strong">
        {label}
      </Text>
    </Row>
  );
}
