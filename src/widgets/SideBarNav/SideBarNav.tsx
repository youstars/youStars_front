import {NavLink} from 'react-router-dom';
import classes from './SideBarNav.module.scss'


interface SideBarNavProps {
    text: string;
    image: string;
    to: string;
    isCollapsed: boolean;
}

export default function SideBarNav({text, image, to, isCollapsed}: SideBarNavProps) {

    return (
      <NavLink
  to={to}
  className={({ isActive }) =>
    `${classes.navItem} ${isActive ? classes.active : ''} ${
      isCollapsed ? classes.collapsed : ''
    }`
  }
>
  {({ isActive }) => (
    <>
      {isActive && !isCollapsed && <div className={classes.leftBoard} />}
      <img src={image} alt="" />
      {!isCollapsed && <p className={classes.name}>{text}</p>}
    </>
  )}
</NavLink>

    )
}
