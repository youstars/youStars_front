import React, { useState, useRef, useEffect, useMemo } from "react";
import styles from "./Chats.module.scss";
import { formatDate } from "shared/utils/formatDate";
import { getShortType } from "shared/utils/getShortType";
import ChatListItem from "./components/ChatListItem";
import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";
import type { Chat, Message } from "shared/types/chat";
import { useChatService } from "shared/hooks/useWebsocket";
import SearchInput from "shared/UI/SearchInput/SearchInput";
import Notifications from "Notifications/Notifications";

const Chats: React.FC = () => {
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const {
    chats,
    sendMessage,
    activeChat,
    setActiveChat,
    isConnected,
    error,
    reconnect,
    isAdmin,
  } = useChatService();

  const [activeTab, setActiveTab] = useState<
    "all" | "specialists" | "clients" | "projects"
  >("all");



  const getFilteredChats = () => {
    switch (activeTab) {
      case "specialists":
        return chats.filter(
          (chat: Chat) => getShortType(chat.type) === "specialist"
        );
      case "clients":
        return chats.filter(
          (chat: Chat) => getShortType(chat.type) === "client"
        );
      case "projects":
        return chats.filter(
          (chat: Chat) => getShortType(chat.type) === "project"
        );
      default:
        return chats;
    }
  };

  const filteredChats = getFilteredChats();
  const currentChat = activeChat
    ? chats.find((chat: Chat) => chat.id === activeChat)
    : null;

  useEffect(() => {

    if (!activeChat && filteredChats.length > 0) {
      setActiveChat(filteredChats[0].id);
    } else if (filteredChats.length === 0) {
      setActiveChat(null);
    }
  }, [filteredChats, activeChat, setActiveChat]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [currentChat?.messages?.length]);



  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    if (!isConnected) {
      alert("Нет соединения с сервером. Сообщение не отправлено.");
      return;
    }

    sendMessage(text, replyTo);
    setReplyTo(null);
  };

  const handleReply = (message: Message) => {
    setReplyTo(message);
  };

  // console.log(" Активный чат ID:", activeChat);
  // console.log(" Текущий чат:", currentChat);

  return (
    <div className={styles.appContainer}>
      <div className={styles.topSection}>
        <div className={styles.searchContainer}>
          <SearchInput />
        </div>

        <div className={styles.tabs}>
          {["all", "specialists", "clients", "projects"].map((tab) => (
            <div
              key={tab}
              className={`${styles.tab} ${
                activeTab === tab ? styles.active : ""
              }`}
              onClick={() => setActiveTab(tab as any)}
            >
              {tab === "all"
                ? "Все чаты"
                : tab === "specialists"
                ? "Специалисты"
                : tab === "clients"
                ? "Бизнесы"
                : "Проекты"}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.contentSection}>
        <div className={styles.chatList}>
          <div className={styles.chatListHeader}>
            <h3>Чаты</h3>
          </div>
          {filteredChats.map((chat: Chat) => (
            <ChatListItem
              key={chat.id}
              name={chat.type === "admin-project" ? "Проектный чат" : chat.name}
              lastMessage={chat.messages?.at(-1)?.text || "Нет сообщений"}
              time={chat.lastActive}
              unread={chat.unread}
              active={chat.id === activeChat}
              onClick={() => setActiveChat(chat.id)}
              isBusiness={chat.type === "admin-client"}
            />
          ))}
        </div>

        {currentChat ? (
          <div className={styles.chatContainer}>
            <div className={styles.chatHeader}>
              <div className={styles.user}>
                <div className={styles.avatar}>
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      currentChat.name
                    )}&background=random`}
                    alt={currentChat.name}
                  />
                </div>
                <div className={styles.text}>
                  <h2>{currentChat.name}</h2>
                  <span className={styles.status}>
                    {currentChat.status} • Последняя активность:{" "}
                    {formatDate(currentChat.lastActive)}
                  </span>
                </div>
              </div>
            </div>



            <div className={styles.messageList} ref={messageListRef}>
              {currentChat.messages?.length > 0 ? (
                currentChat.messages.map((message: Message) => {
                  return (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      onReply={handleReply}
                    />
                  );
                })
              ) : (
                <div className={styles.emptyChatMessage}>
                  <p>Нет сообщений. Начните общение прямо сейчас!</p>
                </div>
              )}
            </div>

            <ChatInput
              onSendMessage={handleSendMessage}
              replyTo={replyTo}
              cancelReply={() => setReplyTo(null)}
            />
          </div>
        ) : (
          <div
            className={styles.chatContainer}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ textAlign: "center", color: "#757575" }}>
              Выберите чат, чтобы начать общение
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;
