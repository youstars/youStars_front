import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../index";
import axios from "axios";


const getCookie = (name: string): string | undefined => {
  const value = `; ${document.cookie}`;
  return value.split(`; ${name}=`)[1]?.split(";")[0];
};

export const updateMe = createAsyncThunk(
  "me/update",
  async (data: any, thunkAPI) => {
    try {
      const token = getCookie("access_token");

      const response = await axios.patch("http://127.0.0.1:8000/auth/users/me/", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Обновленный профиль", response.data);
      
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data.detail || "Ошибка обновления профиля");
    }
  }
);


export const getMe = createAsyncThunk(
  "me/fetch",
  async (_, thunkAPI) => {
    try {
      const token = getCookie("access_token");

      const response = await axios.get("http://127.0.0.1:8000/users/profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
console.log("Полученный профиль", response.data);

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "Ошибка запроса");
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
      })
      .addCase(getMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default meSlice.reducer;
export const selectMe = (state: RootState) => state.me;
