import React, { useState } from "react";
import { ChatMessage } from "./components/ChatMessage";
import { ChatInput } from "./components/ChatInput";
import { Message } from "./types/chat";
import Smile from "../../../shared/images/chatIcons/fi-br-laugh.svg";
import Search from "../../../shared/images/chatIcons/searchIcon.svg";
import "./Chats.scss";
import { Chat } from "./types/chat";

export default function Chats() {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: "1",
      name: "Сотский Виталий",
      status: "Something should be written here",
      lastActive: "10:13",
      unread: 2,
      messages: [
        {
          id: "1",
          userId: "1",
          userName: "Leo",
          text: "Something should be written here",
          timestamp: "10:13",
        },
        {
          id: "2",
          userId: "2",
          userName: "Сотский Виталий",
          text: "Something should be written here",
          timestamp: "10:13",
        },
      ],
    },
    {
      id: "2",
      name: "Попов Вадим",
      status: "Something should be written here",
      lastActive: "11:22",
      messages: [
        {
          id: "1",
          userId: "1",
          userName: "Leo",
          text: "Something should be written here",
          timestamp: "10:13",
        },
        {
          id: "2",
          userId: "2",
          userName: "Попов Вадим",
          text: "Something should be written here",
          timestamp: "10:13",
        },
        
      ],
    },
    {
      id: "3",
      name: "Adrian",
      status: "Something should be written here",
      lastActive: "11:22",
      messages: [
        {
          id: "1",
          userId: "1",
          userName: "Leo",
          text: "Something should be written here",
          timestamp: "10:13",
        },
        {
          id: "2",
          userId: "2",
          userName: "Попов Вадим",
          text: "Something should be written here",
          timestamp: "10:13",
        },
        
      ],
    }, {
      id: "4",
      name: "Edward",
      status: "Something should be written here",
      lastActive: "11:22",
      messages: [
        {
          id: "1",
          userId: "1",
          userName: "Leo",
          text: "Something should be written here",
          timestamp: "10:13",
        },
        {
          id: "2",
          userId: "2",
          userName: "Попов Вадим",
          text: "Something should be written here",
          timestamp: "10:13",
        },
        
      ],
    },
  ]);

  const [activeChat, setActiveChat] = useState<string>(chats[0].id);
  const [replyTo, setReplyTo] = useState<Message | null>(null);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const currentChat = chats.find((chat) => chat.id === activeChat);
    if (!currentChat) return;

    const newMessage: Message = {
      id: String(Date.now()),
      userId: "1",
      userName: "Leo",
      text,
      timestamp: new Date().toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      replyTo: replyTo || undefined, // ✅ Теперь replyTo - это объект, а не ID
    };

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChat
          ? { ...chat, messages: [...chat.messages, newMessage] }
          : chat
      )
    );

    setReplyTo(null);
  };

  const handleReply = (message: Message) => {
    setReplyTo(message);
  };

  const currentChat = chats.find((chat) => chat.id === activeChat);

  return (
    <div className="app-container">
      <div className="top-section">
        <div className="search-container">
          <input type="text" placeholder="Поиск" className="search-input" />
          <img src={Search} alt="Search Icon" className="search-icon" />
        </div>

        <div className="tabs">
          <div className="tab active">Все</div>
          <div className="tab">Специалисты</div>
          <div className="tab">Проекты</div>
          <div className="tab tab--yellow">Клиенты</div>
        </div>
      </div>
      <div className="content-section">
        <div className="chat-list">
          {chats.map((chat) => (
            <ChatListItem
              key={chat.id}
              name={chat.name}
              status={chat.status}
              time={chat.lastActive}
              unread={chat.unread}
              active={chat.id === activeChat}
              onClick={() => setActiveChat(chat.id)}
            />
          ))}
        </div>
        {currentChat && (
          <div className="chat-container">
            <div className="chat-header">
              <div className="chat-header__user">
                <div className="chat-header__avatar">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      currentChat.name
                    )}&background=random`}
                    alt={currentChat.name}
                  />
                </div>
                <div className="chat-header__text">
                  <h2>{currentChat.name}</h2>
                  <span className="chat-header__status">
                    Был(а) в {currentChat.lastActive}
                  </span>
                </div>
              </div>
            </div>

            <div className="message-list">
              {currentChat.messages.map((message: Message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  onReply={handleReply}
                />
              ))}
            </div>

            {replyTo && (
              <div className="chat-reply">
                <span className="chat-reply__name">{replyTo.userName}</span>
                <p className="chat-reply__text">{replyTo.text}</p>
                <button
                  className="chat-reply__close"
                  onClick={() => setReplyTo(null)}
                >
                  ✖
                </button>
              </div>
            )}

            <ChatInput onSendMessage={handleSendMessage} />
          </div>
        )}
      </div>
    </div>
  );
}


interface ChatListItemProps {
  name: string;
  status: string;
  time: string;
  unread?: number;
  active?: boolean;
  onClick: () => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({
  name,
  status,
  time,
  unread,
  active,
  onClick,
}) => (
  <div
    className={`chat-list-item ${active ? "chat-list-item--active" : ""}`}
    onClick={onClick}
  >
    <div className="chat-list-item__avatar">
      <img
        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
          name
        )}&background=random`}
        alt={name}
      />
    </div>
    <div className="chat-list-item__content">
      <div className="chat-list-item__header">
        <span className="chat-list-item__name">{name}</span>
        <span className="chat-list-item__time">{time}</span>
      </div>
      <div className="chat-list-item__status">{status}</div>
    </div>
    {unread && <div className="chat-list-item__badge">{unread}</div>}
  </div>
);
