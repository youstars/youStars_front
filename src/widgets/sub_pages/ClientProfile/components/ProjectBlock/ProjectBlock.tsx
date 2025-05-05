import React from "react";
import styles from "./ProjectBlock.module.scss";
import { CardItem } from "shared/UI/CardItem/CardItem";

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

const projects: Project[] = [
    {
        id: 1,
        title: "Проект A",
        amount: "1 500 000 ₽",
        status: "В работе",
        tracker: "Трекер M",
        specialist: "Специалисты C",
        timeline: "12.03.2025 - 12.07.2025",
        lastContact: "12.03.2025 16:15"
    },
    {
        id: 2,
        title: "Проект B",
        amount: "1 500 000 ₽",
        status: "В работе",
        tracker: "Трекер M",
        specialist: "Специалисты C",
        timeline: "12.03.2025 - 12.07.2025",
        lastContact: "12.03.2025 16:15"
    },
    {
        id: 3,
        title: "Проект C",
        amount: "1 500 000 ₽",
        status: "В работе",
        tracker: "Трекер M",
        specialist: "Специалисты C",
        timeline: "12.03.2025 - 12.07.2025",
        lastContact: "12.03.2025 16:15"
    },
    {
        id: 4,
        title: "Проект D",
        amount: "1 500 000 ₽",
        status: "В работе",
        tracker: "Трекер M",
        specialist: "Специалисты C",
        timeline: "12.03.2025 - 12.07.2025",
        lastContact: "12.03.2025 16:15"
    }
];

export const ProjectBlock = (): JSX.Element => {
    return (
        <div className={styles.projectBlock}>
            <div className={styles.projectBlockText}>
                <h3 className={styles.projectBlockTitle}>Проекты в обработке</h3>
                <span className={styles.projectBlockTotal}>Стоимость проектов: 450 000 ₽</span>
            </div>

            <div className={styles.projectBlockList}>
                {projects.map((project) => (
                    <CardItem key={project.id} project={project} />
                ))}
            </div>
        </div>
    );
};
