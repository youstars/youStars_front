import React, { useEffect, useState } from "react";
import classes from "./SideFunnel.module.scss";
import arrow from "shared/images/sideBarImgs/arrow.svg";
import { useDispatch, useSelector } from "react-redux";
// import { getTasks } from "shared/store/slices/tasksSlice";
import { selectFunnel } from "shared/store/slices/funnelSlice";
import chat from "shared/images/chat.svg";
import chats from "shared/images/chats.svg";
import filter from "shared/images/filter.svg";
import calendar from "shared/images/calendar.svg";
import lines from "shared/images/calendar-alt 3.svg";
import time from "shared/images/time.svg";
import check from "shared/images/check.svg";
import plus from "shared/images/plus.svg";
import upplod from "shared/images/upplod.svg";
import corect from "shared/images/edit.svg";
import { getTasks, updateTaskDeadline } from "shared/store/slices/tasksSlice";

// Определяем тип пропсов для SideFunnel
interface SideFunnelProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

const ExpandableText = ({ text, maxLength = 100 }: { text: string; maxLength?: number }) => {
    const [expanded, setExpanded] = useState(false);
    const isLong = text.length > maxLength;
    const getData = useSelector((state: any) => state.tasks.tasks);
    const funnelData = useSelector(selectFunnel);

    useEffect(() => {
        console.log("SDB", funnelData);
    }, [getData, funnelData]);

    const toggleExpanded = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setExpanded((prev) => !prev);
    };

    return (
        <div className={classes.expandableBlock}>
            <p className={classes.expandableText}>
                {expanded || !isLong ? text : `${text.slice(0, maxLength)}... `}
                {isLong && (
                    <button
                        className={classes.toggleLink}
                        onClick={toggleExpanded}
                        type="button"
                    >
                        {expanded ? "Скрыть" : "Дальше"}
                    </button>
                )}
            </p>
        </div>
    );
};

const SideFunnel: React.FC<SideFunnelProps> = ({ isOpen, toggleSidebar }) => {
    const dispatch = useDispatch();
    const getData = useSelector((state: any) => state.tasks.tasks);
    const funnelData = useSelector(selectFunnel);
    const [isSubtasksOpen, setIsSubtasksOpen] = useState(false);
    const [isFilesOpen, setIsFilesOpen] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [deadline, setDeadline] = useState("");

    useEffect(() => {
        if (isOpen) {
            // @ts-ignore
            dispatch(getTasks());
        }
    }, [isOpen, dispatch]);

    useEffect(() => {
        const fetchedDate = getData?.results?.[0]?.end_date?.split("T")[0];
        if (fetchedDate && fetchedDate !== deadline) {
            setDeadline(fetchedDate);
        }
    }, [getData, deadline]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setUploadedFiles([...uploadedFiles, ...Array.from(files)]);
        }
    };

    const handleDateChange = async (e: any) => {
        const newDate = e.target.value;
        setDeadline(newDate);
        const taskId = getData?.results?.[0]?.id;

        if (taskId) {
            try {
                // @ts-ignore
                await dispatch(updateTaskDeadline({ id: taskId, end_date: newDate }));
                // @ts-ignore
                dispatch(getTasks());
                console.log("Дедлайн успешно обновлён");
            } catch (error) {
                console.error("Ошибка при обновлении дедлайна:", error);
            }
        }
    };

    return (
        <div className={`${classes.sidebar} ${isOpen ? classes.open : ''}`}>
            <div className={classes.content}>
                <div className={classes.content}>
                    <img
                        src={arrow}
                        alt="Toggle Sidebar"
                        onClick={toggleSidebar}
                        className={`${classes.arrowToggle} ${isOpen ? classes.rotated : ''}`}
                    />
                    <header className={classes.header}>
                        <div className={classes.bloks}>
                            <div className={classes.user_img}>
                                <img src="" alt=""/>
                            </div>
                            <div className={classes.user_name}>
                                <p>Иван Соколов</p>
                                <p>ООО “Ratter”</p>
                            </div>
                            <div className={classes.chats}>
                                <img src={chat} alt=""/>
                                <img src={chats} alt=""/>
                            </div>
                        </div>
                    </header>

                    <section className={classes.section}>
                        <p className={classes.title}>Сфера деятельности</p>
                        {getData.results && getData.results.length > 0 ? (
                            <div className={classes.time_block}>
                                <div className={classes.project_name}>
                                    <p>Дедлайн статуса</p>
                                    <div className={classes.fidback}>
                                        <img src={calendar} alt=""/>
                                        <p>{deadline || 'Без названия'}</p>
                                    </div>
                                </div>

                                <div className={classes.project_name}>
                                    <p>Начало статуса</p>
                                    <div className={classes.fidback}>
                                        <span className={classes.start_deta}/>
                                        <p>{getData.results[0].end_date || 'Без названия'}</p>
                                    </div>
                                </div>

                                <div className={classes.project_name}>
                                    <p>Последний контакт <br/> с заказчиком</p>
                                    <div className={classes.fidback}>
                                        <img src={lines} alt=""/>
                                        <p>{getData.results[0].end_date || 'Без названия'}</p>
                                    </div>
                                </div>

                                <div className={classes.project_name}>
                                    <p>Создано</p>
                                    <div className={classes.fidback}>
                                        <img src={time} alt=""/>
                                        <p>{getData.results[0].end_date || 'Без названия'}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className={classes.project_card}>
                                <p>{getData ? 'Нет данных для отображения' : 'Загрузка данных...'}</p>
                            </div>
                        )}

                        <div className={classes.editDeadline}>
                            <label htmlFor="deadlineInput">Запрос</label>
                            <input
                                id="deadlineInput"
                                type="date"
                                value={deadline}
                                onChange={handleDateChange}
                                className={classes.dateInput}
                            />
                            <img src={corect} alt="calendar icon"/>
                        </div>

                        <ExpandableText
                            text="The same screen can be built in a lot of different ways, but only a few of them will get your message across correctly and result in an easy-to-use software or..."
                        />

                        {funnelData?.[0] && (
                            <div className={classes.funnelInfo}>
                                <div className={classes.sum}>
                                    <p>Сумма сделки</p>
                                    <span>{funnelData[0].amount}</span>
                                </div>
                                <div className={classes.sum}>
                                    <p>Трекер</p>
                                    <span>{funnelData[0].id}</span>
                                </div>
                                <div className={classes.sum}>
                                    <p>Специалисты</p>
                                    <span>{funnelData.length}</span>
                                </div>
                            </div>
                        )}

                        <div className={classes.blok_paragraph}>
                            <h3>Заметки по заявке</h3>
                            <div className={classes.paragraph}>
                                <p>
                                    The same screen can be built in a lot of different ways, but only a few of them will
                                    get your message across correctly and result in an.
                                </p>
                            </div>
                        </div>

                        <div className={classes.subtasksWrapper}>
                            <div
                                className={classes.subtasksHeader}
                                onClick={() => setIsSubtasksOpen((prev) => !prev)}
                            >
                                <h3>Подзадачи</h3>
                                <span className={`${classes.arrow} ${isSubtasksOpen ? classes.up : classes.down}`}/>
                            </div>

                            {isSubtasksOpen && (
                                <div className={classes.subtasksContent}>
                                    <div className={classes.check_block}>
                                        <img src={check} alt=""/>
                                        <p>Пристать счет об оплате</p>
                                    </div>
                                    <div className={classes.plus_block}>
                                        <img src={plus} alt=""/>
                                        <p>Новая задача</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={classes.uploadWrapper}>
                            <div className={classes.uploadHeader}>
                <span
                    className={`${classes.arrow} ${isFilesOpen ? classes.up : classes.down}`}
                    onClick={() => setIsFilesOpen((prev) => !prev)}
                />
                                <p onClick={() => setIsFilesOpen((prev) => !prev)}>Файлы</p>
                                <div className={classes.rightControls}>
                                    <label className={classes.uploadIcon}>
                                        <img src={upplod} alt="Upload"/>
                                        <input
                                            type="file"
                                            multiple
                                            hidden
                                            onChange={handleFileUpload}
                                        />
                                    </label>
                                </div>
                            </div>

                            {isFilesOpen && (
                                <div className={classes.uploadBody}>
                                    {uploadedFiles.length > 0 && (
                                        <ul className={classes.fileList}>
                                            {uploadedFiles.map((file, index) => (
                                                <li key={index} className={classes.fileItem}>
                                                    📎 {file.name}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default SideFunnel;
