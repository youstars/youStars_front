import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import {Task, TaskStatus} from "shared/types/tasks";
import axiosInstance from "shared/api/api";

export const getTasks = createAsyncThunk<
    { results: Task[] },
    void,
    { state: { tasks: TasksState } }
>(
    "tasks/getTasks",
    async (_, {rejectWithValue}) => {
        try {
            const response = await axiosInstance.get<{ results: Task[] }>("/task_specialist/");
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

export const updateTaskDeadline = createAsyncThunk(
    "tasks/updateDeadline",
    async ({id, end_date}: { id: number; end_date: string }, {rejectWithValue}) => {
        try {
            const response = await axiosInstance.patch<Task>(`/task_students/${id}/`, {end_date});
            return response.data;
        } catch (error: any) {
            console.error("Error updating deadline:", error);
            return rejectWithValue(error.response?.data || "Ошибка при сохранении дедлайна");
        }
    }
);

export const updateTaskStatus = createAsyncThunk(
    "tasks/updateStatus",
    async ({id, status}: { id: number; status: TaskStatus }, {rejectWithValue}) => {
        try {
            const response = await axiosInstance.patch<Task>(`/task_specialist/${id}/`, {status});
            return response.data;
        } catch (error: any) {
            console.error("Error updating task status:", error);
            return rejectWithValue(error.response?.data || "Ошибка при обновлении статуса");
        }
    }
);

export const updateTask = createAsyncThunk(
    "tasks/updateTask",
    async ({id, data}: { id: number; data: Partial<Task> }, {rejectWithValue}) => {
        try {
            const response = await axiosInstance.patch<Task>(`/task_specialist/${id}/`, data);
            return response.data;
        } catch (error: any) {
            console.error("Error updating task:", error);
            return rejectWithValue(error.response?.data || "Ошибка при обновлении задачи");
        }
    }
);

/** PATCH: изменить оценку времени (estimated_time) */
export const updateTaskEstimateTime = createAsyncThunk(
    "tasks/updateEstimateTime",
    async (
        {id, estimated_time}: { id: number; estimated_time: number },
        {rejectWithValue}
    ) => {
        try {
            const response = await axiosInstance.patch<Task>(`/task_specialist/${id}/`, {estimated_time});
            return response.data;
        } catch (error: any) {
            console.error("Error updating estimated time:", error);
            return rejectWithValue(error.response?.data || "Ошибка при обновлении оценки времени");
        }
    }
);

/** PATCH: изменить список назначенных специалистов */
export const updateTaskSpecialists = createAsyncThunk(
    "tasks/updateSpecialists",
    async (
        {id, assigned_specialists}: { id: number; assigned_specialists: number[] },
        {rejectWithValue}
    ) => {
        try {
            const response = await axiosInstance.patch<Task>(`/task_specialist/${id}/`, {assigned_specialists});
            return response.data;
        } catch (error: any) {
            console.error("Error updating specialists list:", error);
            return rejectWithValue(error.response?.data || "Ошибка при обновлении специалистов");
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
            .addCase(updateTaskDeadline.fulfilled, (state, action) => {
                const updatedTask = action.payload;
                const index = state.tasks.results.findIndex((task) => task.id === updatedTask.id);
                if (index !== -1) {
                    state.tasks.results[index] = {...state.tasks.results[index], ...updatedTask};
                }
            })
            .addCase(updateTaskEstimateTime.fulfilled, (state, action) => {
                const updatedTask = action.payload;
                const index = state.tasks.results.findIndex((task) => task.id === updatedTask.id);
                if (index !== -1) {
                    state.tasks.results[index] = {...state.tasks.results[index], ...updatedTask};
                }
            })
            .addCase(updateTaskSpecialists.fulfilled, (state, action) => {
                const updatedTask = action.payload;
                const index = state.tasks.results.findIndex((task) => task.id === updatedTask.id);
                if (index !== -1) {
                    state.tasks.results[index] = {...state.tasks.results[index], ...updatedTask};
                }
            })
            .addCase(updateTaskStatus.pending, (state, action) => {
                const id = (action.meta.arg as { id: number }).id;
                state.updatingTaskIds.push(id);
            })
            .addCase(updateTaskStatus.fulfilled, (state, action) => {
                const updatedTask = action.payload;
                const index = state.tasks.results.findIndex((task) => task.id === updatedTask.id);
                if (index !== -1) {
                    state.tasks.results[index] = {...state.tasks.results[index], ...updatedTask};
                }
                state.updatingTaskIds = state.updatingTaskIds.filter((id) => id !== updatedTask.id);
            })
            .addCase(updateTaskStatus.rejected, (state, action) => {
                const {id, status: originalStatus} = action.meta.arg as {
                    id: number;
                    status: TaskStatus;
                };
                state.updatingTaskIds = state.updatingTaskIds.filter((taskId) => taskId !== id);
                state.error = action.payload as string;

                const taskIndex = state.tasks.results.findIndex((task) => task.id === id);
                if (taskIndex !== -1) {
                    state.tasks.results[taskIndex].status = originalStatus;
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
