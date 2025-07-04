import React from "react";
import Avatar from "shared/UI/Avatar/Avatar";
import EditButton from "shared/UI/EditButton/EditButtton";
import styles from "../../ClientProfile.module.scss"; // файл тот же, что и раньше

export interface ClientHeaderProps {
    edit: boolean;
    form: {
        full_name: string;
        position: string;
        business_name: string;
    };
    avatar: string;
    rating: number;
    saving?: boolean;
    onChange: (
        field: "full_name" | "position" | "business_name"
    ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
    onAvatarUpload: (file: File) => void;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
}

/**
 * Визитка клиента: аватар, ФИО, должность, компания, рейтинг + кнопки edit/save.
 */
const ClientHeader: React.FC<ClientHeaderProps> = React.memo(
    ({
         edit,
         form,
         avatar,
         rating,
         saving = false,
         onChange,
         onAvatarUpload,
         onEdit,
         onSave,
         onCancel,
     }) => (
        <div className={styles.clientInfo}>
            {/* ==== аватар + дни ==== */}
            <div className={styles.clientAvatar}>
                <Avatar src={avatar} onUpload={onAvatarUpload}/>
                {/* TODO: передавать ageInDays пропсом, если нужно */}
                <p className={styles.clientDays}>3 дня</p>
            </div>

            {/* ==== текстовая часть ==== */}
            <div className={styles.clientText}>
                {edit ? (
                    <>
                        <input
                            className={styles.inputField}
                            value={form.full_name}
                            onChange={onChange("full_name")}
                            placeholder="ФИО"
                        />
                        <input
                            className={styles.inputField}
                            value={form.position}
                            onChange={onChange("position")}
                            placeholder="Должность"
                        />
                        <input
                            className={styles.inputField}
                            value={form.business_name}
                            onChange={onChange("business_name")}
                            placeholder="Название компании"
                        />
                    </>
                ) : (
                    <>
                        <h3 className={styles.clientName}>{form.full_name || "—"}</h3>
                        <p className={styles.clientPosition}>{form.position || "—"}</p>
                        <p className={styles.clientCompany}>
                            {form.business_name || "Компания не указана"}
                        </p>
                    </>
                )}

                <p className={styles.clientRating}>Рейтинг заказчика: {rating}/5</p>
                {/* ==== кнопки ==== */}
                <div className={styles.editButtonBlock}>
                    {edit ? (
                        <>
                            <EditButton onClick={saving ? undefined : onSave}>
                                {saving ? "Сохраняем…" : "Сохранить"}
                            </EditButton>
                            <EditButton variant="cancel" onClick={onCancel}>
                                ✖ Отменить
                            </EditButton>
                        </>
                    ) : (
                        <EditButton onClick={onEdit}>Изменить профиль</EditButton>
                    )}
                </div>
            </div>
        </div>
    )
);

ClientHeader.displayName = "ClientHeader";
export default ClientHeader;