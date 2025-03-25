import axiosInstance from "shared/api/api";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


export const getTasks = createAsyncThunk(
    "tasks/getTasks",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${API_BASE_URL}task_students`);
            return response.data;
        } catch (error: any) {
            console.error("Error fetching tasks:", error);
            return rejectWithValue(error.response?.data || "Произошла ошибка");
        }
    }
);

export const updateTaskDeadline = createAsyncThunk(
    "tasks/updateDeadline",
    async ({ id, end_date }: { id: number; end_date: string }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch(
                `${API_BASE_URL}task_students/${id}/`,
                { end_date },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            // ✅ проверь, что API реально возвращает обновлённый task
            return response.data;
        } catch (error: any) {
            console.error("Error updating deadline:", error);
            return rejectWithValue(error.response?.data || "Ошибка при сохранении дедлайна");
        }
    }
);

// Типы
interface Task {
    id: number;
    title: string;
    description: string;
    end_date?: string;
    [key: string]: any; // доп поля
}

interface TasksState {
    tasks: {
        results: Task[]; // предполагается, что API возвращает { results: [...] }
    };
    status: "idle" | "pending" | "fulfilled" | "rejected";
    error: string | null;
}

const initialState: TasksState = {
    tasks: {
        results: [],
    },
    status: "idle",
    error: null,
};

const tasksSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getTasks.pending, (state) => {
                state.status = "pending";
                state.error = null;
            })
            .addCase(getTasks.fulfilled, (state, action: PayloadAction<any>) => {
                state.status = "fulfilled";
                state.tasks = action.payload;
            })
            .addCase(getTasks.rejected, (state, action: PayloadAction<any>) => {
                state.status = "rejected";
                state.error = action.payload as string;
            })

            // ✅ Обработка успешного обновления дедлайна
            .addCase(updateTaskDeadline.fulfilled, (state, action: PayloadAction<Task>) => {
                const updatedTask = action.payload;
                const index = state.tasks.results.findIndex((task) => task.id === updatedTask.id);
                if (index !== -1) {
                    state.tasks.results[index] = {
                        ...state.tasks.results[index],
                        ...updatedTask,
                    };
                }
            });
    },
});

export const selectTasks = (state: { tasks: TasksState }) => state.tasks.tasks;
export const selectTasksStatus = (state: { tasks: TasksState }) => state.tasks.status;
export const selectTasksError = (state: { tasks: TasksState }) => state.tasks.error;

export default tasksSlice.reducer;
