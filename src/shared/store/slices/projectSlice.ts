import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../index";
import axios from "axios";
import { getCookie } from "shared/utils/cookies";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export interface Project {
   id: number; 
  name: string;
  start_date: string;
  updated_at: string;
  deadline: string;
  status: string;
  budget: string;
  goal: string;
  solving_problems: string;
  product_or_service: string;
  extra_wishes: string;
  client: {
    id: number;
    full_name: string;
    business_name: string;
    rating: number;
    mood: number;
  };
  project_team: {
    tracker: {
      id: number;
      full_name: string;
      tasks_total: number;
      tasks_in_progress: number;
      tasks_in_review: number;
      tasks_completed_percent: number;
    };
    specialists: {
      id: number;
      full_name: string;
      tasks_total: number;
      tasks_in_progress: number;
      tasks_in_review: number;
      tasks_completed: number;
      tasks_completed_percent: number;
    }[];
  };
  file: any[];
}

interface ProjectState {
  project: Project | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  project: null,
  loading: false,
  error: null,
};

export const getProjectById = createAsyncThunk(
  "project/getById",
  async (id: string | number, thunkAPI) => {
    try {
      const token = getCookie("access_token");
      const response = await axios.get(`${API_BASE_URL}project/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue("Ошибка загрузки проекта");
    }
  }
);

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProjectById.fulfilled, (state, action) => {
        state.project = action.payload;
        state.loading = false;
      })
      .addCase(getProjectById.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const projectReducer = projectSlice.reducer;
export const selectProject = (state: RootState) => state.project;
