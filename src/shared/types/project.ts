import { Task } from "shared/types/tasks";
import { Tracker } from "./tracker";



export interface ProjectSummary {
  id: number;
  name: string;
  status: string;
  deadline: string | null;
  tracker: {
    id: number;
    full_name: string;
  };
  specialists: {
    id: number;
    full_name: string;
  }[];
  client: {
    id: number;
    full_name: string | null;
  };
}


export interface ProjectDetail {
  id: number;
  name: string;
  start_date: string;
  updated_at: string;
  deadline: string;
  status: string;
  budget: string;
  goal: string;
  solving_problems: string;
  product_or_service: string;
  extra_wishes: string;
  client: {
    id: number;
    full_name: string;
    business_name: string;
    rating: number;
    mood: number;
  };
  project_team: {
    tracker: Tracker;
    specialists: {
      id: number;
      full_name: string;
      tasks_total: number;
      tasks_in_progress: number;
      tasks_in_review: number;
      tasks_completed: number;
      tasks_completed_percent: number;
    }[];
  };
  file: any[];
  tasks?: Task[];
}


export interface ProjectMinimal {
  id: number | string;
  name: string;
  start_date: string;
  end_date: string;
  specialist?: {
    id: number | string;
    full_name: string;
  } | null;
  assigned_specialist?: {
    id: number | string;
    full_name: string;
  } | null;
  title?: string;
}
