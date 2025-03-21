

export interface ChatMessage {
  id: string;
  content: string;
  sender_id: string;
  timestamp: string;
}

export interface Message {
  id: string;
  userId: number;
  userName: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

export interface Chat {
  id: string;
  name: string;
  status: string;
  lastActive: string;
  unread: number;
  messages: Message[];
  type: 'specialist' | 'business';
}
