// shared/store/slices/meSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "shared/store";
import { getCookie } from "shared/utils/cookies";
import axiosInstance from "shared/api/api";
import { API_ME } from "shared/api/endpoints";
import { fetchProfileWithRole } from "shared/utils/fetchProfileWithRole";

interface MeUser {
  id: number;
  role: string;
  username: string;
  full_name: string;
  avatar?: string | null;
  [key: string]: any;
}

interface MeState {
  data: MeUser | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

const initialState: MeState = {
  data: null,
  loading: false,
  error: null,
  initialized: false,
};


export const getMe = createAsyncThunk<MeUser, void, { rejectValue: string }>(
  "me/get",
  async (_, thunkAPI) => {
    try {
      const { data: user } = await axiosInstance.get(API_ME.base);
      const role = user.role?.toLowerCase();

      if (!role) return thunkAPI.rejectWithValue("Не удалось определить роль");

      switch (role) {
        case "specialist":
          return await fetchProfileWithRole(API_ME.specialist, role);
        case "client":
          return await fetchProfileWithRole(API_ME.client, role);
        case "admin":
          return await fetchProfileWithRole(API_ME.admin, role);
        default:
          console.warn("Неизвестная роль:", role);
          return user; 
      }
    } catch (err) {
      return thunkAPI.rejectWithValue("Не удалось получить пользователя");
    }
  }
);



export const updateMe = createAsyncThunk<MeUser, Partial<MeUser>, { rejectValue: string }>(
  "me/update",
  async (updateData, thunkAPI) => {
    try {
      const role = getCookie("user_role")?.toLowerCase();

      let endpoint = "";
      if (role === "client") endpoint = API_ME.update.client;
      else if (role === "specialist") endpoint = API_ME.update.specialist;
      else if (role === "admin") endpoint = API_ME.update.admin;
      else return thunkAPI.rejectWithValue("Неизвестная роль");

      const response = await axiosInstance.patch(endpoint, updateData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue("Не удалось обновить профиль");
    }
  }
);
const meSlice = createSlice({
  name: "me",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMe.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.initialized = false;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.initialized = true;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.error = action.payload || "Ошибка загрузки";
        state.loading = false;
        state.initialized = true;
        state.data = null;
      })
      .addCase(updateMe.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  },
});

export default meSlice.reducer;
export const selectMe = (state: RootState) => state.me;
