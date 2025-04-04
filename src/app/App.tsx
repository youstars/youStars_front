import "./styles/index.scss";
import { Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CreateAccountAsync } from "../pages/CreatedAccount";
import { LoginFormAsync } from "../pages/LoginForm";
import { StepsAsync } from "../pages/Steps";
import Test from "../widgets/Test/Test";
import UserProjects from "sub_pages/UserProjects/ui/UserProjects";
import Tasks from "sub_pages/Tasks/ui/Tasks";
import Specialists from "sub_pages/Specialists/Specialists";
import Library from "sub_pages/Library/Library";
import Settings from "sub_pages/Settings/Settings";
import ManagerPage from "pages/ManagerPage/ui/ManagerPage";
import Kanban from "sub_pages/Kanban/Kanban";
import Overview from "../sub_pages/Overview/Overview";
import Clients from "sub_pages/Clients/Clients";
import Chats from "sub_pages/Chats/Chats";
import { ClientProfile } from "sub_pages/ClientProfile/ClientProfile";
import SpecialistProfile from "sub_pages/SpecialistProfile/SpecialistProfile";
import { useTheme } from "shared/providers/theme/useTheme";
import Header from "widgets/Header";
import Gantt from "sub_pages/Gantt/Gantt";
import Funnel from "sub_pages/Funnel/Funnel";


function App() {
  const { theme } = useTheme();
  const location = useLocation(); 

  const isManagerPage = location.pathname.startsWith("/manager");

  return (
    <div className={`app ${theme}`}>
        <Suspense fallback={""}>
          {!isManagerPage && <Header />}
          <Routes>
            <Route path={"/"} element={<LoginFormAsync />} />
            <Route path="/create-account" element={<CreateAccountAsync />} />
            <Route path={"/test"} element={<Test />} />
            <Route path={"/steps"} element={<StepsAsync />} />
            <Route path={"/manager"} element={<ManagerPage />}>
              <Route path="user_projects" element={<UserProjects />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="specialists" element={<Specialists />} />
              <Route path="specialists/:id" element={<SpecialistProfile />} /> 
              <Route path="clients" element={<Clients />} />
              <Route path="clients/:id" element={<ClientProfile />} />
              <Route path="funnel" element={<Funnel />} />
              <Route path="library" element={<Library />} />
              <Route path="settings" element={<Settings />} />
              <Route path="chats" element={<Chats/>} />
              <Route path="overview" element={<Overview />}>
                <Route path="gantt" element={<Gantt />} />
                <Route path="kanban" element={<Kanban />} />
              </Route>
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
