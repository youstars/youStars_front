import React, {useState} from "react";
import Header2 from "widgets/Header2/ui/Header2";
import classes from "./ManagerPage.module.scss";
import SideBar from "widgets/SideBar/ui/SideBar";
import {Outlet, useNavigate} from "react-router-dom";



export default function ManagerPage() {



  return (
      <div className={classes.main}>
        <SideBar/>
        <div className={classes.content}>
          <Header2/>
          <div className={classes.changed_part}>
            <Outlet/>
          </div>
        </div>
      </div>
  );
}
