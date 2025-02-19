import React, { useState, useEffect, useRef } from "react";
import { Message } from "../types/chat";

interface ChatMessageProps {
  message: Message;
  onReply: (message: Message) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onReply }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);


  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();

    const menuWidth = 120; 
    const menuHeight = 40; 
    const screenWidth = window.innerWidth; 
    const screenHeight = window.innerHeight; 

    let x = event.clientX;
    let y = event.clientY;

 
    if (x + menuWidth > screenWidth) {
      x -= menuWidth;
    }
    if (y + menuHeight > screenHeight) {
      y -= menuHeight;
    }

    setMenuPosition({ x, y });
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div 
      className={`message ${message.userId === "1" ? "message--own" : "message--other"}`} 
      onContextMenu={handleContextMenu} 
    >

      {showMenu && menuPosition && (
        <div 
          className="message__context-menu" 
          style={{ top: `${menuPosition.y}px`, left: `${menuPosition.x}px` }} 
          onClick={() => { onReply(message); setShowMenu(false); }}
          ref={menuRef}
        >
          Ответить
        </div>
      )}

      <div className="message__content">
        <div className="message__header">
          <span className="message__name">{message.userName}</span>
          <span className="message__time">{message.timestamp}</span>
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
