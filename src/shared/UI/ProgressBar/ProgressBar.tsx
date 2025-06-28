import React from "react";
import styles from "./ProgressBar.module.scss";

interface ProgressBarProps {
  steps: string[];
  currentStep: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ steps, currentStep }) => {
    // percentage of progress (0–100)
    const progressPercentage =
        steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 0;

    return (
    <div className={styles.progressBar}>
        {/* full‑width background line */}
        <div className={styles.progressTrack} />

        {/* colored line up to currentStep */}
        <div
            className={styles.progressLine}
            style={{ width: `${progressPercentage}%` }}
        />
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
