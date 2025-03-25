import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import ModalOrders from "../../Modals/ModalOrder/ModalOrder";
import Tab from "widgets/Tab/Tab";
import classes from "./Header2.module.scss";
import arrow from "shared/images/Arrow.svg";
import bell from "shared/images/bell.svg";
import interrogation from "shared/images/interrogation.svg";
import block from "shared/images/block.svg";
import user_icon from "shared/images/user_icon.svg";
import styles from "../../../sub_pages/Funnel/ui/Funnel.module.scss";
import SideFunnel from "../../SideBar/SideFunnel/SideFunnel";


export default function Header2() {
  const [dateTime, setDateTime] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const pathnames = location.pathname.split("/").filter((x) => x);
  const filteredPathnames = pathnames.slice(1);

  const breadcrumbLabels: { [key: string]: string } = {
    tasks: "Задачи",
    specialists: "Специалисты",
    funnel: "Воронка",
    library: "Библиотека",
    settings: "Настройки",
    overview: "Сводка",
    gantt: "Гант",
    kanban: "Канбан",
    user_projects: "Проекты",
  };

  // Функция открытия/закрытия модального окна
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Функция переключения боковой панели (SideFunnel)
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
      <div className={classes.upper_block}>
        <div className={classes.left_side}>
          {filteredPathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 2).join("/")}`;
            return (
                <div key={routeTo} className={classes.breadcrumb_item}>
                  {index > 0 && <img src={arrow} alt="→" className={classes.arrow_icon} />}
                  <Link to={routeTo} className={classes.tab_link}>
                    <Tab label={breadcrumbLabels[name] || name} />
                  </Link>
                </div>
            );
          })}
        </div>

        <div className={classes.right_side}>
          <button className={classes.create_order} onClick={openModal}>
            Создать заказ
          </button>
          <div className={classes.control_panel}>
            <button className={classes.panel_btn}>
              <img onClick={toggleSidebar} src={bell} alt="Уведомления" />
            </button>
            <button className={classes.panel_btn}>
              <img src={interrogation} alt="Помощь" />
            </button>
            <button className={classes.panel_btn}>
              <img src={block} alt="Блокировка" />
            </button>
            <div className={classes.time}>
              <p>{dateTime.toLocaleString()}</p>
            </div>
          </div>
          <div className={classes.profile}>
            <img src={user_icon} alt="Профиль" />
          </div>
        </div>

        {/* Модальное окно рендерится только если открыто */}
        {isModalOpen && <ModalOrders closeModal={closeModal} />}


      </div>
  );
}
