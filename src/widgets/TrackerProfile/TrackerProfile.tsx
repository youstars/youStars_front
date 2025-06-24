import React, { useEffect } from "react";
import styles from "./TrackerProfile.module.scss";
import Avatar from "shared/UI/Avatar/Avatar";
import { useAppDispatch } from "shared/hooks/useAppDispatch";
import { useAppSelector } from "shared/hooks/useAppSelector";
import { getTrackerMe } from "shared/store/slices/trackerSlice";
import Phone from "shared/images/clientImgs/phone.svg";
import Mail from "shared/images/clientImgs/mail.svg";
import Web from "shared/images/clientImgs/network.svg";
import ProjectFiles, { FileItem } from "shared/UI/ProjectFiles/ProjectFiles";
import RateItem from "shared/UI/RateItem/RateItem";
import TagSection from "widgets/sub_pages/SpecialistProfile/sections/Other/TagSelection/TagSection";
import { TrackerNotes } from "widgets/sub_pages/ClientProfile/components/TrackerNotes/TrackerNotes";

const TrackerProfile = () => {
  const dispatch = useAppDispatch();
  const { data: tracker, loading } = useAppSelector((state) => state.tracker);

  useEffect(() => {
    dispatch(getTrackerMe());
  }, [dispatch]);

  if (loading || !tracker) return null;

  const { custom_user } = tracker;

  const fullName =
    `${custom_user.first_name || ""} ${custom_user.last_name || ""}`.trim() ||
    custom_user.full_name ||
    "—";

  const handleFileSelect = async (file: File) => {
    console.log("📂 Загрузка файла:", file.name);
  };

  const handleFileDelete = async (file: FileItem) => {
    console.log("❌ Удаление файла ID:", file.id);
  };

  return (
    <div className={styles.main}>
      <div className={styles.client}>
        <div className={styles.info}>
          <div className={styles.avatar}>
            <Avatar src={custom_user.avatar} size="52px" />
            <p className={styles.days}>3 дня</p>
          </div>
          <div className={styles.text}>
            <span className={styles.name}>{fullName}</span>
            <span className={styles.position}>Трекер</span>
            <span className={styles.availability}>
              {tracker.is_busy === "Free" ? "Доступен к проектам" : "Занят"}
            </span>
            <button className={styles.editButton}>Изм. профиль</button>
          </div>
        </div>

        <div className={styles.contacts}>
          <div className={styles.contact}>
            <img src={Phone} alt="phone" className={styles.iconImg} />
            {custom_user.phone_number || "—"}
          </div>
          <div className={styles.contact}>
            <img src={Mail} alt="mail" className={styles.iconImg} />
            {custom_user.email || "—"}
          </div>
          <div className={styles.contact}>
            <img src={Web} alt="tg" className={styles.iconImg} />
            {custom_user.tg_nickname || "—"}
          </div>
        </div>

        <div className={styles.metrics}>
          <div className={styles.metric}>
            Активность: {tracker.projects_per_quarter || 0} проектов/квартал
          </div>
          <div className={styles.metric}>
            Заказов на сумму: {tracker.total_amount || 0} ₽
          </div>
          <div className={styles.metric}>
            Средний чек: {tracker.average_check || 0} ₽
          </div>
        </div>
      </div>

      <div className={styles.projects}>
        <div className={styles.header}>
          <span className={styles.title}>Проекты в работе</span>
          <span className={styles.count}>
            ({tracker.projects?.length || 0})
          </span>
        </div>
        <div className={styles.table}>
          <div className={`${styles.row} ${styles.head}`}>
            <span>Название</span>
            <span>Клиент</span>
            <span>Специалисты</span>
            <span>Таймлайн</span>
            <span>Кол-во задач</span>
            <span>Осталось</span>
          </div>
          {tracker.projects
            ?.filter((p) => p.status !== "completed")
            .map((p) => (
              <div className={styles.row} key={p.id}>
                <span>{p.name}</span>
                <span>{p.client}</span>
                <span>{p.specialists?.join(", ") || "—"}</span>
                <span>{p.timeline || "—"}</span>
                <span>{p.task_count ?? "—"}</span>
                <span>{p.tasks_left ?? "—"}</span>
              </div>
            ))}
        </div>
      </div>

      <div className={styles.finishedProjects}>
        <div className={styles.header}>
          <span className={styles.title}>Выполненные проекты</span>
        </div>
        <div className={styles.table}>
          <div className={`${styles.row} ${styles.head}`}>
            <span>Название</span>
            <span>Клиент</span>
            <span>Специалисты</span>
            <span>Таймлайн</span>
            <span>Оценка клиента</span>
          </div>
          {tracker.projects
            ?.filter((p) => p.status === "completed")
            .map((p) => (
              <div className={styles.row} key={p.id}>
                <span>{p.name}</span>
                <span>{p.client}</span>
                <span>{p.specialists?.join(", ") || "—"}</span>
                <span>{p.timeline || "—"}</span>
                <span>{p.client_rating ?? "—"}</span>
              </div>
            ))}
        </div>
      </div>

     <div className={styles.filesExperienceBlock}>
  <div className={styles.filesBlock}>
    <ProjectFiles
      files={tracker.files?.map((f) => ({
        id: f.id,
        name: f.name,
        fileUrl: f.file,
      })) || []}
      onFileSelect={handleFileSelect}
      onFileDelete={handleFileDelete}
    />
  </div>

  <div className={styles.about}>
    <div className={styles.columns}>
      <div>
        <div className={styles.subtitle}>Опыт в нишах</div>
        <TagSection title="" tags={tracker.scopes || []} />
      </div>
    </div>
  </div>
</div>


      <div className={styles.rateBlock}>
        <RateItem title="Стоимость" value={tracker.cost || "—"} />
        <RateItem
          title="Занятость в неделю"
          value={tracker.hours_per_week || "—"}
        />
        <RateItem title="Часовой пояс" value={custom_user.time_zone || "—"} />
      </div>

      <div className={styles.trackerNotes}>
        <TrackerNotes />
      </div>
    </div>
  );
};

export default TrackerProfile;
