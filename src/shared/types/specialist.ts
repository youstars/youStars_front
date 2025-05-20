export interface SpecialistFile {
    name: string;
    file: string;
    description?: string;
    specialist?: number;
  }
  


export interface Specialist {
  id: number;
  custom_user: {
    id: number;
    avatar?: string;
    first_name?: string;
    full_name?: string;
    last_name?: string;
    username?: string;
    phone_number?: string | null;
    email?: string | null;
    role?: string | number;
    date_joined?: string;
    time_zone?: string | null;
    tg_nickname?: string | null;
  };
  proj_per_quarter_count?: number;
  faculty?: string | null;
  self_description?: string;
  overall_rating?: string | number;
  profession?: string;
  services?: string[];
  is_busy?: string;
  university?: string | null;
  hours_per_week?: string | number;
  projects_in_progress_count?: number;
  tasks_in_progress_count?: number;
  interest_first?: string[];
  appr_hourly_rate?: string | number;
  salary_expectation?: string | number;
  participation_format?: string;
  project_work_period?: string;
  business_scopes?: string[];
  custom_skills?: string[];
  custom_profession?: string | null;
  satisfaction_rate?: number;
  overall_client_rating?: number;
  overall_tracker_rating?: number;
  work_experiences?: {
    id: number;
    position?: string | null;
    duties?: string | null;
    started_at?: string | null;
    left_at?: string | null;
    place_of_work?: {
      id: number;
      company_name?: string;
    };
  }[];
  education?: string[];       
  projects?: {
    status: string;
    name: string;
    client: string | null;
    tracker: string;
    timeline: string;
    [key: string]: any;
  }[];
  file?: SpecialistFile[]; 
  specialist_cost_total?: number;
  tasks_per_project_left?: number;
  year_of_birth?: number | null;

}