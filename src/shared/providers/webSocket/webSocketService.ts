// shared/services/webSocketService.ts
import { AppDispatch } from "shared/store";
import { addMessage, setIsConnected, setError } from "shared/store/slices/chatSlice";
import { Message, WebSocketMessage } from "shared/types/chat";
import { getCookie } from "shared/utils/cookies";

let ws: WebSocket | null = null;
let reconnectAttempts = 0;
let reconnectTimeout: NodeJS.Timeout | null = null;

const processedMessages = new Set<string>();

export const connectToWebSocket = (chatId: string, dispatch: AppDispatch) => {
  const token = getCookie("access_token") || "";
  const userId = parseInt(getCookie("user_id") || "1");

  if (ws) ws.close(); 

  const wsUrl = `ws://${window.location.hostname}:8000/ws/chat/${chatId}/?token=${token}`;
  ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    dispatch(setIsConnected(true));
    reconnectAttempts = 0;
    console.log("✅ WebSocket подключён");
  };

  ws.onmessage = (event) => {
    const data: WebSocketMessage = JSON.parse(event.data);
    if (!data.chat_id || !data.sender_id || (!data.message && !data.content)) return;

    const messageId = data.message_id || `${data.timestamp || Date.now()}-${data.sender_id}-${(data.message || data.content || '').slice(0, 10)}`;
    if (processedMessages.has(messageId)) return;
    processedMessages.add(messageId);

    const sender = typeof data.sender_id === 'object' ? data.sender_id : { id: parseInt(data.sender_id), username: data.sender_name || "User" };

    const newMessage: Message = {
      id: messageId,
      userId: sender.id,
      userName: sender.username,
      text: data.message || data.content || '',
      timestamp: data.timestamp || new Date().toISOString(),
      isOwn: sender.id === userId,
    };

    dispatch(addMessage({ chatId: String(data.chat_id), message: newMessage }));

  };

  ws.onerror = () => {
    dispatch(setIsConnected(false));
    dispatch(setError("Ошибка WebSocket"));
    scheduleReconnect(chatId, dispatch);
  };

  ws.onclose = (event) => {
    dispatch(setIsConnected(false));
    if (!event.wasClean) scheduleReconnect(chatId, dispatch);
  };
};

const scheduleReconnect = (chatId: string, dispatch: AppDispatch) => {
  if (reconnectAttempts > 5) return;
  reconnectAttempts++;
  const delay = Math.min(30000, 1000 * 2 ** reconnectAttempts);

  if (reconnectTimeout) clearTimeout(reconnectTimeout);

  reconnectTimeout = setTimeout(() => {
    connectToWebSocket(chatId, dispatch);
  }, delay);
};

export const sendMessageViaWebSocket = (text: string, chatId: string, replyTo?: string | null) => {
  const userId = parseInt(getCookie("user_id") || "1");

  if (!text.trim() || !ws || ws.readyState !== WebSocket.OPEN) return;

  const timestamp = new Date().toISOString();

  const messageData: any = {
    message: text.trim(),
    chat_id: parseInt(chatId),
    timestamp,
    sender_id: userId,
  };

  if (replyTo) {
    messageData.reply_to = replyTo;
  }

  ws.send(JSON.stringify(messageData));
};
