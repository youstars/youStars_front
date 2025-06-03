export type TaskStatus =
    | "to_do"
    | "in_progress"
    | "help"
    | "review"
    | "completed"
    | "pending"
    | "canceled";

// export type Task = {
//   id: number | string;
//   title: string;
//   description?: string;
//   status: number | string;
//   material?: string;
//   notice?: string;
//   start_date: string;
//   end_date: string;
//   name?: string;
//   start?: Date;
//   end?: Date;
//   specialist?: string;
//   assigned_specialist: SpecialistShort[]; // Исправлено с string[] на SpecialistShort[]
//   subtasks_count?: number;
//   [key: string]: any;
// };