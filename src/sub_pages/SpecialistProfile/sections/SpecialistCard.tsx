import styles from "./SpecialistCard.module.scss";
import Avatar from "shared/UI/Avatar/Avatar";
import Phone from "shared/images/clientImgs/phone.svg";
import Mail from "shared/images/clientImgs/mail.svg";
import Web from "shared/images/clientImgs/network.svg";
import Chat from "shared/images/clientImgs/Chat.svg";
import Write from "shared/images/clientImgs/Write.svg";
import { TrackerNotes } from "sub_pages/ClientProfile/components/TrackerNotes/TrackerNotes";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { RootState } from "shared/store";
import { getProjects } from "shared/store/slices/projectsSlice";
import { selectTasks } from "shared/store/slices/tasksSlice";
import { useAppDispatch } from "shared/hooks/useAppDispatch";
import { useAppSelector } from "shared/hooks/useAppSelector";
import TagSection from "./TagSection";
import ProjectFiles from "shared/UI/ProjectFiles/ProjectFiles";
import RateItem from "shared/UI/RateItem/RateItem";
import CustomDivTable from "shared/UI/CutomDivTable/CustomDivTable";

const SpecialistCard = () => {
  const { id } = useParams<{ id: string }>();
  const specialists = useAppSelector(
    (state: RootState) => state.specialists.list
  );
  const dispatch = useAppDispatch();
  const allProjects = useAppSelector(selectTasks).results || [];

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  console.log("Проектов получено:", allProjects.length);

  const specialist = specialists.find((s) => s.id === Number(id));
  if (!specialist) {
    return (
      <div style={{ color: "white", padding: "20px" }}>
        Специалист не найден
      </div>
    );
  }

  const name =
    specialist.custom_user_id.first_name || specialist.custom_user_id.username;
  const fullName = specialist.custom_user_id.full_name || "ФИО не указано";

  const specialistProjects = allProjects.filter(
    (project: any) =>
      project.assigned_specialist === specialist.custom_user_id.username
  );
  const activeProjects = specialistProjects.filter((p) => !p.is_finished);
  const finishedProjects = specialistProjects.filter((p) => p.is_finished);

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div className={styles.client}>
          <div className={styles.info}>
            <div className={styles.avatar}>
              <Avatar src={specialist.custom_user_id.avatar} size="52" />
              <p className={styles.days}>3 дня</p>
            </div>
            <div className={styles.text}>
              <h3 className={styles.name}>{`${name} ${fullName}`}</h3>
              <p className={styles.position}>Специалист</p>
              <p className={styles.rating}>
                Рейтинг: {specialist.total_rating || 0}/5
              </p>
            </div>
          </div>

          <div className={styles.contacts}>
            <p className={styles.contact}>
              <img src={Phone} alt="Телефон" />{" "}
              {specialist.custom_user_id.phone_number || "Не указано"}
            </p>
            <p className={styles.contact}>
              <img src={Mail} alt="Почта" /> {specialist.custom_user_id.email}
            </p>
            <p className={styles.contact}>
              <img src={Web} alt="Web" /> —
            </p>
          </div>

          <div className={styles.metrics}>
            <p className={styles.metric}>Активность: 10 заявок</p>
            <p className={styles.metric}>Стоимость: 900 000</p>
            <p className={styles.metric}>Средняя стоимость: 90 000</p>
            <p className={styles.metric}>Настроение: 4.9/5</p>
          </div>

          <div className={styles.icons}>
            <button className={styles.icon}>
              <img src={Chat} alt="Chat" />
            </button>
            <button className={styles.icon}>
              <img src={Write} alt="Write" />
            </button>
          </div>
        </div>

        <div className={styles.about}>
          <h3 className={styles.title}>О специалисте</h3>
          <p className={styles.desc}>
            Маркетолог с 5-летним опытом в сфере e-commerce, специализируюсь на
            performance-рекламе.
          </p>
          <div className={styles.columns}>
            <TagSection
              title="Оказываемые услуги"
              tags={[
                "Анализ рынка",
                "Кастдев",
                "Юнит Экономика",
                "Анализ конкурентов",
              ]}
              className={styles.column}
            />
            <TagSection
              title="Пожелания"
              tags={[
                "От 30 000",
                "Только оказываемые услуги",
                "Одиночная работа",
                "От 2 недель",
              ]}
              className={styles.column}
            />
          </div>
        </div>

        <div className={styles.experience}>
          <ProjectFiles
            files={[{ name: "NDA" }, { name: "Резюме" }, { name: "Портфолио" }]}
            onAddClick={() => console.log("Добавить файл")}
          />
          <TagSection
            title="Опыт в нишах"
            tags={["Стройка", "HR", "EdTech", "Косметика"]}
            align="center"
          />
        </div>

        <div className={styles.rateBlock}>
          <RateItem title="Примерная ставка в час" value="600" />
          <RateItem title="Занятость в неделю" value="До 20 часов" />
          <RateItem title="Часовой пояс" value="UTC+3" />
        </div>
        <div className={styles.projects}>
          <CustomDivTable
          activeProjects={[activeProjects.length]}
            headers={[
              "Название",
              "Клиент",
              "Трекер",
              "Таймлайн",
              "Сумма",
              "Осталось",
            ]}
            rows={activeProjects.map((task) => [
              task.project || "Данных нет",
              task.client_name || "Данных нет",
              task.tracker_name || "Данных нет",
              task.start_date && task.end_date
                ? `${task.start_date} — ${task.end_date}`
                : "Данных нет",
              task.project_cost || "Данных нет",
              task.remaining_tasks ?? "Данных нет",
            ])}
          />
        </div>

        <div className={styles.finishedProjects}>
          <div className={styles.header}>
            <h3 className={styles.title}>Выполненные проекты</h3>
            <span className={styles.count}>{finishedProjects.length}</span>
          </div>
          <div className={styles.subinfo}>
            <span>Оценка трекеров — 4.5</span>
            <span>Оценка заказчика — 3.66</span>
          </div>
          <div className={styles.table}>
            <div className={`${styles.row} ${styles.head}`}>
              <div>Название</div>
              <div>Клиент</div>
              <div>Трекер</div>
              <div>Таймлайн</div>
              <div>Оценка трекеров</div>
              <div>Оценка заказчика</div>
            </div>
            <div className={styles.row}>
              <div>Анализ рынка грибов</div>
              <div>Ахмед</div>
              <div>Трекер Трекерович</div>
              <div>ДД.ММ.ГГГГ</div>
              <div>4.5/5</div>
              <div>4/5</div>
            </div>
            <div className={styles.row}>
              <div>Анализ рынка грибов</div>
              <div>Магомед</div>
              <div>Трекер Трекерович</div>
              <div>ДД.ММ.ГГГГ</div>
              <div>4.5/5</div>
              <div>4/5</div>
            </div>
          </div>
        </div>
        <div className={styles.trackerNotes}>
        <TrackerNotes />
        </div>
        <div className={styles.education}>
          <h3 className={styles.title}>Образование</h3>
          <div className={styles.item}>
            <p className={styles.label}>Образование — 1</p>
            <p className={styles.text}>
              МГТУ им Н.Э.Баумана, Бакалавриат, Менеджмент "управление
              организацией", 2026
            </p>
          </div>
          <div className={styles.item}>
            <p className={styles.label}>Образование — 2</p>
            <p className={styles.text}>
              МГТУ им Н.Э.Баумана, Магистратура, Инноватика "управление
              стартапом", 2028
            </p>
          </div>
        </div>

        <div className={styles.experienceBlock}>
          <h3 className={styles.title}>Опыт работы</h3>

          <div className={styles.item}>
            <p className={styles.label}>Место работы — 1</p>
            <p className={styles.text}>
              Компания, Строитель, ММ.ГГГГ — ММ.ГГГГ, Продавал арбузы
            </p>
          </div>

          <div className={styles.item}>
            <p className={styles.label}>Место работы — 2</p>
            <p className={styles.text}>
              Компания, Строитель, ММ.ГГГГ — ММ.ГГГГ, Продавал арбузы
            </p>
          </div>

          <div className={styles.item}>
            <p className={styles.label}>Место работы — 3</p>
            <p className={styles.text}>
              Компания, Строитель, ММ.ГГГГ — ММ.ГГГГ, Продавал арбузы
            </p>
          </div>
        </div>

        <div className={styles.reviews}>
          <h3 className={styles.title}>Отзывы</h3>
          <div className={styles.table}>
            <div className={`${styles.row} ${styles.head}`}>
              <div>Название проекта</div>
              <div>Таймлайн</div>
              <div>Заказчик</div>
              <div>Трекер</div>
            </div>
            <div className={styles.row}>
              <div>Анализ рынка груш</div>
              <div>
                ДД.ММ.ГГГГ <br /> ДД.ММ.ГГГГ
              </div>
              <div className={styles.comment}>Молодец</div>
              <div className={styles.comment}>Я все за него делал!!!</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SpecialistCard;
