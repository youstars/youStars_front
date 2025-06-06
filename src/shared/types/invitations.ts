export interface Invitation {
  id?: number;
  order_id: number;
  project_name: string;
  specialist_id: number;
  specialist_name: string;
  profession: string;
  hourly_rate: number;
  estimated_total: number;
  availability: string;
  services: string[];
  business_scopes: string[];
  status?: 'pending' | 'accepted' | 'declined';
}
