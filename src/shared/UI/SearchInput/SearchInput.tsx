import React from "react";
import styles from "./SearchInput.module.scss";
import searchIcon from "shared/images/sideBarImgs/search.svg";

interface SearchInputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, placeholder = "Поиск..." }) => {
  return (
    <div className={styles.search}>
     <div className={styles.input_wrapper}>
  <img
    src={searchIcon}
    alt="Search Icon"
    className={styles.search_icon}
  />
  <input
    className={styles.input}
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
  />
</div>

    </div>
  );
};

export default SearchInput;
