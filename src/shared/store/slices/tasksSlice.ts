import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Task, TaskStatus } from "shared/types/tasks";
import { getCookie } from "shared/utils/cookies";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getTasks = createAsyncThunk(
  "tasks/getTasks",
  async (_, { rejectWithValue }) => {
    try {
       const token = getCookie("access_token");
      const response = await axiosInstance.get<{ results: Task[] }>(
        "task_specialist/",
          {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return response.data;
    } catch (error: any) {
      console.error("Error fetching tasks:", error);
      return rejectWithValue(error.response?.data || "Произошла ошибка");
    }
  }
);



export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (
    data: {
      title: string;
      description: string;
      execution_period: number;
      status: TaskStatus;
      deadline: string;
      start_date: string;
      assigned_specialist: number[];
      material: string;
      notice: string;
      personal_grade: number;
      deadline_compliance: number;
      manager_recommendation: number;
      intricacy_coefficient: number;
      task_credits: number;
      status_priority: string;
      project: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post<Task>("task_specialist/", data);
      return response.data;
    } catch (error: any) {
      console.error("Error creating task:", error);
      return rejectWithValue(
        error.response?.data || "Ошибка при создании задачи"
      );
    }
  }
);

export const updateTaskDeadline = createAsyncThunk(
  "tasks/updateDeadline",
  async (
    { id, end_date }: { id: number; end_date: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.patch<Task>(`task_students/${id}/`, {
        end_date,
      });
      return response.data;
    } catch (error: any) {
      console.error("Error updating deadline:", error);
      return rejectWithValue(
        error.response?.data || "Ошибка при сохранении дедлайна"
      );
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  "tasks/updateStatus",
  async (
    { id, status }: { id: number; status: TaskStatus },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.patch<Task>(
        `task_specialist/${id}/`,
        { status }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error updating task status:", error);
      return rejectWithValue(
        error.response?.data || "Ошибка при обновлении статуса"
      );
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, data }: { id: number; data: Partial<Task> }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch<Task>(`/task_specialist/${id}/`, data);
      return response.data;
    } catch (error: any) {
      console.error("Error updating task:", error);
      return rejectWithValue(error.response?.data || "Ошибка при обновлении задачи");
    }
  }
);


interface TasksState {
  tasks: {
    results: Task[];
  };
  selectedTask: Task | null;
  status: "idle" | "pending" | "fulfilled" | "rejected";
  error: string | null;
  updatingTaskIds: number[];
}

const initialState: TasksState = {
  tasks: {
    results: [],
  },
  selectedTask: null,
  status: "idle",
  error: null,
  updatingTaskIds: [],
};

export const getTaskById = createAsyncThunk(
  "tasks/getTaskById",
  async (taskId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<{ results: Task[] }>(
        `/task_specialist/${taskId}/`
      );
      return response.data.results[0];
    } catch (error) {
      return rejectWithValue("Ошибка при получении задачи");
    }
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    optimisticUpdateTaskStatus: (
      state,
      action: PayloadAction<{ id: number; status: TaskStatus }>
    ) => {
      const { id, status } = action.payload;
      const taskIndex = state.tasks.results.findIndex((task) => task.id === id);
      if (taskIndex !== -1) {
        state.tasks.results[taskIndex] = {
          ...state.tasks.results[taskIndex],
          status,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTasks.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(
        getTasks.fulfilled,
        (state, action: PayloadAction<{ results: Task[] }>) => {
          state.status = "fulfilled";
          state.tasks = action.payload;
        }
      )
      .addCase(getTasks.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload as string;
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks.results.push(action.payload);
      })
      .addCase(
        updateTaskDeadline.fulfilled,
        (state, action: PayloadAction<Task>) => {
          const updatedTask = action.payload;
          const index = state.tasks.results.findIndex(
            (task) => task.id === updatedTask.id
          );
          if (index !== -1) {
            state.tasks.results[index] = {
              ...state.tasks.results[index],
              ...updatedTask,
            };
          }
        }
      )
      .addCase(updateTaskStatus.pending, (state, action) => {
        const id = (action.meta.arg as { id: number }).id;
        state.updatingTaskIds.push(id);
      })
      .addCase(
        updateTaskStatus.fulfilled,
        (state, action: PayloadAction<Task>) => {
          const updatedTask = action.payload;
          const index = state.tasks.results.findIndex(
            (task) => task.id === updatedTask.id
          );
          if (index !== -1) {
            state.tasks.results[index] = {
              ...state.tasks.results[index],
              ...updatedTask,
            };
          }
          state.updatingTaskIds = state.updatingTaskIds.filter(
            (id) => id !== updatedTask.id
          );
        }
      )
      .addCase(getTaskById.fulfilled, (state, action: PayloadAction<Task>) => {
        const fetchedTask = action.payload;
        const index = state.tasks.results.findIndex(
          (task) => task.id === fetchedTask.id
        );
        if (index !== -1) {
          state.tasks.results[index] = fetchedTask;
        } else {
          state.tasks.results.push(fetchedTask);
        }
      })

      .addCase(updateTaskStatus.rejected, (state, action) => {
        const id = (action.meta.arg as { id: number }).id;
        state.updatingTaskIds = state.updatingTaskIds.filter(
          (taskId) => taskId !== id
        );
        state.error = action.payload as string;

        if (action.meta.arg) {
          const { id, status: originalStatus } = action.meta.arg as {
            id: number;
            status: TaskStatus;
          };
          const taskIndex = state.tasks.results.findIndex(
            (task) => task.id === id
          );
          if (taskIndex !== -1) {
            state.tasks.results[taskIndex] = {
              ...state.tasks.results[taskIndex],
              status: originalStatus,
            };
          }
        }
      });
  },
});

export const { optimisticUpdateTaskStatus } = tasksSlice.actions;
export const selectTasks = (state: { tasks: TasksState }) => state.tasks.tasks;
export const selectTasksStatus = (state: { tasks: TasksState }) =>
  state.tasks.status;
export const selectTasksError = (state: { tasks: TasksState }) =>
  state.tasks.error;
export const selectUpdatingTaskIds = (state: { tasks: TasksState }) =>
  state.tasks.updatingTaskIds;
export const selectTaskById = (state: { tasks: TasksState }, id: number) =>
  state.tasks.tasks.results.find((task) => task.id === id);

export default tasksSlice.reducer;
