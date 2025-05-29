import { useLocation, Link } from "react-router-dom";
import Tab from "widgets/Tab/Tab";
import classes from "./Header2.module.scss";
import arrow from "shared/images/Arrow.svg";
import bell from "shared/images/bell.svg";
import interrogation from "shared/images/interrogation.svg";
import block from "shared/images/block.svg";
import user_icon from "shared/images/user_icon.svg";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { selectMe } from "shared/store/slices/meSlice";
import Avatar from "shared/UI/Avatar/Avatar";
import { useDispatch } from "react-redux";
import { LogOut } from "lucide-react";

import { useAppDispatch } from "shared/hooks/useAppDispatch";
import { logout } from "shared/store/slices/authSlice";

export default function Header2() {
  const [dateTime, setDateTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { data: user } = useSelector(selectMe);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout()).then(() => {
      window.location.href = "/";
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
    clients: "Клиенты",
    chats: "Чаты",
    specialist: "Специалист",
  };

  return (
    <div className={classes.upper_block}>
      <div className={classes.left_side}>
        {filteredPathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 2).join("/")}`;
          return (
            <div key={routeTo} className={classes.breadcrumb_item}>
              {index > 0 && (
                <img src={arrow} alt="→" className={classes.arrow_icon} />
              )}
              <Link to={routeTo} className={classes.tab_link}>
                <Tab label={breadcrumbLabels[name] || name} />
              </Link>
            </div>
          );
        })}
      </div>

      <div className={classes.right_side}>
        {/*<button className={classes.create_order}>Создать заказ</button>*/}
        <div className={classes.control_panel}>
          <div className={classes.notification_container} ref={notificationRef}>
            <button
              className={classes.panel_btn}
              onClick={() => setShowNotifications(!showNotifications)}
            ></button>
            {showNotifications && (
              <div className={classes.notification_dropdown}>
                <div className={classes.notification_header}>
                  <h3>Уведомления</h3>
                </div>
              </div>
            )}
          </div>
          <button className={classes.panel_btn}>
            <img src={interrogation} alt="" />
          </button>
          <button className={classes.panel_btn}>
            <img src={block} alt="" />
          </button>
          <div className={classes.time}>
            <p>{dateTime.toLocaleString()}</p>
          </div>
        </div>
        <button className={classes.logout_btn} onClick={handleLogout}>
          <LogOut size={18} style={{ marginRight: "8px" }} />
        </button>

        <div>
          <Link to="/manager/me">
            <Avatar src={user?.avatar || user_icon} alt="Профиль" />
          </Link>
        </div>
      </div>
    </div>
  );
}
