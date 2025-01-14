import "./styles/index.scss";
import { useTheme } from "app/provider/lib_lib/useTheme";
import React, { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { CreateAccountAsync } from "../pages/CreatedAccount";
import { LoginFormAsync } from "../pages/LoginForm";
import { StepsAsync } from "../pages/Steps";
import Managers from "../pages/Managers/ui/Managers";
import Test from "../widgets/Test/Test";
import { Header } from "../widgets/Header";
import { className } from "./provider/lib_lib/classNames/classNames";
import TaskPage from "pages/TaskPage/TaskPage";
import UserProjects from "sub_pages/UserProjects/ui/UserProjects";
import Tasks from "sub_pages/Tasks/ui/Tasks";
import Specialists from "sub_pages/Specialists/ui/Specialists";
import Funnel from "sub_pages/Funnel/ui/Funnel";
import Library from "sub_pages/Library/ui/Library";
import Settings from "sub_pages/Settings/ui/Settings";
import NewPage from "pages/NewPage/ui/NewPage";

function App() {
  const { theme } = useTheme();
  return (
    <div className={className("app", {}, [theme])}>
      <Suspense fallback={""}>
        <BrowserRouter>
          {/*<Header/>*/}
          <Routes>
            <Route path={"/"} element={<LoginFormAsync />} />
            <Route
              path="/create-account/:role"
              element={<CreateAccountAsync />}
            />
            <Route path={"/test"} element={<Test />} />
            <Route path={"/steps"} element={<StepsAsync />} />
            <Route path={"/projects_user"} element={<Managers />} />
            <Route path={"/new"} element={<NewPage />}>
              <Route path="overview" element={<TaskPage />} />
              <Route path="user_projects" element={<UserProjects />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="specialists" element={<Specialists />} />
              <Route path="funnel" element={<Funnel />} />
              <Route path="library" element={<Library />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Suspense>
    </div>
  );
}

export default App;
