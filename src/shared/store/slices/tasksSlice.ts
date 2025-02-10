import axiosInstance from "shared/api/api";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";


// const API_BASE_URL = "https://consult-fozz.onrender.com/ru/";
const API_BASE_URL = "http://127.0.0.1:8000/ru/";

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

interface Task {
    id: number;
    title: string;
    description: string;
}

interface TasksState {
    tasks: Task[];
    status: "idle" | "pending" | "fulfilled" | "rejected";
    error: string | null;
}


const initialState: TasksState = {
    tasks: [],
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
            .addCase(getTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
                state.status = "fulfilled";
                state.tasks = action.payload;
            })
            .addCase(getTasks.rejected, (state, action: PayloadAction<any>) => {
                state.status = "rejected";
                state.error = action.payload as string;
            });
    },
});

export const selectTasks = (state: { tasks: TasksState }) => state.tasks.tasks;
export const selectTasksStatus = (state: { tasks: TasksState }) => state.tasks.status;
export const selectTasksError = (state: { tasks: TasksState }) => state.tasks.error;

export default tasksSlice.reducer;
