import styles from "./Header.module.scss";
import Avatar from "shared/UI/Avatar/Avatar";
import { Specialist, SpecialistFormData } from "shared/types/specialist";
import Phone from "shared/images/clientImgs/phone.svg";
import Mail from "shared/images/clientImgs/mail.svg";
import Web from "shared/images/clientImgs/network.svg";
import Chat from "shared/images/clientImgs/Chat.svg";
import Write from "shared/images/clientImgs/Write.svg";
import EditButton from "shared/UI/EditButton/EditButtton";

interface Props {
  customUser: Specialist["custom_user"];
  isBusy: boolean;
  overallRating: number;
  daysOnPlatform?: number;
  isEditMode: boolean;
  isAdmin: boolean;
  isSelfViewing: boolean;
  specialist: Specialist;
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
  onChatClick,
  specialist,
}) => {
  const nameToShow =
    customUser.first_name && customUser.last_name
      ? `${customUser.first_name} ${customUser.last_name}`
      : customUser.full_name || "ФИО не указано";

  return (
    <div className={styles.client}>
      <div className={styles.info}>
        <div className={styles.avatar}>
          <Avatar
            src={customUser.avatar}
            size="52px"
            onUpload={isEditMode ? onAvatarUpload : undefined}
          />
          <p className={styles.days}>{daysOnPlatform} дня</p>
        </div>

        <div className={styles.text}>
          {isEditMode ? (
            <>
              <input
                value={formData.firstName}
                className={styles.inputField}
                placeholder="Имя"
                onChange={(e) => onFieldChange("firstName", e.target.value)}
              />
              <input
                value={formData.lastName}
                className={styles.inputField}
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
            ) : isBusy ? (
              "Сейчас не доступен"
            ) : (
              "Доступен к проектам"
            )}
          </p>

          <div className={styles.editBtnBlock}>
            {isEditMode ? (
              <>
                <EditButton onClick={onSave}>Сохранить</EditButton>
                <EditButton variant="cancel" onClick={onToggleEdit}>
                  ✖ Отменить
                </EditButton>
              </>
            ) : (
              <EditButton onClick={onToggleEdit}>Изм. профиль</EditButton>
            )}
          </div>
        </div>
      </div>
      <div className={styles.contacts}>
        <p className={styles.contact}>
          <img src={Phone} alt="Телефон" />
          {isEditMode ? (
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => onFieldChange("phone", e.target.value)}
              className={styles.inputField}
            />
          ) : (
            <span>{formData.phone || "Не указано"}</span>
          )}
        </p>
        <p className={styles.contact}>
          <img src={Mail} alt="Почта" />
          {isEditMode ? (
            <input
              type="email"
              value={formData.email}
              onChange={(e) => onFieldChange("email", e.target.value)}
              className={styles.inputField}
            />
          ) : (
            <span>{formData.email || "Не указано"}</span>
          )}
        </p>
        <p className={styles.contact}>
          <img src={Web} alt="Web" />
          {isEditMode ? (
            <input
              type="text"
              value={formData.website}
              onChange={(e) => onFieldChange("website", e.target.value)}
              className={styles.inputField}
            />
          ) : (
            <span>{formData.website || "—"}</span>
          )}
        </p>
      </div>
      <div className={styles.metrics}>
        <p className={styles.metric}>
          Активность: {specialist.proj_per_quarter_count ?? 0} заявок
        </p>
        <p className={styles.metric}>
          Стоимость: {specialist.specialist_cost_total ?? 0} ₽
        </p>
        <p className={styles.metric}>
          Настроение: {specialist.satisfaction_rate ?? "—"}/5
        </p>
      </div>
      <div className={styles.icons}>
        <button className={styles.icon} onClick={onChatClick}>
          <img src={Chat} alt="Chat" />
        </button>
        <button className={styles.icon}>
          <img src={Write} alt="Write" />
        </button>
      </div>
    </div>
  );
};

export default Header;
