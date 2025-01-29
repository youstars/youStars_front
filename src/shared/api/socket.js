import { io } from "socket.io-client";
import { addMessage, setConnectionStatus } from "./chatSlice";

export const connectToChat = (userId, dispatch) => {
  const socket = io(`ws://localhost:8000/ws/chat/admin-specialist/${userId}`, {
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("WebSocket подключен");
    dispatch(setConnectionStatus(true));
  });

  socket.on("message", (message) => {
    console.log("Получено сообщение:", message);
    dispatch(addMessage(message));
  });

  socket.on("disconnect", () => {
    console.log("WebSocket отключен");
    dispatch(setConnectionStatus(false));
  });

  return socket;
};
// 