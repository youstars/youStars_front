import React from "react";
import styles from "./Search.module.scss";
import SearchIcon from "shared/images/sideBarImgs/search.svg";

export default function Search() {
  return (
    <div className={styles.searchHeader}>
      <div className={styles.searchContainer}>
        <img src={SearchIcon} alt="" className={styles.searchIcon} />

        <input
          type="text"
          placeholder="Поиск специалиста"
          className={styles.searchInput}
        />
      </div>
    </div>
  );
}
