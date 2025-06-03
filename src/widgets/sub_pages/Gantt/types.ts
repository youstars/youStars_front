import { SpecialistShort } from "shared/types/tasks";

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
  export type GanttTask = {
  id: string | number;
  name: string;
  start: Date;
  end: Date;
  status: string | number;
  specialist: SpecialistShort[];
};
