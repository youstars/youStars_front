import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import tasksSlice from "shared/store/slices/tasksSlice";
import projectsSlice from "shared/store/slices/projectsSlice";
import funnelSlice from "shared/store/slices/funnelSlice";
import specialistsReducer from "shared/store/slices/specialistsSlice";
import specialistReducer from "shared/store/slices/specialistSlice";
import chatReducer from "shared/store/slices/chatSlice";
import projectTasksReducer from 'shared/store/slices/projectTasksSlice';
import adminRegistrationReducer from "shared/store/slices/adminRegistrationSlice";
import meReducer from "shared/store/slices/meSlice";
import tasksSpecialistReducer from "shared/store/slices/tasksSpecialistSlice";
import clientReducer from "./slices/clientSlice";

const store = configureStore({
  reducer: {
    projectTasks: projectTasksReducer,
    auth: authReducer,
    tasks: tasksSlice,
    projects: projectsSlice,
    funnel: funnelSlice,
    specialists: specialistsReducer,
    chat: chatReducer,
    adminRegistration: adminRegistrationReducer,
    specialist: specialistReducer,
    me: meReducer,
    tasksSpecialist: tasksSpecialistReducer,
    client: clientReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
