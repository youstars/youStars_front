import React from "react";
import {useNavigate} from "react-router-dom";
import Checklist from "shared/assets/icons/stripesY.svg";
import Chat from "shared/assets/icons/chatY.svg";
import GroupChat from "shared/assets/icons/ChatsY.svg";
import classes from "./ClientProject.module.scss";
import ProgressBar from "shared/UI/ProgressBar/ProgressBar";
import { getCookie } from "shared/utils/cookies";

interface Project {
    goal: string;
    id: number;
    order: number;
    name: string;
    specialists: {
        id: number;
        custom_user: {
            full_name: string;
            avatar?: string;
        };
    }[];
    tracker: {
        id: number;
        custom_user: {
            full_name: string;
            avatar?: string;
        };
    } | null;
    deadline: string | null;
    status: string;
    budget: string | null;
    tasks_count: number;
    task_left_count: number;
    timeline: string | null;
}

const STATUS_TITLES: Record<string, string> = {
    initial: "Обработка",
    in_progress: "Работа",
    pre_payment: "Правки",
    done: "Готово",
};
const client_id = getCookie("user_role_id");

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

    const trackerName =
        project.tracker?.custom_user?.full_name ?? "—";

    /* ───────── render ─────────────────────────────────────────────── */
    return (
        <div className={classes.card}
             onClick={() => navigate(`/manager/clients/${client_id}/project/${project.id}`)}
        >
            <div className={classes.top}>
                <div className={classes.orderBox}>
                    <div className={classes.orderName}>{`Заявка №${project.order} / ${project.name}`}</div>
                    <div className={classes.gene}>
                        <div className={classes.budget}>
                            {project.budget
                              ? `${Math.round(Number(project.budget)).toLocaleString("ru-RU")} ₽`
                              : "—"
                            }
                        </div>
                        <div className={classes.timeline}>
                            {project.timeline
                              ? project.timeline.replace(/(\d{2})-(\d{2})-\d{4}/g, '$1.$2')
                              : deadlineRu}
                        </div>
                    </div>
                </div>

                {/* конвеер статусов */}
                <div className={classes.pipeline}>
                    <div/>
                    <ProgressBar
                        steps={steps}
                        currentStep={currentStepIndex === -1 ? 0 : currentStepIndex}
                    />
                </div>

                {/* иконки / действия */}
                <div className={classes.icons} onClick={(e) => e.stopPropagation()}>
                    <button
                        className={classes.iconBtn}
                        type="button"
                        onClick={() => navigate(`/client/project/${project.id}/messages`)}
                    >
                        <img src={Checklist} alt="Chat"/>
                    </button>
                    <button
                        type="button"
                        className={classes.iconBtn}
                        onClick={() => navigate(`/client/project/${project.id}/messages`)}
                    >
                        <img src={Chat} alt="Chat"/>
                    </button>
                    <button
                        type="button"
                        className={classes.iconBtn}
                        onClick={() => navigate(`/client/project/${project.id}/messages`)}
                    >
                        <img src={GroupChat} alt="Chat"/>
                    </button>
                </div>
            </div>
            {/* ───── мета‑строка: трекер, специалисты и прогресс задач ───── */}
            <div className={classes.metaRow}>
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

                <span className={classes.tracker}>{`Трекер: ${trackerName}`}</span>
                <span className={classes.specialists}>
                    {`Специалисты: `}
                    {project.specialists && project.specialists.length > 0 ? (
                        project.specialists.map((s, idx) => (
                            <React.Fragment key={s.id}>
                                <span className={classes.specialistItem} >{s.custom_user.full_name}</span>
                                {idx < project.specialists.length - 1 && ", "}
                            </React.Fragment>
                        ))
                    ) : (
                        "—"
                    )}
                </span>
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