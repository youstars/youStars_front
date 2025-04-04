import React, { useRef, useState } from "react";
import Smile from "shared/images/chatIcons/fi-br-laugh.svg";
import Mic from "shared/images/chatIcons/fi-br-microphone.svg";
import PaperPlane from "shared/images/chatIcons/fi-br-paper-plane.svg";
import { Message } from "shared/types/chat";

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  replyTo?: Message | null;
  cancelReply?: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, replyTo, cancelReply }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    }
  };

  return (
    <>
      {replyTo && (
        <div className="chat-reply">
          <span className="chat-reply__name">{replyTo.userName}</span>
          <p className="chat-reply__text">{replyTo.text}</p>
          <button className="chat-reply__close" onClick={cancelReply}>
            ✖
          </button>
        </div>
      )}

      <form className="chat-input" onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          className="chat-input__field"
          placeholder="Сообщение..."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (textareaRef.current) {
              textareaRef.current.style.height = "auto";
              textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
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
            <img src={Mic} alt="Mic Icon" width={20} height={20} />
          </button>
          <button type="submit" className="chat-input__button">
            <img src={PaperPlane} alt="Send Icon" width={20} height={20} />
          </button>
        </div>
      </form>
    </>
  );
};

export default ChatInput;
