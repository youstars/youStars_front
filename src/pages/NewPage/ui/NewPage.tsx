import React from "react";
import Header2 from "widgets/Header2/ui/Header2";
import classes from "./NewPage.module.scss";
import SideBar from "widgets/SideBar/ui/SideBar";
import { Outlet } from "react-router-dom";

export default function NewPage() {
  return (
    <div className={classes.main}>
    <SideBar />
    <div className={classes.content}>
      <Header2 />
      <div className={classes.changed_part}>
        <Outlet />
      </div>
    </div>
  </div>
  );
}
