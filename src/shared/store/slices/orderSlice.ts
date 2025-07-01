import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "shared/store";
import { Order } from "shared/types/orders";
import { getCookie, getToken } from "shared/utils/cookies";
import axiosInstance from "shared/api/api";

const baseUrl = process.env.REACT_APP_API_BASE || "http://localhost:8000";
const token = getCookie("access_token") || "";


export const getOrderById = createAsyncThunk<Order, any>(
  "order/getOrderById",
  async (id, { rejectWithValue }) => {
    const token = getToken();
    if (!token) return rejectWithValue("Нет токена");

    const res = await fetch(`${baseUrl}/order/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return rejectWithValue("Не удалось получить заявку");
    }

    return await res.json();
  }
);


export const updateOrder = createAsyncThunk<Order, Partial<Order> & { id: string | number }>(
  "order/updateOrder",
  async ({ id, ...data }) => {
    const res = await fetch(`${baseUrl}/order/${id}/`, {
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


export const updateOrderStatus = createAsyncThunk<
  Order,
  { orderId: string; newStatus: string; approved_budget?: number },
  { rejectValue: string }
>(
  "order/updateOrderStatus",
  async ({ orderId, newStatus, approved_budget }, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) return rejectWithValue("Нет токена");

      const payload: any = {
        status: newStatus,
      };

      if (approved_budget !== undefined) {
        payload.approved_budget = approved_budget;
      }

      const response = await axiosInstance.patch<Order>(
        `/order/${orderId}/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Ошибка при обновлении статуса и бюджета:", error);
      return rejectWithValue(
        error.response?.data || "Ошибка при обновлении статуса"
      );
    }
  }
);



export const assignTrackerToOrder = createAsyncThunk<
  void,
  { orderId: string; trackerId: number },
  { rejectValue: string }
>(
  "funnel/assignTrackerToOrder",
  async ({ orderId, trackerId }, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) return rejectWithValue("Нет токена");

      console.log("Отправляем PATCH в assignTrackerToOrder:", {
  url: `/order/${orderId}/`,
  data: { tracker: trackerId },
});

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

export const updateOrderBudget = createAsyncThunk(
  "orders/updateBudget",
  async ({ orderId, approved_budget }: { orderId: string; approved_budget: number }) => {
    const token = getCookie("access_token") || "";
    const baseUrl = process.env.REACT_APP_API_BASE || "http://localhost:8000";

    const response = await fetch(`${baseUrl}/orders/${orderId}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ approved_budget }),
    });

    if (!response.ok) {
      throw new Error("Не удалось обновить бюджет");
    }

    return await response.json();
  }
);

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


      await axiosInstance.patch(`/order/${orderId}/`, {
        project_name: projectName,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });


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

export const updateOrderDeadline = createAsyncThunk<
  Order,
  { orderId: string; projectDeadline: string },
  { rejectValue: string }
>(
  "order/updateOrderDeadline",
  async ({ orderId, projectDeadline }, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) return rejectWithValue("Нет токена");

      const response = await axiosInstance.patch<Order>(
        `/order/${orderId}/`,
        { project_deadline: projectDeadline },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Ошибка при обновлении дедлайна:", error);
      return rejectWithValue(error.response?.data || "Ошибка при обновлении дедлайна");
    }
  }
);

export const updateOrderGoal = createAsyncThunk<
  Order,
  { orderId: string; orderGoal: string },
  { rejectValue: string }
>(
  "order/updateOrderGoal",
  async ({ orderId, orderGoal }, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) return rejectWithValue("Нет токена");

      const response = await axiosInstance.patch<Order>(
        `/order/${orderId}/`,
        { order_goal: orderGoal },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Ошибка при обновлении запроса:", error);
      return rejectWithValue(error.response?.data || "Ошибка при обновлении запроса");
    }
  }
);

export const updateOrderProductOrService = createAsyncThunk<
  Order,
  { orderId: string; productOrService: string },
  { rejectValue: string }
>(
  "order/updateOrderProductOrService",
  async ({ orderId, productOrService }, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) return rejectWithValue("Нет токена");

      const response = await axiosInstance.patch<Order>(
        `/order/${orderId}/`,
        { product_or_service: productOrService },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Ошибка при обновлении продукта или услуги:", error);
      return rejectWithValue(error.response?.data || "Ошибка при обновлении продукта или услуги");
    }
  }
);

export const updateOrderProblems = createAsyncThunk<
  Order,
  { orderId: string; solvingProblems: string },
  { rejectValue: string }
>(
  "order/updateOrderProblems",
  async ({ orderId, solvingProblems }, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) return rejectWithValue("Нет токена");

      const response = await axiosInstance.patch<Order>(
        `/order/${orderId}/`,
        { solving_problems: solvingProblems },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Ошибка при обновлении проблем:", error);
      return rejectWithValue(error.response?.data || "Ошибка при обновлении проблем");
    }
  }
);

export const updateOrderExtraWishes = createAsyncThunk<
  Order,
  { orderId: string; extraWishes: string },
  { rejectValue: string }
>(
  "order/updateOrderExtraWishes",
  async ({ orderId, extraWishes }, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) return rejectWithValue("Нет токена");

      const response = await axiosInstance.patch<Order>(
        `/order/${orderId}/`,
        { extra_wishes: extraWishes },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Ошибка при обновлении дополнительных пожеланий:", error);
      return rejectWithValue(error.response?.data || "Ошибка при обновлении пожеланий");
    }
  }
);

export const confirmPrepayment = createAsyncThunk<
  Order,
  { orderId: string },
  { rejectValue: string }
>(
  "order/confirmPrepayment",
  async ({ orderId }, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) return rejectWithValue("Нет токена");

      const response = await axiosInstance.patch<Order>(
        `/order/${orderId}/`,
        {
          payment_status: "prepaid",
          status: "working",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Ошибка при подтверждении предоплаты:", error);
      return rejectWithValue(error.response?.data || "Ошибка при обновлении");
    }
  }
);



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
      })
      .addCase(confirmPrepayment.fulfilled, (state, action: PayloadAction<Order>) => {
      state.current = action.payload;
})
      .addCase(updateOrderDeadline.fulfilled, (state, action: PayloadAction<Order>) => {
        state.current = action.payload;
      })
      .addCase(updateOrderGoal.fulfilled, (state, action: PayloadAction<Order>) => {
        state.current = action.payload;
      })
      .addCase(updateOrderProductOrService.fulfilled, (state, action: PayloadAction<Order>) => {
        state.current = action.payload;
      })
      .addCase(updateOrderProblems.fulfilled, (state, action: PayloadAction<Order>) => {
        state.current = action.payload;
      })
      .addCase(updateOrderExtraWishes.fulfilled, (state, action: PayloadAction<Order>) => {
        state.current = action.payload;
      })
  },
});

export const { clearOrder } = orderSlice.actions;
export const selectOrder = (state: RootState) => state.order;
export default orderSlice.reducer;
