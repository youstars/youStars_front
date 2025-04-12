import React from "react";
import styles from "./ProjectFiles.module.scss";
import PdfIcon from "shared/assets/icons/acrobat.svg";
import PlusIcon from "shared/assets/icons/plus.svg"; 

interface FileItem {
  name: string;
}

interface ProjectFilesProps {
  files?: FileItem[];
  onAddClick?: () => void;
}

const ProjectFiles: React.FC<ProjectFilesProps> = ({ files, onAddClick }) => {
  return (
    <div className={styles.container}>
      <p className={styles.label}>Файлы проекта</p>
      <div className={styles.fileList}>
        {files.map((file, i) => (
          <div className={styles.fileItem} key={i}>
            <img src={PdfIcon} alt="pdf" />
            <span>{file.name}</span>
          </div>
        ))}
        <div className={styles.addButton} onClick={onAddClick}>
          <img src={PlusIcon} alt="добавить" />
        </div>
      </div>
    </div>
  );
};

export default ProjectFiles;
