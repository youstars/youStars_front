export type TaskPosition = {
    start: number;
    end: number;
    visible: boolean;
    isStart: boolean;
    isEnd: boolean;
    continuesFromPrevious: boolean;
    continuesToNext: boolean;
  };

  export type Task = {
    id: number;
    name: string;
    start: Date;
    end: Date;
    status: number;
    specialist: string;
    executor?: string; 
    project: string;
    assigned_specialist: string;
    admin: string;
};