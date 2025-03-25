import React from "react";
import styles from "./CardItem.module.scss";
import Chat from "shared/images/clientImgs/ChatIcon.svg";

interface CardProps {
    project: Project;
}

export interface Project {
    id: number;
    title: string;
    amount: string;
    status: string;
    tracker: string;
    specialist: string;
    timeline: string;
    lastContact: string;
}

export const CardItem: React.FC<CardProps> = ({ project }) => {
    return (
        <div className={styles.card}>

            <p className={styles.card__name}>{project.title}</p>
            <img src={Chat} alt="" />
            <p className={styles.card__amount}>{project.amount}</p>
            <p className={styles.card__status}>
                <span>Статус:</span> {project.status}
            </p>
            <p className={styles.card__tracker}>
                {project.tracker} 
            </p>
            <p className={styles.card__specialist}>
                {project.specialist}
            </p>
            <p className={styles.card__timeline}>
               
                <span>Таймлайн:</span> {project.timeline}
            </p>
            <p className={styles.card__lastContact}>
               
                <span>Последний контакт:</span> {project.lastContact}
            </p>
        </div>
    );
};



