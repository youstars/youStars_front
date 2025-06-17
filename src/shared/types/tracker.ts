export interface Tracker {
  id: number;
  full_name: string;
  avatar: string | null; 
  tasks_total: number;
  tasks_in_progress: number;
  tasks_in_review: number;
  tasks_completed_percent: number;
  payment: number;
}
