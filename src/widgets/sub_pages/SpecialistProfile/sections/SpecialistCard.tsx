import styles from "./SpecialistCard.module.scss";
import Avatar from "shared/UI/Avatar/Avatar";
import Phone from "shared/images/clientImgs/phone.svg";
import Mail from "shared/images/clientImgs/mail.svg";
import Web from "shared/images/clientImgs/network.svg";
import Chat from "shared/images/clientImgs/Chat.svg";
import Write from "shared/images/clientImgs/Write.svg";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProjects, selectProjects } from "shared/store/slices/projectsSlice";
import { useAppDispatch } from "shared/hooks/useAppDispatch";
import { useAppSelector } from "shared/hooks/useAppSelector";
import TagSection from "./TagSection";
import ProjectFiles from "shared/UI/ProjectFiles/ProjectFiles";
import RateItem from "shared/UI/RateItem/RateItem";
import CustomDivTable from "shared/UI/CutomDivTable/CustomDivTable";
import { TrackerNotes } from "widgets/sub_pages/ClientProfile/components/TrackerNotes/TrackerNotes";
import { Specialist } from "shared/store/slices/specialistsSlice";
import { updateMe } from "shared/store/slices/meSlice";
import Spinner from "shared/UI/Spinner/Spinner";

interface SpecialistCardProps {
  specialist: Specialist;
  isSelf?: boolean;
}

const SpecialistCard: React.FC<SpecialistCardProps> = ({
  specialist,
  isSelf = false,
}) => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneValue, setPhoneValue] = useState(
    specialist.custom_user.phone_number || ""
  );

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailValue, setEmailValue] = useState(
    specialist.custom_user.email || ""
  );

  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [description, setDescription] = useState(
    specialist.self_description || ""
  );

  const handleDescriptionClick = () => {
    if (isSelf) {
      setIsEditingDescription(true);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleDescriptionBlur = async () => {
    setIsEditingDescription(false);
    try {
      await dispatch(updateMe({ self_description: description })).unwrap();
      console.log("Описание успешно обновлено");
    } catch (error) {
      console.error("Ошибка при обновлении описания:", error);
    }
  };

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  const allProjects = useAppSelector(selectProjects) || [];

  if (!specialist || !specialist.custom_user) {
    return <Spinner />;
  }

  const name =
    specialist.custom_user.first_name || specialist.custom_user.username;
  const fullName = specialist.custom_user.full_name || "ФИО не указано";

  const specialistProjects = allProjects.filter(
    (project) => project.assigned_specialist === specialist.custom_user.username
  );

  const activeProjects = specialistProjects.filter(
    (project) => project.is_finished === false
  );
  const finishedProjects = specialistProjects.filter(
    (project) => project.is_finished === true
  );

  const handleEmailClick = () => {
    if (isSelf) {
      setIsEditingEmail(true);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailValue(e.target.value);
  };

  const handleEmailBlur = async () => {
    setIsEditingEmail(false);
    try {
      await dispatch(updateMe({ custom_user: { email: emailValue } })).unwrap();
      console.log("Email успешно обновлён");
    } catch (error) {
      console.error("Ошибка обновления email:", error);
    }
  };

  const handlePhoneClick = () => {
    if (isSelf) {
      setIsEditingPhone(true);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneValue(e.target.value);
  };

  const handlePhoneBlur = async () => {
    setIsEditingPhone(false);
    try {
      await dispatch(updateMe({ phone_number: phoneValue })).unwrap();
      console.log("✅ Телефон успешно обновлён");
    } catch (error) {
      console.error("❌ Ошибка при обновлении телефона:", error);
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div className={styles.client}>
          <div className={styles.info}>
            <div className={styles.avatar}>
              <Avatar src={specialist.custom_user.avatar} size="52" />
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
              <img src={Phone} alt="Телефон" />
              {isEditingPhone ? (
                <input
                  type="text"
                  value={phoneValue}
                  onChange={handlePhoneChange}
                  onBlur={handlePhoneBlur}
                  autoFocus
                  className={styles.inputField}
                />
              ) : (
                <span onClick={handlePhoneClick}>
                  {phoneValue || "Не указано"}
                </span>
              )}
            </p>
            <p className={styles.contact}>
              <img src={Mail} alt="Почта" />
              {isEditingEmail ? (
                <input
                  type="email"
                  value={emailValue}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                  autoFocus
                  className={styles.inputField}
                />
              ) : (
                <span onClick={handleEmailClick}>
                  {emailValue || "Не указано"}
                </span>
              )}
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
          {isEditingDescription ? (
            <input
              type="text"
              value={description}
              onChange={handleDescriptionChange}
              onBlur={handleDescriptionBlur}
              autoFocus
              className={styles.inputField}
            />
          ) : (
            <p className={styles.desc} onClick={handleDescriptionClick}>
              {description || "Описание не указано"}
            </p>
          )}

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
          {specialistProjects.length === 0 ? (
            <p>Нет активных проектов</p>
          ) : (
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
              rows={activeProjects.map((project) => [
                project.name || "Нет названия",
                "-", 
                "-", 
                project.start_date && project.end_date
                  ? `${project.start_date} — ${project.end_date}`
                  : "Нет дат",
                project.project_cost || "Нет стоимости",
                project.remaining_tasks?.toString() ?? "Нет данных",
              ])}
            />
          )}
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
