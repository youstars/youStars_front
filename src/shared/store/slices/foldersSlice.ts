import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../index";
import { getCookie } from "shared/utils/cookies";
import { API_FOLDERS } from "shared/api/endpoints";
import { FolderItem } from "shared/types/folders";
import axiosInstance from "shared/api/api";


interface FoldersState {
  folders: FolderItem[];
  loading: boolean;
  error: string | null;
}

const initialState: FoldersState = {
  folders: [],
  loading: false,
  error: null,
};

export const fetchFolders = createAsyncThunk(
  "folders/fetchAll",
  async (_, thunkAPI) => {
    try {
      const token = getCookie("access_token");
      const response = await axiosInstance.get(API_FOLDERS.getAll, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Ошибка загрузки папок"
      );
    }
  }
);

export const addFolder = createAsyncThunk(
  "folders/add",
  async (data: { name: string; parent?: number | null }, thunkAPI) => {
    try {
      const token = getCookie("access_token");
      const response = await axiosInstance.post(API_FOLDERS.add, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Ошибка при создании папки"
      );
    }
  }
);

export const deleteFolder = createAsyncThunk(
  "folders/delete",
  async (id: number, thunkAPI) => {
    try {
      const token = getCookie("access_token");
      await axiosInstance.delete(API_FOLDERS.delete(id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Ошибка при удалении папки"
      );
    }
  }
);

export const renameFolder = createAsyncThunk(
  "folders/rename",
  async (data: { id: number; name: string }, thunkAPI) => {
    try {
      const token = getCookie("access_token");
      const response = await axiosInstance.patch(
        API_FOLDERS.rename(data.id),
        { name: data.name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue("Ошибка при переименовании папки");
    }
  }
);

export const foldersSlice = createSlice({
  name: "folders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFolders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFolders.fulfilled, (state, action) => {
        state.loading = false;
        state.folders = action.payload.results || action.payload;
      })
      .addCase(fetchFolders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addFolder.fulfilled, (state, action) => {
        const newFolder = { ...action.payload, children: [] };

        const insertIntoTree = (folders: FolderItem[]): boolean => {
          for (const folder of folders) {
            if (folder.id === newFolder.parent) {
              if (!folder.children) folder.children = [];
              folder.children.push(newFolder);
              return true;
            }
            if (folder.children && insertIntoTree(folder.children)) {
              return true;
            }
          }
          return false;
        };

        if (newFolder.parent) {
          const inserted = insertIntoTree(state.folders);
          if (!inserted) {
            console.warn("Родительская папка не найдена, добавляем в корень");
            state.folders.push(newFolder);
          }
        } else {
          state.folders.push(newFolder);
        }
      })
      .addCase(deleteFolder.fulfilled, (state, action) => {
        const idToDelete = action.payload;

        const deleteRecursively = (folders: FolderItem[]): FolderItem[] => {
          return folders
            .filter((folder) => folder.id !== idToDelete)
            .map((folder) => ({
              ...folder,
              children: folder.children
                ? deleteRecursively(folder.children)
                : [],
            }));
        };

        state.folders = deleteRecursively(state.folders);
      })
      .addCase(deleteFolder.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(renameFolder.fulfilled, (state, action) => {
        const updated = action.payload;
        const updateRecursively = (folders: FolderItem[]): FolderItem[] =>
          folders.map((folder) =>
            folder.id === updated.id
              ? { ...folder, name: updated.name }
              : {
                  ...folder,
                  children: folder.children
                    ? updateRecursively(folder.children)
                    : [],
                }
          );

        state.folders = updateRecursively(state.folders);
      });
  },
});

export const foldersReducer = foldersSlice.reducer;
export const selectFolders = (state: RootState) => state.folders;
export type { FoldersState };
