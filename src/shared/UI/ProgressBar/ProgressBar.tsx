// ProgressBar.tsx
import React from "react";
import styles from "./ProgressBar.module.scss";



interface ProgressBarProps {
    steps: string[];
  }
  
  const ProgressBar: React.FC<ProgressBarProps> = ({ steps }) => {
    return (
        <div className={styles.progressBar}>
        {steps.map((label, index) => (
          <div className={styles.step} key={index}>
            <div className={styles.circle} />
            <p className={styles.label}>{label}</p>
          </div>
        ))}
      </div>
      
      
      
    );
  };
  
export default ProgressBar;
