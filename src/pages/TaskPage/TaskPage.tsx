import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTasks } from "shared/store/slices/tasksSlice";
import { AppDispatch } from "shared/store";
import classes from "./TaskPage.module.scss";

interface Task {
    id: string | number;
    description: string;
    title: string;
    status: number;
    material: string;
    notice: string;
    start_date: string;
    end_date: string;
    [key: string]: any;
}

interface TaskGroup {
    [key: string]: Task[];
}

const statusTitles: { [key: number]: string } = {
    0: "Нужно выполныть",
    1: "В процессе",
    2: "Выполнено",
    3: "Провалено",
};

const TaskCard = ({ task }: { task: Task }) => (
    <div className={classes.taskCard}>
        <div className={classes.taskContent}>
            <p className={classes.description}>{task.description || task.title}</p>
            <p className={classes.material}>{task.material}</p>
            <p className={classes.notice}>{task.notice}</p>
            <div className={classes.dates}>
                <p>Начало: {task.start_date}</p>
                <p>Конец: {task.end_date}</p>
            </div>
        </div>
    </div>
);

const TaskPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const tasksData = useSelector((state: any) => state.tasks.tasks);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const result = await dispatch(getTasks()).unwrap();
                console.log("Tasks data:", result);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };
        fetchTasks();
    }, [dispatch]);

    const groupedTasks: TaskGroup = tasksData.results?.reduce((acc: TaskGroup, task: Task) => {
        // Используем статус как ключ
        const statusTitle = statusTitles[task.status] || "Неизвестный статус";
        if (!acc[statusTitle]) {
            acc[statusTitle] = [];
        }
        acc[statusTitle].push(task);
        return acc;
    }, {}) || {};

    return (
        <div className={classes.container}>
            {tasksData.results && tasksData.results.length > 0 ? (
                <div className={classes.statusColumns}>
                    {Object.entries(groupedTasks).map(([status, tasks]) => (
                        <div key={status} className={classes.statusColumn}>
                            <div className={classes.statusHeader}>
                                <h3>{status}</h3>
                            </div>
                            <div className={classes.taskBlock}>
                                <div className={classes.tasksList}>
                                    {tasks.map((task: Task) => (
                                        <TaskCard key={task.id} task={task} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className={classes.notFound}>Задачи не найдены</p>
            )}
        </div>
    );
};

export default TaskPage;
