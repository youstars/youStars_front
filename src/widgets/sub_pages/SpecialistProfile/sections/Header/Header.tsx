import styles from "./Header.module.scss";
import Avatar from "shared/UI/Avatar/Avatar";
import {Specialist, SpecialistFormData} from "shared/types/specialist";

interface Props {
    customUser: Specialist["custom_user"];
    isBusy: boolean;
    overallRating: number;
    daysOnPlatform?: number;
    isEditMode: boolean;
    isAdmin: boolean;
    isSelfViewing: boolean;
    formData: SpecialistFormData;
    onChatClick?: () => void;
    onFieldChange: (k: keyof SpecialistFormData, v: string) => void;
    onAvatarUpload: (f: File) => void;
    onToggleEdit: () => void;
    onSave: () => void;
}

const Header: React.FC<Props> = ({
                                     customUser,
                                     isBusy,
                                     overallRating,
                                     daysOnPlatform = 3,
                                     isEditMode,
                                     formData,
                                     onFieldChange,
                                     onAvatarUpload,
                                     onToggleEdit,
                                     onSave,
                                 }) => {
    const nameToShow = customUser.first_name && customUser.last_name
        ? `${customUser.first_name} ${customUser.last_name}`
        : customUser.full_name || "ФИО не указано";

    return (
        <div className={styles.client}>
            <div className={styles.info}>
                <div className={styles.avatar}>
                    <Avatar src={customUser.avatar} size="52px" onUpload={onAvatarUpload}/>
                    <p className={styles.days}>{daysOnPlatform} дня</p>
                </div>

                <div className={styles.text}>
                    {isEditMode ? (
                        <>
                            <input
                                value={formData.firstName}
                                placeholder="Имя"
                                onChange={(e) => onFieldChange("firstName", e.target.value)}
                            />
                            <input
                                value={formData.lastName}
                                placeholder="Фамилия"
                                onChange={(e) => onFieldChange("lastName", e.target.value)}
                            />
                        </>
                    ) : (
                        <h3 className={styles.name}>{nameToShow}</h3>
                    )}

                    <p className={styles.position}>Специалист</p>
                    <p className={styles.rating}>Рейтинг: {overallRating}/5</p>
                    <p className={styles.availability}>
                        {isEditMode ? (
                            /* select busy/available */
                            <select
                                className={styles.inputField}
                                value={formData.is_busy}
                                onChange={(e) => onFieldChange("is_busy", e.target.value)}
                            >
                                <option value="Available">Доступен к проектам</option>
                                <option value="Not available">Сейчас не доступен</option>
                            </select>
                        ) : isBusy ? "Сейчас не доступен" : "Доступен к проектам"}
                    </p>

                    <button
                        onClick={isEditMode ? onSave : onToggleEdit}
                        className={styles.editButton}
                    >
                        {isEditMode ? "Сохранить изменения" : "Изм. профиль"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Header;