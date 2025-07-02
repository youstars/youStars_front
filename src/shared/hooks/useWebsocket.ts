import { useEffect } from "react";
import { useAppSelector } from "./useAppSelector";

import {
  fetchChats,
  setActiveChat,
  setActiveChatType,
  setError,
  setIsConnected,
} from "shared/store/slices/chatSlice";
import { ChatType, Message } from "shared/types/chat";
import { getCookie } from "shared/utils/cookies";
import {
  connectToWebSocket,
  sendMessageViaWebSocket,
} from "shared/providers/webSocket/webSocketService";
import { useAppDispatch } from "./useAppDispatch";

export const useChatService = () => {
  const dispatch = useAppDispatch();
  const chats = useAppSelector((state) => state.chat.chats);
  const activeChat = useAppSelector((state) => state.chat.activeChat);
  const isConnected = useAppSelector((state) => state.chat.isConnected);
  const error = useAppSelector((state) => state.chat.error);
  const isAdmin = parseInt(getCookie("user_id") || "1") === 1;

  const setActiveChatWithType = (chatId: string) => {
    const chat = chats.find((c) => c.id === chatId);
    if (chat) {
      dispatch(setActiveChat(chatId));
      dispatch(setActiveChatType(chat.type));
      connectToWebSocket(chatId, dispatch);
    }
  };

  const sendMessage = (text: string, replyTo?: Message | null) => {
    if (!activeChat) return;
    sendMessageViaWebSocket(text, activeChat, replyTo?.id);
  };

  const reconnect = () => {
    if (activeChat) {
      connectToWebSocket(activeChat, dispatch);
    } else {
      dispatch(setError("Нет активного чата"));
    }
  };

  useEffect(() => {
    const userId = parseInt(getCookie("user_id") || "1");
    const isAdmin = userId === 1;
    const defaultType: ChatType = "admin-specialist";

    if (isAdmin) {
Promise.all([
  dispatch(fetchChats("admin-specialist")),
  dispatch(fetchChats("admin-client")),
  dispatch(fetchChats("admin-project")),
]);

} else {
  dispatch(fetchChats(defaultType));
}

  }, [dispatch]);


  return {
    chats,
    activeChat,
    isConnected,
    error,
    isAdmin,
    sendMessage,
    setActiveChat: setActiveChatWithType,
    reconnect,
  };
};
