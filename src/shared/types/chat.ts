export type ChatType = "admin-specialist" | "admin-client" | "admin-project";
export type ShortChatType = "specialist" | "client" | "project";

export interface Message {
  id: string;
  userId: number;
  userName: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
  replyTo?: Message;
    message_type?: string;
  invitation?: {
    id: number;
    order_name: string;
    project_deadline: string | null;
    expires_at: string;
    status: "PENDING" | "APPROVED" | "REJECTED" | string;
  };
}

export interface Chat {
  id: string;
  name: string;
  status: string;
  project?: number; 
  chat_type: string;
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
  sender_id: string | { id: number; username: string };
  message?: string;
  content?: string;
  sender_name?: string;
  timestamp?: string;
  message_id?: string;

  message_type?: string;
  invitation?: {
    id: number;
    order_name: string;
    project_deadline: string | null;
    expires_at: string;
    status: string;
  };
}
