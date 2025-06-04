import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "shared/store";
import { Order } from "shared/types/orders";
import { getCookie, getToken } from "shared/utils/cookies";
import axiosInstance from "shared/api/api";

const baseUrl = process.env.REACT_APP_API_BASE || "http://localhost:8000";
const token = getCookie("access_token") || "";

// Получить заявку по id
export const getOrderById = createAsyncThunk<Order, string>(
  "order/getOrderById",
  async (id) => {
    const res = await fetch(`${baseUrl}/order/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Не удалось получить заявку");
    }

    return await res.json();
  }
);

// Обновление заявки
export const updateOrder = createAsyncThunk<Order, Partial<Order> & { id: string | number }>(
  "order/updateOrder",
  async ({ id, ...data }) => {
    const res = await fetch(`${baseUrl}/orders/${id}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Ошибка обновления заявки");
    }

    return await res.json();
  }
);

// Обновление только статуса
export const updateOrderStatus = createAsyncThunk<
  Order,
  { orderId: string; newStatus: string },
  { rejectValue: string }
>(
  "order/updateOrderStatus",
  async ({ orderId, newStatus }, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) return rejectWithValue("Нет токена");

      const response = await axiosInstance.patch<Order>(
        `/order/${orderId}/`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Ошибка при обновлении статуса:", error);
      return rejectWithValue(error.response?.data || "Ошибка при обновлении статуса");
    }
  }
);

// Назначить трекера
export const assignTrackerToOrder = createAsyncThunk<
  void,
  { orderId: string; trackerId: string },
  { rejectValue: string }
>(
  "funnel/assignTrackerToOrder",
  async ({ orderId, trackerId }, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) return rejectWithValue("Нет токена");

      await axiosInstance.patch(`/order/${orderId}/`, {
        tracker: trackerId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error: any) {
      console.error("Ошибка назначения трекера:", error);
      return rejectWithValue(error.response?.data || "Ошибка при назначении трекера");
    }
  }
);

// Обновление названия + смена статуса на matching
export const updateOrderTitle = createAsyncThunk<
  Order,
  { orderId: string; projectName: string; currentStatus: string },
  { rejectValue: string }
>(
  "funnel/updateOrderTitle",
  async ({ orderId, projectName }, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) return rejectWithValue("Нет токена");

      // PATCH названия
      await axiosInstance.patch(`/order/${orderId}/`, {
        project_name: projectName,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // PATCH статуса и возврат нового объекта
      const response = await axiosInstance.patch<Order>(`/order/${orderId}/`, {
        status: "matching",
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error: any) {
      console.error("Ошибка при обновлении названия и статуса:", error);
      return rejectWithValue(error.response?.data || "Ошибка при обновлении");
    }
  }
);

// Интерфейс и начальное состояние
interface OrderState {
  current: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  current: null,
  loading: false,
  error: null,
};

// Слайс
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.current = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action: PayloadAction<Order>) => {
        state.current = action.payload;
        state.loading = false;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Ошибка загрузки";
      })
      .addCase(updateOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.current = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action: PayloadAction<Order>) => {
        state.current = action.payload;
      })
      .addCase(updateOrderTitle.fulfilled, (state, action: PayloadAction<Order>) => {
        state.current = action.payload;
      });
  },
});

export const { clearOrder } = orderSlice.actions;
export const selectOrder = (state: RootState) => state.order;
export default orderSlice.reducer;
