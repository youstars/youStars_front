import React, {useEffect, useRef, useState, useMemo, useCallback} from "react";
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

        // Reset auto‑scroll so that timeline jumps to earliest task of the new project
        hasAutoScrolled.current = false;
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollLeft = 0;
        }
      }
    }, [dispatch, currentProjectId]);


    const tasks: GanttTask[] = useMemo(
        () =>
            tasksData.map((task) => {
              // Collect specialists the same way Kanban does:
              // 1) Prefer `assigned_specialist_data`, fallback to `assigned_specialist`
              // 2) If the array item has `.custom_user`, use that object
              const rawList =
                (task as any).assigned_specialist_data ??
                (task as any).assigned_specialist ??
                [];

              const specialistsArr: any[] = Array.isArray(rawList)
                ? rawList.map((item: any) => item?.custom_user ?? item)
                : rawList
                ? [rawList?.custom_user ?? rawList]
                : [];

              return {
                id: task.id,
                name: task.title,
                start: new Date(task.start_date),
                end: new Date(task.deadline || task.start_date),
                status: task.status,
                specialist: specialistsArr,
              };
            }),
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

    const getDaysArray = useCallback(() => {
        const start = new Date(currentDate.getFullYear(), 0, 1);
        const end = new Date(currentDate.getFullYear(), 11, 31);
        const days = [];
        let day = new Date(start);
        while (day <= end) {
            days.push(new Date(day));
            day.setDate(day.getDate() + 1);
        }
        return days;
    }, [currentDate]);

    const getStatusLabel = (status: string) => {
        return ["to_do", "in_progress", "review"].includes(status) ? "Статус открыт" : "Статус закрыт";
    };

    // Converts various specialist object shapes to a readable full name
    const formatSpecialistName = (s: any): string => {
      if (!s) return "";
      if ("full_name" in s && s.full_name) return s.full_name as string;
      if ("last_name" in s || "first_name" in s) {
        return `${s?.last_name ?? ""} ${s?.first_name ?? ""}`.trim();
      }
      return (s?.name ?? s?.username ?? s?.email ?? String(s?.id ?? "")).toString();
    };

    const days = useMemo(() => getDaysArray(), [getDaysArray]);

    const hasAutoScrolled = useRef(false);

    useEffect(() => {
        if (hasAutoScrolled.current) return;

        if (scrollContainerRef.current && tasks.length > 0) {
            // Scroll to the earliest task start date
            const earliestTaskDate = tasks.reduce<Date>(
              (min, t) => (t.start < min ? t.start : min),
              tasks[0].start
            );
            earliestTaskDate.setHours(0, 0, 0, 0);

            const targetIndex = days.findIndex(
              (day) => day.toDateString() === earliestTaskDate.toDateString()
            );

            if (targetIndex !== -1) {
              scrollContainerRef.current.scrollLeft =
                targetIndex * dayWidthRef.current;

              // Sync visible month with scrolled position
              const monthIdx = new Date(
                currentDate.getFullYear(),
                0,
                targetIndex + 1
              ).getMonth();
              setVisibleMonth(monthIdx);
            }

            hasAutoScrolled.current = true;
        }
    }, [tasks, days, currentDate]);

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
                            <span>
                              {task.specialist.length
                                ? task.specialist.map(formatSpecialistName).join(", ")
                                : "Без специалиста"}
                            </span>
                            <span>{getStatusLabel(String(task.status))}</span>
                        </div>
                    ))}
                </div>

                <div ref={scrollContainerRef} className="gantt-calendar-container" onScroll={handleScroll}>
                    <div className="gantt-timeline">
                        <div className="gantt-calendar">
                            {days.map((day) => (
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
