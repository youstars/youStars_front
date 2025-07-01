import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProjectDetail, ProjectSummary } from "shared/types/project";
import { getCookie } from "shared/utils/cookies";
import axiosInstance from "shared/api/api";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getProjects = createAsyncThunk(
  "projects/getProjects",
  async (_, { rejectWithValue }) => {
    try {
      const token = getCookie("access_token");
      const role = getCookie("user_role"); // e.g. "tracker" or "client"
      let url = `${API_BASE_URL}projects/`;
      if (role && role.toLowerCase().includes("client")) {
        const clientId = getCookie("user_role_id"); // cookie stores the current client.id
        if (!clientId) {
          throw new Error("Client id not found in cookies");
        }
        url = `${API_BASE_URL}client/${clientId}/projects`;
      }
      else if (role && role.toLowerCase().includes("specialist")) {
        const specialistId = getCookie("user_role_id"); // cookie stores the current specialist.id
        if (!specialistId) {
          throw new Error("Specialist id not found in cookies");
        }
        url = `${API_BASE_URL}specialist/${specialistId}/projects`;
      }

      const response = await axiosInstance.get(
        url,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.results;
    } catch (error: any) {
      console.error("Error fetching projects:", error);
      return rejectWithValue(error.response?.data || "Произошла ошибка");
    }
  }
);



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

export const updateProject = createAsyncThunk(
  "project/updateProject",
  async (
    { id, updates }: { id: number; updates: Partial<ProjectDetail> },
    thunkAPI
  ) => {
    try {
      const token = getCookie("access_token");
      const response = await axiosInstance.patch(
        `${API_BASE_URL}project/${id}/`,
        updates,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data as ProjectDetail;
    } catch (err: any) {
      return thunkAPI.rejectWithValue("Ошибка при обновлении проекта");
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
      .addCase(
        getProjects.fulfilled,
        (state, action: PayloadAction<ProjectSummary[]>) => {
          state.status = "fulfilled";
          state.list = action.payload;
        }
      )
      .addCase(getProjects.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload as string;
      })
      .addCase(
        updateProject.fulfilled,
        (state, action: PayloadAction<ProjectDetail>) => {
          state.current = action.payload;
        }
      )
      .addCase(updateProject.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(getProjectById.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(
        getProjectById.fulfilled,
        (state, action: PayloadAction<ProjectDetail>) => {
          state.status = "fulfilled";
          state.current = action.payload;
        }
      )
      .addCase(getProjectById.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentProject } = projectsSlice.actions;

export const selectProjects = (state: { projects: ProjectsState }) =>
  state.projects.list;
export const selectCurrentProject = (state: { projects: ProjectsState }) =>
  state.projects.current;
export const selectProjectsStatus = (state: { projects: ProjectsState }) =>
  state.projects.status;
export const selectProjectsError = (state: { projects: ProjectsState }) =>
  state.projects.error;

export default projectsSlice.reducer;
