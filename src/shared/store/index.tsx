import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import tasksSlice from "shared/store/slices/tasksSlice";
import projectsSlice from "shared/store/slices/projectsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksSlice,
    projects:projectsSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
