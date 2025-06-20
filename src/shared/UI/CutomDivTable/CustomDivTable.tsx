import React from "react";
import styles from "./CustomDivTable.module.scss";

export interface Project {
  name?: string;
  client?: string | null;
  tracker?: string;
  specialists?: string[];
  timeline?: string;
  task_total_sum?: number;
  tasks_left?: number;
  status?: string;
  tracker_rating?: string;
  client_rating?: string;
}

interface TableProps {
  activeProjects: Project[];
  headers: string[];
  rows: (string | number | React.ReactNode)[][];
  compact?: boolean;
  title?: string;
}

const CustomDivTable: React.FC<TableProps> = ({
  activeProjects,
  headers,
  rows,
  compact,
  title = "Проекты",
}) => {
  return (
    <div>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.count}>{activeProjects.length}</span>
      </div>

      <div className={`${styles.table} ${compact ? styles.compact : ""}`}>
        <div className={`${styles.row} ${styles.head}`}>
          {headers.map((header, i) => (
            <div key={i}>{header}</div>
          ))}
        </div>
        {rows.map((row, rowIndex) => (
          <div className={styles.row} key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <div key={cellIndex}>{cell}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomDivTable;
