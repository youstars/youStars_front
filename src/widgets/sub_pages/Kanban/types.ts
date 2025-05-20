export type TaskStatus =
    | "to_do"
    | "in_progress"
    | "help"
    | "review"
    | "completed"
    | "pending"
    | "canceled";

export interface Task {
    id: number;
    title: string;
    description: string;
    material: string;
    notice: string;
    status: TaskStatus;
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
    files: any[];
    notes: any[];
    assigned_specialist: string[];
}
