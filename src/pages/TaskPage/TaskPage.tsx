import React from 'react';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from './TaskPage.module.scss';
import {getTasks} from "shared/store/slices/tasksSlice";

interface Task {
    id: string;
    title: string;
    status: string;
    material: string;
    notice: string;
    start_date: string;
    end_date: string;
}

interface TaskGroup {
    [key: string]: Task[];
}

const statusTitles: { [key: string]: string } = {
    in_progress: "В процессе",
    being_performed: "Выполняется",
    completed: "Завершено",
    under_revision: "На проверке"
};

const TaskCard = ({ task }: { task: Task }) => (
    <div className={styles.taskCard}>
        <div className={styles.taskContent}>
            <p className={styles.material}>{task.material}</p>
            <p className={styles.notice}>{task.notice}</p>
            <div className={styles.dates}>
                <p>Начало: {task.start_date}</p>
                <p>Конец: {task.end_date}</p>
            </div>
        </div>
    </div>
);

const TaskPage = () => {
    const dispatch = useDispatch();
    const getData = useSelector((state: any) => state.tasks.tasks);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                // @ts-ignore
                const result = await dispatch(getTasks()).unwrap();
                console.log("Tasks data:", result);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };
        fetchTasks();
    }, [dispatch]);

    const groupedTasks: TaskGroup = getData.results?.reduce((acc: TaskGroup, task: Task) => {
        if (!acc[task.status]) {
            acc[task.status] = [];
        }
        acc[task.status].push(task);
        return acc;
    }, {}) || {};

    return (
        <div className={styles.container}>
            {getData.results && getData.results.length > 0 ? (
                <div className={styles.statusColumns}>
                    {Object.entries(groupedTasks).map(([status, tasks]) => (
                        <div key={status} className={styles.statusColumn}>
                            <div className={styles.statusHeader}>
                                <h3>{statusTitles[status]}</h3>
                            </div>
                            <div className={styles.tasksList}>
                                {tasks.map((task: Task) => (
                                    <TaskCard key={task.id} task={task} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className={styles.notFound}>Задачи не найдены</p>
            )}
        </div>
    );
};

export default TaskPage;
