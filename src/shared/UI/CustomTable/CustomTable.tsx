import React, { useState } from "react";
import styles from "./CustomTable.module.scss";
import ArrowDown from "shared/assets/icons/arrowDown.svg";

interface CustomTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  initialCount?: number;
}

export interface TableColumn<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
}

const CustomTable = <T,>({
  data,
  columns,
  initialCount,
}: CustomTableProps<T>) => {
  const [expanded, setExpanded] = useState(false);
  const visibleData = expanded ? data : data.slice(0, initialCount ?? data.length);

  return (
    <div>
      <div
        className={`${styles.expandableWrapper} ${
          expanded ? styles.expanded : styles.collapsed
        }`}
      >
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                {columns.map((col, i) => (
                  <th key={i}>{col.header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleData.map((row, i) => (
                <tr key={i}>
                  {columns.map((col, j) => {
                    const value =
                      typeof col.accessor === "function"
                        ? col.accessor(row)
                        : row[col.accessor];
                    return <td key={j}>{value as React.ReactNode}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    <div
  className={`${styles.expandButton} ${expanded ? styles.rotated : ""}`}
  style={{ visibility: data.length > (initialCount ?? 0) ? "visible" : "hidden" }}
  onClick={() => {
    if (data.length > (initialCount ?? 0)) {
      setExpanded(!expanded);
    }
  }}
>
  <img src={ArrowDown} alt="arrow" />
  {expanded ? "Свернуть" : "Смотреть ещё"}
</div>

    </div>
  );
};

export default CustomTable;
