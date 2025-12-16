import styles from "../styles/components.module.scss";

interface SpinnerProps {
  size?: "small" | "medium" | "large";
  color?: "primary" | "white" | "gray";
  className?: string;
}

export default function Spinner({
  size = "medium",
  color = "primary",
  className = "",
}: SpinnerProps) {
  const sizeClass = styles[`spinner_${size}`];
  const colorClass = styles[`spinner_${color}`];

  return (
    <div className={styles.spinner_container}>
      <div
        className={`${styles.spinner} ${sizeClass} ${colorClass} ${className}`}
      >
        <div className={styles.spinner_inner}></div>
      </div>
    </div>
  );
}
