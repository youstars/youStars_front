import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../index";
import axios from "axios";
import { getCookie } from "shared/utils/cookies";
import { ProfessionalArea } from "shared/types/professionalArea";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getSpecialistById = createAsyncThunk(
  "specialist/fetchById",
  async (id: number, thunkAPI) => {
    try {
      const token = getCookie("access_token");

      const response = await axios.get(
        `${API_BASE_URL}users/specialist/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // console.log("Специалист", response.data);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "Ошибка запроса");
    }
  }
);

export const getProfessionalAreas = createAsyncThunk(
  "specialist/getProfessionalAreas",
  async (_, thunkAPI) => {
    try {
      const token = getCookie("access_token");

      const response = await axios.get(
        `${API_BASE_URL}api/professional-areas/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(" Профессии получены", response.data.results);

      return response.data.results;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Ошибка получения профессий"
      );
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
      return thunkAPI.rejectWithValue(
        error.response?.data || "Ошибка обновления специалиста"
      );
    }
  }
);

export const updateProfessionalProfile = createAsyncThunk(
  "specialist/updateProfessionalProfile",
  async (    data: {

      specialist: number;
      professional_area: number;
      profession: number;
      services: number[];
    }, thunkAPI) => {
    try {
      const token = getCookie("access_token");

      const response = await axios.post(
        `${API_BASE_URL}api/professional-profiles/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("📤 Профиль профессии обновлён:", response.data);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Ошибка обновления профессионального профиля"
      );
    }
  }
);

interface Option {
  id: number;
  name: string;
}

interface SpecialistState {
  data: any;
  loading: boolean;
  error: string | null;
  professionalAreas: ProfessionalArea[];
}

const initialState: SpecialistState = {
  data: null,
  loading: false,
  error: null,
  professionalAreas: [],
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
        state.error = (action.payload as string) || "Ошибка загрузки";
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
        state.error = (action.payload as string) || "Ошибка обновления";
      })
      .addCase(getProfessionalAreas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfessionalAreas.fulfilled, (state, action) => {
        state.loading = false;
        state.professionalAreas = action.payload;
      })

      .addCase(getProfessionalAreas.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Ошибка загрузки профессий";
      })
      .addCase(updateProfessionalProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfessionalProfile.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateProfessionalProfile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          "Ошибка обновления профессионального профиля";
      });
  },
});

export default specialistSlice.reducer;
export const selectSpecialist = (state: RootState) => state.specialist;
