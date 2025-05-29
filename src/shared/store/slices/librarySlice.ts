// shared/store/slices/knowledgeBaseSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../index";
import { getCookie } from "shared/utils/cookies";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export interface KnowledgeFile {
  id: number;
  name: string;
  folder: number;
  audience: number;
  description?: string;
}

interface KnowledgeBaseState {
  items: KnowledgeFile[];
  loading: boolean;
  error: string | null;
}

const initialState: KnowledgeBaseState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchKnowledgeFiles = createAsyncThunk(
  "knowledgeBase/fetchAll",
  async (_, thunkAPI) => {
    try {
      const token = getCookie("access_token");
      const response = await axios.get(`${API_BASE_URL}files/knowledge-files/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue("Ошибка загрузки файлов");
    }
  }
);

export const fetchKnowledgeFilesByFolder = createAsyncThunk(
  "knowledgeBase/fetchByFolder",
  async (folderId: number, thunkAPI) => {
    try {
      const token = getCookie("access_token");
      const response = await axios.get(`${API_BASE_URL}files/knowledge-files/?folder=${folderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { folderId, files: response.data.results || response.data };
    } catch (error: any) {
      return thunkAPI.rejectWithValue("Ошибка при загрузке файлов папки");
    }
  }
);

export const deleteKnowledgeFile = createAsyncThunk(
  "knowledgeBase/delete",
  async (id: number, thunkAPI) => {
    try {
      const token = getCookie("access_token");
      await axios.delete(`${API_BASE_URL}files/knowledge-files/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue("Ошибка при удалении файла");
    }
  }
);

export const uploadKnowledgeFile = createAsyncThunk(
  "knowledgeBase/upload",
  async (
    data: { file: File; folder: number; audience?: number },
    thunkAPI
  ) => {
    try {
      const token = getCookie("access_token");
      const formData = new FormData();
      formData.append("file", data.file);
      formData.append("name", data.file.name); 
      formData.append("folder", data.folder.toString());
      formData.append("audience", (data.audience || 1).toString());

      const response = await axios.post(
        `${API_BASE_URL}files/knowledge-files/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue("Ошибка при загрузке файла");
    }
  }
);


const knowledgeBaseSlice = createSlice({
  name: "knowledgeBase",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchKnowledgeFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKnowledgeFiles.fulfilled, (state, action) => {
        state.items = action.payload.results || action.payload;
        state.loading = false;
      })
      .addCase(fetchKnowledgeFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      }).addCase(deleteKnowledgeFile.fulfilled, (state, action) => {
  state.items = state.items.filter(file => file.id !== action.payload);
})

      .addCase(uploadKnowledgeFile.fulfilled, (state, action) => {
  state.items.push(action.payload);
  
})

  },
});

export default knowledgeBaseSlice.reducer;
export const selectKnowledgeFiles = (state: RootState) => state.knowledgeBase.items;
