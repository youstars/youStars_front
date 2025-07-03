import { useState } from "react";
import classes from "./SidebarFilter.module.scss";
import filterIcon from "shared/images/filter.svg";
import RangeFilterInput from "../../../shared/UI/RangeFilterInput/RangeInputFilter";
import { ChevronRight } from "lucide-react";

interface Props {
  isOpen: boolean;
  selectedFilters: string[];
  onChangeFilters: React.Dispatch<React.SetStateAction<string[]>>;
  taskRange: { min: number; max: number };
  onChangeTaskRange: React.Dispatch<React.SetStateAction<{ min: number; max: number }>>;
  costRange: { min: number; max: number };
  onChangeCostRange: React.Dispatch<React.SetStateAction<{ min: number; max: number }>>;
  projectRange: { min: number; max: number };
  onChangeProjectRange: React.Dispatch<React.SetStateAction<{ min: number; max: number }>>;
}

const SideBarFilter = ({
  isOpen,
  selectedFilters,
  onChangeFilters,
  projectRange,
  onChangeProjectRange,
  taskRange,
  onChangeTaskRange,
  costRange,
  onChangeCostRange,
}: Props) => {
  const [isMoreOpen, setIsMoreOpen] = useState(true);

  const handleCheckboxChange = (value: string) => {
    onChangeFilters((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleResetFilters = () => {
    onChangeFilters([]);
    onChangeProjectRange({ min: 0, max: Infinity });
    onChangeTaskRange({ min: 0, max: Infinity });
    onChangeCostRange({ min: 0, max: Infinity });
  };

return (
  <div className={`${classes.sidebarContainer} ${isOpen ? classes.containerOpen : ""}`}>
    <div className={`${classes.sidebar} ${isOpen ? classes.open : ""}`}>

      <div className={classes.contentWrapper}>
        <div className={classes.content}>
          {/* HEADER */}
          <div className={classes.invitedHeader}>
            <h4>Фильтры</h4>
          </div>

          {/* Чекбоксы */}
          <div className={classes.scope}>
            <p className={classes.title}>Профессия</p>
            <ul className={classes.checkboxList}>
              {["design", "programming", "it"].map((key) => (
                <li key={key}>
                  <label>
                    <input
                      type="checkbox"
                      hidden
                      checked={selectedFilters.includes(key)}
                      onChange={() => handleCheckboxChange(key)}
                    />
                    <span className={classes.checkbox}></span>
                    {{
                      design: "Дизайн",
                      programming: "Программирование",
                      it: "IT",
                    }[key]}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Параметры: проекты, задачи, стоимость */}
          <div className={classes.funnelInfo}>
            <RangeFilterInput label="Проекты в работе" value={projectRange} onChange={onChangeProjectRange} />
            <RangeFilterInput label="Задачи в работе" value={taskRange} onChange={onChangeTaskRange} />
            <RangeFilterInput label="Стоимость" value={costRange} onChange={onChangeCostRange} />
          </div>

          {/* Остальные фильтры */}
          <div className={classes.scope}>
            <p className={classes.title}>Опыты</p>
            {["junior", "middle", "senior"].map((key) => (
              <label key={key}>
                <input
                  type="checkbox"
                  hidden
                  checked={selectedFilters.includes(key)}
                  onChange={() => handleCheckboxChange(key)}
                />
                <span className={classes.checkbox}></span> {key}
              </label>
            ))}

            <p className={classes.title}>Отзывы</p>
            {["hasReviews", "noReviews"].map((key) => (
              <label key={key}>
                <input
                  type="checkbox"
                  hidden
                  checked={selectedFilters.includes(key)}
                  onChange={() => handleCheckboxChange(key)}
                />
                <span className={classes.checkbox}></span>
                {key === "hasReviews" ? "Есть отзывы" : "Нет отзывов"}
              </label>
            ))}
          </div>

          {/* Кнопки */}
          <div className={classes.buttons}>
            <button className={classes.apply}>Применить</button>
            <button onClick={handleResetFilters} className={classes.reset}>
              Сбросить все
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

}
export default SideBarFilter;
