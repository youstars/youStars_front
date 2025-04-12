import React from "react";
import styles from "./ApplicationCard.module.scss";

interface Props {
  number: string;
  priceRange: string;
  dateRange: string;
}

const ApplicationCard: React.FC<Props> = ({ number, priceRange, dateRange }) => {
  return (
    <div className={styles.card}>
      <div className={styles.number}>Заявка №{number}</div>
      <div className={styles.footer}>
        <span className={styles.price}>{priceRange}</span>
        <span className={styles.date}>{dateRange}</span>
      </div>
    </div>
  );
};

export default ApplicationCard;
