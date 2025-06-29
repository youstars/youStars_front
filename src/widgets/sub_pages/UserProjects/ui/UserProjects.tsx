import {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "shared/store";
import {getProjects} from "shared/store/slices/projectsSlice";
import classes from "./UserProjects.module.scss";
import {Button, Input} from "shared/index";
import searchIcon from "shared/images/sideBarImgs/search.svg";
import filterIcon from "shared/images/status.svg";
import messageIcon from "shared/images/Vector.svg";
import ModalsProjects from "widgets/Modals/ModalsProjects/ModalsProjects";
import ModalCalendar from "widgets/Modals/ModalCalendar/ModalCalendar";
import StatusModal from "widgets/Modals/StatusModal/StatusModal";
import ModalSpecialist from "widgets/Modals/ModalSpecialist/ModalSpecialist";
import CustomerModal from "widgets/Modals/CustomerModal/CustomerModal";
import {useNavigate} from "react-router-dom";
import {useUserRole} from "shared/hooks/useUserRole";
import ClientProject from "../components/ClientProject";


const getSpecialistsLabel = (project: any): string => {
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

export default function UserProjects() {
    // ─────────────────────────────────── state
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isModalSpecialistOpen, setIsModalSpecialistOpen] = useState(false);
    const [isModalCustomerOpen, setIsModalCustomerOpen] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string | number | null>(
        null,
    );

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    
    const role = useUserRole(); 
    const isClient = role?.toLowerCase().includes("client");


    const projects = useSelector((s: any) => s.projects.projects);
    const filteredProjects = useMemo(() => {
        if (!projects) return [];
        const q = searchTerm.toLowerCase();
        return projects.filter((p: any) =>
            (p.name ?? "").toLowerCase().includes(q),
        );
    }, [projects, searchTerm]);

    useEffect(() => {
        dispatch(getProjects()).catch(console.error);
    }, [dispatch]);


    const SearchBar = (
        <div className={classes.search_and_filter}>
            <div className={classes.search}>
                <div className={classes.input_wrapper}>
                    <Input
                        className={classes.input}
                        type="text"
                        placeholder="Поиск"
                        value={searchTerm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setSearchTerm(e.target.value)
                        }
                    />
                    <img src={searchIcon} alt="search" className={classes.search_icon}/>
                </div>
            </div>
      
            {!isClient && (
                <div className={classes.filter}>
                    <p>Сбросить фильтры</p>
                    <p>Сохранить комбинацию</p>
                </div>
            )}
        </div>
    );

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

    // ─────────────────────────────────── client view
    const renderClientView = () => (
        <div>
            {filteredProjects && filteredProjects.length ? (
                filteredProjects.map((project: any) => (
                    <ClientProject key={project.id} project={project} />
                ))
            ) : (
                <p>
                    {projects ? "Нет данных для отображения" : "Загрузка данных..."}
                </p>
            )}
        </div>
    );

    // ─────────────────────────────────── tracker view
    const renderTrackerView = () => (
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
            {filteredProjects && filteredProjects.length ? (
                filteredProjects.map((project: any) => (
                    <tr
                        key={project.id}
                        className={classes.project_row}
                        onClick={() => navigate(`/manager/project/${project.id}`)}
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
                        {projects ? "Нет данных для отображения" : "Загрузка данных..."}
                    </td>
                </tr>
            )}
            </tbody>
        </table>
    );

    // ─────────────────────────────────── render
    return (
        <main className={classes.main}>
            {SearchBar}
            {isClient ? renderClientView() : renderTrackerView()}

            {/* модалки нужны только для трекеров */}
            {!isClient && (
                <>
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
                            tasks={filteredProjects}
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
            )}
        </main>
    );
}
