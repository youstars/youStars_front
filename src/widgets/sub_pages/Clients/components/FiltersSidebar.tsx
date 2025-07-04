import React from "react";
import classes from "../Clients.module.scss";
import filterIcon from "shared/images/filter.svg";

interface FiltersSidebarProps {
    isOpen: boolean;
    isMoreOpen: boolean;
    selectedFilters: string[];
    onToggleSidebar: () => void;
    onToggleMore: () => void;
    onCheckboxChange: (value: string) => void;
    onResetFilters: () => void;
}

const FiltersSidebar: React.FC<FiltersSidebarProps> = ({
                                                           isOpen,
                                                           isMoreOpen,
                                                           selectedFilters,
                                                           onToggleSidebar,
                                                           onToggleMore,
                                                           onCheckboxChange,
                                                           onResetFilters,
                                                       }) => {
    return (
        <div
            className={
                isOpen ? classes.sidebar : `${classes.sidebar} ${classes.closed}`
            }
        >
            <div className={classes.header_filter} onClick={onToggleSidebar}>
                <img src={filterIcon} alt="filter"/>
                <p>Фильтр</p>
            </div>

            {/* ---------- Main Scope Filters ---------- */}
            <div className={classes.scope_block}>
                <p className={classes.scope_title}>Сфера деятельности</p>
                <ul className={classes.checkboxList}>
                    <li>
                        <label>
                            <input
                                type="checkbox"
                                hidden
                                checked={selectedFilters.includes("design")}
                                onChange={() => onCheckboxChange("design")}
                            />
                            <span className={classes.customCheckbox}></span>
                            Дизайн
                        </label>

                        <ul className={classes.subList}>
                            {[
                                {key: "graphic", label: "Графический дизайн"},
                                {key: "uxui", label: "UX / UI"},
                                {key: "animation", label: "2D / 3D Анимация"},
                                {key: "other", label: "Другое"},
                            ].map(({key, label}) => (
                                <li key={key}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            hidden
                                            checked={selectedFilters.includes(key)}
                                            onChange={() => onCheckboxChange(key)}
                                        />
                                        <span className={classes.customCheckbox}></span>
                                        {label}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </li>

                    {[
                        {key: "programming", label: "Программирование"},
                        {key: "it", label: "IT"},
                    ].map(({key, label}) => (
                        <li key={key}>
                            <label>
                                <input
                                    type="checkbox"
                                    hidden
                                    checked={selectedFilters.includes(key)}
                                    onChange={() => onCheckboxChange(key)}
                                />
                                <span className={classes.customCheckbox}></span>
                                {label}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>

            {/* ---------- More Filters ---------- */}
            <div className={classes.block_more}>
                <div className={classes.moreToggle} onClick={onToggleMore}>
                    <p>Больше</p>
                    <span
                        className={`${classes.arrow} ${
                            isMoreOpen ? classes.up : classes.down
                        }`}
                    />
                </div>

                {isMoreOpen && (
                    <div className={classes.moreContent}>
                        <label>
                            Только с активными проектами
                            <input
                                type="checkbox"
                                hidden
                                checked={selectedFilters.includes("active")}
                                onChange={() => onCheckboxChange("active")}
                            />
                            <span className={classes.customCheckbox}></span>
                        </label>

                        {/* Business problems */}
                        <h4>Проблемы бизнеса</h4>
                        {["problem1", "problem2", "problem3"].map((key) => (
                            <label key={key}>
                                <input
                                    type="checkbox"
                                    hidden
                                    checked={selectedFilters.includes(key)}
                                    onChange={() => onCheckboxChange(key)}
                                />
                                <span className={classes.customCheckbox}></span> Проблема
                            </label>
                        ))}

                        {/* Business tasks */}
                        <h4>Задачи бизнеса</h4>
                        {["task1", "task2", "task3"].map((key) => (
                            <label key={key}>
                                <input
                                    type="checkbox"
                                    hidden
                                    checked={selectedFilters.includes(key)}
                                    onChange={() => onCheckboxChange(key)}
                                />
                                <span className={classes.customCheckbox}></span> Задача
                            </label>
                        ))}

                        {/* Last contact */}
                        <h4>Дата последнего контакта</h4>
                        {[
                            {key: "less1", label: "Менее дня"},
                            {key: "1to2", label: "1-2 дня"},
                            {key: "more3", label: "Более 3 дней"},
                        ].map(({key, label}) => (
                            <label key={key}>
                                <input
                                    type="checkbox"
                                    hidden
                                    checked={selectedFilters.includes(key)}
                                    onChange={() => onCheckboxChange(key)}
                                />
                                <span className={classes.customCheckbox}></span>
                                {label}
                            </label>
                        ))}

                        {/* Reviews */}
                        <h4>Наличие отзывов</h4>
                        {[
                            {key: "hasReviews", label: "Есть отзывы"},
                            {key: "noReviews", label: "Нет отзывов"},
                        ].map(({key, label}) => (
                            <label key={key}>
                                <input
                                    type="checkbox"
                                    hidden
                                    checked={selectedFilters.includes(key)}
                                    onChange={() => onCheckboxChange(key)}
                                />
                                <span className={classes.customCheckbox}></span>
                                {label}
                            </label>
                        ))}

                        <div className={classes.buttonBlock}>
                            <button className={classes.applyBtn}>Применить</button>
                            <button onClick={onResetFilters} className={classes.resetBtn}>
                                Сбросить все
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default React.memo(FiltersSidebar);