import React from "react";
import styles from "./SpecialistCard.module.scss";
import Heart from "shared/images/Like.svg";
import PaperPlane from "shared/images/paperplane.svg";
import Avatar from "shared/UI/Avatar/Avatar";
import Tag from "shared/UI/Tag/Tag";

interface Specialist {
  id: number;
  custom_user_id: {
    avatar?: string;
    first_name?: string;
    full_name?: string;
    username?: string;
    role?: string | number;
    date_joined?: string;
  };
  total_rating?: number;
  self_description?: string;
  interest_first?: string[];
  projects_in_progress?: number;
  tasks_in_progress?: number;
}

interface SpecialistCardProps {
  specialist: Specialist;
}

const SpecialistCard: React.FC<SpecialistCardProps> = ({ specialist }) => {
  return (
    <div className={styles.specialistCard}>
      <div className={styles.cardContent}>
        <Avatar
          src={specialist.custom_user_id?.avatar}
          alt={specialist.custom_user_id?.full_name || "ДАННЫХ НЕТ"}
        />
        <div className={styles.cardInfo}>
          <div className={styles.cardHeader}>
            <div className={styles.userInfo}>
              <div className={styles.nameContainer}>
                <h3 className={styles.name}>
                  {`${specialist.custom_user_id?.first_name || specialist.custom_user_id?.username} 
                  ${specialist.custom_user_id?.full_name || "ДАННЫХ НЕТ"}`}
                </h3>
                <div className={styles.rating}>
                  <span className={styles.star}>★</span>
                  <span>{specialist.total_rating || "0"}</span>
                </div>
              </div>
              <p className={styles.role}>
                {specialist.custom_user_id?.role || "ДАННЫХ НЕТ"}
              </p>
            </div>
            <div className={styles.actionGroup}>
              <div className={styles.buttons}>
                <button className={styles.iconButton}>
                  <img src={Heart} alt="Like" />
                </button>
                <button className={styles.iconButton}>
                  <img src={PaperPlane} alt="Send" />
                </button>
                <button className={styles.profileButton}>Профиль</button>
              </div>
            </div>
          </div>

          <p className={styles.description}>
            {specialist.self_description || "ДАННЫХ НЕТ"}
          </p>

          <div className={styles.skillList}>
            {(specialist.interest_first?.length
              ? specialist.interest_first
              : ["ДАННЫХ НЕТ"]
            ).map((skill, idx) => (
              <Tag key={idx} label={skill} />
            ))}
          </div>

          <div className={styles.metadata}>
            <span>
              Дата регистрации:{" "}
              {specialist.custom_user_id?.date_joined || "ДАННЫХ НЕТ"}
            </span>
            <span>Проекты в процессе: {specialist.projects_in_progress || "0"}</span>
            <span>Задачи в процессе: {specialist.tasks_in_progress || "0"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialistCard;
