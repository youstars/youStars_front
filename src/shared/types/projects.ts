export interface Project {

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


export type Projects = Project[];
