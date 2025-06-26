import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Tracker } from "shared/types/tracker";
import { getCookie } from "shared/utils/cookies";

interface TrackerState {
  data: Tracker | null;
  loading: boolean;
  error: string | null;
}

const initialState: TrackerState = {
  data: null,
  loading: false,
  error: null,
};

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getTrackerById = createAsyncThunk(
  "tracker/getById",
  async (id: number | string, { rejectWithValue }) => {
    try {
      const token = getCookie("access_token");
      const response = await axiosInstance.get(`/users/admin/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data as Tracker;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Ошибка получения трекера"
      );
    }
  }
);
export const getTrackerMe = createAsyncThunk(
  "tracker/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const token = getCookie("access_token");
      const response = await axiosInstance.get(`/users/admins/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data as Tracker;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Ошибка получения трекера"
      );
    }
  }
);

export const updateTracker = createAsyncThunk(
  "tracker/update",
  async (
    trackerData: Partial<Tracker> & { id: number },
    { rejectWithValue }
  ) => {
    try {
      const token = getCookie("access_token");
      const response = await axiosInstance.patch(
        `/users/admin/${trackerData.id}/`,
        trackerData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data as Tracker;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Ошибка обновления трекера"
      );
    }
  }
);

const trackerSlice = createSlice({
  name: "tracker",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTrackerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getTrackerById.fulfilled,
        (state, action: PayloadAction<Tracker>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(getTrackerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateTracker.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateTracker.fulfilled,
        (state, action: PayloadAction<Tracker>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(updateTracker.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getTrackerMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getTrackerMe.fulfilled,
        (state, action: PayloadAction<Tracker>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(getTrackerMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default trackerSlice.reducer;
