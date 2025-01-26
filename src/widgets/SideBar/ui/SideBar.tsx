import React from "react";
import classes from "./SideBar.module.scss";
import SideBarNav from "widgets/SideBarNav/SideBarNav";
import round from "shared/images/sideBarImgs/round.svg";
import bibl from "shared/images/sideBarImgs/bibl.svg";
import settings from "shared/images/sideBarImgs/settings.svg";
import projs from "shared/images/sideBarImgs/projs.svg";
import funnel from "shared/images/sideBarImgs/funnel.svg";
import specialists from "shared/images/sideBarImgs/spcialists.svg";
import task from "shared/images/sideBarImgs/task.svg";
import arrow from "shared/images/sideBarImgs/arrow.svg";
import search from "shared/images/sideBarImgs/search.svg";

export default function SideBar() {
  const navItems = [
    { text: "Сводка", image: round, to: 'overview' },
    { text: "Проекты", image: projs, to: 'user_projects' },
    { text: "Задачи", image: task, to: 'tasks' },
    { text: "Специалисты", image: specialists, to: 'specialists' },
    { text: "Воронка", image: funnel, to: 'funnel' },
    { text: "Библиотека знаний", image: bibl, to: 'library' },
    { text: "Настройки", image: settings, to: 'settings' },
  ];



  return (
    <aside className={classes.aside}>
      <div className={classes.upper_block}>
        <div className={classes.proj_block}>
          <div className={classes.proj_block_elements}>
            <div className={classes.proj_avatar}>
              <p>Y</p>
            </div>
            <div className={classes.description}>
              <p className={classes.block_name}>Рабочее пространоство</p>
              <p className={classes.proj_name}>YouStars</p>
            </div>
          </div>
          <button className={classes.arrow}>
            <img src={arrow} alt="" />
          </button>
        </div>
      </div>
      <div className={classes.search}>
        <div className={classes.input_wrapper}>
          <input className={classes.input} type="text" placeholder="Поиск..." />
          <img src={search} alt="Search Icon" className={classes.search_icon} />
        </div>
      </div>
      <div className={classes.navigation}>
        {navItems.map((item, index) => (
          <SideBarNav key={index} text={item.text} image={item.image}  to={item.to} />
        ))}
      </div>
    </aside>
  );
}
