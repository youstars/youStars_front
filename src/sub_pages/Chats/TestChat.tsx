import React, { useState, useEffect, useRef } from "react";

interface ChatMessage {
  sender_id: number;
  sender_name: string;
  content: string;
  timestamp: string;
}

function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
}

export default function TestChat() {
  const specialistId = 11;
  const token = getCookie("access_token") || "demo-token"; // Fallback for demo
  const [chatData, setChatData] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const wsRef = useRef<WebSocket | null>(null);
  
  // Connect to WebSocket
  const connectWebSocket = (specialistId: number) => {
    setError("");
    
    // Use the correct WebSocket URL without the "9/" prefix
    const wsUrl = `ws://localhost:8000/ws/chat/admin-specialist/${specialistId}/?token=${token}`;
    
    try {
      // Close existing connection if any
      if (wsRef.current) {
        wsRef.current.close();
      }
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("✅ WebSocket connection established");
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Received data:", data);

        // Handle history - replace the entire chat data to avoid duplication
        if (data.history) {
          setChatData(data.history);
        } 
        // Handle new message - only add if it's not already in the chat
        else if (data.message) {
          const newMessage: ChatMessage = {
            sender_id: data.sender_id,
            sender_name: data.sender_name,
            content: data.message,
            timestamp: data.timestamp,
          };
          
          // Check if this message is already in the chat data to prevent duplication
          const isDuplicate = chatData.some(
            msg => 
              msg.content === newMessage.content && 
              msg.sender_id === newMessage.sender_id &&
              msg.timestamp === newMessage.timestamp
          );
          
          if (!isDuplicate) {
            setChatData(prevData => [...prevData, newMessage]);
          }
        }
      };

      ws.onerror = () => {
        console.error("❌ WebSocket error");
        setIsConnected(false);
        setError("Failed to connect to chat server");
      };

      ws.onclose = (event) => {
        console.log(`🔌 Connection closed. Code: ${event.code}, Reason: ${event.reason || "Not specified"}`);
        setIsConnected(false);
        
        if (!event.wasClean) {
          setError(`Connection closed unexpectedly (Code: ${event.code})`);
        }
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      setIsConnected(false);
      setError("Failed to create WebSocket connection");
    }
  };

  // Send message
  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const messageData = {
        message: newMessage.trim(),
      };
      wsRef.current.send(JSON.stringify(messageData));

      // We'll let the server echo back our message instead of adding it locally
      // This prevents duplication issues
      setNewMessage("");
    } else {
      setError("WebSocket not connected. Trying to reconnect...");
      connectWebSocket(specialistId);
    }
  };

  // Send message on Enter key press
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && newMessage.trim()) {
      sendMessage();
    }
  };

  // Connect on component mount
  useEffect(() => {
    connectWebSocket(specialistId);

    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // For demo purposes only
  useEffect(() => {
    if (token === "demo-token" && chatData.length === 0) {
      const demoMessages: ChatMessage[] = [
        {
          sender_id: 12,
          sender_name: "Support Agent",
          content: "Hello! How can I help you today?",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        }
      ];
      setChatData(demoMessages);
      setIsConnected(true);
    }
  }, [token]);

  return (
    <div>
      <h2>Chat with User</h2>
      
      {/* Connection status */}
      <div style={{ marginBottom: "10px" }}>
        Status: {isConnected ? "Connected" : "Disconnected"}
        {error && <div style={{ color: "red" }}>{error}</div>}
        {!isConnected && (
          <button 
            onClick={() => connectWebSocket(specialistId)}
            style={{ marginLeft: "10px" }}
          >
            Reconnect
          </button>
        )}
      </div>
      
      {/* Chat messages */}
      <div style={{ 
        maxHeight: "400px", 
        overflowY: "scroll", 
        border: "1px solid #ccc", 
        padding: "10px",
        marginBottom: "10px" 
      }}>
        {chatData.length === 0 ? (
          <div>No messages yet</div>
        ) : (
          chatData.map((msg, index) => (
            <div key={index} style={{ 
              marginBottom: "10px",
              textAlign: msg.sender_id === 0 ? "right" : "left",
              backgroundColor: msg.sender_id === 0 ? "#e6f7ff" : "#f0f0f0",
              padding: "8px",
              borderRadius: "5px"
            }}>
              <strong>{msg.sender_name}:</strong> {msg.content}
              <div style={{ fontSize: "12px", color: "#888" }}>
                {new Date(msg.timestamp).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message input */}
      <div style={{ display: "flex" }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyUp={handleKeyPress}
          placeholder="Type your message"
          style={{ 
            flex: 1, 
            padding: "10px",
            borderRadius: "4px 0 0 4px",
            border: "1px solid #ccc"
          }}
          disabled={!isConnected}
        />
        <button
          onClick={sendMessage}
          disabled={!newMessage.trim() || !isConnected}
          style={{ 
            padding: "10px 20px", 
            backgroundColor: !newMessage.trim() || !isConnected ? "#cccccc" : "#1890ff",
            color: "white",
            border: "none",
            borderRadius: "0 4px 4px 0",
            cursor: !newMessage.trim() || !isConnected ? "not-allowed" : "pointer"
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}