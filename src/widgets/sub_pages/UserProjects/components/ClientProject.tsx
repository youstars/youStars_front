import React from "react";
import {useNavigate} from "react-router-dom";
import ChatIcon from "shared/assets/icons/chatY.svg";
import classes from "./ClientProject.module.scss";
import ProgressBar from "shared/UI/ProgressBar/ProgressBar";

/**
 * Тип проекта (сокращённый)
 * Подгоняем под те поля, что реально приходят с сервера.
 */
interface Project {
    goal: string;
    id: number;
    order: number;
    name: string;
    specialists: number[];
    deadline: string | null;
    status: string;
    budget: string | null;
    tasks_count: number;
    task_left_count: number;
    timeline: string | null;
}

const STATUS_TITLES: Record<string, string> = {
    initial: "Обработка",
    matching: "Метчинг",
    pre_payment: "Предоплата",
    in_progress: "Работа",
    post_payment: "Постоплата",
    done: "Готово",
};



/**
 * Карточка проекта для клиента.
 * Содержит верхний блок с основными данными, «конвеер» статусов
 * и прогресс‑бар по выполненным задачам.
 */
export default function ClientProject({project}: { project: Project }) {
    const steps = Object.values(STATUS_TITLES);

    const currentStepIndex = steps.findIndex(
        (step) =>
            step === STATUS_TITLES[project.status as keyof typeof STATUS_TITLES]
    );

    const navigate = useNavigate();

    /* ───────── helpers ────────────────────────────────────────────── */
    const deadlineRu = project.deadline
        ? new Date(project.deadline).toLocaleDateString("ru-RU")
        : "Не указана";

    const tasksDone =
        project.tasks_count - project.task_left_count > 0
            ? project.tasks_count - project.task_left_count
            : 0;

    const percent =
        project.tasks_count > 0
            ? Math.round((tasksDone / project.tasks_count) * 100)
            : 0;

    /* ───────── render ─────────────────────────────────────────────── */
    return (
        <div
            className={classes.card}
            onClick={() => navigate(`/client/project/${project.id}`)}
        >
            {/* ───── верхний блок ───── */}
            <div className={classes.top}>
                {/* «Заявка №…» */}
                <div className={classes.orderBox}>
                    <div className={classes.orderName}>{`Заявка №${project.order} / ${project.name}`}</div>
                    {/* название, бюджет, сроки */}
                    <div className={classes.mainMeta}>
                        <div className={classes.metaRow}>
                            <span className={classes.budget}>{`${Math.round(Number(project.budget)).toLocaleString("ru-RU")} ₽` ?? "—"}</span>
                            <span className={classes.timeline}>
              {project.timeline.replace(/(\d{2})-(\d{2})-\d{4}/g, '$1.$2') ?? deadlineRu}
            </span>
                        </div>
                    </div></div>



                {/* конвеер статусов */}
                <div className={classes.pipeline}>
                    <div/>
                    <ProgressBar
                        steps={steps}
                        currentStep={currentStepIndex === -1 ? 0 : currentStepIndex}
                    />
                </div>

                {/* иконки / действия */}
                <div
                    className={classes.icons}
                    onClick={(e) => e.stopPropagation()} /* блокируем переход */
                >
                    <button
                        type="button"
                        className={classes.iconBtn}
                        onClick={() => navigate(`/client/project/${project.id}/messages`)}
                    >
                        <img src={ChatIcon} alt="Chat"/>
                    </button>
                </div>
            </div>

            {/* ───── блок прогресса задач ───── */}
            <div className={classes.progressBlock}>
                <span className={classes.progressLabel}>{percent}% выполненных задач</span>
                <div
                    className={classes.progressBarWrapper}
                    style={{"--percent": percent} as React.CSSProperties}
                >
                    <span className={classes.min}>0</span>
                    <div className={classes.progressBar}>
                        <div
                            className={classes.progressFill}
                            style={{width: `${percent}%`}}
                        />
                    </div>
                    <span className={classes.max}>{project.tasks_count}</span>
                    <span className={classes.count}>{tasksDone}</span>
                </div>
            </div>
            <div className={classes.goal}>
                <div className={classes.goalTitle}>
                    Задача проекта
                    <div className={classes.goalText}>{project.goal}</div>
                </div>
            </div>
        </div>
    );
}