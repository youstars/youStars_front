export type Task = {
    id: number;
    title: string;
    description: string;
    material: string;
    notice: string;
    status: string;
    status_priority: string;
    project: string | null;
    start_date: string;
    deadline: string;
    created_at: string;
    updated_at: string;
    personal_grade: number;
    intricacy_coefficient: number;
    manager_recommendation: number;
    task_credits: number;
    execution_period: number;
    deadline_compliance: number;
    duration: number;
    subtasks_count: number;
    files: any[]; // можно уточнить тип при необходимости
    notes: any[];
    assigned_specialist: string[];
};
