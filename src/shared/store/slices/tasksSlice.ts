import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import {Task, TaskStatus} from "shared/types/tasks";
import axiosInstance from "shared/api/api";

// ─────────────────────────────────── adapter
const tasksAdapter = createEntityAdapter<Task>();

export const getTasks = createAsyncThunk<
    { results: Task[] },
    void,
    { state: { tasks: TasksState } }
>(
    "tasks/getTasks",
    async (_, {rejectWithValue, signal}) => {
        try {
            const response = await axiosInstance.get<{ results: Task[] }>("/task_specialist/", {
                signal,
            });
            return response.data;
        } catch (error: any) {
            console.error("Error fetching tasks:", error);
            return rejectWithValue(error.response?.data || "Произошла ошибка");
        }
    },
    {
        condition: (_, {getState}) => {
            const {tasks} = getState();
            return tasks.status === "idle" || tasks.status === "rejected";
        },
    }
);

export const createTask = createAsyncThunk(
    "tasks/createTask",
    async (data: Omit<Task, "id">, {rejectWithValue}) => {
        try {
            const response = await axiosInstance.post<Task>("/task_specialist/", data);
            return response.data;
        } catch (error: any) {
            console.error("Error creating task:", error);
            return rejectWithValue(error.response?.data || "Ошибка при создании задачи");
        }
    }
);

export const updateTaskFields = createAsyncThunk(
  "tasks/updateFields",
  async (
    { id, changes }: { id: number; changes: Partial<Task> },
    { rejectWithValue, signal }
  ) => {
    try {
      const response = await axiosInstance.patch<Task>(
        `/task_specialist/${id}/`,
        changes,
        { signal }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error updating task fields:", error);
      return rejectWithValue(
        error.response?.data || "Ошибка при обновлении задачи"
      );
    }
  }
);

export const getTaskById = createAsyncThunk(
    "tasks/getTaskById",
    async (taskId: string, {rejectWithValue}) => {
        try {
            const response = await axiosInstance.get<{ results: Task[] }>(`/task_specialist/${taskId}/`);
            return response.data.results[0];
        } catch (error) {
            return rejectWithValue("Ошибка при получении задачи");
        }
    }
);

interface TasksState
  extends ReturnType<typeof tasksAdapter.getInitialState> {
  selectedTask: Task | null;
  status: "idle" | "pending" | "fulfilled" | "rejected";
  error: string | null;
  updatingTaskIds: number[];
}

const initialState: TasksState = {
  ...tasksAdapter.getInitialState(),
  selectedTask: null,
  status: "idle",
  error: null,
  updatingTaskIds: [],
};

const tasksSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        optimisticUpdateTaskStatus: (
            state,
            action: PayloadAction<{ id: number; status: TaskStatus }>
        ) => {
            const { id, status } = action.payload;
            const task = state.entities[id];
            if (task) {
              task.status = status;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTasks.pending, (state) => {
                state.status = "pending";
                state.error = null;
            })
            .addCase(getTasks.fulfilled, (state, action) => {
                state.status = "fulfilled";
                tasksAdapter.setAll(state, action.payload.results);
            })
            .addCase(getTasks.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.payload as string;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                tasksAdapter.addOne(state, action.payload);
            })
            .addCase(updateTaskFields.pending, (state, action) => {
                const { id, changes } = action.meta.arg as {
                    id: number;
                    changes: Partial<Task>;
                };
                // если меняем статус, включаем индикатор «updating»
                if ("status" in changes) {
                    state.updatingTaskIds.push(id);
                }
            })
            .addCase(updateTaskFields.fulfilled, (state, action) => {
                tasksAdapter.updateOne(state, {
                  id: action.payload.id,
                  changes: action.payload,
                });
                state.updatingTaskIds = state.updatingTaskIds.filter(
                  (taskId) => taskId !== action.payload.id
                );
            })
            .addCase(updateTaskFields.rejected, (state, action) => {
                const { id, changes } = action.meta.arg as {
                    id: number;
                    changes: Partial<Task>;
                };
                state.error = action.payload as string;
                state.updatingTaskIds = state.updatingTaskIds.filter(
                    (taskId) => taskId !== id
                );
                // если падение было при смене статуса — откатить
                if ("status" in changes) {
                  const task = state.entities[id];
                  if (task) {
                    task.status = changes.status as TaskStatus;
                  }
                }
            })
            .addCase(getTaskById.fulfilled, (state, action) => {
                tasksAdapter.upsertOne(state, action.payload);
            });
    },
});

const tasksSelectors = tasksAdapter.getSelectors(
  (state: { tasks: TasksState }) => state.tasks
);

export const {optimisticUpdateTaskStatus} = tasksSlice.actions;
export const selectTasks = tasksSelectors.selectAll;
export const selectTasksStatus = (state: { tasks: TasksState }) => state.tasks.status;
export const selectTasksError = (state: { tasks: TasksState }) => state.tasks.error;
export const selectTaskById = tasksSelectors.selectById;

export default tasksSlice.reducer;
