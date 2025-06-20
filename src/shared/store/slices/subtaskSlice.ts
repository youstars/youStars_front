import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "..";
import { getCookie } from "shared/utils/cookies";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

export interface Subtask {
  id: number;
  order: number ;
  content: string;
  is_done: boolean;
  created_at: string;
}

interface SubtasksState {
  items: Subtask[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: SubtasksState = {
  items: [],
  status: "idle",
  error: null,
};

// 1. Fetch subtasks
export const fetchSubtasksByOrder = createAsyncThunk<Subtask[], number>(
  "subtasks/fetchByOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const token = getCookie("access_token");
      const response = await axios.get(`${API_BASE_URL}subtasks/?order=${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Ошибка загрузки подзадач");
    }
  }
);

// 2. Create
export const createSubtask = createAsyncThunk<Subtask, { order: number; content: string }>(
  "subtasks/create",
  async ({ order, content }, { rejectWithValue }) => {
    try {
      const token = getCookie("access_token");
      const response = await axios.post(
        `${API_BASE_URL}subtasks/`,
        { order, content },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Ошибка при создании подзадачи");
    }
  }
);

// 3. Delete
export const deleteSubtask = createAsyncThunk<number, number>(
  "subtasks/delete",
  async (id, { rejectWithValue }) => {
    try {
      const token = getCookie("access_token");
      await axios.delete(`${API_BASE_URL}subtasks/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Ошибка удаления");
    }
  }
);

const subtasksSlice = createSlice({
  name: "subtasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubtasksByOrder.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSubtasksByOrder.fulfilled, (state, action: PayloadAction<Subtask[]>) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchSubtasksByOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(createSubtask.fulfilled, (state, action: PayloadAction<Subtask>) => {
        state.items.push(action.payload);
      })
      .addCase(deleteSubtask.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export const selectSubtasks = (state: RootState) => state.subtask.items;


export default subtasksSlice.reducer;
