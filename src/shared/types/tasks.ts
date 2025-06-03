export type TaskPosition = {
    start: number;
    end: number;
    visible: boolean;
    isStart: boolean;
    isEnd: boolean;
    continuesFromPrevious: boolean;
    continuesToNext: boolean;
  };

export type SpecialistShort = {
  id: number;
  full_name: string;
  avatar?: string;
};

export type TaskFile = {
  name?: string;
  url?: string;
  [key: string]: any;
};


export type Task = {
  id: number | string;
  title: string;
  description?: string;
  status: number | string;
  material?: string;
  notice?: string;
  start_date: string;
  end_date: string;
  name?: string;
  start?: Date;
  end?: Date;
  specialist: { full_name?: string }[];
  assigned_specialist: SpecialistShort[];
  [key: string]: any;
   files?: TaskFile[];

};

export type TaskStatus =
    | "to_do"
    | "in_progress"
    | "help"
    | "review"
    | "completed"
    | "pending"
    | "canceled";
