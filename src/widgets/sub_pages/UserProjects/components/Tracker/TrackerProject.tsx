import {useState, useMemo, useEffect} from "react";
import {useNavigate} from "react-router-dom";

import classes from "./TrackerProject.module.scss";
import filterIcon from "shared/images/status.svg";
import messageIcon from "shared/images/chats.svg";

import ModalsProjects from "widgets/Modals/ModalsProjects/ModalsProjects";
import ModalCalendar from "widgets/Modals/ModalCalendar/ModalCalendar";
import StatusModal from "widgets/Modals/StatusModal/StatusModal";
import ModalSpecialist from "widgets/Modals/ModalSpecialist/ModalSpecialist";
import CustomerModal from "widgets/Modals/CustomerModal/CustomerModal";

import {Input, Button} from "shared/index";

/**
 * ──────────────────────────────────── local types
 * Дублируем LeanProject временно, пока типы не вынесены в shared.
 */
interface CustomUser {
    full_name?: string;
}

interface Specialist {
    id?: number | string;
    custom_user?: CustomUser;
    full_name?: string;
}

interface Client {
    full_name?: string;
}

interface Tracker {
    full_name?: string;
}

export interface LeanProject {
    id: number | string;
    name?: string;
    deadline?: string;
    tracker?: Tracker;
    specialists?: Specialist[];
    students?: Specialist[];
    client?: Client;
}

const getSpecialistsLabel = (project: LeanProject): string => {
    const list = project.specialists ?? project.students ?? [];
    if (Array.isArray(list) && list.length) {
        return list
            .map(
                (s: any) => s?.custom_user?.full_name || s?.full_name || "Без имени",
            )
            .join(", ");
    }
    if (typeof list === "number" && list > 0) {
        return `${list} специалист(ов)`;
    }
    return "Нет специалистов";
};

interface TrackerProjectProps {
    /** Сюда уже приходит отфильтрованный массив проектов */
    projects: LeanProject[] | undefined;
}

/**
 * Таблица проектов для роли tracker + все связанные модалки.
 */
export default function TrackerProject({projects}: TrackerProjectProps) {
    const navigate = useNavigate();

    // ─────────────────────────────────── state (модалки)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isModalSpecialistOpen, setIsModalSpecialistOpen] = useState(false);
    const [isModalCustomerOpen, setIsModalCustomerOpen] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string | number | null>(
        null,
    );

    const [displayedProjects, setDisplayedProjects] = useState<LeanProject[] | undefined>(projects);

    useEffect(() => {
        setDisplayedProjects(projects);
    }, [projects]);

    // ─────────────────────────────────── handlers
    const handleOpenModal = (column: string, id: string | number) => {
        setSelectedTaskId(id);
        switch (column) {
            case "end_date":
                setIsCalendarOpen(true);
                break;
            case "status":
                setIsStatusModalOpen(true);
                break;
            case "specialists":
                setIsModalSpecialistOpen(true);
                break;
            case "client":
                setIsModalCustomerOpen(true);
                break;
            default:
                setIsModalOpen(true);
        }
    };

    // ─────────────────────────────────── render
    const specialistProjects = useMemo(() => {
        return (projects || []).map(proj => ({
            id: proj.id,
            name: proj.name,
            project_name: proj.name,
            specialists: (proj.specialists ?? proj.students ?? []).map(s => ({
                id: s.id!,
                full_name: s.custom_user?.full_name ?? s.full_name ?? "Без имени",
            })),
        }));
    }, [projects]);

    return (
        <>
            <table className={classes.table}>
                <thead>
                <tr>
                    <th>
                        Название проекта
                        <img
                            src={filterIcon}
                            onClick={() => handleOpenModal("project_name", 0)}
                            className={classes.funnel_icon}
                            alt="Фильтр"
                        />
                    </th>
                    <th>
                        Дедлайн
                        <img
                            src={filterIcon}
                            onClick={() => handleOpenModal("end_date", 0)}
                            className={classes.funnel_icon}
                            alt="Фильтр"
                        />
                    </th>
                    <th>
                        Трекер
                        <img
                            src={filterIcon}
                            onClick={() => handleOpenModal("tracker", 0)}
                            className={classes.funnel_icon}
                            alt="Фильтр"
                        />
                    </th>
                    <th>
                        Специалисты
                        <img
                            src={filterIcon}
                            onClick={() => handleOpenModal("specialists", 0)}
                            className={classes.funnel_icon}
                            alt="Фильтр"
                        />
                    </th>
                    <th>
                        Заказчик
                        <img
                            src={filterIcon}
                            onClick={() => handleOpenModal("client", 0)}
                            className={classes.funnel_icon}
                            alt="Фильтр"
                        />
                    </th>
                    <th>Чаты&nbsp;проектов</th>
                </tr>
                </thead>

                <tbody>
                {displayedProjects && displayedProjects.length ? (
                    displayedProjects.map((project) => (
                        <tr
                            key={project.id}
                            className={classes.project_row}
                            onClick={() =>
                                navigate(`/manager/project/${project.id}`)
                            }
                        >
                            <td>{project.name || "Без названия"}</td>
                            <td>
                                {project.deadline
                                    ? project.deadline.replace(
                                        /(\d{4})-(\d{2})-(\d{2}).*/,
                                        "$3.$2.$1",
                                    )
                                    : "Не указана"}
                            </td>
                            <td>{project.tracker?.full_name || "Не назначен"}</td>
                            <td>{getSpecialistsLabel(project)}</td>
                            <td>{project.client?.full_name || "Не указана"}</td>
                            <td>
                                <img src={messageIcon} alt="Chat icon"/>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={6}>
                            {displayedProjects
                                ? "Нет данных для отображения"
                                : "Загрузка данных..."}
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

            {/* ───────────────────────── modal zone */}
            {isModalOpen && (
                <ModalsProjects
                    onClose={() => setIsModalOpen(false)}
                    Input={Input}
                    Button={Button}
                />
            )}
            {isModalSpecialistOpen && (
                <ModalSpecialist
                    onClose={() => setIsModalSpecialistOpen(false)}
                    Input={Input}
                    Button={Button}
                    projects={specialistProjects}
                    onFilter={(filtered) => {
                        const ids = filtered.map(p => p.id);
                        setDisplayedProjects(projects?.filter(proj => ids.includes(proj.id)));
                        setIsModalSpecialistOpen(false);
                    }}
                />
            )}
            {isStatusModalOpen && (
                <StatusModal onClose={() => setIsStatusModalOpen(false)}/>
            )}
            {isCalendarOpen && selectedTaskId !== null && (
                <ModalCalendar
                    isOpen={isCalendarOpen}
                    onClose={() => setIsCalendarOpen(false)}
                    onApply={(start, end) => {
                        console.log("Выбраны даты:", start, end);
                        setIsCalendarOpen(false);
                    }}
                    tasks={projects as any[]}
                    selectedTaskId={selectedTaskId}
                />
            )}
            {isModalCustomerOpen && (
                <CustomerModal
                    onClose={() => setIsModalCustomerOpen(false)}
                    Input={Input}
                    Button={Button}
                />
            )}
        </>
    );
}
