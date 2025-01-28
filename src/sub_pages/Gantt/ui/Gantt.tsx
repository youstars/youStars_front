import React, { useEffect, useState } from "react";
import "./Gantt.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "shared/store";
import { getTasks } from "shared/store/slices/tasksSlice";

type Task = {
  id: number;
  name: string;
  start: Date;
  end: Date;
  status: string;
  specialist: string;
};

const Gantt: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tasksData = useSelector((state: any) => state.tasks.tasks);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());


  

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

  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };
   

    const isWeekend = (day: number): boolean => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };


  
  const daysInMonth = getDaysInMonth(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handlePreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };


  const isToday = (day: number): boolean => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    );
  };

  const filteredTasks = tasks.filter((task) => {
    const taskStartMonth = task.start.getMonth();
    const taskEndMonth = task.end.getMonth();
    const currentMonth = currentDate.getMonth();

    const taskStartYear = task.start.getFullYear();
    const taskEndYear = task.end.getFullYear();
    const currentYear = currentDate.getFullYear();

    return (
      (taskStartYear === currentYear && taskStartMonth === currentMonth) ||
      (taskEndYear === currentYear && taskEndMonth === currentMonth)
    );
  });

  const adjustedTasks = filteredTasks.map((task) => {
    const taskStart =
      task.start.getMonth() === currentDate.getMonth()
        ? task.start.getDate()
        : 1;
    const taskEnd =
      task.end.getMonth() === currentDate.getMonth()
        ? task.end.getDate()
        : daysInMonth;

    return {
      ...task,
      start: taskStart,
      end: taskEnd,
    };
  });

  const getStatusLabel = (status: string): string => {
    const openStatuses = ["Нужно выполнить", "in_progress"];
    const closedStatuses = ["completed", "Провалено"];

    if (openStatuses.includes(status)) return "Статус открыт";
    if (closedStatuses.includes(status)) return "Статус закрыт";

    return "Неизвестный статус";
  };

  return (
    <div className="gantt-container">
      <div className="gantt-header">
        <div className="gantt-month-navigation">
          <button onClick={handlePreviousMonth} className="gantt-arrow">
            {"<"}
          </button>
          <span className="gantt-month">
            {currentDate.toLocaleString("default", {
              month: "long",
            })}{" "}
            {currentDate.getFullYear()}
          </span>
          <button onClick={handleNextMonth} className="gantt-arrow">
            {">"}
          </button>
        </div>
      </div>

      <div className="gantt-content">
        <div className="gantt-status-table">
          <p className="graph">График времени</p>

          <p className="specialists">Специалисты / работы</p>
          {adjustedTasks.map((task) => (
            <div key={task.id} className="gantt-status-row">
              <span>{task.specialist?.[0]}</span>
              <span>{getStatusLabel(task.status)}</span>
            </div>
          ))}
        </div>
        <div className="gantt-calendar-container">
          <div className="gantt-calendar">
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              return (
                <div
                  key={i}
                  className={`gantt-day ${isWeekend(day) ? "weekend" : ""} ${
                    isToday(day) ? "today" : ""
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>

          <div className="gantt-tasks">
  {/* Сначала рендерим фон выходных */}
  {Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;

    return (
      <div
        key={`bg-${i}`}
        className={`gantt-task-background ${isWeekend ? "weekend" : ""}`}
        style={{
          gridColumnStart: day,
          gridColumnEnd: day + 1,
          gridRowStart: 1,
          gridRowEnd: adjustedTasks.length + 2, // Растягиваем фон на все ряды
        }}
      ></div>
    );
  })}

  {/* Затем рендерим задачи поверх фона */}
  {adjustedTasks.map((task, index) => (
    <div
      key={task.id}
      className="gantt-task"
      style={{
        gridColumnStart: task.start,
        gridColumnEnd: task.end + 1,
        gridRowStart: index + 1,
      }}
    >
      {task.name}
    </div>
  ))}


  <div
    className="gantt-empty-row"
    style={{
      gridColumnStart: 1,
      gridColumnEnd: 32, // 31 день + 1
      gridRowStart: adjustedTasks.length + 1, // Новый ряд после всех задач
    }}
  ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gantt;
