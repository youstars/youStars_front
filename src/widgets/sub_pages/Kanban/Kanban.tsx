import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTasks, updateTaskStatus, optimisticUpdateTaskStatus } from "shared/store/slices/tasksSlice";
import { AppDispatch, RootState } from "shared/store";
import { Task, TaskStatus } from "./types";
import AddTaskModal from "./AddTaskModal/AddTaskModal";
import classes from "./Kanban.module.scss";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SideFunnel from "widgets/SideBar/SideFunnel/SideFunnel";
import arrow_back from 'shared/images/sideBarImgs/arrow_back.svg'

const orderedStatusKeys: TaskStatus[] = [
    "to_do", "in_progress", "completed", "help", "pending", "review", "canceled"
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

const TaskCard: React.FC<{ task: Task }> = ({ task }) => (
    <div
        className={classes.taskCard}
        draggable
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
                borderLeft: `3px solid ${borderColors[task.status]}`
            }}
        >
            <p className={classes.title}><strong>{task.title}</strong></p>
            <p className={classes.description}><span>Дедлайн</span> {new Date(task.deadline).toLocaleDateString()}</p>
            <p className={classes.material}><strong>Исполнители</strong> {task.assigned_specialist?.length || 0}</p>
            <p className={classes.notice}><strong>Оценка времени</strong> {task.execution_period || "—"} часов</p>
            <p className={classes.dates_paragraph}><strong>Начало статуса</strong> {new Date(task.start_date).toLocaleDateString()}</p>
            <p className={classes.dates_paragraph}><strong>Подзадачи</strong> {task.subtasks_count}</p>
        </div>
    </div>
);

const Kanban: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { results: tasks } = useSelector((state: RootState) => state.tasks.tasks);
    const [startIndex, setStartIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hoveredStatus, setHoveredStatus] = useState<TaskStatus | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        dispatch(getTasks()).catch((err) => console.error("Ошибка при получении задач:", err));
    }, [dispatch]);

    console.log(tasks)

    const groupedTasks: Record<TaskStatus, Task[]> = {
        to_do: [], in_progress: [], completed: [],
        help: [], pending: [], review: [], canceled: []
    };

    tasks.forEach((task) => {
        if (groupedTasks[task.status]) {
            groupedTasks[task.status].push(task);
        }
    });

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, status: TaskStatus) => {
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

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>, newStatus: TaskStatus) => {
        e.preventDefault();
        setHoveredStatus(null);

        const taskId = Number(e.dataTransfer.getData("task-id"));
        if (!taskId) return;

        const task = tasks.find((t) => t.id === taskId);
        if (!task || task.status === newStatus) return;

        dispatch(optimisticUpdateTaskStatus({ id: taskId, status: newStatus }));
        try {
            await dispatch(updateTaskStatus({ id: taskId, status: newStatus })).unwrap();
        } catch (err) {
            console.error("Ошибка при смене статуса:", err);
        }
    };

    const canScrollLeft = startIndex > 0;
    const canScrollRight = startIndex < orderedStatusKeys.length - 4;
    const visibleStatuses = orderedStatusKeys.slice(startIndex, startIndex + 4);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className={`${classes.container} ${isSidebarOpen ? classes.sidebarOpen : ''}`}>
            <div className={classes.statusColumnsWrapper}>
                <div className={classes.statusColumns}>
                    {canScrollLeft && (
                        <button className={`${classes.navButton} ${classes.leftControl}`} onClick={() => setStartIndex((prev) => prev - 1)}>
                            <ChevronLeft size={20} />
                        </button>
                    )}

                    {visibleStatuses.map((statusKey) => (
                        <div
                            key={statusKey}
                            className={`${classes.statusColumn} ${hoveredStatus === statusKey ? classes.hovered : ''}`}
                            onDragOver={(e) => handleDragOver(e, statusKey)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, statusKey)}
                        >
                            <div className={classes.statusHeader}>
                                <h3>{statusTitles[statusKey]} <span>{groupedTasks[statusKey].length}</span></h3>
                            </div>
                            {groupedTasks[statusKey].length > 0 ? (
                                <div
                                    className={classes.taskBlock}
                                    style={{
                                        backgroundColor: `${borderColors[statusKey]}10`,
                                        borderRadius: '10px'
                                    }}
                                >
                                    <div className={classes.tasksList}>
                                        {groupedTasks[statusKey].map((task) => (
                                            <TaskCard
                                                key={task.id}
                                                task={task}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    ))}

                    {canScrollRight && (
                        <button className={`${classes.navButton} ${classes.rightControl}`} onClick={() => setStartIndex((prev) => prev + 1)}>
                            <ChevronRight size={20} />
                        </button>
                    )}

                    <button
                        className={`${classes.sidebarToggleButton} ${isSidebarOpen ? classes.open : ''}`}
                        onClick={toggleSidebar}
                        title={isSidebarOpen ? "Закрыть боковую панель" : "Открыть боковую панель"}
                    >
                        <img src={arrow_back} alt="Toggle sidebar" />
                    </button>
                </div>
            </div>

            <button className={classes.addTaskButton} onClick={() => setIsModalOpen(true)}>
                Добавить задачу
            </button>

            {isModalOpen && <AddTaskModal onClose={() => setIsModalOpen(false)} />}

            <SideFunnel isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </div>
    );
};

export default Kanban;
