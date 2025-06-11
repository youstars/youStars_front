import React from "react";
import styles from "./SearchInput.module.scss";
import searchIcon from "shared/images/sideBarImgs/search.svg";

interface SearchInputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  isCollapsed?: boolean; 
}


const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Поиск...",
  isCollapsed = false,
}) => {
  return (
    <div className={styles.search}>
      <div className={styles.input_wrapper}>
        <img
          src={searchIcon}
          alt="Search Icon"
          className={styles.search_icon}
        />
        <input
          className={`${styles.input} ${isCollapsed ? styles.collapsed : ""}`}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={isCollapsed ? "" : placeholder} 
        />
      </div>
    </div>
  );
};

export default SearchInput;
