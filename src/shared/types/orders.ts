export interface Order {
    id: number;
    order_goal: string;
    product_or_service: string;
    solving_problems: string;
    extra_wishes: string;
    estimated_budget: string;
    project_deadline: string | null;
    client: number;
    tracker: number | null;
    invited_specialists: any[];
    approved_specialists: any[];
    order_name: string;
    approved_budget: string  | number;
    status: number;
    project_name: string | null;
    payment_status: string;
    prepaid_percent: string;
    file_commercial_offer: any[];
    file_other_file: any[];
    created_at: string;
    updated_at: string;
    is_archived: boolean;
    file_terms_of_reference: any[];
}
