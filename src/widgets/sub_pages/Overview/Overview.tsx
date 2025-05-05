import React, { useState, useEffect } from "react";
import classes from "./Overview.module.scss";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getProjects, selectProjects } from "shared/store/slices/projectsSlice";
import { useAppDispatch } from "shared/hooks/useAppDispatch";

const Overview = () => {
  const [currentProjectId, setCurrentProjectId] = useState<number | null>(null);
  const projects = useSelector(selectProjects);
  const dispatch = useAppDispatch()

useEffect(() => {
  dispatch(getProjects());
}, [dispatch]);
  console.log("ПРОЕКТЫ", projects);
  
  const navigate = useNavigate();
  const location = useLocation();

  const [currentView, setCurrentView] = useState<"gantt" | "kanban">("kanban");

  useEffect(() => {
    if (
      !location.pathname.includes("gantt") &&
      !location.pathname.includes("kanban")
    ) {
      navigate("kanban", { replace: true });
    }
  }, [location.pathname, navigate]);
  const handleProjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const projectId = Number(event.target.value);
    setCurrentProjectId(projectId);
  };
  const handleViewChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newView = event.target.value as "gantt" | "kanban";
    setCurrentView(newView);
    navigate(newView);
  };

  return (
    <div className={classes.container}>
      <div className={classes.viewSwitcher}>
        <select
          id="viewSwitcher"
          value={currentView}
          onChange={handleViewChange}
          className={classes.select}
        >
          <option value="gantt">Гант</option>
          <option value="kanban">Канбан</option>
        </select>
        <select
          value={currentProjectId ?? ""}
          onChange={handleProjectChange}
          className={classes.select}
        >
          <option value="">Выберите проект</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>
      <Outlet context={{ currentProjectId }} />

    </div>
  );
};

export default Overview;
