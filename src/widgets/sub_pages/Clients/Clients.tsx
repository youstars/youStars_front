import classes from "./Clients.module.scss";
import { Button, Input } from "shared/index";
import search from "shared/images/sideBarImgs/search.svg";
import filters from "shared/images/filters.svg";
import star from "shared/images/star.svg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import filter from "shared/images/filter.svg";
import { getClients } from "shared/store/slices/clientsSlice";
import { useAppDispatch } from "shared/hooks/useAppDispatch";
import { useAppSelector } from "shared/hooks/useAppSelector";
import Avatar from "shared/UI/Avatar/Avatar";

const Clients = () => {
  const dispatch = useAppDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const navigate = useNavigate();
  const handleCheckboxChange = (value: string) => {
    setSelectedFilters((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const {
    list: clients,
    loading,
    error,
  } = useAppSelector((state: any) => state.clients);

  const handleResetFilters = () => {
    setSelectedFilters([]);
  };

  useEffect(() => {
    dispatch(getClients());
  }, [dispatch]);

  const filteredClients = clients.filter((client: any) =>
    client.custom_user.full_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className={classes.wrapper}>
      <main
        className={`${classes.main} ${isSidebarOpen ? classes.shifted : ""}`}
      >
        <form className={classes.form}>
          <div className={classes.search_and_filter}>
            <div className={classes.input_wrapper}>
              <Input
                className={classes.input}
                type="text"
                placeholder="Поиск клиента"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
              />
              <img
                src={search}
                alt="Search Icon"
                className={classes.search_icon}
              />
            </div>
          </div>

          <div
            className={classes.filters}
            onClick={() => setIsSidebarOpen((prev) => !prev)}
          >
            <img src={filters} alt="" />
            <p>Последнее взаимодействие возрастание</p>
          </div>
        </form>

        <div className={classes.sum_clients}>
          <p> Найдено {filteredClients.length} клиента :</p>
        </div>
        {filteredClients.map((client: any) => (
          <div
            key={client.id}
            className={classes.all_blocks}
            onClick={() => navigate(`/manager/clients/${client.id}`)}
            style={{ cursor: "pointer" }}
          >
            <div className={classes.img_job_title}>
              <div className={classes.img}>
                <Avatar
                  src={client.custom_user.avatar}
                  alt={client.custom_user.full_name}
                  size="60px"
                />
              </div>

              <div className={classes.content}>
                <p>{client.business_name || "Компания не указана"}</p>
                <h3>{client.custom_user.full_name}</h3>
                <p className={classes.description}>
                  {client.description || "Описание отсутствует"}
                </p>
              </div>

              <div
                className={classes.send_message}
                onClick={(e) => e.stopPropagation()} 
              >
                <img src={star} alt="star" />
                <button className={classes.button}>Написать клиенту</button>
              </div>
            </div>

            <div className={classes.payment_block}>
              <div className={classes.payment_text}>
                <p className="todo">
                  Заказов на сумму:{" "}
                  <span>{client.total_orders_sum || "—"}</span>
                </p>
                <p className="todo">
                  Средний чек: <span>{client.avg_check || "—"}</span>
                </p>
                <p>
                  Настроение:{" "}
                  <span>
                    {(client.mood ?? client.overall_rating ?? "—") + "/5"}
                  </span>
                </p>
              </div>

              <div className={classes.payment_text}>
                <p className="todo">
                  Активные заявки: <span>{client.active_projects ?? "—"}</span>
                </p>
                <p className="todo">
                  Все проекты: <span>{client.total_projects ?? "—"}</span>
                </p>
                <p className="todo">
                  Дата последнего контакта:{" "}
                  <span>
                    {client.last_contact_date
                      ? new Date(client.last_contact_date).toLocaleDateString()
                      : "—"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </main>

      <div
        className={
          isSidebarOpen
            ? classes.sidebar
            : `${classes.sidebar} ${classes.closed}`
        }
      >
        <div className={classes.header_filter}>
          <img src={filter} alt="" />
          <p>Фильтр</p>
        </div>

        <div className={classes.scope_block}>
          <p className={classes.scope_title}>Сфера деятельности</p>
          <ul className={classes.checkboxList}>
            <li>
              <label>
                <input
                  type="checkbox"
                  hidden
                  checked={selectedFilters.includes("design")}
                  onChange={() => handleCheckboxChange("design")}
                />
                <span className={classes.customCheckbox}></span>
                Дизайн
              </label>
              <ul className={classes.subList}>
                {["graphic", "uxui", "animation", "other"].map((key) => (
                  <li key={key}>
                    <label>
                      <input
                        type="checkbox"
                        hidden
                        checked={selectedFilters.includes(key)}
                        onChange={() => handleCheckboxChange(key)}
                      />
                      <span className={classes.customCheckbox}></span>
                      {
                        {
                          graphic: "Графический дизайн",
                          uxui: "UX / UI",
                          animation: "2D / 3D Анимация",
                          other: "Другое",
                        }[key]
                      }
                    </label>
                  </li>
                ))}
              </ul>
            </li>

            <li>
              <label>
                <input
                  type="checkbox"
                  hidden
                  checked={selectedFilters.includes("programming")}
                  onChange={() => handleCheckboxChange("programming")}
                />
                <span className={classes.customCheckbox}></span>
                Программирование
              </label>
            </li>

            <li>
              <label>
                <input
                  type="checkbox"
                  hidden
                  checked={selectedFilters.includes("it")}
                  onChange={() => handleCheckboxChange("it")}
                />
                <span className={classes.customCheckbox}></span>
                IT
              </label>
            </li>
          </ul>
        </div>

        <div className={classes.block_more}>
          <div
            className={classes.moreToggle}
            onClick={() => setIsMoreOpen((prev) => !prev)}
          >
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
                  onChange={() => handleCheckboxChange("active")}
                />
                <span className={classes.customCheckbox}></span>
              </label>

              <h4>Проблемы бизнеса</h4>
              {["problem1", "problem2", "problem3"].map((key) => (
                <label key={key}>
                  <input
                    type="checkbox"
                    hidden
                    checked={selectedFilters.includes(key)}
                    onChange={() => handleCheckboxChange(key)}
                  />
                  <span className={classes.customCheckbox}></span> Проблема
                </label>
              ))}

              <h4>Задачи бизнеса</h4>
              {["task1", "task2", "task3"].map((key) => (
                <label key={key}>
                  <input
                    type="checkbox"
                    hidden
                    checked={selectedFilters.includes(key)}
                    onChange={() => handleCheckboxChange(key)}
                  />
                  <span className={classes.customCheckbox}></span> Задача
                </label>
              ))}

              <h4>Дата последнего контакта</h4>
              {["less1", "1to2", "more3"].map((key) => (
                <label key={key}>
                  <input
                    type="checkbox"
                    hidden
                    checked={selectedFilters.includes(key)}
                    onChange={() => handleCheckboxChange(key)}
                  />
                  <span className={classes.customCheckbox}></span>
                  {
                    {
                      less1: "Менее дня",
                      "1to2": "1-2 дня",
                      more3: "Более 3 дней",
                    }[key]
                  }
                </label>
              ))}

              <h4>Наличие отзывов</h4>
              {["hasReviews", "noReviews"].map((key) => (
                <label key={key}>
                  <input
                    type="checkbox"
                    hidden
                    checked={selectedFilters.includes(key)}
                    onChange={() => handleCheckboxChange(key)}
                  />
                  <span className={classes.customCheckbox}></span>
                  {key === "hasReviews" ? "Есть отзывы" : "Нет отзывов"}
                </label>
              ))}

              <div className={classes.buttonBlock}>
                <button className={classes.applyBtn}>Применить</button>
                <button
                  onClick={handleResetFilters}
                  className={classes.resetBtn}
                >
                  Сбросить все
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Clients;
