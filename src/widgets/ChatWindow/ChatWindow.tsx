// import React, { useState, useRef, useEffect } from "react";
// import { Search, AlertCircle, UserPlus, Building } from "lucide-react";
// import "./Chats.scss";
// import { useWebSocket } from "context/WebSocketContext";
// import { ChatInput } from "./ChatInput";
// import { ChatMessage } from "./ChatMessage";
// import { getCookie } from "app/utils/cookies";


// interface Message {
//   id: string;
//   userId: number;
//   userName: string;
//   text: string;
//   timestamp: string;
//   isOwn: boolean;
// }

// interface Chat {
//   id: string;
//   name: string;
//   status: string;
//   lastActive: string;
//   unread: number;
//   messages: Message[];
//   type: 'specialist' | 'business' | 'project';
// }



// export default function Chats() {
//   const [replyTo, setReplyTo] = useState<Message | null>(null);
//   const [newChatId, setNewChatId] = useState<string>("");
//   const [showNewChatForm, setShowNewChatForm] = useState<boolean>(false);
//   const [chatType, setChatType] = useState<'specialist' | 'business' | 'project'>('specialist');
//   const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
//   const [isLoadingProject, setIsLoadingProject] = useState(false);
//   const messageListRef = useRef<HTMLDivElement>(null);
//   const { 
//     chats, 
//     setChats,
//     sendMessage, 
//     activeChat, 
//     setActiveChat, 
//     setActiveChatType,
//     isConnected, 
//     error, 
//     reconnect,
//     createChat,
//     isAdmin,
//     connectWebSocket, 
//   } = useWebSocket();

//   const handleSendMessage = (text: string) => {
//     if (!text.trim()) return;
//     if (!isConnected) {
//       alert("Нет соединения с сервером. Сообщение не отправлено.");
//       return;
//     }
//     sendMessage(text);
//     setReplyTo(null);
//   };

//   const handleReply = (message: Message) => {
//     setReplyTo(message);
//   };

//   const handleCreateNewChat = () => {
//     if (!newChatId.trim()) {
//       alert("Пожалуйста, введите ID");
//       return;
//     }
  
//     const userId = parseInt(newChatId.trim());
//     if (isNaN(userId)) {
//       alert("Пожалуйста, введите корректный ID");
//       return;
//     }
  
//     const existingChat = chats.find(c => c.id === userId.toString() && c.type === chatType);
//     if (existingChat) {
//       alert("Чат с таким ID и типом уже существует");
//       setActiveChat(existingChat.id);
//       return;
//     }
  
//     createChat(userId, chatType);
//     if (error && error.includes('с самим собой')) {
//       alert(error); 
//     }
//     setNewChatId("");
//     setShowNewChatForm(false);
//   };

//   const fetchProjectChats = async (projectId: number) => {
//     setIsLoadingProject(true);
//     try {
//       const response = await fetch(`http://localhost:8000/chat/admin-project/${projectId}/`, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${getCookie('access_token')}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) throw new Error('Не удалось загрузить чаты проекта');

//       const data = await response.json();
//       console.log('📋 Ответ сервера для проекта:', data);

//       let projectChats: Chat[] = [];
//       if (data && typeof data === 'object') {
//         if (!chats.some(c => c.id === data.id.toString())) {
//           projectChats = [{
//             id: data.id.toString(),
//             name: data.participants?.[0]?.username || `Проект Чат ${data.id}`,
//             status: 'Online',
//             lastActive: data.created_at || new Date().toLocaleTimeString(),
//             unread: 0,
//             messages: data.messages || [],
//             type: 'project' as const,
//           }];
//         }
//       } else if (Array.isArray(data)) {
//         projectChats = data
//           .filter((chat: any) => !chats.some(c => c.id === chat.id.toString()))
//           .map((chat: any) => ({
//             id: chat.id.toString(),
//             name: chat.participants?.[0]?.username || `Чат ${chat.id}`,
//             status: 'Online',
//             lastActive: chat.created_at || new Date().toLocaleTimeString(),
//             unread: 0,
//             messages: chat.messages || [],
//             type: 'project' as const,
//           }));
//       }

//       if (projectChats.length > 0) {
//         setChats((prev: Chat[]) => [...prev, ...projectChats]);
//         setActiveChat(projectChats[0].id);
//         setActiveChatType('project');
//         connectWebSocket('project', projectId);
//       }
//     } catch (err) {
//       console.error('Ошибка при загрузке чатов проекта:', err);
//       alert('Не удалось загрузить чаты проекта');
//     } finally {
//       setIsLoadingProject(false);
//     }
//   };

//   const [activeTab, setActiveTab] = useState<'all' | 'specialists' | 'businesses' | 'projects'>('all');

//   const getFilteredChats = () => {
//     if (!isAdmin) return chats;
//     switch (activeTab) {
//       case 'specialists':
//         return chats.filter(chat => chat.type === 'specialist');
//       case 'businesses':
//         return chats.filter(chat => chat.type === 'business');
//       case 'projects':
//         return chats.filter(chat => chat.type === 'project');
//       case 'all':
//       default:
//         return chats;
//     }
//   };

//   const filteredChats = getFilteredChats();
//   const currentChat = activeChat ? chats.find((chat) => chat.id === activeChat) : null;

//   useEffect(() => {
//     if (!activeChat && filteredChats.length > 0) {
//       setActiveChat(filteredChats[0].id);
//     } else if (filteredChats.length === 0) {
//       setActiveChat(null);
//     }
//   }, [filteredChats, activeChat, setActiveChat]);

//   useEffect(() => {
//     if (messageListRef.current) {
//       messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
//     }
//   }, [currentChat?.messages?.length]);

//   return (
//     <div className="app-container">
//       <div className="top-section">
//         <div className="search-container">
//           <input type="text" placeholder="Поиск чата" className="search-input" />
//           <Search className="search-icon" />
//         </div>

//         {isAdmin && (
//           <div className="tabs">
//             <div 
//               className={`tab ${activeTab === 'all' ? 'active' : ''}`}
//               onClick={() => setActiveTab('all')}
//             >
//               Все чаты
//             </div>
//             <div 
//               className={`tab ${activeTab === 'specialists' ? 'active' : ''}`}
//               onClick={() => setActiveTab('specialists')}
//             >
//               Специалисты
//             </div>
//             <div 
//               className={`tab ${activeTab === 'businesses' ? 'active' : ''}`}
//               onClick={() => setActiveTab('businesses')}
//             >
//               Бизнесы
//             </div>
//             <div 
//               className={`tab ${activeTab === 'projects' ? 'active' : ''}`}
//               onClick={() => setActiveTab('projects')}
//             >
//               Проекты
//             </div>
//           </div>
//         )}

//         {isAdmin && (
//           <div className="project-selector">
//             <input
//               type="number"
//               placeholder="Введите ID проекта"
//               value={selectedProjectId || ''}
//               onChange={(e) => setSelectedProjectId(parseInt(e.target.value))}
//             />
//             <button
//               onClick={() => selectedProjectId && fetchProjectChats(selectedProjectId)}
//               disabled={!selectedProjectId || isLoadingProject}
//             >
//               {isLoadingProject ? "Загрузка..." : "Загрузить чаты проекта"}
//             </button>
//           </div>
//         )}
//       </div>
//       <div className="content-section">
//         <div className="chat-list">
//           <div className="chat-list-header">
//             <h3>Чаты</h3>
//             <button 
//               className="new-chat-button"
//               onClick={() => setShowNewChatForm(!showNewChatForm)}
//             >
//               <UserPlus size={16} />
//               <span>Новый чат</span>
//             </button>
//           </div>
          
//           {showNewChatForm && (
//             <div className="new-chat-form">
//               <div style={{ display: 'flex', marginBottom: '10px' }}>
//                 <button 
//                   className={`chat-type-button ${chatType === 'specialist' ? 'active' : ''}`}
//                   onClick={() => setChatType('specialist')}
//                 >
//                   <UserPlus size={14} />
//                   <span>Специалист</span>
//                 </button>
//                 <button 
//                   className={`chat-type-button ${chatType === 'business' ? 'active' : ''}`}
//                   onClick={() => setChatType('business')}
//                 >
//                   <Building size={14} />
//                   <span>Бизнес</span>
//                 </button>
//                 {isAdmin && (
//                   <button 
//                     className={`chat-type-button ${chatType === 'project' ? 'active' : ''}`}
//                     onClick={() => setChatType('project')}
//                   >
//                     <span>Проект</span>
//                   </button>
//                 )}
//               </div>
//               <input
//                 type="text"
//                 placeholder={`ID ${chatType === 'specialist' ? 'специалиста' : chatType === 'business' ? 'бизнеса' : 'проекта'}`}
//                 value={newChatId}
//                 onChange={(e) => setNewChatId(e.target.value)}
//                 className="new-chat-input"
//                 onKeyDown={(e) => e.key === 'Enter' && handleCreateNewChat()}
//               />
//               <button 
//                 className="new-chat-submit"
//                 onClick={handleCreateNewChat}
//               >
//                 Создать
//               </button>
//             </div>
//           )}
          
//           {filteredChats.map((chat) => (
//             <ChatListItem
//               key={chat.id}
//               name={chat.name}
//               status={chat.status}
//               time={chat.lastActive}
//               unread={chat.unread}
//               active={chat.id === activeChat}
//               onClick={() => setActiveChat(chat.id)}
//               isBusiness={chat.type === 'business'}
//             />
//           ))}
//         </div>
//         {currentChat ? (
//           <div className="chat-container">
//             <div className="chat-header">
//               <div className="chat-header__user">
//                 <div className="chat-header__avatar">
//                   <img
//                     src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentChat.name)}&background=random`}
//                     alt={currentChat.name}
//                   />
//                 </div>
//                 <div className="chat-header__text">
//                   <h2>{currentChat.name}</h2>
//                   <span className="chat-header__status">
//                     {currentChat.status} • Последняя активность: {currentChat.lastActive}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {!isConnected && (
//               <div className="connection-error">
//                 <div className="connection-error__title">
//                   <AlertCircle size={16} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
//                   Ошибка соединения
//                 </div>
//                 <div>{error || "Отключено от сервера чата"}</div>
//                 <button className="connection-error__button" onClick={reconnect}>
//                   Попробовать переподключиться
//                 </button>
//               </div>
//             )}

//             <div className="message-list" ref={messageListRef}>
//               {currentChat.messages.length > 0 ? (
//                 currentChat.messages.map((message: Message) => (
//                   <ChatMessage
//                     key={message.id}
//                     message={message}
//                     onReply={handleReply}
//                   />
//                 ))
//               ) : (
//                 <div className="empty-chat-message">
//                   <p>Нет сообщений. Начните общение прямо сейчас!</p>
//                 </div>
//               )}
//             </div>

//             {replyTo && (
//               <div className="chat-reply">
//                 <span className="chat-reply__name">{replyTo.userName}</span>
//                 <p className="chat-reply__text">{replyTo.text}</p>
//                 <button className="chat-reply__close" onClick={() => setReplyTo(null)}>
//                   ✖
//                 </button>
//               </div>
//             )}

//             <ChatInput onSendMessage={handleSendMessage} />
//           </div>
//         ) : (
//           <div className="chat-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//             <div style={{ textAlign: 'center', color: '#757575' }}>
//               Выберите чат, чтобы начать общение
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// interface ChatListItemProps {
//   name: string;
//   status: string;
//   time: string;
//   unread?: number;
//   active?: boolean;
//   onClick: () => void;
//   isBusiness?: boolean;
// }

// const ChatListItem: React.FC<ChatListItemProps> = ({
//   name,
//   status,
//   time,
//   unread,
//   active,
//   onClick,
//   isBusiness = false,
// }) => (
//   <div
//     className={`chat-list-item ${active ? "chat-list-item--active" : ""}`}
//     onClick={onClick}
//   >
//     <div className="chat-list-item__avatar">
//       <img
//         src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${isBusiness ? '0077b6' : 'random'}`}
//         alt={name}
//       />
//     </div>
//     <div className="chat-list-item__content">
//       <div className="chat-list-item__header">
//         <span className="chat-list-item__name">
//           {isBusiness && <Building size={14} style={{ marginRight: '5px', verticalAlign: 'middle' }} />}
//           {name}
//         </span>
//         <span className="chat-list-item__time">{time}</span>
//       </div>
//       <div className="chat-list-item__status">{status}</div>
//     </div>
//     {unread ? <div className="chat-list-item__badge">{unread}</div> : null}
//   </div>
// );


