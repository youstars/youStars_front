import styles from "./About.module.scss";
import TagSection from "../Other/TagSelection/TagSection";
import IconButton from "shared/UI/IconButton/IconButton";
import Plus from "shared/assets/icons/plus.svg";
import type { Specialist, SpecialistFormData } from "shared/types/specialist";

interface Props {
    /** Режим редактирования карточки */
    isEditMode: boolean;
    /** Текущее состояние формы */
    formData: SpecialistFormData;
    /** Кол-бэк изменения полей формы */
    onFieldChange: (k: keyof SpecialistFormData, v: string) => void;
    /** Полный объект специалиста (нужен для тегов услуг) */
    specialist: Specialist;
    /** Перевести карточку в режим редактирования */
    onEnterEdit: () => void;
}

/**
 * Секция «О специалисте»,
 * вынесенная из SpecialistCardProfile в отдельный компонент.
 */
const About: React.FC<Props> = ({
                                    isEditMode,
                                    formData,
                                    onFieldChange,
                                    specialist,
                                    onEnterEdit,
                                }) => {
    // Теги услуг специалиста
    const serviceTags: string[] =
        specialist.professional_profiles
            ?.flatMap((profile) => profile.services?.map((s) => s.name) || [])
            .filter(Boolean) || [];

    // Пока жёсткий список пожеланий
    const wishesTags: string[] = [
        "От 30 000",
        "Только оказываемые услуги",
        "Одиночная работа",
        "От 2 недель",
    ];

    return (
        <div className={styles.about}>
            <h3 className={styles.title}>О специалисте</h3>

            {isEditMode ? (
                <input
                    type="text"
                    value={formData.description}
                    
                    onChange={(e) => onFieldChange("description", e.target.value)}
                    className={styles.inputField}
                    placeholder="Описание о себе"
                />
            ) : (
                <p className={styles.desc}>
                    {formData.description || "Описание не указано"}
                </p>
            )}

            <div className={styles.columns}>
                {/* ------------ Услуги ------------- */}
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h3 className={styles.title}>Оказываемые услуги</h3>
                    </div>

                    {!isEditMode && (
                        <div className={styles.column}>
                            <div className={styles.tagRow}>
                                <TagSection
                                    title=""
                                    tags={serviceTags}
                                    className={styles.tags}
                                    align="center"
                                />
                                <IconButton
                                    alt="Добавить"
                                    borderColor="var(--grey)"
                                    icon={Plus}
                                    border="none"
                                    onClick={onEnterEdit}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* ------------ Пожелания ------------- */}
                <div className={styles.wishes}>
                    <TagSection
                        title="Пожелания"
                        tags={wishesTags}
                        className={styles.column}
                        onAddClick={() => console.log("Добавить пожелание")}
                        addIcon={<img src={Plus} alt="Добавить" />}
                        align="center"
                    />
                </div>
            </div>
        </div>
    );
};

export default About;