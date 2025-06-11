import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createTask, getTasks } from "shared/store/slices/tasksSlice";
import { AppDispatch } from "shared/store";
import { TaskStatus } from "../types";
import styles from "./AddTaskModal.module.scss";

interface AddTaskModalProps {
  onClose: () => void;
  projectId: number;
}


type StatusPriority = "frozen" | "low" | "medium" | "high" | "urgent";
type GradeOption = 1 | 2 | 3 | 4 | 5;

const AddTaskModal: React.FC<AddTaskModalProps> = ({ onClose, projectId }) => {
    const dispatch = useDispatch<AppDispatch>();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [material, setMaterial] = useState("");
    const [notice, setNotice] = useState("");
    const [deadline, setDeadline] = useState(new Date().toISOString());
    const [status, setStatus] = useState<TaskStatus>("to_do");
    const [statusPriority, setStatusPriority] = useState<StatusPriority>("medium");

    const [assignedSpecialist, setAssignedSpecialist] = useState<number[]>([]);
    const [personalGrade, setPersonalGrade] = useState<GradeOption>(2);
    const [deadlineCompliance, setDeadlineCompliance] = useState<GradeOption>(1);
    const [managerRecommendation, setManagerRecommendation] = useState<GradeOption>(2);
    const [intricacyCoefficient, setIntricacyCoefficient] = useState<GradeOption>(2);
    const [taskCredits, setTaskCredits] = useState<number>(30);

    const [activeSection, setActiveSection] = useState<string>("basic");

    const handleSubmit = async () => {
        try {
            const startDate = new Date().toISOString();
            const executionPeriod = Math.ceil(
                (new Date(deadline).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
            );

            await dispatch(createTask({
                title,
                description,
                status,
                deadline,
                start_date: startDate,
                execution_period: executionPeriod,
                assigned_specialist: assignedSpecialist,
                material,
                notice,
                personal_grade: personalGrade,
                deadline_compliance: deadlineCompliance,
                manager_recommendation: managerRecommendation,
                intricacy_coefficient: intricacyCoefficient,
                task_credits: taskCredits,
                status_priority: statusPriority,
                project: projectId, 
            }));
            await dispatch(getTasks());
            onClose();
        } catch (error) {
            console.error("Ошибка при добавлении задачи:", error);
        }
    };

    const renderGradeOptions = () => {
        return [1, 2, 3, 4, 5].map(grade => (
            <option key={grade} value={grade}>{grade}</option>
        ));
    };

    return (
        <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2>Новая задача</h2>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>

                <div className={styles.tabNav}>
                    <button
                        className={`${styles.tabButton} ${activeSection === "basic" ? styles.active : ""}`}
                        onClick={() => setActiveSection("basic")}
                    >
                        Основное
                    </button>
                    <button
                        className={`${styles.tabButton} ${activeSection === "evaluation" ? styles.active : ""}`}
                        onClick={() => setActiveSection("evaluation")}
                    >
                        Оценка
                    </button>
                    <button
                        className={`${styles.tabButton} ${activeSection === "status" ? styles.active : ""}`}
                        onClick={() => setActiveSection("status")}
                    >
                        Статус
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <div className={`${styles.formSection} ${activeSection === "basic" ? styles.active : ""}`}>
                        <div className={styles.formGroup}>
                            <label>Заголовок</label>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Заголовок задачи"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Описание</label>
                            <textarea
                                className={styles.textarea}
                                placeholder="Описание задачи"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Материалы</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="Ссылки на материалы"
                                    value={material}
                                    onChange={(e) => setMaterial(e.target.value)}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Примечание</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="Дополнительная информация"
                                    value={notice}
                                    onChange={(e) => setNotice(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Дедлайн</label>
                                <input
                                    type="datetime-local"
                                    className={styles.input}
                                    value={deadline.slice(0, 16)}
                                    onChange={(e) => setDeadline(new Date(e.target.value).toISOString())}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Исполнители</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="ID через запятую"
                                    value={assignedSpecialist.join(",")}
                                    onChange={(e) =>
                                        setAssignedSpecialist(
                                            e.target.value
                                                .split(",")
                                                .map(s => parseInt(s.trim(), 10))
                                                .filter(n => !isNaN(n))
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div className={`${styles.formSection} ${activeSection === "evaluation" ? styles.active : ""}`}>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Оценка по проекту</label>
                                <select
                                    className={styles.select}
                                    value={personalGrade}
                                    onChange={(e) => setPersonalGrade(Number(e.target.value) as GradeOption)}
                                >
                                    {renderGradeOptions()}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Соблюдение дедлайна</label>
                                <select
                                    className={styles.select}
                                    value={deadlineCompliance}
                                    onChange={(e) => setDeadlineCompliance(Number(e.target.value) as GradeOption)}
                                >
                                    {renderGradeOptions()}
                                </select>
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Рекомендация менеджера</label>
                                <select
                                    className={styles.select}
                                    value={managerRecommendation}
                                    onChange={(e) => setManagerRecommendation(Number(e.target.value) as GradeOption)}
                                >
                                    {renderGradeOptions()}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Коэффициент сложности</label>
                                <select
                                    className={styles.select}
                                    value={intricacyCoefficient}
                                    onChange={(e) => setIntricacyCoefficient(Number(e.target.value) as GradeOption)}
                                >
                                    {renderGradeOptions()}
                                </select>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Кредиты задачи</label>
                            <input
                                type="number"
                                className={styles.input}
                                placeholder="Количество кредитов"
                                value={taskCredits}
                                onChange={(e) => setTaskCredits(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className={`${styles.formSection} ${activeSection === "status" ? styles.active : ""}`}>
                        <div className={styles.formGroup}>
                            <label>Статус задачи</label>
                            <select
                                className={styles.select}
                                value={status}
                                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                            >
                                <option value="to_do">Нужно выполнить</option>
                                <option value="in_progress">В процессе</option>
                                <option value="completed">Выполнено</option>
                                <option value="help">Помощь</option>
                                <option value="pending">В ожидании</option>
                                <option value="review">Проверка</option>
                                <option value="canceled">Отменено</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Приоритет</label>
                            <div className={styles.prioritySelector}>
                                {['frozen', 'low', 'medium', 'high',"urgent"].map((priority) => (
                                    <button
                                        key={priority}
                                        type="button"
                                        className={`${styles.priorityBtn} ${styles[priority]} ${statusPriority === priority ? styles.active : ''}`}
                                        onClick={() => setStatusPriority(priority as StatusPriority)}
                                    >
                                        {priority === 'frozen' ? 'Заморожен' :
                                            priority === 'low' ? 'Низкий' :
                                                priority === 'medium' ? 'Средний' :
                                                    priority === 'high' ? 'Высокий' : 'Срочный'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button className={styles.cancelBtn} onClick={onClose}>Отмена</button>
                    <button className={styles.submitBtn} onClick={handleSubmit}>Создать задачу</button>
                </div>
            </div>
        </div>
    );
};

export default AddTaskModal;
