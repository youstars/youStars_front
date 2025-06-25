import React from "react";
import styles from "./Projects.module.scss";

interface Project {
  name?: string;
  client?: string;
  tracker?: string;
  timeline?: string;
  tracker_rating?: number | string;
  client_rating?: number | string;
}

interface FinishedProjectsProps {
  /** Массив завершённых проектов */
  projects: Project[];
}

const FinishedProjects: React.FC<FinishedProjectsProps> = ({ projects }) => {
  if (!projects || projects.length === 0) {
    return null; // ничего не показываем, если проектов нет
  }

  return (
      <div className={styles.finishedProjects}>
        <div className={styles.header}>
          <h3 className={styles.title}>Выполненные проекты</h3>
          <span className={styles.count}>{projects.length}</span>
        </div>
        <div className={styles.table}>
          <div className={`${styles.row} ${styles.head}`}>
            <div>Название</div>
            <div>Клиент</div>
            <div>Трекер</div>
            <div>Таймлайн</div>
            <div>Оценка трекеров</div>
            <div>Оценка заказчика</div>
          </div>

          {projects.map((project, index) => (
              <div className={styles.row} key={index}>
                <div>{project.name || "Нет названия"}</div>
                <div>{project.client || "—"}</div>
                <div>{project.tracker || "—"}</div>
                <div>{project.timeline || "Нет дат"}</div>
                <div>{project.tracker_rating ?? "0"}</div>
                <div>{project.client_rating ?? "0"}</div>
              </div>
          ))}
        </div>
      </div>
  );
};

export default FinishedProjects;