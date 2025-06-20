import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "shared/store";
import {
  getTasks,
  selectTasks,
  selectTasksStatus,
  selectTasksError,
} from "shared/store/slices/tasksSlice";
import styles from "./Tasks.module.scss";
import { useAppSelector } from "shared/hooks/useAppSelector";
import { Task } from "shared/types/tasks";
const statusTitles: { [key: string]: string } = {
  to_do: "Нужно выполнить",
  in_progress: "В процессе",
  done: "Выполнено",
  failed: "Провалено",
  frozen: "Заморожено",
};

const getStatusLabel = (status: string) => {
  return statusTitles[status] || "Неизвестный статус";
};

const TaskTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useAppSelector(selectTasks).results;
  const loading = useAppSelector(selectTasksStatus) === "pending";
  const error = useAppSelector(selectTasksError);

  useEffect(() => {
    if (!tasks.length) {
      dispatch(getTasks());
    }
  }, [dispatch, tasks.length]);

  const groupedTasks = tasks.reduce<Record<string, Task[]>>((acc, task) => {
    const statusTitle = getStatusLabel(task.status);
    if (!acc[statusTitle]) acc[statusTitle] = [];
    acc[statusTitle].push(task);
    return acc;
  }, {});

  return (
    <div className={styles.container}>
      <div className={styles.taskHeader}>
        <p>Мои задачи</p>
      </div>

      {loading && <p style={{ color: "white" }}>Загрузка задач...</p>}

      {!loading && !error && (
        <div className={styles.table}>
          <div className={styles.header}>
            <div className={styles.headerCell}>Название задачи</div>
            <div className={styles.headerCell}>Исполнитель</div>
            <div className={styles.headerCell}>Статус</div>
            <div className={styles.headerCell}>Проект</div>
            <div className={styles.headerCell}>Дедлайн</div>
          </div>

          {Object.entries(groupedTasks).map(([status, group]) => (
            <div key={`group-${status}`} className={styles.taskGroup}>
              {group.map((task) => (
                <div key={`task-${task.id}`} className={styles.row}>
                  <div className={styles.cell}>
                    <div className={styles.taskCell}>
                      {task.title}
                      <button className={styles.taskButton}>
                        Перейти к задаче
                      </button>
                    </div>
                  </div>
                  <div className={styles.cell}>
                    {task.assigned_specialist?.join(", ") || "Не назначен"}
                  </div>
                  <div className={styles.cell}>
                    {getStatusLabel(task.status)}
                  </div>
                  <div className={styles.cell}>
                    Проект {task.project || "–"}
                  </div>
                  <div className={styles.cell}>
                    {task.deadline
                      ? new Date(task.deadline).toLocaleDateString()
                      : "–"}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskTable;
