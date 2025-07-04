import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProjectById } from "shared/store/slices/projectsSlice";
import {
  getTasks,
  updateTaskFields,
  optimisticUpdateTaskStatus,
  selectTasks,
} from "shared/store/slices/tasksSlice";
import { AppDispatch } from "shared/store";
import AddTaskModal from "./AddTaskModal/AddTaskModal";
import classes from "./Kanban.module.scss";
import { ChevronLeft, ChevronRight } from "lucide-react";
import arrow_back from "shared/images/sideBarImgs/arrow_back.svg";
import { Task, TaskStatus } from "shared/types/tasks";
import { useOutletContext } from "react-router-dom";
import { getProjectTasks } from "shared/store/slices/projectTasksSlice";
import SideTask from "widgets/SideBar/SideTask/SideTask";

const orderedStatusKeys: TaskStatus[] = [
  "to_do",
  "in_progress",
  "completed",
  "help",
  "pending",
  "review",
  "canceled",
];

const statusTitles: Record<TaskStatus, string> = {
  to_do: "Нужно выполнить",
  in_progress: "В процессе",
  completed: "Выполнено",
  help: "Помощь",
  pending: "В ожидании",
  review: "Проверка",
  canceled: "Отменено",
};

const borderColors: Record<TaskStatus, string> = {
  to_do: "#5D8EF1",
  in_progress: "#FFC400",
  completed: "#4FBF4B",
  help: "#4DB7A5",
  pending: "#888888",
  review: "#FF9500",
  canceled: "#FF4E4E",
};

const TaskCard: React.FC<{ task: Task; onClick: () => void }> = ({
  task,
  onClick,
}) => {
  const rawList = (task as any).assigned_specialist_data ?? [];

  const specialists: any[] = Array.isArray(rawList)
    ? rawList.map((item: any) => item?.custom_user ?? item)
    : [];
  return (
    <div
      className={classes.taskCard}
      draggable
      onClick={onClick}
      onDragStart={(e) => {
        e.dataTransfer.setData("task-id", String(task.id));
        e.dataTransfer.effectAllowed = "move";

        const target = e.currentTarget as HTMLElement;
        target.classList.add(classes.dragging);

        const handleDragEnd = () => {
          target.classList.remove(classes.dragging);
          target.removeEventListener("dragend", handleDragEnd);
        };
        target.addEventListener("dragend", handleDragEnd);
      }}
    >
      <div
        className={classes.taskContent}
        style={{
          borderLeft: `3px solid ${borderColors[task.status as TaskStatus]}`,
        }}
      >
        <p className={classes.title}>
          <strong>{task.title}</strong>
        </p>
        <p className={classes.description}>
          <span>Дедлайн</span> {new Date(task.deadline).toLocaleDateString()}
        </p>
        <div className={classes.specialists}>
          {specialists.length ? (
            specialists.map((u: any, idx: number) => (
              <div key={u.id ?? idx} className={classes.specialist}>
                {u.avatar ? (
                  <img src={u.avatar} alt={u.full_name ?? "avatar"} />
                ) : (
                  <div className={classes.avatarPlaceholder}>
                    {(u.full_name ?? "?")[0]}
                  </div>
                )}
                <span>{u.full_name ?? "Без имени"}</span>
              </div>
            ))
          ) : (
            <span>—</span>
          )}
        </div>

        <p className={classes.notice}>
          <strong>Оценка времени</strong> {task.execution_period || "—"} часов
        </p>
        <p className={classes.dates_paragraph}>
          <strong>Начало статуса</strong>{" "}
          {new Date(task.updated_at).toLocaleDateString()}
        </p>
        <p className={classes.dates_paragraph}>
          <strong>Подзадачи</strong> {task.subtasks_count}
        </p>
      </div>
    </div>
  );
};

const Kanban: React.FC = () => {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const { currentProjectId } = useOutletContext<{
    currentProjectId: number | null;
  }>();
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector(selectTasks);
  const [startIndex, setStartIndex] = useState(0);
  // Сколько колонок помещается по ширине окна (динамический расчёт)
  const [columnsCount, setColumnsCount] = useState(() => {
    const COLUMN_WIDTH = 300; // px — ширина одной колонки (совпадает с CSS)
    if (typeof window !== "undefined") {
      return Math.min(
        orderedStatusKeys.length,
        Math.max(1, Math.floor(window.innerWidth / COLUMN_WIDTH))
      );
    }
    return 1; // SSR fallback
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredStatus, setHoveredStatus] = useState<TaskStatus | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const projectTasks = currentProjectId
    ? tasks.filter((task) => task.project === currentProjectId)
    : tasks;
  useEffect(() => {
    dispatch(getTasks()).catch((err) =>
      console.error("Ошибка при получении задач:", err)
    );
  }, [dispatch]);

  // перерасчёт columnsCount при ресайзе
  useEffect(() => {
    const COLUMN_WIDTH_PX = 300; // px — ширина одной колонки
    const updateCount = () => {
      const count = Math.max(
        1,
        Math.floor(window.innerWidth / COLUMN_WIDTH_PX)
      );
      setColumnsCount(
        count > orderedStatusKeys.length ? orderedStatusKeys.length : count
      );
    };
    updateCount(); // первичный расчёт
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  useEffect(() => {
    if (startIndex > orderedStatusKeys.length - columnsCount) {
      setStartIndex(Math.max(0, orderedStatusKeys.length - columnsCount));
    }
  }, [columnsCount, startIndex]);

  console.log(tasks);
  useEffect(() => {
    if (currentProjectId) {
      dispatch(getProjectTasks(currentProjectId));
      dispatch(getProjectById(currentProjectId));
    }
  }, [dispatch, currentProjectId]);

  const groupedTasks: Record<TaskStatus, Task[]> = {
    to_do: [],
    in_progress: [],
    completed: [],
    help: [],
    pending: [],
    review: [],
    canceled: [],
  };

  projectTasks.forEach((task) => {
    const statusKey = task.status as TaskStatus;
    if (groupedTasks[statusKey]) {
      groupedTasks[statusKey].push(task);
    }
  });

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    status: TaskStatus
  ) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (hoveredStatus !== status) {
      setHoveredStatus(status);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setHoveredStatus(null);
    }
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    newStatus: TaskStatus
  ) => {
    e.preventDefault();
    setHoveredStatus(null);

    const taskId = Number(e.dataTransfer.getData("task-id"));
    if (!taskId) return;

    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;

    dispatch(optimisticUpdateTaskStatus({ id: taskId, status: newStatus }));
    try {
      await dispatch(
        updateTaskFields({ id: taskId, changes: { status: newStatus } })
      ).unwrap();
    } catch (err) {
      console.error("Ошибка при смене статуса:", err);
    }
  };
  useEffect(() => {
    if (currentProjectId) {
      dispatch(getProjectTasks(currentProjectId));
    }
  }, [dispatch, currentProjectId]);

  const canScrollLeft = startIndex > 0;
  const canScrollRight = startIndex < orderedStatusKeys.length - columnsCount;
  const visibleStatuses = orderedStatusKeys.slice(
    startIndex,
    startIndex + columnsCount
  );

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div
      className={`${classes.container} ${
        isSidebarOpen ? classes.sidebarOpen : ""
      }`}
    >
      <div className={classes.statusColumnsWrapper}>
        <div className={classes.statusColumns}>
          {canScrollLeft && (
            <button
              className={`${classes.navButton} ${classes.leftControl}`}
              onClick={() => setStartIndex((prev) => prev - 1)}
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {visibleStatuses.map((statusKey) => (
            <div
              key={statusKey}
              className={`${classes.statusColumn} ${
                hoveredStatus === statusKey ? classes.hovered : ""
              }`}
              onDragOver={(e) => handleDragOver(e, statusKey)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, statusKey)}
            >
              <div className={classes.statusHeader}>
                <h3>
                  {statusTitles[statusKey]}{" "}
                  <span>{groupedTasks[statusKey].length}</span>
                </h3>
              </div>
              {groupedTasks[statusKey].length > 0 ? (
                <div
                  className={classes.taskBlock}
                  style={{
                    backgroundColor: `${borderColors[statusKey]}10`,
                    borderRadius: "10px",
                  }}
                >
                  <div className={classes.tasksList}>
                    {groupedTasks[statusKey].map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onClick={() => {
                          setSelectedTaskId(task.id.toString());
                          setIsSidebarOpen(true);
                        }}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
              {statusKey === "to_do" && (
                <button
                  className={classes.addTaskButton}
                  onClick={() => setIsModalOpen(true)}
                >
                  Добавить задачу
                </button>
              )}
            </div>
          ))}

          {canScrollRight && (
            <button
              className={`${classes.navButton} ${classes.rightControl}`}
              onClick={() => setStartIndex((prev) => prev + 1)}
            >
              <ChevronRight size={20} />
            </button>
          )}

          <button
            className={`${classes.sidebarToggleButton} ${
              isSidebarOpen ? classes.open : ""
            }`}
            onClick={toggleSidebar}
            title={
              isSidebarOpen
                ? "Закрыть боковую панель"
                : "Открыть боковую панель"
            }
          >
            <img src={arrow_back} alt="Toggle sidebar" />
          </button>
        </div>
      </div>

      {isModalOpen && (
        <AddTaskModal
          isOpen={isModalOpen}
          toggleSidebar={() => setIsModalOpen(false)}
          projectId={currentProjectId}
        />
      )}

      {selectedTaskId && (
        <SideTask
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          id={parseInt(selectedTaskId)}
        />
      )}
    </div>
  );
};
export default Kanban;
