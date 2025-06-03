import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "shared/api/api";
import { getCookie } from "shared/utils/cookies";
import { API_CLIENTS } from "shared/api/endpoints";
import { Client } from "shared/types/client";

export const getClients = createAsyncThunk(
  "clients/getClients",
  async (_, { rejectWithValue }) => {
    try {
      const token = getCookie("access_token");

      const response = await axiosInstance.get(API_CLIENTS.getAll, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Полученные клиенты:", response.data);
      return response.data.results;
    } catch (error: any) {
      console.error("Ошибка при получении клиентов:", error);
      return rejectWithValue(
        error.response?.data?.detail || "Произошла ошибка при загрузке клиентов"
      );
    }
  }
);



interface ClientsState {
  list: Client[];
  loading: boolean;
  error: string | null;
}

const initialState: ClientsState = {
  list: [],
  loading: false,
  error: null,
};

const clientsSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    clearClientError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClients.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearClientError } = clientsSlice.actions;
export default clientsSlice.reducer;
