import { Project } from "widgets/sub_pages/ClientProfile/components/ProjectBlock/ProjectBlock";
import { SpecialistFile } from "./specialist";

export interface Client {
  id: number;
  custom_user: {
    id: number;
    full_name: string;
    first_name: string;
    last_name: string;
    username: string;
    time_zone: string;
    email: string;
    avatar: string | null;
    phone_number: string | null;
    role: string;
    tg_nickname?: string | null;
  };
  file?: SpecialistFile[];
  business_name?: string | null;
  position?: string | null;
  description?: string | null;
  problems?: string | null;
  tasks?: string | null;
  business_goals?: string | null;
  solving_problems?: string | null;
  target_audience?: string | null;
  geography?: string | null;
  employee_count?: string | null;
  revenue?: string | null;
  years_on_market?: string | null;
  professional_areas?: number[];
  business_scope_ids?: number[];
  overall_rating?: number | null;
  mood?: number | null;
  orders_total?: number;
  orders_in_progress?: number;
  order_cost_avg?: number;
  projects_count?: number;
  projects?: Project[];
}

