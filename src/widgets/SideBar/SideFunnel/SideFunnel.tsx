import React, { useState, useEffect } from 'react';
import {
    MessageCircle,
    MessagesSquare,
    Calendar,
    Clock,
    CheckSquare,
    PlusSquare,
    Upload,
    Edit,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import classes from "./SideFunnel.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "shared/store";
import { updateTaskDeadline } from "shared/store/slices/tasksSlice";

interface SideFunnelProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

const ExpandableText: React.FC<{ text: string; maxLength?: number }> = ({ text, maxLength = 100 }) => {
    const [expanded, setExpanded] = useState(false);
    const isLong = text.length > maxLength;

    const toggleExpanded = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setExpanded(prev => !prev);
    };

    return (
        <div className={classes.expandableBlock}>
            <p className={classes.expandableText}>
                {expanded || !isLong ? text : `${text.slice(0, maxLength)}... `}
                {isLong && (
                    <button className={classes.toggleLink} onClick={toggleExpanded} type="button">
                        {expanded ? "Скрыть" : "Дальше"}
                    </button>
                )}
            </p>
        </div>
    );
};

const SideFunnel: React.FC<SideFunnelProps> = ({ isOpen, toggleSidebar }) => {
    const dispatch = useDispatch();
    const [isSubtasksOpen, setIsSubtasksOpen] = useState(true);
    const [isFilesOpen, setIsFilesOpen] = useState(true);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const { results: tasks } = useSelector((state: RootState) => state.tasks.tasks);
    const currentTask = tasks?.[0];
    const [deadline, setDeadline] = useState(currentTask?.deadline || '');

    useEffect(() => {
        setDeadline(currentTask?.deadline || '');
    }, [currentTask?.deadline]);

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'Не указано';
        try {
            return new Date(dateString).toISOString().split('T')[0];
        } catch {
            return dateString;
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setUploadedFiles(prev => [...prev, ...Array.from(files)]);
        }
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setDeadline(newDate);
        if (currentTask && currentTask.deadline !== newDate) {
            // @ts-ignore
            dispatch(updateTaskDeadline({ id: currentTask.id, end_date: newDate }));
        }
    };

    return (
        <div className={`${classes.sidebarContainer} ${isOpen ? classes.containerOpen : ''}`}>
            <div className={`${classes.sidebar} ${isOpen ? classes.open : ''}`}>
                <button className={classes.toggleButton} onClick={toggleSidebar}>
                    {isOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>

                <div className={classes.contentWrapper}>
                    <div className={classes.content}>
                        <header className={classes.header}>
                            <div className={classes.bloks}>
                                <div className={classes.user_img}></div>
                                <div className={classes.user_name}>
                                    <p>{currentTask?.assigned_specialist[0] || 'Имя не указано'}</p>
                                    <p className={classes.tracker}>трекер №{currentTask?.id || '-'}</p>
                                </div>
                                <div className={classes.chats}>
                                    <MessageCircle size={18} className={classes.icon} />
                                    <MessagesSquare size={18} className={classes.icon} />
                                </div>
                            </div>
                        </header>

                        <section className={classes.section}>
                            <p className={classes.title}>Название задачи</p>

                            {currentTask && (
                                <div className={classes.time_block}>
                                    <div className={classes.project_name}>
                                        <p>Дедлайн</p>
                                        <div className={classes.fidback}>
                                            <Calendar size={14} className={classes.icon} />
                                            <p>{formatDate(currentTask.deadline)}</p>
                                        </div>
                                    </div>
                                    <div className={classes.project_name}>
                                        <p>Начало статуса</p>
                                        <div className={classes.fidback}>
                                            <Calendar size={14} className={classes.icon} />
                                            <p>{formatDate(currentTask.start_date)}</p>
                                        </div>
                                    </div>
                                    <div className={classes.project_name}>
                                        <p>Создано</p>
                                        <div className={classes.fidback}>
                                            <Clock size={14} className={classes.icon} />
                                            <p>{formatDate(currentTask.created_at)}</p>
                                        </div>
                                    </div>
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
                                <Edit size={14} className={classes.icon} />
                            </div>

                            <ExpandableText text={currentTask?.description || 'Описание отсутствует'} />

                            <div className={classes.blok_paragraph}>
                                <h3>Комментарии по задаче</h3>
                                <div className={classes.paragraph}>
                                    <p>{currentTask?.notice || 'Комментариев нет'}</p>
                                </div>
                            </div>

                            <div className={classes.subtasksWrapper}>
                                <div className={classes.subtasksHeader} onClick={() => setIsSubtasksOpen(prev => !prev)}>
                                    <h3>Подзадачи</h3>
                                    <span className={`${classes.arrow} ${isSubtasksOpen ? classes.up : ''}`} />
                                </div>

                                {isSubtasksOpen && (
                                    <div className={classes.subtasksContent}>
                                        {currentTask?.subtasks_count ? (
                                            <div className={classes.check_block}>
                                                <CheckSquare size={14} className={classes.icon} />
                                                <p>Забить все в GPT</p>
                                            </div>
                                        ) : (
                                            <p>Нет подзадач</p>
                                        )}
                                        <div className={classes.plus_block}>
                                            <PlusSquare size={14} className={classes.icon} />
                                            <p>Новая задача</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className={classes.uploadWrapper}>
                                <div className={classes.uploadHeader}>
                                    <span className={`${classes.arrow} ${isFilesOpen ? classes.up : ''}`} onClick={() => setIsFilesOpen(prev => !prev)} />
                                    <p onClick={() => setIsFilesOpen(prev => !prev)}>Файлы</p>
                                    <label className={classes.uploadIcon}>
                                        <Upload size={16} className={classes.icon} />
                                        <input type="file" multiple hidden onChange={handleFileUpload} />
                                    </label>
                                </div>

                                {isFilesOpen && (
                                    <div className={classes.uploadBody}>
                                        {currentTask?.files?.length ? (
                                            <ul className={classes.fileList}>
                                                {currentTask.files.map((file, index) => (
                                                    <li key={index} className={classes.fileItem}>{file.name || `Файл ${index + 1}`}</li>
                                                ))}
                                            </ul>
                                        ) : uploadedFiles.length > 0 ? (
                                            <ul className={classes.fileList}>
                                                {uploadedFiles.map((file, index) => (
                                                    <li key={index} className={classes.fileItem}>{file.name}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className={classes.noFiles}>Нет загруженных файлов</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SideFunnel;
