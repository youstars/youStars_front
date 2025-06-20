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
import clientReducer from "./slices/clientSlice";
import projectFilesReducer from "./slices/projectFilesSlice";
import clientsReducer from "./slices/clientsSlice";
import knowledgeBaseReducer from "./slices/librarySlice";
import { foldersReducer } from "./slices/foldersSlice";
import { projectReducer } from "./slices/projectSlice";
import trackerReducer from "./slices/trackerSlice"
import trackersReducer from "./slices/trackersSlice"
import invitationReducer from './slices/invitationSlice';
import orderReducer from "./slices/orderSlice";
import subtasksReducer from "./slices/subtaskSlice";

const store = configureStore({
  reducer: {
    projectTasks: projectTasksReducer,
    auth: authReducer,
    tasks: tasksSlice,
    projects: projectsSlice,
    project: projectReducer,
    funnel: funnelSlice,
    specialists: specialistsReducer,
    chat: chatReducer,
    adminRegistration: adminRegistrationReducer,
    specialist: specialistReducer,
    me: meReducer,
    client: clientReducer,
    clients: clientsReducer,
    projectFiles: projectFilesReducer,
    knowledgeBase: knowledgeBaseReducer,
    folders: foldersReducer, 
    trackers: trackersReducer,
    invitation: invitationReducer,
    order: orderReducer,
    tracker: trackerReducer,
    subtask: subtasksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
