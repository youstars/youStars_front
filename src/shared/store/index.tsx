import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import tasksSlice from "shared/store/slices/tasksSlice";
import projectsSlice from "shared/store/slices/projectsSlice";
import funnelSlice from "shared/store/slices/funnelSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksSlice,
    projects:projectsSlice,
    funnel:funnelSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
