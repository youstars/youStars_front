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
import { useAppDispatch } from "shared/hooks/useAppDispatch";
import { logout } from "shared/store/slices/authSlice";
import { LogOut } from "lucide-react";
import overview from "shared/images/sideBarImgs/round.svg";
import projs from "shared/images/sideBarImgs/projs.svg";
import task from "shared/images/sideBarImgs/task.svg";
import specialistsIcon from "shared/images/sideBarImgs/spcialists.svg";
import clientsIcon from "shared/images/sideBarImgs/contacts.svg";
import applicationIcon from "shared/images/sideBarImgs/application.svg";
import funnel from "shared/images/sideBarImgs/funnel.svg";
import bibl from "shared/images/sideBarImgs/bibl.svg";
import chat from "shared/images/sideBarImgs/fi-br-envelope.svg";
import settings from "shared/images/sideBarImgs/settings.svg";
import ModalOrders from "widgets/Modals/ModalOrder/ModalOrder";
import CreateButton from "shared/UI/CreateButton/CreateButton";


export default function Header2() {
  const [dateTime, setDateTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { data: user } = useSelector(selectMe);
  const clients = useSelector((state: any) => state.clients?.list || []);
  const specialists = useSelector((state: any) => state.specialists?.list || []);
  const projects = useSelector((state: any) => state.projects?.projects || []);
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
    orders: "Заявки",
    library: "Библиотека знаний",
    settings: "Настройки",
    overview: "Сводка",
    gantt: "Гант",
    kanban: "Канбан",
    user_projects: "Проекты",
    clients: "Клиенты",
    chats: "Чаты",
    me: "Профиль",
  };

  const iconsMap: { [key: string]: string } = {
    overview,
    user_projects: projs,
    tasks: task,
    specialists: specialistsIcon,
    clients: clientsIcon,
    funnel: funnel,
    orders: applicationIcon,
    library: bibl,
    chats: chat,
    settings,
  };

  const isClientProfile = pathnames[1] === "clients" && /^\d+$/.test(pathnames[2]);
  const isSpecialistProfile = pathnames[1] === "specialists" && /^\d+$/.test(pathnames[2]);
  const isProjectProfile = pathnames[1] === "project" && /^\d+$/.test(pathnames[2]);

  let isFirst = true;

  return (
    <div className={classes.upper_block}>
      <div className={classes.left_side}>
        {isClientProfile ? (
          <>
            <div className={classes.breadcrumb_item}>
              {!isFirst || (isFirst = false)}
              <Link to="/manager/clients" className={classes.tab_link}>
                <Tab label="Клиенты" icon={iconsMap["clients"]} />
              </Link>
            </div>
            <div className={classes.breadcrumb_item}>
              {!isFirst && <img src={arrow} alt="→" className={classes.arrow_icon} />}
              <Tab label="Профиль клиента" />
              {isFirst = false}
            </div>
          </>
        ) : isSpecialistProfile ? (
          <>
            <div className={classes.breadcrumb_item}>
              {!isFirst || (isFirst = false)}
              <Link to="/manager/specialists" className={classes.tab_link}>
                <Tab label="Специалисты" icon={iconsMap["specialists"]} />
              </Link>
            </div>
            <div className={classes.breadcrumb_item}>
              {!isFirst && <img src={arrow} alt="→" className={classes.arrow_icon} />}
              <Tab label="Профиль специалиста" />
              {isFirst = false}
            </div>
          </>
        ) : isProjectProfile ? (
          <>
            <div className={classes.breadcrumb_item}>
              {!isFirst || (isFirst = false)}
              <Link to="/manager/user_projects" className={classes.tab_link}>
                <Tab label="Проекты" icon={iconsMap["user_projects"]} />
              </Link>
            </div>
            <div className={classes.breadcrumb_item}>
              {!isFirst && <img src={arrow} alt="→" className={classes.arrow_icon} />}
              <Tab label="Профиль проекта" />
              {isFirst = false}
            </div>
          </>
        ) : (
          filteredPathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 2).join("/")}`;
            const current = pathnames[index + 1];
            const isId = /^\d+$/.test(current);
            const label =
              breadcrumbLabels[current] ||
              (isId && breadcrumbLabels[name]
                ? breadcrumbLabels[name]
                : name);
            const icon = iconsMap[current];

            return (
              <div key={routeTo} className={classes.breadcrumb_item}>
                {!isFirst && <img src={arrow} alt="→" className={classes.arrow_icon} />}
                <Link to={routeTo} className={classes.tab_link}>
                  <Tab label={label} icon={icon} />
                </Link>
                {isFirst = false}
              </div>
            );
          })
        )}
      </div>

      <div className={classes.right_side}>
        {/*<button className={classes.create_order}>Создать заказ</button>*/}
          <CreateButton onClick={() => setIsModalOpen(true)} />

        <div className={classes.control_panel}>
          <div className={classes.notification_container} ref={notificationRef}>
            <button
              className={classes.panel_btn}
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <img src={bell} alt="notifications" />
            </button>
            {showNotifications && (
              <div className={classes.notification_dropdown}>
                <div className={classes.notification_header}>
                  <h3>Уведомления</h3>
                </div>
              </div>
            )}
          </div>
          <button className={classes.panel_btn}>
            <img src={interrogation} alt="Help" />
          </button>
          <button className={classes.panel_btn}>
            <img src={block} alt="Block" />
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
            <Avatar src={user?.avatar || user_icon} alt="Профиль" size="30px"/>
          </Link>
        </div>
      </div>
      {isModalOpen && (
        <ModalOrders
          closeModal={() => setIsModalOpen(false)}
          // clientId={clientId}
        />
      )}
    </div>
  );
}
