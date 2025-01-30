import React, {useState, useEffect} from 'react';
import classes from "./Overview.module.scss";
import {Outlet, useNavigate, useLocation} from "react-router-dom";

const Overview = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [currentView, setCurrentView] = useState<"gantt" | "kanban">("kanban");

    useEffect(() => {
        if (!location.pathname.includes("gantt") && !location.pathname.includes("kanban")) {
            navigate("kanban", {replace: true});
        }
    }, [location.pathname, navigate]);

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
                <select className={classes.select}>
                    <option value="gantt">Проект 1</option>
                </select>
            </div>
            <Outlet/>
        </div>
    );
};

export default Overview;
