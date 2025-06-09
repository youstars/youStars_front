
import classes from './Tab.module.scss';
import round from 'shared/images/round.svg';

interface TabProps {
  label?: React.ReactNode;
  icon?: string;
}

export default function Tab({ label = "Сводка", icon }: TabProps) {
  return (
    <span className={classes.block}>
      {icon && <img src={icon} alt="" className={classes.icon} />}
      <p className={classes.label}>{label}</p>
    </span>
  );
}
