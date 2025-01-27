import React, {useState} from "react";
import Header2 from "widgets/Header2/ui/Header2";
import classes from "./NewPage.module.scss";
import SideBar from "widgets/SideBar/ui/SideBar";
import {Outlet, useNavigate} from "react-router-dom";



export default function NewPage() {
  const [currentView, setCurrentView] = useState<"gantt" | "overview">("overview");
  const navigate = useNavigate();

  const handleViewChange = (event:any) => {
    navigate(event.target.value);
    setCurrentView(event.target.value as "gantt" | "overview");
  };


  return (
      <div className={classes.main}>
        <SideBar/>
        <div className={classes.content}>
          <Header2/>
          <select
              id="viewSwitcher"
              value={currentView}
              onChange={handleViewChange}
              className={classes.select}
          >

            <option value="gantt">
              Гант
            </option>
            <option value="overview">
              Канбан
            </option>
          </select>


          <select
              id="viewSwitcher"
              value={currentView}
              onChange={handleViewChange}
              className={classes.select}
          >
            <option value="gant">Проект 1</option>
          </select>
          <div className={classes.changed_part}>
            <Outlet/>
          </div>
        </div>
      </div>
  );
}
