import React from 'react';
import { Message } from '../types/chat';

interface ChatMessageProps {
  message: Message;
  onReply: (message: Message) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onReply }) => {
  const handleReply = () => {
    onReply(message);
  };

  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className={`message ${message.isOwn ? 'message--own' : 'message--other'}`}>
      <div className="message__bubble">
        {!message.isOwn && <div className="message__name">{message.userName}</div>}
        <div className="message__text">{message.text}</div>
        <div className="message__time">{formattedTime}</div>
      </div>
      <div className="message__actions">
        <button 
          onClick={handleReply} 
          style={{ 
            background: 'none', 
            border: 'none', 
            fontSize: '12px', 
            color: '#1890ff', 
            cursor: 'pointer',
            marginTop: '5px'
          }}
        >
          Reply
        </button>
      </div>
    </div>
  );
};