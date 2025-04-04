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
    specialist?: string;
    [key: string]: any;
  };
  