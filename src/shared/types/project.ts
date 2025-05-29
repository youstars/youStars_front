export interface Project {
  id: number;
  name: string; 
  description: string;
  assigned_specialist: string;
  project: string;
  project_cost: string;
  start_date: string;
  end_date: string;
  total_tasks?: number;
  remaining_tasks?: number;
  is_finished?: boolean;
  status?: string; 
}