import { useEffect, useRef, useState } from "react";

export const useWebSocket = (url: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket подключен:", url);
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((prev) => [...prev, data]);
      } catch (err) {
        console.error("Ошибка обработки WebSocket-сообщения:", err);
      }
    };

    ws.onerror = (error) => {
      console.error("❌ Ошибка WebSocket:", error);
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.warn("🔄 WebSocket закрыт, попытка переподключения...");
      setTimeout(() => {
        if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
          wsRef.current = new WebSocket(url);
        }
      }, 5000);
    };

    return () => {
      ws.close();
    };
  }, [url]);

  const sendMessage = (message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  };

  return { messages, sendMessage, isConnected };
};
