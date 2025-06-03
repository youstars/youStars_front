import { Task } from "shared/types/tasks";
import { GanttTask } from "./types";
export const isWeekend = (date: Date): boolean => {
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const getDaysArray = (year: number): Date[] => {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  const days: Date[] = [];
  let currentDay = new Date(startDate);

  while (currentDay <= endDate) {
    days.push(new Date(currentDay));
    currentDay.setDate(currentDay.getDate() + 1);
  }

  return days;
};

export const getStatusLabel = (status: string): string => {
  const openStatuses = ["Нужно выполнить", "in_progress"];
  const closedStatuses = ["completed", "Провалено"];

  if (openStatuses.includes(status)) return "Статус открыт";
  if (closedStatuses.includes(status)) return "Статус закрыт";

  return "Неизвестный статус";
};

export const calculateTaskPosition = (task: GanttTask, days: Date[]) => {
  const startIndex = days.findIndex(
    (day) => day.getTime() >= task.start.getTime()
  );

  const rawEndIndex = days.findIndex(
    (day) => day.getTime() > task.end.getTime()
  );

  const endIndex = rawEndIndex === -1 ? days.length - 1 : rawEndIndex - 1;

  const start = startIndex === -1 ? 0 : startIndex;
  const end = Math.max(start, endIndex);

  return {
    start: start + 1,
    end: end + 1,
    visible: true,
  };
};
