import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import tasksSlice from "shared/store/slices/tasksSlice";
import projectsSlice from "shared/store/slices/projectsSlice";
// import chatSlice from './slices/chatSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksSlice,
    projects:projectsSlice,
    // chat: chatSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
