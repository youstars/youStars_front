import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const getProjectTasks = createAsyncThunk(
  'projectTasks/fetch',
  async (projectId: number, thunkAPI) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/ru/projects/${projectId}/tasks/`);
      const data = await response.json();
      return data;  
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const projectTasksSlice = createSlice({
  name: 'projectTasks',
  initialState: {
    tasks: [], // 💡 массив задач
    status: 'idle',
    error: null,
  },
  reducers: {
    clearProjectTasks(state) {
      state.tasks = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProjectTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getProjectTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks = action.payload.results || []; 
      })
      
      .addCase(getProjectTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearProjectTasks } = projectTasksSlice.actions;

// ✅ Селекторы:
export const selectProjectTasks = (state: any) => state.projectTasks.tasks;
export const selectProjectTasksStatus = (state: any) => state.projectTasks.status;
export const selectProjectTasksError = (state: any) => state.projectTasks.error;

export default projectTasksSlice.reducer;
