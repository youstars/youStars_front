import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "shared/api/api";
import { getCookie } from "shared/utils/cookies"; 

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

export interface Specialist {
  id: number;
  age: number | null;
  before_university: string | null;
  course: string | null;
  custom_user: CustomUser;
  education_status: string | null;
  faculty: string | null;
  gender: string | null;
  hours_per_week: number | null;
  interest_first: string[];
  interest_second: string[];
  interest_third: string[];
  is_busy: string;
  manager_status: string | null;
  other_interest_first: string | null;
  other_interest_second: string | null;
  other_interest_third: string | null;
  position: number;
  projects_in_progress: number;
  self_description: string | null;
  subscription_end_date: string | null;
  tasks_in_progress: number;
  telegram_user_id: string | null;
  tg_nickname: string | null;
  total_rating: number;
  university: string | null;
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
