import React, { useEffect, useRef, useState } from "react";
import { Message } from "shared/types/chat";

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

  console.log("ChatMessage рендерит:", message);

  return (
    <div
      className={`message ${message.isOwn ? "message--own" : "message--other"}`}
      onContextMenu={handleContextMenu}
    >
      {showMenu && menuPosition && (
        <div
          ref={menuRef}
          className="message__context-menu"
          style={{ top: menuPosition.y, left: menuPosition.x }}
          onClick={() => {
            onReply(message);
            setShowMenu(false);
          }}
        >
          Ответить
        </div>
      )}

      <div className="message__avatar">
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(message.userName)}&background=random`}
          alt={message.userName}
        />
      </div>

      <div className="message__content">
        <div className="message__header">
          <span className="message__name">{message.userName}</span>
          <span className="message__time">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>

        {message.replyTo && (
          <div className="message__reply">
            <span className="message__reply-name">{message.replyTo.userName}</span>
            <p className="message__reply-text">{message.replyTo.text}</p>
          </div>
        )}

        <p className="message__text">{message.text}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
