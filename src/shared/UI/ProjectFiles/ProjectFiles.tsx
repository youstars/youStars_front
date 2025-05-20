import React from "react";
import styles from "./ProjectFiles.module.scss";
import PdfIcon from "shared/assets/icons/acrobat.svg";
import PlusIcon from "shared/assets/icons/plus.svg";

interface FileItem {
  name: string;
  fileUrl: string;
}

interface ProjectFilesProps {
  files?: FileItem[];
  onFileSelect?: (file: File) => void;
}

const ProjectFiles: React.FC<ProjectFilesProps> = ({ files, onFileSelect }) => {
  return (
    <div className={styles.container}>
      <p className={styles.label}>Файлы проекта</p>
      <div className={styles.fileList}>
        {files.map((file, i) => {
          const nameParts = file.name.split(".");
          const ext = nameParts.length > 1 ? `.${nameParts.pop()}` : "";
          const baseName = nameParts.join(".");
          const shortName =
            baseName.length > 15
              ? `${baseName.slice(0, 5)}...${ext}`
              : `${baseName}${ext}`;

          return (
            <div className={styles.fileItem} key={i}>
              <img src={PdfIcon} alt="pdf" />
              <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                {shortName}
              </a>
            </div>
          );
        })}

        <label className={styles.addButton}>
          <input
            type="file"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && onFileSelect) {
                onFileSelect(file);
              }
            }}
          />
          <img src={PlusIcon} alt="добавить" />
        </label>
      </div>
    </div>
  );
};

export default ProjectFiles;
