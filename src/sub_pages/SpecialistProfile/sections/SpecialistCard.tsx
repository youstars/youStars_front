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

interface Project {
  id: number;
  name: string;
  specialists: string[];
  title: string;
  specialist_id: number;
  client_name: string;
  tracker_name: string;
  timeline: string;
  total_tasks: number;
  remaining_tasks: number;
  assigned_specialist: string;
}

const SpecialistCard = () => {
  const { id } = useParams<{ id: string }>();
  const specialists = useAppSelector(
    (state: RootState) => state.specialists.list
  );
  const dispatch = useAppDispatch();
  const allProjects = useAppSelector(selectTasks).results || [];
  console.log(allProjects, "все проекты");
  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  const specialist = specialists.find((s) => s.id === Number(id));

  const specialistProjects = allProjects.filter(
    (project: any) =>
      project.assigned_specialist === specialist.custom_user_id.username
  );

  const activeProjects = specialistProjects.filter((p) => !p.is_finished);
  const finishedProjects = specialistProjects.filter((p) => p.is_finished);

  // useEffect(() => {
  //     const fetchStudentData = async () => {
  //       try {
  //         const response = await fetch("http://127.0.0.1:8000/ru/student/me", {
  //           credentials: "include",
  //         });
  //         if (!response.ok) {
  //           throw new Error("Ошибка загрузки данных");
  //         }
  //         const data = await response.json();
  //         setStudentData(data);
  //       } catch (err) {
  //         setError((err as Error).message);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     fetchStudentData();
  //   }, []);

  //   console.log(studentData);
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

  const client = {
    name: "Иванов Иван Иванович",
    position: "CEO",
    company: 'ООО "Иван"',
    phone: "8 999 999 99 99",
    email: "Email.com",
    website: "Ссылка на сайт",
    metrics: {
      activity: "10 заявок",
      cost: "900 000",
      avgCost: "90 000",
      mood: "4.9/5",
    },
  };

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div className={styles.client}>
          <div className={styles.client__info}>
            <div className={styles.client__avatar}>
              <Avatar src={specialist.custom_user_id.avatar} size="52" />
              <p className={styles.client__days}>3 дня</p>
            </div>
            <div className={styles.client__text}>
              <h3 className={styles.client__name}>{`${name} ${fullName}`}</h3>
              <p className={styles.client__position}>Специалист</p>
              <p className={styles.client__rating}>
                Рейтинг: {specialist.total_rating || 0}/5
              </p>
            </div>
          </div>

          <div className={styles.client__contacts}>
            <p className={styles.client__contact}>
              <img
                src={Phone}
                alt="Телефон"
                className={styles.client__iconImg}
              />{" "}
              {specialist.custom_user_id.phone_number || "Не указано"}
            </p>
            <p className={styles.client__contact}>
              <img src={Mail} alt="Почта" className={styles.client__iconImg} />{" "}
              {specialist.custom_user_id.email}
            </p>
            <p className={styles.client__contact}>
              <img src={Web} alt="Web" className={styles.client__iconImg} /> —
            </p>
          </div>

          <div className={styles.client__metrics}>
            <p className={styles.client__metric}>
              Активность: {client.metrics.activity}
            </p>
            <p className={styles.client__metric}>
              Стоимость: {client.metrics.cost}
            </p>
            <p className={styles.client__metric}>
              Средняя стоимость: {client.metrics.avgCost}
            </p>
            <p className={styles.client__metric}>
              Настроение: {client.metrics.mood}
            </p>
          </div>

          <div className={styles.client__icons}>
            <button className={styles.client__icon}>
              <img src={Chat} alt="Chat" />
            </button>
            <button className={styles.client__icon}>
              <img src={Write} alt="Write" />
            </button>
          </div>
        </div>
        <div className={styles.about}>
          <h3 className={styles.about__title}>О специалисте</h3>
          <p className={styles.about__desc}>
            Маркетолог с 5-летним опытом в сфере e-commerce, специализируюсь на
            performance-рекламе.
          </p>

          <div className={styles.about__columns}>
            <div className={styles.about__column}>
              <h4 className={styles.about__subtitle}>Оказываемые услуги</h4>
              <div className={styles.about__tags}>
                <span className={styles.about__tag}>Анализ рынка</span>
                <span className={styles.about__tag}>Кастдев</span>
                <span className={styles.about__tag}>Юнит Экономика</span>
                <span className={styles.about__tag}>Анализ конкурентов</span>
              </div>
            </div>

            <div className={styles.about__column}>
              <h4 className={styles.about__subtitle}>Пожелания</h4>
              <div className={styles.about__tags}>
                <span className={styles.about__tag}>От 30 000</span>
                <span className={styles.about__tag}>
                  Только оказываемые услуги
                </span>
                <span className={styles.about__tag}>Одиночная работа</span>
                <span className={styles.about__tag}>От 2 недель</span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.experience}>
          <div className={styles.experience__filesBlock}>
            <h4 className={styles.experience__title}>Файлы специалиста</h4>
            <div className={styles.experience__files}>
              <div className={styles.experience__file}>
                <img src="/icons/file.svg" alt="Файл" />
                <p>NDA</p>
              </div>
              <div className={styles.experience__file}>
                <img src="/icons/file.svg" alt="Файл" />
                <p>Резюме</p>
              </div>
              <div className={styles.experience__file}>
                <img src="/icons/file.svg" alt="Файл" />
                <p>Портфолио</p>
              </div>
              <div
                className={
                  styles.experience__file + " " + styles.experience__add
                }
              >
                <span>+</span>
              </div>
            </div>
          </div>

          <div className={styles.experience__niches}>
            <h4 className={styles.experience__title}>Опыт в нишах</h4>
            <div className={styles.experience__tags}>
              <span className={styles.experience__tag}>Стройка</span>
              <span className={styles.experience__tag}>HR</span>
              <span className={styles.experience__tag}>EdTech</span>
              <span className={styles.experience__tag}>Косметика</span>
            </div>
          </div>
        </div>
        <div className={styles.rateBlock}>
          <div className={styles.rateItem}>
            <p className={styles.rateItem__title}>Примерная ставка в час</p>
            <div className={styles.rateItem__value}>600</div>
          </div>
          <div className={styles.rateItem}>
            <p className={styles.rateItem__title}>Занятость в неделю</p>
            <div className={styles.rateItem__value}>До 20 часов</div>
          </div>
          <div className={styles.rateItem}>
            <p className={styles.rateItem__title}>Часовой пояс</p>
            <div className={styles.rateItem__value}>UTC+3</div>
          </div>
        </div>
        <div className={styles.projects}>
          <div className={styles.projects__header}>
            <h3 className={styles.projects__title}>Проекты в работе</h3>
            <span className={styles.projects__count}>
              {activeProjects.length}
            </span>
          </div>

          <div className={styles.projects__subinfo}>
            <span>Сумма задач — {activeProjects.length}</span>
            <span>
              Осталось задач —{" "}
              {
                activeProjects.filter(
                  (t) =>
                    typeof t.remaining_tasks === "number" &&
                    t.remaining_tasks > 0
                ).length
              }
            </span>
          </div>

          <div className={styles.projects__table}>
            <div className={styles.projects__row + " " + styles.projects__head}>
              <div>Название</div>
              <div>Клиент</div>
              <div>Трекер</div>
              <div>Таймлайн</div>
              <div>Сумма</div>
              <div>Осталось</div>
            </div>

            {activeProjects.map((task) => (
              <div className={styles.projects__row} key={task.id}>
                <div>{task.project || "Данных нет"}</div>
                <div>{task.client_name || "Данных нет"}</div>
                <div>{task.tracker_name || "Данных нет"}</div>
                <div>
                  {task.start_date && task.end_date
                    ? `${task.start_date} — ${task.end_date}`
                    : "Данных нет"}
                </div>
                <div>{task.project_cost || "Данных нет"}</div>
                <div>{task.remaining_tasks ?? "Данных нет"}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.finishedProjects}>
          <div className={styles.finishedProjects__header}>
            <h3 className={styles.finishedProjects__title}>
              Выполненные проекты
            </h3>
            <span className={styles.finishedProjects__count}>16</span>
          </div>

          <div className={styles.finishedProjects__subinfo}>
            <span>Оценка трекеров — 4.5</span>
            <span>Оценка заказчика — 3.66</span>
          </div>

          <div className={styles.finishedProjects__table}>
            <div
              className={
                styles.finishedProjects__row +
                " " +
                styles.finishedProjects__head
              }
            >
              <div>Название</div>
              <div>Клиент</div>
              <div>Трекер</div>
              <div>Таймлайн</div>
              <div>Оценка трекеров</div>
              <div>Оценка заказчика</div>
            </div>

            <div className={styles.finishedProjects__row}>
              <div>Анализ рынка грибов</div>
              <div>Ахмед</div>
              <div>Трекер Трекерович</div>
              <div>ДД.ММ.ГГГГ</div>
              <div>4.5/5</div>
              <div>4/5</div>
            </div>
            <div className={styles.finishedProjects__row}>
              <div>Анализ рынка грибов</div>
              <div>Магомед</div>
              <div>Трекер Трекерович</div>
              <div>ДД.ММ.ГГГГ</div>
              <div>4.5/5</div>
              <div>4/5</div>
            </div>
            <div className={styles.finishedProjects__row}>
              <div>Анализ рынка грибов</div>
              <div>Татьяна</div>
              <div>Трекер Трекерович</div>
              <div>ДД.ММ.ГГГГ</div>
              <div>4.5/5</div>
              <div>3/5</div>
            </div>
          </div>
        </div>
        <TrackerNotes />
        <div className={styles.education}>
          <h3 className={styles.education__title}>Образование</h3>

          <div className={styles.education__item}>
            <p className={styles.education__label}>Образование — 1</p>
            <p className={styles.education__text}>
              МГТУ им Н.Э.Баумана, Бакалавриат, Менеджмент "управление
              организацией", 2026
            </p>
          </div>

          <div className={styles.education__item}>
            <p className={styles.education__label}>Образование — 2</p>
            <p className={styles.education__text}>
              МГТУ им Н.Э.Баумана, Магистратура, Инноватика "управление
              стартапом", 2028
            </p>
          </div>
        </div>
        <div className={styles.experienceBlock}>
          <h3 className={styles.experienceBlock__title}>Опыт работы</h3>

          <div className={styles.experienceBlock__item}>
            <p className={styles.experienceBlock__label}>Место работы — 1</p>
            <p className={styles.experienceBlock__text}>
              Компания, Строитель, ММ.ГГГГ — ММ.ГГГГ, Продавал арбузы
            </p>
          </div>

          <div className={styles.experienceBlock__item}>
            <p className={styles.experienceBlock__label}>Место работы — 2</p>
            <p className={styles.experienceBlock__text}>
              Компания, Строитель, ММ.ГГГГ — ММ.ГГГГ, Продавал арбузы
            </p>
          </div>

          <div className={styles.experienceBlock__item}>
            <p className={styles.experienceBlock__label}>Место работы — 3</p>
            <p className={styles.experienceBlock__text}>
              Компания, Строитель, ММ.ГГГГ — ММ.ГГГГ, Продавал арбузы
            </p>
          </div>
        </div>
        <div className={styles.motivation}>
          <div className={styles.motivation__item}>
            <p className={styles.motivation__title}>
              Профессиональные интересы
            </p>
            <div className={styles.motivation__content}>
              Хочу перейти в продакт, управлять стартапом и инновационным
              продуктом
            </div>
          </div>

          <div className={styles.motivation__item}>
            <p className={styles.motivation__title}>Цели</p>
            <div className={styles.motivation__content}>
              Хочу заработать на лексус, создать компанию единорога
            </div>
          </div>

          <div className={styles.motivation__item}>
            <p className={styles.motivation__title}>Интересующие сферы</p>
            <div className={styles.motivation__content}>
              Аналитика, маркетинг, менеджмент
            </div>
          </div>
        </div>
        <div className={styles.reviews}>
          <h3 className={styles.reviews__title}>Отзывы</h3>

          <div className={styles.reviews__table}>
            <div className={styles.reviews__row + " " + styles.reviews__head}>
              <div>Название проекта</div>
              <div>Таймлайн</div>
              <div>Заказчик</div>
              <div>Трекер</div>
            </div>

            <div className={styles.reviews__row}>
              <div>Анализ рынка груш</div>
              <div>
                ДД.ММ.ГГГГ <br /> ДД.ММ.ГГГГ
              </div>
              <div className={styles.reviews__comment}>Молодец</div>
              <div className={styles.reviews__comment}>
                Я все за него делал!!!
              </div>
            </div>

            <div className={styles.reviews__row}>
              <div>Анализ рынка груш</div>
              <div>
                ДД.ММ.ГГГГ <br /> ДД.ММ.ГГГГ
              </div>
              <div className={styles.reviews__comment}>Молодец</div>
              <div className={styles.reviews__comment}>
                Я все за него делал!!!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialistCard;
