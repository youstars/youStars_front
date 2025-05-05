import React from "react";
import styles from "./ChatListItem.module.scss";
import { formatDate } from "shared/utils/formatDate";

interface ChatListItemProps {
  name: string;
  lastMessage: string;
  time: string;
  unread?: number;
  active?: boolean;
  onClick: () => void;
  isBusiness?: boolean;
}

const ChatListItem: React.FC<ChatListItemProps> = ({
  name,
  lastMessage,
  time,
  unread,
  active,
  onClick,
  isBusiness = false,
}) => {
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${isBusiness ? "0077b6" : "random"}`;

  return (
<div
  className={`${styles.chatListItem} ${active ? styles["chatListItem--active"] : ""}`}
  onClick={onClick}
>
  <div className={styles.avatar}>
    <img src={avatarUrl} alt={name} />
  </div>
  <div className={styles.content}>
    <div className={styles.header}>
      <span className={styles.name}>{name}</span>
      <span className={styles.time}>{formatDate(time)}</span>
    </div>
    <div className={styles.status}>{lastMessage}</div>
  </div>
  {unread ? <div className={styles.badge}>{unread}</div> : null}
</div>
  );
};

export default ChatListItem;