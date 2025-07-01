import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "shared/api/api";
import Cookies from "js-cookie";
import { getUserIdFromToken } from "shared/utils/cookies";
import { API_ENDPOINTS } from "shared/api/endpoints";
import { jwtDecode } from "jwt-decode";

export const checkAuthFromCookies = createAsyncThunk(
  "auth/checkAuthFromCookies",
  async (_, { rejectWithValue }) => {
    const token = Cookies.get("access_token");

    if (!token) return rejectWithValue("No token");

    try {
      const decoded: any = jwtDecode(token);

      const user = {
        id: decoded.user_id,
        username: decoded.username,
        role: decoded.role,
        role_id: decoded.role_id,
      };

      return user;
    } catch (e) {
      return rejectWithValue("Invalid token");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (
    { role, formData }: { role: string; formData: any },
    { rejectWithValue }
  ) => {
    try {
      const endpoint =
        role === "student"
          ? API_ENDPOINTS.auth.registerSpecialist
          : API_ENDPOINTS.auth.registerClient;

      const response = await axiosInstance.post(endpoint, formData);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { general: "Something went wrong" }
      );
    }
  }
);

export const registerAdmin = createAsyncThunk(
  "auth/registerAdmin",
  async (formData: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.auth.registerAdmin,
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
      const response = await axiosInstance.post(API_ENDPOINTS.auth.login, {
        username,
        password,
      });

      const {
        access,
        refresh,
        role,
        username: userUsername,
        role_id,
      } = response.data;

      Cookies.set("access_token", access, {
        expires: 7,
        secure: true,
        sameSite: "None",
      });

      Cookies.set("refresh_token", refresh, {
        expires: 180,
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
      if (role_id) {
        Cookies.set("user_role_id", role_id.toString(), {
          expires: 7,
          secure: true,
          sameSite: "None",
        });
      }

      if (role) {
        Cookies.set("user_role", role, {
          expires: 7,
          secure: true,
          sameSite: "None",
        });
      }

      return {
        token: access,
        user: {
          id: userId || null,
          username: userUsername,
          role,
          role_id: role_id || null,
        },
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
        await axiosInstance.post(API_ENDPOINTS.auth.logout, { refresh });
      }

      [
        "access_token",
        "refresh_token",
        "user_id",
        "user_role",
        "user_role_id",
      ].forEach((key) => {
        Cookies.remove(key, {
          path: "/",
          sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
          secure: process.env.NODE_ENV === "production",
        });
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
    user: null as null | {
      id: string | null;
      username: string;
      role?: string;
      role_id?: number | null;
    },
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
          role: action.payload.user.role,
          role_id: action.payload.user.role_id,
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
          general:
            typeof action.payload === "string"
              ? action.payload
              : "Logout failed",
        };
      })
      .addCase(checkAuthFromCookies.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(registerAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "object" && action.payload !== null
            ? (action.payload as ErrorType)
            : { general: String(action.payload || "Unknown error") };
      });
  },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
