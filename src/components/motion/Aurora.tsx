import styles from "./motion.module.scss";

export function Aurora() {
  return (
    <div className={styles.aurora} aria-hidden="true">
      <span className={styles.blob3} />
    </div>
  );
}
