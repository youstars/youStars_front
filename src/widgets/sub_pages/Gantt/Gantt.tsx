import React, {useEffect, useRef, useState, useMemo} from "react";
import {MONTHS} from "./constants";
import {isToday, isWeekend, calculateTaskPosition} from "./utils";
import "./Gantt.scss";
import {useAppDispatch} from "shared/hooks/useAppDispatch";
import {useAppSelector} from "shared/hooks/useAppSelector";
import {
    getProjectTasks,
    selectProjectTasks,
    selectProjectTasksStatus,
    selectProjectTasksError
} from "shared/store/slices/projectTasksSlice";
import {useOutletContext} from "react-router-dom";
import {GanttTask} from "./types";

const Gantt: React.FC = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [currentDate] = useState(new Date());
    const [visibleMonth, setVisibleMonth] = useState(currentDate.getMonth());
    const [scrolling, setScrolling] = useState(false);

    const dispatch = useAppDispatch();
    const {currentProjectId} = useOutletContext<{ currentProjectId: number | null }>();

    const tasksData = useAppSelector(selectProjectTasks);
    const status = useAppSelector(selectProjectTasksStatus);
    const error = useAppSelector(selectProjectTasksError);

    /** Width of one day column in px; picked up from CSS custom property */
    const dayWidthRef = useRef<number>(30);
    /** Keeps track of the project whose tasks are already loaded */
    const prevProjectId = useRef<number | null>(null);

    useEffect(() => {
      const root = document.documentElement;
      const cssVar = parseFloat(
        getComputedStyle(root).getPropertyValue("--gantt-day-width")
      );
      if (!isNaN(cssVar)) {
        dayWidthRef.current = cssVar;
      }
    }, []);

    // Fetch tasks every time the selected project changes.
    useEffect(() => {
      if (currentProjectId && prevProjectId.current !== currentProjectId) {
        dispatch(getProjectTasks(currentProjectId));
        prevProjectId.current = currentProjectId;
      }
    }, [dispatch, currentProjectId]);


    const tasks: GanttTask[] = useMemo(
        () =>
            tasksData.map((task) => ({
                id: task.id,
                name: task.title,
                start: new Date(task.start_date),
                end: new Date(task.deadline || task.start_date),
                status: task.status,
                specialist: task.assigned_specialist || [],
            })),
        [tasksData]
    );

    const handleScroll = () => {
        if (scrollContainerRef.current && !scrolling) {
            const scrollLeft = scrollContainerRef.current.scrollLeft;
            const daysScrolled = Math.floor(scrollLeft / dayWidthRef.current);
            const currentMonthIndex = new Date(currentDate.getFullYear(), 0, daysScrolled + 1).getMonth();
            setVisibleMonth(currentMonthIndex);
        }
    };

    const scrollToMonth = (direction: "next" | "prev") => {
        if (scrollContainerRef.current) {
            setScrolling(true);
            const currentScroll = scrollContainerRef.current.scrollLeft;
            const daysInMonth = new Date(currentDate.getFullYear(), visibleMonth + 1, 0).getDate();
            const offset = daysInMonth * dayWidthRef.current;
            const targetScroll = direction === "next" ? currentScroll + offset : currentScroll - offset;

            scrollContainerRef.current.scrollTo({left: targetScroll, behavior: "smooth"});

            setTimeout(() => {
                setScrolling(false);
                setVisibleMonth((prev) => (direction === "next" ? (prev + 1) % 12 : (prev - 1 + 12) % 12));
            }, 300);
        }
    };

    const getDaysArray = () => {
        const start = new Date(currentDate.getFullYear(), 0, 1);
        const end = new Date(currentDate.getFullYear(), 11, 31);
        const days = [];
        let day = new Date(start);
        while (day <= end) {
            days.push(new Date(day));
            day.setDate(day.getDate() + 1);
        }
        return days;
    };

    const getStatusLabel = (status: string) => {
        return ["to_do", "in_progress", "review"].includes(status) ? "Статус открыт" : "Статус закрыт";
    };

    const days = useMemo(() => getDaysArray(), [currentDate]);

    const hasAutoScrolled = useRef(false);

    useEffect(() => {
        if (hasAutoScrolled.current) return;

        if (scrollContainerRef.current && tasks.length > 0) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const todayIndex = days.findIndex(
                (day) => day.toDateString() === today.toDateString()
            );

            if (todayIndex !== -1) {
                scrollContainerRef.current.scrollLeft = todayIndex * dayWidthRef.current;
            }

            hasAutoScrolled.current = true;
        }
    }, [tasks, days]);

    if (!currentProjectId) return <p>Выберите проект</p>;
    if (status === "pending") return <p>Загрузка задач...</p>;
    if (status === "rejected") return <p>Ошибка: {error}</p>;
    if (tasks.length === 0) return <p>Нет задач для проекта</p>;

    return (
        <div className="gantt-container">
            <div className="gantt-header">
                <div className="gantt-month-navigation">
                    <button onClick={() => scrollToMonth("prev")} className="gantt-arrow">{"<"}</button>
                    <span className="gantt-month">{MONTHS[visibleMonth]} {currentDate.getFullYear()}</span>
                    <button onClick={() => scrollToMonth("next")} className="gantt-arrow">{">"}</button>
                </div>
            </div>

            <div className="gantt-content">
                <div className="gantt-status-table">
                    <p className="graph">График времени</p>
                    {tasks.map((task, i) => (
                        <div key={task.id || `task-${i}`} className="gantt-status-row">
                            <span>{task.specialist?.[0]?.full_name || "Без специалиста"}</span>
                            <span>{getStatusLabel(String(task.status))}</span>
                        </div>
                    ))}
                </div>

                <div ref={scrollContainerRef} className="gantt-calendar-container" onScroll={handleScroll}>
                    <div className="gantt-timeline">
                        <div className="gantt-calendar">
                            {days.map((day, i) => (
                                <div
                                    key={day.toISOString()}
                                    className={`gantt-day ${isWeekend(day) ? "weekend" : ""} ${isToday(day) ? "today" : ""}`}
                                >
                                    <div className="gantt-day-header">
                                        {day.getDate() === 1 &&
                                            <div className="gantt-month-label">{MONTHS[day.getMonth()]}</div>}
                                        {day.getDate()}
                                    </div>
                                    {isToday(day) && (
                                        <>
                                            <div className="gantt-today-label">Сегодня</div>
                                            <div className="gantt-today-line"/>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="gantt-tasks">

                            {tasks.map((task, i) => {
                                const pos = calculateTaskPosition(task, days);
                                if (!pos.visible) return null;
                                return (
                                    <div
                                        key={task.id}
                                        className="gantt-task"
                                        style={{
                                            gridColumnStart: pos.start,
                                            gridColumnEnd: pos.end + 1,
                                            gridRowStart: i + 1,
                                            gridRowEnd: i + 2,
                                        }}
                                        title={`${task.name} (${task.start.toLocaleDateString()} - ${task.end.toLocaleDateString()})`}
                                    >
                                        {task.name}
                                    </div>
                                );
                            })}

                            <div
                                className="gantt-empty-row"
                                style={{
                                    gridColumnStart: 1,
                                    gridColumnEnd: days.length + 1,
                                    gridRowStart: tasks.length + 1,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Gantt;
