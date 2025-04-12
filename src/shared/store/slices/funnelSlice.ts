import axiosInstance from "shared/api/api";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getOrders = createAsyncThunk(
    "funnel/getOrders",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${API_BASE_URL}orders`);
            console.log("API response:", response.data);
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

// Экспортируем getOrders под именем getFunnelData, чтобы его можно было вызывать через dispatch(getFunnelData())
export const getFunnelData = getOrders;

export default funnelSlice.reducer;
