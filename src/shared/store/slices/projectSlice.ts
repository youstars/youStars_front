import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../index";
import axios from "axios";
import { getCookie } from "shared/utils/cookies";
import { Project } from "shared/types/project";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

interface ProjectState {
  project: Project | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  project: null,
  loading: false,
  error: null,
};

export const getProjectById = createAsyncThunk(
  "project/getById",
  async (id: string | number, thunkAPI) => {
    try {
      const token = getCookie("access_token");
      const response = await axios.get(`${API_BASE_URL}project/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue("Ошибка загрузки проекта");
    }
  }
);

export const updateProjectStatus = createAsyncThunk(
  "project/updateStatus",
  async ({ id, status }: { id: number; status: string }, thunkAPI) => {
    try {
      const token = getCookie("access_token");
      const response = await axios.patch(
        `${API_BASE_URL}project/${id}/`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue("Ошибка обновления статуса");
    }
  }
);

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProjectById.fulfilled, (state, action) => {
        state.project = action.payload;
        state.loading = false;
      })
      .addCase(updateProjectStatus.fulfilled, (state, action) => {
        state.project = action.payload;
      })

      .addCase(getProjectById.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const projectReducer = projectSlice.reducer;
export const selectProject = (state: RootState) => state.project;
