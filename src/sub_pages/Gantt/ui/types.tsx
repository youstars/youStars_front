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
    status: string;
    specialist: string;
  };
  