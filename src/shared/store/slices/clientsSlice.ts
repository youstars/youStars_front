import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "shared/api/api";
import { getCookie } from "shared/utils/cookies";
import { API_CLIENTS, API_CLIENT } from "shared/api/endpoints";
import { Client } from "shared/types/client";

interface ClientsState {
  list: Client[];
  current: Client | null;
  loading: boolean;
  error: string | null;
}

const initialState: ClientsState = {
  list: [],
  current: null,
  loading: false,
  error: null,
};

// Получить всех клиентов
export const getClients = createAsyncThunk<Client[]>(
  "clients/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = getCookie("access_token");
      const response = await axiosInstance.get(API_CLIENTS.getAll, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.results;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || "Ошибка загрузки клиентов");
    }
  }
);

// Получить клиента по ID
export const getClientById = createAsyncThunk<Client, number>(
  "clients/getById",
  async (id, { rejectWithValue }) => {
    try {
      const token = getCookie("access_token");
      const response = await axiosInstance.get(API_CLIENT.getById(id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Ошибка при получении клиента по ID");
    }
  }
);

// Обновить клиента
export const updateClient = createAsyncThunk<Client, { id?: number; data: any }>(
  "clients/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const token = getCookie("access_token");
      const response = await axiosInstance.patch(API_CLIENT.update(id), data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Ошибка при обновлении клиента");
    }
  }
);

const clientsSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    clearClientError: (state) => {
      state.error = null;
    },
    clearCurrentClient: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClients.fulfilled, (state, action: PayloadAction<Client[]>) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(getClientById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClientById.fulfilled, (state, action: PayloadAction<Client>) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(getClientById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClient.fulfilled, (state, action: PayloadAction<Client>) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearClientError, clearCurrentClient } = clientsSlice.actions;

export const selectClients = (state: { clients: ClientsState }) => state.clients.list;
export const selectCurrentClient = (state: { clients: ClientsState }) => state.clients.current;
export const selectClientsLoading = (state: { clients: ClientsState }) => state.clients.loading;
export const selectClientsError = (state: { clients: ClientsState }) => state.clients.error;

export default clientsSlice.reducer;
