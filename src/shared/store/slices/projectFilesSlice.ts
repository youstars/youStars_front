import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FileItem {
  name: string;
  fileUrl: string;
}

interface ProjectFilesState {
  files: FileItem[];
}

const initialState: ProjectFilesState = {
  files: [],
};

const projectFilesSlice = createSlice({
  name: "projectFiles",
  initialState,
  reducers: {
    setFiles(state, action: PayloadAction<FileItem[]>) {
      state.files = action.payload;
    },
    addFile(state, action: PayloadAction<FileItem>) {
      state.files.push(action.payload);
    },
    removeFile(state, action: PayloadAction<string>) {
      state.files = state.files.filter((file) => file.name !== action.payload);
    },
  },
});

export const { setFiles, addFile, removeFile } = projectFilesSlice.actions;
export default projectFilesSlice.reducer;
