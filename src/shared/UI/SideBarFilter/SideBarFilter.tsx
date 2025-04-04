import React, { useState } from "react";
import styles from "./SidebarFilter.module.scss";
import filterIcon from "shared/images/filter.svg";

const SideBarFilter = ({ isOpen }: { isOpen: boolean }) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleCheckboxChange = (value: string) => {
    setSelectedFilters((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleResetFilters = () => {
    setSelectedFilters([]);
  };

  return (
    <div className={`${styles.sidebarOverlay} ${isOpen ? styles.open : ""}`}>
      <div className={styles.header_filter}>
        <img src={filterIcon} alt="filter" />
        <p>Фильтр</p>
      </div>

      <div className={styles.scope_block}>
        <p className={styles.scope_title}>Профессия</p>
        <ul className={styles.checkboxList}>
          {["design", "programming", "it"].map((key) => (
            <li key={key}>
              <label>
                <input
                  type="checkbox"
                  hidden
                  checked={selectedFilters.includes(key)}
                  onChange={() => handleCheckboxChange(key)}
                />
                <span className={styles.customCheckbox}></span>
                {
                  {
                    design: "Дизайн",
                    programming: "Программирование",
                    it: "IT",
                  }[key]
                }
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.block_more}>
        <div
          className={styles.moreToggle}
          onClick={() => setIsMoreOpen((prev) => !prev)}
        >
          <p>Больше</p>
          <span
            className={`${styles.arrow} ${
              isMoreOpen ? styles.up : styles.down
            }`}
          />
        </div>

        {isMoreOpen && (
          <div className={styles.moreContent}>
            <label>
              Только с проектами
              <input
                type="checkbox"
                hidden
                checked={selectedFilters.includes("active")}
                onChange={() => handleCheckboxChange("active")}
              />
              <span className={styles.customCheckbox}></span>
            </label>

            <h4>Опыты</h4>
            {["junior", "middle", "senior"].map((key) => (
              <label key={key}>
                <input
                  type="checkbox"
                  hidden
                  checked={selectedFilters.includes(key)}
                  onChange={() => handleCheckboxChange(key)}
                />
                <span className={styles.customCheckbox}></span> {key}
              </label>
            ))}

            <h4>Отзывы</h4>
            {["hasReviews", "noReviews"].map((key) => (
              <label key={key}>
                <input
                  type="checkbox"
                  hidden
                  checked={selectedFilters.includes(key)}
                  onChange={() => handleCheckboxChange(key)}
                />
                <span className={styles.customCheckbox}></span>
                {key === "hasReviews" ? "Есть отзывы" : "Нет отзывов"}
              </label>
            ))}

            <div className={styles.buttonBlock}>
              <button className={styles.applyBtn}>Применить</button>
              <button onClick={handleResetFilters} className={styles.resetBtn}>
                Сбросить все
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBarFilter;
