import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProjectDetail, ProjectSummary } from "shared/types/project";
import { getCookie } from "shared/utils/cookies";
import axiosInstance from "shared/api/api";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

interface ProjectsState {
  list: ProjectSummary[];
  current: ProjectDetail | null;
  status: "idle" | "pending" | "fulfilled" | "rejected";
  error: string | null;
}

const initialState: ProjectsState = {
  list: [],
  current: null,
  status: "idle",
  error: null,
};


export const getProjects = createAsyncThunk(
  "projects/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = getCookie("access_token");
      const response = await axiosInstance.get(`${API_BASE_URL}projects/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data.results as ProjectSummary[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Ошибка при загрузке проектов");
    }
  }
);


export const getProjectById = createAsyncThunk(
  "projects/getById",
  async (id: string | number, { rejectWithValue }) => {
    try {
      const token = getCookie("access_token");
      const response = await axiosInstance.get(`${API_BASE_URL}project/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data as ProjectDetail;
    } catch (err: any) {
      return rejectWithValue("Ошибка загрузки проекта");
    }
  }
);

export const updateProjectStatus = createAsyncThunk(
  "project/updateStatus",
  async ({ id, status }: { id: number; status: string }, thunkAPI) => {
    try {
      const token = getCookie("access_token");
      const response = await axiosInstance.patch(
        `${API_BASE_URL}project/${id}/`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue("Ошибка обновления статуса");
    }
  }
);


const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    clearCurrentProject(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProjects.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(getProjects.fulfilled, (state, action: PayloadAction<ProjectSummary[]>) => {
        state.status = "fulfilled";
        state.list = action.payload;
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload as string;
      })

      .addCase(getProjectById.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(getProjectById.fulfilled, (state, action: PayloadAction<ProjectDetail>) => {
        state.status = "fulfilled";
        state.current = action.payload;
      })
      .addCase(getProjectById.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentProject } = projectsSlice.actions;

export const selectProjects = (state: { projects: ProjectsState }) => state.projects.list;
export const selectCurrentProject = (state: { projects: ProjectsState }) =>
  state.projects.current;
export const selectProjectsStatus = (state: { projects: ProjectsState }) =>
  state.projects.status;
export const selectProjectsError = (state: { projects: ProjectsState }) =>
  state.projects.error;

export default projectsSlice.reducer;
