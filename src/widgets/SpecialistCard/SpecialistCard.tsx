import React from "react";
import styles from "./SpecialistCard.module.scss";
import PaperPlane from "shared/assets/icons/paperPlane.svg";
import Avatar from "shared/UI/Avatar/Avatar";
import Tag from "shared/UI/Tag/Tag";
import { useNavigate } from "react-router-dom";
import { Chat } from "shared/types/chat";
import { useChatService } from "shared/hooks/useWebsocket";
import IconButton from "shared/UI/IconButton/IconButton";

interface Specialist {
  id: number;
  custom_user: {
    id: number;
    avatar?: string;
    first_name?: string;
    full_name?: string;
    username?: string;
    role?: string | number;
    date_joined?: string;
  };
  total_rating?: number;
  self_description?: string;
  interest_first?: string[];
  projects_in_progress?: number;
  tasks_in_progress?: number;
}

interface SpecialistCardProps {
  specialist: Specialist;
}

const SpecialistCard: React.FC<SpecialistCardProps> = ({ specialist }) => {
  const { chats, setActiveChat } = useChatService();

  const handleChatClick = () => {
    const specialistUserId = String(specialist.custom_user?.id);
    console.log("specialist ID:", specialist.custom_user?.id);
    chats.forEach((chat: Chat) => {
      console.log("Чат ID:", chat.id);
      chat.participants?.some((p: any) => String(p.id) === specialistUserId);
    });
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

  const navigate = useNavigate();
  const handleProfileClick = () => {
    navigate(`/manager/specialists/${specialist.id}`);
  };

  return (
    <div className={styles.specialistCard}>
      <div className={styles.cardContent}>
        <Avatar
          src={specialist.custom_user?.avatar}
          alt={specialist.custom_user?.full_name || "ДАННЫХ НЕТ"}
        />
        <div className={styles.cardInfo}>
          <div className={styles.cardHeader}>
            <div className={styles.userInfo}>
              <div className={styles.nameContainer}>
                <h3 className={styles.name}>
                  {`${
                    specialist.custom_user?.first_name ||
                    specialist.custom_user?.username
                  } 
                  ${specialist.custom_user?.full_name || "ДАННЫХ НЕТ"}`}
                </h3>
                <div className={styles.rating}>
                  <span className={styles.star}>★</span>
                  <span>{specialist.total_rating || "0"}</span>
                </div>
              </div>
              <p className={styles.role}>
                {specialist.custom_user?.role || "ДАННЫХ НЕТ"}
              </p>
            </div>
            <div className={styles.actionGroup}>
              <div className={styles.buttons}>
              <IconButton icon={PaperPlane} alt="Chat" onClick={handleChatClick} title="Начать чат" />
                <button
                  className={styles.profileButton}
                  onClick={handleProfileClick}
                >
                  Профиль
                </button>
              </div>
            </div>
          </div>

          <p className={styles.description}>
            {specialist.self_description || "ДАННЫХ НЕТ"}
          </p>

          <div className={styles.skillList}>
            {(specialist.interest_first?.length
              ? specialist.interest_first
              : ["ДАННЫХ НЕТ"]
            ).map((skill, idx) => (
              <Tag key={idx} label={skill} />
            ))}
          </div>

          <div className={styles.metadata}>
            <span>
              Дата регистрации:{" "}
              {specialist.custom_user?.date_joined || "ДАННЫХ НЕТ"}
            </span>
            <span>
              Проекты в процессе: {specialist.projects_in_progress || "0"}
            </span>
            <span>
              Задачи в процессе: {specialist.tasks_in_progress || "0"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialistCard;
