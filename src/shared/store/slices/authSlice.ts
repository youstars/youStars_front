import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "shared/api/api";
import Cookies from "js-cookie";
import { getUserIdFromToken } from "shared/utils/cookies";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const register = createAsyncThunk(
  "auth/register",
  async (
    { role, formData }: { role: string; formData: any },
    { rejectWithValue }
  ) => {
    try {
      const endpoint =
        role === "student"
          ? "auth/users/specialist/registration/"
          : "auth/users/client/registration/";

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

interface ErrorType {
  [key: string]: string;
}

export const login = createAsyncThunk(
  "auth/login",
  async (
    { username, password }: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("auth/token/create/", {
        username,
        password,
      });

      const token = response.data.access;

      Cookies.set("access_token", token, {
        expires: 7,
        secure: true,
        sameSite: "None",
      });

      const userId = getUserIdFromToken();
      if (userId) {
        Cookies.set("user_id", userId.toString(), {
          expires: 7,
          secure: true,
          sameSite: "None",
        });
      }

      return {
        token,
        user: { id: userId || null, username: response.data.username },
      };
    } catch (error: any) {
      console.error("Login failed:", error);
      return rejectWithValue({
        general: error.response?.data?.detail || "Invalid credentials",
      });
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const refresh = Cookies.get("refresh_token");

      if (refresh) {
        await axiosInstance.post("/auth/token/logout/", { refresh });
      }

 
      ["access_token", "refresh_token", "user_id"].forEach((key) => {
        Cookies.remove(key, {
          path: "/",
          sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
          secure: process.env.NODE_ENV === "production",
        });
        console.log(`${key} after remove:`, Cookies.get(key)); 
      });

      return true;
    } catch (error) {
      console.error("Logout error:", error);
      return rejectWithValue("Ошибка выхода");
    }
  }
);
const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    error: null as ErrorType | null,
    user: null as null | { id: string | null; username: string },

  },
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "object" && action.payload !== null
            ? (action.payload as ErrorType)
            : { general: String(action.payload || "Unknown error") };
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          id: action.payload.user.id,
          username: action.payload.user.username,
        };
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "object" && action.payload !== null
            ? (action.payload as ErrorType)
            : { general: String(action.payload || "Invalid credentials") };
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.error = null;
        state.loading = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = {
          general: typeof action.payload === "string"
            ? action.payload
            : "Logout failed",
        };
      });
  },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
