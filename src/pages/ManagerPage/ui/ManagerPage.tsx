import React from "react";
import Header2 from "widgets/Header2/ui/Header2";
import classes from "./ManagerPage.module.scss";
import SideBar from "widgets/SideBar/ui/SideBar";
import {Outlet, useNavigate} from "react-router-dom";
import SideFunnel from "../../../widgets/SideBar/SideFunnel/SideFunnel";
import styles from "../../../sub_pages/Funnel/ui/Funnel.module.scss";



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

            <SideFunnel/>
        </div>
    );
}
