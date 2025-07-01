import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "shared/store";

interface Project {
  id: number;
  name: string;
  goal: string;
  solving_problems: string;
  product_or_service: string;
  extra_wishes: string;
  start_date?: string;
  updated_at?: string;
  deadline?: string;
  budget?: string;
  status: "in_progress" | "completed";
  client?: {
    full_name?: string;
    business_name?: string;
  };
  file?: any[];
  project_team?: {
    tracker?: any;
    specialists?: any[];
  };
}

interface ProjectsState {
  current: Project | null;
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProjectsState = {
  current: null,
  status: "idle",
  error: null,
};

// 🔄 Получить проект по ID
export const getProjectById = createAsyncThunk<Project, string>(
  "projects/getProjectById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/project/${id}/`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue("Ошибка загрузки проекта");
    }
  }
);

// ✅ Обновить поля проекта
export const updateProject = createAsyncThunk<
  Project,
  { id: number; updates: Partial<Project> }
>("projects/updateProject", async ({ id, updates }, { rejectWithValue }) => {
  try {
    const response = await axios.patch(`/project/${id}/`, updates);
    return response.data;
  } catch (err: any) {
    return rejectWithValue("Ошибка при обновлении проекта");
  }
});

// ⚙️ Обновить статус проекта
export const updateProjectStatus = createAsyncThunk<
  Project,
  { id: number; status: Project["status"] }
>("projects/updateProjectStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    const response = await axios.patch(`/project/${id}/`, { status });
    return response.data;
  } catch (err: any) {
    return rejectWithValue("Ошибка изменения статуса");
  }
});

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    clearProject(state) {
      state.current = null;
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProjectById.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(getProjectById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.current = action.payload;
      })
      .addCase(getProjectById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      .addCase(updateProject.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(updateProjectStatus.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(updateProjectStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearProject } = projectsSlice.actions;

export const selectCurrentProject = (state: RootState) => state.projects.current;
export const selectProjectsStatus = (state: RootState) => state.projects.status;
export const selectProjectsError = (state: RootState) => state.projects.error;

export default projectsSlice.reducer;
