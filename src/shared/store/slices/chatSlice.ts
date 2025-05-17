import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Chat, ChatType, Message } from "shared/types/chat";
import { getCookie } from "shared/utils/cookies";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


interface ChatState {
  chats: Chat[];
  activeChat: string | null;
  activeChatType: ChatType;
  isConnected: boolean;
  error: string | null;
  isAdmin: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: ChatState = {
  chats: [],
  activeChat: null,
  activeChatType: "admin-specialist",
  isConnected: false,
  error: null,
  isAdmin: false,
  status: "idle",
};


export const fetchChats = createAsyncThunk<Chat[], ChatType | undefined>(
  "chat/fetchChats",
  async (chatType, { rejectWithValue }) => {
    const token = getCookie("access_token") || "";
    const userId = parseInt(getCookie("user_id") || "1");
    const isAdmin = userId === 1;

    let url = `${API_BASE_URL}chat/chats/`;
    if (!isAdmin && chatType) {
      url += `?type=${chatType}`;
    }

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Ошибка загрузки чатов");

      const data = await response.json();
      console.log("данные чатов!!!", data);
      
      return data.map((chat: any) => {
        const otherParticipant = chat.participants?.find(
          (p: any) => parseInt(p.id) !== userId
        );

        const displayName =
          otherParticipant?.username ||
          (isAdmin
            ? `Чат ${chat.id}`
            : chat.participants?.find((p: any) => parseInt(p.id) === 1)?.username || "Админ");

        return {
          id: chat.id.toString(),
          name: displayName,
          status: "Online",
          lastActive: chat.updated_at || new Date().toLocaleTimeString(),
          unread: 0,
          messages: chat.messages ? chat.messages.map((msg: any) => ({
            id: msg.id?.toString() || msg.timestamp || `${Date.now()}-${Math.random()}`,
            userId: msg.sender_id?.id || msg.sender_id, 
            userName: msg.sender_id?.username || "Пользователь",
            text: msg.content || msg.message || "",
            timestamp: msg.timestamp || new Date().toISOString(),
            isOwn: (msg.sender_id?.id || msg.sender_id) === userId,
          })) : [],
          
          type: chat.chat_type,
          participants: chat.participants || [],
        };
      });
    } catch (err) {
      return rejectWithValue("Ошибка загрузки чатов");
    }
  }
);


const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChats(state, action: PayloadAction<Chat[]>) {
      state.chats = action.payload;
    },
    setActiveChat(state, action: PayloadAction<string | null>) {
      state.activeChat = action.payload;
    },
    setActiveChatType(state, action: PayloadAction<ChatType>) {
      state.activeChatType = action.payload;
    },
    setIsConnected(state, action: PayloadAction<boolean>) {
      state.isConnected = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setIsAdmin(state, action: PayloadAction<boolean>) {
      state.isAdmin = action.payload;
    },
    addMessage(state, action: PayloadAction<{ chatId: string; message: Message }>) {
        const { chatId, message } = action.payload;
        const chat = state.chats.find((c) => c.id === chatId);
        

        if (!chat) {
          console.warn("Чат не найден. Все чаты:");
          return;
        }
      
        if (!chat.messages) chat.messages = [];
        chat.messages.push(message);
      }
      
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.chats = action.payload;
        state.error = null;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});


export const {
  setChats,
  setActiveChat,
  setActiveChatType,
  setIsConnected,
  setError,
  setIsAdmin,
  addMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
