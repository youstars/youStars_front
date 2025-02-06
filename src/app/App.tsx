import "./styles/index.scss";
import { useTheme } from "app/provider/lib_lib/useTheme";
import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CreateAccountAsync } from "../pages/CreatedAccount";
import { LoginFormAsync } from "../pages/LoginForm";
import { StepsAsync } from "../pages/Steps";
import Managers from "../pages/Managers/ui/Managers";
import Test from "../widgets/Test/Test";
import UserProjects from "sub_pages/UserProjects/ui/UserProjects";
import Tasks from "sub_pages/Tasks/ui/Tasks";
import Specialists from "sub_pages/Specialists/ui/Specialists";
import Funnel from "sub_pages/Funnel/ui/Funnel";
import Library from "sub_pages/Library/ui/Library";
import Settings from "sub_pages/Settings/ui/Settings";
import Gantt from "sub_pages/Gantt/ui/Gantt";
import ManagerPage from "pages/ManagerPage/ui/ManagerPage";
import Kanban from "sub_pages/Kanban/Kanban";
import Overview from "../sub_pages/Overview/Overview";

function App() {
  const { theme } = useTheme();

  return (
      <div className={`app ${theme}`}>
        <Suspense fallback={""}>
          <BrowserRouter>
            <Routes>
              <Route path={"/"} element={<LoginFormAsync />} />
              <Route
                path="/create-account/:role"
                element={<CreateAccountAsync />}
              />
              <Route path={"/test"} element={<Test />} />
              <Route path={"/steps"} element={<StepsAsync />} />
              <Route path={"/projects_user"} element={<Managers />} />
              <Route path={"/manager"} element={<ManagerPage />}>
                <Route path="user_projects" element={<UserProjects/>} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="specialists" element={<Specialists />} />
                <Route path="funnel" element={<Funnel/>} />
                <Route path="library" element={<Library />} />
                <Route path="settings" element={<Settings />} />
                <Route path="overview" element={<Overview/>}>
                  <Route path="gantt" element={<Gantt/>} />
                  <Route path="kanban" element={<Kanban/>} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </Suspense>
      </div>
  );
}

export default App;
