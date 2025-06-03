// shared/store/slices/projectTasksSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../index";
import axiosInstance from "shared/api/api";
import { getCookie } from "shared/utils/cookies";
import { API_PROJECT_TASKS } from "shared/api/endpoints";
import { SpecialistShort } from "shared/types/tasks";



export interface ProjectTask {
  id: number;
  title: string;
  start_date: string;
  deadline: string;
  status: string;
  assigned_specialist: SpecialistShort[];

}

interface ProjectTasksState {
  tasks: ProjectTask[];
  status: "idle" | "pending" | "succeeded" | "rejected";
  error: string | null;
}

const initialState: ProjectTasksState = {
  tasks: [],
  status: "idle",
  error: null,
};

export const getProjectTasks = createAsyncThunk(
  "projectTasks/fetch",
  async (projectId: number, thunkAPI) => {
    try {
      const token = getCookie("access_token");
      const response = await axiosInstance.get(
        API_PROJECT_TASKS.getByProjectId(projectId),
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.results;
    } catch (error: any) {
      return thunkAPI.rejectWithValue("Ошибка при загрузке задач проекта");
    }
  }
);

const projectTasksSlice = createSlice({
  name: "projectTasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProjectTasks.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(getProjectTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tasks = action.payload;
      })
      .addCase(getProjectTasks.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload as string;
      });
  },
});

export const selectProjectTasks = (state: RootState) => state.projectTasks.tasks;
export const selectProjectTasksStatus = (state: RootState) => state.projectTasks.status;
export const selectProjectTasksError = (state: RootState) => state.projectTasks.error;

export const projectTasksReducer = projectTasksSlice.reducer;
export default projectTasksReducer;
