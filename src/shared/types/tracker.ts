export interface Tracker {
  id: number;
  full_name: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  tg_nickname?: string;
  avatar?: string;
  role: "Tracker";
  time_zone?: string;
is_busy?: "Free" | "Busy"; 
  custom_user: {
    id: number;
    first_name?: string;
    last_name?: string;
    full_name?: string;
    avatar?: string;
    email?: string;
    phone_number?: string;
    tg_nickname?: string;
    time_zone?: string;
  };

  projects?: {
    id: number;
    name: string;
    client: string;
    specialists: string[];
    timeline?: string;
    status: "in_progress" | "completed";
    task_count?: number;
    tasks_left?: number;
    client_rating?: number;
  }[];

  files?: {
    id: number;
    name: string;
    file: string;
  }[];

  scopes?: string[];
  cost?: string;
  hours_per_week?: string;
  projects_per_quarter?: number;
  total_amount?: number;
  average_check?: number;
}
