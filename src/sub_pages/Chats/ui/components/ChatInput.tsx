import React, { useState, useRef, useEffect } from 'react';
// import { Smile, Paperclip, Send } from 'lucide-react';
import Smile from '../../../../shared/images/chatIcons/fi-br-laugh.svg'
import Mic from '../../../../shared/images/chatIcons/fi-br-microphone.svg'
import PaperPlane from '../../../../shared/images/chatIcons/fi-br-paper-plane.svg'
 

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <textarea
        ref={textareaRef}
        className="chat-input__field"
        placeholder="Сообщение..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />
      <div className="chat-input__actions">
        <button type="button" className="chat-input__button">
        <img src={Smile} alt="Smile Icon" width={20} height={20} />
        </button>
        <button type="button" className="chat-input__button">
        <img src={Mic} alt="Smile Icon" width={20} height={20} />
        </button>
        <button type="submit" className="chat-input__button">
        <img src={PaperPlane} alt="Smile Icon" width={20} height={20} />
        </button>
      </div>
    </form>
  );
}