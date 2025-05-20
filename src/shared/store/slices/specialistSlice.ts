import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../index";
import axios from "axios";

// Вспомогательная функция для получения токена из куков
const getCookie = (name: string): string | undefined => {
  const value = `; ${document.cookie}`;
  return value.split(`; ${name}=`)[1]?.split(';')[0];
};

export const getSpecialistById = createAsyncThunk(
  "specialist/fetchById",
  async (id: number, thunkAPI) => {
    try {
      const token = getCookie("access_token");

      const response = await axios.get(
        `http://127.0.0.1:8000/users/specialists/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "Ошибка запроса");
    }
  }
);

interface SpecialistState {
  data: any;
  loading: boolean;
  error: string | null;
}

const initialState: SpecialistState = {
  data: null,
  loading: false,
  error: null,
};

const specialistSlice = createSlice({
  name: "specialist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSpecialistById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSpecialistById.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(getSpecialistById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Ошибка загрузки";
      });
  },
});

export default specialistSlice.reducer;
export const selectSpecialist = (state: RootState) => state.specialist;
