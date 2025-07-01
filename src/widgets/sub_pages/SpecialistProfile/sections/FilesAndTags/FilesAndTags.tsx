import React from "react";
import styles from "./FilesAndTags.module.scss";
import ProjectFiles from "shared/UI/ProjectFiles/ProjectFiles";
import TagSection from "../Other/TagSelection/TagSection";
import type { FileItem } from "shared/UI/ProjectFiles/ProjectFiles";

interface Props {

  files: FileItem[] | undefined;

  tags: string[];

  onFileSelect: (file: File) => void;

  onFileDelete: (file: FileItem) => void;

  className?: string;
}

/**
 * Комбинированная секция: ProjectFiles + «Опыт в нишах».
 */
const FilesAndTags: React.FC<Props> = ({
  files,
  tags,
  onFileSelect,
  onFileDelete,
  className = "",
}) => {
  console.log("🧾 files в FilesAndTags:", files);
  return(
  
  <div className={styles.experience}>
    <ProjectFiles
      files={files}
      onFileSelect={onFileSelect}
      onFileDelete={onFileDelete}
    />

    <TagSection
      title="Опыт в нишах"
      tags={tags}
      align="center"
      className={styles.column}
    />
  </div>
);
}
export default FilesAndTags;
