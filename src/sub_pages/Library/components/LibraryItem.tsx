// LibraryItem.tsx
import React, { useEffect, useRef, useState } from "react";
import styles from "./LibraryItem.module.scss";
import ArrowIcon from "shared/assets/icons/arrowDown.svg";
import FileIcon from "shared/assets/icons/file.svg";
import { use } from "i18next";

export type FileItem = {
  name: string;
  type: "folder" | "file";
  children?: FileItem[];
};

interface Props {
  item: FileItem;
  level?: number;
}

const LibraryItem: React.FC<Props> = ({ item, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isFolder = item.type === "folder";
  const childrenRef = useRef<HTMLDivElement>(null);
  const [lineHeight, setLineHeight] = useState(0);

  useEffect(() => {
    if (isOpen && childrenRef.current) {
      const height = childrenRef.current.scrollHeight;
      setLineHeight(height);
    }
  }, [isOpen]);

  return (
    <div className={styles.item} style={{ marginLeft: level * 16 }}>
      <div
        className={styles.itemHeader}
        onClick={() => isFolder && setIsOpen(!isOpen)}
      >
        {isFolder ? (
          <img
            src={ArrowIcon}
            className={`${styles.arrow} ${isOpen ? styles.open : ""}`}
            alt="arrow"
          />
        ) : (
          <img src={FileIcon} alt="file" className={styles.icon} />
        )}
        <span>{item.name}</span>
      </div>

      {isFolder && isOpen && item.children && (
        <div className={styles.children} ref={childrenRef} style={{ position: "relative" }}>
          <div
            className={`${styles.verticalLine} ${lineHeight ? styles.active : ""}`}
            style={{ height: lineHeight }}
          />
          {item.children.map((child, idx) => (
            <LibraryItem key={idx} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LibraryItem;