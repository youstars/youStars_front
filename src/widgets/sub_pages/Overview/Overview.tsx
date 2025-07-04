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

  const initialView: "gantt" | "kanban" = location.pathname.includes("gantt")
    ? "gantt"
    : "kanban";
  const [currentView, setCurrentView] = useState<"gantt" | "kanban">(initialView);

  useEffect(() => {
    if (projects.length && currentProjectId === null) {
      setCurrentProjectId(projects[0].id);
    }
  }, [projects, currentProjectId]);
  const handleProjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const projectId = Number(event.target.value);
    setCurrentProjectId(projectId);
  };
  const handleViewChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newView = event.target.value as "gantt" | "kanban";
    setCurrentView(newView);
    navigate(`${newView}`, { replace: true });
  };

  return (
    <div className={classes.container}>
      <div className={classes.viewSwitcher}>
        <select
          id="viewSwitcher"
          value={currentView}
          onChange={handleViewChange}
          className={`${classes.select} ${classes.viewSelect}`}
        >
          <option value="gantt">Гант</option>
          <option value="kanban">Канбан</option>
        </select>
        <select
          value={currentProjectId ?? ""}
          onChange={handleProjectChange}
          className={`${classes.select} ${classes.projectSelect}`}
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
