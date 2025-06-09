import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../index";
import Cookies from "js-cookie";
import { getCookie } from "shared/utils/cookies";
import { API_ME } from "shared/api/endpoints";
import axiosInstance from "shared/api/api";

export const updateMe = createAsyncThunk(
  "me/update",
  async (data: any, thunkAPI) => {
    try {
      const token = getCookie("access_token");

      const response = await axiosInstance.patch(API_ME.update, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.detail || "Ошибка обновления профиля"
      );
    }
  }
);

export const getMe = createAsyncThunk(
  "me/fetch",
  async (_, thunkAPI) => {
    try {
      const token = getCookie("access_token");
      console.log("Token:", token); 
      const response = await axiosInstance.get(API_ME.get, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error fetching me:", error); 
      return thunkAPI.rejectWithValue(
        error.response?.data || "Ошибка запроса"
      );
    }
  }
);

interface MeState {
  data: any;
  loading: boolean;
  error: string | null;
}

const initialState: MeState = {
  data: null,
  loading: false,
  error: null,
};

const meSlice = createSlice({
  name: "me",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
  state.loading = false;
  state.data = action.payload;

  const role = action.payload?.custom_user?.role || action.payload?.role;
  if (role) {
    Cookies.set("user_role", role, {
      expires: 7,
      secure: true,
      sameSite: "None",
    });
  }
})

      .addCase(getMe.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload as string;
 
  const token = getCookie("access_token");
  if (token) {
    state.data = { id: getCookie("user_id") || null };
  } else {
    state.data = null;
  }
});
  },
});

export default meSlice.reducer;
export const selectMe = (state: RootState) => state.me;
