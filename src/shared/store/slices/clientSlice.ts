import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "shared/api/api";
import { getCookie } from "shared/utils/cookies";
import { API_CLIENT } from "shared/api/endpoints";
import { Client } from "shared/types/client";


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

export const getClientById = createAsyncThunk<Client, number>(
  "client/getClientById",
  async (id, thunkAPI) => {
    try {
      const token = getCookie("access_token");
      const response = await axiosInstance.get(API_CLIENT.getById(id), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Ошибка при получении клиента по ID"
      );
    }
  }
);

export const updateClient = createAsyncThunk<Client, { id?: number; data: any }>(
  "client/updateClient",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const token = getCookie("access_token");
      const url = API_CLIENT.update(id);

      const response = await axiosInstance.patch(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Ошибка при обновлении клиента"
      );
    }
  }
);

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      })
      .addCase(updateClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        console.log("payload из updateClient:", action.payload.position);
        state.data = action.payload;
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default clientSlice.reducer;
