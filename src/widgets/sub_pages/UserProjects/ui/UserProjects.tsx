import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "shared/store";
import { getProjects } from "shared/store/slices/projectsSlice";
import classes from "./UserProjects.module.scss";
import { Input, Button } from "shared/index";
import search from "shared/images/sideBarImgs/search.svg";
import status from "shared/images/status.svg";
import message from "shared/images/Vector.svg";
import ModalsProjects from "widgets/Modals/ModalsProjects/ModalsProjects";
import ModalCalendar from "widgets/Modals/ModalCalendar/ModalCalendar";
import StatusModal from "widgets/Modals/StatusModal/StatusModal";
import ModalSpecialist from "widgets/Modals/ModalSpecialist/ModalSpecialist";
import CustomerModal from "widgets/Modals/CustomerModal/CustomerModal";
import { Link } from "react-router-dom";

export default function UserProjects() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isModalSpecialistOpen, setIsModalSpecialistOpen] = useState(false);
  const [isModalCustomerOpen, setIsModalCustomerOpen] = useState(false);
  const [activeModalColumn, setActiveModalColumn] = useState<string>("");
  const [selectedTaskId, setSelectedTaskId] = useState<string | number | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  const getData = useSelector((state: any) => state.projects.projects);

  console.log("projectssqwq", getData);

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

  useEffect(() => {
    if (getData) {
      const filtered = getData.filter((project: any) =>
        project.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProjects(filtered);
    }
  }, [searchTerm, getData]);

  const handleOpenModal = (columnName: string, taskId: string | number) => {
    setActiveModalColumn(columnName);
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

      <section className={classes.options}>
        <div className={classes.status}>
          <p>Название проекта</p>
          <img
            onClick={() => handleOpenModal("project_name", 0)}
            src={status}
            alt="Статус"
          />
        </div>
        <div className={classes.status}>
          <p>Трекер</p>
          <img
            onClick={() => handleOpenModal("tracker", 0)}
            src={status}
            alt="Трекер"
          />
        </div>
        <div className={classes.status}>
          <p>Дата окончания</p>
          <img
            onClick={() => handleOpenModal("end_date", 0)}
            src={status}
            alt="Статус"
          />
        </div>
        <div className={classes.status}>
          <p>Специалисты</p>
          <img
            onClick={() => handleOpenModal("specialists", 0)}
            src={status}
            alt="Статус"
          />
        </div>
        <div className={classes.status}>
          <p>Заказчик</p>
          <img
            onClick={() => handleOpenModal("client", 0)}
            src={status}
            alt="Заказчик"
          />{" "}

        </div>
        <div className={classes.status}>
          <p>Чаты проектов</p>
        </div>
      </section>

      <section className={classes.projects_list}>
        {filteredProjects && filteredProjects.length > 0 ? (
          filteredProjects.map((project: any, index: number) => (
            <Link
              to={`/manager/project/${project.id}`}
              key={project.id}
              className={classes.project_card}
            >
              <div className={classes.project_name}>
                <p>{project.name || "Без названия"}</p>
              </div>
              <div className={classes.project_captain}>
                <p>{project.tracker.full_name || "Не назначен"}</p>
              </div>
              <div className={classes.project_end_date}>
                <p>{project.deadline.replace(/(\d{4})-(\d{2})-(\d{2}).*/, "$3.$2.$1") || "Не указана"}</p>
              </div>
              <div className={classes.project_students}>
                <p>{getSpecialistsLabel(project)}</p>
              </div>
              <div className={classes.project_duration}>
                <p>{project.client.full_name || "Не указана"}</p>
              </div>
              <div className={classes.project_chat}>
                <img src={message} />
              </div>
            </Link>
          ))
        ) : (
          <div className={classes.project_card}>
            <p>
              {getData ? "Нет данных для отображения" : "Загрузка данных..."}
            </p>
          </div>
        )}
      </section>

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
        <StatusModal onClose={() => setIsStatusModalOpen(false)} />
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
