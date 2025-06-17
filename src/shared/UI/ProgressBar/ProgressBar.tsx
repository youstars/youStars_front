import React from "react";
import styles from "./ProgressBar.module.scss";

interface ProgressBarProps {
  steps: string[];
  currentStep: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ steps, currentStep }) => {
  return (
    <div className={styles.progressBar}>
     {steps.map((label, index) => (
  <div
    className={`${styles.step} ${
      index < currentStep ? styles.completed : ""
    } ${index === currentStep ? styles.active : ""}`}
    key={index}
  >
    <div className={styles.circle} />
    <p className={styles.label}>{label}</p>
  </div>
))}

    </div>
  );
};

export default ProgressBar;
