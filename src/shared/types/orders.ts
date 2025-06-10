export interface Order {
  id: number;
  order_goal: string;
  product_or_service: string;
  solving_problems: string;
  extra_wishes: string;
  estimated_budget: string;
  project_deadline: string | null;
  start_project_at?: string;

  client: {
    id: number;
    business_name: string | null;
    custom_user: {
      id: number;
      full_name: string;
      first_name: string;
      last_name: string;
      avatar: string | null;
      role: string;
    };
  };

  tracker: number;
  tracker_data?: {
  id: number;
  custom_user: {
    id: number;
    full_name: string;
    first_name: string;
    last_name: string;
    avatar: string | null;
    role: string;
  };
};

  invited_specialists: any[];

  approved_specialists: {
    id: number;
    custom_user: {
      id: number;
      full_name: string;
      first_name: string;
      last_name: string;
      avatar: string | null;
      role: string;
    };
  }[];

  order_name: string;
  approved_budget: string | number | null;
  status: number | string;
  project_name: string | null;
  payment_status: string;
  prepaid_percent: string;

  file_commercial_offer: any[];
  file_other_file: any[];
  file_terms_of_reference: any[];

  created_at: string;
  updated_at: string;
  is_archived: boolean;

  specialists?: { id: number }[];
}
