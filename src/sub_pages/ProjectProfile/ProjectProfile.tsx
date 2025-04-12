import React from "react";
import styles from "./ProjectProfile.module.scss";
import Avatar from "shared/UI/Avatar/Avatar";
import Checklist from "shared/assets/icons/checklist.svg";
import Chat from "shared/assets/icons/chat.svg";
import GroupChat from "shared/assets/icons/groupChat.svg";
import IconButton from "shared/UI/IconButton/IconButton";
import ProgressBar from "../../shared/UI/ProgressBar/ProgressBar";
import TextAreaField from "../../shared/UI/TextAreaField/TextAreaField";
import { Tracker } from "./types";
import { TableColumn } from "./types";
import AvatarWithName from "shared/UI/AvatarWithName/AvatarWithName";
import { Specialist } from "./types";
import ProjectFiles from "../../shared/UI/ProjectFiles/ProjectFiles";
import CustomTable from "shared/UI/CustomTable/CustomTable";

export default function ProjectProfile() {
  const steps = [
    "Обработка",
    "Метчинг",
    "Предоплата",
    "Работа",
    "Постоплата",
    "Готово",
    "Отзыв",
  ];

  const specialistData: Specialist[] = [
    {
      name: "Специалист Специалистыч",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      inWork: 40,
      inReview: 25,
      done: 8,
    },
    {
      name: "Специалист Специалистыч",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      inWork: 40,
      inReview: 25,
      done: 8,
    },
    {
      name: "Специалист Специалистыч",
      avatar: "https://randomuser.me/api/portraits/men/53.jpg",
      inWork: 40,
      inReview: 25,
      done: 8,
    },
    {
      name: "Специалист Специалистыч",
      avatar: "https://randomuser.me/api/portraits/men/53.jpg",
      inWork: 40,
      inReview: 25,
      done: 8,
    },
  ];

  const specialistColumns: TableColumn<Specialist>[] = [
    {
      header: "Специалисты",
      accessor: (row: Specialist) => (
        <AvatarWithName src={row.avatar} name={row.name} />
      ),
    },
    { header: "В работе", accessor: "inWork" },
    { header: "На проверке", accessor: "inReview" },
    { header: "Готово", accessor: "done" },
    {
      header: "% выполненных задач",
      accessor: "done",
    },
  ];

  const trackerData = [
    {
      name: "Ольга Трекерова",
      avatar:
        "https://images.unsplash.com/photo-1635488640163-e5f6782cda6e?q=80&w=1376&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      inWork: 8,
      inReview: 3,
      done: 12,
    },
    {
      name: "Иван Контрольный",
      avatar:
        "https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Ym95fGVufDB8fDB8fHww",
      inWork: 5,
      inReview: 2,
      done: 9,
    },
  ];

  const trackerColumns: TableColumn<Tracker>[] = [
    {
      header: "Трекер",
      accessor: (row) => <AvatarWithName src={row.avatar} name={row.name} />,
    },
    { header: "Задач в работе", accessor: "inWork" },
    { header: "На проверке", accessor: "inReview" },
    { header: "Выполнено", accessor: "done" },
  ];

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          <Avatar size="60" />
          <h1>Project Name</h1>
        </div>
        <div className={styles.rank}>
          <div className={styles.rankHeader}>
            <div className={styles.alignWrapper}>
              <p>Стоимомть</p>
              <p>900000</p>
            </div>
            <div className={styles.alignWrapper}>
              <p>Начало</p>
              <p>10.05.2025</p>
            </div>
            <div className={styles.alignWrapper}>
              <p>Дедлайн</p>
              <p>20.06.2025</p>
            </div>
          </div>
          <div className={styles.progressBar}>
            <ProgressBar steps={steps} />
          </div>
        </div>
        <div className={styles.buttons}>
          <IconButton icon={Checklist} alt="checklist" size={"lg"} />
          <IconButton icon={GroupChat} alt="checklist" size={"lg"} />
          <IconButton icon={Chat} alt="checklist" size={"lg"} />
        </div>
      </div>
      <div className={styles.projectDetails}>
        <TextAreaField label="Задача проекта" />
        <TextAreaField label="Решаемые проблемы" />
        <TextAreaField label="Решаемые проблемы" />
        <TextAreaField label="Дополнительные пожелания" />
      </div>
      <div className={styles.teamProject}>
        <h1>Команда проекта</h1>
        <CustomTable<Tracker>
          data={trackerData}
          columns={trackerColumns}
          initialCount={1}
        />
        <CustomTable<Specialist>
          data={specialistData}
          columns={specialistColumns}
          initialCount={3}
        />
      </div>
      <div className={styles.projectFiles}>
      <ProjectFiles
        files={[{ name: "NDA" }, { name: "Резюме" }, { name: "Портфолио" }]}
        onAddClick={() => console.log("Добавить файл")}
      />
      </div>
    </div>
  );
}
