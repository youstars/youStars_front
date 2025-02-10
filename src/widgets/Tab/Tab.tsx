import classes from './Tab.module.scss';
import round from 'shared/images/round.svg';

export default function Tab({ label = "Сводка" }) {
  return (
    <div className={classes.block}>
      <img src={round} alt="" />
      <p>{label}</p>
    </div>
  );
}
