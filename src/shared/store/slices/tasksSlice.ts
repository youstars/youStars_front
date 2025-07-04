import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import {Task, TaskStatus} from "shared/types/tasks";
import axiosInstance from "shared/api/api";


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

interface TasksState {
    tasks: { results: Task[] };
    selectedTask: Task | null;
    status: "idle" | "pending" | "fulfilled" | "rejected";
    error: string | null;
    updatingTaskIds: number[];
}

const initialState: TasksState = {
    tasks: {results: []},
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
            const {id, status} = action.payload;
            const taskIndex = state.tasks.results.findIndex((task) => task.id === id);
            if (taskIndex !== -1) {
                state.tasks.results[taskIndex].status = status;
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
                state.tasks = action.payload;
            })
            .addCase(getTasks.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.payload as string;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.tasks.results.push(action.payload);
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
                // убрать id из updating
                state.updatingTaskIds = state.updatingTaskIds.filter(
                    (taskId) => taskId !== updatedTask.id
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
                    const taskIndex = state.tasks.results.findIndex((task) => task.id === id);
                    if (taskIndex !== -1) {
                        state.tasks.results[taskIndex].status = changes.status as TaskStatus;
                    }
                }
            })
            .addCase(getTaskById.fulfilled, (state, action) => {
                const fetchedTask = action.payload;
                const index = state.tasks.results.findIndex((task) => task.id === fetchedTask.id);
                if (index !== -1) {
                    state.tasks.results[index] = fetchedTask;
                } else {
                    state.tasks.results.push(fetchedTask);
                }
            });
    },
});

export const {optimisticUpdateTaskStatus} = tasksSlice.actions;
export const selectTasks = (state: { tasks: TasksState }) => state.tasks.tasks;
export const selectTasksStatus = (state: { tasks: TasksState }) => state.tasks.status;
export const selectTasksError = (state: { tasks: TasksState }) => state.tasks.error;
export const selectTaskById = (state: { tasks: TasksState }, id: number) =>
    state.tasks.tasks.results.find((task) => task.id === id);

export default tasksSlice.reducer;
