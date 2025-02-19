export interface Message {
    id: string;
    userId: string;
    userName: string;
    avatar?: string;
    text: string;
    timestamp: string;
    replyTo?: Message;
    highlighted?: boolean;
  }
  
  export interface User {
    id: string;
    name: string;
    avatar: string;
  }


  export interface Chat {
    id: string;
    name: string;
    status: string;
    lastActive: string;
    unread?: number;
    messages: Message[];
  }
  
