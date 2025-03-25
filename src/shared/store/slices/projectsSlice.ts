import axiosInstance from "shared/api/api";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


export const getProjects = createAsyncThunk(
    "tasks/getTasks",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${API_BASE_URL}projects`);
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

const projectsSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProjects.pending, (state) => {
                state.status = "pending";
                state.error = null;
            })
            .addCase(getProjects.fulfilled, (state, action: PayloadAction<Task[]>) => {
                state.status = "fulfilled";
                state.tasks = action.payload;
            })
            .addCase(getProjects.rejected, (state, action: PayloadAction<any>) => {
                state.status = "rejected";
                state.error = action.payload as string;
            });
    },
});

export const selectTasks = (state: { tasks: TasksState }) => state.tasks.tasks;
export const selectTasksStatus = (state: { tasks: TasksState }) => state.tasks.status;
export const selectTasksError = (state: { tasks: TasksState }) => state.tasks.error;

export default projectsSlice.reducer;


