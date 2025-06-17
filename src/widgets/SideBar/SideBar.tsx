import React, { useState } from "react";
import classes from "./SideBar.module.scss";
import SideBarNav from "widgets/SideBarNav/SideBarNav";
import round from "shared/images/sideBarImgs/round.svg";
import bibl from "shared/images/sideBarImgs/bibl.svg";
import settings from "shared/images/sideBarImgs/settings.svg";
import projs from "shared/images/sideBarImgs/projs.svg";
import chat from "shared/images/sideBarImgs/fi-br-envelope.svg";
import contacts from "shared/images/sideBarImgs/contacts.svg";
import funnel from "shared/images/sideBarImgs/funnel.svg";
import specialists from "shared/images/sideBarImgs/spcialists.svg";
import task from "shared/images/sideBarImgs/task.svg";
import arrow from "shared/images/sideBarImgs/arrow.svg";
import arrow_back from "shared/images/sideBarImgs/arrow_back.svg";
import { useAppSelector } from "shared/hooks/useAppSelector";
import { selectMe } from "shared/store/slices/meSlice";
import applicationIcon from "shared/images/sideBarImgs/application.svg";
import SearchInput from "shared/UI/SearchInput/SearchInput";
import clienst from "shared/images/sideBarImgs/clients.svg";
import admins from "shared/images/admins.svg";

export default function SideBar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const me = useAppSelector(selectMe);
  const role = me.data?.role?.toLowerCase() || "guest";

  console.log("me.data:", me.data);
  console.log("role:", role);

  const navItems = [
    { text: "Задачи", image: round, to: "overview" },
    { text: "Проекты", image: projs, to: "user_projects" },
    // { text: "Задачи", image: task, to: "tasks" },
    { text: "Специалисты", image: specialists, to: "specialists" },
    { text: "Клиенты", image: contacts, to: "clients" },
    { text: "Воронка", image: funnel, to: "funnel" },
    { text: "Заявки", image: applicationIcon, to: "orders" },
    { text: "Библиотека знаний", image: bibl, to: "library" },
    { text: "Чаты", image: chat, to: "chats" },
    { text: "Админы", image: admins, to: "admins" },
    { text: "Настройки", image: settings, to: "settings" },
  ];
  const filteredNavItems = navItems.filter((item) => {
    if (role === "client")
      return !["Клиенты", "Специалисты", "Админы", "Воронка"].includes(item.text);
    if (role === "specialist")
      return !["Воронка", "Клиенты", "Специалисты", "Админы"].includes(
        item.text
      );
    if (role === "tracker") return item.text !== "";
    return true;
  });

  return (
    <aside
      className={`${classes.sidebar} ${isCollapsed ? classes.collapsed : ""}`}
    >
      <div className={classes.upper_block}>
        {!isCollapsed && (
          <>
            <div className={classes.proj_block}>
              <div className={classes.proj_block_elements}>
                <div className={classes.proj_avatar}>
                  <p>Y</p>
                </div>

                <div className={classes.description}>
                  <p className={classes.block_name}>Рабочее пространство</p>
                  <p className={classes.proj_name}>YouStars</p>
                </div>
              </div>
              <button
                className={classes.arrow}
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                <img src={arrow} alt="Toggle Sidebar" />
              </button>
            </div>
          </>
        )}
        {isCollapsed && (
          <button
            className={classes.arrow_back}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <img src={arrow_back} alt="Toggle Sidebar" />
          </button>
        )}
      </div>

      <div className={classes.search}>
        <SearchInput
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          isCollapsed={isCollapsed}
        />
      </div>

      <div className={classes.navigation}>
        {filteredNavItems.map((item, index) => (
          <SideBarNav
            key={index}
            text={item.text}
            image={item.image}
            to={item.to}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>
    </aside>
  );
}
