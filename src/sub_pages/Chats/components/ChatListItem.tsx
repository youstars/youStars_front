import React from "react";
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
  return (
    <div
      className={`chat-list-item ${active ? "chat-list-item--active" : ""}`}
      onClick={onClick}
    >
      <div className="chat-list-item__avatar">
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
            name
          )}&background=${isBusiness ? "0077b6" : "random"}`}
          alt={name}
        />
      </div>
      <div className="chat-list-item__content">
        <div className="chat-list-item__header">
          <span className="chat-list-item__name">{name}</span>
          <span className="chat-list-item__time">{formatDate(time)}</span>
        </div>
        <div className="chat-list-item__status">{lastMessage}</div>
      </div>
      {unread ? <div className="chat-list-item__badge">{unread}</div> : null}
    </div>
  );
};

export default ChatListItem;
