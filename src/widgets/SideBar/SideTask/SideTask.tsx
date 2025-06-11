import React, { useEffect } from "react";
import { useAppDispatch } from "shared/hooks/useAppDispatch";
import { useAppSelector } from "shared/hooks/useAppSelector";
import { getTaskById, selectTaskById } from "shared/store/slices/tasksSlice";
import classes from "./SideTask.module.scss";

interface Props {
  id: number;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const SideTask: React.FC<Props> = ({ id, isOpen, toggleSidebar }) => {
  const dispatch = useAppDispatch();
  const task = useAppSelector((state) => selectTaskById(state, id));

  useEffect(() => {
    dispatch(getTaskById(String(id)));
  }, [dispatch, id]);

  if (!task) return null;

  return (
    <div className={`${classes.sidebar} ${isOpen ? classes.open : ""}`}>
      <div className={classes.header}>
        <button onClick={toggleSidebar}>←</button>
        <h2>Задача #{task.id}</h2>
      </div>
      <div className={classes.content}>
        <p>
          <strong>Название:</strong> {task.title}
        </p>
        <p>
          <strong>Описание:</strong> {task.description}
        </p>
        <p>
          <strong>Материал:</strong> {task.material}
        </p>
        <p>
          <strong>Комментарий:</strong> {task.notice}
        </p>
        <p>
          <strong>Дата начала:</strong>{" "}
          {new Date(task.start_date).toLocaleString()}
        </p>
        <p>
          <strong>Дедлайн:</strong> {new Date(task.deadline).toLocaleString()}
        </p>
        <p>
          <strong>Статус:</strong> {task.status}
        </p>
        <p>
          <strong>Приоритет:</strong> {task.status_priority}
        </p>
        <p>
          <strong>Коэффициент сложности:</strong> {task.intricacy_coefficient}
        </p>
        <p>
          <strong>Оценка менеджера:</strong> {task.manager_recommendation}
        </p>
        <p>
          <strong>Личная оценка:</strong> {task.personal_grade}
        </p>
        <p>
          <strong>Кредиты:</strong> {task.task_credits}
        </p>
      </div>
    </div>
  );
};

export default SideTask;
