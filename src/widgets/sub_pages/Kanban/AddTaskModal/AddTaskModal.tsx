import React, {useRef, useEffect, useState} from "react";
import styles from "./AddTaskModal.module.scss";
import ChatIcon from "shared/assets/icons/chatY.svg";
import ChatsIcon from "shared/assets/icons/ChatsY.svg";
import {Plus} from "lucide-react";
import {useAppSelector} from "shared/hooks/useAppSelector";
import {selectProject} from "shared/store/slices/projectSlice";
import {useDispatch} from "react-redux";
import {createTask, getTasks} from "shared/store/slices/tasksSlice";
import {AppDispatch} from "shared/store";

interface AddTaskModalProps {
    isOpen: boolean;
    toggleSidebar: () => void;
    projectId?: number | null;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
                                                       isOpen,
                                                       toggleSidebar,
                                                   }) => {
    const sidebarRef = useRef<HTMLDivElement>(null);
    const [showTitleInput, setShowTitleInput] = useState(false);
    const [showResultInput, setShowResultInput] = useState(false);
    const [showSpecialists, setShowSpecialists] = useState(false);
    const {project} = useAppSelector(selectProject);
    const tracker = project?.project_team?.tracker;
    const specialists = project?.project_team?.specialists ?? [];
    const dispatch = useDispatch<AppDispatch>();
    const [createdAt] = useState(new Date().toISOString());

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState<string | null>(null);

    const [assignedSpecialist, setAssignedSpecialist] = useState<number[]>([]);
    const deadlineInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async () => {
        if (!description.trim()) {
            alert("Пожалуйста, заполните поле 'Ожидаемый результат'");
            return;
        }

        try {
            const startDate = new Date().toISOString();
            const executionPeriod = Math.ceil(
                (new Date(deadline).getTime() - new Date(startDate).getTime()) /
                (1000 * 60 * 60 * 24)
            );
            if (executionPeriod < 0) {
                alert("Дата дедлайна не может быть раньше текущей даты");
                return;
            }

            if (!project?.id) return;

            await dispatch(
                createTask({
                    title,
                    description,
                    deadline,
                    start_date: startDate,
                    execution_period: executionPeriod,
                    assigned_specialist: assignedSpecialist,
                    project: project.id,
                    created_at: createdAt,
                })
            );

            await dispatch(getTasks());
            toggleSidebar();
        } catch (err) {
            console.error("Ошибка при создании задачи:", err);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target as Node) &&
                isOpen
            ) {
                toggleSidebar();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, toggleSidebar]);

    return (
        <div
            className={`${styles.sidebarContainer} ${
                isOpen ? styles.containerOpen : ""
            }`}
        >
            <div
                ref={sidebarRef}
                className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}
            >
                <div className={styles.contentWrapper}>
                    <div className={styles.content}>
                        <header className={styles.modalHeader}>
                            <h2>Новая задача</h2>
                        </header>

                        {tracker && (
                            <div className={styles.trackerBlock}>
                                <div className={styles.trackerInfo}>
                                    <div className={styles.avatar}>
                                        {tracker.avatar ? (
                                            <img
                                                src={tracker.avatar}
                                                alt={tracker.full_name}
                                            />
                                        ) : (
                                            <div className={styles.avatarFallback}>
                                                {tracker.full_name[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.trackerText}>
                                        <div>{tracker.full_name}</div>
                                        <div className={styles.subtext}>Трекер проекта</div>
                                    </div>
                                </div>
                                <div className={styles.trackerIcons}>
                                    <img src={ChatIcon} alt="chat" className={styles.chatIcon}/>
                                    <img
                                        src={ChatsIcon}
                                        alt="group chat"
                                        className={styles.chatIcon}
                                    />
                                </div>
                            </div>
                        )}

                        <div className={styles.sectionTitleRow}>
                            <div className={styles.sectionTitle}>Название задачи</div>
                            {!showTitleInput && (
                                <div
                                    className={styles.itemRow}
                                    onClick={() => setShowTitleInput(true)}
                                >
                                    <Plus size={14}/>
                                </div>
                            )}
                        </div>
                        {showTitleInput && (
                            <input
                                className={styles.textarea}
                                value={title}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                                placeholder="Введите название"
                            />
                        )}

                        <div className={styles.sectionTitle}>Специалисты</div>
                        <div
                            className={styles.itemRow}
                            onClick={() => setShowSpecialists((prev) => !prev)}
                        >
                            {assignedSpecialist.length === 0
                                ? "Выбрать специалиста"
                                : "Изменить выбор"}{" "}
                            <Plus size={14}/>
                        </div>

                        {showSpecialists &&
                            specialists.length > 0 && (
                                <div className={styles.specialistsList}>
                                    {specialists.map((spec) => (
                                        <label key={spec.id} className={styles.specialistItem}>
                                            <input
                                                type="checkbox"
                                                checked={assignedSpecialist.includes(spec.id)}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    setAssignedSpecialist((prev) =>
                                                        prev.includes(spec.id)
                                                            ? prev.filter((id) => id !== spec.id)
                                                            : [...prev, spec.id]
                                                    );
                                                }}
                                            />
                                            <span>{spec.full_name}</span>
                                        </label>
                                    ))}
                                </div>
                            )}

                        {assignedSpecialist.length > 0 && (
                            <div className={styles.selectedSpecialists}>
                                {specialists
                                    .filter((spec) => assignedSpecialist.includes(spec.id))
                                    .map((spec) => (
                                        <span key={spec.id} className={styles.specialistTag}>
                      {spec.full_name}
                    </span>
                                    ))}
                            </div>
                        )}

                        <div className={styles.sectionTitleRow}>
                            <div className={styles.sectionTitle}>Дедлайн</div>
                            <div
                                className={styles.itemRow}
                                onClick={() => deadlineInputRef.current?.showPicker?.()}
                            >
                                <Plus size={14}/>
                            </div>
                        </div>
                        <input
                            ref={deadlineInputRef}
                            type="date"
                            className={styles.hiddenDateInput}
                            value={deadline?.slice(0, 10) || ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeadline(new Date(e.target.value).toISOString())}
                        />

                        {deadline && (
                            <div className={styles.selectedDate}>
                                {new Date(deadline).toLocaleDateString("ru-RU")}
                            </div>
                        )}


                        <div className={styles.sectionTitleRow}>
                            <div className={styles.sectionTitle}>Создано</div>
                        </div>
                        <div className={styles.selectedDate}>
                            {new Date(createdAt).toLocaleDateString("ru-RU", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                            })}
                        </div>


                        <div className={styles.sectionTitleRow}>
                            <div className={styles.sectionTitle}>
                                Ожидаемый результат <span className={styles.required}>*</span>
                            </div>
                            {!showResultInput && (
                                <div
                                    className={styles.itemRow}
                                    onClick={() => setShowResultInput(true)}
                                >
                                    <Plus size={14}/>
                                </div>
                            )}
                        </div>
                        {showResultInput && (
                            <textarea
                                className={styles.textarea}
                                value={description}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                                placeholder="Введите описание"
                            />
                        )}

                        <div className={styles.sectionToggle}>
                            Комментарии по задаче <Plus size={14}/>
                        </div>
                        <div className={styles.sectionToggle}>
                            Подзадачи <span>▾</span>
                        </div>
                        <div className={styles.itemRow}>
                            <Plus size={14}/> Новая задача
                        </div>
                        <div className={styles.sectionToggle}>
                            Файлы <span className={styles.attach}>📎</span>
                        </div>

                        <div className={styles.actions}>
                            <button className={styles.cancelBtn} onClick={toggleSidebar}>
                                Отмена
                            </button>
                            <button className={styles.submitBtn} onClick={handleSubmit}>
                                Создать задачу
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddTaskModal;
