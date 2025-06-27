import React from "react";
import classes from "./UserProjects.module.scss";
import {Input} from "shared/index";
import searchIcon from "shared/images/sideBarImgs/search.svg";

interface SearchAndFilterProps {
    /** Текущее значение строки поиска */
    value: string;
    /** Коллбэк, вызываемый при изменении текста */
    onChange: (value: string) => void;
    /** true, если юзер ― клиент (для скрытия секции фильтров) */
    isClient: boolean;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
                                                             value,
                                                             onChange,
                                                             isClient,
                                                         }) => (
    <div className={classes.search_and_filter}>
        <div className={classes.search}>
            <div className={classes.input_wrapper}>
                <Input
                    className={classes.input}
                    type="text"
                    placeholder="Поиск"
                    value={value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        onChange(e.target.value)
                    }
                />
                <img
                    src={searchIcon}
                    alt="search"
                    className={classes.search_icon}
                />
            </div>
        </div>

        {!isClient && (
            <div className={classes.filter}>
                <p onClick={() => onChange("")}>Сбросить фильтры</p>
                <p>Сохранить комбинацию</p>
            </div>
        )}
    </div>
);

export default SearchAndFilter;