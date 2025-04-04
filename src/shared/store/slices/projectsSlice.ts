import axiosInstance from "shared/api/api";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getProjects = createAsyncThunk(
  "projects/getProjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}projects`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching projects:", error);
      return rejectWithValue(error.response?.data || "Произошла ошибка");
    }
  }
);

export interface Project {
  id: number;
  title: string;
  description: string;
  assigned_specialist: string;
  project: string;
  project_cost: string;
  start_date: string;
  end_date: string;
  total_tasks?: number;
  remaining_tasks?: number;
  is_finished?: boolean;
}

interface ProjectsState {
  projects: Project[];
  status: "idle" | "pending" | "fulfilled" | "rejected";
  error: string | null;
}

const initialState: ProjectsState = {
  projects: [],
  status: "idle",
  error: null,
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProjects.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(getProjects.fulfilled, (state, action: PayloadAction<Project[]>) => {
        state.status = "fulfilled";
        state.projects = action.payload;
      })
      .addCase(getProjects.rejected, (state, action: PayloadAction<any>) => {
        state.status = "rejected";
        state.error = action.payload as string;
      });
  },
});

export const selectProjects = (state: { projects: ProjectsState }) => state.projects.projects;
export const selectProjectsStatus = (state: { projects: ProjectsState }) => state.projects.status;
export const selectProjectsError = (state: { projects: ProjectsState }) => state.projects.error;

export default projectsSlice.reducer;
