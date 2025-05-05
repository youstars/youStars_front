import React from "react";
import styles from "./ClientProfile.module.scss";
import { TrackerNotes } from "./components/TrackerNotes/TrackerNotes";
import { ProjectBlock } from "./components/ProjectBlock/ProjectBlock";
import Avatar from "shared/UI/Avatar/Avatar";
import Phone from "shared/images/clientImgs/phone.svg";
import Mail from "shared/images/clientImgs/mail.svg";
import Web from "shared/images/clientImgs/network.svg";
import Chat from "shared/images/clientImgs/Chat.svg";
import Write from "shared/images/clientImgs/Write.svg";

export const ClientProfile = (): JSX.Element => {
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
          <div className={styles.clientInfo}>
            <div className={styles.clientAvatar}>
              <Avatar />
              <p className={styles.clientDays}>3 дня</p>
            </div>
            <div className={styles.clientText}>
              <h3 className={styles.clientName}>{client.name}</h3>
              <p className={styles.clientPosition}>{client.position}</p>
              <p className={styles.clientCompany}>{client.company}</p>
              <p className={styles.clientRating}>Рейтинг заказчика 4/5</p>
            </div>
          </div>

          <div className={styles.clientContacts}>
            <p className={styles.clientContact}>
              <img src={Phone} alt="Телефон" className={styles.clientIconImg} />{" "}
              {client.phone}
            </p>
            <p className={styles.clientContact}>
              {" "}
              <img src={Mail} alt="Mail" className={styles.clientIconImg} />{" "}
              {client.email}{" "}
            </p>
            <p className={styles.clientContact}>
              <img src={Web} alt="Web" className={styles.clientIconImg} />{" "}
              {client.website}
            </p>
          </div>

          <div className={styles.clientMetrics}>
            <p className={styles.clientMetric}>
              Активность: {client.metrics.activity}
            </p>
            <p className={styles.clientMetric}>
              Стоимость: {client.metrics.cost}
            </p>
            <p className={styles.clientMetric}>
              Средняя стоимость: {client.metrics.avgCost}
            </p>
            <p className={styles.clientMetric}>
              Настроение: {client.metrics.mood}
            </p>
          </div>

          <div className={styles.clientIcons}>
            <button className={styles.clientIcon}>
              <img src={Chat} alt="Chat" />
            </button>
            <button className={styles.clientIcon}>
              <img src={Write} alt="Write" />
            </button>
          </div>
        </div>

        <div className={styles.businessInfo}>
          <div className={styles.businessBlock}>
            <h4 className={styles.businessTitle}>Сфера деятельности</h4>
            <div className={styles.businessEmpty}></div>
          </div>
          <div className={styles.businessBlock}>
            <h4 className={styles.businessTitle}>Проблемы бизнеса</h4>
            <div className={styles.businessEmpty}></div>
          </div>
          <div className={styles.businessBlock}>
            <h4 className={styles.businessTitle}>Задачи бизнеса</h4>
            <div className={styles.businessEmpty}></div>
          </div>
        </div>

        <div className={styles.businessStatistics}>
          <button className={styles.businessStat}>География</button>
          <button className={styles.businessStat}>Сотрудников</button>
          <button className={styles.businessStat}>Годовая выручка</button>
          <button className={styles.businessStat}>Лет на рынке</button>
        </div>
      </div>

      <TrackerNotes />
      <ProjectBlock />
      <ProjectBlock />
      <ProjectBlock />
    </div>
  );
};
