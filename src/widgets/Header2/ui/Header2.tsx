import Tab from "widgets/Tab/Tab";
import classes from "./Header2.module.scss";
import arrow from "shared/images/Arrow.svg";
import bell from "shared/images/bell.svg";
import interrogation from "shared/images/interrogation.svg";
import block from "shared/images/block.svg";
import user_icon from "shared/images/user_icon.svg";
import { Outlet } from "react-router-dom";


export default function Header2() {
  return (
    
    <div className={classes.upper_block}>
      <div className={classes.left_side}>
        <Tab />
        <img src={arrow} alt="" />
        <Tab />

      </div>
      <div className={classes.right_side}>
        <button className={classes.create_order}>Создать заказ</button>
        <div className={classes.control_panel}>
          <button className={classes.panel_btn}>
            <img src={bell} alt="" />
          </button>
          <button className={classes.panel_btn}>
            <img src={interrogation} alt="" />
          </button>
          <button className={classes.panel_btn}>
            <img src={block} alt="" />
          </button>
          <div className={classes.time}>
            <p>12.38</p>
            <p>14.01.2025</p>
          </div>
        </div>
        <div className={classes.profile}>
          <img src={user_icon} alt="" />
        </div>
      </div>
    </div>
            
      
  );
}
