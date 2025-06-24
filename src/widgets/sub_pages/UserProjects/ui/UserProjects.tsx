import {useEffect, useState, useMemo} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "shared/store";
import {getProjects} from "shared/store/slices/projectsSlice";
import classes from "./UserProjects.module.scss";
import {Button, Input} from "shared/index";
import search from "shared/images/sideBarImgs/search.svg";
import FilterIcon from "shared/images/status.svg";
import message from "shared/images/Vector.svg";
import ModalsProjects from "widgets/Modals/ModalsProjects/ModalsProjects";
import ModalCalendar from "widgets/Modals/ModalCalendar/ModalCalendar";
import StatusModal from "widgets/Modals/StatusModal/StatusModal";
import ModalSpecialist from "widgets/Modals/ModalSpecialist/ModalSpecialist";
import CustomerModal from "widgets/Modals/CustomerModal/CustomerModal";
import {useNavigate} from "react-router-dom";

export default function UserProjects() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isModalSpecialistOpen, setIsModalSpecialistOpen] = useState(false);
    const [isModalCustomerOpen, setIsModalCustomerOpen] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string | number | null>(
        null
    );
    const [searchTerm, setSearchTerm] = useState<string>("");
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const getData = useSelector((state: any) => state.projects.projects);

    const filteredProjects = useMemo(() => {
        if (!getData) return [];
        return getData.filter((project: any) =>
            project.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [getData, searchTerm]);

    const getSpecialistsLabel = (project: any) => {
        // API иногда присылает specialists либо students; нормализуем
        const list = project.specialists ?? project.students ?? [];
        if (Array.isArray(list) && list.length) {
            return list
                .map((s: any) => s?.custom_user?.full_name || s?.full_name || "Без имени")
                .join(", ");
        }
        // если сервер шлёт count
        if (typeof list === "number" && list > 0) {
            return `${list} специалист(ов)`;
        }
        return "Нет специалистов";
    };

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                await dispatch(getProjects()).unwrap();
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        fetchTasks();
    }, [dispatch]);


    const handleOpenModal = (columnName: string, taskId: string | number) => {
        setSelectedTaskId(taskId);

        if (columnName === "end_date") {
            setIsCalendarOpen(true);
        } else if (columnName === "status") {
            setIsStatusModalOpen(true);
        } else if (columnName === "specialists") {
            setIsModalSpecialistOpen(true);
        } else if (columnName === "client") {
            setIsModalCustomerOpen(true);
        } else {
            setIsModalOpen(true);
        }
    };

    return (
        <main className={classes.main}>
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
                        <img
                            src={search}
                            alt="Search Icon"
                            className={classes.search_icon}
                        />
                    </div>
                </div>
                <div className={classes.filter}>
                    <p>Сбросить фильтры</p>
                    <p>Сохранить комбинацию</p>
                </div>
            </div>

            <table className={classes.table}>
                <thead>
                <tr>
                    <th>
                        Название проекта
                        <img
                            src={FilterIcon}
                            onClick={() => handleOpenModal("project_name", 0)}
                            className={classes.funnel_icon}
                            alt="Фильтр"
                        />
                    </th>
                    <th>
                        Дедлайн
                        <img
                            src={FilterIcon}
                            onClick={() => handleOpenModal("end_date", 0)}
                            className={classes.funnel_icon}
                            alt="Фильтр"
                        />
                    </th>
                    <th>
                        Трекер
                        <img
                            src={FilterIcon}
                            onClick={() => handleOpenModal("tracker", 0)}
                            className={classes.funnel_icon}
                            alt="Фильтр"
                        />
                    </th>
                    <th>
                        Специалисты
                        <img
                            src={FilterIcon}
                            onClick={() => handleOpenModal("specialists", 0)}
                            className={classes.funnel_icon}
                            alt="Фильтр"
                        />
                    </th>
                    <th>
                        Заказчик
                        <img
                            src={FilterIcon}
                            onClick={() => handleOpenModal("client", 0)}
                            className={classes.funnel_icon}
                            alt="Фильтр"
                        />
                    </th>
                    <th>Чаты&nbsp;проектов</th>
                </tr>
                </thead>
                <tbody>
                {filteredProjects && filteredProjects.length > 0 ? (
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
                                          "$3.$2.$1"
                                      )
                                    : "Не указана"}
                            </td>
                            <td>{project.tracker?.full_name || "Не назначен"}</td>
                            <td>{getSpecialistsLabel(project)}</td>
                            <td>{project.client.full_name || "Не указана"}</td>
                            <td>
                                <img src={message} alt="Chat icon"/>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={6}>
                            {getData ? "Нет данных для отображения" : "Загрузка данных..."}
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

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
        </main>
    );
}
