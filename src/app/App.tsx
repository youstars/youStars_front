import "./styles/index.scss";
import { Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { CreateAccountAsync } from "../pages/CreatedAccount";
import { LoginFormAsync } from "../pages/LoginForm";
import { StepsAsync } from "../pages/Steps";
import { useTheme } from "shared/providers/theme/useTheme";
import Header from "widgets/Header";
import UserProjects from "widgets/sub_pages/UserProjects/ui/UserProjects";
import FormAuthAdmin from "widgets/sub_pages/FormAuthAdmin/FormAuthAdmin";
import AdminsPage from "widgets/sub_pages/AdminsPage/AdminsPage";
import ProjectProfile from "widgets/sub_pages/ProjectProfile/ProjectProfile";
import BusinessApplication from "widgets/sub_pages/BusinessApplication/BusinessApplication";
import Funnel from "widgets/sub_pages/Funnel/Funnel";
import Gantt from "widgets/sub_pages/Gantt/Gantt";
import SpecialistProfile from "widgets/sub_pages/SpecialistProfile/sections/Other/UserProfilePage";
import { ClientProfile } from "widgets/sub_pages/ClientProfile/ClientProfile";
import Chats from "widgets/sub_pages/Chats/Chats";
import Specialists from "widgets/sub_pages/Specialists/Specialists";
import Library from "widgets/sub_pages/Library/Library";
import Settings from "widgets/sub_pages/Settings/Settings";
import ManagerPage from "pages/ManagerPage/ui/ManagerPage";
import Kanban from "widgets/sub_pages/Kanban/Kanban";
import Overview from "widgets/sub_pages/Overview/Overview";
import Clients from "widgets/sub_pages/Clients/Clients";
import TaskTable from "widgets/sub_pages/Tasks/ui/Tasks";
import { getMe } from "shared/store/slices/meSlice";
import { useAppDispatch } from "shared/hooks/useAppDispatch";
import { useAppSelector } from "shared/hooks/useAppSelector";
import { selectMe } from "shared/store/slices/meSlice";
import CreateAccountClient from "pages/CreateAccountClient/CreateAccountClient";
import CreateAccount from "pages/CreatedAccount/ui/CreatedAccount";
import ProfilePage from "widgets/sub_pages/ProfilePage/ProfilePage";
import TrackerProfile from "widgets/TrackerProfile/TrackerProfile";

function App() {
  const { theme } = useTheme();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const me = useAppSelector(selectMe);

  const isManagerPage = location.pathname.startsWith("/manager");
  const isLoading = me.loading;
  const isAuthed = !!me.data;
  const isAdmin = me.data?.role?.toLowerCase() === "admin";
  const isLoginPage = location.pathname === "/";

  const publicPaths = ["/", "/create-account", "/steps"];
  const isPublic = publicPaths.some((path) =>
    location.pathname.startsWith(path)
  );

useEffect(() => {
  console.log("🔥 DISPATCH getMe()");
  if (!me.initialized) {
    dispatch(getMe());
  }
}, [dispatch, me.initialized]);

  if (isLoading) return <div>Loading...</div>;

if (!isAuthed && !isPublic && !isLoading) {
  return <Navigate to="/" replace />;
}


  if (isAuthed && isLoginPage) {
    return <Navigate to={isAdmin ? "/manager/overview" : "/manager/overview"} replace />;
  }

  return (
    <div className={`app ${theme}`}>
      <Suspense fallback={""}>
        {!isManagerPage && <Header />}
        <Routes>
          <Route path="/" element={<LoginFormAsync />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/steps" element={<StepsAsync />} />
          <Route path="/manager" element={<ManagerPage />}>
            <Route path="user_projects" element={<UserProjects />} />
            <Route path="project/:id" element={<ProjectProfile />} />
            <Route path="tasks" element={<TaskTable />} />
            <Route path="specialists" element={<Specialists />} />
            <Route path="specialists/:id" element={<SpecialistProfile />} />
            <Route path="clients" element={<Clients />} />
            <Route path="clients/:id" element={<ClientProfile />} />
            <Route path="funnel" element={<Funnel />} />
            <Route path="orders" element={<BusinessApplication />} />
            <Route path="library" element={<Library />} />
            <Route path="admins" element={<AdminsPage />} />
            <Route path="trackers/:id" element={<TrackerProfile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="chats" element={<Chats />} />
            <Route path="auth_admin" element={<FormAuthAdmin />} />
            <Route path="me" element={<ProfilePage />} />
  
            <Route path="overview" element={<Overview />}>
              <Route path="gantt" element={<Gantt />} />
              <Route path="kanban" element={<Kanban />} />
            </Route>
            <Route path="projects/:id" element={<ProjectProfile />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}

export default function AppWithRouter() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
