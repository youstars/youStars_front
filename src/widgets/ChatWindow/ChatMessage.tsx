
// interface Message {
//     id: string;
//     userId: number;
//     userName: string;
//     text: string;
//     timestamp: string;
//     isOwn: boolean;
//   }
  
//   interface Chat {
//     id: string;
//     name: string;
//     status: string;
//     lastActive: string;
//     unread: number;
//     messages: Message[];
//     type: 'specialist' | 'business' | 'project';
//   }

// interface ChatMessageProps {
//     message: Message;
//     onReply: (message: Message) => void;
//   }
  
//   export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onReply }) => (
//     <div className={`message ${message.isOwn ? 'message--own' : ''}`}>
//       <div className="message__content">
//         <span className="message__user">{message.userName}</span>
//         <p className="message__text">{message.text}</p>
//         <span className="message__time">
//           {new Date(message.timestamp).toLocaleTimeString()}
//         </span>
//         <button onClick={() => onReply(message)}>Ответить</button>
//       </div>
//     </div>
//   );
  
  