import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "shared/store";
import { getTasks } from "shared/store/slices/tasksSlice";
import { Task } from "./types";
import "./Gantt.scss";

const MONTHS = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

const Gantt: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [visibleMonth, setVisibleMonth] = useState<number>(
    currentDate.getMonth()
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const result = await dispatch(getTasks()).unwrap();
        const mappedTasks = result.results.map((task: any) => ({
          id: task.id,
          name: task.title,
          start: new Date(task.start_date),
          end: new Date(task.end_date),
          status: task.status,
          specialist: task.assigned_specialist,
        }));
        setTasks(mappedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, [dispatch]);

  const handleScroll = () => {
    if (scrollContainerRef.current && !scrolling) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const dayWidth = 30;
      const daysScrolled = Math.floor(scrollLeft / dayWidth);
      const currentMonthIndex = new Date(
        currentDate.getFullYear(),
        0,
        daysScrolled + 1
      ).getMonth();
      setVisibleMonth(currentMonthIndex);
    }
  };

  const scrollToMonth = (direction: "next" | "prev") => {
    if (scrollContainerRef.current) {
      setScrolling(true);
      const dayWidth = 30;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const daysInCurrentMonth = new Date(
        currentDate.getFullYear(),
        visibleMonth + 1,
        0
      ).getDate();

      const targetScroll =
        direction === "next"
          ? currentScroll + daysInCurrentMonth * dayWidth
          : currentScroll - daysInCurrentMonth * dayWidth;

      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });

      setTimeout(() => {
        setScrolling(false);
        const newMonth =
          direction === "next"
            ? (visibleMonth + 1) % 12
            : (visibleMonth - 1 + 12) % 12;
        setVisibleMonth(newMonth);
      }, 300);
    }
  };

  const handleNextMonth = () => scrollToMonth("next");
  const handlePreviousMonth = () => scrollToMonth("prev");

  const isWeekend = (date: Date): boolean => {
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

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
    const openStatuses = ["Нужно выполнить", "in_progress"];
    const closedStatuses = ["completed", "Провалено"];

    if (openStatuses.includes(status)) return "Статус открыт";
    if (closedStatuses.includes(status)) return "Статус закрыт";

    return "Неизвестный статус";
  };

  const calculateTaskPosition = (task: Task, days: Date[]) => {
    const startIndex = days.findIndex(
      (day) => day.getTime() >= task.start.getTime()
    );

    const endIndex =
      days.findIndex((day) => day.getTime() > task.end.getTime()) - 1;

    return {
      start: startIndex + 1,
      end: endIndex > 0 ? endIndex + 1 : days.length,
      visible: true,
    };
  };

  const days = getDaysArray();

  return (
    <div className="gantt-container">
      <div className="gantt-header">
        <div className="gantt-month-navigation">
          <button onClick={handlePreviousMonth} className="gantt-arrow">
            {"<"}
          </button>
          <span className="gantt-month">
            {MONTHS[visibleMonth]} {currentDate.getFullYear()}
          </span>
          <button onClick={handleNextMonth} className="gantt-arrow">
            {">"}
          </button>
        </div>
      </div>

      <div className="gantt-content">
        <div className="gantt-status-table">
          <p className="graph">График времени</p>

          {tasks.map((task) => (
            <div key={task.id} className="gantt-status-row">
              <span>{task.specialist[0]}</span>
              <span>{getStatusLabel(task.status)}</span>
            </div>
          ))}
        </div>

        <div
          ref={scrollContainerRef}
          className="gantt-calendar-container"
          onScroll={handleScroll}
        >
          <div className="gantt-timeline">
            <div className="gantt-calendar">
              {days.map((day, index) => (
                <div
                  key={index}
                  className={`gantt-day ${isWeekend(day) ? "weekend" : ""} ${
                    isToday(day) ? "today" : ""
                  }`}
                >
                  <div className="gantt-day-header">
                    {day.getDate() === 1 && (
                      <div className="gantt-month-label">
                        {MONTHS[day.getMonth()]}
                      </div>
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
                  className={`gantt-task-background ${
                    isWeekend(day) ? "weekend" : ""
                  }`}
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

                if (!position.visible) {
                  return null;
                }

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
                    title={`${
                      task.name
                    } (${task.start.toLocaleDateString()} - ${task.end.toLocaleDateString()})`}
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
