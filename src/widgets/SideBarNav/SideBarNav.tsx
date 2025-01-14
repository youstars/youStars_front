import { NavLink } from 'react-router-dom';
import classes from './SideBarNav.module.scss'



interface SideBarNavProps {
  text: string;
  image: string;
  to: string; 
}

export default function SideBarNav({ text, image, to }: SideBarNavProps) {

  return (
    <NavLink to={to} 
    className={({ isActive }) =>
      `${classes.navItem} ${isActive ? classes.active  : ''}`
    }
  >
        <img src={image} alt="" />
        <p className={classes.name}>{text}</p>
    </NavLink>
  )
}
