import React, { useState, useRef, useEffect, useMemo } from "react";
import "./Chats.scss";
import { formatDate } from "shared/utils/formatDate";
import { getShortType } from "shared/utils/getShortType";
import ChatListItem from "./components/ChatListItem";
import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";
import type { Chat, Message } from "shared/types/chat";
import { useChatService } from "shared/hooks/useWebsocket";
import SearchInput from "shared/UI/SearchInput/SearchInput";

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
  

  const [activeTab, setActiveTab] = useState<"all" | "specialists" | "businesses" | "projects">("all");

  useEffect(() => {
    console.log("chats from store:", chats);
  }, [chats]);

  const getFilteredChats = () => {
    if (!isAdmin) return chats;
    switch (activeTab) {
      case "specialists":
        return chats.filter((chat: Chat) => getShortType(chat.type) === "specialist");
      case "businesses":
        return chats.filter((chat: Chat) => getShortType(chat.type) === "business");
      case "projects":
        return chats.filter((chat: Chat) => getShortType(chat.type) === "project");
      default:
        return chats;
    }
  };

  const filteredChats = getFilteredChats();
  const currentChat = useMemo(() => {
    return activeChat ? chats.find((chat: Chat) => chat.id === activeChat) : null;
  }, [activeChat, chats]);

  useEffect(() => {
    console.log("Отфильтрованные чаты:", filteredChats);
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

  useEffect(() => {
    console.log("Сообщения в currentChat:", currentChat?.messages);
  }, [currentChat?.messages]);

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

  console.log(" Активный чат ID:", activeChat);
  console.log(" Текущий чат:", currentChat);

  return (
    <div className="app-container">
      <div className="top-section">
        <div className="search-container">
         <SearchInput />
        </div>

        {isAdmin && (
          <div className="tabs">
            {["all", "specialists", "businesses", "projects"].map((tab) => (
              <div
                key={tab}
                className={`tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab as any)}
              >
                {tab === "all" ? "Все чаты" :
                 tab === "specialists" ? "Специалисты" :
                 tab === "businesses" ? "Бизнесы" : "Проекты"}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="content-section">
        <div className="chat-list">
          <div className="chat-list-header"><h3>Чаты</h3></div>
          {filteredChats.map((chat: Chat) => (
            <ChatListItem
              key={chat.id}
              name={chat.type === "admin-project" ? "Проектный чат" : chat.name}
              lastMessage={chat.messages?.at(-1)?.text || "Нет сообщений"}
              time={chat.lastActive}
              unread={chat.unread}
              active={chat.id === activeChat}
              onClick={() => setActiveChat(chat.id)}
              isBusiness={chat.type === "admin-business"}
            />
          ))}
        </div>

        {currentChat ? (
          <div className="chat-container">
            <div className="chat-header">
              <div className="chat-header__user">
                <div className="chat-header__avatar">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentChat.name)}&background=random`}
                    alt={currentChat.name}
                  />
                </div>
                <div className="chat-header__text">
                  <h2>{currentChat.name}</h2>
                  <span className="chat-header__status">
                    {currentChat.status} • Последняя активность: {formatDate(currentChat.lastActive)}
                  </span>
                </div>
              </div>
            </div>

            {!isConnected && (
              <div className="connection-error">
                <div className="connection-error__title">
                 
                  Ошибка соединения
                </div>
                <div>{error || "Отключено от сервера чата"}</div>
                <button className="connection-error__button" onClick={reconnect}>Попробовать переподключиться</button>
              </div>
            )}

            <div className="message-list" ref={messageListRef}>
              {currentChat.messages?.length > 0 ? (
                currentChat.messages.map((message: Message) => {
                  console.log("Рендеринг сообщения:", message);
                  return (
                    <ChatMessage key={message.id} message={message} onReply={handleReply} />
                  );
                })
              ) : (
                <div className="empty-chat-message">
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
          <div className="chat-container" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center", color: "#757575" }}>Выберите чат, чтобы начать общение</div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Chats;
