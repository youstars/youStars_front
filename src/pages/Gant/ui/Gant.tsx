import React, { useEffect, useState } from "react";
import "./Gant.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "shared/store";
import { getTasks } from "shared/store/slices/tasksSlice";

type Task = {
  id: number;
  name: string;
  start: Date;
  end: Date;
  status: string;
  specialist: string
};

const Gantt: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tasksData = useSelector((state: any) => state.tasks.tasks);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
console.log(tasks);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const result = await dispatch(getTasks()).unwrap();
        const mappedTasks = result.results.map((task: any) => ({
          id: task.id,
          name: task.title,
          start: new Date(task.start_date),
          end: new Date(task.end_date),
          status: task.status, // Добавляем статус задачи
          specialist: task.assigned_specialist
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

  const isWeekend = (day: number): boolean => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // Воскресенье или суббота
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
    const taskStart = task.start.getMonth() === currentDate.getMonth()
      ? task.start.getDate()
      : 1; // Если задача началась в прошлом месяце, начало с 1
    const taskEnd = task.end.getMonth() === currentDate.getMonth()
      ? task.end.getDate()
      : daysInMonth; // Если задача закончится в будущем месяце, конец — последний день месяца

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
        
        <button onClick={handlePreviousMonth}>{"<"}</button>
        <span>
          {currentDate.toLocaleString("default", {
            month: "long",
          })}{" "}
          {currentDate.getFullYear()}
        </span>
        <button onClick={handleNextMonth}>{">"}</button>
      </div>

      <div className="gantt-content">
      <div className="gantt-status-table">
          <h3>Статусы задач</h3>
          {adjustedTasks.map((task) => (
            <div key={task.id} className="gantt-status-row">
              <span>{task.specialist}</span>
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
                  className={`gantt-day ${isWeekend(day) ? "weekend" : ""}`}
                >
                  {day}
                </div>
              );
            })}
          </div>

          <div className="gantt-tasks">
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
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default Gantt;
