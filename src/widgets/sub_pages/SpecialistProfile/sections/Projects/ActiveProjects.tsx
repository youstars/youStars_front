import type { Project as TableProject } from "shared/UI/CutomDivTable/CustomDivTable";
import React from "react";
import CustomDivTable from "shared/UI/CutomDivTable/CustomDivTable";

interface ActiveProjectsProps {
    /** Массив активных проектов */
    projects: TableProject[];
}

const ActiveProjects: React.FC<ActiveProjectsProps> = ({ projects }) => {
    if (!projects || projects.length === 0) {
        return <p>Нет активных проектов</p>;
    }

    const rows = projects.map((project) => [
        project.name || "Нет названия",
        project.client || "—",
        project.tracker || "—",
        project.timeline || "Нет дат",
        project.task_total_sum?.toString() ?? "Нет суммы",
        project.tasks_left?.toString() ?? "Нет данных",
    ]);

    return (
        <CustomDivTable
            activeProjects={projects}
            headers={["Название", "Клиент", "Трекер", "Таймлайн", "Сумма", "Осталось"]}
            rows={rows}
        />
    );
};

export default ActiveProjects;