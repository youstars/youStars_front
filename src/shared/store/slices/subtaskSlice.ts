// // shared/store/slices/subtaskSlice.ts
// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { getCookie } from "shared/utils/cookies";
// import { RootState } from "../index";

// interface Subtask {
//   id: number;
//   task: number;
//   message: string;
//   is_done: boolean;
// }

// interface SubtaskState {
//   items: Subtask[];
//   status: "idle" | "loading" | "success" | "error";
//   error: string | null;
// }

// const initialState: SubtaskState = {
//   items: [],
//   status: "idle",
//   error: null,
// };

// export const addSubtask = createAsyncThunk(
//   "subtasks/add",
//   async ({ taskId, message }: { taskId: number; message: string }) => {
//     const baseUrl = process.env.REACT_APP_API_BASE || "http://localhost:8000";
//     const token = getCookie("access_token") || "";

//     const response = await fetch(`${baseUrl}/subtasks/`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         task: taskId,
//         message,
//         is_done: false,
//       }),
//     });

//     if (!response.ok) {
//       throw new Error("Не удалось создать подзадачу");
//     }

//     return await response.json();
//   }
// );

// const subtaskSlice = createSlice({
//   name: "subtasks",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(addSubtask.pending, (state) => {
//         state.status = "loading";
//         state.error = null;
//       })
//       .addCase(addSubtask.fulfilled, (state, action) => {
//         state.status = "success";
//         state.items.push(action.payload);
//       })
//       .addCase(addSubtask.rejected, (state, action) => {
//         state.status = "error";
//         state.error = action.error.message || "Ошибка создания подзадачи";
//       });
//   },
// });

// export const selectSubtasks = (state: RootState) => state.subtasks;
// export default subtaskSlice.reducer;
