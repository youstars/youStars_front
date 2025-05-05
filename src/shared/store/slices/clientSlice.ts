import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "shared/api/api";

export interface Client {
  id: number;
  custom_user: {
    id: number;
    full_name: string;
    email: string;
    avatar: string | null;
    phone_number: string | null;
    role: string;
  };
  business_name?: string;
  position?: string;
  revenue?: string;
  employee_count?: string;
  // добавь сюда остальные поля по мере необходимости
}

interface ClientState {
  data: Client | null;
  loading: boolean;
  error: string | null;
}

const initialState: ClientState = {
  data: null,
  loading: false,
  error: null,
};
// 🔹 Получить клиента по ID (не текущего)
export const getClientById = createAsyncThunk<Client, number>(
    "client/getClientById",
    async (id, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get(`/users/clients/${id}/`);
        return response.data;
      } catch (error: any) {
        return rejectWithValue("Ошибка при получении клиента по ID");
      }
    }
  );
  
// 🔹 GET текущего клиента
export const getClientMe = createAsyncThunk<Client>(
  "client/getClientMe",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/users/clients/");
      return response.data;
    } catch (error: any) {
      return rejectWithValue("Ошибка при получении клиента");
    }
  }
);

// 🔹 PATCH клиента
export const updateClient = createAsyncThunk<Client, Partial<Client>>(
  "client/updateClient",
  async (clientData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch("/users/clients/me/", clientData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue("Ошибка при обновлении клиента");
    }
  }
);

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getClientMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClientMe.fulfilled, (state, action: PayloadAction<Client>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getClientMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateClient.fulfilled, (state, action: PayloadAction<Client>) => {
        state.data = action.payload;
      })
      .addCase(getClientById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClientById.fulfilled, (state, action: PayloadAction<Client>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getClientById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
      
  },
});

export default clientSlice.reducer;
