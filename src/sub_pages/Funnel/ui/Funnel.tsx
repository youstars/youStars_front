import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getTasks} from "shared/store/slices/tasksSlice";
import {AppDispatch} from "shared/store";
import classes from "./Funnel.module.scss";
import {Input} from "shared/index";
import search from "shared/images/sideBarImgs/search.svg";
import settingsIcon from "shared/images/setingsIcon.svg"
import addIcon from "shared/images/addIcon.svg"
import correctIcon from "shared/images/corectIcon.svg"

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
    0: "Новая заявка",
    1: "Обработка",
    2: "Утверждение специалиста",
    3: "Оплачено",
};

const TaskCard = ({task}: { task: Task }) => (
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

const Funnel = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');


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
        const statusTitle = statusTitles[task.status] || "Неизвестный статус";
        if (!acc[statusTitle]) {
            acc[statusTitle] = [];
        }
        acc[statusTitle].push(task);
        return acc;
    }, {}) || {};

    return (
        <div className={classes.container}>

            <div className={classes.search}>
                <div className={classes.input_wrapper}>
                    <Input
                        className={classes.input}
                        type="text"
                        placeholder="Поиск"
                        value={searchTerm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    />
                    <img src={search} alt="Search Icon" className={classes.search_icon}/>
                </div>

                <div className={classes.icons}>
                    <img src={settingsIcon} alt=""/>
                    <img src={addIcon} alt=""/>
                    <img src={correctIcon} alt=""/>
                </div>
            </div>

            <div className={classes.options}>
                <div className={classes.options_items}>
                    <p>Все</p>
                    <p>Новые</p>
                    <p>По сроку</p>
                    <p>По каличеству задач</p>
                    <p>По бюджету</p>
                </div>
                <div>
                    <img src={settingsIcon} alt=""/>
                </div>
            </div>


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
                                        <TaskCard key={task.id} task={task}/>
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

export default Funnel;
