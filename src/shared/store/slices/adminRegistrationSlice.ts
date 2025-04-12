import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "shared/api/api";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const registerAdmin = createAsyncThunk(
    "admin/register",
    async (formData: any, { rejectWithValue }) => {
        try {
            const endpoint = "ru/auth/users/admin/registration/";
            const response = await axiosInstance.post(
                `${API_BASE_URL}${endpoint}`,
                formData
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || { general: "Something went wrong" }
            );
        }
    }
);

interface AdminRegistrationState {
    loading: boolean;
    error: { [key: string]: string } | null;
    admin: any;
}

const initialState: AdminRegistrationState = {
    loading: false,
    error: null,
    admin: null,
};

const adminRegistrationSlice = createSlice({
    name: "adminRegistration",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registerAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.admin = action.payload;
            })
            .addCase(registerAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    typeof action.payload === "object" && action.payload !== null
                        ? (action.payload as { [key: string]: string })
                        : { general: String(action.payload || "Unknown error") };
            });
    },
});

export default adminRegistrationSlice.reducer;
