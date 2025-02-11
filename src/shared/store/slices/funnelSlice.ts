import axiosInstance from "shared/api/api";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

const API_BASE_URL = "http://127.0.0.1:8000/ru/";

export const getOrders = createAsyncThunk(
    "funnel/getOrders",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${API_BASE_URL}orders`);
            console.log("API response:", response.data); // ✅ Проверяем структуру ответа
            return response.data;
        } catch (error: any) {
            console.error("Error fetching orders:", error);
            return rejectWithValue(error.response?.data || "Произошла ошибка");
        }
    }
);

interface Funnel {
    id: number;
    description: string;
    amount: string;
    creation_date: string;
    student: number;
    payment_status: boolean;
    status: number;
}

interface FunnelState {
    funnel: Funnel[];
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
            .addCase(getOrders.fulfilled, (state, action: PayloadAction<{ results: Funnel[] }>) => {
                state.status = "fulfilled";
                if (!action.payload.results) return;
                state.funnel = action.payload.results;
            })
            .addCase(getOrders.rejected, (state, action: PayloadAction<any>) => {
                state.status = "rejected";
                state.error = action.payload as string;
            });
    },
});

export const selectFunnel = (state: { funnel: FunnelState }) => state.funnel.funnel;
export const selectFunnelStatus = (state: { funnel: FunnelState }) => state.funnel.status;
export const selectFunnelError = (state: { funnel: FunnelState }) => state.funnel.error;

export default funnelSlice.reducer;
