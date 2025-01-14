import classes from './Tab.module.scss'
import round from 'shared/images/round.svg'

export default function Tab() {
  return (
    <div className={classes.block}>
      <img src={round} alt="" />
      <p>Сводка</p>
    </div>
  )
}
