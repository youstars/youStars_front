import React, { useRef, useState } from "react";
import styles from "./ChatInput.module.scss";
import Smile from "shared/images/chatIcons/fi-br-laugh.svg";
import Mic from "shared/images/chatIcons/fi-br-microphone.svg";
import PaperPlane from "shared/images/chatIcons/fi-br-paper-plane.svg";
import { Message } from "shared/types/chat";
import EmojiPicker from "emoji-picker-react";
import { EmojiClickData } from "emoji-picker-react";
import { useClickOutside } from "shared/hooks/useClickOutside";

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  replyTo?: Message | null;
  cancelReply?: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  replyTo,
  cancelReply,
}) => {
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
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);

  useClickOutside(pickerRef, () => setShowPicker(false));

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowPicker(false);
  };

  return (
    <>
      {replyTo && (
        <div className={styles.chatReply}>
          <span className={styles.name}>{replyTo.userName}</span>
          <p className={styles.text}>{replyTo.text}</p>
          <button className={styles.close} onClick={cancelReply}>
            ✖
          </button>
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
          <button
            type="button"
            className={styles.button}
            onClick={() => setShowPicker((prev) => !prev)}
          >
            <img src={Smile} alt="Smile Icon" />
          </button>

          {showPicker && (
            <div ref={pickerRef} className={styles.pickerWrapper}>
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                skinTonesDisabled
                lazyLoadEmojis
                searchDisabled
                height={300}
                width={280}
              />
            </div>
          )}

          <button type="button" className={styles.button}>
            <img src={Mic} alt="Mic Icon" />
          </button>
          <button type="submit" className={styles.button}>
            <img src={PaperPlane} alt="Send Icon" />
          </button>
        </div>
      </form>
    </>
  );
};

export default ChatInput;
