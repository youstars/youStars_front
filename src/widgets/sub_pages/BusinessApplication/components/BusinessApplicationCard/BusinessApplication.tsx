import React from "react";
import styles from "./BusinessApplication.module.scss";
import Avatar from "shared/UI/Avatar/Avatar";
import ProgressBar from "shared/UI/ProgressBar/ProgressBar";
import Chat from "shared/assets/icons/chat_yellow.svg";
import IconButton from "shared/UI/IconButton/IconButton";
import ApplicationCard from "shared/UI/ApplicationaCard/ApplicationCard";
import TextAreaField from "shared/UI/TextAreaField/TextAreaField";



export default function BusinessApplicationCard() {


    const [isOpen, setIsOpen] = React.useState(false);


    const steps = [
    "Обработка",
    "Метчинг",
    "Предоплата",
    "Работа",
    "Постоплата",
    "Готово",
    "Отзыв",
  ];
  return (


<div className={styles.container} onClick={() => setIsOpen(!isOpen)}>

        
<div className={styles.header}>
  <ApplicationCard
    number="100010010"
    priceRange="20 000 - 50 000"
    dateRange="10.06 - 13.06"
  />

  <div className={styles.rank}>
    <div className={styles.rankHeader}></div>
    <div className={styles.progressBar}>
      <ProgressBar steps={steps} />
    </div>
  </div>
  <div className={styles.rightBlock}>
    <div className={styles.avatar}>
      <Avatar size="40" />
      <h1>Project <br></br> Name</h1>
    </div>

    <IconButton icon={Chat} alt="chat" size="lg" borderColor="#FFD700" />

  </div>
</div>

<div className={`${styles.projectDetails} ${isOpen ? styles.open : ""}`}>
  <TextAreaField label="Задача проекта" />
  <TextAreaField label="Решаемые проблемы" />
  <TextAreaField label="Продукт или услуга" />
  <TextAreaField label="Дополнительные пожелания" />
</div>
</div>
  )
}
