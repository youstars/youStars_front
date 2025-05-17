import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../index";
import axios from "axios";
import { getCookie } from "shared/utils/cookies";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getSpecialistById = createAsyncThunk(
  "specialist/fetchById",
  async (id: number, thunkAPI) => {
    try {
      const token = getCookie("access_token");

      const response = await axios.get(
        `${API_BASE_URL}${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Специалист", response.data);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "Ошибка запроса");
    }
  }
);

export const updateSpecialistMe = createAsyncThunk(
  "specialist/updateMe",
  async (data: any, thunkAPI) => {
    try {
      const token = getCookie("access_token");

      const response = await axios.patch(
        "http://127.0.0.1:8000/users/specialists/me/",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("🔄 Специалист обновлён:", response.data);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "Ошибка обновления специалиста");
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
      })
      .addCase(updateSpecialistMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSpecialistMe.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; 
      })
      .addCase(updateSpecialistMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Ошибка обновления";
      });
  },
});

export default specialistSlice.reducer;
export const selectSpecialist = (state: RootState) => state.specialist;
