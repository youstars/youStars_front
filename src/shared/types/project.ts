import { Task } from "shared/types/tasks";
import { Tracker } from "./tracker";



export interface Project {
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
