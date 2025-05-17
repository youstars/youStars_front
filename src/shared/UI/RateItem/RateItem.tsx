import React from "react";
import styles from "./RateItem.module.scss";

interface RateItemProps {
  title: string;
  value: React.ReactNode;
}

const RateItem: React.FC<RateItemProps> = ({ title, value }) => {
  return (
    <div className={styles.item}>
      <p className={styles.title}>{title}</p>
      <div className={styles.value}>{value}</div>
    </div>
  );
};

export default RateItem;
