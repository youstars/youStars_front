import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import axiosInstance from "shared/api/api";
import {getToken} from "shared/utils/cookies";
import {Order} from "../../types/orders";
import { API_ORDERS } from "shared/api/endpoints";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

interface GetOrdersResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Order[];
}

export const getOrders = createAsyncThunk<Order[], void, { rejectValue: string }>(
  "funnel/getOrders",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) return rejectWithValue("Токен отсутствует");

      const response = await axiosInstance.get<GetOrdersResponse>(
        `${API_BASE_URL}${API_ORDERS.list}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data.results;
    } catch (error: any) {
      console.error("Ошибка запроса /orders:", error);
      return rejectWithValue(error.response?.data || "Произошла ошибка при загрузке заявок");
    }
  }
);

export const createOrder = createAsyncThunk<void, Partial<Order>, { rejectValue: string }>(
  "funnel/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) return rejectWithValue("Токен отсутствует");

      await axiosInstance.post(`${API_BASE_URL}${API_ORDERS.create}`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error: any) {
      console.error("Ошибка при создании заявки:", error);
      return rejectWithValue(error.response?.data || "Ошибка при создании заявки");
    }
  }
);


interface FunnelState {
    funnel: Order[];
    status: "idle" | "pending" | "fulfilled" | "rejected";
    error: string | null;
}

const initialState: FunnelState = {
    funnel: [],
    status: "idle",
    error: null,
};

const funnelSlice = createSlice({
    name: "funnel",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getOrders.pending, (state) => {
                state.status = "pending";
                state.error = null;
            })
            .addCase(getOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
                state.status = "fulfilled";
                state.funnel = action.payload;
            })
            .addCase(getOrders.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.payload || "Неизвестная ошибка";
            })
            .addCase(createOrder.fulfilled, (state) => {
                state.status = "fulfilled";
            })

    },
});

export const selectFunnel = (state: { funnel: FunnelState }) => state.funnel.funnel;
export const selectFunnelStatus = (state: { funnel: FunnelState }) => state.funnel.status;
export const selectFunnelError = (state: { funnel: FunnelState }) => state.funnel.error;

export const getFunnelData = getOrders;
export default funnelSlice.reducer;
