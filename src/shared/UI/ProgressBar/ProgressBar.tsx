import React, { useMemo } from "react";
import styles from "./ProgressBar.module.scss";

interface ProgressBarProps {
  steps: string[];
  currentStep: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ steps, currentStep }) => {
  const totalSteps = steps.length;

  // Protect against out‑of‑range indices
  const clampedStep = Math.min(Math.max(currentStep, 0), totalSteps - 1);

  // Memoize percentage to avoid recalculation on unrelated renders
  const progressPercentage = useMemo(() => {
    if (totalSteps <= 1) return 0;
    return (clampedStep / (totalSteps - 1)) * 100;
  }, [clampedStep, totalSteps]);

    return (
    <div
      className={styles.progressBar}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={totalSteps - 1}
      aria-valuenow={clampedStep}
    >
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
          index < clampedStep ? styles.completed : ""
        } ${index === clampedStep ? styles.active : ""}`}
        aria-current={index === clampedStep ? "step" : undefined}
        key={label}
      >
        <div className={styles.circle} />
        <p className={styles.label}>{label}</p>
      </div>
    ))}

    </div>
  );
};

export default React.memo(ProgressBar);
