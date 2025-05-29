import React from "react";
import styles from "./SpecialistCard.module.scss";
import PaperPlane from "shared/assets/icons/paperPlane.svg";
import Plus from "shared/assets/icons/plus.svg";
import Avatar from "shared/UI/Avatar/Avatar";
import Tag from "shared/UI/Tag/Tag";
import { useNavigate } from "react-router-dom";
import { Chat } from "shared/types/chat";
import { useChatService } from "shared/hooks/useWebsocket";
import IconButton from "shared/UI/IconButton/IconButton";

import { Specialist } from "shared/types/specialist";

interface SpecialistCardProps {
  specialist: Specialist;
}

const SpecialistCard: React.FC<SpecialistCardProps> = ({ specialist }) => {
  const { chats, setActiveChat } = useChatService();
  const navigate = useNavigate();

  const handleChatClick = () => {
    const specialistUserId = String(specialist.custom_user?.id);
    const chat = chats.find((chat: Chat) =>
      chat.participants?.some((p: any) => String(p.id) === specialistUserId)
    );

    if (chat) {
      setActiveChat(chat.id);
      navigate("/manager/chats");
    } else {
      alert("Чат с этим специалистом не найден.");
    }
  };

  const formatValue = (value: any) => {
    if (
      value === null ||
      value === undefined ||
      value === "0" ||
      value === 0 ||
      value === "Not defined"
    ) {
      return "—";
    }
    return value;
  };

  const handleProfileClick = () => {
    navigate(`/manager/specialists/${specialist.id}`);
  };

  return (
    <div className={styles.specialistCard}>
      <div className={styles.cardHeader}>
        <Avatar
          size="55px"
          src={specialist.custom_user?.avatar}
          alt={specialist.custom_user?.full_name || "ДАННЫХ НЕТ"}
        />
        <div className={styles.headerContent}>
          <div className={styles.userInfo}>
            <div className={styles.nameContainer}>
              <h3 className={styles.name}>
                {specialist.custom_user?.first_name ||
                specialist.custom_user?.last_name
                  ? `${specialist.custom_user.first_name || ""} ${
                      specialist.custom_user.last_name || ""
                    }`.trim()
                  : specialist.custom_user?.full_name || "ДАННЫХ НЕТ"}
              </h3>
              <div className={styles.rating}>
                <span className={styles.star}>★</span>
                <span>{specialist.overall_rating || "0"}</span>
              </div>
            </div>
            <p className={styles.role}>
              {specialist.profession || "Профессия не указана"}
            </p>
            <p className={styles.availability}>
              {specialist.is_busy === "Available"
                ? "Доступен к проектам"
                : "Сейчас не доступен"}
            </p>
          </div>
        </div>
        <div className={styles.actionGroup}>
          <div className={styles.buttons}>
            <IconButton
              icon={PaperPlane}
              alt="Chat"
              onClick={handleChatClick}
              title="Начать чат"
            />
            <IconButton icon={Plus} alt="Add" onClick={handleChatClick} />
            <button
              className={styles.profileButton}
              onClick={handleProfileClick}
            >
              Профиль
            </button>
          </div>
        </div>
      </div>
      <div className={styles.cardDetails}>
        <p className={styles.description}>
          {specialist.self_description || "ДАННЫХ НЕТ"}
        </p>
        <div className={styles.skillList}>
          <span className={styles.label}>Услуги:</span>
          <div className={styles.tags}>
            {(specialist.services?.length
              ? specialist.services
              : ["Услуги не указаны"]
            ).map((service, idx) => (
              <Tag key={idx} label={service} />
            ))}
          </div>
        </div>
        <div className={styles.skillList}>
          <span className={styles.label}>Ниши:</span>
          <div className={styles.tags}>
            {(specialist.business_scopes?.length
              ? specialist.business_scopes
              : ["Ниши не указаны"]
            ).map((service, idx) => (
              <Tag key={idx} label={service} />
            ))}
          </div>
        </div>
        <div className={styles.stats}>
          <div>
            <strong>Проекты в работе:</strong>{" "}
            {formatValue(specialist.projects_in_progress_count)}
          </div>

          <div>
            <strong>Осталось задач:</strong>{" "}
            {formatValue(specialist.projects_in_progress_count)}
          </div>
          <div>
            <strong>Ставка:</strong> {formatValue(specialist.appr_hourly_rate)}
          </div>

          <div>
            <strong>Стоимость:</strong>{" "}
            {formatValue(specialist.specialist_cost_total)}
          </div>
          <div>
            <strong>Занятость:</strong>{" "}
            {formatValue(specialist.hours_per_week) !== "—"
              ? `${formatValue(specialist.hours_per_week)} в неделю`
              : "—"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialistCard;
