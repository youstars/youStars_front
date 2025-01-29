import React, { useEffect, useRef, useState } from "react";
import "./Gantt.css";
import { useDispatch } from "react-redux";
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

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const Gantt: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [visibleMonth, setVisibleMonth] = useState<number>(currentDate.getMonth());
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
      const monthWidth = scrollContainerRef.current.firstElementChild?.firstElementChild?.clientWidth || 0;
      const currentMonthIndex = Math.floor(scrollLeft / monthWidth);
      setVisibleMonth(currentMonthIndex % 12);
    }
  };

  const scrollToMonth = (direction: 'next' | 'prev') => {
    if (scrollContainerRef.current) {
      setScrolling(true);
      const monthWidth = scrollContainerRef.current.firstElementChild?.firstElementChild?.clientWidth || 0;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const targetScroll = direction === 'next' 
        ? currentScroll + monthWidth 
        : currentScroll - monthWidth;

      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });

      setTimeout(() => {
        setScrolling(false);
        const newMonth = direction === 'next' 
          ? (visibleMonth + 1) % 12 
          : (visibleMonth - 1 + 12) % 12;
        setVisibleMonth(newMonth);
      }, 300);
    }
  };

  const handleNextMonth = () => scrollToMonth('next');
  const handlePreviousMonth = () => scrollToMonth('prev');

  const isWeekend = (day: number, monthIndex: number): boolean => {
    const date = new Date(currentDate.getFullYear(), monthIndex, day);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  const isToday = (day: number, monthIndex: number): boolean => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === monthIndex &&
      today.getFullYear() === currentDate.getFullYear()
    );
  };

  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getStatusLabel = (status: string): string => {
    const openStatuses = ["Нужно выполнить", "in_progress"];
    const closedStatuses = ["completed", "Провалено"];

    if (openStatuses.includes(status)) return "Статус открыт";
    if (closedStatuses.includes(status)) return "Статус закрыт";

    return "Неизвестный статус";
  };

  const calculateTaskPosition = (task: Task, monthIndex: number) => {
    const monthStart = new Date(currentDate.getFullYear(), monthIndex, 1);
    const monthEnd = new Date(currentDate.getFullYear(), monthIndex + 1, 0);
    const taskStart = new Date(Math.max(task.start.getTime(), monthStart.getTime()));
    const taskEnd = new Date(Math.min(task.end.getTime(), monthEnd.getTime()));

    if (taskStart <= monthEnd && taskEnd >= monthStart) {
      return {
        start: taskStart.getDate(),
        end: taskEnd.getDate(),
        visible: true,
        isStart: task.start.getMonth() === monthIndex,
        isEnd: task.end.getMonth() === monthIndex,
        continuesFromPrevious: task.start < monthStart,
        continuesToNext: task.end > monthEnd
      };
    }

    return {
      start: 0,
      end: 0,
      visible: false,
      isStart: false,
      isEnd: false,
      continuesFromPrevious: false,
      continuesToNext: false
    };
  };

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
          <p className="specialists">Специалисты / работы</p>
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
          <div className="gantt-months-container">
            {Array.from({ length: 12 }, (_, monthIndex) => {
              const daysInMonth = getDaysInMonth(
                currentDate.getFullYear(),
                monthIndex
              );

              return (
                <div 
                  key={monthIndex} 
                  className="gantt-month-section"
                  style={{
                    '--days-in-month': daysInMonth
                  } as React.CSSProperties}
                >
                  <div className="gantt-calendar">
                    {Array.from({ length: daysInMonth }, (_, i) => {
                      const day = i + 1;
                      return (
                        <div
                          key={i}
                          className={`gantt-day ${
                            isWeekend(day, monthIndex) ? "weekend" : ""
                          } ${isToday(day, monthIndex) ? "today" : ""}`}
                        >
                          {day}
                        </div>
                      );
                    })}
                  </div>

                  <div className="gantt-tasks">
                    {Array.from({ length: daysInMonth }, (_, i) => {
                      const day = i + 1;
                      return (
                        <div
                          key={`bg-${i}`}
                          className={`gantt-task-background ${
                            isWeekend(day, monthIndex) ? "weekend" : ""
                          }`}
                          style={{
                            gridColumnStart: day,
                            gridColumnEnd: day + 1,
                            gridRowStart: 1,
                            gridRowEnd: tasks.length + 2,
                          }}
                        />
                      );
                    })}

                    {tasks.map((task, taskIndex) => {
                      const position = calculateTaskPosition(task, monthIndex);
                      
                      if (position.visible) {
                        return (
                          <div
                            key={`${task.id}-${monthIndex}`}
                            className={`gantt-task 
                              ${position.continuesFromPrevious ? 'continues-from-previous' : ''} 
                              ${position.continuesToNext ? 'continues-to-next' : ''}`}
                            style={{
                              gridColumnStart: position.start,
                              gridColumnEnd: position.end + 1,
                              gridRowStart: taskIndex + 1,
                            }}
                            title={`${task.name} (${task.start.toLocaleDateString()} - ${task.end.toLocaleDateString()})`}
                          >
                            {position.isStart ? task.name : ''}
                            {position.continuesFromPrevious && !position.isStart && '...'}
                            {position.continuesToNext && position.isEnd && '...'}
                          </div>
                        );
                      }
                      return null;
                    })}

                    <div
                      className="gantt-empty-row"
                      style={{
                        gridColumnStart: 1,
                        gridColumnEnd: daysInMonth + 1,
                        gridRowStart: tasks.length + 1,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gantt;