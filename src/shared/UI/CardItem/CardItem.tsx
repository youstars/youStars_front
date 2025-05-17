import React from "react";
import styles from "./CardItem.module.scss";
import Chat from "shared/images/clientImgs/ChatIcon.svg";
import { Project } from "widgets/sub_pages/ClientProfile/components/ProjectBlock/ProjectBlock";
import { useNavigate } from "react-router-dom";
import { useChatService } from "shared/hooks/useWebsocket";

interface Props {
  project: Project;
}

export const CardItem: React.FC<Props> = ({ project }) => {
  const {
    name,
    budget,
    status,
    tracker,
    specialists,
    timeline,
  } = project;

  const amount = budget ? `${budget.toLocaleString("ru-RU")} ₽` : "—";
  const specialistStr = specialists.join(", ");
  const lastContact = timeline?.split(" - ")[1] ?? "—";
  const cardClass = `${styles.card} ${status === "completed" ? styles.cardCompleted : ""}`;

  const navigate = useNavigate();
  const { chats, setActiveChat } = useChatService();

  const handleChatClick = () => {
    const targetUsername = specialists?.[0]; 
    const chat = chats.find((chat: any) =>
      chat.participants?.some((p: any) => p.username === targetUsername)
    );

    if (chat) {
      setActiveChat(chat.id);
      navigate("/manager/chats");
    } else {
      alert("Чат с этим специалистом не найден.");
    }
  };

  return (
    <div className={cardClass}>
      <p className={styles.card__name}>{name}</p>

      <img
        src={Chat}
        alt="chat"
        className={styles.card__chatIcon}
        onClick={handleChatClick}
        style={{ cursor: "pointer" }}
      />

      <p className={styles.card__amount}>{amount}</p>
      <p className={styles.card__status}><span>Статус:</span> {status}</p>
      <p className={styles.card__tracker}>Трекер&nbsp;#{tracker}</p>
      <p className={styles.card__specialist}>{specialistStr}</p>
      <p className={styles.card__timeline}><span>Таймлайн:</span> {timeline}</p>
      <p className={styles.card__lastContact}><span>Последний контакт:</span> {lastContact}</p>
    </div>
  );
};
