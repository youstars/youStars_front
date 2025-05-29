import React, { useEffect, useRef, useState } from "react";
import { MONTHS, OPEN_STATUSES, CLOSED_STATUSES } from "./constants";
import { isToday, isWeekend, calculateTaskPosition } from "./utils";
import "./Gantt.scss";
import { useAppDispatch } from "shared/hooks/useAppDispatch";
import { useAppSelector } from "shared/hooks/useAppSelector";
import { Task } from "./types";
import { useOutletContext } from "react-router-dom";

import {
  getProjectTasks,
  selectProjectTasks,
  selectProjectTasksStatus,
  selectProjectTasksError
} from "shared/store/slices/projectTasksSlice";


const Gantt: React.FC = () => {
  const dispatch = useAppDispatch();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentDate] = useState<Date>(new Date());
  const [visibleMonth, setVisibleMonth] = useState<number>(currentDate.getMonth());
  const [scrolling, setScrolling] = useState(false);
  const { currentProjectId } = useOutletContext<{ currentProjectId: number | null }>();
  const tasksData = useAppSelector(selectProjectTasks);

  const status = useAppSelector(selectProjectTasksStatus);
  const error = useAppSelector(selectProjectTasksError);

  console.log("currentProjectId", currentProjectId);
  console.log("tasksData", tasksData);

  const tasks: Task[] = tasksData?.map((task: any) => ({
    id: task.id,
    name: task.title,
    start: new Date(task.start_date),
end: new Date(task.deadline),
    status: task.status,
    specialist: task.assigned_specialist,
  })) ?? [];


  useEffect(() => {
    if (currentProjectId) {
      dispatch(getProjectTasks(currentProjectId));
    }
  

    const scrollToCurrentMonth = () => {
      if (scrollContainerRef.current) {
        const currentMonth = currentDate.getMonth();
        const dayWidth = 30;
        const daysBefore = Array.from({ length: currentMonth }, (_, i) =>
          new Date(currentDate.getFullYear(), i + 1, 0).getDate()
        ).reduce((sum, days) => sum + days, 0);
  
        scrollContainerRef.current.scrollLeft = daysBefore * dayWidth;
      }
    };
  
    setTimeout(scrollToCurrentMonth, 0); 
  }, [dispatch, currentProjectId]);
  

  useEffect(() => {
    if (currentProjectId) {
      dispatch(getProjectTasks(currentProjectId));
    }
  }, [dispatch, currentProjectId]);

  if (!currentProjectId) return <p>Выберите проект</p>;


  const handleScroll = () => {
    if (scrollContainerRef.current && !scrolling) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const dayWidth = 30;
      const daysScrolled = Math.floor(scrollLeft / dayWidth);
      const currentMonthIndex = new Date(currentDate.getFullYear(), 0, daysScrolled + 1).getMonth();
      setVisibleMonth(currentMonthIndex);
    }
  };

  const scrollToMonth = (direction: "next" | "prev") => {
    if (scrollContainerRef.current) {
      setScrolling(true);
      const dayWidth = 30;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const daysInCurrentMonth = new Date(currentDate.getFullYear(), visibleMonth + 1, 0).getDate();

      const targetScroll = direction === "next"
        ? currentScroll + daysInCurrentMonth * dayWidth
        : currentScroll - daysInCurrentMonth * dayWidth;

      scrollContainerRef.current.scrollTo({ left: targetScroll, behavior: "smooth" });

      setTimeout(() => {
        setScrolling(false);
        const newMonth = direction === "next"
          ? (visibleMonth + 1) % 12
          : (visibleMonth - 1 + 12) % 12;
        setVisibleMonth(newMonth);
      }, 300);
    }
  };

  const handleNextMonth = () => scrollToMonth("next");
  const handlePreviousMonth = () => scrollToMonth("prev");

  const getDaysArray = () => {
    const startDate = new Date(currentDate.getFullYear(), 0, 1);
    const endDate = new Date(currentDate.getFullYear(), 11, 31);
    const days: Date[] = [];
    let currentDay = new Date(startDate);

    while (currentDay <= endDate) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    return days;
  };

  const getStatusLabel = (status: string): string => {
    const openStatuses = ["to_do", "in_progress", "review"];
    return openStatuses.includes(status) ? "Статус открыт" : "Статус закрыт";
  };
  

  const days = getDaysArray();

  if (status === "pending") return <p>Загрузка задач...</p>;
  if (status === "rejected") return <p>Ошибка: {error}</p>;

  return (
    <div className="gantt-container">
      <div className="gantt-header">
        <div className="gantt-month-navigation">
          <button onClick={handlePreviousMonth} className="gantt-arrow">{"<"}</button>
          <span className="gantt-month">{MONTHS[visibleMonth]} {currentDate.getFullYear()}</span>
          <button onClick={handleNextMonth} className="gantt-arrow">{">"}</button>
        </div>
      </div>

      <div className="gantt-content">
        <div className="gantt-status-table">
          <p className="graph">График времени</p>
          {tasks.map((task, index) => (
  <div key={task.id || `task-${index}`} className="gantt-status-row">
    <span>{task.specialist[0]}</span>
    <span>{getStatusLabel(task.status)}</span>
  </div>
))}
        </div>

        <div ref={scrollContainerRef} className="gantt-calendar-container" onScroll={handleScroll}>
          <div className="gantt-timeline">
            <div className="gantt-calendar">
              {days.map((day, index) => (
                <div
                  key={day.toISOString()}
                  className={`gantt-day ${isWeekend(day) ? "weekend" : ""} ${isToday(day) ? "today" : ""}`}
                >
                  <div className="gantt-day-header">
                    {day.getDate() === 1 && (
                      <div className="gantt-month-label">{MONTHS[day.getMonth()]}</div>
                    )}
                    {day.getDate()}
                  </div>
                  {isToday(day) && (
                    <>
                      <div className="gantt-today-label">Сегодня</div>
                      <div className="gantt-today-line"></div>
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="gantt-tasks">
              {days.map((day, index) => (
                <div
                  key={`bg-${index}`}
                  className={`gantt-task-background ${isWeekend(day) ? "weekend" : ""}`}
                  style={{
                    gridColumnStart: index + 1,
                    gridColumnEnd: index + 2,
                    gridRowStart: 1,
                    gridRowEnd: tasks.length + 2,
                  }}
                />
              ))}

              {tasks.map((task, taskIndex) => {
                const position = calculateTaskPosition(task, days);
                if (!position.visible) return null;
                return (
                  <div
                    key={task.id}
                    className="gantt-task"
                    style={{
                      gridColumnStart: position.start,
                      gridColumnEnd: position.end + 1,
                      gridRowStart: taskIndex + 1,
                      gridRowEnd: taskIndex + 2,
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
