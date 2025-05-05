import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "shared/api/api";
import { RootState } from "shared/store";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export interface TaskSpecialist {
  id: number;
  title: string;
  status: string;
  description?: string;
  start_date?: string;
  deadline?: string;
  assigned_specialist?: number[];
  project?: number;
  [key: string]: any;
}

interface TasksState {
  tasks: TaskSpecialist[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

export const fetchSpecialistTasks = createAsyncThunk(
  "tasksSpecialist/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}task_specialist/`);
      return response.data.results; // массив задач
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Ошибка при загрузке задач специалиста");
    }
  }
);

const tasksSpecialistSlice = createSlice({
  name: "tasksSpecialist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpecialistTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpecialistTasks.fulfilled, (state, action: PayloadAction<TaskSpecialist[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchSpecialistTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectSpecialistTasks = (state: RootState) => state.tasksSpecialist.tasks;
export const selectTasksLoading = (state: RootState) => state.tasksSpecialist.loading;
export const selectTasksError = (state: RootState) => state.tasksSpecialist.error;

export default tasksSpecialistSlice.reducer;
