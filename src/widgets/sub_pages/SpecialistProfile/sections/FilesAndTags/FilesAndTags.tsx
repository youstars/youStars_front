import React from "react";
import styles from "./FilesAndTags.module.scss";
import ProjectFiles from "shared/UI/ProjectFiles/ProjectFiles";
import TagSection from "../Other/TagSelection/TagSection";
import type { FileItem } from "shared/UI/ProjectFiles/ProjectFiles";

interface Props {
    /** Список файлов, прикреплённых к специалисту */
    files: FileItem[] | undefined;
    /** Теги, отражающие опыт в разных нишах */
    tags: string[];
    /** Загрузка нового файла */
    onFileSelect: (file: File) => void;
    /** Удаление существующего файла */
    onFileDelete: (file: FileItem) => void;
    /** Дополнительный CSS-класс */
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
                                       }) => (
    <div className={styles.experience}>
        <ProjectFiles
            files={files?.map((f) => ({
                id: f.id,
                name: f.name,
                fileUrl: (f as any).fileUrl ?? (f as any).file,
            }))}
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

export default FilesAndTags;