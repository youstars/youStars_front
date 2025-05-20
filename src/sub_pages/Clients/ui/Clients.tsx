import React from "react";
import styles from "./Clients.module.scss";
// import { TrackerNotes } from "./TrackerNotes/TrackerNotes";
// import { ProjectBlock } from "./ProjectBlock/ProjectBlock";
import Avatar from "shared/UI/Avatar/Avatar";
import Phone from "shared/images/clientImgs/phone.svg";
import Mail from "shared/images/clientImgs/mail.svg";
import Web from "shared/images/clientImgs/network.svg";
import Chat from "shared/images/clientImgs/Chat.svg";
import Write from "shared/images/clientImgs/Write.svg";

export const Clients = (): JSX.Element => {
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
              <Avatar />
              <p className={styles.client__days}>3 дня</p>
            </div>
            <div className={styles.client__text}>
              <h3 className={styles.client__name}>{client.name}</h3>
              <p className={styles.client__position}>{client.position}</p>
              <p className={styles.client__company}>{client.company}</p>
              <p className={styles.client__rating}>Рейтинг заказчика 4/5</p>
            </div>
          </div>

          <div className={styles.client__contacts}>
            <p className={styles.client__contact}>
              <img
                src={Phone}
                alt="Телефон"
                className={styles.client__iconImg}
              />{" "}
              {client.phone}
            </p>
            <p className={styles.client__contact}>
              {" "}
              <img
                src={Mail}
                alt="Mail"
                className={styles.client__iconImg}
              />{" "}
              {client.email}{" "}
            </p>
            <p className={styles.client__contact}>
              <img src={Web} alt="Web" className={styles.client__iconImg} />{" "}
              {client.website}
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
            <img
                src={Chat}
                alt="Chat"
              />
            </button>
            <button className={styles.client__icon}><img
                src={Write}
                alt="Write"
              /></button>
          </div>
        </div>

        <div className={styles.business__info}>
          <div className={styles.business__block}>
            <h4 className={styles.business__title}>Сфера деятельности</h4>
            <div className={styles.business__empty}></div>
          </div>
          <div className={styles.business__block}>
            <h4 className={styles.business__title}>Проблемы бизнеса</h4>
            <div className={styles.business__empty}></div>
          </div>
          <div className={styles.business__block}>
            <h4 className={styles.business__title}>Задачи бизнеса</h4>
            <div className={styles.business__empty}></div>
          </div>
        </div>

        <div className={styles.business__statistics}>
          <button className={styles.business__stat}>География</button>
          <button className={styles.business__stat}>Сотрудников</button>
          <button className={styles.business__stat}>Годовая выручка</button>
          <button className={styles.business__stat}>Лет на рынке</button>
        </div>
      </div>

      {/*<TrackerNotes />*/}
      {/*<ProjectBlock />*/}
      {/*<ProjectBlock />*/}
      {/*<ProjectBlock />*/}
    </div>
  );
};
