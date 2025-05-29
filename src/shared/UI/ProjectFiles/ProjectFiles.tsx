import React, { useState } from "react";
import styles from "./ProjectFiles.module.scss";
import PdfIcon from "shared/assets/icons/acrobat.svg";
import PlusIcon from "shared/assets/icons/plus.svg";

export interface FileItem {
  id: number;
  name: string;
  fileUrl: string;
}

interface ProjectFilesProps {
  files?: FileItem[];
  onFileSelect?: (file: File) => void;
onFileDelete?: (file: FileItem) => void | Promise<void>;

  
}

const ProjectFiles: React.FC<ProjectFilesProps> = ({
  files = [],
  onFileSelect,
  onFileDelete,
}) => {
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    file: FileItem | null;
  }>({ visible: false, x: 0, y: 0, file: null });

  const handleContextMenu = (
    e: React.MouseEvent,
    file: FileItem
  ) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.pageX,
      y: e.pageY,
      file,
    });
  };

  const handleDeleteClick = () => {
    if (contextMenu.file && onFileDelete) {
      onFileDelete(contextMenu.file);
    }
    setContextMenu({ visible: false, x: 0, y: 0, file: null });
  };

  const handleClickAnywhere = () => {
    if (contextMenu.visible) {
      setContextMenu({ visible: false, x: 0, y: 0, file: null });
    }
  };

  return (
    <div className={styles.container} onClick={handleClickAnywhere}>
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
            <div
              className={styles.fileItem}
              key={i}
              onContextMenu={(e) => handleContextMenu(e, file)}
            >
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

      {contextMenu.visible && (
        <ul
          className={styles.contextMenu}
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <li onClick={handleDeleteClick}>Удалить</li>
        </ul>
      )}
    </div>
  );
};

export default ProjectFiles;
