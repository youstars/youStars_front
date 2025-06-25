import React from "react";
import styles from "./WorkExperience.module.scss";
import IconButton from "shared/UI/IconButton/IconButton";
import Plus from "shared/assets/icons/plus.svg";
import type { WorkExperienceFormData } from "shared/types/specialist";

interface Props {
    /** Режим редактирования карточки */
    isEditMode: boolean;
    /** Текущий список опытов */
    workExperiences: WorkExperienceFormData[];
    /** Изменение поля конкретного опыта */
    onChange: (
        index: number,
        field: keyof WorkExperienceFormData,
        value: string
    ) => void;
    /** Добавить новую запись опыта */
    onAdd: () => void;
}

/**
 * Секция «Опыт работы».
 * Отвечает только за отображение и редактирование списка workExperiences.
 */
const WorkExperience: React.FC<Props> = ({
                                             isEditMode,
                                             workExperiences,
                                             onChange,
                                             onAdd,
                                         }) => {
    const noExperiences =
        !Array.isArray(workExperiences) || workExperiences.length === 0;

    /* ---------------- РЕДАКТИРОВАНИЕ ---------------- */
    if (isEditMode) {
        return (
            <div className={styles.experienceBlock}>
                <h3 className={styles.title}>Опыт работы</h3>

                {noExperiences && (
                    <p className={styles.empty}>Нет опыта работы для редактирования</p>
                )}

                {workExperiences.map((exp, index) => (
                    <div key={exp.id || `new-${index}`} className={styles.item}>
                        <input
                            type="text"
                            value={exp.company_name || ""}
                            onChange={(e) => onChange(index, "company_name", e.target.value)}
                            placeholder="Компания"
                            className={styles.inputField}
                        />
                        <input
                            type="text"
                            value={exp.position || ""}
                            onChange={(e) => onChange(index, "position", e.target.value)}
                            placeholder="Должность"
                            className={styles.inputField}
                        />
                        <input
                            type="date"
                            value={exp.started_at || ""}
                            onChange={(e) => onChange(index, "started_at", e.target.value)}
                            className={styles.inputField}
                        />
                        <input
                            type="date"
                            value={exp.left_at || ""}
                            onChange={(e) => onChange(index, "left_at", e.target.value)}
                            className={styles.inputField}
                        />
                        <textarea
                            value={exp.duties || ""}
                            onChange={(e) => onChange(index, "duties", e.target.value)}
                            placeholder="Обязанности"
                            className={styles.inputField}
                        />
                    </div>
                ))}

                <button onClick={onAdd} className={styles.editButton}>
                    Добавить опыт
                </button>
            </div>
        );
    }

    /* ---------------- ПРОСМОТР ---------------- */
    return (
        <div className={styles.experienceBlock}>
            <h3 className={styles.title}>Опыт работы</h3>

            {noExperiences ? (
                <IconButton alt="Добавить" border="none" icon={Plus} onClick={onAdd} />
            ) : (
                workExperiences.map((job, index) => (
                    <div className={styles.item} key={index}>
                        <p className={styles.label}>
                            {job.company_name || "Компания не указана"}
                        </p>
                        <p className={styles.text}>
                            {job.position || "Должность не указана"},{" "}
                            {job.started_at || "дата начала не указана"} —{" "}
                            {job.left_at || "по настоящее время"}
                        </p>
                        {job.duties && (
                            <p className={styles.text}>Обязанности: {job.duties}</p>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default WorkExperience;