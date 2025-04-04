import React from "react";
import styles from "./FilterBtn.module.scss";
import filtersIcon from "shared/images/filters.svg";

interface FilterBtnProps {
  onClick: () => void;
  label?: string;
}

const FilterBtn: React.FC<FilterBtnProps> = ({ onClick, label = "Фильтр" }) => {
  return (
    <div className={styles.filters} onClick={onClick}>
      <img src={filtersIcon} alt="Фильтр" />
      <p>{label}</p>
    </div>
  );
};

export default FilterBtn;
