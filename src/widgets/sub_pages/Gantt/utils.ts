import { Task } from "./types";

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

export const calculateTaskPosition = (task: Task, days: Date[]) => {
  const startIndex = days.findIndex(
    (day) => day.getTime() >= task.start.getTime()
  );

  const endIndex =
    days.findIndex((day) => day.getTime() > task.end.getTime()) - 1;

  return {
    start: startIndex + 1,
    end: endIndex > 0 ? endIndex + 1 : days.length,
    visible: true,
  };
};
