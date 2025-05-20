import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "shared/api/api";
import { getCookie } from "shared/utils/cookies"; 
import { Specialist } from "shared/types/specialist";


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000/";
console.log("API_BASE_URL:", API_BASE_URL);


export const getSpecialists = createAsyncThunk(
  "specialists/getSpecialists",
  async (_, { rejectWithValue }) => {
    try {
      const token = getCookie("access_token"); 

      const response = await axiosInstance.get(
        `${API_BASE_URL}users/specialists/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Полученные специалисты:", response.data);
      return response.data.results;
    } catch (error: any) {
      console.error("Ошибка при получении специалистов:", error);
      return rejectWithValue(error.response?.data || "Произошла ошибка");
    }
  }
);

interface CustomUser {
  id: number;
  avatar: string | null;
  date_joined: string;
  email: string;
  first_name: string | null;
  full_name: string;
  groups: string[];
  role: number | string;
  username: string;
  phone_number: string | null;
}


interface SpecialistsState {
  list: Specialist[];
  loading: boolean;
  error: string | null;
}


const initialState: SpecialistsState = {
  list: [],
  loading: false,
  error: null,
};


const specialistsSlice = createSlice({
  name: "specialists",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSpecialists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSpecialists.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getSpecialists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});


export const { clearError } = specialistsSlice.actions;
export default specialistsSlice.reducer;
