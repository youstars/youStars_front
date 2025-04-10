import React, { useRef, useState } from "react";
import styles from "./ChatInput.module.scss";
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
  <div className={styles.chatReply}>
    <span className={styles.name}>{replyTo.userName}</span>
    <p className={styles.text}>{replyTo.text}</p>
    <button className={styles.close} onClick={cancelReply}>✖</button>
  </div>
)}
      <form className={styles.chatInput} onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          className={styles.field}
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
  <div className={styles.actions}>
  <button type="button" className={styles.button}>
            <img src={Smile} alt="Smile Icon" />
          </button>
          <button type="button" className={styles.button}>
            <img src={Mic} alt="Mic Icon" />
          </button>
          <button type="button" className={styles.button}>
            <img src={PaperPlane} alt="Send Icon" />
          </button>
        </div>
      </form>
    </>
  );
};

export default ChatInput;