export const getInitials = (name: string | null): string => {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map(p => p.charAt(0).toUpperCase()).join(".");
  return initials ? `${initials}.` : "";
};
export const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "Не указано";
  try {
    return new Date(dateStr).toLocaleDateString("ru-RU");
  } catch {
    return "Неверная дата";
  }
};