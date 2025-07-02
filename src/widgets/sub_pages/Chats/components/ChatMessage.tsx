import React, { useEffect, useRef, useState } from "react";
import styles from "./ChatMessage.module.scss";
import { Message } from "shared/types/chat";
import InvitationMessage from "./InvitationMessage/InvitationMessage";

interface ChatMessageProps {
  message: Message;
  onReply: (message: Message) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onReply }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setMenuPosition({ x: event.clientX, y: event.clientY });
    setShowMenu(true);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  const messageClassNames = [
    styles.message,
    message.isOwn ? styles.own : styles.other,
  ].join(" ");
useEffect(() => {
  if (message.message_type === "INVITATION") {
    console.log("📬 Приглашение от WebSocket:", message.invitation);
  }
}, [message]);

  return (
    <div className={messageClassNames} onContextMenu={handleContextMenu}>
      {showMenu && menuPosition && (
        <div
          ref={menuRef}
          className={styles.contextMenu}
          style={{ top: menuPosition.y, left: menuPosition.x }}
          onClick={() => {
            onReply(message);
            setShowMenu(false);
          }}
        >
          Ответить
        </div>
      )}

      <div className={styles.avatar}>
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(message.userName)}&background=random`}
          alt={message.userName}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.name}>{message.userName}</span>
          <span className={styles.time}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>

        {message.replyTo && (
          <div className={styles.reply}>
            <span className={styles.name}>{message.replyTo.userName}</span>
            <p className={styles.text}>{message.replyTo.text}</p>
          </div>
        )}
{message.message_type === "INVITATION" && message.invitation ? (
  <InvitationMessage invitation={message.invitation} />
) : (
  <p className={styles.text}>{message.text}</p>
)}


      </div>
    </div>
  );
};

export default ChatMessage;
