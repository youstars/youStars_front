/* widgets/sub_pages/ClientProfile/components/ProjectBlock/ProjectBlock.tsx */
import React from "react";
import styles  from "./ProjectBlock.module.scss";
import { CardItem } from "shared/UI/CardItem/CardItem";

export interface Project {
  id          : number;        
  name        : string;
  timeline    : string;
  tracker     : number;
  specialists : string[];
  status      : string;
  budget      : number | null;
}

type Props = {
  title    : string;
  projects : Project[];
};

export const ProjectBlock: React.FC<Props> = ({ title, projects }) => {

const total = projects
  .reduce((sum, p) => sum + (typeof p.budget === "string" ? parseFloat(p.budget) : p.budget ?? 0), 0)
  .toLocaleString("ru-RU");


  return (
    <div className={styles.projectBlock}>
      <div className={styles.projectBlockText}>
        <h3 className={styles.projectBlockTitle}>{title}</h3>
        <span className={styles.projectBlockTotal}>
          Стоимость проектов: {total} ₽
        </span>
      </div>

      <div className={styles.projectBlockList}>
        {projects.length === 0 ? (
          <p className={styles.empty}>Нет проектов</p>
        ) : (
          projects.map((p, i) => <CardItem key={i} project={p} />)
        )}
      </div>
    </div>
  );
};
