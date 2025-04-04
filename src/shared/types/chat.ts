export type ChatType = "admin-specialist" | "admin-business" | "admin-project";
export type ShortChatType = "specialist" | "business" | "project";

export interface Message {
  id: string;
  userId: number;
  userName: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
  replyTo?: Message;
}

export interface Chat {
  id: string;
  name: string;
  status: string;
  lastActive: string;
  unread: number;
  messages: Message[];
  type: ChatType;
  participants?: { id: string; username: string }[];
}


export interface WebSocketContextType {
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  activeChat: string | null;
  setActiveChat: (chatId: string) => void;
  setActiveChatType: (type: ChatType) => void;
  sendMessage: (text: string, replyTo?: Message | null) => void;
  isConnected: boolean;
  error: string | null;
  reconnect: () => void;
  refreshChats: () => void;
  isAdmin: boolean;
  connectWebSocket: (chatId: string) => void;
}



export interface WebSocketMessage {
  chat_id: string;
  sender_id: string;
  message?: string;
  content?: string;
  sender_name?: string;
  timestamp?: string;
  message_id?: string;
}
