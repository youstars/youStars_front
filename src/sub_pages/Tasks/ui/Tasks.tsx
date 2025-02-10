import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "shared/store";
import { getTasks } from "shared/store/slices/tasksSlice";
import { Task } from "./types";
import styles from "./Tasks.module.scss";

const statusTitles: { [key: number]: string } = {
  0: "Нужно выполнить",
  1: "В процессе",
  2: "Выполнено",
  3: "Провалено",
};


const getStatusLabel = (status: number) => {
  return statusTitles[status] || "Неизвестный статус";
};

const TaskTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const result = await dispatch(getTasks()).unwrap();
        const mappedTasks = result.results.map((task: any) => ({
          id: task.id,
          name: task.title,
          executor: task.assigned_specialist || "Не назначен",
          status: task.status,
          project: task.project || "Без проекта",
          admin: task.admin || "Не указан",
        }));
        setTasks(mappedTasks);
      } catch (error) {
        console.error("Ошибка при загрузке задач:", error);
      }
    };

    fetchTasks();
  }, [dispatch]);


  const groupedTasks = tasks.reduce<{ [key: string]: Task[] }>((acc, task) => {
    const statusTitle = getStatusLabel(task.status);
    if (!acc[statusTitle]) {
      acc[statusTitle] = [];
    }
    acc[statusTitle].push(task);
    return acc;
  }, {});

  return (
    <div className={styles.container}>
      <div className={styles.taskHeader}>
        <p>Мои задачи</p>
      </div>
      <div className={styles.table}>
        <div className={styles.header}>
          <div className={styles.headerCell}>Название задачи</div>
          <div className={styles.headerCell}>Исполнитель</div>
          <div className={styles.headerCell}>Статус</div>
          <div className={styles.headerCell}>Проект</div>
          <div className={styles.headerCell}>Ответственный администратор</div>
        </div>

        {Object.entries(groupedTasks).map(([status, tasks], index) => (
          <div key={status} className={styles.taskGroup}>
          
            {tasks.map((task) => (
              <div key={task.id} className={styles.row}>
                <div className={styles.cell}>
                  <div className={styles.taskCell}>
                    {task.name}
                    <button className={styles.taskButton}>Перейти к задаче</button>
                  </div>
                </div>
                <div className={styles.cell}>{task.executor}</div>
                <div className={styles.cell}>{status}</div>
                <div className={styles.cell}>{task.project}</div>
                <div className={styles.cell}>{task.admin}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskTable;
